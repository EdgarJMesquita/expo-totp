import { useExpoTotp } from "expo-totp";
import ExpoTotpModule from "expo-totp/ExpoTotpModule";
import { useCallback, useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useAnimatedValue,
  View,
} from "react-native";

export default function App() {
  const totp = useExpoTotp();

  const animation = useAnimatedValue(0);
  const initialProgress = useRef(false);

  const animationWidth = animation.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  const getSingleTotp = useCallback(async () => {
    try {
      const totpInfo = await ExpoTotpModule.getTotp("MY_SUPER_SECRET_KEY");
      Alert.alert("TOTP", JSON.stringify(totpInfo, null, 2));
    } catch (error) {
      console.error(error);
    }
  }, []);

  const start = useCallback(async () => {
    try {
      await totp.start("MY_SUPER_SECRET_KEY", {
        algorithm: "SHA512",
        digits: 6,
        interval: 30,
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const stop = useCallback(() => {
    totp.stop();
    initialProgress.current = false;
    animation.stopAnimation();
  }, []);

  useEffect(() => {
    if (!totp?.progress) {
      return;
    }
    Animated.timing(animation, {
      toValue: initialProgress ? totp.progress : 100,
      useNativeDriver: false,
      duration: 100,
    }).start(() => {
      initialProgress.current = true;
      Animated.timing(animation, {
        toValue: 0,
        duration: totp?.remainingTime! * 1000,
        useNativeDriver: false,
      }).start();
    });
  }, [totp?.code]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Module API Example</Text>
        <Group name="Controls">
          <Button title="Start Updates" onPress={start} />
          <Button title="Stop Updates" onPress={stop} />
          <Button title="Get Single Totp" onPress={getSingleTotp} />
        </Group>
        <Group name="Totp">
          {!!totp.code && (
            <>
              <Text style={styles.code}>{totp?.code}</Text>
              <View style={styles.progressContainer}>
                <Animated.View
                  style={[
                    styles.progress,
                    {
                      width: animationWidth,
                    },
                  ]}
                />
              </View>
              <Text style={styles.text}> {totp?.remainingTime} s</Text>
            </>
          )}
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    alignSelf: "center",
    marginTop: 10,
  },
  code: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 8,
    alignSelf: "center",
    marginBottom: 12,
  },
  group: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
  view: {
    flex: 1,
    height: 200,
  },
  progressContainer: {
    marginTop: 8,
    height: 8,
    width: "100%",
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  progress: {
    height: 8,
    backgroundColor: "blue",
  },
});
