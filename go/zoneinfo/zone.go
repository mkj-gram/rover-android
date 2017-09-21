package zoneinfo

import "time"

// Takes in a utc offset in seconds and returns all iana timezones which currently have the same offset
func GetZones(offset int) (zones []string) {

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
