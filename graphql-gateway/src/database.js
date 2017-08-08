export class User {}
export class Campaign {}
export class Experience {}

const VIEWER_ID = 'me'

const viewer = new User()
viewer.id = VIEWER_ID
viewer.name = "Alex Graham"
viewer.email = "alex@rover.io"
const usersById = {
    [VIEWER_ID]: viewer
}

const campaignsById = {}
const campaignIdsByUser = {
    [VIEWER_ID]: []
}

const sampleExperience = {
    "name": "locked layers",
    "id": "58bdd95fbe970e0011eb4af5",
    "versionId": "58bdd95fbe970e0011eb4af5",
    "viewToken": "227bb44b051ab89b437443af",
    "hasUnpublishedUhanges": true,
    "isPublished": true,
    "isArchived": false,
    "shortUrl": "RESnml",
    "simulatorUrl": "https://rover1.staging.rover.io/RESnml",
    "homeScreenId": "r18ZAabql",
    "recentAverageDuration": 72,
    "screens": [
        {
            "id": "r18ZAabql",
            "experienceId": "58b44dfbda24a8001189eb2d",
            "name": "First Screen",
            "views": 89,
            "backgroundColor": {
                "red": 255,
                "green": 255,
                "blue": 255,
                "alpha": 1
            },
            "title": "Untitled",
            "titleBarTextColor": {
                "red": 0,
                "green": 0,
                "blue": 0,
                "alpha": 1
            },
            "titleBarBackgroundColor": {
                "red": 249,
                "green": 249,
                "blue": 249,
                "alpha": 1
            },
            "titleBarButtonColor": {
                "red": 0,
                "green": 122,
                "blue": 255,
                "alpha": 1
            },
            "titleBarButtons": "close",
            "statusBarStyle": "dark",
            "statusBarAutoColor": true,
            "useDefaultTitleBarStyle": false,
            "hasUnpublishedChanges": true,
            "backgroundImage": null,
            "rows": [
                {
                    "id": "B1pHzA-9l",
                    "screenId": "r18ZAabql",
                    "experienceId": "58b44dfbda24a8001189eb2d",
                    "name": "Row",
                    "autoHeight": false,
                    "height": {
                        "type": "points",
                        "value": 200
                    },
                    "backgroundColor": {
                        "red": 129,
                        "green": 129,
                        "blue": 129,
                        "alpha": 0
                    },
                    "backgroundImage": null,
                    "isCollapsed": false,
                    "blocks": [
                        {
                            "id": "Bk2PzRWql",
                            "clickCount": 89,
                            "rowId": "B1pHzA-9l",
                            "screenId": "r18ZAabql",
                            "experienceId": "58b44dfbda24a8001189eb2d",
                            "name": "Button",
                            "width": {
                                "type": "points",
                                "value": 377
                            },
                            "type": "button-block",
                            "height": {
                                "type": "points",
                                "value": 197
                            },
                            "position": "floating",
                            "offset": {
                                "top": {
                                    "type": "points",
                                    "value": -4
                                },
                                "left": {
                                    "type": "points",
                                    "value": -2
                                },
                                "right": {
                                    "type": "points",
                                    "value": 0
                                },
                                "bottom": {
                                    "type": "points",
                                    "value": 7
                                },
                                "center": {
                                    "type": "points",
                                    "value": -1
                                },
                                "middle": {
                                    "type": "points",
                                    "value": -5.5
                                }
                            },
                            "alignment": {
                                "horizontal": "fill",
                                "vertical": "fill"
                            },
                            "inset": {
                                "top": 0,
                                "left": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "backgroundImage": null,
                            "opacity": 1,
                            "lockStatus": "locked",
                            "states": {
                                "normal": {
                                    "backgroundColor": {
                                        "red": 129,
                                        "green": 129,
                                        "blue": 129,
                                        "alpha": 0
                                    },
                                    "borderColor": {
                                        "red": 129,
                                        "green": 129,
                                        "blue": 129,
                                        "alpha": 1
                                    },
                                    "borderWidth": 9,
                                    "borderRadius": 4,
                                    "textColor": {
                                        "red": 0,
                                        "green": 0,
                                        "blue": 0,
                                        "alpha": 1
                                    },
                                    "textFont": {
                                        "size": 29,
                                        "weight": 700
                                    },
                                    "textAlignment": "center",
                                    "text": "rferferf"
                                },
                                "highlighted": {
                                    "backgroundColor": {
                                        "red": 129,
                                        "green": 129,
                                        "blue": 129,
                                        "alpha": 0
                                    },
                                    "borderColor": {
                                        "red": 129,
                                        "green": 129,
                                        "blue": 129,
                                        "alpha": 1
                                    },
                                    "borderWidth": 9,
                                    "borderRadius": 4,
                                    "textColor": {
                                        "red": 0,
                                        "green": 0,
                                        "blue": 0,
                                        "alpha": 1
                                    },
                                    "textFont": {
                                        "size": 29,
                                        "weight": 700
                                    },
                                    "textAlignment": "center",
                                    "text": "rferferf"
                                },
                                "disabled": {
                                    "backgroundColor": {
                                        "red": 129,
                                        "green": 129,
                                        "blue": 129,
                                        "alpha": 0
                                    },
                                    "borderColor": {
                                        "red": 129,
                                        "green": 129,
                                        "blue": 129,
                                        "alpha": 1
                                    },
                                    "borderWidth": 9,
                                    "borderRadius": 4,
                                    "textColor": {
                                        "red": 0,
                                        "green": 0,
                                        "blue": 0,
                                        "alpha": 1
                                    },
                                    "textFont": {
                                        "size": 29,
                                        "weight": 700
                                    },
                                    "textAlignment": "center",
                                    "text": "rferferf"
                                },
                                "selected": {
                                    "backgroundColor": {
                                        "red": 129,
                                        "green": 129,
                                        "blue": 129,
                                        "alpha": 0
                                    },
                                    "borderColor": {
                                        "red": 129,
                                        "green": 129,
                                        "blue": 129,
                                        "alpha": 1
                                    },
                                    "borderWidth": 9,
                                    "borderRadius": 4,
                                    "textColor": {
                                        "red": 0,
                                        "green": 0,
                                        "blue": 0,
                                        "alpha": 1
                                    },
                                    "textFont": {
                                        "size": 29,
                                        "weight": 700
                                    },
                                    "textAlignment": "center",
                                    "text": "rferferf"
                                }
                            },
                            "action": null,
                        },
                        {
                            "id": "ry1LG0Z9e",
                            "clickCount": 42,
                            "rowId": "B1pHzA-9l",
                            "screenId": "r18ZAabql",
                            "experienceId": "58b44dfbda24a8001189eb2d",
                            "name": "Text",
                            "width": {
                                "type": "points",
                                "value": 202
                            },
                            "type": "text-block",
                            "height": {
                                "type": "points",
                                "value": 114
                            },
                            "position": "floating",
                            "offset": {
                                "top": {
                                    "type": "points",
                                    "value": 28
                                },
                                "left": {
                                    "type": "points",
                                    "value": 151
                                },
                                "right": {
                                    "type": "points",
                                    "value": 22
                                },
                                "bottom": {
                                    "type": "points",
                                    "value": 58
                                },
                                "center": {
                                    "type": "points",
                                    "value": 64.5
                                },
                                "middle": {
                                    "type": "points",
                                    "value": -15
                                }
                            },
                            "alignment": {
                                "horizontal": "fill",
                                "vertical": "top"
                            },
                            "inset": {
                                "top": 0,
                                "left": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "backgroundImage": null,
                            "opacity": 1,
                            "lockStatus": null,
                            "autoHeight": true,
                            "backgroundColor": {
                                "red": 238,
                                "green": 238,
                                "blue": 238,
                                "alpha": 0
                            },
                            "borderColor": {
                                "red": 129,
                                "green": 129,
                                "blue": 129,
                                "alpha": 1
                            },
                            "borderWidth": 0,
                            "borderRadius": 0,
                            "textColor": {
                                "red": 129,
                                "green": 129,
                                "blue": 129,
                                "alpha": 1
                            },
                            "textFont": {
                                "size": 16,
                                "weight": 400
                            },
                            "textAlignment": "left",
                            "text": "<p>Tljnext Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text&nbsp;</p>"
                        },
                        {
                            "id": "HyeTHGRZqe",
                            "clickCount": 22,
                            "rowId": "B1pHzA-9l",
                            "screenId": "r18ZAabql",
                            "experienceId": "58b44dfbda24a8001189eb2d",
                            "name": "Rectangle",
                            "width": {
                                "type": "points",
                                "value": 115
                            },
                            "type": "default-block",
                            "height": {
                                "type": "points",
                                "value": 133
                            },
                            "position": "floating",
                            "offset": {
                                "top": {
                                    "type": "points",
                                    "value": 21
                                },
                                "left": {
                                    "type": "points",
                                    "value": 25
                                },
                                "right": {
                                    "type": "points",
                                    "value": 235
                                },
                                "bottom": {
                                    "type": "points",
                                    "value": 46
                                },
                                "center": {
                                    "type": "points",
                                    "value": -105
                                },
                                "middle": {
                                    "type": "points",
                                    "value": -12.5
                                }
                            },
                            "alignment": {
                                "horizontal": "left",
                                "vertical": "top"
                            },
                            "inset": {
                                "top": 0,
                                "left": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "background-image": null,
                            "opacity": 1,
                            "lockStatus": null,
                            "backgroundColor": {
                                "red": 238,
                                "green": 238,
                                "blue": 238,
                                "alpha": 1
                            },
                            "borderColor": {
                                "red": 129,
                                "green": 129,
                                "blue": 129,
                                "alpha": 1
                            },
                            "borderWidth": 1,
                            "borderRadius": 0
                        }
                    ]
                }
            ],
            "statusBarColor": {
                "red": 224,
                "green": 224,
                "blue": 224,
                "alpha": 1
            }
        },
        {
            "id": "12345",
            "experienceId": "58b44dfbda24a8001189eb2d",
            "name": "SecondScreen",
            "views": 42,
            "backgroundColor": {
                "red": 255,
                "green": 255,
                "blue": 255,
                "alpha": 1
            },
            "title": "Untitled",
            "titleBarTextColor": {
                "red": 0,
                "green": 0,
                "blue": 0,
                "alpha": 1
            },
            "titleBarBackgroundColor": {
                "red": 249,
                "green": 249,
                "blue": 249,
                "alpha": 1
            },
            "titleBarButtonColor": {
                "red": 0,
                "green": 122,
                "blue": 255,
                "alpha": 1
            },
            "titleBarButtons": "close",
            "statusBarStyle": "dark",
            "statusBarAutoColor": true,
            "useDefaultTitleBarStyle": false,
            "hasUnpublishedChanges": true,
            "backgroundImage": null,
            "rows": [
                {
                    "id": "B1pHzA-9l",
                    "screenId": "12345",
                    "experienceId": "58b44dfbda24a8001189eb2d",
                    "name": "Row",
                    "autoHeight": false,
                    "height": {
                        "type": "points",
                        "value": 200
                    },
                    "backgroundColor": {
                        "red": 129,
                        "green": 129,
                        "blue": 129,
                        "alpha": 0
                    },
                    "backgroundImage": null,
                    "isCollapsed": false,
                    "blocks": [
                        {
                            "id": "Bk2PzRW4",
                            "clickCount": 1,
                            "rowId": "B1pHzA-9l",
                            "screenId": "12345",
                            "experienceId": "58b44dfbda24a8001189eb2d",
                            "name": "Button",
                            "width": {
                                "type": "points",
                                "value": 377
                            },
                            "type": "button-block",
                            "height": {
                                "type": "points",
                                "value": 197
                            },
                            "position": "floating",
                            "offset": {
                                "top": {
                                    "type": "points",
                                    "value": -4
                                },
                                "left": {
                                    "type": "points",
                                    "value": -2
                                },
                                "right": {
                                    "type": "points",
                                    "value": 0
                                },
                                "bottom": {
                                    "type": "points",
                                    "value": 7
                                },
                                "center": {
                                    "type": "points",
                                    "value": -1
                                },
                                "middle": {
                                    "type": "points",
                                    "value": -5.5
                                }
                            },
                            "alignment": {
                                "horizontal": "fill",
                                "vertical": "fill"
                            },
                            "inset": {
                                "top": 0,
                                "left": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "backgroundImage": null,
                            "opacity": 1,
                            "lockStatus": "locked",
                            "states": {
                                "normal": {
                                    "backgroundColor": {
                                        "red": 129,
                                        "green": 129,
                                        "blue": 129,
                                        "alpha": 0
                                    },
                                    "borderColor": {
                                        "red": 129,
                                        "green": 129,
                                        "blue": 129,
                                        "alpha": 1
                                    },
                                    "borderWidth": 9,
                                    "borderRadius": 4,
                                    "textColor": {
                                        "red": 0,
                                        "green": 0,
                                        "blue": 0,
                                        "alpha": 1
                                    },
                                    "textFont": {
                                        "size": 29,
                                        "weight": 700
                                    },
                                    "textAlignment": "center",
                                    "text": "rferferf"
                                },
                                "highlighted": {
                                    "backgroundColor": {
                                        "red": 129,
                                        "green": 129,
                                        "blue": 129,
                                        "alpha": 0
                                    },
                                    "borderColor": {
                                        "red": 129,
                                        "green": 129,
                                        "blue": 129,
                                        "alpha": 1
                                    },
                                    "borderWidth": 9,
                                    "borderRadius": 4,
                                    "textColor": {
                                        "red": 0,
                                        "green": 0,
                                        "blue": 0,
                                        "alpha": 1
                                    },
                                    "textFont": {
                                        "size": 29,
                                        "weight": 700
                                    },
                                    "textAlignment": "center",
                                    "text": "rferferf"
                                },
                                "disabled": {
                                    "backgroundColor": {
                                        "red": 129,
                                        "green": 129,
                                        "blue": 129,
                                        "alpha": 0
                                    },
                                    "borderColor": {
                                        "red": 129,
                                        "green": 129,
                                        "blue": 129,
                                        "alpha": 1
                                    },
                                    "borderWidth": 9,
                                    "borderRadius": 4,
                                    "textColor": {
                                        "red": 0,
                                        "green": 0,
                                        "blue": 0,
                                        "alpha": 1
                                    },
                                    "textFont": {
                                        "size": 29,
                                        "weight": 700
                                    },
                                    "textAlignment": "center",
                                    "text": "rferferf"
                                },
                                "selected": {
                                    "backgroundColor": {
                                        "red": 129,
                                        "green": 129,
                                        "blue": 129,
                                        "alpha": 0
                                    },
                                    "borderColor": {
                                        "red": 129,
                                        "green": 129,
                                        "blue": 129,
                                        "alpha": 1
                                    },
                                    "borderWidth": 9,
                                    "borderRadius": 4,
                                    "textColor": {
                                        "red": 0,
                                        "green": 0,
                                        "blue": 0,
                                        "alpha": 1
                                    },
                                    "textFont": {
                                        "size": 29,
                                        "weight": 700
                                    },
                                    "textAlignment": "center",
                                    "text": "rferferf"
                                }
                            },
                            "action": null,
                        },
                        {
                            "id": "77777777",
                            "clickCount": 6,
                            "rowId": "B1pHzA-9l",
                            "screenId": "12345",
                            "experienceId": "58b44dfbda24a8001189eb2d",
                            "name": "Text",
                            "width": {
                                "type": "points",
                                "value": 202
                            },
                            "type": "text-block",
                            "height": {
                                "type": "points",
                                "value": 114
                            },
                            "position": "floating",
                            "offset": {
                                "top": {
                                    "type": "points",
                                    "value": 28
                                },
                                "left": {
                                    "type": "points",
                                    "value": 151
                                },
                                "right": {
                                    "type": "points",
                                    "value": 22
                                },
                                "bottom": {
                                    "type": "points",
                                    "value": 58
                                },
                                "center": {
                                    "type": "points",
                                    "value": 64.5
                                },
                                "middle": {
                                    "type": "points",
                                    "value": -15
                                }
                            },
                            "alignment": {
                                "horizontal": "fill",
                                "vertical": "top"
                            },
                            "inset": {
                                "top": 0,
                                "left": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "backgroundImage": null,
                            "opacity": 1,
                            "lockStatus": null,
                            "autoHeight": true,
                            "backgroundColor": {
                                "red": 238,
                                "green": 238,
                                "blue": 238,
                                "alpha": 0
                            },
                            "borderColor": {
                                "red": 129,
                                "green": 129,
                                "blue": 129,
                                "alpha": 1
                            },
                            "borderWidth": 0,
                            "borderRadius": 0,
                            "textColor": {
                                "red": 129,
                                "green": 129,
                                "blue": 129,
                                "alpha": 1
                            },
                            "textFont": {
                                "size": 16,
                                "weight": 400
                            },
                            "textAlignment": "left",
                            "text": "<p>Tljnext Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text&nbsp;</p>"
                        },
                        {
                            "id": "ADBCDE45",
                            "clickCount": 12,
                            "rowId": "B1pHzA-9l",
                            "screenId": "12345",
                            "experienceId": "58b44dfbda24a8001189eb2d",
                            "name": "Rectangle",
                            "width": {
                                "type": "points",
                                "value": 115
                            },
                            "type": "default-block",
                            "height": {
                                "type": "points",
                                "value": 133
                            },
                            "position": "floating",
                            "offset": {
                                "top": {
                                    "type": "points",
                                    "value": 21
                                },
                                "left": {
                                    "type": "points",
                                    "value": 25
                                },
                                "right": {
                                    "type": "points",
                                    "value": 235
                                },
                                "bottom": {
                                    "type": "points",
                                    "value": 46
                                },
                                "center": {
                                    "type": "points",
                                    "value": -105
                                },
                                "middle": {
                                    "type": "points",
                                    "value": -12.5
                                }
                            },
                            "alignment": {
                                "horizontal": "left",
                                "vertical": "top"
                            },
                            "inset": {
                                "top": 0,
                                "left": 0,
                                "right": 0,
                                "bottom": 0
                            },
                            "background-image": null,
                            "opacity": 1,
                            "lockStatus": null,
                            "backgroundColor": {
                                "red": 238,
                                "green": 238,
                                "blue": 238,
                                "alpha": 1
                            },
                            "borderColor": {
                                "red": 129,
                                "green": 129,
                                "blue": 129,
                                "alpha": 1
                            },
                            "borderWidth": 1,
                            "borderRadius": 0
                        }
                    ]
                }
            ],
            "statusBarColor": {
                "red": 224,
                "green": 224,
                "blue": 224,
                "alpha": 1
            }
        }
    ]
}

const campaignOpensCount = {
    inbox: 120,
    push: 180,
    inapp: 12,
    uniqueOpens: 210
}

const frequencyLimit = {
    limitCount: 1,
    periodCount: 2,
    periodType: 'Day'
}

const frequencyLimit2 = {
    limitCount: 5,
    periodCount: 1,
    periodType: 'Week'
}

const scheduleData = {
    startTime: "8:30 am",
    endTime: "12:30 pm",
    days: ['Mon', 'Wed', 'Fri'],
    startDate: new Date(),
    endDate: new Date(2017, 4, 30)
}

let nextCampaignId = 0

addCampaign('First Campaign', 'scheduled')
addCampaign('Second Campaign', 'location')
updateCampaignData(1, 'geofenceData', {
    triggerEnter: true,
    placeNames: ['Toronto', 'Montreal', 'Ottawa']
})
addCampaign('Third Campaign', 'location')
updateCampaignData(2, 'beaconData', {
    beaconNames: ['Beacon 1', 'Beacon 32'],
    triggerEnter: true,
    placeNames: ['Toronto', 'Montreal', 'Ottawa']
})
addCampaign('Fourth Campaign', 'scheduled')
addCampaign('Fifth Campaign', 'scheduled')
addCampaign('Sixth Campaign', 'location')
updateCampaignData(5, 'beaconData', {
    beaconTags: ['Beacon 1', 'Beacon 32'],
    triggerEnter: true,
    anyPlace: true
})
addCampaign('Seventh Campaign', 'location')
updateCampaignData(5, 'beaconData', {
    anyBeacon: true,
    triggerEnter: true,
    placeTags: ['CloseToStadium', 'Yellow', 'Free']
})
addCampaign('Eighth Campaign', 'scheduled')

export function addCampaign(name, campaignClass) {
    const campaign = new Campaign()
    const nextId = `${nextCampaignId++}`
    campaign.name = name
    campaign.campaignClass = campaignClass
    campaign.id = nextId
    campaign.roverId = nextId
    campaign.state = 'published'
    campaign.delivery = ['Push Notification', 'In-App', 'Inbox']
    campaign.beaconData = null
    campaign.geofenceData = null
    campaign.scheduleData = scheduleData
    campaign.audienceData = "Fanbase audience"
    campaign.experience = sampleExperience
    campaign.recipients = 12000
    campaign.campaignOpens = campaignOpensCount
    campaign.frequencyLimit = [ frequencyLimit, frequencyLimit2 ]
    campaignsById[campaign.id] = campaign
    campaignIdsByUser[VIEWER_ID].push(campaign.id)
    return campaign.id
}

export function updateCampaignData(id, dataType, data) {
    const campaign = getCampaign(id)
    campaign[dataType] = data
}

export function getCampaign(id) {
    return campaignsById[id]
}

export function getCampaigns(state, roverId, campaignClass) {
    
    let campaigns = campaignIdsByUser[VIEWER_ID].map(id => campaignsById[id])

    if (roverId) {
        campaigns = campaigns.filter(campaign => campaign.roverId === roverId)
    }
    
    if (state) {
        campaigns = campaigns.filter(campaign => campaign.state === state)
    }
    
    if (campaignClass) {
        campaigns = campaigns.filter(campaign =>  campaign.campaignClass === campaignClass)
    }
    
    return campaigns
}

export function getUser(id) {
    return usersById[id]
}

export function getViewer() {
    return getUser(VIEWER_ID)
}

export function removeCampaign(id) {
    const campaignIndex = campaignIdsByUser[VIEWER_ID].indexOf(id)
}


