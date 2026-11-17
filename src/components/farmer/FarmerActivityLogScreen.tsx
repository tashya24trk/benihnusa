import React, { useState } from 'react';
import {
  FileEdit,
  History,
  PackageCheck,
  QrCode,
  Search,
  Sprout,
} from 'lucide-react';
import { FarmerActivityItem } from '../../types/farmer';

interface FarmerActivityLogScreenProps {
  activities: FarmerActivityItem[];
}

type CategoryFilter =
  | 'Semua'
  | 'Penerimaan'
  | 'Verifikasi QR'
  | 'Penanaman'
  | 'Koreksi';

export const FarmerActivityLogScreen: React.FC<FarmerActivityLogScreenProps> = ({
  activities,
}) => {
  const [category, setCategory] = useState<CategoryFilter>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = activities.filter((item) => {
    const matchesCat = category === 'Semua' || item.category === category;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.batchNumber ?? '').toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const renderCategoryIcon = (cat: FarmerActivityItem['category']) => {
    switch (cat) {
      case 'Penerimaan':
        return <PackageCheck className="w-4 h-4 text-[#00843D]" />;
      case 'Verifikasi QR':
        return <QrCode className="w-4 h-4 text-[#1D4ED8]" />;
      case 'Penanaman':
        return <Sprout className="w-4 h-4 text-[#15803D]" />;
      case 'Koreksi':
        return <FileEdit className="w-4 h-4 text-[#B45309]" />;
    }
  };

  const categories: CategoryFilter[] = [
    'Semua',
    'Penerimaan',
    'Verifikasi QR',
    'Penanaman',
    'Koreksi',
  ];

  return (
    <div className="space-y-6 max-w-[920px]">
      <div>
        <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
          Riwayat Aktivitas Petani
        </h1>
        <p className="mt-1 text-[14px] text-[#64748B]">
          Catatan kronologis penerimaan benih, verifikasi QR, penanaman, dan pengajuan koreksi Anda.
        </p>
      </div>

      {/* Filters */}
      <div
        className="bg-white rounded-xl border border-[#E2E8F0] p-4 space-y-3"
        style={{
          boxShadow:
            '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div className="relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari aktivitas atau nomor batch..."
            className="w-full h-11 pl-9 pr-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`h-9 px-3.5 rounded-lg text-[12px] font-semibold transition-colors cursor-pointer ${
                category === cat
                  ? 'bg-[#00843D] text-white'
                  : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:text-[#111827]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Card */}
      <div
        className="bg-white rounded-xl border border-[#E2E8F0] divide-y divide-[#E2E8F0]"
        style={{
          boxShadow:
            '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        }}
      >
        {filtered.length === 0 ? (
          <div className="py-12 px-4 text-center text-[13px] text-[#64748B] flex flex-col items-center gap-2">
            <History className="w-6 h-6 text-[#94A3B8]" />
            <span>Belum ada aktivitas yang cocok dengan filter Anda.</span>
          </div>
        ) : (
          filtered.map((item) => (
            <div key={item.id} className="p-4 sm:p-5 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center shrink-0 mt-0.5">
                {renderCategoryIcon(item.category)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-[14px] font-semibold text-[#111827]">
                    {item.title}
                  </span>
                  <span className="text-[12px] text-[#64748B] tabular-nums shrink-0">
                    {item.timestamp}
                  </span>
                </div>
                <p className="mt-1 text-[13px] text-[#475569] leading-relaxed">
                  {item.description}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-medium text-[#475569]">
                    {item.category}
                  </span>
                  {item.batchNumber && (
                    <span className="px-2 py-0.5 rounded-md bg-[#F0FAF3] border border-[#BBF7D0] text-[11px] font-semibold text-[#00843D] tabular-nums">
                      {item.batchNumber}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
