import { z } from "zod";

import {
  dataClassificationSchema,
  dataNatureSchema,
  utcMillisecondsSchema,
} from "./signed-event";

export const baselineCandidateTypeSchema = z.enum(["ALPR", "OBJECT"]);

export const candidateStateSchema = z.enum([
  "CANDIDATE",
  "IN_REVIEW",
  "CONFIRMED",
  "REJECTED",
  "INCONCLUSIVE",
  "EXPIRED",
  "RETRACTED",
]);

export const baselineCandidateSchema = z.strictObject({
  candidateId: z.uuid(),
  deploymentId: z.uuid(),
  sourceEventId: z.uuid({ version: "v7" }),
  candidateType: baselineCandidateTypeSchema,
  status: candidateStateSchema,
  version: z.number().int().positive().safe(),
  classification: dataClassificationSchema,
  dataNature: dataNatureSchema,
  occurredAt: utcMillisecondsSchema,
  updatedAt: utcMillisecondsSchema,
  requiresHumanReview: z.literal(true),
});

export const candidateReviewDecisionSchema = z.enum([
  "CONFIRMED",
  "REJECTED",
  "INCONCLUSIVE",
  "RETRACTED",
]);

export const appendCandidateReviewInputSchema = z.strictObject({
  decision: candidateReviewDecisionSchema,
  reasonCode: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[A-Z][A-Z0-9_]*$/),
});

const allowedTransitions: Readonly<
  Record<CandidateState, readonly CandidateState[]>
> = {
  CANDIDATE: ["IN_REVIEW", "EXPIRED"],
  IN_REVIEW: ["CONFIRMED", "REJECTED", "INCONCLUSIVE", "EXPIRED"],
  CONFIRMED: ["RETRACTED"],
  REJECTED: ["RETRACTED"],
  INCONCLUSIVE: ["RETRACTED"],
  EXPIRED: [],
  RETRACTED: [],
};

export function canTransitionCandidateState(
  current: CandidateState,
  next: CandidateState,
): boolean {
  return allowedTransitions[current].includes(next);
}

export type AppendCandidateReviewInput = z.infer<
  typeof appendCandidateReviewInputSchema
>;
export type BaselineCandidate = z.infer<typeof baselineCandidateSchema>;
export type BaselineCandidateType = z.infer<typeof baselineCandidateTypeSchema>;
export type CandidateReviewDecision = z.infer<
  typeof candidateReviewDecisionSchema
>;
export type CandidateState = z.infer<typeof candidateStateSchema>;
