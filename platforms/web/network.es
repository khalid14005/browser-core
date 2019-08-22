/*!
 * Copyright (c) 2014-present Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import window from './window';
// TODO: get connection type
export default {
  type: window.onLine ? 'unknown' : 'none'
};

export function addConnectionChangeListener() {
}

export function removeConnectionChangeListener() {
}