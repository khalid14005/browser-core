/* eslint-disable */

"use strict";

const base = require("./common/system");
const urls = require("./common/urls-cliqz");
const settings = require("./common/amo-settings");

module.exports = {
  "platform": "webextension",
  "specific": "amo",
  "baseURL": "/modules/",
  "pack": "web-ext build -s build -a .",
  "publish": "",
  "settings": Object.assign({}, urls, settings, {
    'OFFERS_BUTTON': true,
  }),
  "default_prefs" : {
    "freshtab.search.mode": "search",
    "modules.history-analyzer.enabled": false,
    "modules.anolysis.enabled": false,
    "showConsoleLogs": true,
    "modules.browser-panel.enabled": false,
    "modules.offers-cc.enabled": false,
  },
  "modules": [
    "core",
    "core-cliqz",
    "dropdown",
    "static",
    "geolocation",
    "last-query",
    "human-web",
    // "omnibox",
    // "context-menu", TODO
    "freshtab",
    "webrequest-pipeline",
    "performance",
    "hpnv2",
    "myoffrz-helper",
    "offers-banner",
    "offers-cc",
    "offers-v2",
    "popup-notification",
    "history-analyzer",
    "browser-panel",
    "control-center",
    "message-center",
    "offboarding",
    "anolysis",
    "anolysis-cc",
    "market-analysis",
    "abtests",
    "search",
    "webextension-specific",
  ],
  "bundles": [
    "hpnv2/worker.wasm.bundle.js",
    "hpnv2/worker.asmjs.bundle.js",
    "core/content-script.bundle.js",
    "webextension-specific/app.bundle.js",
    "freshtab/home.bundle.js",
    "dropdown/dropdown.bundle.js",
    "control-center/control-center.bundle.js",
    "browser-panel/browser-panel.bundle.js",
    "offers-cc/offers-cc.bundle.js",
    "offers-banner/app.bundle.js",
  ],
  system: Object.assign({}, base.systemConfig, {
    map: Object.assign({}, base.systemConfig.map, {
      "ajv": "node_modules/ajv/dist/ajv.min.js",
      "jsep": "modules/vendor/jsep.min.js",
    })
  }),
  builderDefault: Object.assign({}, base.builderConfig, {
    externals: base.builderConfig.externals.concat("@cliqz-oss/dexie", "rxjs"),
    globalDeps: Object.assign({}, base.builderConfig.globalDeps, {
      "@cliqz-oss/dexie": "Dexie",
      "rxjs": "Rx",
      "rxjs/Rx.js": "Rx",
    }),
  })
}