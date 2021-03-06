/*!
 * Copyright (c) 2014-present Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import PropTypes from 'prop-types';
import React from 'react';
import cliqz from '../cliqz';
import SpeedDial from './speed-dial';
import Placeholder from './placeholder';
import AddSpeedDial from './add-speed-dial';
import { speedDialClickSignal, speedDialDeleteSignal } from '../services/telemetry/speed-dial';
import config from '../../config';

export default class SpeedDialsRow extends React.Component {
  showAddButton() {
    if (!this.state.isCustom) {
      return null;
    }
    return this.state.displayAddBtn();
  }

  componentWillMount() {
    this.setState({
      isCustom: this.props.type === 'custom',
      displayAddBtn: () => this.props.dials.length < config.constants.MAX_SPOTS,
    });
  }

  get pageNumber() {
    return this.props.currentPage || 1; // Page number is one-based
  }

  get getDials() {
    return (this.props.dials || []).slice(0, config.constants.MAX_SPOTS * this.pageNumber);
  }

  removeSpeedDial(dial, index) {
    speedDialDeleteSignal(this.state.isCustom, index);
    this.props.removeSpeedDial(dial, index);
  }

  visitSpeedDial(index) {
    speedDialClickSignal(this.state.isCustom, index);
    const isPrivateMode = !!(chrome && chrome.extension && chrome.extension.inIncognitoContext);
    if (!isPrivateMode) {
      cliqz.freshtab.speedDialClicked();
    }
  }

  getRealIndex(index) {
    return (config.constants.MAX_SPOTS * (this.pageNumber - 1)) + index;
  }

  render() {
    const placeholdersLength = (config.constants.MAX_SPOTS * this.pageNumber)
                              - this.getDials.length;
    const placeholders = [...Array(placeholdersLength)];

    return (
      <div>
        <div className="dials-row">
          {
            this.getDials
              .slice(config.constants.MAX_SPOTS * (this.pageNumber - 1),
                config.constants.MAX_SPOTS * this.pageNumber)
              .map((dial, i) =>
                (
                  <SpeedDial
                    key={dial.url}
                    dial={dial}
                    removeSpeedDial={() => this.removeSpeedDial(dial, this.getRealIndex(i))}
                    shouldAnimate={this.props.shouldAnimate}
                    updateModalState={this.props.updateModalState}
                    visitSpeedDial={() => this.visitSpeedDial(this.getRealIndex(i))}
                  />
                ))
          }
          {this.props.showPlaceholder
            && placeholders.map((el, ind) => {
              const placeholderKey = `placeholder-${ind}`;
              return (
                <Placeholder
                  key={placeholderKey}
                />
              );
            })
          }
          {this.showAddButton()
            && (
              <AddSpeedDial
                updateModalState={this.props.updateModalState}
              />
            )
          }
        </div>
      </div>
    );
  }
}

SpeedDialsRow.propTypes = {
  currentPage: PropTypes.number,
  dials: PropTypes.array,
  removeSpeedDial: PropTypes.func,
  shouldAnimate: PropTypes.bool,
  showPlaceholder: PropTypes.bool,
  type: PropTypes.string,
  updateModalState: PropTypes.func,
};
