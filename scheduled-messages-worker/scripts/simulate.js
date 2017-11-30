const amqp = require('amqplib')
const config = require('../config')

let channel = null

let template = {
    "message_template": {
        "id": 1,
        "account_id": 1,
        "title": "LIVE - Weekly Presser",
        "tags": null,
        "notification_text": "This is a test message",
        "published": true,
        "archived": false,
        "save_to_inbox": false,
        "date_schedule": "-Infinity...Infinity",
        "time_schedule": "0...1441",
        "schedule_monday": true,
        "schedule_tuesday": true,
        "schedule_wednesday": true,
        "schedule_thursday": true,
        "schedule_friday": true,
        "schedule_saturday": true,
        "schedule_sunday": true,
        "trigger_event_id": null,
        "dwell_time_in_seconds": null,
        "customer_segment_id": null,
        "filter_beacon_configuration_tags": null,
        "filter_beacon_configuration_ids": null,
        "filter_place_tags": null,
        "filter_place_ids": null,
        "content_type": "deep-link",
        "website_url": null,
        "created_at": "2017-11-30T19:52:03.748Z",
        "updated_at": "2017-11-30T19:52:08.216Z",
        "scheduled_at": "2017-11-30T19:52:03.745Z",
        "scheduled_local_time": false,
        "scheduled_token": "a318c63ed8d3aaae6d413392c12d7cee",
        "ios_title": "LA Chargers",
        "android_title": "LA Chargers",
        "android_collapse_key": null,
        "ios_sound_file": null,
        "android_sound_file": null,
        "time_to_live": null,
        "landing_page_template": null,
        "properties": {},
        "deeplink_url": "app://show-live_event?id=2cddbb1d-f870-44de-9503-083b9af13e7a",
        "scheduled_time_zone": "America/Los_Angeles",
        "sent": true,
        "filter_gimbal_place_ids": [],
        "experience_id": null,
        "limits": [],
        "filter_xenio_zone_tags": [],
        "filter_xenio_zone_ids": [],
        "filter_xenio_place_tags": [],
        "filter_xenio_place_ids": [],
        "static_segment_id": null,
        "dynamic_segment_id": "59cbd82133dee700019b7f76",
        "type": "ScheduledMessageTemplate"
    },
    "static_segment_id": null,
    "dynamic_segment_id": null,
    "account": {
        "id": 1,
        "title": "Rover",
        "primary_user_id": 1,
        "token": "6c546189dc45df1293bddc18c0b54786",
        "share_key": "6246fac148a91177b56d1a273ef61a19",
        "default_user_role_id": 1,
        "users_count": 1,
        "places_count": 25,
        "beacon_configurations_count": 152,
        "searchable_beacon_configurations_count": 152,
        "searchable_places_count": 25,
        "account_invites_count": 0,
        "gimbal_places_count": 0,
        "created_at": "2016-04-11T15:33:44.646Z",
        "updated_at": "2017-07-07T14:43:02.673Z",
        "customers_count": 200,
        "proximity_message_templates_draft_count": 10,
        "proximity_message_templates_published_count": 10,
        "proximity_message_templates_archived_count": 35,
        "ios_platform_name": "Rover",
        "android_platform_name": "Rover",
        "scheduled_message_templates_draft_count": 2,
        "scheduled_message_templates_published_count": 0,
        "scheduled_message_templates_sent_count": 182,
        "scheduled_message_templates_archived_count": 176,
        "searchable_gimbal_places_count": 0,
        "experiences_draft_count": 10,
        "experiences_published_count": 27,
        "experiences_archived_count": 11,
        "places_updated_at": "2017-07-07T14:43:02.673Z",
        "beacon_configurations_updated_at": "2017-03-23T22:54:12.034Z",
        "message_limits": [],
        "subdomain": "rover",
        "searchable_xenio_zones_count": 0,
        "searchable_xenio_places_count": 0,
        "cname": null
    },
    "test_customer_ids": [],
    "stream_id": 0,
    "platform_credentials": {
        "fcm": {
            "api_key": "AIzaSyBaLsBnzaaEdmbzm6xKZwg9MDPH05-OiuE",
            "sender_id": null,
            "messaging_token": null
        },
        "apns": {
            "certificate": "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\n",
            "passphrase": "",
            "topic": "io.rover.Bagel"
        }
    }
}

amqp.connect(config.get('/amqp/url'))
	.then(connection => connection.createConfirmChannel())
	.then(c => channel = c)
	.then(_ => {
        for (var i = 0; i < 5; i++) {
            let message = Object.assign({}, template)
            message.stream_id = i
            channel.sendToQueue('send_message_to_customers', Buffer.from(JSON.stringify(message)), {})
        }
    })
	.then(_ => channel.waitForConfirms())
	.then(_ => {
		console.log("Messages has been published\n")
		process.exit(0)
	})
	.catch(err => {
		console.error("ERROR: ", err)
		process.exit(1)
	})