package cache

import "github.com/go-redis/redis"

type Store struct {
	Client *redis.Client
}
