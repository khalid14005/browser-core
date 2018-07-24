/* eslint func-names: 'off' */

import prefs from '../core/prefs';
import background from '../core/base/background';
import bindObjectFunctions from '../core/helpers/bind-functions';

class TypeRemover {
  constructor() {
    this.name = 'type_filter';
    this.availableTypes = [];
    ['type1', 'type2', 'type3'].forEach((t) => {
      if (prefs.get(`type_filter_${t}`, true)) {
        this.availableTypes.push(t);
      }
    });
  }

  afterResults(_, originalResults) {
    const resultsType = originalResults.response.choice;
    const telemetrySignal = { removed: false };
    let res = originalResults.response.results;
    if (resultsType && this.availableTypes.indexOf(resultsType) === -1) {
      res = [];
      telemetrySignal.removed = true;
      telemetrySignal.type = resultsType;
    }

    const response = Object.assign({}, originalResults.response, {
      results: res,
      telemetrySignal,
    });

    return Promise.resolve(Object.assign({}, originalResults, {
      response,
    }));
  }

  updateType(type, value) {
    if (this.availableTypes.indexOf(type) !== -1 && !value) {
      this.availableTypes.splice(this.availableTypes.indexOf(type), 1);
    } else if (this.availableTypes.indexOf(type) === -1 && value) {
      this.availableTypes.push(type);
    }
  }
}

export default background({
  init() {
    this.remover = new TypeRemover();
    bindObjectFunctions(this.actions, this);
  },

  unload() {},
  beforeBrowserShutdown() {

  },

  events: {
    'type_filter:change': function (data) {
      this.remover.updateType(data.target, data.status);
    },
  },
});
