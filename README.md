# expo-totp

A library that providers client side TOTP(Time-based One-Time Password) generation.

Made with Expo Modules API.

_expo-totp_ is not available in Expo Go, learn more about [development builds](https://docs.expo.dev/develop/development-builds/introduction/).

# API documentation

- [Documentation for the main branch](https://github.com/expo/expo/blob/main/docs/pages/versions/unversioned/sdk/totp.md)
- [Documentation for the latest stable release](https://docs.expo.dev/versions/latest/sdk/totp/)

# Installation in managed Expo projects

For [managed](https://docs.expo.dev/archive/managed-vs-bare/) Expo projects, please follow the installation instructions in the [API documentation for the latest stable release](#api-documentation). If you follow the link and there is no documentation available then this library is not yet usable within managed projects &mdash; it is likely to be included in an upcoming Expo SDK release.

# Installation in bare React Native projects

For bare React Native projects, you must ensure that you have [installed and configured the `expo` package](https://docs.expo.dev/bare/installing-expo-modules/) before continuing.

### Add the package to your npm dependencies

```
npx expo install expo-totp
```

# Demo

<a href="https://github.com/EdgarJMesquita/expo-totp"><img src="./docs/assets/demo.gif" width="360"></a>

# Usage

```typescript
import { useExpoTotp } from "expo-totp";
import { Button, SafeAreaView, StyleSheet, Text } from "react-native";

export default function App() {
  const totp = useExpoTotp();

  const start = () => {
    // Supports only ASCII secret keys
    totp.start("MY_SUPER_SECRET_KEY", {
      algorithm: "SHA512",
      digits: 6,
      interval: 30,
    });
  };

  const stop = () => {
    totp.stop();
  };

  return (
    <SafeAreaView style={styles.container}>
      {!!totp.code && (
        <>
          <Text style={styles.code}>{totp.code}</Text>
          <Text style={styles.text}>Time: {totp.remainingTime} s</Text>
          <Text style={styles.text}>
            Progress: {totp.progress?.toFixed(1)}%
          </Text>
        </>
      )}
      <Button title="Start" onPress={start} />
      <Button title="Stop" onPress={stop} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    alignSelf: "center",
  },
  code: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 8,
    alignSelf: "center",
  },
  container: {
    flex: 1,
    paddingHorizontal: 32,
    gap: 16,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignContent: "center",
  },
});

```

# API

```typescript
import ExpoTotp, { useExpoTotp } from "expo-totp";
```

## Hooks

### `useExpoTotp()`

Easy to use hook for obtain otp info, start and stop.

```typescript
const { code, progress, remainingTime, start, stop } = useExpoTotp();
```

## Methods

### `getTotp()`

Compute TOTP once

```typescript
const totp = await ExpoTotp.getTotp("MY_SUPER_SECRET_KEY",
  interval: 30,
  digits: 6,
  algorithm: "SHA512"
)
```

### `startUpdates()`

Start TOTP generation

```typescript
ExpoTotp.startUpdates("YOUR_SUPER_SECRET_KEY", {
  interval: 30,
  digits: 6,
  algorithm: "SHA512",
});
```

### `addListener()`

Listen for updates with ExpoTotp.addListener()

```typescript
useEffect(() => {
  const listener = ExpoTotp.addListener("onTotpUpdate", (totp: TotpPayload) => {
    // your logic goes here...
  });
  return () => listener.remove();
}, []);
```

or

```typescript
import { useEvent } from "expo";
const totp = useEvent(ExpoTotp, "onTotpUpdate");
```

### `stopUpdates()`

Stop any TOTP generation

```typescript
ExpoTotp.stopUpdates();
```

## Interfaces

### `TotpOptions`

Defines options for TOTP generation

```typescript
type TotpOptions = {
  interval: number;
  digits: number;
  algorithm: HmacAlgorithm;
};
```

### `HmacAlgorithm`

Defines options for TOTP generation

```typescript
type HmacAlgorithm = "SHA512" | "SHA384" | "SHA256" | "SHA1" | "MD5";
```

| Property    | Type            | Default  | Description           |
| ----------- | --------------- | -------- | --------------------- |
| `interval`  | `number `       | `30`     | Interval in seconds   |
| `digits`    | `number`        | `6`      | Amount of digits      |
| `algorithm` | `HmacAlgorithm` | `SHA512` | Algorithm to be used. |

### `TotpPayload`

Defines the payload for `onTotpUpdate` event listener

```typescript
export type TotpPayload = {
  code: string;
  remainingTime: number;
  progress: number;
};
```

# Contributing

Contributions are very welcome! Please refer to guidelines described in the [contributing guide](https://github.com/expo/expo#contributing).
