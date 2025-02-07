import { NativeModule, requireNativeModule } from "expo";

import { ExpoTotpModuleEvents, TotpOptions } from "./ExpoTotp.types";

declare class ExpoTotpModule extends NativeModule<ExpoTotpModuleEvents> {
  start(secretKey: string, options?: Partial<TotpOptions>): Promise<void>;
  stop(): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoTotpModule>("ExpoTotp");
