export type ScreenId =
  | 'overview'
  | 'batches'
  | 'lab'
  | 'distribution'
  | 'producers';

export type CertificationStatus =
  | 'Sertifikat Terbit'
  | 'Lolos Uji Mutu'
  | 'Menunggu Verifikasi'
  | 'Masa Karantina'
  | 'Dalam Pengiriman'
  | 'Distribusi Selesai'
  | 'Ditolak BPSB'
  | 'Afkir';

export type CommodityType = 'Padi' | 'Jagung' | 'Kedelai' | 'Cabai' | 'Bawang Merah';

export type SeedClass =
  | 'Benih Penjenis (BS)'
  | 'Benih Dasar (BD)'
  | 'Benih Pokok (BP)'
  | 'Benih Sebar (BR)';

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  note?: string;
}

export interface SeedBatch {
  id: string;
  batchNumber: string;
  certificateNumber?: string;
  commodity: CommodityType;
  variety: string;
  seedClass: SeedClass;
  producerId: string;
  producerName: string;
  province: string;
  germinationRate: number; // Daya Kecambah (%)
  moistureContent: number; // Kadar Air (%)
  physicalPurity: number; // Kemurnian Fisik (%)
  weedSeedContent: number; // Benih Gulma (%)
  weightKg: number; // Tonase (kg)
  harvestDate: string; // YYYY-MM-DD
  certificationDate: string; // YYYY-MM-DD or '-'
  expiryDate?: string;
  status: CertificationStatus;
  labInspector?: string;
  labNotes?: string;
  rejectionReason?: string;
  warehouseLocation: string;
  auditTrail: AuditEvent[];
}

export type ShipmentStatus =
  | 'Persiapan Muat'
  | 'Dalam Pengiriman'
  | 'Transit Hub Provinsi'
  | 'Distribusi Selesai';

export interface ShipmentCheckpoint {
  id: string;
  location: string;
  timestamp: string;
  description: string;
  completed: boolean;
}

export interface DistributionShipment {
  id: string;
  waybillNumber: string; // Nomor Surat Jalan
  batchNumber: string;
  variety: string;
  commodity: CommodityType;
  originWarehouse: string;
  destinationEntity: string;
  destinationProvince: string;
  quantityKg: number;
  carrierName: string;
  vehiclePlate: string;
  departureDate: string;
  estimatedArrival: string;
  status: ShipmentStatus;
  qrVerifiedCount: number;
  checkpoints: ShipmentCheckpoint[];
}

export interface Producer {
  id: string;
  name: string;
  iupNumber: string; // Izin Usaha Perbenihan
  province: string;
  regency: string;
  leadAgronomist: string;
  phone: string;
  acreageHa: number;
  activeBatches: number;
  passRatePercent: number;
  commodities: CommodityType[];
  verifiedSince: string;
}
