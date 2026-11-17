export type PortalMode = 'admin' | 'regulator' | 'producer' | 'distributor' | 'farmer';

export type RegulatorScreenId =
  | 'dashboard'
  | 'applications'
  | 'application-review'
  | 'registry'
  | 'verification'
  | 'revocation'
  | 'traceability'
  | 'activity'
  | 'profile';

export type CommodityType = 'Padi' | 'Jagung' | 'Kedelai' | 'Cabai' | 'Bawang Merah';

export type SeedClass =
  | 'Benih Penjenis (BS)'
  | 'Benih Dasar (BD)'
  | 'Benih Pokok (BP)'
  | 'Benih Sebar (BR)';

export type ApplicationInspectionStatus =
  | 'Menunggu Pemeriksaan'
  | 'Dalam Pemeriksaan'
  | 'Disetujui'
  | 'Ditolak';

export type CertificateRegistryStatus = 'Aktif' | 'Dicabut' | 'Kedaluwarsa';

export interface SupportingDocument {
  id: string;
  name: string;
  docType: string;
  uploadedAt: string;
  fileSize: string;
  verified: boolean;
}

export interface ReviewHistoryEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  note: string;
}

export interface CertificationApplicationRecord {
  id: string;
  applicationNumber: string;
  batchId: string;
  batchNumber: string;
  producerName: string;
  producerProvince: string;
  producerLicense: string;
  producerContact: string;
  isSelfSubmitted?: boolean;
  commodity: CommodityType;
  variety: string;
  seedClass: SeedClass;
  quantityKg: number;
  submissionDate: string;
  productionDate: string;
  productionLocation: string;
  seedSource: string;
  plantingSeason: string;
  germinationRate: number;
  moistureContent: number;
  physicalPurity: number;
  status: ApplicationInspectionStatus;
  assignedInspector: string;
  certificateNumber?: string;
  rejectionReason?: string;
  documents: SupportingDocument[];
  checklist: {
    administrativeComplete: boolean;
    labQualityPassed: boolean;
    fieldIsolationVerified: boolean;
    packagingSealVerified: boolean;
  };
  reviewHistory: ReviewHistoryEntry[];
}

export interface SeedCertificationRecord {
  id: string;
  certificateNumber: string;
  applicationNumber: string;
  batchId: string;
  batchNumber: string;
  producerName: string;
  producerProvince: string;
  commodity: CommodityType;
  variety: string;
  seedClass: SeedClass;
  quantityKg: number;
  issueDate: string;
  expiryDate: string;
  status: CertificateRegistryStatus;
  issuedBy: string;
  germinationRate: number;
  moistureContent: number;
  physicalPurity: number;
  revocationReason?: string;
  revocationDate?: string;
  revokedBy?: string;
}

export interface OwnershipRecord {
  id: string;
  timestamp: string;
  fromParty: string;
  toParty: string;
  quantityKg: number;
  transferType: string;
  referenceCode: string;
  confirmed: boolean;
}

export type TraceabilityStage =
  | 'Registrasi Batch Produsen'
  | 'Pengajuan Sertifikasi'
  | 'Persetujuan Sertifikasi'
  | 'Pencabutan Sertifikasi'
  | 'Distribusi / Transfer Kepemilikan'
  | 'Konfirmasi Penerimaan'
  | 'Catatan Tanam Petani';

export type EventCategoryClass = 'blockchain' | 'audit';

export interface TraceabilityEvent {
  id: string;
  stage: TraceabilityStage;
  eventClass: EventCategoryClass;
  txHash?: string;
  timestamp: string;
  actor: string;
  organization: string;
  title: string;
  details: string;
}

export interface RegulatedSeedBatch {
  id: string;
  batchNumber: string;
  producerName: string;
  producerProvince: string;
  producerLicense: string;
  commodity: CommodityType;
  variety: string;
  seedClass: SeedClass;
  quantityKg: number;
  productionDate: string;
  productionLocation: string;
  seedSource: string;
  certificateNumber?: string;
  certificationStatus: 'Aktif' | 'Menunggu Pemeriksaan' | 'Ditolak' | 'Dicabut';
  germinationRate: number;
  moistureContent: number;
  physicalPurity: number;
  documents: SupportingDocument[];
  ownershipHistory: OwnershipRecord[];
  traceabilityEvents: TraceabilityEvent[];
}

export type RegulatorActivityCategory =
  | 'Semua'
  | 'Pemeriksaan Permohonan'
  | 'Persetujuan & Penolakan'
  | 'Pencabutan Sertifikasi'
  | 'Verifikasi & Ketertelusuran';

export interface RegulatorActivityLog {
  id: string;
  timestamp: string;
  category: Exclude<RegulatorActivityCategory, 'Semua'>;
  actor: string;
  title: string;
  description: string;
  referenceCode?: string;
  batchId?: string;
}

export interface RegulatorOrganizationProfile {
  organizationName: string;
  shortName: string;
  roleLabel: string;
  accreditationNumber: string;
  mandateBasis: string;
  jurisdictionProvince: string;
  headOfInstitution: string;
  activeInspectorName: string;
  activeInspectorNip: string;
  email: string;
  phone: string;
  officeAddress: string;
  serviceHours: string;
}
