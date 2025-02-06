import { registerWebModule, NativeModule } from 'expo';

import { ExpoTotpModuleEvents } from './ExpoTotp.types';

class ExpoTotpModule extends NativeModule<ExpoTotpModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoTotpModule);
