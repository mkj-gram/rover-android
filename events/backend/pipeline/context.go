package pipeline

import (
	"context"
	"fmt"
)

type Context interface {
	context.Context
	Get(key string) interface{}
	Set(key string, value interface{})
}

type valueContext struct {
	context.Context
	values map[string]interface{}
}

func (c *valueContext) Get(key string) interface{} {
	val, ok := c.values[key]
	if !ok {
		return nil
	}
	return val
}

func (c *valueContext) Set(key string, value interface{}) {
	c.values[key] = value
}

func (c *valueContext) Value(key interface{}) interface{} {
	if k, ok := key.(string); ok && c.Get(k) != nil {
		return c.Get(k)
	}

	return c.Context.Value(key)
}

func (c *valueContext) String() string {
	return fmt.Sprintf("%v.WithValues(%v)", c.Context, c.values)
}

func NewContext(ctx context.Context) Context {
	return &valueContext{
		Context: ctx,
		values:  make(map[string]interface{}),
	}
}
