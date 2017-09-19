/**
 * @flow
 * @relayHash edb04328f46abb53a37a5cc54462a184
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type SideBarRefetchContainerQueryResponse = {| |};
*/


/*
query SideBarRefetchContainerQuery(
  $segmentId: ID
) {
  ...SideBarRefetchContainer_IXE1D
}

fragment SideBarRefetchContainer_IXE1D on Query {
  sbDynamicSegment: dynamicSegment(segmentId: $segmentId) {
    segmentId
    name
    predicates {
      condition
      predicateList {
        __typename
        ... on Predicate {
          __typename
          attribute
          selector
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
              name
            }
            geofenceComparison
          }
        }
      }
    }
  }
  segmentSchema {
    deviceSchema {
      attribute
      __typename: type
      label
    }
    profileSchema {
      attribute
      __typename: type
      label
    }
  }
  segmentsContainer: dynamicSegment {
    ...SegmentsContainer_segments
  }
}

fragment SegmentsContainer_segments on DynamicSegment {
  name
  segmentId
}
*/

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "segmentId",
        "type": "ID",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "SideBarRefetchContainerQuery",
    "selections": [
      {
        "kind": "FragmentSpread",
        "name": "SideBarRefetchContainer",
        "args": [
          {
            "kind": "Variable",
            "name": "segmentId",
            "variableName": "segmentId",
            "type": null
          }
        ]
      }
    ],
    "type": "Query"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "SideBarRefetchContainerQuery",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "segmentId",
        "type": "ID",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "SideBarRefetchContainerQuery",
    "operation": "query",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "sbDynamicSegment",
        "args": [
          {
            "kind": "Variable",
            "name": "segmentId",
            "variableName": "segmentId",
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
                "name": "predicateList",
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
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "selector",
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
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "args": null,
                            "name": "name",
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
        "storageKey": null
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
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "label",
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
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "label",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "kind": "LinkedField",
        "alias": "segmentsContainer",
        "args": null,
        "concreteType": "DynamicSegment",
        "name": "dynamicSegment",
        "plural": true,
        "selections": [
          {
            "kind": "InlineFragment",
            "type": "DynamicSegment",
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "name",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "segmentId",
                "storageKey": null
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "query SideBarRefetchContainerQuery(\n  $segmentId: ID\n) {\n  ...SideBarRefetchContainer_IXE1D\n}\n\nfragment SideBarRefetchContainer_IXE1D on Query {\n  sbDynamicSegment: dynamicSegment(segmentId: $segmentId) {\n    segmentId\n    name\n    predicates {\n      condition\n      predicateList {\n        __typename\n        ... on Predicate {\n          __typename\n          attribute\n          selector\n          ... on StringPredicate {\n            stringValue\n            stringComparison\n          }\n          ... on VersionPredicate {\n            versionValue\n            versionComparison\n          }\n          ... on DatePredicate {\n            dateValue {\n              start\n              end\n            }\n            dateComparison\n          }\n          ... on BooleanPredicate {\n            booleanValue\n            booleanComparison\n          }\n          ... on NumberPredicate {\n            numberValue\n            numberComparison\n          }\n          ... on GeofencePredicate {\n            geofenceValue {\n              latitude\n              longitude\n              radius\n              name\n            }\n            geofenceComparison\n          }\n        }\n      }\n    }\n  }\n  segmentSchema {\n    deviceSchema {\n      attribute\n      __typename: type\n      label\n    }\n    profileSchema {\n      attribute\n      __typename: type\n      label\n    }\n  }\n  segmentsContainer: dynamicSegment {\n    ...SegmentsContainer_segments\n  }\n}\n\nfragment SegmentsContainer_segments on DynamicSegment {\n  name\n  segmentId\n}\n"
};

module.exports = batch;
