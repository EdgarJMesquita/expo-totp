import { NativeModule, requireNativeModule } from "expo";
import { EventSubscription } from "expo-modules-core";

import { ExpoTotpModuleEvents, TotpOptions } from "./ExpoTotp.types";

declare class ExpoTotpModule extends NativeModule<ExpoTotpModuleEvents> {
  getTotp(secretKey: string, options?: TotpOptions): Promise<void>;
  startUpdates(secretKey: string, options?: TotpOptions): Promise<void>;
  stopUpdates(): Promise<void>;
  addListener<EventName extends "onTotpUpdate">(
    eventName: EventName,
    listener: ExpoTotpModuleEvents[EventName]
  ): EventSubscription;
  /**
   * @deprecated
   */
  start(secretKey: string, options?: TotpOptions): Promise<void>;
  /**
   * @deprecated
   */
  stop(): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoTotpModule>("ExpoTotp");
