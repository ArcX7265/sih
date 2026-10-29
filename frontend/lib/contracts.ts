export type Role = 'institution' | 'officer' | 'authority';
export type Status = 'submitted' | 'correction_requested' | 'verified' | 'release_requested' | 'release_approved' | 'released';
export type Fields = { reference: string; bank: string; amount: number; issueDate: string; maturityDate: string; contact: string };
export type FieldKey = keyof Fields;
export type Evidence = { id: string; version: number; receivedAt: string; fields: Partial<Fields>; simulated: true };
export type Version = { number: number; at: string; fields: Fields; note: string };
export type DocumentRef = { id: string; name: string; size: number; type: string; uploadedAt: string; version: number };
export type AuditEvent = { id: string; at: string; actor: Role | 'system'; action: string; detail: string };
export type Deposit = {
  id: string; institutionId: string; institution: string; region: string; purpose: string;
  status: Status; versions: Version[]; evidence: Evidence[]; documents: DocumentRef[];
  timeline: AuditEvent[]; correction?: string; renewalOf?: string;
  release?: { reason: string; requestedBy: Role; requestedAt: string; checks: { noDues: boolean; clearance: boolean; originalReceipt: boolean }; approvedAt?: string; completedAt?: string };
};
export type Reminder = { id: string; depositId: string; bucket: string; createdAt: string; message: string };
export type Workspace = { deposits: Deposit[]; reminders: Reminder[] };
export type Snapshot = Workspace & { revision: number; role: Role; demoDate: string };
export type Action =
 | { type: 'create'; fields: Fields; purpose: string; renewalOf?: string }
 | { type: 'edit'; id: string; fields: Fields; note: string }
 | { type: 'bank_check'; id: string; scenario: 'match' | 'mismatch' | 'delayed' }
 | { type: 'request_correction'; id: string; note: string }
 | { type: 'verify'; id: string }
 | { type: 'request_release'; id: string; reason: string }
 | { type: 'set_release_check'; id: string; check: 'noDues' | 'clearance' | 'originalReceipt'; value: boolean }
 | { type: 'approve_release'; id: string }
 | { type: 'complete_release'; id: string }
 | { type: 'run_reminders' }
 | { type: 'add_document'; id: string; document: DocumentRef };
export const DEMO_DATE = '2026-10-28';
export const INSTITUTION_ID = 'inst-001';
export const MATERIAL_FIELDS: FieldKey[] = ['reference', 'bank', 'amount', 'issueDate', 'maturityDate'];
