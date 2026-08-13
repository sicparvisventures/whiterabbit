import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "@whiterabbit/design-tokens";

type Check = { label: string; detail: string; ready: boolean };

const checks: Check[] = [
  { label: "Application", detail: "Expo foundation available", ready: true },
  { label: "Deployment", detail: "Enrollment is required", ready: false },
  { label: "Camera", detail: "Permission not requested", ready: false },
  { label: "Policy", detail: "No signed package installed", ready: false },
];

export default function SentryScreen() {
  const [showDetails, setShowDetails] = useState(true);
  const [message, setMessage] = useState(
    "Complete enrollment before starting Sentry.",
  );
  const isReady = checks.every((check) => check.ready);

  return (
    <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.contextRow}>
          <View>
            <Text style={styles.eyebrow}>SYNTH-01 · BE-DEFENCE-ADMIN</Text>
            <Text style={styles.title}>Field node readiness</Text>
          </View>
          <View style={styles.syntheticPill}>
            <Text style={styles.syntheticText}>SYNTHETIC</Text>
          </View>
        </View>

        <View
          style={styles.cameraPlaceholder}
          accessible
          accessibilityLabel="Camera is not connected"
        >
          <View style={styles.cameraMark} />
          <Text style={styles.cameraTitle}>Camera not connected</Text>
          <Text style={styles.cameraCopy}>
            No permission has been requested and no frames are processed.
          </Text>
        </View>

        <View style={styles.stateCard}>
          <View style={styles.stateHeader}>
            <View style={styles.stoppedMark} />
            <View style={styles.stateText}>
              <Text style={styles.eyebrow}>NODE STATE</Text>
              <Text style={styles.stateTitle}>STOPPED</Text>
            </View>
            <Text style={styles.stateCount}>1 / 4 ready</Text>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => setShowDetails((value) => !value)}
            style={({ pressed }) => [
              styles.detailsToggle,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.detailsToggleText}>
              {showDetails ? "Hide readiness" : "Show readiness"}
            </Text>
            <Text style={styles.chevron}>{showDetails ? "−" : "+"}</Text>
          </Pressable>

          {showDetails ? (
            <View style={styles.checkList}>
              {checks.map((check) => (
                <View key={check.label} style={styles.checkRow}>
                  <View
                    style={[
                      styles.checkMark,
                      check.ready ? styles.readyMark : styles.blockedMark,
                    ]}
                  >
                    <Text
                      style={
                        check.ready ? styles.readyGlyph : styles.blockedGlyph
                      }
                    >
                      {check.ready ? "✓" : "!"}
                    </Text>
                  </View>
                  <View style={styles.checkCopy}>
                    <Text style={styles.checkLabel}>{check.label}</Text>
                    <Text style={styles.checkDetail}>{check.detail}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.guardrail}>
          <Text style={styles.guardrailTitle}>Foreground control only</Text>
          <Text style={styles.guardrailCopy}>
            WhiteRabbit will never imply that capture continues after iOS
            releases the camera.
          </Text>
        </View>

        <Pressable
          accessibilityHint="Explains why Sentry cannot start"
          accessibilityRole="button"
          disabled={isReady}
          onPress={() =>
            setMessage(
              "Enrollment, camera permission and a signed policy are still required.",
            )
          }
          style={({ pressed }) => [
            styles.startButton,
            !isReady && styles.startButtonBlocked,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.startButtonText}>Start Sentry</Text>
        </Pressable>
        <Text accessibilityLiveRegion="polite" style={styles.message}>
          {message}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.color.canvas },
  content: {
    gap: theme.space.medium,
    padding: theme.space.medium,
    paddingBottom: theme.space.xlarge,
  },
  contextRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.space.small,
  },
  eyebrow: {
    color: theme.color.textMuted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  title: {
    marginTop: 5,
    color: theme.color.text,
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.7,
  },
  syntheticPill: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: theme.radius.pill,
    backgroundColor: "#EAF2FD",
  },
  syntheticText: {
    color: theme.color.primary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.7,
  },
  cameraPlaceholder: {
    minHeight: 236,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.space.large,
    borderRadius: theme.radius.large,
    backgroundColor: theme.color.cameraBackdrop,
  },
  cameraMark: {
    width: 54,
    height: 38,
    marginBottom: 18,
    borderWidth: 2,
    borderColor: "#91A4BB",
    borderRadius: 10,
  },
  cameraTitle: { color: "#F5F8FB", fontSize: 18, fontWeight: "700" },
  cameraCopy: {
    maxWidth: 280,
    marginTop: 8,
    color: "#AFC0D2",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
  stateCard: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.color.border,
    borderRadius: theme.radius.large,
    backgroundColor: theme.color.panel,
  },
  stateHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: theme.space.medium,
    borderBottomWidth: 1,
    borderBottomColor: theme.color.border,
  },
  stoppedMark: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: theme.status.critical.color,
  },
  stateText: { flex: 1 },
  stateTitle: {
    marginTop: 3,
    color: theme.status.critical.color,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  stateCount: { color: theme.color.textMuted, fontSize: 12, fontWeight: "700" },
  detailsToggle: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.space.medium,
  },
  detailsToggleText: {
    color: theme.color.text,
    fontSize: 14,
    fontWeight: "700",
  },
  chevron: { color: theme.color.primary, fontSize: 22 },
  checkList: {
    paddingHorizontal: theme.space.medium,
    paddingBottom: theme.space.small,
  },
  checkRow: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: theme.color.border,
  },
  checkMark: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  readyMark: { backgroundColor: theme.status.healthy.surface },
  blockedMark: { backgroundColor: theme.status.attention.surface },
  readyGlyph: { color: theme.status.healthy.color, fontWeight: "900" },
  blockedGlyph: { color: theme.status.attention.color, fontWeight: "900" },
  checkCopy: { flex: 1 },
  checkLabel: { color: theme.color.text, fontSize: 14, fontWeight: "700" },
  checkDetail: { marginTop: 3, color: theme.color.textMuted, fontSize: 12 },
  guardrail: {
    padding: theme.space.medium,
    borderWidth: 1,
    borderColor: "#B8CBE3",
    borderRadius: theme.radius.medium,
    backgroundColor: "#F0F6FD",
  },
  guardrailTitle: {
    color: theme.color.primary,
    fontSize: 13,
    fontWeight: "800",
  },
  guardrailCopy: {
    marginTop: 5,
    color: theme.color.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  startButton: {
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.medium,
    backgroundColor: theme.color.primary,
  },
  startButtonBlocked: { backgroundColor: theme.color.borderStrong },
  startButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  message: {
    color: theme.color.textMuted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  pressed: { opacity: 0.72 },
});
