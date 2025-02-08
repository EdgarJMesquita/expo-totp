export type ExpoTotpModuleEvents = {
  onTotpUpdate: (params: TotpPayload) => void;
};

export type TotpPayload = {
  code: string;
  remainingTime: number;
  progress: number;
};

export type HmacAlgorithm = "SHA512" | "SHA384" | "SHA256" | "SHA1" | "MD5";

export type TotpOptions = {
  /**
   * @default
   * 30
   */
  interval?: number;

  /**
   * @default
   * 6
   */
  digits?: number;

  /**
   * @default
   * SHA512
   */
  algorithm?: HmacAlgorithm;
};
