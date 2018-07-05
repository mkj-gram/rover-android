---
title: Overview
layout: guide
permalink: /bulk/
secondary_navigation: bulk
---

# Bulk API

The bulk API is used to import large volumes of data such as user profile data and existing push tokens. These can be one-time imports or setup on a recurring basis to keep Rover's view of your data in sync with your other systems. The Rover Bulk API uses the CSV format due to it minimal file size, eliminating repeated labels that occur in other formats such as JSON.

---

## Overview

The process for importing each type of data is two-fold:

1. Upload a CSV file containing the data to be imported. After successful upload you will receive a file ID.
2. Call the appropriate endpoint for the type of data you are importing, passing in the file ID.
