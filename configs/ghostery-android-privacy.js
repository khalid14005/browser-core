/*!
 * Copyright (c) 2014-present Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const urls = require('./common/urls-ghostery');
const publish = require('./common/publish');
const base = require('./common/system');

module.exports = {
  platform: 'webextension',
  brocfile: 'Brocfile.ghostery-mobile.js',
  baseURL: '/cliqz/',
  pack: [
    `(jq '.version=\\"${process.env.VERSION}\\"' package.json > package-new.json)`,
    'mv package.json package-old.json',
    'mv package-new.json package.json',
    'npm pack',
    'mv package-old.json package.json',
  ].join(' && '),
  publish: publish.toEdge('browser-core', 'ghostery-mobile'),
  sourceMaps: false,
  versionPrefix: '7',
  isMobile: true,
  settings: Object.assign({}, urls, {
    channel: 'MA50',
    MSGCHANNEL: 'web-extension',
    ATTRACK_TELEMETRY_PROVIDER: 'hpnv2',
    HW_CHANNEL: 'ghostery',
    ALLOWED_COUNTRY_CODES: ['de', 'at', 'ch', 'es', 'us', 'fr', 'nl', 'gb', 'it', 'be', 'se', 'dk', 'fi', 'cz', 'gr', 'hu', 'ro', 'no', 'ca', 'au', 'ru', 'ua', 'in', 'pl', 'jp', 'br', 'mx', 'cn', 'ar'],
    antitrackingPlaceholder: 'ghostery',
    antitrackingHeader: 'Ghostery-AntiTracking',
    // mobile cards
    RESULTS_PROVIDER_ORDER: ['calculator', 'history', 'cliqz', 'querySuggestions', 'instant'],
    CLEAR_RESULTS_AT_SESSION_START: false,
    THROTTLE_QUERIES: 50
  }),
  default_prefs: {
    'modules.antitracking.enabled': true,
    'modules.adblocker.enabled': true,
    'modules.insights.enabled': false,
    'modules.webextension-specific.enabled': false,
    'cliqz-adb': 1,
    attrackBloomFilter: false,
    humanWeb: false,
    attrackTelemetryMode: 0,
    attrackDefaultAction: 'placeholder',
    sendAntiTrackingHeader: false,
    telemetry: false,
    attrackCookieTrustReferers: true,
  },
  bundles: [
    'core/content-script.bundle.js',
    'cliqz-android/cliqz-search-engines.bundle.js',
    'cliqz-android/cliqz-native-bridge.bundle.js',
    'cliqz-android/cliqz-app-constants.bundle.js',
    'webextension-specific/experimental-apis/cliqz/api.bundle.js',
  ],
  modules: [
    'core',
    'antitracking',
    'webrequest-pipeline',
    'adblocker',
    'anolysis',
    // mobile cards
    'core-cliqz',
    'abtests-legacy',
    'cliqz-android',
    'webextension-specific',
    'telemetry',
  ],
  builderDefault: base.builderConfig,
  babelPlugins: [
    ['react-native-web', { commonjs: true }]
  ]
};
