import React, { useMemo, useState } from 'react';
import {
  Activity,
  CalendarDays,
  Cpu,
  Info,
  Link2,
  Search,
  Shield,
} from 'lucide-react';
import {
  AuditEventKind,
  AuditLogEntry,
  AuditSourceType,
} from '../../types/admin';
import { MetricCard } from '../ui/MetricCard';
import { StatusBadge } from '../ui/StatusBadge';
import {
  EmptyStateView,
  ErrorStateBanner,
  LoadingStateSkeleton,
} from '../ui/SystemStateViews';

interface AdminAuditLogScreenProps {
  logs: AuditLogEntry[];
}

export const AdminAuditLogScreen: React.FC<AdminAuditLogScreenProps> = ({
  logs,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [actionFilter, setActionFilter] = useState<'Semua' | AuditEventKind>(
    'Semua'
  );
  const [sourceFilter, setSourceFilter] = useState<'Semua' | AuditSourceType>(
    'Semua'
  );
  const [previewState, setPreviewState] = useState<
    'normal' | 'loading' | 'error'
  >('normal');

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return logs.filter((log) => {
      if (dateFilter && log.dateKey !== dateFilter) return false;
      if (actionFilter !== 'Semua' && log.eventKind !== actionFilter)
        return false;
      if (sourceFilter !== 'Semua' && log.source !== sourceFilter) return false;
      if (!q) return true;
      return (
        log.actorName.toLowerCase().includes(q) ||
        log.activity.toLowerCase().includes(q) ||
        log.entityLabel.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q)
      );
    });
  }, [logs, searchQuery, dateFilter, actionFilter, sourceFilter]);

  const todayCount = logs.filter((l) => l.dateKey === '2026-11-16').length;
  const systemRoleCount = logs.filter(
    (l) => l.eventKind === 'PERAN_SISTEM' || l.eventKind === 'AUDIT_UMUM'
  ).length;
  const blockchainCount = logs.filter(
    (l) => l.blockchainStatus !== 'NOT_REQUIRED'
  ).length;

  const renderEventKindBadge = (kind: AuditEventKind) => {
    if (kind === 'PERAN_SISTEM') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 border border-[#E2E8F0] text-[11px] font-semibold text-[#334155]">
          <Shield className="w-3 h-3 text-[#64748B]" />
          Peran Sistem
        </span>
      );
    }
    if (kind === 'BISNIS_BLOCKCHAIN') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F0FAF3] border border-[#BBF7D0] text-[11px] font-semibold text-[#00843D]">
          <Link2 className="w-3 h-3" />
          Bisnis Blockchain
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-[11px] font-semibold text-[#1D4ED8]">
        Audit Umum
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
            Audit Log Sistem
          </h1>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Pemantauan peristiwa tata kelola umum, aktivitas peran sistem, dan sinkronisasi transaksi bisnis ke blockchain.
          </p>
        </div>

        {/* UI State Preview Toggle for Prompt C/H Verification */}
        <div className="inline-flex items-center p-1 rounded-lg bg-white border border-[#E2E8F0] self-start">
          {(
            [
              { id: 'normal', label: 'Normal' },
              { id: 'loading', label: 'Loading' },
              { id: 'error', label: 'Error' },
            ] as const
          ).map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setPreviewState(mode.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer ${
                previewState === mode.id
                  ? 'bg-[#F0FAF3] text-[#00843D]'
                  : 'text-[#64748B] hover:text-[#111827]'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Distinction Notice */}
      <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] flex items-start gap-3 text-[13px] text-[#334155]">
        <Info className="w-5 h-5 text-[#00843D] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-[#111827]">
            Pemisahan Event Audit &amp; Blockchain:
          </span>{' '}
          Login, persetujuan akun, dan administrasi internal dicatat sebagai{' '}
          <strong className="tabular-nums">NOT_REQUIRED</strong>. Hanya peristiwa bisnis ketertelusuran benih yang relevan menggunakan status blockchain{' '}
          <strong className="tabular-nums">PENDING / SUBMITTED / COMMITTED / FAILED</strong>.
        </div>
      </div>

      {/* Four Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Total Aktivitas"
          value={String(logs.length)}
          trendText="Tercatat"
          trendContext="seluruh log audit"
          icon={Activity}
        />
        <MetricCard
          title="Aktivitas Hari Ini"
          value={String(todayCount)}
          trendText="Hari Ini"
          trendContext="16 Nov 2026"
          icon={CalendarDays}
        />
        <MetricCard
          title="Aktivitas Sistem"
          value={String(systemRoleCount)}
          trendText="NOT_REQUIRED"
          trendContext="auth & tata kelola admin"
          trendPositive={true}
          icon={Cpu}
        />
        <MetricCard
          title="Aktivitas Blockchain"
          value={String(blockchainCount)}
          trendText="On-Chain"
          trendContext="peristiwa bisnis benih"
          icon={Link2}
        />
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari aktor, entitas, atau aktivitas..."
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00843D]"
          />
        </div>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#111827] tabular-nums focus:outline-none focus:border-[#00843D]"
        />

        <select
          value={actionFilter}
          onChange={(e) =>
            setActionFilter(e.target.value as 'Semua' | AuditEventKind)
          }
          className="h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#111827] focus:outline-none focus:border-[#00843D]"
        >
          <option value="Semua">Semua Jenis Event</option>
          <option value="PERAN_SISTEM">Peristiwa Peran Sistem</option>
          <option value="AUDIT_UMUM">Peristiwa Audit Umum</option>
          <option value="BISNIS_BLOCKCHAIN">Peristiwa Bisnis Blockchain</option>
        </select>

        <select
          value={sourceFilter}
          onChange={(e) =>
            setSourceFilter(e.target.value as 'Semua' | AuditSourceType)
          }
          className="h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#111827] focus:outline-none focus:border-[#00843D]"
        >
          <option value="Semua">Semua Sumber</option>
          <option value="AUTH_SYSTEM">AUTH_SYSTEM</option>
          <option value="ADMIN_GOVERNANCE">ADMIN_GOVERNANCE</option>
          <option value="SEED_WORKFLOW">SEED_WORKFLOW</option>
          <option value="BLOCKCHAIN_GATEWAY">BLOCKCHAIN_GATEWAY</option>
        </select>
      </div>

      {/* State Rendering */}
      {previewState === 'loading' ? (
        <LoadingStateSkeleton rows={5} />
      ) : previewState === 'error' ? (
        <ErrorStateBanner
          title="Koneksi Node Audit Terputus (Simulasi)"
          message="Gagal menyinkronkan log audit dari layanan ledger sementara. Silakan muat ulang untuk mencoba lagi."
          onRetry={() => setPreviewState('normal')}
        />
      ) : (
        <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
          {filtered.length === 0 ? (
            <EmptyStateView
              title="Log Audit Kosong"
              description="Tidak ditemukan catatan aktivitas yang sesuai dengan filter pencarian dan tanggal."
              actionLabel="Reset Semua Filter"
              onAction={() => {
                setSearchQuery('');
                setDateFilter('');
                setActionFilter('Semua');
                setSourceFilter('Semua');
              }}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-semibold text-[#64748B]">
                    <th className="py-3 px-4">Waktu</th>
                    <th className="py-3 px-4">Aktor</th>
                    <th className="py-3 px-4">Aktivitas</th>
                    <th className="py-3 px-4">Entitas</th>
                    <th className="py-3 px-4">Sumber</th>
                    <th className="py-3 px-4">Status Blockchain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] text-[13px]">
                  {filtered.map((log) => (
                    <tr key={log.id} className="hover:bg-[#F8FAFC]/80 align-top">
                      <td className="py-3.5 px-4 text-[#475569] tabular-nums whitespace-nowrap text-[12px]">
                        {log.timestamp}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#111827]">
                          {log.actorName}
                        </div>
                        <div className="text-[11px] text-[#64748B]">
                          {log.actorRole}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-[300px]">
                        <div className="font-medium text-[#111827]">
                          {log.activity}
                        </div>
                        <div className="text-[12px] text-[#64748B] mt-0.5">
                          {log.details}
                        </div>
                        <div className="mt-1.5">{renderEventKindBadge(log.eventKind)}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#111827] tabular-nums whitespace-nowrap">
                        {log.entityLabel}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-[#475569] text-[11px] font-mono">
                          {log.source}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={log.blockchainStatus} />
                        {log.txHash && (
                          <div className="mt-1 text-[11px] font-mono text-[#64748B]">
                            {log.txHash}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
