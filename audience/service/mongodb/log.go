package mongodb

import "github.com/roverplatform/rover/go/log"

var Log = log.NewLog(log.Error, log.WithOutputLevel(3))

func errorf(fmt string, args ...interface{}) {
	Log.Errorf(fmt, args...)
}

func debugf(fmt string, args ...interface{}) {
	Log.Debugf(fmt, args...)
}

func infof(fmt string, args ...interface{}) {
	Log.Infof(fmt, args...)
}
