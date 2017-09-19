/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteFragment} from 'relay-runtime';
export type AudienceTableRefetchContainer = {|
  +adgDynamicSegment?: ?$ReadOnlyArray<?{|
    +name?: string;
    +segmentId?: string;
    +data?: ?{|
      +segmentSize: number;
      +totalSize: number;
      +dataGridRows: $ReadOnlyArray<any>;
    |};
  |}>;
  +adgSegmentSchema: ?{|
    +deviceSchema: $ReadOnlyArray<?{|
      +attribute?: string;
      +__typename?: string;
      +label?: string;
    |}>;
    +profileSchema: $ReadOnlyArray<?{|
      +attribute?: string;
      +__typename?: string;
      +label?: string;
    |}>;
  |};
  +adgSegmentsFromPredicates?: ?{|
    +segmentSize: number;
    +totalSize: number;
    +dataGridRows: $ReadOnlyArray<any>;
  |};
|};
*/


const fragment /*: ConcreteFragment*/ = {
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "segmentId",
      "type": "ID",
      "defaultValue": ""
    },
    {
      "kind": "LocalArgument",
      "name": "includeSegmentsFromPredicates",
      "type": "Boolean!",
      "defaultValue": true
    },
    {
      "kind": "LocalArgument",
      "name": "predicates",
      "type": "String!",
      "defaultValue": "[]"
    },
    {
      "kind": "LocalArgument",
      "name": "includeDynamicSegment",
      "type": "Boolean!",
      "defaultValue": false
    },
    {
      "kind": "LocalArgument",
      "name": "pageNumber",
      "type": "Int",
      "defaultValue": 0
    },
    {
      "kind": "LocalArgument",
      "name": "condition",
      "type": "String",
      "defaultValue": "ANY"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "AudienceTableRefetchContainer",
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
  ],
  "type": "Query"
};

module.exports = fragment;
