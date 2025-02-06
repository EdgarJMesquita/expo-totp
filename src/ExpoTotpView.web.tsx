import * as React from 'react';

import { ExpoTotpViewProps } from './ExpoTotp.types';

export default function ExpoTotpView(props: ExpoTotpViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
