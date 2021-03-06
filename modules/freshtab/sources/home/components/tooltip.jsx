/*!
 * Copyright (c) 2014-present Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import PropTypes from 'prop-types';

function Tooltip({
  isOpen,
  title,
  description,
  explore,
  later,
  handleExploreClick,
  handleLaterClick,
  closeTooltip,
}) {
  return (
    <div
      role="presentation"
      className={`tooltip ${isOpen ? '' : 'closed'}`}
    >
      <div className="row">
        <aside className="tooltip-icon">
          <img src="./images/settings-icon.svg" alt="settings icon" />
        </aside>
        <div className="tooltip-content">
          <h1 className="header">{title}</h1>
          <p className="description">{description}</p>
          <span className="btn-wrap">
            <button
              id="explore"
              type="button"
              className="explore"
              onClick={handleExploreClick}
            >
              {explore}
            </button>
            <button
              type="button"
              className="later"
              onClick={handleLaterClick}
            >
              {later}
            </button>
          </span>
        </div>
        <aside className="tooltip-close">
          <button className="close" onClick={closeTooltip} type="button">X</button>
        </aside>
      </div>
    </div>
  );
}

Tooltip.propTypes = {
  isOpen: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  explore: PropTypes.string,
  later: PropTypes.string,
  handleExploreClick: PropTypes.func,
  handleLaterClick: PropTypes.func,
  closeTooltip: PropTypes.func,
};

export default Tooltip;
