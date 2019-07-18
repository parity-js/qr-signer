import React, { Component } from 'react';

import EthereumLegacy from './EthereumLegacy';
import Substrate from './Substrate';

export default class Example extends Component {
  render() {
    return (
      <div>
        <EthereumLegacy />

        <hr />

        <Substrate />
      </div>
    );
  }
}
