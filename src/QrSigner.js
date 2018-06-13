// Copyright 2015-2018 Parity Technologies (UK) Ltd.
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

/**
 * @class QrSigner
 */

import React, { Component } from 'react'
import { parseURL } from '@parity/erc681';
import PropTypes from 'prop-types'
import QrCode from './QrCode';
import QrScan from './QrScan';

function remove0x(value) {
  if (value.substr(0, 2) === '0x') {
    return value.substr(2);
  }

  return value;
}


export default class QrSigner extends Component {
  static propTypes = {
    // Whether to show the QR scanner or a QR code
    scan: PropTypes.bool.isRequired,

    // Callback that will be executed with the data scanned from the QR code
    onScan: PropTypes.func.isRequired,

    // Display width and height in pixels, QR code will be scaled if necessary
    size: PropTypes.number,

    // (if scan === false) Ethereum address, `0x` prefixed
    account: PropTypes.string,

    // (if scan === false) RLP-encoded Ethereum transaction, `0x` prefixed
    rlp: PropTypes.string,

    // (if scan === false) data to sign, if not signing RLP
    data: PropTypes.string,
  };

  static defaultProps = {
    size: 250
  };

  handleClick = () => {
    this.setState({ step: SCAN });
  };

  handleScan = (data) => {
    if (!data) return;

    if (data.substring(0, 9) === 'ethereum:') {
      // ERC-681 address URL
      const { prefix, address, chainId } = parseURL(data);

      if (prefix !== 'pay') {
        throw new Error(`Unsupported ERC-831 prefix: ${prefix}`);
      }

      this.props.onScan({ address, chainId });
    } else if (/^[0-9a-fA-F]{40}$/.test(data)) {
      // Legacy address without any prefixes
      this.props.onScan({ address: `0x${data}`, chainId: 1 });
    } else {
      // Signature
      this.props.onScan(data);
    }
  };

  render () {
    const { scan, size } = this.props;

    const style = {
      width: `${size}px`,
      height: `${size}px`,
    };

    if (scan) {
      const { handleScan } = this;

      return (
        <div style={style}>
          <QrScan onScan={handleScan} />
        </div>
      );
    }

    let { account, rlp, data } = this.props;
    let value;

    if (!account || !(rlp || data)) {
      console.error('Missing `account`, `rlp` or `data` prop on QrSigner!');

      return null;
    }

    account = remove0x(account);

    if (rlp) {
      rlp = remove0x(rlp);

      value = {
        action: 'signTransaction',
        data: { account, rlp }
      };
    } else {
      data = remove0x(data);

      value = {
        action: 'signData',
        data: { account, data }
      };
    }

    const width = `${size}px`;
    const height = width;

    return (
      <div style={style}>
        <QrCode value={JSON.stringify(value)} />
      </div>
    );
  }
}
