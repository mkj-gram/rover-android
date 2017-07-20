/**
 * @flow
 * @relayHash d907160ea0659b5ceec65773b457f574
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type AppQueryRendererQueryResponse = {| |};
*/


/*
query AppQueryRendererQuery {
  ...SideBar
}

fragment SideBar on Query {
  dynamicSegment(segmentId: "1a2b3c", paginationKey: "testpaginationkey") {
    segmentId
    name
    predicates {
      condition
      device {
        __typename
        ... on Predicate {
          __typename
          attribute
          ... on StringPredicate {
            stringValue
            stringComparison
          }
          ... on VersionPredicate {
            versionValue
            versionComparison
          }
          ... on DatePredicate {
            dateValue {
              start
              end
            }
            dateComparison
          }
          ... on BooleanPredicate {
            booleanValue
            booleanComparison
          }
          ... on NumberPredicate {
            numberValue
            numberComparison
          }
          ... on GeofencePredicate {
            geofenceValue {
              latitude
              longitude
              radius
            }
            geofenceComparison
          }
        }
      }
      profile {
        __typename
        ... on Predicate {
          __typename
          attribute
          ... on StringPredicate {
            stringValue
            stringComparison
          }
          ... on VersionPredicate {
            versionValue
            versionComparison
          }
          ... on DatePredicate {
            dateValue {
              start
              end
            }
            dateComparison
          }
          ... on BooleanPredicate {
            booleanValue
            booleanComparison
          }
          ... on NumberPredicate {
            numberValue
            numberComparison
          }
          ... on GeofencePredicate {
            geofenceValue {
              latitude
              longitude
              radius
            }
            geofenceComparison
          }
        }
      }
    }
  }
  segmentSchema {
    ...AddFilterModal_schema
  }
}

fragment AddFilterModal_schema on SegmentSchema {
  deviceSchema {
    attribute
    __typename: type
  }
  profileSchema {
    attribute
    __typename: type
  }
}
*/

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AppQueryRendererQuery",
    "selections": [
      {
        "kind": "FragmentSpread",
        "name": "SideBar",
        "args": null
      }
    ],
    "type": "Query"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "AppQueryRendererQuery",
  "query": {
    "argumentDefinitions": [],
    "kind": "Root",
    "name": "AppQueryRendererQuery",
    "operation": "query",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Literal",
            "name": "paginationKey",
            "value": "testpaginationkey",
            "type": "String"
          },
          {
            "kind": "Literal",
            "name": "segmentId",
            "value": "1a2b3c",
            "type": "ID"
          }
        ],
        "concreteType": "DynamicSegment",
        "name": "dynamicSegment",
        "plural": true,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "segmentId",
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "name",
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "PredicateAggregate",
            "name": "predicates",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "condition",
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": null,
                "name": "device",
                "plural": true,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "__typename",
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "attribute",
                    "storageKey": null
                  },
                  {
                    "kind": "InlineFragment",
                    "type": "GeofencePredicate",
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "args": null,
                        "concreteType": "GeofenceValue",
                        "name": "geofenceValue",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "args": null,
                            "name": "latitude",
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "args": null,
                            "name": "longitude",
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "args": null,
                            "name": "radius",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "geofenceComparison",
                        "storageKey": null
                      }
                    ]
                  },
                  {
                    "kind": "InlineFragment",
                    "type": "NumberPredicate",
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "numberValue",
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "numberComparison",
                        "storageKey": null
                      }
                    ]
                  },
                  {
                    "kind": "InlineFragment",
                    "type": "BooleanPredicate",
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "booleanValue",
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "booleanComparison",
                        "storageKey": null
                      }
                    ]
                  },
                  {
                    "kind": "InlineFragment",
                    "type": "DatePredicate",
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "args": null,
                        "concreteType": "DateValue",
                        "name": "dateValue",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "args": null,
                            "name": "start",
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "args": null,
                            "name": "end",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "dateComparison",
                        "storageKey": null
                      }
                    ]
                  },
                  {
                    "kind": "InlineFragment",
                    "type": "VersionPredicate",
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "versionValue",
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "versionComparison",
                        "storageKey": null
                      }
                    ]
                  },
                  {
                    "kind": "InlineFragment",
                    "type": "StringPredicate",
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "stringValue",
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "stringComparison",
                        "storageKey": null
                      }
                    ]
                  }
                ],
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": null,
                "name": "profile",
                "plural": true,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "__typename",
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "attribute",
                    "storageKey": null
                  },
                  {
                    "kind": "InlineFragment",
                    "type": "GeofencePredicate",
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "args": null,
                        "concreteType": "GeofenceValue",
                        "name": "geofenceValue",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "args": null,
                            "name": "latitude",
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "args": null,
                            "name": "longitude",
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "args": null,
                            "name": "radius",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "geofenceComparison",
                        "storageKey": null
                      }
                    ]
                  },
                  {
                    "kind": "InlineFragment",
                    "type": "NumberPredicate",
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "numberValue",
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "numberComparison",
                        "storageKey": null
                      }
                    ]
                  },
                  {
                    "kind": "InlineFragment",
                    "type": "BooleanPredicate",
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "booleanValue",
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "booleanComparison",
                        "storageKey": null
                      }
                    ]
                  },
                  {
                    "kind": "InlineFragment",
                    "type": "DatePredicate",
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "args": null,
                        "concreteType": "DateValue",
                        "name": "dateValue",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "args": null,
                            "name": "start",
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "args": null,
                            "name": "end",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "dateComparison",
                        "storageKey": null
                      }
                    ]
                  },
                  {
                    "kind": "InlineFragment",
                    "type": "VersionPredicate",
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "versionValue",
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "versionComparison",
                        "storageKey": null
                      }
                    ]
                  },
                  {
                    "kind": "InlineFragment",
                    "type": "StringPredicate",
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "stringValue",
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "stringComparison",
                        "storageKey": null
                      }
                    ]
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "dynamicSegment{\"paginationKey\":\"testpaginationkey\",\"segmentId\":\"1a2b3c\"}"
      },
      {
        "kind": "LinkedField",
        "alias": null,
        "args": null,
        "concreteType": "SegmentSchema",
        "name": "segmentSchema",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "SchemaAttribute",
            "name": "deviceSchema",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "attribute",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": "__typename",
                "args": null,
                "name": "type",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "SchemaAttribute",
            "name": "profileSchema",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "attribute",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": "__typename",
                "args": null,
                "name": "type",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "query AppQueryRendererQuery {\n  ...SideBar\n}\n\nfragment SideBar on Query {\n  dynamicSegment(segmentId: \"1a2b3c\", paginationKey: \"testpaginationkey\") {\n    segmentId\n    name\n    predicates {\n      condition\n      device {\n        __typename\n        ... on Predicate {\n          __typename\n          attribute\n          ... on StringPredicate {\n            stringValue\n            stringComparison\n          }\n          ... on VersionPredicate {\n            versionValue\n            versionComparison\n          }\n          ... on DatePredicate {\n            dateValue {\n              start\n              end\n            }\n            dateComparison\n          }\n          ... on BooleanPredicate {\n            booleanValue\n            booleanComparison\n          }\n          ... on NumberPredicate {\n            numberValue\n            numberComparison\n          }\n          ... on GeofencePredicate {\n            geofenceValue {\n              latitude\n              longitude\n              radius\n            }\n            geofenceComparison\n          }\n        }\n      }\n      profile {\n        __typename\n        ... on Predicate {\n          __typename\n          attribute\n          ... on StringPredicate {\n            stringValue\n            stringComparison\n          }\n          ... on VersionPredicate {\n            versionValue\n            versionComparison\n          }\n          ... on DatePredicate {\n            dateValue {\n              start\n              end\n            }\n            dateComparison\n          }\n          ... on BooleanPredicate {\n            booleanValue\n            booleanComparison\n          }\n          ... on NumberPredicate {\n            numberValue\n            numberComparison\n          }\n          ... on GeofencePredicate {\n            geofenceValue {\n              latitude\n              longitude\n              radius\n            }\n            geofenceComparison\n          }\n        }\n      }\n    }\n  }\n  segmentSchema {\n    ...AddFilterModal_schema\n  }\n}\n\nfragment AddFilterModal_schema on SegmentSchema {\n  deviceSchema {\n    attribute\n    __typename: type\n  }\n  profileSchema {\n    attribute\n    __typename: type\n  }\n}\n"
};

module.exports = batch;
