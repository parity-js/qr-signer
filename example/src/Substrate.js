import React, { Component } from 'react';
import QrSigner from '@parity/qr-signer';
import extrinsics from '@polkadot/api-metadata/extrinsics/static';
import { ImmortalEra, Method, SignaturePayload } from '@polkadot/types';
import { hexToU8a } from '@polkadot/util';

// Fetch some fake metadata
Method.injectMethods(extrinsics);

// Create some fake extrinsic
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

// Create signature payload of the above extrinsic
const signaturePayload = new SignaturePayload({
  nonce: 1,
  method: balancesTransfer,
  era: new ImmortalEra(),
  blockHash:
    '0x6f6f9bba0eed8e3ae9446c37eee763f93118b52a315a7b46090453ba6288da1f'
});

export default class Substrate extends Component {
  state = {
    scan: false,
    scanned: null
  };

  render() {
    const { scan, scanned } = this.state;

    return (
      <div>
        <h2>Substrate</h2>
        {scanned ? (
          <div>Substrate Scanned: {JSON.stringify(scanned)}</div>
        ) : (
          <QrSigner
            size={300}
            scan={scan}
            network="substrate"
            payload={{
              account: hexToU8a(
                '0xd7568e5f0a7eda67a82691ff379ac4bba4f9c9b859fe779b5d46363b61ad2db9'
              ),
              action: 'signTransaction',
              crypto: 'ed25519',
              data: signaturePayload.toU8a()
            }}
            onScan={scanned => this.setState({ scanned })}
          />
        )}
        <button
          onClick={() =>
            this.setState({
              scan: !this.state.scan
            })
          }
        >
          Toggle Substrate Scan
        </button>
      </div>
    );
  }
}
