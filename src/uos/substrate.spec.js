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

import extrinsics from '@polkadot/api-metadata/extrinsics/static';
import { ImmortalEra, Method, SignaturePayload } from '@polkadot/types';
import { hexToU8a } from '@polkadot/util';

import { substrateEncode } from './substrate';

const balancesTransfer =
  '0x' +
  '2502' + // length
  '81' + // signed flag
  'ffd172a74cda4c865912c32ba0a80a57ae69abae410e5ccb59dee84e2f4432db4f' + // who
  'fa4c192f6960a3bcdbdee5bcd9c26a3f971b131081912abcc31eab6a0b7589ab' + // sig1
  '7f99b81a01738cb5e2a911a19d5daa5c0b654d4b8dbc521a6b29090c6d205903' + // sig2
  '0000' + // nonce
  '0500' + // balances.transfer
  'ffd7568e5f0a7eda67a82691ff379ac4bba4f9c9b859fe779b5d46363b61ad2db9' + // to
  'e56c'; // value

describe('substrate', () => {
  beforeAll(() => {
    Method.injectMethods(extrinsics);
  });

  it('should correctly create Uint8array', () => {
    const payload = new SignaturePayload({
      nonce: 1,
      method: balancesTransfer,
      era: new ImmortalEra(),
      blockHash:
        '0x6f6f9bba0eed8e3ae9446c37eee763f93118b52a315a7b46090453ba6288da1f'
    }).toU8a();

    expect(
      substrateEncode({
        account: hexToU8a(
          '0xd7568e5f0a7eda67a82691ff379ac4bba4f9c9b859fe779b5d46363b61ad2db9'
        ),
        action: 'signTransaction',
        crypto: 'ed25519',
        data: payload
      })
    ).toEqual(
      Uint8Array.from([
        53, // Network
        0, // crypto
        0, // action
        215, // accountId
        86,
        142,
        95,
        10,
        126,
        218,
        103,
        168,
        38,
        145,
        255,
        55,
        154,
        196,
        187,
        164,
        249,
        201,
        184,
        89,
        254,
        119,
        155,
        93,
        70,
        54,
        59,
        97,
        173,
        45,
        185,
        4, // payload
        37,
        2,
        0,
        111,
        111,
        155,
        186,
        14,
        237,
        142,
        58,
        233,
        68,
        108,
        55,
        238,
        231,
        99,
        249,
        49,
        24,
        181,
        42,
        49,
        90,
        123,
        70,
        9,
        4,
        83,
        186,
        98,
        136,
        218,
        31
      ])
    );
  });
});
