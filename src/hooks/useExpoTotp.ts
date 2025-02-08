import { useCallback, useEffect, useState } from "react";

import ExpoTotp from "../";
import { TotpOptions, TotpPayload } from "../ExpoTotp.types";

export function useExpoTotp() {
  const [totp, setTotp] = useState<TotpPayload | null>(null);

  const start = useCallback((secretKey: string, options?: TotpOptions) => {
    ExpoTotp.startUpdates(secretKey, options);
  }, []);

  const stop = useCallback(() => {
    ExpoTotp.stopUpdates();
    setTotp(null);
  }, []);

  useEffect(() => {
    const listener = ExpoTotp.addListener("onTotpUpdate", setTotp);
    return () => {
      listener.remove();
      stop();
    };
  }, []);

  return {
    code: totp?.code || null,
    progress: totp?.progress || null,
    remainingTime: totp?.remainingTime || null,
    start,
    stop,
  };
}
