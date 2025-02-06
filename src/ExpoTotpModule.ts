import { NativeModule, requireNativeModule } from 'expo';

import { ExpoTotpModuleEvents } from './ExpoTotp.types';

declare class ExpoTotpModule extends NativeModule<ExpoTotpModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoTotpModule>('ExpoTotp');
