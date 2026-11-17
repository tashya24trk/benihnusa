import React from 'react';

interface StatusBadgeProps {
  status: string;
}

type BadgeStyle = {
  bg: string;
  text: string;
  border: string;
  dot: string;
};

const STATUS_STYLE_MAP: Record<string, BadgeStyle> = {
  // Green / Success
  'Sertifikat Terbit': {
    bg: 'bg-[#DCFCE7]',
    text: 'text-[#15803D]',
    border: 'border-[#BBF7D0]',
    dot: 'bg-[#16A34A]',
  },
  Tersertifikasi: {
    bg: 'bg-[#DCFCE7]',
    text: 'text-[#15803D]',
    border: 'border-[#BBF7D0]',
    dot: 'bg-[#16A34A]',
  },
  'Lolos Uji Mutu': {
    bg: 'bg-[#DCFCE7]',
    text: 'text-[#15803D]',
    border: 'border-[#BBF7D0]',
    dot: 'bg-[#16A34A]',
  },
  'Siap Distribusi': {
    bg: 'bg-[#DCFCE7]',
    text: 'text-[#15803D]',
    border: 'border-[#BBF7D0]',
    dot: 'bg-[#16A34A]',
  },
  'Distribusi Selesai': {
    bg: 'bg-[#DCFCE7]',
    text: 'text-[#15803D]',
    border: 'border-[#BBF7D0]',
    dot: 'bg-[#16A34A]',
  },
  'Diterima Tujuan': {
    bg: 'bg-[#DCFCE7]',
    text: 'text-[#15803D]',
    border: 'border-[#BBF7D0]',
    dot: 'bg-[#16A34A]',
  },
  'Terverifikasi Format': {
    bg: 'bg-[#DCFCE7]',
    text: 'text-[#15803D]',
    border: 'border-[#BBF7D0]',
    dot: 'bg-[#16A34A]',
  },
  'Milik Produsen': {
    bg: 'bg-[#F0FAF3]',
    text: 'text-[#006B32]',
    border: 'border-[#BBF7D0]',
    dot: 'bg-[#00843D]',
  },

  // Amber / Warning
  'Menunggu Verifikasi': {
    bg: 'bg-[#FEF3C7]',
    text: 'text-[#B45309]',
    border: 'border-[#FDE68A]',
    dot: 'bg-[#F59E0B]',
  },
  'Perlu Perbaikan': {
    bg: 'bg-[#FEF3C7]',
    text: 'text-[#B45309]',
    border: 'border-[#FDE68A]',
    dot: 'bg-[#F59E0B]',
  },
  'Masa Karantina': {
    bg: 'bg-[#FEF3C7]',
    text: 'text-[#B45309]',
    border: 'border-[#FDE68A]',
    dot: 'bg-[#F59E0B]',
  },
  'Menunggu Konfirmasi': {
    bg: 'bg-[#FEF3C7]',
    text: 'text-[#B45309]',
    border: 'border-[#FDE68A]',
    dot: 'bg-[#F59E0B]',
  },
  'Sebagian Dialihkan': {
    bg: 'bg-[#FEF3C7]',
    text: 'text-[#B45309]',
    border: 'border-[#FDE68A]',
    dot: 'bg-[#F59E0B]',
  },
  'Dialihkan Sebagian': {
    bg: 'bg-[#FEF3C7]',
    text: 'text-[#B45309]',
    border: 'border-[#FDE68A]',
    dot: 'bg-[#F59E0B]',
  },
  'Menunggu Kelengkapan': {
    bg: 'bg-[#FEF3C7]',
    text: 'text-[#B45309]',
    border: 'border-[#FDE68A]',
    dot: 'bg-[#F59E0B]',
  },

  // Blue / Info / In Progress
  'Dalam Pemeriksaan Lab': {
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#1D4ED8]',
    border: 'border-[#BFDBFE]',
    dot: 'bg-[#2563EB]',
  },
  'Diajukan Sertifikasi': {
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#1D4ED8]',
    border: 'border-[#BFDBFE]',
    dot: 'bg-[#2563EB]',
  },
  'Dalam Distribusi': {
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#1D4ED8]',
    border: 'border-[#BFDBFE]',
    dot: 'bg-[#2563EB]',
  },
  'Dalam Pengiriman': {
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#1D4ED8]',
    border: 'border-[#BFDBFE]',
    dot: 'bg-[#2563EB]',
  },
  'Dalam Proses Transfer': {
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#1D4ED8]',
    border: 'border-[#BFDBFE]',
    dot: 'bg-[#2563EB]',
  },
  Terunggah: {
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#1D4ED8]',
    border: 'border-[#BFDBFE]',
    dot: 'bg-[#2563EB]',
  },

  // Neutral / Slate
  'Belum Diajukan': {
    bg: 'bg-slate-100',
    text: 'text-[#475569]',
    border: 'border-[#E2E8F0]',
    dot: 'bg-[#64748B]',
  },
  Draf: {
    bg: 'bg-slate-100',
    text: 'text-[#475569]',
    border: 'border-[#E2E8F0]',
    dot: 'bg-[#64748B]',
  },
  Terdaftar: {
    bg: 'bg-slate-100',
    text: 'text-[#334155]',
    border: 'border-[#CBD5E1]',
    dot: 'bg-[#475569]',
  },
  'Dialihkan Penuh': {
    bg: 'bg-slate-100',
    text: 'text-[#334155]',
    border: 'border-[#CBD5E1]',
    dot: 'bg-[#475569]',
  },
  'Dialihkan ke Distributor': {
    bg: 'bg-slate-100',
    text: 'text-[#334155]',
    border: 'border-[#CBD5E1]',
    dot: 'bg-[#475569]',
  },

  // Red / Danger
  'Ditolak BPSB': {
    bg: 'bg-[#FEE2E2]',
    text: 'text-[#B91C1C]',
    border: 'border-[#FECACA]',
    dot: 'bg-[#EF4444]',
  },
  Ditolak: {
    bg: 'bg-[#FEE2E2]',
    text: 'text-[#B91C1C]',
    border: 'border-[#FECACA]',
    dot: 'bg-[#EF4444]',
  },
  Afkir: {
    bg: 'bg-[#FEE2E2]',
    text: 'text-[#B91C1C]',
    border: 'border-[#FECACA]',
    dot: 'bg-[#EF4444]',
  },

  // Distributor / Cooperative states
  Diterima: {
    bg: 'bg-[#DCFCE7]',
    text: 'text-[#15803D]',
    border: 'border-[#BBF7D0]',
    dot: 'bg-[#16A34A]',
  },
  Tersedia: {
    bg: 'bg-[#DCFCE7]',
    text: 'text-[#15803D]',
    border: 'border-[#BBF7D0]',
    dot: 'bg-[#16A34A]',
  },
  'Selesai Dialihkan': {
    bg: 'bg-[#DCFCE7]',
    text: 'text-[#15803D]',
    border: 'border-[#BBF7D0]',
    dot: 'bg-[#16A34A]',
  },
  'Diterima Petani/Tujuan': {
    bg: 'bg-[#DCFCE7]',
    text: 'text-[#15803D]',
    border: 'border-[#BBF7D0]',
    dot: 'bg-[#16A34A]',
  },
  'Milik Penerima': {
    bg: 'bg-slate-100',
    text: 'text-[#334155]',
    border: 'border-[#CBD5E1]',
    dot: 'bg-[#475569]',
  },
  'Sebagian Terdistribusi': {
    bg: 'bg-[#FEF3C7]',
    text: 'text-[#B45309]',
    border: 'border-[#FDE68A]',
    dot: 'bg-[#F59E0B]',
  },
  'Dalam Proses': {
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#1D4ED8]',
    border: 'border-[#BFDBFE]',
    dot: 'bg-[#2563EB]',
  },
  Dipecah: {
    bg: 'bg-slate-100',
    text: 'text-[#334155]',
    border: 'border-[#CBD5E1]',
    dot: 'bg-[#475569]',
  },
  'Habis Terdistribusi': {
    bg: 'bg-slate-100',
    text: 'text-[#475569]',
    border: 'border-[#E2E8F0]',
    dot: 'bg-[#64748B]',
  },

  // Regulator / Certification Institution states
  'Menunggu Pemeriksaan': {
    bg: 'bg-[#FEF3C7]',
    text: 'text-[#B45309]',
    border: 'border-[#FDE68A]',
    dot: 'bg-[#F59E0B]',
  },
  'Dalam Pemeriksaan': {
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#1D4ED8]',
    border: 'border-[#BFDBFE]',
    dot: 'bg-[#2563EB]',
  },
  Disetujui: {
    bg: 'bg-[#DCFCE7]',
    text: 'text-[#15803D]',
    border: 'border-[#BBF7D0]',
    dot: 'bg-[#16A34A]',
  },
  Aktif: {
    bg: 'bg-[#DCFCE7]',
    text: 'text-[#15803D]',
    border: 'border-[#BBF7D0]',
    dot: 'bg-[#16A34A]',
  },
  Dicabut: {
    bg: 'bg-[#FEE2E2]',
    text: 'text-[#B91C1C]',
    border: 'border-[#FECACA]',
    dot: 'bg-[#EF4444]',
  },
  Kedaluwarsa: {
    bg: 'bg-slate-100',
    text: 'text-[#475569]',
    border: 'border-[#E2E8F0]',
    dot: 'bg-[#64748B]',
  },

  // Farmer (Petani) states
  Terverifikasi: {
    bg: 'bg-[#DCFCE7]',
    text: 'text-[#15803D]',
    border: 'border-[#BBF7D0]',
    dot: 'bg-[#16A34A]',
  },
  Tercatat: {
    bg: 'bg-[#DCFCE7]',
    text: 'text-[#15803D]',
    border: 'border-[#BBF7D0]',
    dot: 'bg-[#16A34A]',
  },
  'Koreksi Disetujui': {
    bg: 'bg-[#DCFCE7]',
    text: 'text-[#15803D]',
    border: 'border-[#BBF7D0]',
    dot: 'bg-[#16A34A]',
  },
  'Sertifikasi Tidak Valid': {
    bg: 'bg-[#FEE2E2]',
    text: 'text-[#B91C1C]',
    border: 'border-[#FECACA]',
    dot: 'bg-[#EF4444]',
  },
  'Dilaporkan Bermasalah': {
    bg: 'bg-[#FEE2E2]',
    text: 'text-[#B91C1C]',
    border: 'border-[#FECACA]',
    dot: 'bg-[#EF4444]',
  },
  'Koreksi Diajukan': {
    bg: 'bg-[#FEF3C7]',
    text: 'text-[#B45309]',
    border: 'border-[#FDE68A]',
    dot: 'bg-[#F59E0B]',
  },
  'Menunggu Persetujuan': {
    bg: 'bg-[#FEF3C7]',
    text: 'text-[#B45309]',
    border: 'border-[#FDE68A]',
    dot: 'bg-[#F59E0B]',
  },

  // Blockchain Event Statuses (Prompt C & H)
  NOT_REQUIRED: {
    bg: 'bg-slate-100',
    text: 'text-[#475569]',
    border: 'border-[#E2E8F0]',
    dot: 'bg-[#64748B]',
  },
  PENDING: {
    bg: 'bg-[#FEF3C7]',
    text: 'text-[#B45309]',
    border: 'border-[#FDE68A]',
    dot: 'bg-[#F59E0B]',
  },
  SUBMITTED: {
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#1D4ED8]',
    border: 'border-[#BFDBFE]',
    dot: 'bg-[#2563EB]',
  },
  COMMITTED: {
    bg: 'bg-[#DCFCE7]',
    text: 'text-[#15803D]',
    border: 'border-[#BBF7D0]',
    dot: 'bg-[#16A34A]',
  },
  FAILED: {
    bg: 'bg-[#FEE2E2]',
    text: 'text-[#B91C1C]',
    border: 'border-[#FECACA]',
    dot: 'bg-[#EF4444]',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const style = STATUS_STYLE_MAP[status] ?? {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
    dot: 'bg-slate-500',
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 border whitespace-nowrap shrink-0 ${style.bg} ${style.text} ${style.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} aria-hidden="true" />
      {status}
    </span>
  );
};
