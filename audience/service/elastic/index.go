package elastic

import (
	"encoding/json"
	"fmt"
	"io"
	"strconv"

	audience "github.com/roverplatform/rover/apis/go/audience/v1"

	"github.com/pkg/errors"
	"golang.org/x/net/context"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	elastic "gopkg.in/olivere/elastic.v5"
)

// DefaultPageSize sets the size of a page by default
// https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-from-size.html
var DefaultPageSize = 10

type (
	Index struct {
		Client    *elastic.Client
		IndexName func(string) string
	}
)

func (q *Index) GetDeviceTotalCount(ctx context.Context, accountId int) (int64, error) {
	var (
		indexName = q.IndexName(strconv.Itoa(int(accountId)))
		Q         = q.Client.Count(indexName).Type("device")
	)

	count, err := Q.Do(ctx)
	if err != nil {
		return 0, errors.Wrap(err, "Count")
	}

	return count, nil
}

func (q *Index) GetProfileTotalCount(ctx context.Context, accountId int) (int64, error) {
	var (
		indexName = q.IndexName(strconv.Itoa(int(accountId)))
		Q         = q.Client.Count(indexName).Type("profile")
	)

	count, err := Q.Do(ctx)
	if err != nil {
		return 0, errors.Wrap(err, "Count")
	}

	return count, nil
}

func (q *Index) Query(ctx context.Context, r *audience.QueryRequest) (*audience.QueryResponse, error) {
	var (
		indexName = q.IndexName(strconv.Itoa(int(r.GetAuthContext().GetAccountId())))
	)

	rq, err := DeviceAndProfilePredicateAggregateToQuery(r.GetPredicateAggregate(), r.GetTimeZoneOffset())
	if err != nil {
		return nil, errors.Wrap(err, "ToQuery")
	}

	var (
		query, present = rq["query"].(M)
		doer           interface {
			Do(context.Context) (*elastic.SearchResult, error)
		}
	)

	if !present {
		panic("no query defined")
	}

	switch typ := r.GetIterator().(type) {
	case nil:
		return nil, errors.Wrap(InvalidArgument, "GetIterator: nil iterator")
	case *audience.QueryRequest_ScrollIterator_:
		var (
			scroller = typ.ScrollIterator
			scroll   = q.Client.Scroll(indexName).Type("device")
		)

		switch op := scroller.GetOperation().(type) {

		case *audience.QueryRequest_ScrollIterator_Clear_:
			scroll = scroll.ScrollId(op.Clear.GetScrollId())
			if err := scroll.Clear(ctx); err != nil {
				return nil, errors.Wrap(err, "scroll.Clear")
			}
			return &audience.QueryResponse{}, nil

		case *audience.QueryRequest_ScrollIterator_StartParallelScroll_:
			var (
				ps = op.StartParallelScroll

				sliceQ = elastic.NewSliceQuery().
					Id(int(ps.StreamId)).
					Max(int(ps.MaxStreams))
			)

			doer = scroll.
				Slice(sliceQ).
				Size(int(ps.BatchSize)).
				Query(source(query))

		case *audience.QueryRequest_ScrollIterator_StartScroll_:
			doer = scroll.
				Query(source(query)).
				Size(int(op.StartScroll.GetBatchSize()))

		case *audience.QueryRequest_ScrollIterator_Next_:
			doer = scroll.ScrollId(op.Next.GetScrollId())
		default:
			return nil, errors.Wrapf(InvalidArgument, "GetIterator: %T", op)
		}

	case *audience.QueryRequest_PageIterator_:
		var (
			search = q.Client.Search(indexName).Type("device")
			pager  = typ.PageIterator
		)

		doer = search.Query(source(query))

		var (
			size = pager.GetSize()
			page = pager.GetPage()
		)

		if size > 0 {
			search = search.Size(int(size))
		} else {
			size = int32(DefaultPageSize)
		}
		if page > 0 {
			search = search.From(int(page * size))
		}

	default:
		return nil, status.Errorf(codes.InvalidArgument, "unknown iterator type: %T", typ)
	}

	resp, err := doer.Do(ctx)
	if err == io.EOF {
		return &audience.QueryResponse{}, nil
	}
	if err != nil {
		return nil, errors.Wrap(err, "Search")
	}

	res, err := MapResponse(resp)
	return res, errors.Wrap(err, "MapResponse")
}

// GetFieldSuggestion takes a StringPredicate term and returns a list of suggested StringValues
func (q *Index) GetFieldSuggestion(ctx context.Context, r *audience.GetFieldSuggestionRequest) (*audience.GetFieldSuggestionResponse, error) {
	var (
		indexName = q.IndexName(strconv.Itoa(int(r.GetAuthContext().GetAccountId())))
		selector  string
		field     string
	)

	switch r.GetSelector() {
	// Custom profiles need a nested "attributes" field for ES Query
	case audience.GetFieldSuggestionRequest_CUSTOM_PROFILE:
		field = fmt.Sprintf("attributes.%s", r.GetField())
		selector = "profile"
	case audience.GetFieldSuggestionRequest_ROVER_PROFILE:
		field = r.GetField()
		selector = "profile"
	case audience.GetFieldSuggestionRequest_DEVICE:
		field = r.GetField()
		selector = "device"
	default:
		panic("Selector was not of type GetFieldSuggestionRequest_Selector")
	}

	var search = q.Client.Search(indexName).Type(selector).Size(0).Aggregation(selector, source(termAggregate(field, r.GetSize())))

	resp, err := search.Do(ctx)
	if err == io.EOF {
		return &audience.GetFieldSuggestionResponse{}, nil
	}
	if err != nil {
		return nil, errors.Wrap(err, "Suggestions")
	}

	buckets, found := resp.Aggregations.Terms(selector)
	if !found {
		return &audience.GetFieldSuggestionResponse{}, nil
	}

	res := MapFieldAggregateResponse(buckets)
	return res, nil
}

// MapFieldAggregateResponse maps AggregationBucketKeyItems to GetFieldSuggestionResponse
func MapFieldAggregateResponse(res *elastic.AggregationBucketKeyItems) *audience.GetFieldSuggestionResponse {

	var arr []string
	for _, val := range res.Buckets {
		if str, ok := val.Key.(string); ok {
			arr = append(arr, str)
		}
	}

	return &audience.GetFieldSuggestionResponse{
		Suggestions: arr,
	}
}

func termAggregate(f string, s int64) M {
	return M{
		"terms": M{
			"field": f,
			"size":  s,
		},
	}
}

func UnmarshalDevice(data []byte, proto *audience.Device) error {
	var d Device
	if err := json.Unmarshal(data, &d); err != nil {
		return errors.Wrap(err, "json.Unmarshal")
	}

	if err := d.toProto(proto); err != nil {
		return errors.Wrap(err, "toProto")
	}

	return nil
}

func UnmarshalProfile(data []byte, proto *audience.Profile) error {
	var p Profile
	if err := json.Unmarshal(data, &p); err != nil {
		return errors.Wrap(err, "json.Unmarshal")
	}
	if err := p.toProto(proto); err != nil {
		return errors.Wrap(err, "toProto")
	}
	return nil
}

func MapResponse(res *elastic.SearchResult) (*audience.QueryResponse, error) {
	var (
		devices  []*audience.Device
		profiles []*audience.Profile

		// Use empty structs instead of bools to save on memory space
		profileAdded = make(map[string]struct{})
	)

	for _, dhit := range res.Hits.Hits {
		if dhit.Source == nil {
			continue
		}

		var protoDevice audience.Device
		if err := UnmarshalDevice(*dhit.Source, &protoDevice); err != nil {
			panic(err)
			continue
		}

		devices = append(devices, &protoDevice)

		if phit, ok := dhit.InnerHits["profile"]; ok {
			for _, phit := range phit.Hits.Hits {
				if phit.Source == nil {
					continue
				}

				var protoProfile audience.Profile
				if err := UnmarshalProfile(*phit.Source, &protoProfile); err != nil {
					panic(err)
				}

				if _, ok := profileAdded[protoProfile.Id]; !ok {
					profiles = append(profiles, &protoProfile)
					profileAdded[protoProfile.Id] = struct{}{}
				}

			}
		}
	}

	return &audience.QueryResponse{
		Devices:   devices,
		Profiles:  profiles,
		TotalSize: res.Hits.TotalHits,
		ScrollId:  res.ScrollId,
	}, nil
}

// source is a utility type to that implements elastic.Query interface
type source M

func (s source) Source() (interface{}, error) {
	if s == nil {
		return nil, nil
	}
	return M(s), nil
}
