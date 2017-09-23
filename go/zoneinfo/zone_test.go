package zoneinfo_test

import (
	"github.com/go-test/deep"
	"github.com/roverplatform/rover/go/zoneinfo"
	"strings"
	"testing"
)

func TestGetZones(t *testing.T) {
	tcases := []struct {
		name   string
		offset int
		exp    []string
	}{
		{
			name:   "returns all utc timezones at offset 0",
			offset: 0,
			exp: []string{
				"Africa/Abidjan",
				"Africa/Accra",
				"Africa/Bamako",
				"Africa/Banjul",
				"Africa/Bissau",
				"Africa/Conakry",
				"Africa/Dakar",
				"Africa/Freetown",
				"Africa/Lome",
				"Africa/Monrovia",
				"Africa/Nouakchott",
				"Africa/Ouagadougou",
				"Africa/Sao_Tome",
				"Africa/Timbuktu",
				"America/Danmarkshavn",
				"America/Scoresbysund",
				"Atlantic/Azores",
				"Atlantic/Reykjavik",
				"Atlantic/St_Helena",
				"Etc/GMT",
				"Etc/GMT+0",
				"Etc/GMT-0",
				"Etc/GMT0",
				"Etc/Greenwich",
				"Etc/UCT",
				"Etc/Universal",
				"Etc/UTC",
				"Etc/Zulu",
				"GMT",
				"GMT+0",
				"GMT-0",
				"GMT0",
				"Greenwich",
				"Iceland",
				"UCT",
				"Universal",
				"UTC",
				"Zulu",
			},
		},
		{
			name:   "returns empty array when no timezone exists",
			offset: -1,
			exp:    []string{},
		},
	}

	for _, tc := range tcases {

		got := zoneinfo.GetZones(tc.offset)

		if diff := deep.Equal(tc.exp, got); diff != nil {
			t.Fatal("\nDiff:", strings.Join(diff, "\n"))
		}
	}
}
