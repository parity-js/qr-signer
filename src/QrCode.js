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
 * @class QrCode
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import qrcode from 'qrcode-generator'

import styles from './QrCode.css'

export default class QrCode extends Component {
  static propTypes = {
    margin: PropTypes.number,
    size: PropTypes.number,
    value: PropTypes.string.isRequired
  };

  state = {
    image: null
  };

  componentWillMount() {
    this.generateCode(this.props)
  }

  componentWillReceiveProps(nextProps) {
    const hasChanged =
      nextProps.value !== this.props.value ||
      nextProps.size !== this.props.size ||
      nextProps.margin !== this.props.margin

    if (hasChanged) {
      this.generateCode(nextProps)
    }
  }

  render() {
    const { image } = this.state

    return (
      <div
        className={styles.qr}
        dangerouslySetInnerHTML={{
          __html: image
        }}
      />
    )
  }

  generateCode(props) {
    const { value } = props
    const qr = qrcode(0, 'M')

    qr.addData(value, 'Byte')
    qr.make()

    this.setState({
      image: qr.createImgTag(16, 0)
    })
  }
}
