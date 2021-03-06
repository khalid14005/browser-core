/*!
 * Copyright (c) 2014-present Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import {
  $cliqzResults,
  blurUrlBar,
  checkLocationButtons,
  checkMainResult,
  checkMap,
  checkParent,
  checkTableOfShowings,
  dropdownClick,
  fillIn,
  mockSearch,
  patchGeolocation,
  prefs,
  respondWithSnippet,
  waitFor,
  waitForPopup,
  win,
  withHistory,
} from './helpers';
import { notLocalResults, localResults } from '../../core/integration/fixtures/resultsCinema';
import config from '../../../core/config';

export default function () {
  describe('for cinema SC', function () {
    const query = 'yorck.de';
    patchGeolocation({ latitude: 48.15, longitude: 11.62 });

    before(function () {
      win.preventRestarts = true;
    });

    after(function () {
      win.preventRestarts = false;
    });

    context('(UI)', function () {
      context('with "always ask" share location settings', function () {
        before(async function () {
          await blurUrlBar();
          prefs.set('share_location', 'ask');
          await mockSearch({ results: notLocalResults });
          withHistory([]);
          fillIn(query);
          await waitForPopup(1);
        });

        after(async function () {
          await blurUrlBar();
          prefs.set('share_location', config.settings.geolocation || 'ask');
        });

        checkMainResult({ $result: $cliqzResults });
        checkParent({ $result: $cliqzResults, results: notLocalResults });
        checkMap({ $result: $cliqzResults, results: notLocalResults, isDistanceShown: false });
        checkLocationButtons({ $result: $cliqzResults, areButtonsPresent: true });
        checkTableOfShowings({
          $result: $cliqzResults,
          results: notLocalResults,
          isExpanded: false,
          activeTabIdx: 0
        });
      });

      context('with "never" share location settings', function () {
        before(async function () {
          await blurUrlBar();
          prefs.set('share_location', 'no');
          await mockSearch({ results: notLocalResults });
          withHistory([]);
          fillIn(query);
          await waitForPopup(1);
        });

        after(async function () {
          await blurUrlBar();
          prefs.set('share_location', config.settings.geolocation || 'ask');
        });

        checkMainResult({ $result: $cliqzResults });
        checkParent({ $result: $cliqzResults, results: notLocalResults });
        checkMap({ $result: $cliqzResults, results: notLocalResults, isDistanceShown: false });
        checkLocationButtons({ $result: $cliqzResults, areButtonsPresent: false });
        checkTableOfShowings({
          $result: $cliqzResults,
          results: notLocalResults,
          isExpanded: false,
          activeTabIdx: 0
        });
      });

      context('with "always" share location settings', function () {
        before(async function () {
          await blurUrlBar();
          prefs.set('share_location', 'yes');
          await mockSearch({ results: localResults });
          withHistory([]);
          fillIn('cinemaxx');
          await waitForPopup(1);
          await waitFor(() => $cliqzResults.querySelector(`.result[data-url="${localResults[0].url}"]`));
        });

        after(async function () {
          await blurUrlBar();
          prefs.set('share_location', config.settings.geolocation || 'ask');
        });

        checkMainResult({ $result: $cliqzResults });
        checkParent({ $result: $cliqzResults, results: localResults });
        checkMap({ $result: $cliqzResults, results: localResults, isDistanceShown: true });
        checkLocationButtons({ $result: $cliqzResults, areButtonsPresent: false });
        checkTableOfShowings({
          $result: $cliqzResults,
          results: localResults,
          isExpanded: false,
          activeTabIdx: 0
        });
      });
    });

    context('(interactions)', function () {
      describe('clicking on the "Show more" button', function () {
        before(async function () {
          await blurUrlBar();
          prefs.set('share_location', 'no');
          await mockSearch({ results: notLocalResults });
          withHistory([]);
          fillIn(query);
          await waitForPopup(1);
          await dropdownClick('.expand-btn');
          await waitFor(async () => {
            const $timeRows = await $cliqzResults.querySelectorAll('.show-time-row');
            return $timeRows.length > 2;
          });
        });

        after(async function () {
          await blurUrlBar();
          prefs.set('share_location', config.settings.geolocation || 'ask');
        });

        checkMainResult({ $result: $cliqzResults });
        checkParent({ $result: $cliqzResults, results: notLocalResults });
        checkMap({ $result: $cliqzResults, results: notLocalResults, isDistanceShown: false });
        checkTableOfShowings({
          $result: $cliqzResults,
          results: notLocalResults,
          isExpanded: true,
          activeTabIdx: 0
        });
      });

      describe('clicking on the next day tab', function () {
        before(async function () {
          await blurUrlBar();
          prefs.set('share_location', 'no');
          await mockSearch({ results: notLocalResults });
          withHistory([]);
          fillIn(query);
          await waitForPopup(1);
          await dropdownClick('#tab-1');
          await waitFor(async () => {
            const $tab0 = await $cliqzResults.querySelector('#tab-0');
            return !$tab0.classList.contains('checked');
          });
        });

        after(async function () {
          await blurUrlBar();
          prefs.set('share_location', config.settings.geolocation || 'ask');
        });

        checkMainResult({ $result: $cliqzResults });
        checkParent({ $result: $cliqzResults, results: notLocalResults });
        checkMap({ $result: $cliqzResults, results: notLocalResults, isDistanceShown: false });
        checkTableOfShowings({
          $result: $cliqzResults,
          results: notLocalResults,
          isExpanded: false,
          activeTabIdx: 1
        });
      });

      xdescribe('clicking on the "Show once" location button', function () {
        const allowOnceBtnSelector = '.location-allow-once';

        before(async function () {
          await blurUrlBar();
          prefs.set('share_location', 'ask');
          await mockSearch({ results: notLocalResults });
          withHistory([]);
          fillIn(query);
          await waitForPopup(2);

          respondWithSnippet({ results: localResults });
          $cliqzResults.querySelector(allowOnceBtnSelector).click();
          await waitFor(() => !$cliqzResults.querySelector(allowOnceBtnSelector));
        });

        after(async function () {
          await blurUrlBar();
          prefs.set('share_location', config.settings.geolocation || 'ask');
        });

        checkMainResult({ $result: $cliqzResults });
        checkLocationButtons({ $result: $cliqzResults, areButtonsPresent: false });
        checkParent({ $result: $cliqzResults, results: localResults });
        checkMap({ $result: $cliqzResults, results: localResults, isDistanceShown: true });
        checkTableOfShowings({
          $result: $cliqzResults,
          results: localResults,
          isExpanded: false,
          activeTabIdx: 0
        });
      });

      xdescribe('clicking on the "Always show" location button', function () {
        const alwaysShowBtnSelector = '.location-always-show';

        before(async function () {
          await blurUrlBar();
          prefs.set('share_location', 'ask');
          await mockSearch({ results: notLocalResults });
          withHistory([]);
          fillIn(query);
          await waitForPopup(2);

          respondWithSnippet({ results: localResults });
          $cliqzResults.querySelector(alwaysShowBtnSelector).click();
          await waitFor(() => !$cliqzResults.querySelector(alwaysShowBtnSelector));
        });

        after(async function () {
          await blurUrlBar();
          prefs.set('share_location', config.settings.geolocation || 'ask');
        });

        checkMainResult({ $result: $cliqzResults });
        checkLocationButtons({ $result: $cliqzResults, areButtonsPresent: false });
        checkParent({ $result: $cliqzResults, results: localResults });
        checkMap({ $result: $cliqzResults, results: localResults, isDistanceShown: true });
        checkTableOfShowings({
          $result: $cliqzResults,
          results: localResults,
          isExpanded: false,
          activeTabIdx: 0
        });
      });
    });
  });
}
