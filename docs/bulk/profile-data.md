---
title: Profile Data
layout: guide
permalink: /bulk/profile-data/
secondary_navigation: bulk
tertiary_navigation:
    - name: Importing Data
      anchor: importing-data
    - name: Bulk Tagging
      anchor: bulk-tagging
---

# Profile Data

After successfully uploading a CSV file you can use the following endpoints to import and manipulate profile data in Rover. You'll need to use the appropriate endpoint depending on the type of data contained in the CSV.

---

## Importing Data

The `/load/profiles` endpoint facilitates importing user profile data into Rover that can be associated with users' devices.

### Request

```
curl -d '{ "csv_file_id": "6293", "schema": […] }' \
  -H "x-rover-api-key: ROVER_SERVER_KEY" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -X POST https://api.rover.io/bulk/v2/load/profiles
```

The body of the request contains the ID of a CSV file that was uploaded using the <a href="{{ site.baseurl }}{% link bulk/managing-csv-files.md %}#upload">Upload endpoint</a> and a schema (discussed below).

#### CSV Structure

The _columns_ in the CSV file represent different profile attributes that are meaningful to your organization, such as first name, age, gender etc. There is no limit to the number of attributes your CSV file can contain. Each _row_ in the CSV file contains information about a single user with corresponding values for each column.

The CSV file must contain a column for the profile identifier and each row must contain a non-blank, unique value for it. The profile identifier is used to identify the user the profile belongs to. Common examples of profile identifiers include email address, phone number or loyalty program collector number.

Device's can be associated with a profile by calling the identify method in the [iOS](https://github.com/RoverPlatform/rover-ios) and [Android](https://github.com/RoverPlatform/rover-android) SDKs and passing in a profile identifier. If a profile with a matching identifier has been uploaded to Rover, all the attributes of the profile will be associated with the device.

#### Schema

The `schema` property of the JSON payload defines the columns in the associated CSV file. `schema` is an array of objects with two key value pairs<sup>1</sup>:

* `field` - The name of the attribute contained in the column. E.g. "First Name".
* `type` - The data type of the attribute contained in the column. One of the following:
  * `id` - Column contains the unique profile identifier.
  * `string` - Column contains string values.
  * `integer` - Column contains integer values.
  * `float` - Column contains float values.
  * `boolean` - Column contains boolean values.
  * `list` - Column contains a list of strings, separated by the pipe (|) character.
  * `timestamp` - Column contains timestamp values in ISO 8601 format.

```
[
  {
    "type": "id"
  },
  {
    "type": "string",
    "field": "First Name"
  },
  {
    "type": "integer",
    "field": "Age"
  },
  {
    "type": "float",
    "field": "Loyalty Points Balance"
  },
  {
    "type": "boolean",
    "field": "Preferred Customer"
  },
  {
    "type": "list",
    "field": "Tags"
  },
  {
      "type": "timestamp",
      "field": "Latest Purchase"
  }
]
```

1. The definition for the column that represents the profile identifier may omit the `field` property since this column has special meaning and will always be labelled as Profile Identifier. If it is supplied, its value will be ignored.

### Response

The response from the profiles endpoint returns a <a href="{{ site.baseurl }}{% link bulk/load-jobs.md %}">Load Job</a>. You can poll the load job to check the progress of the import and determine if it was successful.

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

---

## Bulk Tagging

The `/tag/profiles` endpoint facilitates adding one or more tags to a list of profiles contained in a previously uploaded CSV of profile identifiers.

### Request

#### Single Tag

Use the following request to add a single tag to a list of profiles.

```
curl -d $'{ "csv-file-id": 6293, "tag": "foo" }' \
    -H "x-rover-api-key: ROVER_SERVER_KEY" \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -X POST https://api.staging.rover.io/bulk/v2/tag/profiles
```

#### Multiple Tags

Use the following request to add multiple tags to a list of profiles at once.

```
curl -d $'{ "csv-file-id": 6293, "tags": ["bar", "baz"] }' \
    -H "x-rover-api-key: ROVER_SERVER_KEY" \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -X POST https://api.staging.rover.io/bulk/v2/tag/profiles

```

The body of the request contains the ID of a CSV file that was uploaded using the <a href="{{ site.baseurl }}{% link bulk/managing-csv-files.md %}#upload">Upload endpoint</a> as well as one or more tags.

Each row in the CSV must contain a single value – a profile identifier that you want the tag(s) added to. When processing the request, the server will look for a profile matching each identifier in the list. If an existing profile is found it will have the tag(s) added to it. If the profile already has the tag(s) it will not be added again.

If the server does not find a matching profile, a _new_ profile will be created with the corresponding identifier and the tag(s) property will match the value in the request.

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

The response from the `/profiles/tag` endpoint returns a <a href="{{ site.baseurl }}{% link bulk/load-jobs.md %}">Load Job</a>. You can poll the load job to check the progress of the import and determine if it was successful.
