export type DistributorScreenId =
  | 'dashboard'
  | 'incoming'
  | 'incoming-detail'
  | 'receipt-confirm'
  | 'inventory'
  | 'distribution'
  | 'split'
  | 'transfer'
  | 'activity'
  | 'profile';

export type CommodityType = 'Padi' | 'Jagung' | 'Kedelai' | 'Cabai' | 'Bawang Merah';

export type SeedClass =
  | 'Benih Penjenis (BS)'
  | 'Benih Dasar (BD)'
  | 'Benih Pokok (BP)'
  | 'Benih Sebar (BR)';

export type ReceiptStatus = 'Menunggu Konfirmasi' | 'Diterima' | 'Ditolak';

export type InventoryBatchStatus =
  | 'Tersedia'
  | 'Sebagian Terdistribusi'
  | 'Dipecah'
  | 'Habis Terdistribusi';

export type CertificationReadOnlyStatus = 'Tersertifikasi';

export interface IncomingBatch {
  id: string;
  batchNumber: string;
  producerName: string;
  producerProvince: string;
  commodity: CommodityType;
  variety: string;
  seedClass: SeedClass;
  certificateNumber: string;
  quantityKg: number;
  transferDate: string;
  waybillNumber: string;
  carrierInfo: string;
  productionDate: string;
  seedSource: string;
  germinationRate: number;
  moistureContent: number;
  receiptStatus: ReceiptStatus;
  receiptNote?: string;
  confirmedAt?: string;
}

export interface DistributorInventoryBatch {
  id: string;
  batchNumber: string;
  parentBatchNumber?: string;
  producerName: string;
  commodity: CommodityType;
  variety: string;
  seedClass: SeedClass;
  certificateNumber: string;
  initialQuantityKg: number;
  availableQuantityKg: number;
  receivedDate: string;
  currentOwner: string; // "Koperasi Tani Makmur" when owned by distributor
  certificationStatus: CertificationReadOnlyStatus;
  batchStatus: InventoryBatchStatus;
}

export type DistributionDestType = 'Petani / Kelompok Tani' | 'Kios Tani Mitra' | 'Sub-Penyalur Resmi';

export interface DistributorDistributionRecord {
  id: string;
  distributionCode: string;
  batchId: string;
  batchNumber: string;
  variety: string;
  commodity: CommodityType;
  sourceOrganization: string;
  recipientName: string;
  recipientType: DistributionDestType;
  recipientDetails: string;
  quantityKg: number;
  transferDate: string;
  ownershipStatus: 'Milik Penerima' | 'Dalam Pengiriman';
  receiptConfirmationStatus: 'Menunggu Konfirmasi' | 'Diterima Petani/Tujuan';
  notes?: string;
}

export interface OwnershipTransferEvent {
  id: string;
  title: string;
  timestamp: string;
  actor: string;
  description: string;
  completed: boolean;
}

export interface DistributorOwnershipTransfer {
  id: string;
  transferCode: string;
  batchId: string;
  batchNumber: string;
  variety: string;
  currentOwner: string;
  receivingParty: string;
  receivingType: string;
  quantityKg: number;
  transferDate: string;
  transferStatus: 'Dalam Proses' | 'Selesai Dialihkan';
  confirmationHistory: OwnershipTransferEvent[];
}

export type DistributorActivityCategory =
  | 'Semua'
  | 'Penerimaan Batch'
  | 'Pemecahan Batch'
  | 'Distribusi Benih'
  | 'Transfer Kepemilikan';

export interface DistributorActivityLog {
  id: string;
  timestamp: string;
  category: Exclude<DistributorActivityCategory, 'Semua'>;
  actor: string;
  title: string;
  description: string;
  batchNumber?: string;
}

export interface DistributorOrganizationProfile {
  organizationName: string;
  roleLabel: string;
  representativeName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  validUntil: string;
  province: string;
  address: string;
  warehouseCapacityTon: number;
  serviceAreas: string[];
  operationalNotes: string;
}
