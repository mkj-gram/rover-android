package usecase_test

import (
	"testing"
	"time"

	"github.com/golang/mock/gomock"

	"github.com/roverplatform/rover/analytics/backend/domain"
	"github.com/roverplatform/rover/analytics/backend/usecase"
	"github.com/roverplatform/rover/analytics/backend/usecase/mocks"
	rtesting "github.com/roverplatform/rover/go/testing"
)

func TestNotificationsInteractor_RecordSent(t *testing.T) {

	var now = time.Now()

	var tests = []struct {
		name    string
		records []*domain.NotificationSentRecord

		exp      error
		storeExp func(s *mocks.MockNotificationSentStore)
	}{
		{
			name: "missing account id",
			records: []*domain.NotificationSentRecord{{
				Timestamp:  now,
				AccountID:  0,
				CampaignID: 1,
				Channel:    domain.NotificationSentChannel_PUSH,
				Result:     domain.NotificationSentResult_DELIVERED,
				DeviceID:   "abc",
			}},
			exp: domain.NewInvalidError("AccountID", "is required"),
		},
		{
			name: "missing campaign id",
			records: []*domain.NotificationSentRecord{{
				Timestamp:  now,
				AccountID:  1,
				CampaignID: 0,
				Channel:    domain.NotificationSentChannel_PUSH,
				Result:     domain.NotificationSentResult_DELIVERED,
				DeviceID:   "abc",
			}},
			exp: domain.NewInvalidError("CampaignID", "is required"),
		},
		{
			name: "missing device id",
			records: []*domain.NotificationSentRecord{{
				Timestamp:  now,
				AccountID:  1,
				CampaignID: 1,
				Channel:    domain.NotificationSentChannel_PUSH,
				Result:     domain.NotificationSentResult_DELIVERED,
				DeviceID:   "",
			}},
			exp: domain.NewInvalidError("DeviceID", "is required"),
		},
		{
			name: "stores the records",
			records: []*domain.NotificationSentRecord{{
				Timestamp:  now,
				AccountID:  1,
				CampaignID: 1,
				Channel:    domain.NotificationSentChannel_PUSH,
				Result:     domain.NotificationSentResult_DELIVERED,
				DeviceID:   "ABC",
			}},
			storeExp: func(s *mocks.MockNotificationSentStore) {
				s.EXPECT().
					Create([]*domain.NotificationSentRecord{{
						Timestamp:  now,
						AccountID:  1,
						CampaignID: 1,
						Channel:    domain.NotificationSentChannel_PUSH,
						Result:     domain.NotificationSentResult_DELIVERED,
						DeviceID:   "ABC",
					}}).Return(nil)
			},
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			var (
				ctrl  = gomock.NewController(t)
				store = mocks.NewMockNotificationSentStore(ctrl)
				inter = &usecase.NotificationsInteractor{SentStore: store}
			)
			defer ctrl.Finish()

			if test.storeExp != nil {
				test.storeExp(store)
			}

			var got = inter.RecordSent(test.records...)

			if diff := rtesting.Diff(nil, nil, test.exp, got); diff != nil {
				t.Fatalf("\n%s\n", rtesting.Difff(diff))
			}
		})
	}
}

func TestNotificationsInteractor_RecordOpened(t *testing.T) {
	var now = time.Now()

	var tests = []struct {
		name    string
		records []*domain.NotificationOpenedRecord

		exp      error
		storeExp func(s *mocks.MockNotificationOpenedStore)
	}{
		{
			name: "missing account id",
			records: []*domain.NotificationOpenedRecord{{
				Timestamp:  now,
				AccountID:  0,
				CampaignID: 1,
				Source:     domain.NotificationOpenSource_PUSH,
				SubSource:  domain.NotificationOpenSubSource_DIRECT,
				DeviceID:   "abc",
			}},
			exp: domain.NewInvalidError("AccountID", "is required"),
		},
		{
			name: "missing campaign id",
			records: []*domain.NotificationOpenedRecord{{
				Timestamp:  now,
				AccountID:  1,
				CampaignID: 0,
				Source:     domain.NotificationOpenSource_PUSH,
				SubSource:  domain.NotificationOpenSubSource_DIRECT,
				DeviceID:   "abc",
			}},
			exp: domain.NewInvalidError("CampaignID", "is required"),
		},
		{
			name: "missing device id",
			records: []*domain.NotificationOpenedRecord{{
				Timestamp:  now,
				AccountID:  1,
				CampaignID: 1,
				Source:     domain.NotificationOpenSource_PUSH,
				SubSource:  domain.NotificationOpenSubSource_DIRECT,
				DeviceID:   "",
			}},
			exp: domain.NewInvalidError("DeviceID", "is required"),
		},
		{
			name: "stores the records",
			records: []*domain.NotificationOpenedRecord{{
				Timestamp:  now,
				AccountID:  1,
				CampaignID: 1,
				Source:     domain.NotificationOpenSource_PUSH,
				SubSource:  domain.NotificationOpenSubSource_DIRECT,
				DeviceID:   "ABC",
			}},
			storeExp: func(s *mocks.MockNotificationOpenedStore) {
				s.EXPECT().
					Create([]*domain.NotificationOpenedRecord{{
						Timestamp:  now,
						AccountID:  1,
						CampaignID: 1,
						Source:     domain.NotificationOpenSource_PUSH,
						SubSource:  domain.NotificationOpenSubSource_DIRECT,
						DeviceID:   "ABC",
					}}).Return(nil)
			},
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			var (
				ctrl  = gomock.NewController(t)
				store = mocks.NewMockNotificationOpenedStore(ctrl)
				inter = &usecase.NotificationsInteractor{OpenedStore: store}
			)
			defer ctrl.Finish()

			if test.storeExp != nil {
				test.storeExp(store)
			}

			var got = inter.RecordOpened(test.records...)

			if diff := rtesting.Diff(nil, nil, test.exp, got); diff != nil {
				t.Fatalf("\n%s\n", rtesting.Difff(diff))
			}
		})
	}
}

func TestNotificationsInteractor_GetOpenedReport(t *testing.T) {
	type request struct {
		AccountID  int
		CampaignID int
	}
	var tests = []struct {
		name    string
		request request

		exp      *domain.NotificationOpenedReport
		storeExp func(s *mocks.MockNotificationOpenedStore)

		expErr error
	}{
		{
			name: "account id is required",
			request: request{
				AccountID:  0,
				CampaignID: 1,
			},
			expErr: domain.NewInvalidError("accountID", "is required"),
		},
		{
			name: "campaign id is required",
			request: request{
				AccountID:  1,
				CampaignID: 0,
			},
			expErr: domain.NewInvalidError("campaignID", "is required"),
		},
		{
			name: "returns not found when no data points exist yet",
			request: request{
				AccountID:  1,
				CampaignID: 1,
			},
			storeExp: func(s *mocks.MockNotificationOpenedStore) {
				s.EXPECT().GetReport(1, 1).Return(nil, domain.ErrNotFound)
			},
			expErr: domain.ErrNotFound,
		},
		{
			name: "returns report",
			request: request{
				AccountID:  1,
				CampaignID: 1,
			},
			storeExp: func(s *mocks.MockNotificationOpenedStore) {
				s.EXPECT().GetReport(1, 1).Return(&domain.NotificationOpenedReport{
					Total:  10,
					Unique: 8,

					NotificationCenterTotal:  6,
					NotificationCenterUnique: 6,

					PushDirectTotal:  1,
					PushDirectUnique: 1,

					PushInfluencedTotal:  5,
					PushInfluencedUnique: 3,
				}, nil)
			},
			exp: &domain.NotificationOpenedReport{
				Total:  10,
				Unique: 8,

				NotificationCenterTotal:  6,
				NotificationCenterUnique: 6,

				PushDirectTotal:  1,
				PushDirectUnique: 1,

				PushInfluencedTotal:  5,
				PushInfluencedUnique: 3,
			},
		},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			var (
				ctrl  = gomock.NewController(t)
				store = mocks.NewMockNotificationOpenedStore(ctrl)
				inter = &usecase.NotificationsInteractor{OpenedStore: store}
			)
			defer ctrl.Finish()

			if test.storeExp != nil {
				test.storeExp(store)
			}

			var got, gotErr = inter.GetOpenedReport(test.request.AccountID, test.request.CampaignID)

			if diff := rtesting.Diff(test.exp, got, test.expErr, gotErr); diff != nil {
				t.Fatalf("\n%s\n", rtesting.Difff(diff))
			}
		})
	}
}

func TestNotificationsInteractor_GetOpenedReportByDate(t *testing.T) {
	type request struct {
		AccountID  int
		CampaignID int
		From       time.Time
		To         time.Time
	}

	var tests = []struct {
		name    string
		request request

		exp      *domain.NotificationOpenedByDateReport
		storeExp func(s *mocks.MockNotificationOpenedStore)

		expErr error
	}{
		{
			name: "account id is required",
			request: request{
				AccountID:  0,
				CampaignID: 1,
			},
			expErr: domain.NewInvalidError("accountID", "is required"),
		},
		{
			name: "campaign id is required",
			request: request{
				AccountID:  1,
				CampaignID: 0,
			},
			expErr: domain.NewInvalidError("campaignID", "is required"),
		},
		{
			name: "from is required",
			request: request{
				AccountID:  1,
				CampaignID: 0,
				To:         time.Now(),
			},
			expErr: domain.NewInvalidError("campaignID", "is required"),
		},
		{
			name: "to is required",
			request: request{
				AccountID:  1,
				CampaignID: 0,
				From:       time.Now(),
			},
			expErr: domain.NewInvalidError("campaignID", "is required"),
		},
		{
			name: "from is after to",
			request: request{
				AccountID:  1,
				CampaignID: 1,
				From:       timestamp(t, "2018-06-22T00:00:00Z"),
				To:         timestamp(t, "2018-06-21T00:00:00Z"),
			},
			expErr: domain.NewInvalidError("from", "cannot be after to"),
		},
		{
			name: "cannot query more than 31 days",
			request: request{
				AccountID:  1,
				CampaignID: 1,
				From:       timestamp(t, "2018-06-01T00:00:00Z"),
				To:         timestamp(t, "2018-07-02T00:00:01Z"),
			},
			expErr: domain.NewInvalidError("from", "can only query a 31 day range"),
		},
		{
			name: "returns not found when no data points exist yet",
			request: request{
				AccountID:  1,
				CampaignID: 1,
				From:       timestamp(t, "2018-06-21T15:21:17Z"),
				To:         timestamp(t, "2018-06-21T15:21:17Z"),
			},
			storeExp: func(s *mocks.MockNotificationOpenedStore) {
				s.EXPECT().
					GetReportByDate(1, 1, timestamp(t, "2018-06-21T15:21:17Z"), timestamp(t, "2018-06-21T15:21:17Z")).
					Return(nil, domain.ErrNotFound)
			},
			expErr: domain.ErrNotFound,
		},
		{
			name: "returns the report",
			request: request{
				AccountID:  1,
				CampaignID: 1,
				From:       timestamp(t, "2018-06-21T00:00:00Z"),
				To:         timestamp(t, "2018-06-22T00:00:00Z"),
			},
			storeExp: func(s *mocks.MockNotificationOpenedStore) {
				s.EXPECT().
					GetReportByDate(1, 1, timestamp(t, "2018-06-21T00:00:00Z"), timestamp(t, "2018-06-22T00:00:00Z")).
					Return(&domain.NotificationOpenedByDateReport{
						Reports: map[domain.Date]struct {
							NotificationCenter int
							PushDirect         int
							PushInfluenced     int
						}{
							"2018-01-01": {
								NotificationCenter: 1,
								PushDirect:         1,
								PushInfluenced:     1,
							},
							"2018-01-02": {
								NotificationCenter: 10,
								PushDirect:         23,
								PushInfluenced:     44,
							},
						},
					}, nil)
			},
			exp: &domain.NotificationOpenedByDateReport{
				Reports: map[domain.Date]struct {
					NotificationCenter int
					PushDirect         int
					PushInfluenced     int
				}{
					"2018-01-01": {
						NotificationCenter: 1,
						PushDirect:         1,
						PushInfluenced:     1,
					},
					"2018-01-02": {
						NotificationCenter: 10,
						PushDirect:         23,
						PushInfluenced:     44,
					},
				},
			},
		},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			var (
				ctrl  = gomock.NewController(t)
				store = mocks.NewMockNotificationOpenedStore(ctrl)
				inter = &usecase.NotificationsInteractor{OpenedStore: store}
			)
			defer ctrl.Finish()

			if test.storeExp != nil {
				test.storeExp(store)
			}

			var got, gotErr = inter.GetOpenedReportByDate(test.request.AccountID, test.request.CampaignID, test.request.From, test.request.To)

			if diff := rtesting.Diff(test.exp, got, test.expErr, gotErr); diff != nil {
				t.Fatalf("\n%s\n", rtesting.Difff(diff))
			}
		})
	}
}

func TestNotificationsInteractor_GetSentReport(t *testing.T) {
	type request struct {
		AccountID  int
		CampaignID int
	}
	var tests = []struct {
		name    string
		request request

		exp      *domain.NotificationSentReport
		storeExp func(s *mocks.MockNotificationSentStore)

		expErr error
	}{
		{
			name: "account id is required",
			request: request{
				AccountID:  0,
				CampaignID: 1,
			},

			expErr: domain.NewInvalidError("accountID", "is required"),
		},
		{
			name: "campaign id is required",
			request: request{
				AccountID:  1,
				CampaignID: 0,
			},

			expErr: domain.NewInvalidError("campaignID", "is required"),
		},
		{
			name: "returns not found when no data points exist yet",
			request: request{
				AccountID:  1,
				CampaignID: 1,
			},

			storeExp: func(s *mocks.MockNotificationSentStore) {
				s.EXPECT().GetReport(1, 1).Return(nil, domain.ErrNotFound)
			},
			expErr: domain.ErrNotFound,
		},
		{
			name: "returns report",
			request: request{
				AccountID:  1,
				CampaignID: 1,
			},

			storeExp: func(s *mocks.MockNotificationSentStore) {
				s.EXPECT().GetReport(1, 1).
					Return(&domain.NotificationSentReport{
						TotalDelivered:  832,
						UniqueDelivered: 800,

						NotificationCenterAttempted:   832,
						NotificationCenterDelivered:   832,
						NotificationCenterUnreachable: 0,
						NotificationCenterInvalid:     0,

						PushAttempted:   453,
						PushDelivered:   422,
						PushUnreachable: 30,
						PushInvalid:     1,
					}, nil)
			},
			exp: &domain.NotificationSentReport{
				TotalDelivered:  832,
				UniqueDelivered: 800,

				NotificationCenterAttempted:   832,
				NotificationCenterDelivered:   832,
				NotificationCenterUnreachable: 0,
				NotificationCenterInvalid:     0,

				PushAttempted:   453,
				PushDelivered:   422,
				PushUnreachable: 30,
				PushInvalid:     1,
			},
		},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			var (
				ctrl  = gomock.NewController(t)
				store = mocks.NewMockNotificationSentStore(ctrl)
				inter = &usecase.NotificationsInteractor{SentStore: store}
			)
			defer ctrl.Finish()

			if test.storeExp != nil {
				test.storeExp(store)
			}

			var got, gotErr = inter.GetSentReport(test.request.AccountID, test.request.CampaignID)

			if diff := rtesting.Diff(test.exp, got, test.expErr, gotErr); diff != nil {
				t.Fatalf("\n%s\n", rtesting.Difff(diff))
			}
		})
	}
}

func timestamp(t *testing.T, i string) time.Time {
	t.Helper()
	tstamp, err := time.Parse(time.RFC3339, i)
	if err != nil {
		t.Fatal(err)
	}
	return tstamp
}
