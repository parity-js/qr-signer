# qr-signer

A React Component that handles generating and scanning QR codes compatible with Parity Signer mobile app ([iOS](https://itunes.apple.com/de/app/parity-signer/id1218174838?l=en&mt=8), [Android](https://play.google.com/store/apps/details?id=com.nativesigner)).

## Install

```bash
npm install --save @parity/qr-signer
```

## Props

- `scan` - boolean, required - Whether to show the QR scanner or a QR code.
- `onScan` - function, required - Callback that will be executed with the data scanned from the QR code.
- `size` - number - Display width and height in pixels, QR code will be scaled if necessary.
- `account` - string, required if `scan === false` - Ethereum address, `0x` prefixed.
- `rlp` - string, required if `scan === false` - RLP-encoded Ethereum transaction, `0x` prefixed.

## Example

```jsx
import React, { Component } from 'react'

import QrSigner from '@parity/qr-signer'

class Example extends Component {
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
```

## License

GPLv3
