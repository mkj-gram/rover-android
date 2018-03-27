package zoneinfo

import "time"

var (
	// UniqueOffsets is a list of most common time
	// zone offsets around the globe
	UniqueOffsets = []int{
		-43200, -39600, -36000, -34200, -32400, -28800, -25200, -21600, -18000, -14400, -12600, -10800, -9000, -7200, -3600,
		0,
		3600, 7200, 10800, 12600, 14400, 16200, 18000, 19800, 20700, 21600, 23400, 25200, 28800, 30600, 31500, 32400, 34200, 36000, 37800, 39600, 43200, 45900, 46800, 49500, 50400,
	}
)

// Takes in a utc offset in seconds and returns all iana timezones which currently have the same offset
func GetZones(offset int) []string {
	var zones = []string{}

	now := time.Now()

	for _, zone := range tzZones {
		loc, err := time.LoadLocation(zone)
		if err != nil {
			// err occurs when the zone is not valid. ie if a zone from the generated file is no longer in use anymore
			// with the up to date tz db packaged with go / os.
			// continue and keep building the list of zones that match
			continue
		}

		_, utcOffset := now.In(loc).Zone()

		if offset == utcOffset {
			zones = append(zones, zone)
		}
	}

	return zones
}
