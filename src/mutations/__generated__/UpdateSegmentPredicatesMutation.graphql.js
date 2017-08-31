/**
 * @flow
 * @relayHash 61c5890ef8fa30eeab1788f1e8a721be
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type UpdateSegmentPredicatesMutationVariables = {|
  segment?: ?{
    id?: ?string;
    name?: ?string;
    predicates?: ?any;
    queryCondition?: ?string;
  };
|};

export type UpdateSegmentPredicatesMutationResponse = {|
  +updateDynamicSegmentPredicates: ?{|
    +segmentId: string;
    +name: string;
  |};
|};
*/


/*
mutation UpdateSegmentPredicatesMutation(
  $segment: SegmentInput
) {
  updateDynamicSegmentPredicates(segment: $segment) {
    segmentId
    name
  }
}
*/

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "segment",
        "type": "SegmentInput",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "UpdateSegmentPredicatesMutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "segment",
            "variableName": "segment",
            "type": "SegmentInput"
          }
        ],
        "concreteType": "DynamicSegment",
        "name": "updateDynamicSegmentPredicates",
        "plural": false,
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
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "UpdateSegmentPredicatesMutation",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "segment",
        "type": "SegmentInput",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "UpdateSegmentPredicatesMutation",
    "operation": "mutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "segment",
            "variableName": "segment",
            "type": "SegmentInput"
          }
        ],
        "concreteType": "DynamicSegment",
        "name": "updateDynamicSegmentPredicates",
        "plural": false,
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
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "mutation UpdateSegmentPredicatesMutation(\n  $segment: SegmentInput\n) {\n  updateDynamicSegmentPredicates(segment: $segment) {\n    segmentId\n    name\n  }\n}\n"
};

module.exports = batch;
