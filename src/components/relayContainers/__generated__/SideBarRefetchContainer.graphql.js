/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteFragment} from 'relay-runtime';
export type SideBarRefetchContainer = {|
  +sbDynamicSegment: ?$ReadOnlyArray<?{|
    +segmentId: string;
    +name: string;
    +predicates: ?{|
      +condition: "ANY" | "ALL";
      +predicateList: $ReadOnlyArray<?{|
        +__typename?: string;
        +attribute?: string;
        +selector?: string;
        +stringValue?: string;
        +stringComparison?: string;
        +versionValue?: $ReadOnlyArray<number>;
        +versionComparison?: string;
        +dateValue?: {|
          +start: any;
          +end: any;
        |};
        +dateComparison?: string;
        +booleanValue?: boolean;
        +booleanComparison?: string;
        +numberValue?: $ReadOnlyArray<number>;
        +numberComparison?: string;
        +geofenceValue?: {|
          +latitude: number;
          +longitude: number;
          +radius: number;
          +name: string;
        |};
        +geofenceComparison?: string;
        +stringArrayValue?: $ReadOnlyArray<?string>;
        +stringArrayComparison?: string;
      |}>;
    |};
  |}>;
  +segmentSchema: ?{|
    +deviceSchema: $ReadOnlyArray<?{|
      +attribute: string;
      +__typename: string;
      +label: string;
    |}>;
    +profileSchema: $ReadOnlyArray<?{|
      +attribute: string;
      +__typename: string;
      +label: string;
    |}>;
  |};
  +segmentsContainer: ?$ReadOnlyArray<?{| |}>;
|};
*/


const fragment /*: ConcreteFragment*/ = {
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "segmentId",
      "type": "ID",
      "defaultValue": ""
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "SideBarRefetchContainer",
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
                  "type": "StringArrayPredicate",
                  "selections": [
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "args": null,
                      "name": "stringArrayValue",
                      "storageKey": null
                    },
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "args": null,
                      "name": "stringArrayComparison",
                      "storageKey": null
                    }
                  ]
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
          "kind": "FragmentSpread",
          "name": "SegmentsContainer_segments",
          "args": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query"
};

module.exports = fragment;
