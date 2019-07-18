# qr-signer

A React Component that handles generating and scanning QR codes compatible with Parity Signer mobile app ([iOS](https://itunes.apple.com/de/app/parity-signer/id1218174838?l=en&mt=8), [Android](https://play.google.com/store/apps/details?id=com.nativesigner)).

The generated QR code follows the [UOS](https://github.com/maciejhirsz/uos) specification.

## Install

```bash
npm install --save @parity/qr-signer
```

## Props

- `scan` - boolean, required - Whether to show the QR scanner or a QR code.
- `onScan` - function, required - Callback that will be executed with the data scanned from the QR code.
- `size` - number - Display width and height in pixels, QR code will be scaled if necessary.
- `network` - `'ethereumLegacy' | 'substrate'`, required if `scan === false` - The network on which we want to show the QR code. This determines the shape of `payload`.
- `payload` - object, required if `scan === false` - The payload to sign, depending on network.
- `onError` - (err: string) => void - A callback function which is called when there's an error encoding the payload.

The `payload` object's shape depends on the network. Below are defined how the payload should look in each network `'ethereumLegacy'` or `'substrate'`:

#### Ethereum Legacy

The `payload` object must be one of the two following variants:

```
{
  action: "signTransaction",
  data: {
    account: ADDRESS - string - Ethereum address, `0x` prefixed.
    rlp: RLP - RLP-encoded Ethereum transaction, `0x` prefixed.
  }
}
```

```
{
  action: "signData",
  data: {
    account: ADDRESS - string - Ethereum address, `0x` prefixed.
    data: RLP - Arbitrary byte data to sign, `0x` prefixed.
  }
}
```

#### Substrate

The `payload` object must have the following fields:

- `account` - 32-byte Uint8Array - The account with which we wish to sign the payload.
- `crypto` - `'ed25519' | 'sr25519'` - Cryptographic algorithm for accounts, either Ed25519 or Schnorr/Ristretto x25519.
- `action` - `'signTransaction' | 'signTransactionHash' | 'signMessage'` - The action to perform when signing. Determines the shape of `data`.
- `data` - Uint8Array - Data accompanying the action, depends on `action.`

| `action`                | `data` Type        | `data` description                                                                                                                                                                                                             |
| ----------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `'signTransaction'`     | Uint8Array         | SCALE encoding of the tuple of transaction items `(nonce, call, era_description, era_header)`. Note: PolkadotJS Api's `SignaturePayload` type might be useful, see [docs](https://polkadot.js.org/api/types/#substrate-types). |
| `'signTransactionHash'` | 32-byte Uint8Array | Blake2s 32-byte hash of the SCALE encoding of the tuple of transaction items `(nonce, call, era_description, era_header)`.                                                                                                     |
| `'signMessage'`         | Uint8Array         | Arbitrary message to sign.                                                                                                                                                                                                     |

## Example

```jsx
import React, { Component } from 'react';

import QrSigner from '@parity/qr-signer';

class Example extends Component {
  state = {
    scan: false,
    signature: ''
  };

  render() {
    const { scan, signature } = this.state;

    if (signature) {
      return <div>Signature: {signature}</div>;
    }

    return (
      <div>
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
          onScan={signature => this.setState({ signature })}
        />
        <button onClick={() => this.setState({ scan: !this.state.scan })}>
          Toggle Scan
        </button>
      </div>
    );
  }
}
```

See [`<Substrate />` example](./example/src/Substrate.js) for an example with Substrate.

## License

GPLv3
