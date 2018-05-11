# Events

Transform events coming from outside our system into enhanced events for the rest of our backend to consume.

## Reasoning

Since SDK 2.0 we have switched over to an asynchronous event architecture for multiple reasons:
- Gives our backend system breathing room to consume at its own rate
- Guaranteed delivery of events from the SDK
- Easily scale pipeline without having to scale other subsystems
- etc.

By having all of our events go through a central pipeline we get an exact point of time snapshot of every model that was associated with the event.  What did the device look like after parsing the event, what did the profile look like, what did the campaign look like etc. This also reduces the amount of reads as we add more services that rely on this event stream. These services only need to look at the final event output and can determine all it needs to process it without having to ask for additional information.

Another big benefit we get from this is the ability to replay events in case of some sort of catastrophic error or a new service is added and wants to consume events from the beginning

## Architecture

The transformer sits in-between the provided input & output Kafka topic. It will continuously read in events that are key’d off by the device id if the event is a device event or the profile identifier if its a profile event. The transformer will then read these messages and process them sequentially based off of the key. This means the max events we can process in parallel is the number of partitions the input topic has.

When an event is received it goes through a list of transformers that build the final event output. These transformers are light functions that take an input event and spit out an enhanced event.

#### How it looks

```

                                                     Kafka
                             +---------------------------------------------------+
                             |                                                   |
                             |    +-------------+            +-------------+     |
                             |    |             |            |             |     |
                             |    | Input Topic |            | OutputTopic |     |
                             |    |             +--+       +->             |     |
                             |    |             |  |       | |             |     |
                             |    +------^------+  |       | +-------------+     |
                             |           |         |       |                     |
                             +---------------------------------------------------+
                                         |         |       |
            +-----------+                |         |       |
            |           |                |         |       |
            |           |                |     +---v-------+-----+
+---Event--->  graphql  +----------------+     |                 |
            |           |                      |                 |
            |           |                      |     Pipeline    |
            +-----------+                      |                 |
                                               +-----------------+
```
