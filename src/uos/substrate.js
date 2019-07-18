// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

import assert from '@polkadot/util/assert';
import u8aConcat from '@polkadot/util/u8a/concat';

/**
 * Prevalidate and clean the input JSON payload.
 *
 * @param json - JSON payload to prevalidate
 */
function validate(json) {
  assert(typeof json === 'object', `Expected object, got ${json}`);
  assert(
    [
      'signMessage',
      'signTransaction',
      'signImmortal',
      'signTransactionHash'
    ].includes(json.action),
    `Expected field 'action' to be signMessage, signTransaction, signImmortal, signTransactionHash, got ${
      json.action
    }`
  );
  // TODO Implement signImmortal if needed, though optional as signTransaction
  // can also cater for immortals
  assert(
    json.action !== 'signImmortal',
    'Please use signTransaction instead of signImmortal'
  );

  assert(
    ['ed25519', 'sr25519'].includes(json.crypto),
    `Expected 'crypto' to be ed25519, sr25519, got ${json.crypto}`
  );

  assert(
    // TODO now ed25519 and sr25519 have both length 32 for account ids, so we
    // hardcode 32
    // TODO we now require `json.account` to be a Uint8Array, but a SS58 string
    // should work too, and we should do the ss58 decoding here (we do need the
    // networkId for that though)
    json.account instanceof Uint8Array && json.account.length === 32,
    `Expected 'account' to be 32-byte bytes array, got ${json.account}`
  );

  if (json.action === 'signMessage') {
    assert(
      json.data instanceof Uint8Array,
      `Expected Uint8Array 'data' field, got ${json.data}`
    );
  } else if (json.action === 'signTransaction') {
    // TODO Should we allow other formats for signTransaction? e.g.
    // PolkadotJS's SignaturePayload, or just an object with
    // `nonce, call, era_description, era_header` fields
    assert(
      json.data instanceof Uint8Array,
      `Expected Uint8Array 'data' field, got ${json.data}`
    );
  } else if (json.action === 'signTransactionHash') {
    // MUST be the Blake2s 32-byte hash
    assert(
      json.data instanceof Uint8Array && json.data.length === 32,
      `Expected Uint8Array 'data' field, got ${json.data}`
    );
  }
}

function getNetworkByte() {
  return Uint8Array.from([53]);
}

function getCryptoByte(crypto) {
  switch (crypto) {
    case 'ed25519':
      return Uint8Array.from([0]);
    case 'sr25519':
      return Uint8Array.from([1]);
    default:
  }
}

function getActionByte(action) {
  switch (action) {
    case 'signTransaction':
      return Uint8Array.from([0]);
    case 'signTransactionHash':
      return Uint8Array.from([1]);
    case 'signMessage':
      return Uint8Array.from([3]);
    default:
  }
}

export function substrateEncode(json) {
  validate(json); // Will throw if something's wrong

  return u8aConcat(
    getNetworkByte(),
    getCryptoByte(json.crypto),
    getActionByte(json.action),
    json.account,
    json.data
  );
}
