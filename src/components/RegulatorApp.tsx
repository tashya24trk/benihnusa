import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import {
  INITIAL_BATCHES,
  INITIAL_PRODUCERS,
  INITIAL_SHIPMENTS,
} from '../data/mockSeedData';
import {
  DistributionShipment,
  ScreenId,
  SeedBatch,
} from '../types/seed';
import { BatchManagementScreen } from './BatchManagementScreen';
import { DistributionScreen } from './DistributionScreen';
import { Header } from './Header';
import { LabInspectionScreen } from './LabInspectionScreen';
import { OverviewScreen } from './OverviewScreen';
import { ProducersScreen } from './ProducersScreen';
import { Sidebar } from './Sidebar';
import { AddBatchModal } from './modals/AddBatchModal';
import { BatchDetailDrawer } from './modals/BatchDetailDrawer';
import { CertificationModal } from './modals/CertificationModal';
import { QrLookupModal } from './modals/QrLookupModal';

import { PortalMode } from '../types/certificationAuthority';

const STORAGE_KEY_BATCHES = 'benihnusa_batches_v1';
const STORAGE_KEY_SHIPMENTS = 'benihnusa_shipments_v1';

interface RegulatorAppProps {
  onSwitchPortal: (portal: PortalMode) => void;
}

export function RegulatorApp({ onSwitchPortal }: RegulatorAppProps) {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [batches, setBatches] = useState<SeedBatch[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BATCHES);
      return saved ? (JSON.parse(saved) as SeedBatch[]) : INITIAL_BATCHES;
    } catch {
      return INITIAL_BATCHES;
    }
  });

  const [shipments, setShipments] = useState<DistributionShipment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SHIPMENTS);
      return saved ? (JSON.parse(saved) as DistributionShipment[]) : INITIAL_SHIPMENTS;
    } catch {
      return INITIAL_SHIPMENTS;
    }
  });

  const [producers] = useState(INITIAL_PRODUCERS);
  const [inspectedBatchId, setInspectedBatchId] = useState<string | null>(null);
  const [certModal, setCertModal] = useState<{
    batch: SeedBatch | null;
    mode: 'approve' | 'reject' | null;
  }>({ batch: null, mode: null });
  const [addBatchOpen, setAddBatchOpen] = useState(false);
  const [qrLookupOpen, setQrLookupOpen] = useState(false);
  const [producerBatchFilter, setProducerBatchFilter] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BATCHES, JSON.stringify(batches));
    } catch {
      // Ignore storage quota issues
    }
  }, [batches]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SHIPMENTS, JSON.stringify(shipments));
    } catch {
      // Ignore storage quota issues
    }
  }, [shipments]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  const inspectedBatch = useMemo(
    () => batches.find((b) => b.id === inspectedBatchId) ?? null,
    [batches, inspectedBatchId]
  );

  const pendingLabCount = useMemo(
    () =>
      batches.filter(
        (b) =>
          b.status === 'Menunggu Verifikasi' ||
          b.status === 'Masa Karantina' ||
          b.status === 'Lolos Uji Mutu'
      ).length,
    [batches]
  );

  const activeShipmentsCount = useMemo(
    () => shipments.filter((s) => s.status !== 'Distribusi Selesai').length,
    [shipments]
  );

  const handleCreateBatch = (newBatch: SeedBatch) => {
    setBatches((prev) => [newBatch, ...prev]);
    showToast(`Batch ${newBatch.batchNumber} berhasil didaftarkan ke antrean uji mutu.`);
  };

  const handleConfirmApprove = (
    batchId: string,
    certificateNumber: string,
    expiryDate: string
  ) => {
    const today = '2026-11-16';
    const timeStr = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setBatches((prev) =>
      prev.map((b) => {
        if (b.id !== batchId) return b;
        return {
          ...b,
          status: 'Sertifikat Terbit',
          certificateNumber,
          certificationDate: today,
          expiryDate,
          labInspector: 'Ir. Sari Wijaya',
          rejectionReason: undefined,
          auditTrail: [
            {
              id: `ev-${Date.now()}`,
              timestamp: `16 Nov 2026 ${timeStr} WIB`,
              actor: 'Ir. Sari Wijaya',
              role: 'Inspektur Madya BPSB',
              action: `Sertifikat Simulasi Diterbitkan (${certificateNumber})`,
              note: `Label ketertelusuran QR aktif berlaku hingga ${expiryDate}.`,
            },
            ...b.auditTrail,
          ],
        };
      })
    );
    showToast(`Sertifikat ${certificateNumber} berhasil diterbitkan.`);
  };

  const handleConfirmReject = (batchId: string, reason: string) => {
    const timeStr = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setBatches((prev) =>
      prev.map((b) => {
        if (b.id !== batchId) return b;
        return {
          ...b,
          status: 'Ditolak BPSB',
          labInspector: 'Ir. Sari Wijaya',
          rejectionReason: reason,
          auditTrail: [
            {
              id: `ev-${Date.now()}`,
              timestamp: `16 Nov 2026 ${timeStr} WIB`,
              actor: 'Ir. Sari Wijaya',
              role: 'Inspektur Madya BPSB',
              action: 'Batch Dinyatakan Ditolak BPSB',
              note: reason,
            },
            ...b.auditTrail,
          ],
        };
      })
    );
    showToast('Status batch diperbarui menjadi Ditolak BPSB.');
  };

  const handleBulkApprove = (batchIds: string[]) => {
    const today = '2026-11-16';
    const timeStr = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const idSet = new Set(batchIds);
    let updatedCount = 0;

    setBatches((prev) =>
      prev.map((b, idx) => {
        if (!idSet.has(b.id)) return b;
        if (b.status === 'Ditolak BPSB' || b.status === 'Afkir') return b;
        updatedCount += 1;
        const certNo =
          b.certificateNumber ??
          `DUMMY-BPSB-${b.province.slice(0, 3).toUpperCase()}-2026/${12000 + idx}`;
        return {
          ...b,
          status: 'Sertifikat Terbit',
          certificateNumber: certNo,
          certificationDate: b.certificationDate === '-' ? today : b.certificationDate,
          expiryDate: b.expiryDate ?? '2027-05-16',
          labInspector: 'Ir. Sari Wijaya',
          auditTrail: [
            {
              id: `ev-${Date.now()}-${idx}`,
              timestamp: `16 Nov 2026 ${timeStr} WIB`,
              actor: 'Ir. Sari Wijaya',
              role: 'Inspektur Madya BPSB',
              action: `Penerbitan Sertifikat Kolektif (${certNo})`,
            },
            ...b.auditTrail,
          ],
        };
      })
    );

    if (updatedCount > 0) {
      showToast(`${updatedCount} batch terpilih berhasil diterbitkan sertifikatnya.`);
    }
  };

  const handleUpdateLabMetrics = (
    batchId: string,
    metrics: {
      germinationRate: number;
      moistureContent: number;
      physicalPurity: number;
      weedSeedContent: number;
      labNotes: string;
    }
  ) => {
    const timeStr = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setBatches((prev) =>
      prev.map((b) => {
        if (b.id !== batchId) return b;
        return {
          ...b,
          ...metrics,
          auditTrail: [
            {
              id: `ev-${Date.now()}`,
              timestamp: `16 Nov 2026 ${timeStr} WIB`,
              actor: 'Analis Lab BPSB',
              role: 'Penguji Mutu Benih',
              action: 'Pembaruan Parameter Hasil Uji Laboratorium',
              note: `DK: ${metrics.germinationRate.toFixed(1)}%, KA: ${metrics.moistureContent.toFixed(
                1
              )}%, Kemurnian: ${metrics.physicalPurity.toFixed(1)}%.`,
            },
            ...b.auditTrail,
          ],
        };
      })
    );
  };

  const handleConfirmDelivery = (shipmentId: string) => {
    const timeStr = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setShipments((prev) =>
      prev.map((s) => {
        if (s.id !== shipmentId) return s;
        return {
          ...s,
          status: 'Distribusi Selesai',
          checkpoints: s.checkpoints.map((cp, index) =>
            index === s.checkpoints.length - 1
              ? {
                  ...cp,
                  completed: true,
                  timestamp: `16 Nov 2026, ${timeStr} WIB`,
                  description:
                    'Serah terima disahkan oleh penerima tujuan & seluruh segel QR terverifikasi.',
                }
              : { ...cp, completed: true }
          ),
        };
      })
    );

    const targetShipment = shipments.find((s) => s.id === shipmentId);
    if (targetShipment) {
      setBatches((prev) =>
        prev.map((b) =>
          b.batchNumber === targetShipment.batchNumber
            ? { ...b, status: 'Distribusi Selesai' }
            : b
        )
      );
      showToast(`Pengiriman ${targetShipment.waybillNumber} dikonfirmasi selesai.`);
    }
  };

  const handleSimulateQrScan = (shipmentId: string) => {
    setShipments((prev) =>
      prev.map((s) =>
        s.id === shipmentId ? { ...s, qrVerifiedCount: s.qrVerifiedCount + 1 } : s
      )
    );
    showToast('Pemindaian QR kemasan berhasil tercatat ke sistem.');
  };

  const handleViewProducerBatches = (producerName: string) => {
    setProducerBatchFilter(producerName);
    setActiveScreen('batches');
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] text-[#111827] flex">
      <Sidebar
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
        onSwitchPortal={onSwitchPortal}
        pendingCount={pendingLabCount}
        activeShipmentsCount={activeShipmentsCount}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 lg:pl-[260px] flex flex-col min-w-0">
        <Header
          activeScreen={activeScreen}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenAddBatch={() => setAddBatchOpen(true)}
          onOpenQrLookup={() => setQrLookupOpen(true)}
        />

        <main className="flex-1 px-4 sm:px-8 py-6 max-w-[1600px] w-full mx-auto">
          {activeScreen === 'overview' && (
            <OverviewScreen
              batches={batches}
              onNavigate={setActiveScreen}
              onInspectBatch={(batch) => setInspectedBatchId(batch.id)}
              onQuickApprove={(batch) => setCertModal({ batch, mode: 'approve' })}
              onQuickReject={(batch) => setCertModal({ batch, mode: 'reject' })}
            />
          )}

          {activeScreen === 'batches' && (
            <BatchManagementScreen
              key={producerBatchFilter || 'all-batches'}
              batches={batches}
              initialProducerFilter={producerBatchFilter}
              onClearInitialProducerFilter={() => setProducerBatchFilter('')}
              onOpenAddBatch={() => setAddBatchOpen(true)}
              onInspectBatch={(batch) => setInspectedBatchId(batch.id)}
              onApproveBatch={(batch) => setCertModal({ batch, mode: 'approve' })}
              onRejectBatch={(batch) => setCertModal({ batch, mode: 'reject' })}
              onBulkApprove={handleBulkApprove}
            />
          )}

          {activeScreen === 'lab' && (
            <LabInspectionScreen
              batches={batches}
              onUpdateLabMetrics={handleUpdateLabMetrics}
              onApproveBatch={(batch) => setCertModal({ batch, mode: 'approve' })}
              onRejectBatch={(batch) => setCertModal({ batch, mode: 'reject' })}
            />
          )}

          {activeScreen === 'distribution' && (
            <DistributionScreen
              shipments={shipments}
              onConfirmDelivery={handleConfirmDelivery}
              onSimulateQrScan={handleSimulateQrScan}
            />
          )}

          {activeScreen === 'producers' && (
            <ProducersScreen
              producers={producers}
              onViewProducerBatches={handleViewProducerBatches}
            />
          )}
        </main>
      </div>

      <BatchDetailDrawer
        batch={inspectedBatch}
        onClose={() => setInspectedBatchId(null)}
        onApprove={(batch) => setCertModal({ batch, mode: 'approve' })}
        onReject={(batch) => setCertModal({ batch, mode: 'reject' })}
      />

      <AddBatchModal
        open={addBatchOpen}
        producers={producers}
        onClose={() => setAddBatchOpen(false)}
        onCreateBatch={handleCreateBatch}
      />

      <CertificationModal
        key={`${certModal.batch?.id ?? 'none'}-${certModal.mode ?? 'none'}`}
        batch={certModal.batch}
        mode={certModal.mode}
        onClose={() => setCertModal({ batch: null, mode: null })}
        onConfirmApprove={handleConfirmApprove}
        onConfirmReject={handleConfirmReject}
      />

      <QrLookupModal
        open={qrLookupOpen}
        batches={batches}
        onClose={() => setQrLookupOpen(false)}
        onSelectBatch={(batch) => setInspectedBatchId(batch.id)}
      />

      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 max-w-sm bg-[#111827] text-white px-4 py-3 rounded-xl border border-slate-700 flex items-center gap-3"
          style={{
            boxShadow:
              '0 10px 15px -3px rgba(0, 0, 0, 0.12), 0 4px 6px -4px rgba(0, 0, 0, 0.08)',
          }}
        >
          <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0" />
          <span className="text-[13px] font-medium flex-1">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white cursor-pointer"
            aria-label="Tutup notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
