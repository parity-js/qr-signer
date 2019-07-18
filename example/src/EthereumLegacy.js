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
