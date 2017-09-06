/**
 * @flow
 * @relayHash 03dada579b88862f554eb1817090afe1
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type CreateSegmentMutationVariables = {|
  segment?: ?{
    id?: ?string;
    name?: ?string;
    predicates?: ?any;
    queryCondition?: ?string;
  };
|};

export type CreateSegmentMutationResponse = {|
  +createSegment: ?{|
    +segmentId: string;
    +name: string;
  |};
|};
*/


/*
mutation CreateSegmentMutation(
  $segment: SegmentInput
) {
  createSegment(segment: $segment) {
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
    "name": "CreateSegmentMutation",
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
        "name": "createSegment",
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
  "name": "CreateSegmentMutation",
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
    "name": "CreateSegmentMutation",
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
        "name": "createSegment",
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
  "text": "mutation CreateSegmentMutation(\n  $segment: SegmentInput\n) {\n  createSegment(segment: $segment) {\n    segmentId\n    name\n  }\n}\n"
};

module.exports = batch;
