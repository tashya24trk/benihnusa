import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import {
  INITIAL_DISTRIBUTIONS,
  INITIAL_DISTRIBUTOR_ACTIVITIES,
  INITIAL_DISTRIBUTOR_INVENTORY,
  INITIAL_DISTRIBUTOR_PROFILE,
  INITIAL_INCOMING_BATCHES,
  INITIAL_OWNERSHIP_TRANSFERS,
} from '../data/distributorSeedData';
import {
  DistributionDestType,
  DistributorActivityLog,
  DistributorDistributionRecord,
  DistributorInventoryBatch,
  DistributorOrganizationProfile,
  DistributorOwnershipTransfer,
  DistributorScreenId,
  IncomingBatch,
} from '../types/distributor';
import { DistributorActivityLogScreen } from './distributor/DistributorActivityLogScreen';
import { DistributorDashboardScreen } from './distributor/DistributorDashboardScreen';
import { DistributorDistributionScreen } from './distributor/DistributorDistributionScreen';
import { DistributorHeader } from './distributor/DistributorHeader';
import { DistributorIncomingDetailScreen } from './distributor/DistributorIncomingDetailScreen';
import { DistributorIncomingListScreen } from './distributor/DistributorIncomingListScreen';
import { DistributorInventoryScreen } from './distributor/DistributorInventoryScreen';
import { DistributorProfileScreen } from './distributor/DistributorProfileScreen';
import { DistributorSidebar } from './distributor/DistributorSidebar';
import { DistributorSplitBatchScreen } from './distributor/DistributorSplitBatchScreen';
import { DistributorTransferScreen } from './distributor/DistributorTransferScreen';

import { PortalMode } from '../types/certificationAuthority';

const STORAGE_KEYS = {
  profile: 'benihnusa_dist_profile_v1',
  incoming: 'benihnusa_dist_incoming_v1',
  inventory: 'benihnusa_dist_inventory_v1',
  distributions: 'benihnusa_dist_distributions_v1',
  transfers: 'benihnusa_dist_transfers_v1',
  activities: 'benihnusa_dist_activities_v1',
};

interface DistributorAppProps {
  onSwitchPortal: (portal: PortalMode) => void;
  onLogout?: () => void;
}

export function DistributorApp({
  onSwitchPortal,
  onLogout,
}: DistributorAppProps) {
  const [activeScreen, setActiveScreen] = useState<DistributorScreenId>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [profile, setProfile] = useState<DistributorOrganizationProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.profile);
      return saved ? (JSON.parse(saved) as DistributorOrganizationProfile) : INITIAL_DISTRIBUTOR_PROFILE;
    } catch {
      return INITIAL_DISTRIBUTOR_PROFILE;
    }
  });

  const [incomingBatches, setIncomingBatches] = useState<IncomingBatch[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.incoming);
      return saved ? (JSON.parse(saved) as IncomingBatch[]) : INITIAL_INCOMING_BATCHES;
    } catch {
      return INITIAL_INCOMING_BATCHES;
    }
  });

  const [inventory, setInventory] = useState<DistributorInventoryBatch[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.inventory);
      return saved ? (JSON.parse(saved) as DistributorInventoryBatch[]) : INITIAL_DISTRIBUTOR_INVENTORY;
    } catch {
      return INITIAL_DISTRIBUTOR_INVENTORY;
    }
  });

  const [distributions, setDistributions] = useState<DistributorDistributionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.distributions);
      return saved ? (JSON.parse(saved) as DistributorDistributionRecord[]) : INITIAL_DISTRIBUTIONS;
    } catch {
      return INITIAL_DISTRIBUTIONS;
    }
  });

  const [transfers, setTransfers] = useState<DistributorOwnershipTransfer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.transfers);
      return saved ? (JSON.parse(saved) as DistributorOwnershipTransfer[]) : INITIAL_OWNERSHIP_TRANSFERS;
    } catch {
      return INITIAL_OWNERSHIP_TRANSFERS;
    }
  });

  const [activities, setActivities] = useState<DistributorActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.activities);
      return saved ? (JSON.parse(saved) as DistributorActivityLog[]) : INITIAL_DISTRIBUTOR_ACTIVITIES;
    } catch {
      return INITIAL_DISTRIBUTOR_ACTIVITIES;
    }
  });

  const [selectedIncomingId, setSelectedIncomingId] = useState<string | null>(
    INITIAL_INCOMING_BATCHES[0].id
  );
  const [preselectedDistBatchId, setPreselectedDistBatchId] = useState<string | null>(null);
  const [preselectedSplitBatchId, setPreselectedSplitBatchId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
      localStorage.setItem(STORAGE_KEYS.incoming, JSON.stringify(incomingBatches));
      localStorage.setItem(STORAGE_KEYS.inventory, JSON.stringify(inventory));
      localStorage.setItem(STORAGE_KEYS.distributions, JSON.stringify(distributions));
      localStorage.setItem(STORAGE_KEYS.transfers, JSON.stringify(transfers));
      localStorage.setItem(STORAGE_KEYS.activities, JSON.stringify(activities));
    } catch {
      // Ignore storage quota issues
    }
  }, [profile, incomingBatches, inventory, distributions, transfers, activities]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  const pendingIncomingCount = useMemo(
    () => incomingBatches.filter((b) => b.receiptStatus === 'Menunggu Konfirmasi').length,
    [incomingBatches]
  );

  const activeDistributionCount = useMemo(
    () =>
      distributions.filter((d) => d.receiptConfirmationStatus === 'Menunggu Konfirmasi').length,
    [distributions]
  );

  const activeIncomingBatch = useMemo(
    () => incomingBatches.find((b) => b.id === selectedIncomingId) ?? incomingBatches[0] ?? null,
    [incomingBatches, selectedIncomingId]
  );

  const appendActivity = (
    category: DistributorActivityLog['category'],
    title: string,
    description: string,
    batchNumber?: string
  ) => {
    const timeStr = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const newLog: DistributorActivityLog = {
      id: `dact-${Date.now()}`,
      timestamp: `2026-11-16 ${timeStr} WIB`,
      category,
      actor: profile.representativeName,
      title,
      description,
      batchNumber,
    };
    setActivities((prev) => [newLog, ...prev]);
  };

  const handleNavigate = (screen: DistributorScreenId) => {
    if (screen !== 'distribution') {
      setPreselectedDistBatchId(null);
    }
    if (screen !== 'split') {
      setPreselectedSplitBatchId(null);
    }
    setActiveScreen(screen);
  };

  const handleOpenIncomingDetail = (batchId: string) => {
    setSelectedIncomingId(batchId);
    setActiveScreen('incoming-detail');
  };

  const handleStartReceiptConfirm = (batchId?: string) => {
    if (batchId) {
      setSelectedIncomingId(batchId);
      setActiveScreen('receipt-confirm');
      return;
    }
    const firstPending = incomingBatches.find(
      (b) => b.receiptStatus === 'Menunggu Konfirmasi'
    );
    if (firstPending) {
      setSelectedIncomingId(firstPending.id);
      setActiveScreen('receipt-confirm');
    } else {
      setActiveScreen('incoming');
      showToast('Seluruh pengiriman batch masuk telah dikonfirmasi.');
    }
  };

  const handleSubmitReceiptDecision = (
    batchId: string,
    decision: 'Diterima' | 'Ditolak',
    note: string
  ) => {
    const target = incomingBatches.find((b) => b.id === batchId);
    if (!target || target.receiptStatus !== 'Menunggu Konfirmasi') return;

    const timeStr = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setIncomingBatches((prev) =>
      prev.map((b) =>
        b.id === batchId
          ? {
              ...b,
              receiptStatus: decision,
              receiptNote: note,
              confirmedAt: `2026-11-16 ${timeStr} WIB`,
            }
          : b
      )
    );

    if (decision === 'Diterima') {
      const newInvBatch: DistributorInventoryBatch = {
        id: `inv-${Date.now()}`,
        batchNumber: target.batchNumber,
        producerName: target.producerName,
        commodity: target.commodity,
        variety: target.variety,
        seedClass: target.seedClass,
        certificateNumber: target.certificateNumber,
        initialQuantityKg: target.quantityKg,
        availableQuantityKg: target.quantityKg,
        receivedDate: '2026-11-16',
        currentOwner: profile.organizationName,
        certificationStatus: 'Tersertifikasi',
        batchStatus: 'Tersedia',
      };
      setInventory((prev) => [newInvBatch, ...prev]);

      appendActivity(
        'Penerimaan Batch',
        'Mengonfirmasi Penerimaan Batch Masuk',
        `${target.quantityKg.toLocaleString('id-ID')} kg ${target.variety} dari ${target.producerName} resmi diterima ke Stok Benih.`,
        target.batchNumber
      );
      showToast(
        `Batch ${target.batchNumber} (${target.quantityKg.toLocaleString('id-ID')} kg) diterima & ditambahkan ke Stok Benih.`
      );
    } else {
      appendActivity(
        'Penerimaan Batch',
        'Menolak Penerimaan Batch Masuk',
        `Pengiriman ${target.batchNumber} dari ${target.producerName} ditolak. Alasan: ${note}`,
        target.batchNumber
      );
      showToast(`Penerimaan batch ${target.batchNumber} ditolak dan dicatat.`);
    }

    setSelectedIncomingId(batchId);
    setActiveScreen('incoming-detail');
  };

  const handleCreateDistribution = (payload: {
    batchId: string;
    recipientName: string;
    recipientType: DistributionDestType;
    recipientDetails: string;
    quantityKg: number;
    transferDate: string;
    notes: string;
  }) => {
    const batch = inventory.find((b) => b.id === payload.batchId);
    if (
      !batch ||
      batch.currentOwner !== profile.organizationName ||
      payload.quantityKg > batch.availableQuantityKg
    ) {
      showToast('Batch tidak tersedia atau melebihi stok milik koperasi.');
      return;
    }

    const timeStr = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const remaining = batch.availableQuantityKg - payload.quantityKg;
    const distCode = `DST-KTM-2026-${Math.floor(50 + Math.random() * 49)}`;

    const newDist: DistributorDistributionRecord = {
      id: `dist-${Date.now()}`,
      distributionCode: distCode,
      batchId: batch.id,
      batchNumber: batch.batchNumber,
      variety: batch.variety,
      commodity: batch.commodity,
      sourceOrganization: profile.organizationName,
      recipientName: payload.recipientName,
      recipientType: payload.recipientType,
      recipientDetails: payload.recipientDetails,
      quantityKg: payload.quantityKg,
      transferDate: payload.transferDate,
      ownershipStatus: 'Dalam Pengiriman',
      receiptConfirmationStatus: 'Menunggu Konfirmasi',
      notes: payload.notes,
    };

    const newTransfer: DistributorOwnershipTransfer = {
      id: `ot-${Date.now()}`,
      transferCode: `TRF-KTM-2026-${Math.floor(20 + Math.random() * 75)}`,
      batchId: batch.id,
      batchNumber: batch.batchNumber,
      variety: batch.variety,
      currentOwner: profile.organizationName,
      receivingParty: payload.recipientName,
      receivingType: payload.recipientType,
      quantityKg: payload.quantityKg,
      transferDate: payload.transferDate,
      transferStatus: 'Dalam Proses',
      confirmationHistory: [
        {
          id: `ev-${Date.now()}-1`,
          title: 'Inisiasi Distribusi & Transfer Kepemilikan',
          timestamp: `16 Nov 2026, ${timeStr} WIB`,
          actor: `${profile.representativeName} (${profile.organizationName})`,
          description: `Penyaluran ${payload.quantityKg.toLocaleString('id-ID')} kg ${batch.variety} diterbitkan (${distCode}).`,
          completed: true,
        },
        {
          id: `ev-${Date.now()}-2`,
          title: 'Konfirmasi Penerimaan Oleh Penerima',
          timestamp: 'Menunggu konfirmasi',
          actor: payload.recipientName,
          description: 'Menunggu verifikasi penerimaan benih di lokasi tujuan.',
          completed: false,
        },
      ],
    };

    setInventory((prev) =>
      prev.map((item) =>
        item.id === batch.id
          ? {
              ...item,
              availableQuantityKg: remaining,
              batchStatus:
                remaining === 0 ? 'Habis Terdistribusi' : 'Sebagian Terdistribusi',
            }
          : item
      )
    );
    setDistributions((prev) => [newDist, ...prev]);
    setTransfers((prev) => [newTransfer, ...prev]);
    setPreselectedDistBatchId(null);

    appendActivity(
      'Distribusi Benih',
      `Membuat Distribusi ke ${payload.recipientName}`,
      `Sebanyak ${payload.quantityKg.toLocaleString('id-ID')} kg ${batch.variety} dikirimkan (${distCode}).`,
      batch.batchNumber
    );

    showToast(
      `Distribusi ${payload.quantityKg.toLocaleString('id-ID')} kg ke ${payload.recipientName} berhasil dibuat.`
    );
  };

  const handleConfirmRecipientReceipt = (distId: string) => {
    const target = distributions.find((d) => d.id === distId);
    if (!target) return;

    const timeStr = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setDistributions((prev) =>
      prev.map((d) =>
        d.id === distId
          ? {
              ...d,
              ownershipStatus: 'Milik Penerima',
              receiptConfirmationStatus: 'Diterima Petani/Tujuan',
            }
          : d
      )
    );

    setTransfers((prev) =>
      prev.map((tr) =>
        tr.batchId === target.batchId &&
        tr.receivingParty === target.recipientName &&
        tr.transferStatus === 'Dalam Proses'
          ? {
              ...tr,
              currentOwner: target.recipientName,
              transferStatus: 'Selesai Dialihkan',
              confirmationHistory: tr.confirmationHistory.map((ev) =>
                ev.completed
                  ? ev
                  : {
                      ...ev,
                      timestamp: `16 Nov 2026, ${timeStr} WIB`,
                      description: `Penerimaan ${target.quantityKg.toLocaleString('id-ID')} kg telah dikonfirmasi di tujuan.`,
                      completed: true,
                    }
              ),
            }
          : tr
      )
    );

    appendActivity(
      'Transfer Kepemilikan',
      `Konfirmasi Penerimaan oleh ${target.recipientName}`,
      `Serah terima ${target.quantityKg.toLocaleString('id-ID')} kg ${target.variety} selesai.`,
      target.batchNumber
    );

    showToast(`Penerimaan oleh ${target.recipientName} berhasil dikonfirmasi.`);
  };

  const handleExecuteSplit = (payload: {
    parentBatchId: string;
    allocations: { suffix: string; quantityKg: number }[];
  }) => {
    const parent = inventory.find((b) => b.id === payload.parentBatchId);
    if (!parent || parent.currentOwner !== profile.organizationName) {
      showToast('Pemecahan batch hanya dapat dilakukan oleh pemilik sah saat ini.');
      return;
    }

    const totalSplit = payload.allocations.reduce((sum, a) => sum + a.quantityKg, 0);
    if (totalSplit <= 0 || totalSplit > parent.availableQuantityKg) {
      showToast('Total alokasi pemecahan melebihi stok tersedia.');
      return;
    }

    const remaining = parent.availableQuantityKg - totalSplit;
    const childBatches: DistributorInventoryBatch[] = payload.allocations.map((alloc) => ({
      id: `inv-split-${Date.now()}-${alloc.suffix}`,
      batchNumber: `${parent.batchNumber}-${alloc.suffix}`,
      parentBatchNumber: parent.batchNumber,
      producerName: parent.producerName,
      commodity: parent.commodity,
      variety: parent.variety,
      seedClass: parent.seedClass,
      certificateNumber: parent.certificateNumber,
      initialQuantityKg: alloc.quantityKg,
      availableQuantityKg: alloc.quantityKg,
      receivedDate: parent.receivedDate,
      currentOwner: profile.organizationName,
      certificationStatus: parent.certificationStatus,
      batchStatus: 'Tersedia',
    }));

    setInventory((prev) => [
      ...childBatches,
      ...prev.map((b) =>
        b.id === parent.id
          ? {
              ...b,
              availableQuantityKg: remaining,
              batchStatus:
                remaining === 0
                  ? ('Dipecah' as const)
                  : ('Sebagian Terdistribusi' as const),
            }
          : b
      ),
    ]);

    const childCodes = childBatches.map((c) => c.batchNumber).join(', ');
    appendActivity(
      'Pemecahan Batch',
      `Memecah Batch ${parent.batchNumber} menjadi ${childBatches.length} Lot`,
      `Total ${totalSplit.toLocaleString('id-ID')} kg dipecah ke lot turunan: ${childCodes}.`,
      parent.batchNumber
    );

    setPreselectedSplitBatchId(null);
    setActiveScreen('inventory');
    showToast(
      `Batch ${parent.batchNumber} berhasil dipecah menjadi ${childBatches.length} lot turunan.`
    );
  };

  const handleCreateTransfer = (payload: {
    batchId: string;
    receivingParty: string;
    receivingType: string;
    quantityKg: number;
    transferDate: string;
  }) => {
    const batch = inventory.find((b) => b.id === payload.batchId);
    if (
      !batch ||
      batch.currentOwner !== profile.organizationName ||
      payload.quantityKg > batch.availableQuantityKg
    ) {
      showToast('Stok batch tidak memenuhi syarat untuk transfer kepemilikan.');
      return;
    }

    const timeStr = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const remaining = batch.availableQuantityKg - payload.quantityKg;
    const transferCode = `TRF-KTM-2026-${Math.floor(20 + Math.random() * 75)}`;

    const newTransfer: DistributorOwnershipTransfer = {
      id: `ot-${Date.now()}`,
      transferCode,
      batchId: batch.id,
      batchNumber: batch.batchNumber,
      variety: batch.variety,
      currentOwner: profile.organizationName,
      receivingParty: payload.receivingParty,
      receivingType: payload.receivingType,
      quantityKg: payload.quantityKg,
      transferDate: payload.transferDate,
      transferStatus: 'Dalam Proses',
      confirmationHistory: [
        {
          id: `ev-${Date.now()}-1`,
          title: 'Inisiasi Transfer Kepemilikan',
          timestamp: `16 Nov 2026, ${timeStr} WIB`,
          actor: `${profile.representativeName} (${profile.organizationName})`,
          description: `Pengalihan ${payload.quantityKg.toLocaleString('id-ID')} kg ${batch.variety} kepada ${payload.receivingParty}.`,
          completed: true,
        },
        {
          id: `ev-${Date.now()}-2`,
          title: 'Konfirmasi Penerimaan Oleh Penerima',
          timestamp: 'Menunggu konfirmasi',
          actor: payload.receivingParty,
          description: 'Menunggu pemindaian QR dan konfirmasi serah terima resmi.',
          completed: false,
        },
      ],
    };

    setInventory((prev) =>
      prev.map((item) =>
        item.id === batch.id
          ? {
              ...item,
              availableQuantityKg: remaining,
              batchStatus:
                remaining === 0 ? 'Habis Terdistribusi' : 'Sebagian Terdistribusi',
            }
          : item
      )
    );
    setTransfers((prev) => [newTransfer, ...prev]);

    appendActivity(
      'Transfer Kepemilikan',
      `Mengajukan Transfer ke ${payload.receivingParty}`,
      `Transfer ${payload.quantityKg.toLocaleString('id-ID')} kg ${batch.variety} (${transferCode}) sedang diproses.`,
      batch.batchNumber
    );

    showToast(
      `Transfer kepemilikan ${transferCode} kepada ${payload.receivingParty} berhasil dibuat.`
    );
  };

  const handleConfirmTransferDone = (transferId: string) => {
    const tr = transfers.find((t) => t.id === transferId);
    if (!tr || tr.transferStatus === 'Selesai Dialihkan') return;

    const timeStr = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setTransfers((prev) =>
      prev.map((item) =>
        item.id === transferId
          ? {
              ...item,
              currentOwner: item.receivingParty,
              transferStatus: 'Selesai Dialihkan',
              confirmationHistory: item.confirmationHistory.map((ev) =>
                ev.completed
                  ? ev
                  : {
                      ...ev,
                      timestamp: `16 Nov 2026, ${timeStr} WIB`,
                      description: `Hak milik ${item.quantityKg.toLocaleString('id-ID')} kg resmi dialihkan ke ${item.receivingParty}.`,
                      completed: true,
                    }
              ),
            }
          : item
      )
    );

    setDistributions((prev) =>
      prev.map((d) =>
        d.batchId === tr.batchId &&
        d.recipientName === tr.receivingParty &&
        d.receiptConfirmationStatus === 'Menunggu Konfirmasi'
          ? {
              ...d,
              ownershipStatus: 'Milik Penerima',
              receiptConfirmationStatus: 'Diterima Petani/Tujuan',
            }
          : d
      )
    );

    appendActivity(
      'Transfer Kepemilikan',
      `Transfer Kepemilikan Selesai (${tr.transferCode})`,
      `Hak milik ${tr.quantityKg.toLocaleString('id-ID')} kg ${tr.variety} resmi diterima oleh ${tr.receivingParty}.`,
      tr.batchNumber
    );

    showToast(`Transfer ${tr.transferCode} resmi selesai dialihkan ke ${tr.receivingParty}.`);
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] text-[#111827] flex">
      <DistributorSidebar
        activeScreen={activeScreen}
        onSelectScreen={handleNavigate}
        onSwitchPortal={onSwitchPortal}
        onLogout={onLogout}
        organizationName={profile.organizationName}
        roleLabel={profile.roleLabel}
        representativeName={profile.representativeName}
        pendingIncomingCount={pendingIncomingCount}
        activeDistributionCount={activeDistributionCount}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 lg:pl-[260px] flex flex-col min-w-0">
        <DistributorHeader
          activeScreen={activeScreen}
          activeIncomingBatchNumber={activeIncomingBatch?.batchNumber}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onNavigate={handleNavigate}
          onStartReceiptConfirm={() => handleStartReceiptConfirm()}
        />

        <main className="flex-1 px-4 sm:px-8 py-6 max-w-[1600px] w-full mx-auto">
          {activeScreen === 'dashboard' && (
            <DistributorDashboardScreen
              organizationName={profile.organizationName}
              roleLabel={profile.roleLabel}
              incomingBatches={incomingBatches}
              inventory={inventory}
              distributions={distributions}
              onNavigate={handleNavigate}
              onOpenIncomingDetail={handleOpenIncomingDetail}
              onStartReceiptConfirm={handleStartReceiptConfirm}
            />
          )}

          {activeScreen === 'incoming' && (
            <DistributorIncomingListScreen
              incomingBatches={incomingBatches}
              onViewDetail={handleOpenIncomingDetail}
              onConfirmReceipt={(batchId) => handleStartReceiptConfirm(batchId)}
              onRefresh={() => showToast('Daftar batch masuk berhasil disinkronkan.')}
            />
          )}

          {(activeScreen === 'incoming-detail' || activeScreen === 'receipt-confirm') &&
            activeIncomingBatch && (
              <DistributorIncomingDetailScreen
                key={`${activeIncomingBatch.id}-${activeScreen}`}
                batch={activeIncomingBatch}
                mode={activeScreen === 'receipt-confirm' ? 'confirm' : 'detail'}
                onBack={() => setActiveScreen('incoming')}
                onSwitchToConfirm={() => setActiveScreen('receipt-confirm')}
                onSubmitDecision={handleSubmitReceiptDecision}
              />
            )}

          {activeScreen === 'inventory' && (
            <DistributorInventoryScreen
              organizationName={profile.organizationName}
              inventory={inventory}
              onDistributeBatch={(batchId) => {
                setPreselectedDistBatchId(batchId);
                setActiveScreen('distribution');
              }}
              onSplitBatch={(batchId) => {
                setPreselectedSplitBatchId(batchId);
                setActiveScreen('split');
              }}
            />
          )}

          {activeScreen === 'distribution' && (
            <DistributorDistributionScreen
              key={preselectedDistBatchId ?? 'dist-default'}
              organizationName={profile.organizationName}
              inventory={inventory}
              distributions={distributions}
              preselectedBatchId={preselectedDistBatchId}
              onCreateDistribution={handleCreateDistribution}
              onConfirmRecipientReceipt={handleConfirmRecipientReceipt}
            />
          )}

          {activeScreen === 'split' && (
            <DistributorSplitBatchScreen
              key={preselectedSplitBatchId ?? 'split-default'}
              organizationName={profile.organizationName}
              inventory={inventory}
              preselectedBatchId={preselectedSplitBatchId}
              onExecuteSplit={handleExecuteSplit}
            />
          )}

          {activeScreen === 'transfer' && (
            <DistributorTransferScreen
              organizationName={profile.organizationName}
              inventory={inventory}
              transfers={transfers}
              onCreateTransfer={handleCreateTransfer}
              onConfirmTransferDone={handleConfirmTransferDone}
            />
          )}

          {activeScreen === 'activity' && (
            <DistributorActivityLogScreen
              organizationName={profile.organizationName}
              activities={activities}
              onOpenBatchReference={(batchNumber) => {
                const incMatch = incomingBatches.find((b) => b.batchNumber === batchNumber);
                if (incMatch) {
                  handleOpenIncomingDetail(incMatch.id);
                } else {
                  setActiveScreen('inventory');
                }
              }}
            />
          )}

          {activeScreen === 'profile' && (
            <DistributorProfileScreen
              profile={profile}
              onUpdateProfile={(updated) => {
                setProfile(updated);
                showToast(
                  `Profil operasional ${updated.organizationName} berhasil diperbarui.`
                );
              }}
            />
          )}
        </main>
      </div>

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
