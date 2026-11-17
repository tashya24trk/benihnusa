import React, { useState } from 'react';
import { X } from 'lucide-react';
import {
  CommodityType,
  Producer,
  SeedBatch,
  SeedClass,
} from '../../types/seed';

interface AddBatchModalProps {
  open: boolean;
  producers: Producer[];
  onClose: () => void;
  onCreateBatch: (newBatch: SeedBatch) => void;
}

export const AddBatchModal: React.FC<AddBatchModalProps> = ({
  open,
  producers,
  onClose,
  onCreateBatch,
}) => {
  const [commodity, setCommodity] = useState<CommodityType>('Padi');
  const [variety, setVariety] = useState('');
  const [seedClass, setSeedClass] = useState<SeedClass>('Benih Sebar (BR)');
  const [producerId, setProducerId] = useState<string>(producers[0]?.id ?? '');
  const [weightKg, setWeightKg] = useState('5000');
  const [germinationRate, setGerminationRate] = useState('88.5');
  const [moistureContent, setMoistureContent] = useState('11.5');
  const [warehouseLocation, setWarehouseLocation] = useState('');
  const [harvestDate, setHarvestDate] = useState('2026-11-12');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!open) return null;

  const commodityPrefix: Record<CommodityType, string> = {
    Padi: 'PD',
    Jagung: 'JG',
    Kedelai: 'KD',
    Cabai: 'CB',
    'Bawang Merah': 'BM',
  };

  const generatedBatchCode = `BNT-2026-${commodityPrefix[commodity]}-${Math.floor(
    450 + Math.random() * 500
  )}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!variety.trim()) {
      setErrorMsg('Nama varietas benih wajib diisi.');
      return;
    }
    const producer = producers.find((p) => p.id === producerId) ?? producers[0];
    const parsedWeight = Number(weightKg);
    const parsedGerm = Number(germinationRate);
    const parsedMoist = Number(moistureContent);

    if (!parsedWeight || parsedWeight <= 0) {
      setErrorMsg('Tonase batch harus lebih dari 0 kg.');
      return;
    }

    const nowTime = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newBatch: SeedBatch = {
      id: `b-${Date.now()}`,
      batchNumber: generatedBatchCode,
      commodity,
      variety: variety.trim(),
      seedClass,
      producerId: producer.id,
      producerName: producer.name,
      province: producer.province,
      germinationRate: parsedGerm,
      moistureContent: parsedMoist,
      physicalPurity: 99.0,
      weedSeedContent: 0.0,
      weightKg: parsedWeight,
      harvestDate,
      certificationDate: '-',
      status: 'Menunggu Verifikasi',
      labInspector: 'Menunggu Tinjauan',
      labNotes: 'Batch baru didaftarkan ke sistem untuk pengujian mutu BPSB.',
      warehouseLocation:
        warehouseLocation.trim() || `Gudang ${producer.regency}`,
      auditTrail: [
        {
          id: `ev-${Date.now()}`,
          timestamp: `16 Nov 2026 ${nowTime} WIB`,
          actor: 'Ir. Sari Wijaya',
          role: 'Inspektur Madya BPSB',
          action: 'Registrasi Batch Benih Baru ke Sistem',
          note: `Lot ${generatedBatchCode} masuk ke antrean verifikasi laboratorium.`,
        },
      ],
    };

    onCreateBatch(newBatch);
    setVariety('');
    setWarehouseLocation('');
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-batch-title"
        className="relative z-10 w-full max-w-[560px] bg-white rounded-xl border border-[#E2E8F0] overflow-hidden"
        style={{
          boxShadow:
            '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h2
              id="add-batch-title"
              className="text-[18px] font-semibold text-[#111827]"
            >
              Registrasi Batch Benih Baru
            </h2>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              Daftarkan lot benih hasil panen untuk pemeriksaan laboratorium BPSB.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#64748B] hover:text-[#111827] hover:bg-slate-100 cursor-pointer"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="px-3.5 py-2.5 rounded-lg bg-[#FEE2E2] border border-[#FECACA] text-[#B91C1C] text-[13px] font-medium">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                Komoditas
              </label>
              <select
                value={commodity}
                onChange={(e) => setCommodity(e.target.value as CommodityType)}
                className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[14px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
              >
                <option value="Padi">Padi</option>
                <option value="Jagung">Jagung</option>
                <option value="Kedelai">Kedelai</option>
                <option value="Cabai">Cabai</option>
                <option value="Bawang Merah">Bawang Merah</option>
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                Kelas Benih
              </label>
              <select
                value={seedClass}
                onChange={(e) => setSeedClass(e.target.value as SeedClass)}
                className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[14px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
              >
                <option value="Benih Penjenis (BS)">Benih Penjenis (BS)</option>
                <option value="Benih Dasar (BD)">Benih Dasar (BD)</option>
                <option value="Benih Pokok (BP)">Benih Pokok (BP)</option>
                <option value="Benih Sebar (BR)">Benih Sebar (BR)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
              Nama Varietas Unggul
            </label>
            <input
              type="text"
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
              placeholder="Contoh: Padi Inpari 32 HDB atau Jagung Hibrida Bisi-18"
              className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
              Produsen / Penangkar Terdaftar
            </label>
            <select
              value={producerId}
              onChange={(e) => setProducerId(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[14px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
            >
              {producers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.province})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                Tonase (kg)
              </label>
              <input
                type="number"
                min="1"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] tabular-nums focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                Daya Kecambah (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={germinationRate}
                onChange={(e) => setGerminationRate(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] tabular-nums focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                Kadar Air (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={moistureContent}
                onChange={(e) => setMoistureContent(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] tabular-nums focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                Tanggal Panen
              </label>
              <input
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] tabular-nums focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                Lokasi Gudang Penyimpanan
              </label>
              <input
                type="text"
                value={warehouseLocation}
                onChange={(e) => setWarehouseLocation(e.target.value)}
                placeholder="Contoh: Gudang Utama Blok C1"
                className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#334155] text-[13px] font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="h-10 px-5 rounded-lg bg-[#00843D] hover:bg-[#006B32] text-white text-[13px] font-semibold cursor-pointer"
            >
              Simpan &amp; Daftarkan Batch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
