package mockdata

import (
	"math/rand"
	"time"
)

func RandomAppVersion() string {
	return "build-111"
}

func RandomAppBuild() string {
	return "83n81"
}

var manufacturers = []string{"Samsung", "Google", "Apple", "Bob"}

func RandomManufacturer() string {
	rand.Seed(time.Now().Unix())
	return manufacturers[rand.Intn(len(manufacturers))]
}

var models = []string{"iPhone7,2", "iPhone8,1", "Galaxy 8", "Macbook Pro"}

func RandomDeviceModel() string {
	rand.Seed(time.Now().Unix())
	return models[rand.Intn(len(models))]
}
