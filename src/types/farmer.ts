export type FarmerScreenId =
  | 'dashboard'
  | 'my-seeds'
  | 'seed-detail'
  | 'qr-verify'
  | 'qr-result'
  | 'reception'
  | 'reception-confirm'
  | 'planting'
  | 'planting-form'
  | 'planting-detail'
  | 'correction'
  | 'activity'
  | 'profile';

export type CommodityType = 'Kelapa Sawit';

export type FarmerSeedVerificationStatus =
  | 'Terverifikasi'
  | 'Menunggu Verifikasi'
  | 'Sertifikasi Tidak Valid';

export type ReceptionStatus =
  | 'Menunggu Konfirmasi'
  | 'Diterima'
  | 'Dilaporkan Bermasalah';

export type SeedConditionOption =
  | 'Baik & Kemasan Utuh'
  | 'Kemasan Rusak / Segel Terbuka'
  | 'Benih Lembab / Berjamur'
  | 'Jumlah Tidak Sesuai';

export interface FarmerTraceEvent {
  id: string;
  date: string;
  actor: string;
  organization: string;
  title: string;
  detail: string;
}

export interface FarmerSeedBatch {
  id: string;
  batchNumber: string;
  commodity: CommodityType;
  variety: string;
  seedClass: string;
  producerName: string;
  distributorName: string;
  certificateNumber: string;
  certificationStatus: 'Aktif' | 'Dicabut' | 'Tidak Berlaku';
  batchOrigin: string;
  receivedQuantityKg: number;
  plantedQuantityKg: number;
  receivedDate: string;
  verificationStatus: FarmerSeedVerificationStatus;
  distributionHistory: string[];
  traceabilityTimeline: FarmerTraceEvent[];
}

export interface FarmerIncomingBatch {
  id: string;
  batchNumber: string;
  distributorName: string;
  producerName: string;
  commodity: CommodityType;
  variety: string;
  seedClass: string;
  certificateNumber: string;
  quantitySentKg: number;
  transferDate: string;
  receptionStatus: ReceptionStatus;
  receivedQuantityKg?: number;
  receptionDate?: string;
  seedCondition?: SeedConditionOption;
  notes?: string;
}

export type QrLookupOutcome =
  | {
      state: 'Benih Terverifikasi';
      batchNumber: string;
      commodity: CommodityType;
      variety: string;
      producerName: string;
      distributorName: string;
      certificateNumber: string;
      certificationStatus: string;
      batchOrigin: string;
      distributionHistory: string[];
      traceabilityTimeline: FarmerTraceEvent[];
      linkedSeedId?: string;
    }
  | {
      state: 'Sertifikasi Tidak Valid';
      batchNumber: string;
      commodity: CommodityType;
      variety: string;
      producerName: string;
      distributorName: string;
      certificateNumber: string;
      certificationStatus: string;
      batchOrigin: string;
      invalidReason: string;
      distributionHistory: string[];
      traceabilityTimeline: FarmerTraceEvent[];
    }
  | {
      state: 'Data Tidak Ditemukan';
      queriedCode: string;
    };

export type PlantingRecordStatus =
  | 'Tercatat'
  | 'Draf'
  | 'Koreksi Diajukan'
  | 'Koreksi Disetujui';

export interface FarmerPlantingRecord {
  id: string;
  recordCode: string;
  batchId: string;
  batchNumber: string;
  variety: string;
  commodity: CommodityType;
  plantingDate: string;
  location: string;
  plantedQuantityKg: number;
  landAreaHa: number;
  notes: string;
  status: PlantingRecordStatus;
}

export type CorrectionStatus = 'Menunggu Persetujuan' | 'Disetujui' | 'Ditolak';

export interface PlantingCorrectionRequest {
  id: string;
  requestCode: string;
  plantingRecordId: string;
  recordCode: string;
  batchNumber: string;
  variety: string;
  incorrectInfo: string;
  requestedCorrection: string;
  reason: string;
  submittedAt: string;
  status: CorrectionStatus;
  regulatorNote?: string;
}

export interface FarmerActivityItem {
  id: string;
  timestamp: string;
  category: 'Penerimaan' | 'Verifikasi QR' | 'Penanaman' | 'Koreksi';
  title: string;
  description: string;
  batchNumber?: string;
}

export interface FarmerProfile {
  fullName: string;
  email: string;
  phone: string;
  farmerGroup: string;
  membershipCode: string;
  accountStatus: 'Aktif & Terverifikasi';
  villageDistrict: string;
  province: string;
  managedLandHa: number;
  joinedDate: string;
  primaryDistributor: string;
}
