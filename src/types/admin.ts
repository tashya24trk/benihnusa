export type AdminScreenId =
  | 'dashboard'
  | 'account-approvals'
  | 'account-detail'
  | 'organization-approvals'
  | 'organization-detail'
  | 'membership-approvals'
  | 'membership-detail'
  | 'users'
  | 'user-detail'
  | 'audit-log'
  | 'access-denied';

export type ApprovalStatus = 'Menunggu Persetujuan' | 'Disetujui' | 'Ditolak';

export type OrganizationType =
  | 'Produsen Benih'
  | 'Distributor / Koperasi'
  | 'Kelompok Tani'
  | 'Lembaga Sertifikasi / BPSB';

export type BusinessRoleType =
  | 'Produsen'
  | 'Distributor/Koperasi'
  | 'Petani'
  | 'Regulator';

export type SystemRoleType = 'Administrator Sistem' | 'Pengguna Standar';

export type BlockchainTxStatus =
  | 'NOT_REQUIRED'
  | 'PENDING'
  | 'SUBMITTED'
  | 'COMMITTED'
  | 'FAILED';

export type AuditSourceType =
  | 'AUTH_SYSTEM'
  | 'ADMIN_GOVERNANCE'
  | 'SEED_WORKFLOW'
  | 'BLOCKCHAIN_GATEWAY';

export type AuditEventKind = 'PERAN_SISTEM' | 'AUDIT_UMUM' | 'BISNIS_BLOCKCHAIN';

export interface AccountApprovalRequest {
  id: string;
  requestNumber: string;
  fullName: string;
  email: string;
  phone: string;
  nikMasked: string;
  province: string;
  submittedAt: string;
  status: ApprovalStatus;
  notes: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface OrganizationApprovalRequest {
  id: string;
  requestNumber: string;
  organizationName: string;
  organizationType: OrganizationType;
  applicantName: string;
  applicantEmail: string;
  nibOrLicense: string;
  address: string;
  province: string;
  submittedAt: string;
  status: ApprovalStatus;
  supportingDocs: {
    id: string;
    name: string;
    fileSize: string;
    verified: boolean;
  }[];
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface MembershipApprovalRequest {
  id: string;
  requestNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAccountStatus: ApprovalStatus;
  organizationId: string;
  organizationName: string;
  organizationStatus: ApprovalStatus;
  requestedRole: BusinessRoleType;
  submittedAt: string;
  status: ApprovalStatus;
  justification: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface SystemUserRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  systemRole: SystemRoleType;
  accountStatus: ApprovalStatus;
  registeredAt: string;
  lastLoginAt: string;
  memberships: {
    id: string;
    organizationName: string;
    role: BusinessRoleType;
    approvedAt: string;
  }[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  dateKey: string;
  actorName: string;
  actorRole: string;
  activity: string;
  actionType:
    | 'ACCOUNT_APPROVAL'
    | 'ORG_APPROVAL'
    | 'MEMBERSHIP_APPROVAL'
    | 'USER_ACCESS'
    | 'SEED_EVENT'
    | 'AUTH_EVENT';
  entityLabel: string;
  source: AuditSourceType;
  eventKind: AuditEventKind;
  blockchainStatus: BlockchainTxStatus;
  txHash?: string;
  details: string;
}
