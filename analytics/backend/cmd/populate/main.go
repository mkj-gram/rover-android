package main

import (
	"flag"
	logger "log"
	"math/rand"
	"os"
	"time"

	"github.com/roverplatform/rover/analytics/backend/domain"
	"github.com/roverplatform/rover/analytics/backend/influx"
	"github.com/roverplatform/rover/analytics/backend/usecase"
)

var (
	global     = flag.NewFlagSet("global", flag.ExitOnError)
	influxDSN  = global.String("influx-dsn", "", "influx dsn")
	numRecords = global.Int("count", 100, "number of distinct records")
	accountID  = global.Int("account-id", 1, "account id associated with all new records ")
	campaignID = global.Int("campaign-id", 0, "campaign id associated with all new records")
)

var (
	log     = logger.New(os.Stdout, "", 0)
	letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
)

func main() {

	// populate opened-notifications -count 100 assumes making them in the last 30 days
	if len(os.Args) == 1 {
		log.Println("usage: influx-cli <command> [<args]")
		log.Println("The most commonly used commands are: ")
		log.Println("opened-notifications    populate sample notification opened events")
		log.Println("sent-notifications      populate sample notification sent events")
		return
	}

	if err := global.Parse(os.Args[2:]); err != nil {
		log.Fatal(err)
	}

	if *influxDSN == "" {
		global.PrintDefaults()
		os.Exit(2)
	}

	switch os.Args[1] {
	case "opened-notifications":
		runPopulateOpenedNotifications()
	case "sent-notifications":
		runPopulateSentNotifications()
	default:
		log.Printf("%q is not a valid command.\n", os.Args[1])
		os.Exit(2)
	}
}

func randomString(length int) string {
	b := make([]rune, length)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}

func randomSource() domain.NotificationOpenSource {
	switch rand.Int31n(2) {
	case 1:
		return domain.NotificationOpenSource_NOTIFICATION_CENTER
	default:
		return domain.NotificationOpenSource_PUSH
	}
}
func randomSubSource() domain.NotificationOpenSubSource {
	switch rand.Int31n(2) {
	case 1:
		return domain.NotificationOpenSubSource_DIRECT
	default:
		return domain.NotificationOpenSubSource_INFLUENCED
	}
}

func randomTime() time.Time {
	// returns a random time in the last 30 days
	max := time.Now().Unix()
	min := max - 60*60*24*30
	timestamp := rand.Int63n(max-min) + min
	return time.Unix(timestamp, 0).UTC()
}

func runPopulateOpenedNotifications() {
	var records = make([]*domain.NotificationOpenedRecord, *numRecords)
	for i := 0; i < *numRecords; i++ {
		var source = randomSource()
		var subsource domain.NotificationOpenSubSource
		if source == domain.NotificationOpenSource_PUSH {
			subsource = randomSubSource()
		} else {
			subsource = domain.NotificationOpenSubSource_NONE
		}
		records[i] = &domain.NotificationOpenedRecord{
			Timestamp:  randomTime(),
			AccountID:  *accountID,
			CampaignID: *campaignID,
			Source:     source,
			SubSource:  subsource,
			DeviceID:   randomString(20),
		}
	}

	client, err := influx.NewClient(*influxDSN)
	if err != nil {
		log.Fatal(err)
	}
	store := &influx.NotificationOpenedStore{Client: client}
	interactor := usecase.NotificationsInteractor{OpenedStore: store}
	if err := interactor.RecordOpened(records...); err != nil {
		log.Fatal(err)
	}
}

func randomChannel() domain.NotificationSentChannel {
	switch rand.Int31n(2) {
	case 1:
		return domain.NotificationSentChannel_NOTIFICATION_CENTER
	default:
		return domain.NotificationSentChannel_PUSH
	}
}

func randomSentResult() domain.NotificationSentResult {
	switch rand.Int31n(10) {
	case 1, 2, 3, 4, 5, 6:
		return domain.NotificationSentResult_DELIVERED
	case 7, 8:
		return domain.NotificationSentResult_UNREACHABLE
	default:
		return domain.NotificationSentResult_INVALID
	}
}

func runPopulateSentNotifications() {
	var records = make([]*domain.NotificationSentRecord, *numRecords*2)
	for i := 0; i < *numRecords*2; i += 2 {
		var (
			t        = randomTime()
			deviceId = randomString(20)
		)

		// record an notification-center event
		records[i] = &domain.NotificationSentRecord{
			Timestamp:  t,
			AccountID:  *accountID,
			CampaignID: *campaignID,
			Channel:    domain.NotificationSentChannel_NOTIFICATION_CENTER,
			Result:     domain.NotificationSentResult_DELIVERED,
			DeviceID:   deviceId,
		}
		// record a push event
		records[i+1] = &domain.NotificationSentRecord{
			Timestamp:  t,
			AccountID:  *accountID,
			CampaignID: *campaignID,
			Channel:    domain.NotificationSentChannel_PUSH,
			Result:     randomSentResult(),
			DeviceID:   deviceId,
		}
	}

	client, err := influx.NewClient(*influxDSN)
	if err != nil {
		log.Fatal(err)
	}
	store := &influx.NotificationSentStore{Client: client}
	interactor := usecase.NotificationsInteractor{SentStore: store}
	if err := interactor.RecordSent(records...); err != nil {
		log.Fatal(err)
	}
}
