/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteFragment} from 'relay-runtime';
export type AddFilterModal_schema = {|
  +deviceSchema: $ReadOnlyArray<?{|
    +attribute: string;
    +__typename: string;
  |}>;
  +profileSchema: $ReadOnlyArray<?{|
    +attribute: string;
    +__typename: string;
  |}>;
|};
*/


const fragment /*: ConcreteFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AddFilterModal_schema",
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
        }
      ],
      "storageKey": null
    }
  ],
  "type": "SegmentSchema"
};

module.exports = fragment;
