import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { theme } from "@whiterabbit/design-tokens";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: theme.color.canvas },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: theme.color.panel },
          headerTintColor: theme.color.text,
          headerTitleStyle: { fontWeight: "700" },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Sentry" }} />
      </Stack>
    </>
  );
}
