/**
 * @flow
 * @relayHash f60bd900cde89d59989f162816b85c51
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type UpdateDeviceTestLabelPropertyMutationVariables = {|
  deviceId: string;
  isTestDevice: boolean;
  label: string;
|};

export type UpdateDeviceTestLabelPropertyMutationResponse = {|
  +updateDeviceTestLabelProperty: ?boolean;
|};
*/


/*
mutation UpdateDeviceTestLabelPropertyMutation(
  $deviceId: String!
  $isTestDevice: Boolean!
  $label: String!
) {
  updateDeviceTestLabelProperty(deviceId: $deviceId, isTestDevice: $isTestDevice, label: $label)
}
*/

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "deviceId",
        "type": "String!",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "isTestDevice",
        "type": "Boolean!",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "label",
        "type": "String!",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "UpdateDeviceTestLabelPropertyMutation",
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "deviceId",
            "variableName": "deviceId",
            "type": "String!"
          },
          {
            "kind": "Variable",
            "name": "isTestDevice",
            "variableName": "isTestDevice",
            "type": "Boolean!"
          },
          {
            "kind": "Variable",
            "name": "label",
            "variableName": "label",
            "type": "String!"
          }
        ],
        "name": "updateDeviceTestLabelProperty",
        "storageKey": null
      }
    ],
    "type": "Mutation"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "UpdateDeviceTestLabelPropertyMutation",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "deviceId",
        "type": "String!",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "isTestDevice",
        "type": "Boolean!",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "label",
        "type": "String!",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "UpdateDeviceTestLabelPropertyMutation",
    "operation": "mutation",
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "deviceId",
            "variableName": "deviceId",
            "type": "String!"
          },
          {
            "kind": "Variable",
            "name": "isTestDevice",
            "variableName": "isTestDevice",
            "type": "Boolean!"
          },
          {
            "kind": "Variable",
            "name": "label",
            "variableName": "label",
            "type": "String!"
          }
        ],
        "name": "updateDeviceTestLabelProperty",
        "storageKey": null
      }
    ]
  },
  "text": "mutation UpdateDeviceTestLabelPropertyMutation(\n  $deviceId: String!\n  $isTestDevice: Boolean!\n  $label: String!\n) {\n  updateDeviceTestLabelProperty(deviceId: $deviceId, isTestDevice: $isTestDevice, label: $label)\n}\n"
};

module.exports = batch;
