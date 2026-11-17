import React, { useMemo, useState } from 'react';
import { CheckCircle2, QrCode, Search, X } from 'lucide-react';
import { SeedBatch } from '../../types/seed';
import { StatusBadge } from '../ui/StatusBadge';

interface QrLookupModalProps {
  open: boolean;
  batches: SeedBatch[];
  onClose: () => void;
  onSelectBatch: (batch: SeedBatch) => void;
}

export const QrLookupModal: React.FC<QrLookupModalProps> = ({
  open,
  batches,
  onClose,
  onSelectBatch,
}) => {
  const [query, setQuery] = useState('');

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return batches.slice(0, 4);
    return batches.filter(
      (b) =>
        b.batchNumber.toLowerCase().includes(q) ||
        (b.certificateNumber ?? '').toLowerCase().includes(q) ||
        b.variety.toLowerCase().includes(q)
    );
  }, [batches, query]);

  if (!open) return null;

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
        aria-labelledby="qr-lookup-title"
        className="relative z-10 w-full max-w-[500px] bg-white rounded-xl border border-[#E2E8F0] overflow-hidden"
        style={{
          boxShadow:
            '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F0FAF3] text-[#00843D] flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <h2
              id="qr-lookup-title"
              className="text-[16px] font-semibold text-[#111827]"
            >
              Verifikasi Keaslian QR &amp; Nomor Lot
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#64748B] hover:text-[#111827] hover:bg-slate-100 cursor-pointer"
            aria-label="Tutup dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Masukkan kode QR, nomor batch (BNT-...), atau nomor sertifikat..."
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
            />
          </div>

          <div className="divide-y divide-[#F1F5F9] border border-[#E2E8F0] rounded-lg overflow-hidden max-h-[300px] overflow-y-auto">
            {matches.length === 0 ? (
              <div className="p-6 text-center text-[13px] text-[#64748B]">
                Kode batch atau sertifikat tidak ditemukan dalam basis data BenihNusa.
              </div>
            ) : (
              matches.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectBatch(item);
                    onClose();
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-[#F0FAF3] transition-colors flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#00843D] tabular-nums">
                        {item.batchNumber}
                      </span>
                      {item.certificateNumber && (
                        <span className="text-[11px] text-[#15803D] inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Terverifikasi
                        </span>
                      )}
                    </div>
                    <div className="text-[13px] font-medium text-[#111827] truncate">
                      {item.variety}
                    </div>
                    <div className="text-[12px] text-[#64748B] truncate">
                      {item.producerName}
                    </div>
                  </div>
                  <StatusBadge status={item.status} />
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
