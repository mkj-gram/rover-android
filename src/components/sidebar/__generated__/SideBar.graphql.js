/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteFragment} from 'relay-runtime';
export type SideBar = {|
  +dynamicSegment: ?$ReadOnlyArray<?{|
    +segmentId: string;
    +name: string;
    +predicates: {|
      +condition: "ANY" | "ALL";
      +device: $ReadOnlyArray<?{|
        +__typename?: string;
        +attribute?: string;
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
        |};
        +geofenceComparison?: string;
      |}>;
      +profile: $ReadOnlyArray<?{|
        +__typename?: string;
        +attribute?: string;
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
        |};
        +geofenceComparison?: string;
      |}>;
    |};
  |}>;
  +segmentSchema: ?{| |};
|};
*/


const fragment /*: ConcreteFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SideBar",
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
          "kind": "FragmentSpread",
          "name": "AddFilterModal_schema",
          "args": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query"
};

module.exports = fragment;
