import { describe, expect, it } from "vitest";

import {
  appendCandidateReviewInputSchema,
  baselineCandidateSchema,
  canTransitionCandidateState,
} from "./candidate";

const validCandidate = {
  candidateId: "0198a1e5-5468-7e31-85f3-004f3ea1a822",
  deploymentId: "0198a1e5-5468-6e22-9b70-a55af4fc1836",
  sourceEventId: "0198a1e5-5468-7e22-9b70-a55af4fc1836",
  candidateType: "ALPR",
  status: "CANDIDATE",
  version: 1,
  classification: "OFFICIAL",
  dataNature: "SYNTHETIC",
  occurredAt: "2026-08-13T17:15:00.000Z",
  updatedAt: "2026-08-13T17:15:01.000Z",
  requiresHumanReview: true,
} as const;

describe("baselineCandidateSchema", () => {
  it("accepts a minimized candidate projection", () => {
    expect(baselineCandidateSchema.parse(validCandidate)).toEqual(
      validCandidate,
    );
  });

  it("rejects biometric candidates from the baseline queue", () => {
    expect(
      baselineCandidateSchema.safeParse({
        ...validCandidate,
        candidateType: "BIOMETRIC",
      }).success,
    ).toBe(false);
  });

  it("rejects plate, identity and evidence details from the queue projection", () => {
    for (const forbidden of [
      { rawPlate: "forbidden" },
      { subjectRef: "person-1" },
      { evidenceUrl: "https://example.invalid/evidence" },
    ]) {
      expect(
        baselineCandidateSchema.safeParse({
          ...validCandidate,
          ...forbidden,
        }).success,
      ).toBe(false);
    }
  });

  it("requires a positive optimistic-concurrency version", () => {
    for (const version of [0, -1, 1.5]) {
      expect(
        baselineCandidateSchema.safeParse({ ...validCandidate, version })
          .success,
      ).toBe(false);
    }
  });
});

describe("canTransitionCandidateState", () => {
  it.each([
    ["CANDIDATE", "IN_REVIEW"],
    ["CANDIDATE", "EXPIRED"],
    ["IN_REVIEW", "CONFIRMED"],
    ["IN_REVIEW", "REJECTED"],
    ["IN_REVIEW", "INCONCLUSIVE"],
    ["IN_REVIEW", "EXPIRED"],
    ["CONFIRMED", "RETRACTED"],
    ["REJECTED", "RETRACTED"],
    ["INCONCLUSIVE", "RETRACTED"],
  ] as const)("allows %s -> %s", (current, next) => {
    expect(canTransitionCandidateState(current, next)).toBe(true);
  });

  it.each([
    ["CANDIDATE", "CONFIRMED"],
    ["CONFIRMED", "IN_REVIEW"],
    ["RETRACTED", "CANDIDATE"],
    ["EXPIRED", "IN_REVIEW"],
    ["REJECTED", "CONFIRMED"],
  ] as const)("denies %s -> %s", (current, next) => {
    expect(canTransitionCandidateState(current, next)).toBe(false);
  });
});

describe("appendCandidateReviewInputSchema", () => {
  it("accepts a bounded review outcome without trusting reviewer identity", () => {
    const result = appendCandidateReviewInputSchema.parse({
      decision: "CONFIRMED",
      reasonCode: "CORROBORATED_SYNTHETIC_FIXTURE",
    });

    expect(result).not.toHaveProperty("reviewerId");
    expect(result).not.toHaveProperty("candidateVersion");
  });

  it("rejects expiry as a human review decision and undeclared reviewer fields", () => {
    expect(
      appendCandidateReviewInputSchema.safeParse({
        decision: "EXPIRED",
        reasonCode: "RETENTION_WINDOW",
      }).success,
    ).toBe(false);
    expect(
      appendCandidateReviewInputSchema.safeParse({
        decision: "REJECTED",
        reasonCode: "INSUFFICIENT_CORROBORATION",
        reviewerId: "user-supplied",
      }).success,
    ).toBe(false);
  });
});
