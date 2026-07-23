import { Color } from 'expo-router';
import { Platform } from 'react-native';

export const colors = {
  background: Platform.select({
    ios: Color.ios.systemGroupedBackground,
    default: '#f4f6fb',
  })!,
  surface: Platform.select({
    ios: Color.ios.secondarySystemGroupedBackground,
    default: '#ffffff',
  })!,
  label: Platform.select({
    ios: Color.ios.label,
    default: '#172033',
  })!,
  secondaryLabel: Platform.select({
    ios: Color.ios.secondaryLabel,
    default: '#687086',
  })!,
  separator: Platform.select({
    ios: Color.ios.separator,
    default: '#dfe3ec',
  })!,
  primary: Platform.select({
    ios: Color.ios.systemIndigo,
    default: '#5b5bd6',
  })!,
  success: Platform.select({
    ios: Color.ios.systemGreen,
    default: '#168a50',
  })!,
  danger: Platform.select({
    ios: Color.ios.systemRed,
    default: '#c93445',
  })!,
  white: '#ffffff',
  artworkFallback: '#e9e9fb',
};
