import React, { useMemo, useState } from 'react';
import { Clock, Search } from 'lucide-react';
import { ActivityCategory, ProducerActivityLog } from '../../types/producer';

interface ProducerActivityLogScreenProps {
  activities: ProducerActivityLog[];
  onOpenBatchDetail: (batchId: string) => void;
}

const CATEGORIES: ActivityCategory[] = [
  'Semua',
  'Registrasi & Batch',
  'Sertifikasi',
  'Distribusi & Transfer',
  'Pecah Batch',
];

export const ProducerActivityLogScreen: React.FC<ProducerActivityLogScreenProps> = ({
  activities,
  onOpenBatchDetail,
}) => {
  const [category, setCategory] = useState<ActivityCategory>('Semua');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return activities.filter((item) => {
      if (category !== 'Semua' && item.category !== category) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.batchNumber ?? '').toLowerCase().includes(q) ||
        item.actor.toLowerCase().includes(q)
      );
    });
  }, [activities, category, search]);

  return (
    <div className="space-y-6 max-w-[1120px]">
      <div>
        <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
          Riwayat Aktivitas
        </h1>
        <p className="mt-1 text-[14px] text-[#64748B]">
          Log kronologis registrasi batch, pengajuan sertifikasi, pemecahan batch, dan transfer kepemilikan Nursery Tashya.
        </p>
      </div>

      {/* Filter Card */}
      <div
        className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3"
        style={{
          boxShadow:
            '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div className="relative w-full lg:w-[320px]">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari aktivitas atau nomor batch..."
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`h-9 px-3 rounded-lg text-[12px] font-semibold border transition-colors whitespace-nowrap cursor-pointer ${
                category === cat
                  ? 'bg-[#00843D] text-white border-[#00843D]'
                  : 'bg-white text-[#334155] border-[#E2E8F0] hover:bg-[#F8FAFC]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Container */}
      <div
        className="bg-white rounded-xl border border-[#E2E8F0] p-6"
        style={{
          boxShadow:
            '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        }}
      >
        {filtered.length === 0 ? (
          <div className="py-10 text-center text-[13px] text-[#64748B]">
            Tidak ada aktivitas yang cocok dengan filter yang dipilih.
          </div>
        ) : (
          <div className="space-y-5">
            {filtered.map((item, idx) => (
              <div key={item.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#F0FAF3] border border-[#BBF7D0] text-[#00843D] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  {idx < filtered.length - 1 && (
                    <div className="w-px flex-1 bg-[#E2E8F0] my-1.5 min-h-[20px]" />
                  )}
                </div>

                <div className="flex-1 pb-2 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[14px] font-semibold text-[#111827]">
                        {item.title}
                      </span>
                      <span className="text-[12px] text-[#64748B]">
                        · {item.category}
                      </span>
                    </div>
                    {item.batchId && item.batchNumber && (
                      <button
                        type="button"
                        onClick={() => onOpenBatchDetail(item.batchId!)}
                        className="text-[13px] font-semibold text-[#00843D] hover:underline tabular-nums cursor-pointer"
                      >
                        {item.batchNumber}
                      </button>
                    )}
                  </div>

                  <p className="text-[13px] text-[#334155] mt-1 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="text-[12px] text-[#64748B] tabular-nums mt-1">
                    {item.timestamp} · Oleh {item.actor}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
