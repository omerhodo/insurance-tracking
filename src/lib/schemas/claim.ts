import { z } from "zod";

export const ProcessStatusSchema = z.enum([
  "Completed",
  "Report Completed",
  "In Progress",
  "Pending",
]);

export const TowingServiceNodeSchema = z.object({
  id: z.string().optional(),
  title: z.literal("Towing Service"),
  status: ProcessStatusSchema,
  pickupLocation: z.string().optional(),
  towingDate: z.string().optional(),
});

export const ClaimNotificationNodeSchema = z.object({
  id: z.string().optional(),
  title: z.literal("Claim Notification"),
  status: ProcessStatusSchema,
  dateTime: z.string().optional(),
  reportType: z.string().optional(),
  reasonForDamage: z.string().optional(),
  reportingParty: z.string().optional(),
  contact: z.string().optional(),
});

export const AppraisalNodeSchema = z.object({
  id: z.string().optional(),
  title: z.literal("Appraisal"),
  status: ProcessStatusSchema,
  expertAssignmentDate: z.string().optional(),
  expertInfo: z.string().optional(),
  contact: z.string().optional(),
});

export const SubstituteRentalVehicleNodeSchema = z.object({
  id: z.string().optional(),
  title: z.literal("Substitute Rental Vehicle"),
  status: ProcessStatusSchema,
  vehicleDuration: z.string().optional(),
  vehicleModel: z.string().optional(),
  extraDuration: z.string().optional(),
});

export const FileReviewNodeSchema = z.object({
  id: z.string().optional(),
  title: z.literal("File Review"),
  status: ProcessStatusSchema,
  reviewReferralDate: z.string().optional(),
  reviewCompletionDate: z.string().optional(),
});

export const DeductionReasonNodeSchema = z.object({
  id: z.string().optional(),
  title: z.literal("Deduction Reason"),
  status: ProcessStatusSchema,
  actionRequired: z.string().optional(),
  occupationalDeduction: z.string().optional(),
  appreciationDeduction: z.string().optional(),
  policyDeductible: z.string().optional(),
  nonDamageAmount: z.string().optional(),
});

export const PaymentInformationNodeSchema = z.object({
  id: z.string().optional(),
  title: z.literal("Payment Information"),
  status: ProcessStatusSchema,
  paidTo: z.string().optional(),
  iban: z.string().optional(),
  paymentAmount: z.string().optional(),
  note: z.string().optional(),
});

export const ClosedNodeSchema = z.object({
  id: z.string().optional(),
  title: z.literal("Closed"),
  status: ProcessStatusSchema,
  completionDate: z.string().optional(),
});

export const ProcessNodeSchema = z.discriminatedUnion("title", [
  TowingServiceNodeSchema,
  ClaimNotificationNodeSchema,
  AppraisalNodeSchema,
  SubstituteRentalVehicleNodeSchema,
  FileReviewNodeSchema,
  DeductionReasonNodeSchema,
  PaymentInformationNodeSchema,
  ClosedNodeSchema,
]);

export const ClaimSchema = z.object({
  title: z.string(),
  fileNo: z.string(),
  estimatedRemainingTime: z.string(),
  currentStatus: z.string(),
  processDetails: z.array(ProcessNodeSchema),
});

export type Claim = z.infer<typeof ClaimSchema>;
export type ProcessNode = z.infer<typeof ProcessNodeSchema>;
export type ProcessStatus = z.infer<typeof ProcessStatusSchema>;

export type TowingServiceNode = z.infer<typeof TowingServiceNodeSchema>;
export type ClaimNotificationNode = z.infer<typeof ClaimNotificationNodeSchema>;
export type AppraisalNode = z.infer<typeof AppraisalNodeSchema>;
export type SubstituteRentalVehicleNode = z.infer<typeof SubstituteRentalVehicleNodeSchema>;
export type FileReviewNode = z.infer<typeof FileReviewNodeSchema>;
export type DeductionReasonNode = z.infer<typeof DeductionReasonNodeSchema>;
export type PaymentInformationNode = z.infer<typeof PaymentInformationNodeSchema>;
export type ClosedNode = z.infer<typeof ClosedNodeSchema>;
