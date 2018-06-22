package tracker

import (
	"context"
	"fmt"

	"github.com/karlseguin/ccache"

	"github.com/roverplatform/rover/events/backend/schema"
)

type schemaCache struct {
	repository SchemaRepository
	cache      *ccache.Cache
}

func newSchemaCache(repository SchemaRepository, size int) *schemaCache {
	return &schemaCache{
		repository: repository,
		cache:      ccache.New(ccache.Configure().MaxSize(int64(size)).ItemsToPrune(10)),
	}
}

func cacheKey(accountId int32, namespace, name string) string {
	return fmt.Sprintf("%d:%s:%s", accountId, namespace, name)
}

func (s *schemaCache) FindLastByEvent(ctx context.Context, accountId int32, namespace, name string) (*schema.EventSchema, error) {
	var key = cacheKey(accountId, namespace, name)
	item := s.cache.Get(key)
	if item != nil {
		return item.Value().(*schema.EventSchema), nil
	}

	eventSchema, err := s.repository.FindLastByEvent(ctx, accountId, namespace, name)
	if err != nil {
		return nil, err
	}

	s.cache.Set(key, eventSchema, 0)
	return eventSchema, nil
}

func (s *schemaCache) Create(ctx context.Context, eventSchema schema.EventSchema) (*schema.EventSchema, error) {
	var key = cacheKey(eventSchema.AccountId, eventSchema.Namespace, eventSchema.Name)
	s.cache.Delete(key)

	return s.repository.Create(ctx, eventSchema)
}

func (s *schemaCache) UpdateAttributeSchema(ctx context.Context, eventSchema schema.EventSchema, newSchema map[string]schema.Type) (*schema.EventSchema, error) {
	var key = cacheKey(eventSchema.AccountId, eventSchema.Namespace, eventSchema.Name)
	s.cache.Delete(key)

	return s.repository.UpdateAttributeSchema(ctx, eventSchema, newSchema)
}
