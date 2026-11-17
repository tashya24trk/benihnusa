export type ProducerScreenId =
  | 'dashboard'
  | 'batches'
  | 'register'
  | 'batch-detail'
  | 'certifications'
  | 'certification-detail'
  | 'distribution'
  | 'activity'
  | 'profile';

export type CommodityType = 'Kelapa Sawit';

export type SeedClass =
  | 'Benih Penjenis (BS)'
  | 'Benih Dasar (BD)'
  | 'Benih Pokok (BP)'
  | 'Benih Sebar (BR)';

export type ProducerCertStatus =
  | 'Belum Diajukan'
  | 'Menunggu Verifikasi'
  | 'Dalam Pemeriksaan Lab'
  | 'Tersertifikasi'
  | 'Perlu Perbaikan'
  | 'Ditolak BPSB';

export type BatchLifecycleStatus =
  | 'Draf'
  | 'Terdaftar'
  | 'Diajukan Sertifikasi'
  | 'Siap Distribusi'
  | 'Dalam Distribusi'
  | 'Dialihkan Sebagian'
  | 'Dialihkan Penuh';

export type OwnershipStatus =
  | 'Milik Produsen'
  | 'Sebagian Dialihkan'
  | 'Dialihkan ke Distributor';

export type DocumentStatus = 'Terunggah' | 'Terverifikasi Format' | 'Menunggu Kelengkapan';

export interface SupportingDocument {
  id: string;
  name: string;
  category: string;
  sizeLabel: string;
  uploadedAt: string;
  status: DocumentStatus;
  summary: string;
}

export interface BatchHistoryEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  note?: string;
}

export interface ProducerBatch {
  id: string;
  batchNumber: string;
  organizationName: string; // Always "Nursery Tashya"
  commodity: CommodityType;
  variety: string;
  seedClass: SeedClass;
  quantityKg: number;
  initialQuantityKg: number;
  productionDate: string; // YYYY-MM-DD
  productionLocation: string;
  seedSource: string;
  additionalNotes: string;
  certificationStatus: ProducerCertStatus;
  batchStatus: BatchLifecycleStatus;
  ownershipStatus: OwnershipStatus;
  certificateNumber?: string;
  parentBatchNumber?: string;
  documents: SupportingDocument[];
  history: BatchHistoryEvent[];
}

export interface CertificationTimelineStep {
  id: string;
  title: string;
  timestamp: string;
  actor: string;
  description: string;
  state: 'completed' | 'current' | 'upcoming' | 'issue';
}

export interface CertificationApplication {
  id: string;
  applicationNumber: string;
  batchId: string;
  batchNumber: string;
  commodity: CommodityType;
  variety: string;
  seedClass: SeedClass;
  quantityKg: number;
  submissionDate: string;
  status: Exclude<ProducerCertStatus, 'Belum Diajukan'>;
  progressPercent: number;
  progressLabel: string;
  regulatorFeedback: string;
  assignedBpsbOffice: string;
  labMetrics?: {
    germinationRate?: number;
    moistureContent?: number;
    physicalPurity?: number;
  };
  timeline: CertificationTimelineStep[];
}

export interface DistributionTransfer {
  id: string;
  transferCode: string;
  batchId: string;
  batchNumber: string;
  variety: string;
  commodity: CommodityType;
  destinationName: string;
  destinationType: 'Distributor' | 'Koperasi' | 'Kios Tani';
  destinationProvince: string;
  quantityKg: number;
  transferDate: string;
  ownershipStatus: 'Dalam Proses Transfer' | 'Dialihkan ke Distributor';
  receiptStatus: 'Menunggu Konfirmasi' | 'Diterima Tujuan';
  waybillNumber: string;
  notes?: string;
}

export type ActivityCategory =
  | 'Semua'
  | 'Registrasi & Batch'
  | 'Sertifikasi'
  | 'Distribusi & Transfer'
  | 'Pecah Batch';

export interface ProducerActivityLog {
  id: string;
  timestamp: string;
  category: Exclude<ActivityCategory, 'Semua'>;
  actor: string;
  title: string;
  description: string;
  batchId?: string;
  batchNumber?: string;
}

export interface ProducerOrganizationProfile {
  organizationName: string;
  roleLabel: string;
  representativeName: string;
  email: string;
  phone: string;
  iupNumber: string;
  accreditedUntil: string;
  province: string;
  address: string;
  totalAcreageHa: number;
  primaryCommodities: CommodityType[];
  warehouseCapacityTon: number;
  operationalNotes: string;
}
