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

/**
 * @class QrSigner
 */

import React, { Component } from 'react'
import { parseURL } from '@parity/erc681'
import PropTypes from 'prop-types'

import QrCode from './QrCode'
import QrScan from './QrScan'
import { encode } from './uos'

export default class QrSigner extends Component {
  static propTypes = {
    // Whether to show the QR scanner or a QR code
    scan: PropTypes.bool.isRequired,

    // Callback that will be executed with the data scanned from the QR code
    onScan: PropTypes.func.isRequired,

    // Display width and height in pixels, QR code will be scaled if necessary
    size: PropTypes.number,

    // (if scan === false) The network in which we want to encode the value
    network: PropTypes.oneOf(['ethereumLegacy', 'substrate']),

    // (if scan === false) The payload to show as a QR code, different for each
    // network
    payload: PropTypes.object,

    // (if scan === false) Callback when an encoding error occurs
    onError: PropTypes.func
  };

  static defaultProps = {
    size: 250
  };

  handleScan = data => {
    if (!data) return

    if (data.substring(0, 9) === 'ethereum:') {
      // ERC-681 address URL
      const { prefix, address, chainId } = parseURL(data)

      if (prefix !== 'pay') {
        throw new Error(`Unsupported ERC-831 prefix: ${prefix}`)
      }

      this.props.onScan({ address, chainId })
    } else if (/^[0-9a-fA-F]{40}$/.test(data)) {
      // Legacy address without any prefixes
      this.props.onScan({ address: `0x${data}`, chainId: 1 })
    } else {
      // Signature
      this.props.onScan(data)
    }
  };

  render() {
    const { onError, scan, size } = this.props

    const style = {
      width: `${size}px`,
      height: `${size}px`
    }

    if (scan) {
      const { handleScan } = this

      return (
        <div style={style}>
          <QrScan onScan={handleScan} />
        </div>
      )
    }

    const { network, payload } = this.props
    const value = encode(network, payload)

    if (value.error) {
      onError && onError(value.error)
      return <div style={style}>Error in encoding: {value.error}</div>
    }

    return (
      <div style={style}>
        <QrCode value={value.result} />
      </div>
    )
  }
}
