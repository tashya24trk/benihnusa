import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  LayoutDashboard,
  PackageCheck,
  QrCode,
  Sprout,
  Wheat,
} from 'lucide-react';
import {
  INITIAL_CORRECTION_REQUESTS,
  INITIAL_FARMER_ACTIVITIES,
  INITIAL_FARMER_INCOMING,
  INITIAL_FARMER_PROFILE,
  INITIAL_FARMER_SEEDS,
  INITIAL_PLANTING_RECORDS,
  REVOKED_SAMPLE_QR_OUTCOME,
} from '../data/farmerSeedData';
import { PortalMode } from '../types/certificationAuthority';
import {
  FarmerActivityItem,
  FarmerIncomingBatch,
  FarmerPlantingRecord,
  FarmerProfile,
  FarmerScreenId,
  FarmerSeedBatch,
  PlantingCorrectionRequest,
  QrLookupOutcome,
  SeedConditionOption,
} from '../types/farmer';
import { FarmerActivityLogScreen } from './farmer/FarmerActivityLogScreen';
import { FarmerCorrectionScreen } from './farmer/FarmerCorrectionScreen';
import { FarmerDashboardScreen } from './farmer/FarmerDashboardScreen';
import { FarmerHeader } from './farmer/FarmerHeader';
import { FarmerMySeedsScreen } from './farmer/FarmerMySeedsScreen';
import { FarmerPlantingScreen } from './farmer/FarmerPlantingScreen';
import { FarmerProfileScreen } from './farmer/FarmerProfileScreen';
import { FarmerQrVerifyScreen } from './farmer/FarmerQrVerifyScreen';
import { FarmerReceptionScreen } from './farmer/FarmerReceptionScreen';
import { FarmerSeedDetailScreen } from './farmer/FarmerSeedDetailScreen';
import { FarmerSidebar } from './farmer/FarmerSidebar';

interface FarmerAppProps {
  onSwitchPortal: (portal: PortalMode) => void;
  onLogout?: () => void;
}

const STORAGE_KEYS = {
  seeds: 'benihnusa_farmer_seeds_v1',
  incoming: 'benihnusa_farmer_incoming_v1',
  plantings: 'benihnusa_farmer_plantings_v1',
  corrections: 'benihnusa_farmer_corrections_v1',
  activities: 'benihnusa_farmer_activities_v1',
  profile: 'benihnusa_farmer_profile_v1',
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function nowTimestampLabel(): string {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return `2026-11-16 ${hh}:${mm} WIB`;
}

export const FarmerApp: React.FC<FarmerAppProps> = ({
  onSwitchPortal,
  onLogout,
}) => {
  const [activeScreen, setActiveScreen] = useState<FarmerScreenId>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [seeds, setSeeds] = useState<FarmerSeedBatch[]>(() =>
    readStorage(STORAGE_KEYS.seeds, INITIAL_FARMER_SEEDS)
  );
  const [incoming, setIncoming] = useState<FarmerIncomingBatch[]>(() =>
    readStorage(STORAGE_KEYS.incoming, INITIAL_FARMER_INCOMING)
  );
  const [plantings, setPlantings] = useState<FarmerPlantingRecord[]>(() =>
    readStorage(STORAGE_KEYS.plantings, INITIAL_PLANTING_RECORDS)
  );
  const [corrections, setCorrections] = useState<PlantingCorrectionRequest[]>(
    () => readStorage(STORAGE_KEYS.corrections, INITIAL_CORRECTION_REQUESTS)
  );
  const [activities, setActivities] = useState<FarmerActivityItem[]>(() =>
    readStorage(STORAGE_KEYS.activities, INITIAL_FARMER_ACTIVITIES)
  );
  const [profile, setProfile] = useState<FarmerProfile>(() =>
    readStorage(STORAGE_KEYS.profile, INITIAL_FARMER_PROFILE)
  );

  // Selection states
  const [selectedSeedId, setSelectedSeedId] = useState<string | null>(null);
  const [selectedIncomingId, setSelectedIncomingId] = useState<string | null>(
    null
  );
  const [selectedPlantingId, setSelectedPlantingId] = useState<string | null>(
    null
  );
  const [preselectedPlantBatchId, setPreselectedPlantBatchId] = useState<
    string | null
  >(null);
  const [preselectedCorrectionPlantId, setPreselectedCorrectionPlantId] =
    useState<string | null>(null);
  const [qrInputCode, setQrInputCode] = useState<string | undefined>(undefined);
  const [qrOutcome, setQrOutcome] = useState<QrLookupOutcome | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.seeds, JSON.stringify(seeds));
      localStorage.setItem(STORAGE_KEYS.incoming, JSON.stringify(incoming));
      localStorage.setItem(STORAGE_KEYS.plantings, JSON.stringify(plantings));
      localStorage.setItem(STORAGE_KEYS.corrections, JSON.stringify(corrections));
      localStorage.setItem(STORAGE_KEYS.activities, JSON.stringify(activities));
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
    } catch {
      // Ignore storage quota errors
    }
  }, [seeds, incoming, plantings, corrections, activities, profile]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3600);
  };

  const pushActivity = (item: Omit<FarmerActivityItem, 'id' | 'timestamp'>) => {
    const newItem: FarmerActivityItem = {
      id: `fact-${Date.now()}`,
      timestamp: nowTimestampLabel(),
      ...item,
    };
    setActivities((prev) => [newItem, ...prev]);
  };

  const pendingReceptionCount = useMemo(
    () =>
      incoming.filter((b) => b.receptionStatus === 'Menunggu Konfirmasi').length,
    [incoming]
  );

  const unverifiedSeedsCount = useMemo(
    () =>
      seeds.filter((s) => s.verificationStatus === 'Menunggu Verifikasi').length,
    [seeds]
  );

  const selectedSeed = useMemo(
    () => seeds.find((s) => s.id === selectedSeedId) ?? seeds[0] ?? null,
    [seeds, selectedSeedId]
  );

  const selectedIncoming = useMemo(
    () =>
      incoming.find((b) => b.id === selectedIncomingId) ?? incoming[0] ?? null,
    [incoming, selectedIncomingId]
  );

  const selectedPlanting = useMemo(
    () =>
      plantings.find((p) => p.id === selectedPlantingId) ?? null,
    [plantings, selectedPlantingId]
  );

  // QR Verification Handler
  const handleVerifyQrCode = (rawCode: string) => {
    const normalized = rawCode.trim().toUpperCase();
    setQrInputCode(rawCode.trim());

    // 1. Check sample revoked batch
    if (
      REVOKED_SAMPLE_QR_OUTCOME.state !== 'Data Tidak Ditemukan' &&
      (normalized === REVOKED_SAMPLE_QR_OUTCOME.batchNumber ||
        normalized === REVOKED_SAMPLE_QR_OUTCOME.certificateNumber.toUpperCase())
    ) {
      setQrOutcome(REVOKED_SAMPLE_QR_OUTCOME);
      pushActivity({
        category: 'Verifikasi QR',
        title: `Peringatan Sertifikasi Tidak Valid (${REVOKED_SAMPLE_QR_OUTCOME.batchNumber})`,
        description:
          'Hasil pindai QR menunjukkan sertifikat batch telah dicabut BPSB dan dilarang ditanam.',
        batchNumber: REVOKED_SAMPLE_QR_OUTCOME.batchNumber,
      });
      setActiveScreen('qr-result');
      return;
    }

    // 2. Check Farmer's owned seeds
    const matchedSeed = seeds.find(
      (s) =>
        s.batchNumber.toUpperCase() === normalized ||
        s.certificateNumber.toUpperCase() === normalized
    );

    if (matchedSeed) {
      if (matchedSeed.certificationStatus !== 'Aktif') {
        setQrOutcome({
          state: 'Sertifikasi Tidak Valid',
          batchNumber: matchedSeed.batchNumber,
          commodity: matchedSeed.commodity,
          variety: matchedSeed.variety,
          producerName: matchedSeed.producerName,
          distributorName: matchedSeed.distributorName,
          certificateNumber: matchedSeed.certificateNumber,
          certificationStatus: matchedSeed.certificationStatus,
          batchOrigin: matchedSeed.batchOrigin,
          invalidReason:
            'Sertifikat untuk batch benih ini berstatus tidak aktif atau dicabut oleh lembaga sertifikasi.',
          distributionHistory: matchedSeed.distributionHistory,
          traceabilityTimeline: matchedSeed.traceabilityTimeline,
        });
      } else {
        // Automatically mark waiting verification batch as Terverifikasi
        if (matchedSeed.verificationStatus === 'Menunggu Verifikasi') {
          setSeeds((prev) =>
            prev.map((item) =>
              item.id === matchedSeed.id
                ? {
                    ...item,
                    verificationStatus: 'Terverifikasi',
                    traceabilityTimeline: [
                      ...item.traceabilityTimeline,
                      {
                        id: `ft-${Date.now()}`,
                        date: '16 Nov 2026',
                        actor: profile.fullName,
                        organization: profile.farmerGroup,
                        title: 'Diverifikasi QR oleh Petani',
                        detail: `Label QR ${item.certificateNumber} dinyatakan asli & siap tanam.`,
                      },
                    ],
                  }
                : item
            )
          );
          showToast(
            `Batch ${matchedSeed.batchNumber} berhasil diverifikasi asli!`
          );
        }

        setQrOutcome({
          state: 'Benih Terverifikasi',
          batchNumber: matchedSeed.batchNumber,
          commodity: matchedSeed.commodity,
          variety: matchedSeed.variety,
          producerName: matchedSeed.producerName,
          distributorName: matchedSeed.distributorName,
          certificateNumber: matchedSeed.certificateNumber,
          certificationStatus: matchedSeed.certificationStatus,
          batchOrigin: matchedSeed.batchOrigin,
          distributionHistory: matchedSeed.distributionHistory,
          traceabilityTimeline: matchedSeed.traceabilityTimeline,
          linkedSeedId: matchedSeed.id,
        });

        pushActivity({
          category: 'Verifikasi QR',
          title: `Memverifikasi Keaslian QR Batch ${matchedSeed.batchNumber}`,
          description: `Sertifikat ${matchedSeed.certificateNumber} (${matchedSeed.variety}) terverifikasi asli.`,
          batchNumber: matchedSeed.batchNumber,
        });
      }
      setActiveScreen('qr-result');
      return;
    }

    // 3. Check incoming unconfirmed batches
    const matchedIncoming = incoming.find(
      (b) =>
        b.batchNumber.toUpperCase() === normalized ||
        b.certificateNumber.toUpperCase() === normalized
    );
    if (matchedIncoming) {
      setQrOutcome({
        state: 'Benih Terverifikasi',
        batchNumber: matchedIncoming.batchNumber,
        commodity: matchedIncoming.commodity,
        variety: matchedIncoming.variety,
        producerName: matchedIncoming.producerName,
        distributorName: matchedIncoming.distributorName,
        certificateNumber: matchedIncoming.certificateNumber,
        certificationStatus: 'Aktif',
        batchOrigin: `Pengiriman dari ${matchedIncoming.distributorName}`,
        distributionHistory: [
          `${matchedIncoming.producerName} → ${matchedIncoming.distributorName}`,
          `${matchedIncoming.distributorName} → ${profile.fullName} (Dalam pengiriman ${matchedIncoming.transferDate})`,
        ],
        traceabilityTimeline: [
          {
            id: 'inc-qr-1',
            date: matchedIncoming.transferDate,
            actor: matchedIncoming.distributorName,
            organization: matchedIncoming.distributorName,
            title: 'Dikirim ke Petani',
            detail: `${matchedIncoming.quantitySentKg} kg berlabel ${matchedIncoming.certificateNumber}.`,
          },
        ],
      });
      pushActivity({
        category: 'Verifikasi QR',
        title: `Memeriksa QR Pengiriman ${matchedIncoming.batchNumber}`,
        description: `Sertifikat ${matchedIncoming.certificateNumber} sah. Segera konfirmasi di menu Penerimaan Benih.`,
        batchNumber: matchedIncoming.batchNumber,
      });
      setActiveScreen('qr-result');
      return;
    }

    // 4. Not found
    setQrOutcome({
      state: 'Data Tidak Ditemukan',
      queriedCode: rawCode.trim(),
    });
    setActiveScreen('qr-result');
  };

  // Reception Confirmation Handler
  const handleSubmitReception = (payload: {
    incomingId: string;
    decision: 'Diterima' | 'Dilaporkan Bermasalah';
    receivedQuantityKg: number;
    receptionDate: string;
    seedCondition: SeedConditionOption;
    notes: string;
  }) => {
    const target = incoming.find((b) => b.id === payload.incomingId);
    if (!target) return;

    setIncoming((prev) =>
      prev.map((item) =>
        item.id === payload.incomingId
          ? {
              ...item,
              receptionStatus: payload.decision,
              receivedQuantityKg: payload.receivedQuantityKg,
              receptionDate: payload.receptionDate,
              seedCondition: payload.seedCondition,
              notes: payload.notes,
            }
          : item
      )
    );

    if (payload.decision === 'Diterima') {
      const existingSeed = seeds.find(
        (s) => s.batchNumber === target.batchNumber
      );
      if (!existingSeed) {
        const newSeed: FarmerSeedBatch = {
          id: `fseed-${Date.now()}`,
          batchNumber: target.batchNumber,
          commodity: target.commodity,
          variety: target.variety,
          seedClass: target.seedClass,
          producerName: target.producerName,
          distributorName: target.distributorName,
          certificateNumber: target.certificateNumber,
          certificationStatus: 'Aktif',
          batchOrigin: `Diproduksi oleh ${target.producerName}`,
          receivedQuantityKg: payload.receivedQuantityKg,
          plantedQuantityKg: 0,
          receivedDate: payload.receptionDate,
          verificationStatus: 'Menunggu Verifikasi',
          distributionHistory: [
            `${target.producerName} → ${target.distributorName}`,
            `${target.distributorName} → ${profile.fullName} / ${profile.farmerGroup} (${payload.receptionDate})`,
          ],
          traceabilityTimeline: [
            {
              id: `ft-${Date.now()}`,
              date: payload.receptionDate,
              actor: profile.fullName,
              organization: profile.farmerGroup,
              title: 'Penerimaan Benih Dikonfirmasi Petani',
              detail: `${payload.receivedQuantityKg} kg diterima (${payload.seedCondition}). Siap verifikasi QR.`,
            },
          ],
        };
        setSeeds((prev) => [newSeed, ...prev]);
      }

      pushActivity({
        category: 'Penerimaan',
        title: `Mengonfirmasi Penerimaan Batch ${target.batchNumber}`,
        description: `${payload.receivedQuantityKg} kg ${target.variety} diterima (${payload.seedCondition}).`,
        batchNumber: target.batchNumber,
      });
      showToast(
        `Penerimaan ${target.batchNumber} dikonfirmasi dan masuk ke Benih Saya.`
      );
    } else {
      pushActivity({
        category: 'Penerimaan',
        title: `Melaporkan Ketidaksesuaian Batch ${target.batchNumber}`,
        description: `Kondisi: ${payload.seedCondition}. Catatan: ${payload.notes}`,
        batchNumber: target.batchNumber,
      });
      showToast(
        `Laporan ketidaksesuaian untuk ${target.batchNumber} telah dikirim ke penyalur.`
      );
    }

    setActiveScreen('reception');
  };

  // Planting Save Handler
  const handleSavePlanting = (payload: {
    draftId?: string;
    batchId: string;
    plantingDate: string;
    location: string;
    plantedQuantityKg: number;
    landAreaHa: number;
    notes: string;
    submitType: 'Draf' | 'Tercatat';
  }) => {
    const batch = seeds.find((s) => s.id === payload.batchId);
    if (!batch) return;

    if (payload.draftId) {
      setPlantings((prev) =>
        prev.map((rec) =>
          rec.id === payload.draftId
            ? {
                ...rec,
                batchId: batch.id,
                batchNumber: batch.batchNumber,
                variety: batch.variety,
                commodity: batch.commodity,
                plantingDate: payload.plantingDate,
                location: payload.location,
                plantedQuantityKg: payload.plantedQuantityKg,
                landAreaHa: payload.landAreaHa,
                notes: payload.notes,
                status: payload.submitType,
              }
            : rec
        )
      );
    } else {
      const nextNum = plantings.length + 15;
      const newRecord: FarmerPlantingRecord = {
        id: `plant-${Date.now()}`,
        recordCode: `TNM-2026-0${nextNum}`,
        batchId: batch.id,
        batchNumber: batch.batchNumber,
        variety: batch.variety,
        commodity: batch.commodity,
        plantingDate: payload.plantingDate,
        location: payload.location,
        plantedQuantityKg: payload.plantedQuantityKg,
        landAreaHa: payload.landAreaHa,
        notes: payload.notes,
        status: payload.submitType,
      };
      setPlantings((prev) => [newRecord, ...prev]);
    }

    if (payload.submitType === 'Tercatat') {
      setSeeds((prev) =>
        prev.map((s) =>
          s.id === batch.id
            ? {
                ...s,
                plantedQuantityKg: Math.min(
                  s.receivedQuantityKg,
                  s.plantedQuantityKg + payload.plantedQuantityKg
                ),
              }
            : s
        )
      );
      pushActivity({
        category: 'Penanaman',
        title: `Mencatat Penanaman ${batch.variety}`,
        description: `${payload.plantedQuantityKg} kg ditanam di ${payload.location} (${payload.landAreaHa} Ha).`,
        batchNumber: batch.batchNumber,
      });
      showToast('Catatan penanaman berhasil dikirim dan tercatat.');
    } else {
      showToast('Draf catatan penanaman disimpan.');
    }

    setSelectedPlantingId(null);
    setPreselectedPlantBatchId(null);
    setActiveScreen('planting');
  };

  // Correction Request Handler (Farmer submits; Regulator approves)
  const handleSubmitCorrection = (payload: {
    plantingRecordId: string;
    incorrectInfo: string;
    requestedCorrection: string;
    reason: string;
  }) => {
    const rec = plantings.find((p) => p.id === payload.plantingRecordId);
    if (!rec) return;

    const reqCode = `KOR-2026-00${corrections.length + 5}`;
    const newReq: PlantingCorrectionRequest = {
      id: `corr-${Date.now()}`,
      requestCode: reqCode,
      plantingRecordId: rec.id,
      recordCode: rec.recordCode,
      batchNumber: rec.batchNumber,
      variety: rec.variety,
      incorrectInfo: payload.incorrectInfo,
      requestedCorrection: payload.requestedCorrection,
      reason: payload.reason,
      submittedAt: '2026-11-16',
      status: 'Menunggu Persetujuan',
      regulatorNote: 'Menunggu tinjauan & persetujuan resmi oleh Regulator BPSB.',
    };

    setCorrections((prev) => [newReq, ...prev]);
    setPlantings((prev) =>
      prev.map((p) =>
        p.id === rec.id ? { ...p, status: 'Koreksi Diajukan' } : p
      )
    );
    pushActivity({
      category: 'Koreksi',
      title: `Mengajukan Koreksi Catatan ${rec.recordCode}`,
      description: `Perbaikan diajukan: "${payload.requestedCorrection}" (Menunggu Persetujuan BPSB).`,
      batchNumber: rec.batchNumber,
    });
    showToast(
      `Pengajuan koreksi ${reqCode} dikirim ke Regulator BPSB (Menunggu Persetujuan).`
    );
  };

  const handleUpdateProfile = (updated: Partial<FarmerProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
    showToast('Profil petani berhasil diperbarui.');
  };

  // Helper Navigation Actions
  const handleOpenSeedDetail = (seedId: string) => {
    setSelectedSeedId(seedId);
    setActiveScreen('seed-detail');
  };

  const handleStartPlantingFromSeed = (seedId?: string) => {
    setSelectedPlantingId(null);
    setPreselectedPlantBatchId(seedId ?? null);
    setActiveScreen('planting-form');
  };

  const handleStartReceptionConfirm = (incomingId?: string) => {
    if (incomingId) {
      setSelectedIncomingId(incomingId);
      setActiveScreen('reception-confirm');
    } else {
      const firstPending = incoming.find(
        (b) => b.receptionStatus === 'Menunggu Konfirmasi'
      );
      if (firstPending) {
        setSelectedIncomingId(firstPending.id);
        setActiveScreen('reception-confirm');
      } else {
        setActiveScreen('reception');
      }
    }
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return (
          <FarmerDashboardScreen
            farmerName={profile.fullName}
            farmerGroup={profile.farmerGroup}
            seeds={seeds}
            incoming={incoming}
            plantings={plantings}
            onNavigate={setActiveScreen}
            onOpenSeedDetail={handleOpenSeedDetail}
            onQuickVerifyBatch={(batchNum) => handleVerifyQrCode(batchNum)}
            onStartReceptionConfirm={handleStartReceptionConfirm}
            onOpenPlantingDetail={(id) => {
              setSelectedPlantingId(id);
              setActiveScreen('planting-detail');
            }}
          />
        );

      case 'my-seeds':
        return (
          <FarmerMySeedsScreen
            seeds={seeds}
            onViewDetail={handleOpenSeedDetail}
            onVerifyBatch={(batchNum) => handleVerifyQrCode(batchNum)}
          />
        );

      case 'seed-detail':
        if (!selectedSeed) {
          return (
            <FarmerMySeedsScreen
              seeds={seeds}
              onViewDetail={handleOpenSeedDetail}
              onVerifyBatch={(batchNum) => handleVerifyQrCode(batchNum)}
            />
          );
        }
        return (
          <FarmerSeedDetailScreen
            seed={selectedSeed}
            onBack={() => setActiveScreen('my-seeds')}
            onVerifyBatch={(batchNum) => handleVerifyQrCode(batchNum)}
            onStartPlanting={(seedId) => handleStartPlantingFromSeed(seedId)}
          />
        );

      case 'qr-verify':
      case 'qr-result':
        return (
          <FarmerQrVerifyScreen
            mode={activeScreen}
            initialCode={qrInputCode}
            outcome={qrOutcome}
            onVerifyCode={handleVerifyQrCode}
            onBackToScanner={() => setActiveScreen('qr-verify')}
            onStartPlantingFromVerified={(seedId) =>
              handleStartPlantingFromSeed(seedId)
            }
            onGoToReceptionIssue={() => setActiveScreen('reception')}
          />
        );

      case 'reception':
      case 'reception-confirm':
        return (
          <FarmerReceptionScreen
            mode={activeScreen}
            incomingBatches={incoming}
            selectedIncoming={selectedIncoming}
            onOpenConfirmForm={(id) => {
              setSelectedIncomingId(id);
              setActiveScreen('reception-confirm');
            }}
            onBackToList={() => setActiveScreen('reception')}
            onSubmitReception={handleSubmitReception}
          />
        );

      case 'planting':
      case 'planting-form':
      case 'planting-detail':
        return (
          <FarmerPlantingScreen
            mode={activeScreen}
            seeds={seeds}
            plantings={plantings}
            corrections={corrections}
            selectedRecord={selectedPlanting}
            preselectedBatchId={preselectedPlantBatchId}
            onNavigateList={() => {
              setSelectedPlantingId(null);
              setPreselectedPlantBatchId(null);
              setActiveScreen('planting');
            }}
            onStartNewForm={(batchId) => handleStartPlantingFromSeed(batchId)}
            onOpenDetail={(id) => {
              setSelectedPlantingId(id);
              setActiveScreen('planting-detail');
            }}
            onResumeDraft={(id) => {
              setSelectedPlantingId(id);
              setActiveScreen('planting-form');
            }}
            onRequestCorrection={(id) => {
              setPreselectedCorrectionPlantId(id);
              setActiveScreen('correction');
            }}
            onSavePlanting={handleSavePlanting}
          />
        );

      case 'correction':
        return (
          <FarmerCorrectionScreen
            plantings={plantings}
            corrections={corrections}
            preselectedPlantingId={preselectedCorrectionPlantId}
            onBack={() => setActiveScreen('planting')}
            onSubmitCorrection={handleSubmitCorrection}
          />
        );

      case 'activity':
        return <FarmerActivityLogScreen activities={activities} />;

      case 'profile':
        return (
          <FarmerProfileScreen
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] text-[#111827] flex">
      <FarmerSidebar
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
        onSwitchPortal={onSwitchPortal}
        onLogout={onLogout}
        farmerName={profile.fullName}
        farmerGroup={profile.farmerGroup}
        pendingReceptionCount={pendingReceptionCount}
        unverifiedSeedsCount={unverifiedSeedsCount}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-[260px]">
        <FarmerHeader
          activeScreen={activeScreen}
          farmerName={profile.fullName}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onNavigate={setActiveScreen}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-6 pb-20 lg:pb-8 max-w-[1440px] w-full mx-auto">
          {renderScreen()}
        </main>
      </div>

      {/* Compact Mobile Bottom Navigation Bar (lg:hidden, 56px height) */}
      <nav
        aria-label="Navigasi Cepat Petani"
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 h-14 bg-white border-t border-[#E2E8F0] grid grid-cols-5"
      >
        {(
          [
            {
              id: 'dashboard',
              match: ['dashboard'],
              label: 'Beranda',
              icon: LayoutDashboard,
            },
            {
              id: 'my-seeds',
              match: ['my-seeds', 'seed-detail'],
              label: 'Benih',
              icon: Wheat,
            },
            {
              id: 'qr-verify',
              match: ['qr-verify', 'qr-result'],
              label: 'Scan QR',
              icon: QrCode,
            },
            {
              id: 'reception',
              match: ['reception', 'reception-confirm'],
              label: 'Terima',
              icon: PackageCheck,
            },
            {
              id: 'planting',
              match: ['planting', 'planting-form', 'planting-detail', 'correction'],
              label: 'Tanam',
              icon: Sprout,
            },
          ] as const
        ).map((item) => {
          const Icon = item.icon;
          const isActive = (item.match as readonly string[]).includes(activeScreen);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveScreen(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 text-[11px] transition-colors ${
                isActive ? 'text-[#00843D] font-semibold' : 'text-[#64748B] font-medium'
              }`}
            >
              <Icon className="w-[18px] h-[18px]" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-16 lg:bottom-6 right-4 sm:right-6 z-50 max-w-sm bg-[#111827] text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5 text-[13px] font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
