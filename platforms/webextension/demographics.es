import { getPref } from './prefs';
import config from '../core/config';

export function getUserAgent() {
  return navigator.userAgent;
}

export function getDistribution() {
  return getPref('distribution', '');
}

export function getInstallDate() {
  return getPref('install_date', '');
}

export function getChannel() {
  return config.settings.channel || '';
}

export function getCountry() {
  return getPref('config_location', '');
}
