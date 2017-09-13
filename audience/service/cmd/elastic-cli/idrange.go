package main

import (
	"flag"
	"fmt"
	"strconv"
	"strings"
)

var _ flag.Value = (*idRange)(nil)

type idRange struct {
	From, To int
}

func (r *idRange) String() string {
	if r.From == r.To {
		return fmt.Sprintf("%d", r.From)
	}
	return fmt.Sprintf("%d-%d", r.From, r.To)
}

func (r *idRange) Set(s string) error {
	parts := strings.Split(s, "-")
	if l := len(parts); l == 0 || l > 2 {
		return fmt.Errorf("invalid range: %s", s)
	}

	if len(parts) == 1 {
		parts = append(parts, parts[0])
	}

	var err error

	r.From, err = strconv.Atoi(parts[0])
	if err != nil {
		return fmt.Errorf("invalid from: %v", parts[0])
	}

	r.To, err = strconv.Atoi(parts[1])
	if err != nil {
		return fmt.Errorf("invalid from: %v", parts[1])
	}

	return nil
}

func (r *idRange) Blank() bool {
	return r.String() == "-"
}
