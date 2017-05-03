package context

import "golang.org/x/net/context"

// it's recommented to have separate type for context keys
// https://golang.org/pkg/context/#WithValue
type contextKey string

const userPasswordDigestContextKey = contextKey("user.password_digest")

// ContextUserPasswordDigest extracts password_digest from provided context
// the value is set in CreateUser for example
func UserPasswordDigest(ctx context.Context) ([]byte, bool) {
	var v = ctx.Value(userPasswordDigestContextKey)
	if v == nil {
		return nil, false
	}

	return v.([]byte), true
}

// ContextUserPasswordDigest extracts password_digest from provided context
// the value is set in CreateUser for example
func WithUserPasswordDigest(ctx context.Context, password_digest []byte) context.Context {
	return context.WithValue(ctx, userPasswordDigestContextKey, password_digest)
}
