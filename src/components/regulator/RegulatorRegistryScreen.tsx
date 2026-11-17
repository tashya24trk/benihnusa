import React, { useMemo, useState } from 'react';
import {
  Award,
  ChevronDown,
  Eye,
  Filter,
  GitBranch,
  Search,
  ShieldAlert,
  X,
} from 'lucide-react';
import {
  CertificateRegistryStatus,
  CommodityType,
  SeedCertificationRecord,
} from '../../types/certificationAuthority';
import { QrCodeSvg } from '../ui/QrCodeSvg';
import { StatusBadge } from '../ui/StatusBadge';

interface RegulatorRegistryScreenProps {
  certificates: SeedCertificationRecord[];
  onInspectBatchVerification: (batchId: string) => void;
  onInspectTraceability: (batchId: string) => void;
  onOpenRevocation: (certId: string) => void;
}

export const RegulatorRegistryScreen: React.FC<
  RegulatorRegistryScreenProps
> = ({
  certificates,
  onInspectBatchVerification,
  onInspectTraceability,
  onOpenRevocation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | CertificateRegistryStatus>('Semua');
  const [commodityFilter, setCommodityFilter] = useState<'Semua' | CommodityType>('Semua');
  const [selectedCertId, setSelectedCertId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return certificates.filter((cert) => {
      if (statusFilter !== 'Semua' && cert.status !== statusFilter) return false;
      if (commodityFilter !== 'Semua' && cert.commodity !== commodityFilter) return false;
      if (!q) return true;
      return (
        cert.certificateNumber.toLowerCase().includes(q) ||
        cert.batchNumber.toLowerCase().includes(q) ||
        cert.producerName.toLowerCase().includes(q) ||
        cert.variety.toLowerCase().includes(q)
      );
    });
  }, [certificates, searchQuery, statusFilter, commodityFilter]);

  const selectedCert = useMemo(
    () => certificates.find((c) => c.id === selectedCertId) ?? null,
    [certificates, selectedCertId]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
          Data Sertifikasi
        </h1>
        <p className="mt-1 text-[14px] text-[#64748B]">
          Registri resmi sertifikat benih yang diterbitkan oleh lembaga sertifikasi beserta status masa berlakunya.
        </p>
      </div>

      <div
        className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden"
        style={{
          boxShadow:
            '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        }}
      >
        {/* Toolbar */}
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex flex-wrap items-center gap-2.5">
          <div className="relative w-full sm:w-[320px]">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nomor sertifikasi, batch, atau produsen..."
              className="w-full h-10 pl-9 pr-8 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#111827] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="relative">
            <Filter className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as 'Semua' | CertificateRegistryStatus)
              }
              aria-label="Filter status sertifikasi"
              className="h-10 pl-8 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] font-medium text-[#111827] appearance-none hover:bg-[#F8FAFC] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20 cursor-pointer"
            >
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Dicabut">Dicabut</option>
              <option value="Kedaluwarsa">Kedaluwarsa</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={commodityFilter}
              onChange={(e) =>
                setCommodityFilter(e.target.value as 'Semua' | CommodityType)
              }
              aria-label="Filter jenis benih"
              className="h-10 pl-3 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] font-medium text-[#111827] appearance-none hover:bg-[#F8FAFC] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20 cursor-pointer"
            >
              <option value="Semua">Semua Jenis Benih</option>
              <option value="Kelapa Sawit">Kelapa Sawit</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">
                <th className="py-3 pl-5 pr-3 whitespace-nowrap">Nomor Sertifikasi</th>
                <th className="py-3 px-3 whitespace-nowrap">Nomor Batch</th>
                <th className="py-3 px-3 whitespace-nowrap">Produsen</th>
                <th className="py-3 px-3 whitespace-nowrap">Jenis Benih</th>
                <th className="py-3 px-3 whitespace-nowrap">Tanggal Penerbitan</th>
                <th className="py-3 px-3 whitespace-nowrap">Status Sertifikasi</th>
                <th className="py-3 pl-3 pr-5 whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 px-6 text-center text-[13px] text-[#64748B]">
                    Tidak ada sertifikat yang sesuai dengan kriteria pencarian Anda.
                  </td>
                </tr>
              ) : (
                filtered.map((cert) => (
                  <tr
                    key={cert.id}
                    onClick={() => setSelectedCertId(cert.id)}
                    className="h-[54px] border-b border-[#F1F5F9] last:border-b-0 bg-white hover:bg-[#F0FAF3] transition-colors cursor-pointer"
                  >
                    <td className="py-2.5 pl-5 pr-3 whitespace-nowrap">
                      <span className="text-[13px] font-semibold text-[#00843D] tabular-nums">
                        {cert.certificateNumber}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="text-[13px] font-semibold text-[#111827] tabular-nums">
                        {cert.batchNumber}
                      </div>
                      <div className="text-[11px] text-[#64748B] tabular-nums">
                        {cert.quantityKg.toLocaleString('id-ID')} kg
                      </div>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="text-[13px] text-[#111827] max-w-[200px] truncate">
                        {cert.producerName}
                      </div>
                      <div className="text-[11px] text-[#64748B]">{cert.producerProvince}</div>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="text-[13px] font-medium text-[#111827]">
                        {cert.commodity} · {cert.variety}
                      </div>
                      <div className="text-[11px] text-[#64748B]">{cert.seedClass}</div>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="text-[13px] text-[#111827] tabular-nums">
                        {cert.issueDate}
                      </div>
                      <div className="text-[11px] text-[#64748B] tabular-nums">
                        s.d. {cert.expiryDate}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <StatusBadge status={cert.status} />
                    </td>
                    <td
                      className="py-2.5 pl-3 pr-5 whitespace-nowrap text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedCertId(cert.id)}
                        className="h-8 px-3 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[12px] font-semibold text-[#334155] inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#64748B]" />
                        <span>Detail</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certification Detail Drawer */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-[2px]"
            onClick={() => setSelectedCertId(null)}
            aria-hidden="true"
          />
          <aside
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-[560px] bg-white h-full border-l border-[#E2E8F0] flex flex-col overflow-hidden"
            style={{
              boxShadow:
                '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
            }}
          >
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-[#00843D]" />
                <div>
                  <h2 className="text-[16px] font-semibold text-[#111827] tabular-nums">
                    {selectedCert.certificateNumber}
                  </h2>
                  <p className="text-[12px] text-[#64748B]">
                    Detail Sertifikat Mutu Benih Resmi
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCertId(null)}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#111827] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div>
                  <div className="text-[12px] text-[#64748B]">Status Sertifikat</div>
                  <div className="mt-1">
                    <StatusBadge status={selectedCert.status} />
                  </div>
                  <div className="text-[12px] text-[#64748B] mt-2 tabular-nums">
                    Terbit {selectedCert.issueDate} · Berlaku s.d. {selectedCert.expiryDate}
                  </div>
                </div>
                <QrCodeSvg
                  value={`${selectedCert.certificateNumber}|${selectedCert.batchNumber}`}
                  size={84}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-[13px]">
                <div>
                  <div className="text-[#64748B]">Nomor Batch</div>
                  <div className="font-semibold text-[#111827] tabular-nums mt-0.5">
                    {selectedCert.batchNumber}
                  </div>
                </div>
                <div>
                  <div className="text-[#64748B]">Nomor Permohonan</div>
                  <div className="font-semibold text-[#111827] tabular-nums mt-0.5">
                    {selectedCert.applicationNumber}
                  </div>
                </div>
                <div>
                  <div className="text-[#64748B]">Produsen</div>
                  <div className="font-semibold text-[#111827] mt-0.5">
                    {selectedCert.producerName}
                  </div>
                </div>
                <div>
                  <div className="text-[#64748B]">Jenis &amp; Bahan Tanam</div>
                  <div className="font-medium text-[#111827] mt-0.5">
                    {selectedCert.commodity} · {selectedCert.variety}
                  </div>
                </div>
                <div>
                  <div className="text-[#64748B]">Kelas Benih</div>
                  <div className="font-medium text-[#111827] mt-0.5">
                    {selectedCert.seedClass}
                  </div>
                </div>
                <div>
                  <div className="text-[#64748B]">Volume Tersertifikasi</div>
                  <div className="font-bold text-[#111827] tabular-nums mt-0.5">
                    {selectedCert.quantityKg.toLocaleString('id-ID')} kg
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-[13px] pt-3 border-t border-[#E2E8F0]">
                <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="text-[#64748B]">Daya Kecambah</div>
                  <div className="font-bold text-[#111827] tabular-nums mt-0.5">
                    {selectedCert.germinationRate.toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="text-[#64748B]">Kadar Air</div>
                  <div className="font-bold text-[#111827] tabular-nums mt-0.5">
                    {selectedCert.moistureContent.toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="text-[#64748B]">Kemurnian</div>
                  <div className="font-bold text-[#111827] tabular-nums mt-0.5">
                    {selectedCert.physicalPurity.toFixed(1)}%
                  </div>
                </div>
              </div>

              {selectedCert.status === 'Dicabut' && selectedCert.revocationReason && (
                <div className="p-4 rounded-xl bg-[#FEE2E2]/70 border border-[#FECACA] space-y-1.5">
                  <div className="text-[12px] font-semibold text-[#B91C1C]">
                    Sertifikat Dicabut Pada {selectedCert.revocationDate}
                  </div>
                  <p className="text-[13px] text-[#7F1D1D] leading-relaxed">
                    {selectedCert.revocationReason}
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onInspectBatchVerification(selectedCert.batchId);
                    setSelectedCertId(null);
                  }}
                  className="h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white hover:bg-slate-50 text-[12px] font-semibold text-[#334155] cursor-pointer"
                >
                  Verifikasi Batch
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onInspectTraceability(selectedCert.batchId);
                    setSelectedCertId(null);
                  }}
                  className="h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F0FAF3] text-[12px] font-semibold text-[#00843D] inline-flex items-center gap-1 cursor-pointer"
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>Telusuri</span>
                </button>
              </div>

              {selectedCert.status === 'Aktif' && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenRevocation(selectedCert.id);
                    setSelectedCertId(null);
                  }}
                  className="h-9 px-3.5 rounded-lg border border-[#FECACA] bg-white hover:bg-[#FEE2E2]/60 text-[12px] font-semibold text-[#B91C1C] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Cabut Sertifikasi</span>
                </button>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
