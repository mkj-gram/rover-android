//
//  TrackEventsMutation.swift
//  RoverEvents
//
//  Created by Sean Rucker on 2018-05-02.
//  Copyright © 2018 Rover Labs Inc. All rights reserved.
//

struct TrackEventsMutation: GraphQLOperation {
    struct Data: Decodable {
        
    }
    
    var operationType: GraphQLOperationType {
        return .mutation
    }
    
    var query: GraphQLQuery {
        return .inline(query: """
            mutation TrackEvents($events: [Event]!) {
                trackEvents(events:$events)
            }
            """
        )
    }
    
    struct Variables: Encodable {
        var events: [Event]
    }
    
    var variables: Variables?
    
    init(events: [Event]) {
        variables = Variables(events: events)
    }
}
