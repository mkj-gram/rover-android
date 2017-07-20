/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteFragment} from 'relay-runtime';
export type AudienceTable_segment = {|
  +name: string;
  +data: $ReadOnlyArray<?{|
    +profile?: any;
    +deviceData?: any;
  |}>;
|};
*/


const fragment /*: ConcreteFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AudienceTable_segment",
  "selections": [
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
      "concreteType": "Device",
      "name": "data",
      "plural": true,
      "selections": [
        {
          "kind": "InlineFragment",
          "type": "Device",
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "args": null,
              "name": "profile",
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "args": null,
              "name": "deviceData",
              "storageKey": null
            }
          ]
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Segment"
};

module.exports = fragment;
