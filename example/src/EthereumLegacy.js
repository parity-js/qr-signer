import React, { Component } from 'react';
import QrSigner from '@parity/qr-signer';

export default class EthereumLegacy extends Component {
  state = {
    scan: false,
    scanned: null
  };

  render() {
    const { scan, scanned } = this.state;

    return (
      <div>
        <h2>Ethereum Legacy</h2>
        {scanned ? (
          <div>Ethereum Legacy Scanned: {JSON.stringify(scanned)}</div>
        ) : (
          <QrSigner
            size={300}
            scan={scan}
            network="ethereumLegacy"
            payload={{
              action: 'signTransaction',
              data: {
                account: '0x007311b88A03af17dbb37B47ab7C9Ab556708D56',
                rlp:
                  '0xeb808504a817c8008252089400255cf193f1ba6dd3ec08ebe62e393030f4dd34872386f26fc10000802a8080'
              }
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
          Toggle Ethereum Legacy Scan
        </button>
      </div>
    );
  }
}
