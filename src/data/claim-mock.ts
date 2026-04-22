/**
 * Mock claim data representing the full lifecycle of an insurance claim.
 * This mirrors the case study's provided JSON object and is consumed via
 * the mock API service (`/src/services/claim-api.ts`).
 */
export const MOCK_CLAIM_DATA = {
  claimId: "CLM-2024-00871",
  policyNumber: "POL-TK-887231",
  insuredName: "Ahmet Yılmaz",
  vehiclePlate: "34 ABC 123",
  vehicleInfo: {
    make: "Toyota",
    model: "Corolla",
    year: 2021,
    color: "Silver",
    vin: "JTDBL40E299084321",
  },
  claimDate: "2024-11-15T08:32:00Z",
  incidentDate: "2024-11-14T22:15:00Z",
  incidentType: "Collision",
  currentStatus: "PENDING_DEDUCTION_APPROVAL",
  estimatedCompletionDays: 7,
  urgentActionRequired: true,
  urgentActionMessage:
    "Occupational certificate upload required within 48 hours.",
  totalEstimatedDamage: 42500,
  currency: "TRY",
  progressPercent: 68,
  processDetails: [
    {
      id: "step-1",
      type: "TOWING_SERVICE",
      title: "Towing Service",
      status: "COMPLETED",
      completedAt: "2024-11-14T23:45:00Z",
      icon: "truck",
      details: {
        provider: "Ankara Hızlı Çekici A.Ş.",
        driverName: "Mehmet Kaya",
        driverPhone: "+90 532 111 2233",
        towedFrom: "Bağlıca Mahallesi, Ankara",
        towedTo: "Yenimahalle Oto Servisi, Ankara",
        distanceKm: 14.3,
        towingFee: 850,
        currency: "TRY",
        invoiceNumber: "TOW-2024-00341",
        arrivedAt: "2024-11-15T00:15:00Z",
      },
    },
    {
      id: "step-2",
      type: "FILE_REVIEW",
      title: "File Review & Registration",
      status: "COMPLETED",
      completedAt: "2024-11-15T10:00:00Z",
      icon: "folder-open",
      details: {
        assignedAdjuster: "Selin Çelik",
        adjusterEmail: "selin.celik@insurance.com",
        documentsReceived: [
          "Police Report",
          "Driver's License",
          "Vehicle Registration",
          "Insurance Card",
        ],
        documentsMissing: [],
        registrationNumber: "REG-2024-08712",
        notes:
          "All initial documents received. Vehicle towed to authorized service. Adjuster assigned.",
      },
    },
    {
      id: "step-3",
      type: "APPRAISAL",
      title: "Vehicle Appraisal",
      status: "COMPLETED",
      completedAt: "2024-11-16T15:30:00Z",
      icon: "clipboard-list",
      details: {
        appraiserName: "Kemal Arslan",
        appraiserLicense: "EKS-56782",
        serviceCenter: "Yenimahalle Oto Servisi",
        appraisalDate: "2024-11-16T10:00:00Z",
        damageAreas: [
          { area: "Front Bumper", severity: "Total Loss", estimatedCost: 8200 },
          { area: "Hood", severity: "Major", estimatedCost: 12000 },
          {
            area: "Left Headlight",
            severity: "Total Loss",
            estimatedCost: 4800,
          },
          { area: "Radiator", severity: "Major", estimatedCost: 9500 },
          { area: "Airbag System", severity: "Triggered", estimatedCost: 8000 },
        ],
        laborCost: 3500,
        totalAppraisalCost: 46000,
        currency: "TRY",
        reportId: "APR-2024-01234",
      },
    },
    {
      id: "step-4",
      type: "COVERAGE_CHECK",
      title: "Coverage Verification",
      status: "COMPLETED",
      completedAt: "2024-11-17T11:00:00Z",
      icon: "shield-check",
      details: {
        policyType: "Comprehensive (Kasko)",
        coverageLimit: 150000,
        deductibleAmount: 3500,
        deductibleType: "Fixed",
        coverageConfirmed: true,
        exclusionsChecked: ["Racing", "DUI", "Intentional Damage"],
        exclusionsApplied: [],
        confirmedBy: "Ayşe Yıldız",
        notes:
          "Policy is active. No exclusions apply. Coverage confirmed up to limit.",
      },
    },
    {
      id: "step-5",
      type: "DEDUCTION_REASON",
      title: "Deduction Reason",
      status: "IN_PROGRESS",
      icon: "calculator",
      details: {
        originalAppraisalCost: 46000,
        deductions: [
          {
            reason: "Depreciation (Aşınma Payı)",
            amount: 2800,
            description:
              "Applied based on vehicle age and mileage per TRAMER regulation.",
          },
          {
            reason: "Policy Deductible",
            amount: 700,
            description: "Standard deductible as per policy clause 4.2.1.",
          },
        ],
        totalDeductions: 3500,
        netPayableAmount: 42500,
        currency: "TRY",
        requiresDocument: true,
        requiredDocument: "Occupational Certificate (Meslek Belgesi)",
        requiredDocumentReason:
          "Vehicle is registered under a business name. Proof of occupation is required per SEDDK regulation 2022/14.",
        uploadDeadline: "2024-11-19T17:00:00Z",
        documentStatus: "PENDING",
      },
    },
    {
      id: "step-6",
      type: "PAYMENT",
      title: "Payment Processing",
      status: "PENDING",
      icon: "banknote",
      details: {
        paymentMethod: "Bank Transfer (EFT)",
        bankName: "Ziraat Bankası",
        ibanLast4: "4521",
        scheduledDate: null,
        transactionId: null,
        netPayableAmount: 42500,
        currency: "TRY",
        notes: "Payment will be initiated once deduction approval is complete.",
      },
    },
  ],
} as const;

export type MockClaimData = typeof MOCK_CLAIM_DATA;
