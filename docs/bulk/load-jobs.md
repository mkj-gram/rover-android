---
title: Load Jobs
layout: guide
permalink: /bulk/load-jobs/
secondary_navigation: bulk
tertiary_navigation:
    - name: Get
      anchor: get
---

# Load Jobs

The response from any of the data import endpoints contains a Load Job which includes details about the progress of the import and success/failure information.

---

## Get

Returns the details of a Load Job returned from an import action. You can repeatedly "poll" this endpoint to monitor the progress of your load job.

### Request

```
curl -H "x-rover-api-key: ROVER_SERVER_KEY" https://api.rover.io/bulk/v2/load-jobs/:id
```

### Response

```
{
    "data": {
        "id": "932",
        "progress": 0,
        "status": "enqueued",
        "created_at": "2017-11-03T19:13:10.301Z",
        "failed_reason": ""
    }
}
```

The `progress` property is a number from 0 to 100 indicating the estimated percentage of completion.

The `status` property is one of the following:
* `enqueued` – The load job is queued but has not yet started. The job will start automatically as soon as resources are available.
* `processing` – The load job has started but has not yet completed.
* `completed` - The load job completed successfully.
* `failed` - The load job failed.

If the load job fails for any reason, the `failed_reason` property will contain a description of the error.

