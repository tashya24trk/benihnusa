import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import {
  INITIAL_CERT_APPLICATIONS,
  INITIAL_DISTRIBUTION_TRANSFERS,
  INITIAL_ORGANIZATION_PROFILE,
  INITIAL_PRODUCER_ACTIVITIES,
  INITIAL_PRODUCER_BATCHES,
} from '../data/producerSeedData';
import {
  CertificationApplication,
  DistributionTransfer,
  ProducerActivityLog,
  ProducerBatch,
  ProducerOrganizationProfile,
  ProducerScreenId,
} from '../types/producer';
import { ProducerActivityLogScreen } from './producer/ProducerActivityLogScreen';
import { ProducerBatchDetailScreen } from './producer/ProducerBatchDetailScreen';
import { ProducerBatchTableScreen } from './producer/ProducerBatchTableScreen';
import { ProducerCertificationDetailScreen } from './producer/ProducerCertificationDetailScreen';
import { ProducerCertificationListScreen } from './producer/ProducerCertificationListScreen';
import { ProducerDashboardScreen } from './producer/ProducerDashboardScreen';
import { ProducerDistributionScreen } from './producer/ProducerDistributionScreen';
import { ProducerHeader } from './producer/ProducerHeader';
import { ProducerProfileScreen } from './producer/ProducerProfileScreen';
import { ProducerRegisterBatchScreen } from './producer/ProducerRegisterBatchScreen';
import { ProducerSidebar } from './producer/ProducerSidebar';
import { SubmitCertificationModal } from './producer/SubmitCertificationModal';

import { PortalMode } from '../types/certificationAuthority';

const STORAGE_KEYS = {
  batches: 'benihnusa_producer_batches_v1',
  certs: 'benihnusa_producer_certs_v1',
  transfers: 'benihnusa_producer_transfers_v1',
  activities: 'benihnusa_producer_activities_v1',
  profile: 'benihnusa_producer_profile_v1',
};

interface ProducerAppProps {
  onSwitchPortal: (portal: PortalMode) => void;
  onLogout?: () => void;
}

export function ProducerApp({ onSwitchPortal, onLogout }: ProducerAppProps) {
  const [activeScreen, setActiveScreen] = useState<ProducerScreenId>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [profile, setProfile] = useState<ProducerOrganizationProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.profile);
      return saved ? (JSON.parse(saved) as ProducerOrganizationProfile) : INITIAL_ORGANIZATION_PROFILE;
    } catch {
      return INITIAL_ORGANIZATION_PROFILE;
    }
  });

  const [batches, setBatches] = useState<ProducerBatch[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.batches);
      return saved ? (JSON.parse(saved) as ProducerBatch[]) : INITIAL_PRODUCER_BATCHES;
    } catch {
      return INITIAL_PRODUCER_BATCHES;
    }
  });

  const [applications, setApplications] = useState<CertificationApplication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.certs);
      return saved ? (JSON.parse(saved) as CertificationApplication[]) : INITIAL_CERT_APPLICATIONS;
    } catch {
      return INITIAL_CERT_APPLICATIONS;
    }
  });

  const [transfers, setTransfers] = useState<DistributionTransfer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.transfers);
      return saved ? (JSON.parse(saved) as DistributionTransfer[]) : INITIAL_DISTRIBUTION_TRANSFERS;
    } catch {
      return INITIAL_DISTRIBUTION_TRANSFERS;
    }
  });

  const [activities, setActivities] = useState<ProducerActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.activities);
      return saved ? (JSON.parse(saved) as ProducerActivityLog[]) : INITIAL_PRODUCER_ACTIVITIES;
    } catch {
      return INITIAL_PRODUCER_ACTIVITIES;
    }
  });

  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [editingBatchId, setEditingBatchId] = useState<string | null>(null);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [submitCertModalOpen, setSubmitCertModalOpen] = useState(false);
  const [preselectedCertBatchId, setPreselectedCertBatchId] = useState<string | null>(null);
  const [preselectedTransferBatchId, setPreselectedTransferBatchId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.batches, JSON.stringify(batches));
      localStorage.setItem(STORAGE_KEYS.certs, JSON.stringify(applications));
      localStorage.setItem(STORAGE_KEYS.transfers, JSON.stringify(transfers));
      localStorage.setItem(STORAGE_KEYS.activities, JSON.stringify(activities));
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
    } catch {
      // Ignore storage quota issues
    }
  }, [batches, applications, transfers, activities, profile]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  const orgBatches = useMemo(
    () => batches.filter((b) => b.organizationName === profile.organizationName),
    [batches, profile.organizationName]
  );

  const selectedBatch = useMemo(
    () => orgBatches.find((b) => b.id === selectedBatchId) ?? orgBatches[0] ?? null,
    [orgBatches, selectedBatchId]
  );

  const editingBatch = useMemo(
    () =>
      editingBatchId
        ? orgBatches.find(
            (b) => b.id === editingBatchId && b.certificationStatus === 'Belum Diajukan'
          ) ?? null
        : null,
    [orgBatches, editingBatchId]
  );

  const selectedApplication = useMemo(
    () => applications.find((a) => a.id === selectedAppId) ?? applications[0] ?? null,
    [applications, selectedAppId]
  );

  const eligibleForCertification = useMemo(
    () =>
      orgBatches.filter(
        (b) => b.certificationStatus === 'Belum Diajukan' && b.batchStatus !== 'Draf'
      ),
    [orgBatches]
  );

  const activeCertCount = useMemo(
    () =>
      applications.filter(
        (a) =>
          a.status === 'Menunggu Verifikasi' ||
          a.status === 'Dalam Pemeriksaan Lab' ||
          a.status === 'Perlu Perbaikan'
      ).length,
    [applications]
  );

  const activeTransferCount = useMemo(
    () => transfers.filter((t) => t.receiptStatus === 'Menunggu Konfirmasi').length,
    [transfers]
  );

  const appendActivity = (
    category: ProducerActivityLog['category'],
    title: string,
    description: string,
    batch?: { id: string; batchNumber: string }
  ) => {
    const timeStr = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const newLog: ProducerActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: `2026-11-16 ${timeStr} WIB`,
      category,
      actor: profile.representativeName,
      title,
      description,
      batchId: batch?.id,
      batchNumber: batch?.batchNumber,
    };
    setActivities((prev) => [newLog, ...prev]);
  };

  const handleNavigate = (screen: ProducerScreenId) => {
    if (screen !== 'register') {
      setEditingBatchId(null);
    }
    setActiveScreen(screen);
  };

  const handleOpenBatchDetail = (batchId: string) => {
    setSelectedBatchId(batchId);
    setActiveScreen('batch-detail');
  };

  const handleEditBatch = (batchId: string) => {
    const target = orgBatches.find((b) => b.id === batchId);
    if (!target || target.certificationStatus !== 'Belum Diajukan') {
      showToast('Batch tidak dapat diubah karena sudah diajukan untuk sertifikasi.');
      return;
    }
    setEditingBatchId(batchId);
    setActiveScreen('register');
  };

  const handleSaveBatch = (batchData: ProducerBatch, mode: 'draft' | 'submit') => {
    const exists = orgBatches.some((b) => b.id === batchData.id);
    if (exists) {
      setBatches((prev) =>
        prev.map((b) => (b.id === batchData.id ? batchData : b))
      );
      appendActivity(
        'Registrasi & Batch',
        'Memperbarui Informasi Batch',
        `Perubahan data batch ${batchData.variety} (${batchData.quantityKg.toLocaleString('id-ID')} kg) disimpan.`,
        { id: batchData.id, batchNumber: batchData.batchNumber }
      );
      showToast(`Perubahan batch ${batchData.batchNumber} berhasil disimpan.`);
    } else {
      setBatches((prev) => [batchData, ...prev]);
      appendActivity(
        'Registrasi & Batch',
        mode === 'draft' ? 'Menyimpan Draf Batch Baru' : 'Mendaftarkan Batch Baru',
        `${batchData.variety} (${batchData.quantityKg.toLocaleString('id-ID')} kg) ${
          mode === 'draft' ? 'disimpan sebagai draf.' : 'resmi didaftarkan ke inventori organisasi.'
        }`,
        { id: batchData.id, batchNumber: batchData.batchNumber }
      );
      showToast(
        mode === 'draft'
          ? `Draf batch ${batchData.batchNumber} tersimpan.`
          : `Batch ${batchData.batchNumber} berhasil didaftarkan.`
      );
    }
    setEditingBatchId(null);
    setSelectedBatchId(batchData.id);
    setActiveScreen('batch-detail');
  };

  const handleSubmitCertification = (batchId: string, submissionNote: string) => {
    const target = orgBatches.find((b) => b.id === batchId);
    if (!target || target.certificationStatus !== 'Belum Diajukan') return;

    const timeStr = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const appNumber = `APP-BPSB-2026-${Math.floor(600 + Math.random() * 390)}`;

    setBatches((prev) =>
      prev.map((b) => {
        if (b.id !== batchId) return b;
        return {
          ...b,
          certificationStatus: 'Menunggu Verifikasi',
          batchStatus: 'Diajukan Sertifikasi',
          history: [
            {
              id: `h-${Date.now()}`,
              timestamp: `2026-11-16 ${timeStr} WIB`,
              actor: profile.representativeName,
              action: `Pengajuan Sertifikasi Dikirim (${appNumber})`,
              note: submissionNote,
            },
            ...b.history,
          ],
        };
      })
    );

    const newApp: CertificationApplication = {
      id: `cert-${Date.now()}`,
      applicationNumber: appNumber,
      batchId: target.id,
      batchNumber: target.batchNumber,
      commodity: target.commodity,
      variety: target.variety,
      seedClass: target.seedClass,
      quantityKg: target.quantityKg,
      submissionDate: '2026-11-16',
      status: 'Menunggu Verifikasi',
      progressPercent: 25,
      progressLabel: 'Menunggu Verifikasi BPSB (1/4 Tahap)',
      regulatorFeedback:
        'Pengajuan diterima secara digital dan menunggu penugasan pengawas benih dari BPSB Provinsi Riau.',
      assignedBpsbOffice: 'BPSB Wilayah Provinsi Riau',
      timeline: [
        {
          id: `tl-${Date.now()}-1`,
          title: 'Pengajuan Sertifikasi Diterima',
          timestamp: `16 Nov 2026, ${timeStr} WIB`,
          actor: `${profile.organizationName} (${profile.representativeName})`,
          description: submissionNote,
          state: 'current',
        },
        {
          id: `tl-${Date.now()}-2`,
          title: 'Pengambilan Sampel & Uji Lab BPSB',
          timestamp: 'Menunggu jadwal',
          actor: 'BPSB Provinsi Riau',
          description: 'Pengawas akan menjadwalkan pengambilan sampel acak di gudang.',
          state: 'upcoming',
        },
      ],
    };

    setApplications((prev) => [newApp, ...prev]);
    appendActivity(
      'Sertifikasi',
      'Mengajukan Sertifikasi BPSB',
      `Permohonan ${appNumber} untuk batch ${target.variety} dikirimkan ke BPSB.`,
      { id: target.id, batchNumber: target.batchNumber }
    );

    setPreselectedCertBatchId(null);
    setSelectedAppId(newApp.id);
    setActiveScreen('certification-detail');
    showToast(`Pengajuan sertifikasi ${appNumber} berhasil dikirim ke BPSB.`);
  };

  const handleSplitBatch = (
    batchId: string,
    splitQtyKg: number,
    reasonNote: string
  ) => {
    const parent = orgBatches.find((b) => b.id === batchId);
    if (!parent || parent.ownershipStatus !== 'Milik Produsen') {
      showToast('Pemecahan batch hanya dapat dilakukan selama kepemilikan penuh masih di tangan Produsen.');
      return;
    }

    const timeStr = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const childBatchNumber = `${parent.batchNumber}-S${Math.floor(1 + Math.random() * 8)}`;
    const childId = `pb-split-${Date.now()}`;

    const childBatch: ProducerBatch = {
      ...parent,
      id: childId,
      batchNumber: childBatchNumber,
      parentBatchNumber: parent.batchNumber,
      quantityKg: splitQtyKg,
      initialQuantityKg: splitQtyKg,
      history: [
        {
          id: `h-${Date.now()}-c`,
          timestamp: `2026-11-16 ${timeStr} WIB`,
          actor: profile.representativeName,
          action: `Batch Pecahan Dibuat dari ${parent.batchNumber}`,
          note: `${splitQtyKg.toLocaleString('id-ID')} kg · ${reasonNote}`,
        },
      ],
    };

    setBatches((prev) => [
      childBatch,
      ...prev.map((b) =>
        b.id === parent.id
          ? {
              ...b,
              quantityKg: b.quantityKg - splitQtyKg,
              history: [
                {
                  id: `h-${Date.now()}-p`,
                  timestamp: `2026-11-16 ${timeStr} WIB`,
                  actor: profile.representativeName,
                  action: `Batch Dipecah Sebesar ${splitQtyKg.toLocaleString('id-ID')} kg ke ${childBatchNumber}`,
                  note: reasonNote,
                },
                ...b.history,
              ],
            }
          : b
      ),
    ]);

    appendActivity(
      'Pecah Batch',
      'Memecah Batch Kepemilikan Sendiri',
      `Sebanyak ${splitQtyKg.toLocaleString('id-ID')} kg dari ${parent.batchNumber} dipisahkan menjadi lot ${childBatchNumber}.`,
      { id: childId, batchNumber: childBatchNumber }
    );

    showToast(`Lot pecahan ${childBatchNumber} (${splitQtyKg.toLocaleString('id-ID')} kg) berhasil dibuat.`);
  };

  const handleCreateTransfer = (payload: {
    batchId: string;
    destinationName: string;
    destinationType: 'Distributor' | 'Koperasi' | 'Kios Tani';
    destinationProvince: string;
    quantityKg: number;
    transferDate: string;
    notes: string;
  }) => {
    const targetBatch = orgBatches.find((b) => b.id === payload.batchId);
    if (
      !targetBatch ||
      targetBatch.ownershipStatus === 'Dialihkan ke Distributor' ||
      payload.quantityKg > targetBatch.quantityKg
    ) {
      showToast('Batch tidak memenuhi syarat transfer kepemilikan.');
      return;
    }

    const timeStr = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newTransfer: DistributionTransfer = {
      id: `tr-${Date.now()}`,
      transferCode: `TRF-NT-2026-${Math.floor(40 + Math.random() * 50)}`,
      batchId: targetBatch.id,
      batchNumber: targetBatch.batchNumber,
      variety: targetBatch.variety,
      commodity: targetBatch.commodity,
      destinationName: payload.destinationName,
      destinationType: payload.destinationType,
      destinationProvince: payload.destinationProvince,
      quantityKg: payload.quantityKg,
      transferDate: payload.transferDate,
      ownershipStatus: 'Dalam Proses Transfer',
      receiptStatus: 'Menunggu Konfirmasi',
      waybillNumber: `SJ-NT-20261116-${Math.floor(10 + Math.random() * 89)}`,
      notes: payload.notes,
    };

    const remainingKg = targetBatch.quantityKg - payload.quantityKg;

    setTransfers((prev) => [newTransfer, ...prev]);
    setBatches((prev) =>
      prev.map((b) => {
        if (b.id !== targetBatch.id) return b;
        return {
          ...b,
          quantityKg: remainingKg,
          ownershipStatus:
            remainingKg === 0 ? 'Dialihkan ke Distributor' : 'Sebagian Dialihkan',
          batchStatus:
            remainingKg === 0 ? 'Dialihkan Penuh' : 'Dalam Distribusi',
          history: [
            {
              id: `h-${Date.now()}`,
              timestamp: `2026-11-16 ${timeStr} WIB`,
              actor: profile.representativeName,
              action: `Inisiasi Transfer ${payload.quantityKg.toLocaleString('id-ID')} kg ke ${payload.destinationName}`,
              note: payload.notes || `Surat Jalan: ${newTransfer.waybillNumber}`,
            },
            ...b.history,
          ],
        };
      })
    );

    appendActivity(
      'Distribusi & Transfer',
      'Menginisiasi Transfer Kepemilikan',
      `Pengalihan ${payload.quantityKg.toLocaleString('id-ID')} kg ${targetBatch.variety} ke ${payload.destinationName}.`,
      { id: targetBatch.id, batchNumber: targetBatch.batchNumber }
    );

    showToast(
      `Transfer kepemilikan ${payload.quantityKg.toLocaleString('id-ID')} kg ke ${payload.destinationName} berhasil dibuat.`
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] text-[#111827] flex">
      <ProducerSidebar
        activeScreen={activeScreen}
        onSelectScreen={handleNavigate}
        onSwitchPortal={onSwitchPortal}
        onLogout={onLogout}
        organizationName={profile.organizationName}
        roleLabel={profile.roleLabel}
        representativeName={profile.representativeName}
        activeCertCount={activeCertCount}
        activeTransferCount={activeTransferCount}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 lg:pl-[260px] flex flex-col min-w-0">
        <ProducerHeader
          activeScreen={activeScreen}
          activeBatchNumber={selectedBatch?.batchNumber}
          activeApplicationNumber={selectedApplication?.applicationNumber}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onNavigate={handleNavigate}
          onOpenQuickSubmitCert={() => {
            setPreselectedCertBatchId(null);
            setSubmitCertModalOpen(true);
          }}
        />

        <main className="flex-1 px-4 sm:px-8 py-6 max-w-[1600px] w-full mx-auto">
          {activeScreen === 'dashboard' && (
            <ProducerDashboardScreen
              organizationName={profile.organizationName}
              roleLabel={profile.roleLabel}
              batches={orgBatches}
              applications={applications}
              transfers={transfers}
              activities={activities}
              onNavigate={handleNavigate}
              onOpenBatchDetail={handleOpenBatchDetail}
              onOpenCertDetail={(appId) => {
                setSelectedAppId(appId);
                setActiveScreen('certification-detail');
              }}
              onOpenQuickSubmitCert={() => {
                setPreselectedCertBatchId(null);
                setSubmitCertModalOpen(true);
              }}
            />
          )}

          {activeScreen === 'batches' && (
            <ProducerBatchTableScreen
              organizationName={profile.organizationName}
              batches={orgBatches}
              onOpenRegister={() => {
                setEditingBatchId(null);
                setActiveScreen('register');
              }}
              onViewDetail={handleOpenBatchDetail}
              onEditBatch={handleEditBatch}
            />
          )}

          {activeScreen === 'register' && (
            <ProducerRegisterBatchScreen
              key={editingBatch?.id ?? 'new-batch'}
              organizationName={profile.organizationName}
              editingBatch={editingBatch}
              onCancelEdit={
                editingBatch
                  ? () => {
                      setEditingBatchId(null);
                      setActiveScreen('batch-detail');
                    }
                  : undefined
              }
              onSaveBatch={handleSaveBatch}
            />
          )}

          {activeScreen === 'batch-detail' && selectedBatch && (
            <ProducerBatchDetailScreen
              key={selectedBatch.id}
              batch={selectedBatch}
              onBack={() => setActiveScreen('batches')}
              onEditBatch={handleEditBatch}
              onSubmitCertification={(batch) => {
                setPreselectedCertBatchId(batch.id);
                setSubmitCertModalOpen(true);
              }}
              onSplitBatch={handleSplitBatch}
              onInitiateTransfer={(batch) => {
                setPreselectedTransferBatchId(batch.id);
                setActiveScreen('distribution');
              }}
            />
          )}

          {activeScreen === 'certifications' && (
            <ProducerCertificationListScreen
              applications={applications}
              eligibleBatchesCount={eligibleForCertification.length}
              onViewApplication={(appId) => {
                setSelectedAppId(appId);
                setActiveScreen('certification-detail');
              }}
              onOpenSubmitModal={() => {
                setPreselectedCertBatchId(null);
                setSubmitCertModalOpen(true);
              }}
            />
          )}

          {activeScreen === 'certification-detail' && selectedApplication && (
            <ProducerCertificationDetailScreen
              application={selectedApplication}
              onBack={() => setActiveScreen('certifications')}
              onOpenBatchDetail={handleOpenBatchDetail}
            />
          )}

          {activeScreen === 'distribution' && (
            <ProducerDistributionScreen
              key={preselectedTransferBatchId ?? 'distribution-list'}
              batches={orgBatches}
              transfers={transfers}
              preselectedBatchId={preselectedTransferBatchId}
              onClearPreselectedBatch={() => setPreselectedTransferBatchId(null)}
              onCreateTransfer={handleCreateTransfer}
              onOpenBatchDetail={handleOpenBatchDetail}
            />
          )}

          {activeScreen === 'activity' && (
            <ProducerActivityLogScreen
              activities={activities}
              onOpenBatchDetail={handleOpenBatchDetail}
            />
          )}

          {activeScreen === 'profile' && (
            <ProducerProfileScreen
              profile={profile}
              onUpdateProfile={(updated) => {
                setProfile(updated);
                showToast('Profil kontak operasional Nursery Tashya berhasil diperbarui.');
              }}
            />
          )}
        </main>
      </div>

      <SubmitCertificationModal
        key={preselectedCertBatchId ?? 'submit-cert-modal'}
        open={submitCertModalOpen}
        eligibleBatches={eligibleForCertification}
        preselectedBatchId={preselectedCertBatchId}
        onClose={() => {
          setSubmitCertModalOpen(false);
          setPreselectedCertBatchId(null);
        }}
        onSubmitCertification={handleSubmitCertification}
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
