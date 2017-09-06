/**
 * @flow
 * @relayHash ae8ed2c20ec8dc47a974f28cb378f617
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type ArchiveSegmentMutationVariables = {|
  segment?: ?{
    id?: ?string;
    name?: ?string;
    predicates?: ?any;
    queryCondition?: ?string;
  };
|};

export type ArchiveSegmentMutationResponse = {|
  +archiveSegment: ?string;
|};
*/


/*
mutation ArchiveSegmentMutation(
  $segment: SegmentInput
) {
  archiveSegment(segment: $segment)
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
    "name": "ArchiveSegmentMutation",
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "segment",
            "variableName": "segment",
            "type": "SegmentInput"
          }
        ],
        "name": "archiveSegment",
        "storageKey": null
      }
    ],
    "type": "Mutation"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "ArchiveSegmentMutation",
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
    "name": "ArchiveSegmentMutation",
    "operation": "mutation",
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "segment",
            "variableName": "segment",
            "type": "SegmentInput"
          }
        ],
        "name": "archiveSegment",
        "storageKey": null
      }
    ]
  },
  "text": "mutation ArchiveSegmentMutation(\n  $segment: SegmentInput\n) {\n  archiveSegment(segment: $segment)\n}\n"
};

module.exports = batch;
