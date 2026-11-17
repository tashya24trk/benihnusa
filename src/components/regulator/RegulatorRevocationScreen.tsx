import React, { useMemo, useState } from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { SeedCertificationRecord } from '../../types/certificationAuthority';
import { StatusBadge } from '../ui/StatusBadge';

interface RegulatorRevocationScreenProps {
  certificates: SeedCertificationRecord[];
  preselectedCertId?: string | null;
  onRevokeCertificate: (payload: {
    certId: string;
    reason: string;
    revocationDate: string;
  }) => void;
}

export const RegulatorRevocationScreen: React.FC<
  RegulatorRevocationScreenProps
> = ({ certificates, preselectedCertId, onRevokeCertificate }) => {
  const activeCerts = useMemo(
    () => certificates.filter((c) => c.status === 'Aktif'),
    [certificates]
  );

  const revokedCerts = useMemo(
    () => certificates.filter((c) => c.status === 'Dicabut'),
    [certificates]
  );

  const [selectedCertId, setSelectedCertId] = useState(
    preselectedCertId && activeCerts.some((c) => c.id === preselectedCertId)
      ? preselectedCertId
      : activeCerts[0]?.id ?? ''
  );
  const [reason, setReason] = useState('');
  const [revocationDate, setRevocationDate] = useState('2026-11-16');
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [finalConfirmStep, setFinalConfirmStep] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedCert =
    activeCerts.find((c) => c.id === selectedCertId) ?? activeCerts[0] ?? null;

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCert) {
      setErrorMsg('Tidak ada sertifikat aktif yang dapat dicabut.');
      return;
    }
    if (reason.trim().length < 15) {
      setErrorMsg(
        'Alasan pencabutan sertifikasi wajib didokumentasikan secara jelas (minimal 15 karakter).'
      );
      return;
    }
    if (!revocationDate) {
      setErrorMsg('Tanggal pencabutan wajib diisi.');
      return;
    }
    if (!confirmChecked) {
      setErrorMsg('Centang pernyataan berita acara pengawasan sebelum melanjutkan.');
      return;
    }
    setErrorMsg(null);
    setFinalConfirmStep(true);
  };

  const handleConfirmExecute = () => {
    if (!selectedCert) return;
    onRevokeCertificate({
      certId: selectedCert.id,
      reason: reason.trim(),
      revocationDate,
    });
    setReason('');
    setConfirmChecked(false);
    setFinalConfirmStep(false);
    const nextActive = activeCerts.find((c) => c.id !== selectedCert.id);
    setSelectedCertId(nextActive?.id ?? '');
  };

  return (
    <div className="space-y-6 max-w-[1160px]">
      <div>
        <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
          Pencabutan Sertifikasi
        </h1>
        <p className="mt-1 text-[14px] text-[#64748B]">
          Prosedur pencabutan sertifikat benih yang terbukti melanggar ketentuan mutu pasca-sertifikasi atau ketidaksesuaian label.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Revocation Form */}
        <div
          className="lg:col-span-6 bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-5"
          style={{
            boxShadow:
              '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
            <ShieldAlert className="w-5 h-5 text-[#EF4444]" />
            <h2 className="text-[16px] font-semibold text-[#111827]">
              Formulir Pencabutan Sertifikat Resmi
            </h2>
          </div>

          {activeCerts.length === 0 ? (
            <p className="text-[13px] text-[#64748B]">
              Tidak ada sertifikat berstatus Aktif yang tersedia untuk dicabut saat ini.
            </p>
          ) : (
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-lg bg-[#FEE2E2] border border-[#FECACA] text-[#B91C1C] text-[13px] font-medium">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                  Pilih Sertifikat Aktif
                </label>
                <select
                  value={selectedCert?.id ?? ''}
                  onChange={(e) => {
                    setSelectedCertId(e.target.value);
                    setFinalConfirmStep(false);
                  }}
                  className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[14px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                >
                  {activeCerts.map((cert) => (
                    <option key={cert.id} value={cert.id}>
                      {cert.certificateNumber} · {cert.batchNumber} ({cert.producerName})
                    </option>
                  ))}
                </select>
              </div>

              {selectedCert && (
                <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] grid grid-cols-2 gap-3 text-[13px]">
                  <div>
                    <div className="text-[#64748B]">Nomor Sertifikasi</div>
                    <div className="font-semibold text-[#111827] tabular-nums mt-0.5">
                      {selectedCert.certificateNumber}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#64748B]">Nomor Batch</div>
                    <div className="font-semibold text-[#111827] tabular-nums mt-0.5">
                      {selectedCert.batchNumber}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#64748B]">Produsen</div>
                    <div className="font-medium text-[#111827] mt-0.5">
                      {selectedCert.producerName}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#64748B]">Status Saat Ini</div>
                    <div className="mt-1">
                      <StatusBadge status={selectedCert.status} />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                  Tanggal Pencabutan
                </label>
                <input
                  type="date"
                  value={revocationDate}
                  onChange={(e) => setRevocationDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] tabular-nums focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                  Alasan Pencabutan Terdokumentasi (Wajib)
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Contoh: Hasil pengawasan lapangan menemukan kerusakan penyimpanan atau pemalsuan segel QR..."
                  className="w-full p-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                />
              </div>

              <label className="flex items-start gap-2.5 text-[13px] text-[#334155] cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmChecked}
                  onChange={(e) => setConfirmChecked(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#EF4444] rounded cursor-pointer"
                />
                <span>
                  Saya menyatakan pencabutan sertifikat ini telah didukung berita acara pengawasan resmi BPSB.
                </span>
              </label>

              {!finalConfirmStep ? (
                <button
                  type="submit"
                  className="w-full h-10 rounded-lg bg-[#EF4444] hover:bg-[#DC2626] text-white text-[13px] font-semibold cursor-pointer"
                >
                  Ajukan Konfirmasi Pencabutan Sertifikat
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-[#FEE2E2]/80 border border-[#FECACA] space-y-3">
                  <div className="flex items-start gap-2.5 text-[13px] text-[#991B1B]">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">
                        Konfirmasi Akhir Pencabutan Permanen
                      </div>
                      <p className="mt-0.5">
                        Sertifikat <strong>{selectedCert?.certificateNumber}</strong> akan berstatus <strong>Dicabut</strong> dan dicatat ke jejak ketertelusuran blockchain.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setFinalConfirmStep(false)}
                      className="h-9 px-3.5 rounded-lg border border-[#E2E8F0] bg-white text-[12px] font-semibold text-[#334155] cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmExecute}
                      className="h-9 px-4 rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] text-white text-[12px] font-semibold cursor-pointer"
                    >
                      Sahkan Pencabutan Sertifikasi
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Right: Revoked Certificates Registry */}
        <div
          className="lg:col-span-6 bg-white rounded-xl border border-[#E2E8F0] overflow-hidden"
          style={{
            boxShadow:
              '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div className="px-6 py-4 border-b border-[#E2E8F0]">
            <h2 className="text-[16px] font-semibold text-[#111827]">
              Daftar Sertifikasi Dicabut ({revokedCerts.length})
            </h2>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              Riwayat pencabutan sertifikat beserta alasan dan tanggal penetapan
            </p>
          </div>

          <div className="divide-y divide-[#F1F5F9]">
            {revokedCerts.length === 0 ? (
              <div className="p-8 text-center text-[13px] text-[#64748B]">
                Belum ada sertifikasi yang dicabut.
              </div>
            ) : (
              revokedCerts.map((cert) => (
                <div key={cert.id} className="p-5 space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[14px] font-semibold text-[#111827] tabular-nums">
                        {cert.certificateNumber}
                      </div>
                      <div className="text-[12px] text-[#64748B] tabular-nums mt-0.5">
                        Batch {cert.batchNumber} · {cert.producerName}
                      </div>
                    </div>
                    <StatusBadge status={cert.status} />
                  </div>

                  <p className="text-[13px] text-[#334155] leading-relaxed bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                    {cert.revocationReason}
                  </p>

                  <div className="flex items-center justify-between text-[12px] text-[#64748B] tabular-nums">
                    <span>Tanggal Pencabutan: {cert.revocationDate}</span>
                    <span>Oleh: {cert.revokedBy ?? 'Ir. Sari Wijaya'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
