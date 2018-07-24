import { Platform, NativeModules } from 'react-native';
import prefs from '../core/prefs';

export function getUserAgent() {
  if (Platform.OS === 'ios') {
    // Because `core/demographics` expect a normal user agent, we fake one using
    // the values of Platform.OS and Platform.Version. It will be converted into
    // something like: { name: 'iOS', version: '9.3.5' }
    return `iPhone OS ${Platform.Version.replace(/[.]/g, '_')} like Mac OS X`;
  }

  return `android ${Platform.Version}`;
}

export function getDistribution() {
  // On mobile `distribution` is not set, and we only make use of `channel`.
  return '';
}

export function getInstallDate() {
  return prefs.get('install_date', '');
}

export function getChannel() {
  return NativeModules.UserAgentConstants.channel;
}

export function getCountry() {
  return prefs.get('config_location', '');
}
