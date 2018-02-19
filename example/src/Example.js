import React, { Component } from 'react'
import QrSigner from './dist'

export default class Example extends Component {
  state = {
    scan: false,
    signature: ''
  }

  render () {
    const { scan, signature } = this.state;

    if (signature) {
      return <div>Signature: {signature}</div>;
    }

    return (
      <div>
        <QrSigner
          size={300}
          scan={scan}
          account='0x007311b88A03af17dbb37B47ab7C9Ab556708D56'
          rlp='0xeb808504a817c8008252089400255cf193f1ba6dd3ec08ebe62e393030f4dd34872386f26fc10000802a8080'
          onScan={(signature) => this.setState({ signature })}
        />
        <button onClick={() => this.setState({ scan: !this.state.scan })}>Toggle Scan</button>
      </div>
    )
  }
}
