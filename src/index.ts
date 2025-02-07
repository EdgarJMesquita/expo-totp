// Reexport the native module. On web, it will be resolved to ExpoTotpModule.web.ts
// and on native platforms to ExpoTotpModule.ts
export { default } from "./ExpoTotpModule";
export * from "./ExpoTotp.types";
