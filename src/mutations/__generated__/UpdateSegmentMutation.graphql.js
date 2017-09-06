/**
 * @flow
 * @relayHash 9e99d43461bd3c36813eb10e4970356d
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type UpdateSegmentMutationVariables = {|
  segment?: ?{
    id?: ?string;
    name?: ?string;
    predicates?: ?any;
    queryCondition?: ?string;
  };
|};

export type UpdateSegmentMutationResponse = {|
  +updateSegment: ?{|
    +segmentId: string;
    +name: string;
  |};
|};
*/


/*
mutation UpdateSegmentMutation(
  $segment: SegmentInput
) {
  updateSegment(segment: $segment) {
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
    "name": "UpdateSegmentMutation",
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
        "name": "updateSegment",
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
  "name": "UpdateSegmentMutation",
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
    "name": "UpdateSegmentMutation",
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
        "name": "updateSegment",
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
  "text": "mutation UpdateSegmentMutation(\n  $segment: SegmentInput\n) {\n  updateSegment(segment: $segment) {\n    segmentId\n    name\n  }\n}\n"
};

module.exports = batch;
