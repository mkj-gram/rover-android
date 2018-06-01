package tracker

import (
	"context"
	"fmt"
	"strconv"

	"github.com/pkg/errors"
	"github.com/roverplatform/rover/apis/go/event/v1"
	"github.com/roverplatform/rover/apis/go/protobuf/struct"
	"github.com/roverplatform/rover/events/backend/pipeline"
	"github.com/roverplatform/rover/events/backend/schema"
)

type SchemaRepository interface {
	FindLastByEvent(ctx context.Context, accountId int32, namespace, name string) (*schema.EventSchema, error)
	Create(ctx context.Context, eventSchema schema.EventSchema) (*schema.EventSchema, error)
	UpdateAttributeSchema(ctx context.Context, eventSchema schema.EventSchema, newSchema map[string]schema.Type) (*schema.EventSchema, error)
}

func NewTracker(db SchemaRepository) pipeline.Handler {
	return pipeline.HandlerFunc(func(ctx pipeline.Context, e *event.Event) error {

		var (
			accountId  = e.GetAuthContext().GetAccountId()
			namespace  = e.GetNamespace()
			name       = e.GetName()
			promLabels = []string{fmt.Sprintf("%d", accountId), namespace, name}
		)

		eventSchema, err := db.FindLastByEvent(ctx, accountId, namespace, name)
		// TODO check if err is retryable
		if err != nil && errors.Cause(err) != schema.ErrNotFound {
			return err
		}

		// We are assuming any other pipeline.Handler's cannot edit the attributes hash
		if eventSchema == nil {
			// generate one and save then compare
			newSchema, err := SchemaFromEventInput(e.GetAttributes())
			if err != nil {
				return err
			}

			createSchema := schema.EventSchema{
				AccountId:       accountId,
				Namespace:       namespace,
				Name:            name,
				AttributeSchema: newSchema,
				Version:         1,
			}

			metrics.schemaUpdatesTotal.WithLabelValues(promLabels...).Inc()

			eventSchema, err = db.Create(ctx, createSchema)
			if err != nil {
				metrics.schemaUpdatesErrorsTotal.WithLabelValues(promLabels...).Inc()
				if errors.Cause(err) == schema.ErrAlreadyExists {
					return pipeline.NewRetryableError(err)
				}
				return err
			}
		}

		// coerce the attributes with the current schema
		Coerce(e.GetAttributes(), eventSchema.AttributeSchema)
		//eventSchema current schema
		haveSchema, err := SchemaFromEventInput(e.GetAttributes())
		if err != nil {
			return errors.Wrap(err, "SchemaFromEventInput")
		}

		// check if the current schema supports
		ok, needsUpdate := Supports(eventSchema.AttributeSchema, haveSchema)
		// does not support means type miss-match
		if !ok {
			metrics.schemaMismatchTotal.WithLabelValues(promLabels...).Inc()
			return errors.New("current schema does not support input")
		}

		if needsUpdate {
			metrics.schemaUpdatesTotal.WithLabelValues(promLabels...).Inc()

			var newSchema = eventSchema.AttributeSchema.Merge(haveSchema)
			if savedSchema, err := db.UpdateAttributeSchema(ctx, *eventSchema, newSchema); err != nil {
				metrics.schemaUpdatesErrorsTotal.WithLabelValues(promLabels...).Inc()
				if errors.Cause(err) == schema.ErrAlreadyExists {
					return pipeline.NewRetryableError(errors.Wrap(err, "db.UpdateAttributeSchema"))
				}
				return errors.Wrap(err, "db.UpdateAttributeSchema")
			} else {
				eventSchema = savedSchema
			}
		}

		e.SchemaIdentifier = &event.Event_SchemaIdentifier{
			Id:      eventSchema.Id,
			Version: eventSchema.Version,
		}

		return nil
	})
}

func TypeOfValue(value *structpb.Value) (schema.Type, bool) {
	if value == nil {
		return schema.INVALID, true
	}

	switch v := value.GetKind().(type) {
	case *structpb.Value_NullValue:
		return schema.INVALID, false
	case *structpb.Value_NumberValue:
		return schema.NUMBER, true
	case *structpb.Value_StringValue:
		return schema.STRING, true
	case *structpb.Value_BoolValue:
		return schema.BOOLEAN, true
	case *structpb.Value_StructValue:
		var complex = schema.ComplexType{}
		for name, svalue := range v.StructValue.GetFields() {
			if sv, ok := TypeOfValue(svalue); ok {
				complex[name] = sv
			} else {
				return schema.INVALID, false // this isn't valid
			}
		}
		return complex, true
	case *structpb.Value_ListValue:
		if len(v.ListValue.GetValues()) == 0 {
			// empty array just return unknown
			return schema.INVALID, true
		}
		// compute all the types if they are the same we good if not kaboom
		var eleType, ok = TypeOfValue(v.ListValue.GetValues()[0])
		if !ok || !schema.IsScalarType(eleType) {
			return schema.INVALID, false
		}
		for _, element := range v.ListValue.GetValues() {
			if nextType, ok := TypeOfValue(element); !ok || nextType != eleType {
				return schema.INVALID, false
			}
		}
		if !schema.IsScalarType(eleType) {
			return schema.INVALID, false
		}
		return schema.ArrayType{Type: schema.ScalarFromType(eleType)}, true
	default:
		// default to invalid
		return schema.INVALID, false
	}
}

func SchemaFromEventInput(attributes *structpb.Struct) (schema.AttributeSchema, error) {
	var s = schema.AttributeSchema{}

	for name, value := range attributes.GetFields() {
		if t, ok := TypeOfValue(value); ok {
			s[name] = t
		} else {
			return nil, errors.Errorf("invalid type for %q[%v]", name, value)
		}
	}

	return s, nil
}

func NeedsUpdating(diff schema.M) bool {
	for _, o := range diff {
		switch d := o.(type) {
		case schema.Diff:
			if d.Was == schema.INVALID && d.Now != schema.INVALID {
				return true
			}
		case schema.M:
			if NeedsUpdating(d) {
				return true
			}
		default:
			return false
		}
	}

	return false
}

// Determines if schema1 can support schema2 and if it does support it does it need updating
func Supports(schema1 schema.AttributeSchema, schema2 schema.AttributeSchema) (bool, bool) {

	for name, type1 := range schema1 {
		if type2, ok := schema2[name]; ok && !type1.Supports(type2) {
			return false, false
		}
	}

	return true, NeedsUpdating(schema1.Diff(schema2))
}

// Coerce the attributes into the schema type if possible
func Coerce(attributes *structpb.Struct, s schema.AttributeSchema) {
	for name, value := range attributes.GetFields() {
		if value == nil {
			continue
		}

		if stype, ok := s[name]; ok {
			switch v := value.Kind.(type) {
			case *structpb.Value_NullValue:
				continue
			case *structpb.Value_NumberValue:
				if schema.IsScalarType(stype) {
					if converted := coerceNumber(v, schema.ScalarFromType(stype)); converted != nil {
						attributes.GetFields()[name] = converted
					}
				} else if schema.IsArrayType(stype) {
					if converted := coerceNumber(v, schema.ArrayFromType(stype).Type); converted != nil {
						attributes.GetFields()[name] = structpb.ListVal(converted)
					}
				}

			case *structpb.Value_StringValue:
				if schema.IsScalarType(stype) {
					if converted := coerceString(v, schema.ScalarFromType(stype)); converted != nil {
						attributes.GetFields()[name] = converted
					}
				} else if schema.IsArrayType(stype) {
					if converted := coerceString(v, schema.ArrayFromType(stype).Type); converted != nil {
						attributes.GetFields()[name] = structpb.ListVal(converted)
					}
				}

			case *structpb.Value_BoolValue:
				if schema.IsScalarType(stype) {
					if converted := coerceBool(v, schema.ScalarFromType(stype)); converted != nil {
						attributes.GetFields()[name] = converted
					}
				} else if schema.IsArrayType(stype) {
					if converted := coerceBool(v, schema.ArrayFromType(stype).Type); converted != nil {
						attributes.GetFields()[name] = structpb.ListVal(converted)
					}
				}
			case *structpb.Value_StructValue:
				// other type must be complex
				if schema.IsComplexType(stype) {
					// recurse on the attributes
					Coerce(v.StructValue, schema.ComplexFromType(stype))
				}
			}
		}
	}
}

func coerceString(s *structpb.Value_StringValue, t schema.ScalarType) *structpb.Value {
	var val = s.StringValue
	switch t {
	case schema.BOOLEAN:
		switch val {
		case "1", "yes", "true":
			return structpb.Bool(true)
		case "0", "no", "false":
			return structpb.Bool(false)
		}
	case schema.NUMBER:
		if v, err := strconv.ParseFloat(val, 64); err == nil {
			return structpb.Number(v)
		}
	case schema.STRING:
		return structpb.String(val)
	}

	return nil
}

func coerceNumber(n *structpb.Value_NumberValue, t schema.ScalarType) *structpb.Value {
	var val = n.NumberValue
	switch t {
	case schema.STRING:
		return structpb.String(strconv.FormatFloat(val, 'f', -1, 64))
	case schema.BOOLEAN:
		if val == 1.0 {
			return structpb.Bool(true)
		} else if val == 0.0 {
			return structpb.Bool(false)
		}
	case schema.NUMBER:
		return structpb.Number(val)
	}
	return nil
}

func coerceBool(n *structpb.Value_BoolValue, t schema.ScalarType) *structpb.Value {
	var val = n.BoolValue
	switch t {
	case schema.STRING:
		switch val {
		case true:
			return structpb.String("true")
		case false:
			return structpb.String("false")
		}
	case schema.BOOLEAN:
		return structpb.Bool(val)
	case schema.NUMBER:
		switch val {
		case true:
			return structpb.Number(1)
		case false:
			return structpb.Number(0)
		}
	}
	return nil
}
