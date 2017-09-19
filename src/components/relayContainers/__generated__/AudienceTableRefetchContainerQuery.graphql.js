/**
 * @flow
 * @relayHash f57ef727b1d4be25a5b9c170beaaa451
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type AudienceTableRefetchContainerQueryResponse = {| |};
*/


/*
query AudienceTableRefetchContainerQuery(
  $segmentId: ID
  $includeSegmentsFromPredicates: Boolean!
  $predicates: String!
  $includeDynamicSegment: Boolean!
  $pageNumber: Int
  $condition: String
) {
  ...AudienceTableRefetchContainer_hYEZw
}

fragment AudienceTableRefetchContainer_hYEZw on Query {
  adgDynamicSegment: dynamicSegment(segmentId: $segmentId, pageNumber: $pageNumber, pageSize: 150) @include(if: $includeDynamicSegment) {
    ... on DynamicSegment {
      name
      segmentId
      data {
        segmentSize
        totalSize
        dataGridRows
      }
    }
  }
  adgSegmentSchema: segmentSchema {
    deviceSchema {
      ... on SchemaAttribute {
        attribute
        __typename: type
        label
      }
    }
    profileSchema {
      ... on SchemaAttribute {
        attribute
        __typename: type
        label
      }
    }
  }
  adgSegmentsFromPredicates: segmentFromPredicates(predicates: $predicates, pageNumber: $pageNumber, pageSize: 150, condition: $condition) @include(if: $includeSegmentsFromPredicates) {
    segmentSize
    totalSize
    dataGridRows
  }
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
      },
      {
        "kind": "LocalArgument",
        "name": "includeSegmentsFromPredicates",
        "type": "Boolean!",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "predicates",
        "type": "String!",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "includeDynamicSegment",
        "type": "Boolean!",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "pageNumber",
        "type": "Int",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "condition",
        "type": "String",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "AudienceTableRefetchContainerQuery",
    "selections": [
      {
        "kind": "FragmentSpread",
        "name": "AudienceTableRefetchContainer",
        "args": [
          {
            "kind": "Variable",
            "name": "condition",
            "variableName": "condition",
            "type": null
          },
          {
            "kind": "Variable",
            "name": "includeDynamicSegment",
            "variableName": "includeDynamicSegment",
            "type": null
          },
          {
            "kind": "Variable",
            "name": "includeSegmentsFromPredicates",
            "variableName": "includeSegmentsFromPredicates",
            "type": null
          },
          {
            "kind": "Variable",
            "name": "pageNumber",
            "variableName": "pageNumber",
            "type": null
          },
          {
            "kind": "Variable",
            "name": "predicates",
            "variableName": "predicates",
            "type": null
          },
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
  "name": "AudienceTableRefetchContainerQuery",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "segmentId",
        "type": "ID",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "includeSegmentsFromPredicates",
        "type": "Boolean!",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "predicates",
        "type": "String!",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "includeDynamicSegment",
        "type": "Boolean!",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "pageNumber",
        "type": "Int",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "condition",
        "type": "String",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "AudienceTableRefetchContainerQuery",
    "operation": "query",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "adgSegmentSchema",
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
                "kind": "InlineFragment",
                "type": "SchemaAttribute",
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
                ]
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
                "kind": "InlineFragment",
                "type": "SchemaAttribute",
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
                ]
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "kind": "Condition",
        "passingValue": true,
        "condition": "includeSegmentsFromPredicates",
        "selections": [
          {
            "kind": "LinkedField",
            "alias": "adgSegmentsFromPredicates",
            "args": [
              {
                "kind": "Variable",
                "name": "condition",
                "variableName": "condition",
                "type": "String"
              },
              {
                "kind": "Variable",
                "name": "pageNumber",
                "variableName": "pageNumber",
                "type": "Int"
              },
              {
                "kind": "Literal",
                "name": "pageSize",
                "value": 150,
                "type": "Int"
              },
              {
                "kind": "Variable",
                "name": "predicates",
                "variableName": "predicates",
                "type": "String!"
              }
            ],
            "concreteType": "SegmentData",
            "name": "segmentFromPredicates",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "segmentSize",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "totalSize",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "dataGridRows",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ]
      },
      {
        "kind": "Condition",
        "passingValue": true,
        "condition": "includeDynamicSegment",
        "selections": [
          {
            "kind": "LinkedField",
            "alias": "adgDynamicSegment",
            "args": [
              {
                "kind": "Variable",
                "name": "pageNumber",
                "variableName": "pageNumber",
                "type": "Int"
              },
              {
                "kind": "Literal",
                "name": "pageSize",
                "value": 150,
                "type": "Int"
              },
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
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "args": null,
                    "concreteType": "SegmentData",
                    "name": "data",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "segmentSize",
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "totalSize",
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "dataGridRows",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ]
              }
            ],
            "storageKey": null
          }
        ]
      }
    ]
  },
  "text": "query AudienceTableRefetchContainerQuery(\n  $segmentId: ID\n  $includeSegmentsFromPredicates: Boolean!\n  $predicates: String!\n  $includeDynamicSegment: Boolean!\n  $pageNumber: Int\n  $condition: String\n) {\n  ...AudienceTableRefetchContainer_hYEZw\n}\n\nfragment AudienceTableRefetchContainer_hYEZw on Query {\n  adgDynamicSegment: dynamicSegment(segmentId: $segmentId, pageNumber: $pageNumber, pageSize: 150) @include(if: $includeDynamicSegment) {\n    ... on DynamicSegment {\n      name\n      segmentId\n      data {\n        segmentSize\n        totalSize\n        dataGridRows\n      }\n    }\n  }\n  adgSegmentSchema: segmentSchema {\n    deviceSchema {\n      ... on SchemaAttribute {\n        attribute\n        __typename: type\n        label\n      }\n    }\n    profileSchema {\n      ... on SchemaAttribute {\n        attribute\n        __typename: type\n        label\n      }\n    }\n  }\n  adgSegmentsFromPredicates: segmentFromPredicates(predicates: $predicates, pageNumber: $pageNumber, pageSize: 150, condition: $condition) @include(if: $includeSegmentsFromPredicates) {\n    segmentSize\n    totalSize\n    dataGridRows\n  }\n}\n"
};

module.exports = batch;
