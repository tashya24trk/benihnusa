import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Lock,
  ShieldCheck,
  X,
  XCircle,
} from 'lucide-react';
import { CertificationApplicationRecord } from '../../types/certificationAuthority';
import { StatusBadge } from '../ui/StatusBadge';

interface RegulatorApplicationReviewScreenProps {
  application: CertificationApplicationRecord;
  regulatorOrgName: string;
  onBack: () => void;
  onUpdateChecklist: (
    appId: string,
    checklist: CertificationApplicationRecord['checklist']
  ) => void;
  onApprove: (appId: string, certificateNumber: string, expiryDate: string) => void;
  onReject: (appId: string, reason: string) => void;
}

export const RegulatorApplicationReviewScreen: React.FC<
  RegulatorApplicationReviewScreenProps
> = ({
  application,
  regulatorOrgName,
  onBack,
  onUpdateChecklist,
  onApprove,
  onReject,
}) => {
  const [checklist, setChecklist] = useState(application.checklist);
  const [decisionMode, setDecisionMode] = useState<'approve' | 'reject' | null>(null);
  const [certNumber, setCertNumber] = useState(
    `BPSB-RIA-2026/0${Math.floor(1225 + Math.random() * 65)}`
  );
  const [expiryDate, setExpiryDate] = useState('2027-05-16');
  const [rejectionReason, setRejectionReason] = useState('');
  const [confirmActionChecked, setConfirmActionChecked] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isPending =
    application.status === 'Menunggu Pemeriksaan' ||
    application.status === 'Dalam Pemeriksaan';

  // Business Rule: Regulators cannot approve their own certification requests
  const isSelfSubmitted =
    Boolean(application.isSelfSubmitted) ||
    application.producerName === regulatorOrgName;

  const allChecked =
    checklist.administrativeComplete &&
    checklist.labQualityPassed &&
    checklist.fieldIsolationVerified &&
    checklist.packagingSealVerified;

  const toggleChecklist = (key: keyof typeof checklist) => {
    if (!isPending) return;
    const next = { ...checklist, [key]: !checklist[key] };
    setChecklist(next);
    onUpdateChecklist(application.id, next);
  };

  const handleConfirmApprove = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSelfSubmitted) {
      setErrorMsg('Lembaga sertifikasi tidak dapat menyetujui permohonannya sendiri.');
      return;
    }
    if (!allChecked) {
      setErrorMsg('Lengkapi seluruh 4 item daftar periksa pemeriksaan sebelum menyetujui.');
      return;
    }
    if (!certNumber.trim() || !expiryDate) {
      setErrorMsg('Nomor sertifikat dan tanggal masa berlaku wajib diisi.');
      return;
    }
    if (!confirmActionChecked) {
      setErrorMsg('Centang pernyataan konfirmasi penerbitan sertifikat terlebih dahulu.');
      return;
    }
    setErrorMsg(null);
    onApprove(application.id, certNumber.trim(), expiryDate);
    setDecisionMode(null);
    setConfirmActionChecked(false);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (rejectionReason.trim().length < 10) {
      setErrorMsg('Alasan penolakan wajib didokumentasikan minimal 10 karakter.');
      return;
    }
    if (!confirmActionChecked) {
      setErrorMsg('Centang pernyataan konfirmasi penolakan permohonan terlebih dahulu.');
      return;
    }
    setErrorMsg(null);
    onReject(application.id, rejectionReason.trim());
    setDecisionMode(null);
    setConfirmActionChecked(false);
  };

  return (
    <div className="space-y-6 max-w-[1180px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#64748B] hover:text-[#111827] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Permohonan Sertifikasi</span>
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827] tabular-nums">
              Pemeriksaan · {application.applicationNumber}
            </h1>
            <StatusBadge status={application.status} />
          </div>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Batch {application.batchNumber} · {application.variety} · {application.producerName}
          </p>
        </div>

        {isPending && (
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setDecisionMode('reject');
                setConfirmActionChecked(false);
                setErrorMsg(null);
              }}
              className="h-10 px-4 rounded-lg border border-[#FECACA] bg-white hover:bg-[#FEE2E2]/50 text-[#B91C1C] text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              <span>Tolak Permohonan</span>
            </button>

            <button
              type="button"
              disabled={isSelfSubmitted}
              onClick={() => {
                setDecisionMode('approve');
                setConfirmActionChecked(false);
                setErrorMsg(null);
              }}
              className="h-10 px-4 rounded-lg bg-[#00843D] hover:bg-[#006B32] disabled:bg-slate-200 disabled:text-slate-500 text-white text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Setujui Sertifikasi</span>
            </button>
          </div>
        )}
      </div>

      {/* Read-only & Compliance Notices */}
      <div className="space-y-3">
        <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white flex items-start gap-3 text-[13px] text-[#475569]">
          <Lock className="w-4 h-4 text-[#64748B] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#111827]">
              Data registrasi batch produsen bersifat baca-saja.
            </span>{' '}
            Regulator hanya melakukan verifikasi mutu, peninjauan dokumen, serta persetujuan atau penolakan sertifikasi tanpa mengubah data asal produsen.
          </div>
        </div>

        {isSelfSubmitted && isPending && (
          <div className="p-4 rounded-xl border border-[#FDE68A] bg-[#FEF3C7]/70 flex items-start gap-3 text-[13px] text-[#B45309]">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">
                Pembatasan Kepatuhan: Permohonan Diajukan oleh Institusi Sendiri
              </div>
              <div className="mt-0.5">
                Sesuai aturan pengawasan independen, regulator tidak diperbolehkan menyetujui permohonan sertifikasi atas batch yang diajukan oleh organisasinya sendiri.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Panel (Approve or Reject) */}
      {decisionMode && isPending && (
        <div
          className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4"
          style={{
            boxShadow:
              '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <h2 className="text-[16px] font-semibold text-[#111827]">
              {decisionMode === 'approve'
                ? 'Konfirmasi Persetujuan & Penerbitan Sertifikat'
                : 'Konfirmasi Penolakan Permohonan Sertifikasi'}
            </h2>
            <button
              type="button"
              onClick={() => setDecisionMode(null)}
              className="p-1 text-[#64748B] hover:text-[#111827] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-[#FEE2E2] border border-[#FECACA] text-[#B91C1C] text-[13px] font-medium">
              {errorMsg}
            </div>
          )}

          {decisionMode === 'approve' ? (
            <form onSubmit={handleConfirmApprove} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                    Nomor Sertifikat Resmi BPSB
                  </label>
                  <input
                    type="text"
                    value={certNumber}
                    onChange={(e) => setCertNumber(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] tabular-nums focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                    Berlaku Hingga
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] tabular-nums focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                  />
                </div>
              </div>

              <label className="flex items-start gap-2.5 text-[13px] text-[#334155] cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmActionChecked}
                  onChange={(e) => setConfirmActionChecked(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#00843D] rounded cursor-pointer"
                />
                <span>
                  Saya memastikan hasil pemeriksaan mutu dan dokumen batch {application.batchNumber} memenuhi standar SNI untuk diterbitkan sertifikat resminya.
                </span>
              </label>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setDecisionMode(null)}
                  className="h-9 px-4 rounded-lg border border-[#E2E8F0] bg-white text-[13px] font-semibold text-[#334155] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 rounded-lg bg-[#00843D] hover:bg-[#006B32] text-white text-[13px] font-semibold cursor-pointer"
                >
                  Konfirmasi Persetujuan Sertifikasi
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleConfirmReject} className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                  Alasan Penolakan Resmi (Wajib Didokumentasikan)
                </label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Tuliskan ketidaksesuaian parameter mutu, isolasi lapangan, atau dokumen pendukung..."
                  className="w-full p-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                />
              </div>

              <label className="flex items-start gap-2.5 text-[13px] text-[#334155] cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmActionChecked}
                  onChange={(e) => setConfirmActionChecked(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#EF4444] rounded cursor-pointer"
                />
                <span>
                  Saya mengonfirmasi keputusan penolakan permohonan {application.applicationNumber} beserta alasan yang akan disampaikan ke produsen.
                </span>
              </label>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setDecisionMode(null)}
                  className="h-9 px-4 rounded-lg border border-[#E2E8F0] bg-white text-[13px] font-semibold text-[#334155] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 rounded-lg bg-[#EF4444] hover:bg-[#DC2626] text-white text-[13px] font-semibold cursor-pointer"
                >
                  Konfirmasi Penolakan Permohonan
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          {/* Batch, Variety & Production Information */}
          <div
            className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-5"
            style={{
              boxShadow:
                '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <h2 className="text-[16px] font-semibold text-[#111827] pb-3 border-b border-[#E2E8F0]">
              Informasi Batch, Varietas &amp; Detail Produksi
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
              <div>
                <div className="text-[#64748B]">Nomor Batch</div>
                <div className="font-semibold text-[#111827] tabular-nums mt-0.5">
                  {application.batchNumber}
                </div>
              </div>
              <div>
                <div className="text-[#64748B]">Jenis &amp; Varietas Benih</div>
                <div className="font-semibold text-[#111827] mt-0.5">
                  {application.commodity} · {application.variety}
                </div>
              </div>
              <div>
                <div className="text-[#64748B]">Kelas Benih</div>
                <div className="font-medium text-[#111827] mt-0.5">
                  {application.seedClass}
                </div>
              </div>
              <div>
                <div className="text-[#64748B]">Jumlah Benih Diajukan</div>
                <div className="font-bold text-[#111827] tabular-nums mt-0.5">
                  {application.quantityKg.toLocaleString('id-ID')} kg
                </div>
              </div>
              <div>
                <div className="text-[#64748B]">Tanggal Produksi / Panen</div>
                <div className="font-medium text-[#111827] tabular-nums mt-0.5">
                  {application.productionDate}
                </div>
              </div>
              <div>
                <div className="text-[#64748B]">Musim Tanam</div>
                <div className="font-medium text-[#111827] mt-0.5">
                  {application.plantingSeason}
                </div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-[#64748B]">Lokasi Produksi</div>
                <div className="font-medium text-[#111827] mt-0.5">
                  {application.productionLocation}
                </div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-[#64748B]">Sumber Benih Induk</div>
                <div className="font-medium text-[#111827] tabular-nums mt-0.5">
                  {application.seedSource}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F1F5F9] grid grid-cols-3 gap-4 text-[13px]">
              <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="text-[#64748B]">Daya Kecambah</div>
                <div className="font-bold text-[15px] text-[#111827] tabular-nums mt-0.5">
                  {application.germinationRate.toFixed(1)}%
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="text-[#64748B]">Kadar Air</div>
                <div className="font-bold text-[15px] text-[#111827] tabular-nums mt-0.5">
                  {application.moistureContent.toFixed(1)}%
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="text-[#64748B]">Kemurnian Fisik</div>
                <div className="font-bold text-[15px] text-[#111827] tabular-nums mt-0.5">
                  {application.physicalPurity.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Producer Info & Supporting Documents */}
          <div
            className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-5"
            style={{
              boxShadow:
                '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <h2 className="text-[16px] font-semibold text-[#111827] pb-3 border-b border-[#E2E8F0]">
              Informasi Produsen &amp; Dokumen Pendukung
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
              <div>
                <div className="text-[#64748B]">Organisasi Produsen</div>
                <div className="font-semibold text-[#111827] mt-0.5">
                  {application.producerName}
                </div>
              </div>
              <div>
                <div className="text-[#64748B]">Nomor IUP Perbenihan</div>
                <div className="font-semibold text-[#111827] tabular-nums mt-0.5">
                  {application.producerLicense}
                </div>
              </div>
              <div>
                <div className="text-[#64748B]">Provinsi</div>
                <div className="font-medium text-[#111827] mt-0.5">
                  {application.producerProvince}
                </div>
              </div>
              <div>
                <div className="text-[#64748B]">Penanggung Jawab</div>
                <div className="font-medium text-[#111827] mt-0.5">
                  {application.producerContact}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F1F5F9] space-y-2.5">
              <div className="text-[13px] font-semibold text-[#111827]">
                Berkas Dokumen Terlampir ({application.documents.length})
              </div>
              {application.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-4 h-4 text-[#00843D] shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-[#111827] truncate">
                        {doc.name}
                      </div>
                      <div className="text-[11px] text-[#64748B] tabular-nums">
                        {doc.docType} · {doc.fileSize} · Diunggah {doc.uploadedAt}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#15803D] inline-flex items-center gap-1 shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Terverifikasi
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Inspection Checklist & Review History */}
        <div className="lg:col-span-5 space-y-6">
          <div
            className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4"
            style={{
              boxShadow:
                '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h2 className="text-[16px] font-semibold text-[#111827]">
                Daftar Periksa Pemeriksaan
              </h2>
              <span className="text-[12px] font-semibold text-[#00843D] tabular-nums">
                {Object.values(checklist).filter(Boolean).length} / 4 Selesai
              </span>
            </div>

            <div className="space-y-3 text-[13px]">
              {(
                [
                  {
                    key: 'administrativeComplete',
                    label: 'Kelengkapan administrasi & legalitas IUP produsen valid.',
                  },
                  {
                    key: 'labQualityPassed',
                    label: 'Hasil uji mutu laboratorium memenuhi ambang SNI.',
                  },
                  {
                    key: 'fieldIsolationVerified',
                    label: 'Pemeriksaan isolasi pertanaman & kemurnian varietas lapangan sesuai.',
                  },
                  {
                    key: 'packagingSealVerified',
                    label: 'Rencana kemasan & kesiapan penomoran label sertifikasi terverifikasi.',
                  },
                ] as const
              ).map((item) => (
                <label
                  key={item.key}
                  className={`flex items-start gap-2.5 p-3 rounded-lg border ${
                    checklist[item.key]
                      ? 'bg-[#F0FAF3]/70 border-[#BBF7D0]'
                      : 'bg-[#F8FAFC] border-[#E2E8F0]'
                  } ${isPending ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <input
                    type="checkbox"
                    disabled={!isPending}
                    checked={checklist[item.key]}
                    onChange={() => toggleChecklist(item.key)}
                    className="mt-0.5 w-4 h-4 accent-[#00843D] rounded cursor-pointer"
                  />
                  <span className="text-[#111827] leading-snug">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {application.certificateNumber && (
            <div className="p-5 rounded-xl bg-[#DCFCE7]/60 border border-[#BBF7D0] space-y-1">
              <div className="text-[12px] font-semibold text-[#15803D]">
                Sertifikat Resmi Telah Diterbitkan
              </div>
              <div className="text-[16px] font-bold text-[#111827] tabular-nums">
                {application.certificateNumber}
              </div>
            </div>
          )}

          {application.rejectionReason && (
            <div className="p-5 rounded-xl bg-[#FEE2E2]/70 border border-[#FECACA] space-y-1.5">
              <div className="text-[12px] font-semibold text-[#B91C1C]">
                Alasan Penolakan Tercatat
              </div>
              <p className="text-[13px] text-[#7F1D1D] leading-relaxed">
                {application.rejectionReason}
              </p>
            </div>
          )}

          {/* Review History */}
          <div
            className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4"
            style={{
              boxShadow:
                '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <h2 className="text-[16px] font-semibold text-[#111827] pb-3 border-b border-[#E2E8F0]">
              Riwayat Pemeriksaan
            </h2>

            <div className="space-y-4">
              {application.reviewHistory.map((ev, idx) => (
                <div key={ev.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00843D] mt-1.5 shrink-0" />
                    {idx < application.reviewHistory.length - 1 && (
                      <div className="w-px flex-1 bg-[#E2E8F0] my-1 min-h-[20px]" />
                    )}
                  </div>
                  <div className="pb-1 min-w-0">
                    <div className="text-[13px] font-semibold text-[#111827]">
                      {ev.action}
                    </div>
                    <div className="text-[11px] text-[#64748B] tabular-nums mt-0.5">
                      {ev.timestamp} · {ev.actor} ({ev.role})
                    </div>
                    <p className="text-[12px] text-[#334155] mt-1 leading-relaxed">
                      {ev.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
