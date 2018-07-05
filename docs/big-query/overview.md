---
title: Overview
layout: guide
permalink: /big-query/
secondary_navigation: big-query
tertiary_navigation:
    - name: Custom Events
      anchor: custom-events
    - name: Deprecated Tables
      anchor: deprecated-tables
---

# Overview

Events reported by the Rover SDK are stored in a Google BigQuery database. Each event type is stored in its own table.

As a Rover customer, you have access to your private dataset containing all the events generated from your app. This documentation lists the events captured by the Rover SDK out of the box and provides a detailed description of the schema for each event.

---

## Custom Events

In addition to the events listed above, you can also capture custom events that are meaningful to your application. These events can originate from a user performing an action within your app (e.g. Signed In) or they can originate from an external system such as an e-commerce platform (e.g. Product Purchased). 

Custom events can have meaningful data attached to them such as the product that was purchased or the email address used to sign in.

---

## Deprecated Tables

Over time the structure that Rover stores its event data has changed. For example, events were originally store in a single table instead of a separate table per event type. If you've been a Rover customer for more than a year, your private BigQuery dataset likely contains tables that are no longer in use. 

The following tables are <span class="deprecated">Deprecated</span> should _not_ be used in any of your reports.

<ul><li>events</li><li>events\_</li><li>events\_v2</li><li>events\_v2\_</li><li>unknown</li></ul>
