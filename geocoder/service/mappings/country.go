package mappings

import (
	"encoding/json"
	"io/ioutil"
)

// Country the mapping of country codes
type Country struct {
	data map[string]string
}

// NewCountry new mapping instance
func NewCountry(filepath string) (*Country, error) {
	countryMap, err := readCountriesDataFile(filepath)
	if err != nil {
		return nil, err
	}
	return &Country{data: countryMap}, nil
}

func readCountriesDataFile(filepath string) (map[string]string, error) {
	file, err := ioutil.ReadFile(filepath)
	if err != nil {
		return nil, err
	}

	var stringMap map[string]string
	if err := json.Unmarshal(file, &stringMap); err != nil {
		return nil, err
	}

	return stringMap, nil
}

// GetNameFromCountryCode returns the ISO 3166-1 alpha-2 country name given country code
func (countries *Country) GetNameFromCountryCode(countryCode string) string {
	return countries.data[countryCode]
}
