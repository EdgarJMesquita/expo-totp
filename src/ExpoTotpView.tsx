import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoTotpViewProps } from './ExpoTotp.types';

const NativeView: React.ComponentType<ExpoTotpViewProps> =
  requireNativeView('ExpoTotp');

export default function ExpoTotpView(props: ExpoTotpViewProps) {
  return <NativeView {...props} />;
}
