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

import assert from '@polkadot/util/assert'
import hexStripPrefix from '@polkadot/util/hex/stripPrefix'

/**
 * Prevalidate and clean the input JSON payload.
 *
 * @param json - JSON payload to prevalidate
 */
function clean(json) {
  assert(typeof json === 'object', `Expected object, got ${json}`)
  assert(
    ['signData', 'signTransaction'].includes(json.action),
    `Field 'action' should be signData or signTransaction, got ${json.action}`
  )
  assert(json.data, `Expected non-empty 'data' field, got ${json.data}`)

  if (json.action === 'signData') {
    assert(
      json.data.account,
      `Expected non-empty 'data.account' field, got ${json.data.account}`
    )
    assert(
      json.data.data,
      `Expected non-empty 'data.data' field, got ${json.data.data}`
    )

    return {
      action: json.action,
      data: {
        account: hexStripPrefix(json.data.account),
        data: hexStripPrefix(json.data.rlp)
      }
    }
  } else if (json.action === 'signTransaction') {
    assert(
      json.data.account,
      `Expected non-empty 'data.account' field, got ${json.data.account}`
    )
    assert(
      json.data.rlp,
      `Expected non-empty 'data.rlp' field, got ${json.data.rlp}`
    )

    return {
      action: json.action,
      data: {
        account: hexStripPrefix(json.data.account),
        rlp: hexStripPrefix(json.data.rlp)
      }
    }
  }
}

export function ethereumLegacyEncode(json) {
  return JSON.stringify(clean(json))
}
