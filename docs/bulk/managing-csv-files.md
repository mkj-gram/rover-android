---
title: Managing CSV Files
layout: guide
permalink: /bulk/managing-csv-files/
secondary_navigation: bulk
tertiary_navigation:
    - name: Upload
      anchor: upload
    - name: List
      anchor: list
    - name: Get
      anchor: get
---

# Managing CSV Files

Before you can import your data you need to upload your CSV to Rover's servers. Rover provides an API for uploading files as well as listing and getting the details of previously uploaded files.

---

## Upload

CSV data is passed to the Bulk API as binary data. This can be a physical file on your computer or streamed directly.

Uploading copies your CSV data to a physical file on Rover's servers. The amount of time for the call to complete is dependent on the amount of rows in your CSV and your current internet connection. CSV files can contain up to 10 million rows.

When the call completes, the CSV has been successfully saved to Rover’s servers. If at any point the connection drops and the call fails to return successfully, the file will have been abandoned and you can safely retry.

### Request

```
curl -data-binary "@example_file.csv" \
  -H "x-rover-api-key: ROVER_SERVER_KEY" \
  -H "Accept: application/json" \
  -X POST https://api.rover.io/bulk/v2/csv-files
```

### Response

After your file successfully uploads Rover will return a JSON response with details of your file. The most important part of the response is the file ID as this will be needed for the API calls discussed in the <a href="{{ site.baseurl }}{% link bulk/profile-data.md %}#importing-data">Importing Data</a> section.

In addition to the ID the response includes the number of rows and columns that were parsed from the file as well as a sample of randomly selected rows.

```
{
    "data": {
        "id": "6293",
        "filename": "c4f5483f9163581fa530a7f9687d152a.csv",
        "file_size": 16259,
        "num_rows": 38992,
        "num_columns": 5,
        "samples": [
            [
                "phil@example.com",
                "Phil",
                "St-Pierre",
                "555-555-5555",
                "Ottawa"
            ],
            [
                "michael@example.com",
                "Michael",
                "Montpetit",
                "444-444-4444",
                "Markham"
            ],
            [
                "chris@example.com",
                "Chris",
                "Recalis",
                "333-333-3333",
                "Whitby"
            ]
        ],
        "created_at": "2017-11-03T16:58:48.020Z"
    }
}
```

---

## List

Returns all previously uploaded files.

### Request

```
curl -H "x-rover-api-key: ROVER_SERVER_KEY" https://api.rover.io/bulk/v2/csv-files
```

### Response

```
{
    "data": [
        {
            "id": "6293",
            "filename": "c4f5483f9163581fa530a7f9687d152a.csv",
            "file_size": 16259,
            "num_rows": 38992,
            "num_columns": 5,
            "samples": [
                [
                    "phil@example.com",
                    "Phil",
                    "St-Pierre",
                    "555-555-5555",
                    "Ottawa"
                ],
                [
                    "michael@example.com",
                    "Michael",
                    "Montpetit",
                    "444-444-4444",
                    "Markham"
                ],
                [
                    "chris@example.com",
                    "Chris",
                    "Recalis",
                    "333-333-3333",
                    "Whitby"
                ]
            ],
            "created_at": "2017-11-03T16:58:48.020Z"
        },
        { … },
        { … }
    ]
}
```

---

## Get

Returns the details of a previously uploaded file referenced by ID.

### Request

```
curl -H "x-rover-api-key: ROVER_SERVER_KEY" https://api.rover.io/bulk/v2/csv-files/:id
```

### Response

```
{
    "data": {
        "id": "6293",
        "filename": "c4f5483f9163581fa530a7f9687d152a.csv",
        "file_size": 16259,
        "num_rows": 38992,
        "num_columns": 5,
        "samples": [
            [
                "phil@example.com",
                "Phil",
                "St-Pierre",
                "555-555-5555",
                "Ottawa"
            ],
            [
                "michael@example.com",
                "Michael",
                "Montpetit",
                "444-444-4444",
                "Markham"
            ],
            [
                "chris@example.com",
                "Chris",
                "Recalis",
                "333-333-3333",
                "Whitby"
            ]
        ],
        "created_at": "2017-11-03T16:58:48.020Z"
    }
}
```
