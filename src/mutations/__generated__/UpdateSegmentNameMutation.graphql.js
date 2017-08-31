/**
 * @flow
 * @relayHash a5196dd09bdc791c0150e8e8d027e85d
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type UpdateSegmentNameMutationVariables = {|
  segment?: ?{
    id?: ?string;
    name?: ?string;
    predicates?: ?any;
    queryCondition?: ?string;
  };
|};

export type UpdateSegmentNameMutationResponse = {|
  +updateSegmentName: ?{|
    +segmentId: string;
    +name: string;
  |};
|};
*/


/*
mutation UpdateSegmentNameMutation(
  $segment: SegmentInput
) {
  updateSegmentName(segment: $segment) {
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
    "name": "UpdateSegmentNameMutation",
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
        "name": "updateSegmentName",
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
  "name": "UpdateSegmentNameMutation",
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
    "name": "UpdateSegmentNameMutation",
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
        "name": "updateSegmentName",
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
  "text": "mutation UpdateSegmentNameMutation(\n  $segment: SegmentInput\n) {\n  updateSegmentName(segment: $segment) {\n    segmentId\n    name\n  }\n}\n"
};

module.exports = batch;
