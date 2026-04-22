import { z } from "zod";

// ─── Shared primitives ────────────────────────────────────────────────────────

const StatusSchema = z.enum([
  "COMPLETED",
  "IN_PROGRESS",
  "PENDING",
  "REJECTED",
]);

const IconSchema = z.string(); // lucide-react icon name (string slug)

const MoneySchema = z.object({
  amount: z.number().nonnegative(),
  currency: z.string().length(3), // ISO 4217
});

// ─── Per-node detail schemas ──────────────────────────────────────────────────

const TowingDetailsSchema = z.object({
  provider: z.string(),
  driverName: z.string(),
  driverPhone: z.string(),
  towedFrom: z.string(),
  towedTo: z.string(),
  distanceKm: z.number().nonnegative(),
  towingFee: z.number().nonnegative(),
  currency: z.string(),
  invoiceNumber: z.string(),
  arrivedAt: z.string().datetime(),
});

const FileReviewDetailsSchema = z.object({
  assignedAdjuster: z.string(),
  adjusterEmail: z.string().email(),
  documentsReceived: z.array(z.string()),
  documentsMissing: z.array(z.string()),
  registrationNumber: z.string(),
  notes: z.string(),
});

const DamageAreaSchema = z.object({
  area: z.string(),
  severity: z.string(),
  estimatedCost: z.number().nonnegative(),
});

const AppraisalDetailsSchema = z.object({
  appraiserName: z.string(),
  appraiserLicense: z.string(),
  serviceCenter: z.string(),
  appraisalDate: z.string().datetime(),
  damageAreas: z.array(DamageAreaSchema),
  laborCost: z.number().nonnegative(),
  totalAppraisalCost: z.number().nonnegative(),
  currency: z.string(),
  reportId: z.string(),
});

const CoverageCheckDetailsSchema = z.object({
  policyType: z.string(),
  coverageLimit: z.number().nonnegative(),
  deductibleAmount: z.number().nonnegative(),
  deductibleType: z.string(),
  coverageConfirmed: z.boolean(),
  exclusionsChecked: z.array(z.string()),
  exclusionsApplied: z.array(z.string()),
  confirmedBy: z.string(),
  notes: z.string(),
});

const DeductionItemSchema = z.object({
  reason: z.string(),
  amount: z.number().nonnegative(),
  description: z.string(),
});

const DocumentStatusSchema = z.enum(["PENDING", "UPLOADED", "APPROVED", "REJECTED"]);

const DeductionReasonDetailsSchema = z.object({
  originalAppraisalCost: z.number().nonnegative(),
  deductions: z.array(DeductionItemSchema),
  totalDeductions: z.number().nonnegative(),
  netPayableAmount: z.number().nonnegative(),
  currency: z.string(),
  requiresDocument: z.boolean(),
  requiredDocument: z.string(),
  requiredDocumentReason: z.string(),
  uploadDeadline: z.string().datetime(),
  documentStatus: DocumentStatusSchema,
});

const PaymentDetailsSchema = z.object({
  paymentMethod: z.string(),
  bankName: z.string(),
  ibanLast4: z.string(),
  scheduledDate: z.string().datetime().nullable(),
  transactionId: z.string().nullable(),
  netPayableAmount: z.number().nonnegative(),
  currency: z.string(),
  notes: z.string(),
});

// ─── Discriminated union — the heart of the polymorphic type system ───────────

export const TowingServiceNodeSchema = z.object({
  id: z.string(),
  type: z.literal("TOWING_SERVICE"),
  title: z.string(),
  status: StatusSchema,
  completedAt: z.string().datetime().optional(),
  icon: IconSchema,
  details: TowingDetailsSchema,
});

export const FileReviewNodeSchema = z.object({
  id: z.string(),
  type: z.literal("FILE_REVIEW"),
  title: z.string(),
  status: StatusSchema,
  completedAt: z.string().datetime().optional(),
  icon: IconSchema,
  details: FileReviewDetailsSchema,
});

export const AppraisalNodeSchema = z.object({
  id: z.string(),
  type: z.literal("APPRAISAL"),
  title: z.string(),
  status: StatusSchema,
  completedAt: z.string().datetime().optional(),
  icon: IconSchema,
  details: AppraisalDetailsSchema,
});

export const CoverageCheckNodeSchema = z.object({
  id: z.string(),
  type: z.literal("COVERAGE_CHECK"),
  title: z.string(),
  status: StatusSchema,
  completedAt: z.string().datetime().optional(),
  icon: IconSchema,
  details: CoverageCheckDetailsSchema,
});

export const DeductionReasonNodeSchema = z.object({
  id: z.string(),
  type: z.literal("DEDUCTION_REASON"),
  title: z.string(),
  status: StatusSchema,
  completedAt: z.string().datetime().optional(),
  icon: IconSchema,
  details: DeductionReasonDetailsSchema,
});

export const PaymentNodeSchema = z.object({
  id: z.string(),
  type: z.literal("PAYMENT"),
  title: z.string(),
  status: StatusSchema,
  completedAt: z.string().datetime().optional(),
  icon: IconSchema,
  details: PaymentDetailsSchema,
});

/**
 * The discriminated union. Zod narrows the `details` type automatically
 * based on the `type` literal, giving full type safety in every component.
 */
export const ProcessNodeSchema = z.discriminatedUnion("type", [
  TowingServiceNodeSchema,
  FileReviewNodeSchema,
  AppraisalNodeSchema,
  CoverageCheckNodeSchema,
  DeductionReasonNodeSchema,
  PaymentNodeSchema,
]);

// ─── Vehicle info ─────────────────────────────────────────────────────────────

export const VehicleInfoSchema = z.object({
  make: z.string(),
  model: z.string(),
  year: z.number().int().gte(1900),
  color: z.string(),
  vin: z.string(),
});

// ─── Root claim schema ────────────────────────────────────────────────────────

export const ClaimSchema = z.object({
  claimId: z.string(),
  policyNumber: z.string(),
  insuredName: z.string(),
  vehiclePlate: z.string(),
  vehicleInfo: VehicleInfoSchema,
  claimDate: z.string().datetime(),
  incidentDate: z.string().datetime(),
  incidentType: z.string(),
  currentStatus: z.string(),
  estimatedCompletionDays: z.number().int().nonnegative(),
  urgentActionRequired: z.boolean(),
  urgentActionMessage: z.string().optional(),
  totalEstimatedDamage: z.number().nonnegative(),
  currency: z.string(),
  progressPercent: z.number().min(0).max(100),
  processDetails: z.array(ProcessNodeSchema),
});

// ─── Derived TypeScript types (single source of truth) ───────────────────────

export type Claim = z.infer<typeof ClaimSchema>;
export type ProcessNode = z.infer<typeof ProcessNodeSchema>;
export type ProcessStatus = z.infer<typeof StatusSchema>;
export type ProcessType = ProcessNode["type"];

export type TowingServiceNode = z.infer<typeof TowingServiceNodeSchema>;
export type FileReviewNode = z.infer<typeof FileReviewNodeSchema>;
export type AppraisalNode = z.infer<typeof AppraisalNodeSchema>;
export type CoverageCheckNode = z.infer<typeof CoverageCheckNodeSchema>;
export type DeductionReasonNode = z.infer<typeof DeductionReasonNodeSchema>;
export type PaymentNode = z.infer<typeof PaymentNodeSchema>;

export type DamageArea = z.infer<typeof DamageAreaSchema>;
export type DeductionItem = z.infer<typeof DeductionItemSchema>;
export type DocumentStatus = z.infer<typeof DocumentStatusSchema>;

// Re-export MoneySchema type for shared use
export type Money = z.infer<typeof MoneySchema>;
