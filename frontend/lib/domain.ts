import type { Action, Deposit, FieldKey, Fields, Role, Status, Workspace } from './contracts.ts';
import { DEMO_DATE, INSTITUTION_ID, MATERIAL_FIELDS } from './contracts.ts';

export class DomainError extends Error {
  status: number;
  constructor(message: string, status = 400) { super(message); this.name = 'DomainError'; this.status = status; }
}

const DAY = 86_400_000;
const REFERENCE_DATE = Date.parse(`${DEMO_DATE}T12:00:00Z`);
const defaultNow = () => `${DEMO_DATE}T12:00:00.000Z`;
const uid = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;
const fail = (message: string, status = 400): never => { throw new DomainError(message, status); };
const assertRole = (role: Role, allowed: Role[]) => { if (!allowed.includes(role)) fail('This demo role is not authorized for this action.', 403); };
const assertStatus = (record: Deposit, allowed: Status[]) => { if (!allowed.includes(record.status)) fail(`This action is not available while the deposit is ${record.status.replaceAll('_', ' ')}.`, 409); };
const noteText = (value: unknown, name: string, max = 1500): string => {
  if (typeof value !== 'string' || value.trim().length < 3 || value.trim().length > max) fail(`${name} must contain 3–${max} characters.`);
  return (value as string).trim();
};
const dateIsValid = (value: unknown): value is string => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;

function validateFields(value: Fields): Fields {
  if (!value || typeof value !== 'object') fail('Deposit fields are required.');
  const reference = noteText(value.reference, 'FDR reference', 80);
  const bank = noteText(value.bank, 'Bank name', 120);
  if (typeof value.amount !== 'number' || !Number.isFinite(value.amount) || value.amount <= 0 || value.amount > 1_000_000_000 || Math.abs(value.amount * 100 - Math.round(value.amount * 100)) > 0.0001) fail('Amount must be positive, at most ₹100 crore, with no more than two decimal places.');
  if (!dateIsValid(value.issueDate) || !dateIsValid(value.maturityDate)) fail('Use valid issue and maturity dates.');
  if (value.maturityDate <= value.issueDate) fail('Maturity must be later than the issue date.');
  if (value.issueDate > DEMO_DATE) fail('Issue date cannot be later than the demo date.');
  if (typeof value.contact !== 'string' || value.contact.length > 160 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.contact)) fail('A valid institution contact email is required.');
  return { reference, bank, amount: value.amount, issueDate: value.issueDate, maturityDate: value.maturityDate, contact: value.contact.trim() };
}

export function currentFields(deposit: Deposit): Fields { return deposit.versions[deposit.versions.length - 1].fields; }

function lastFieldChange(deposit: Deposit, field: FieldKey): number {
  let changed = deposit.versions[0].number;
  for (let i = 1; i < deposit.versions.length; i++) if (deposit.versions[i].fields[field] !== deposit.versions[i - 1].fields[field]) changed = deposit.versions[i].number;
  return changed;
}

export function evidenceRows(deposit: Deposit): { field: FieldKey; submitted: string | number; confirmed: string | number | null; state: 'match' | 'mismatch' | 'missing' | 'stale' }[] {
  const fields = currentFields(deposit);
  return MATERIAL_FIELDS.map(field => {
    const all = deposit.evidence.filter(e => e.fields[field] !== undefined).sort((a, b) => b.receivedAt.localeCompare(a.receivedAt) || deposit.evidence.indexOf(b) - deposit.evidence.indexOf(a));
    // Bank and reference identify the instrument; evidence for an old instrument cannot support any of its successor's facts.
    const lastChange = Math.max(lastFieldChange(deposit, field), lastFieldChange(deposit, 'reference'), lastFieldChange(deposit, 'bank'));
    const relevant = all.find(e => e.version >= lastChange && e.version <= deposit.versions[deposit.versions.length - 1].number);
    const evidence = relevant || all[0];
    if (!evidence) return { field, submitted: fields[field], confirmed: null, state: 'missing' };
    const age = REFERENCE_DATE - Date.parse(evidence.receivedAt);
    if (!relevant || !Number.isFinite(age) || age > 30 * DAY || age < -DAY) return { field, submitted: fields[field], confirmed: evidence.fields[field]!, state: 'stale' };
    return { field, submitted: fields[field], confirmed: evidence.fields[field]!, state: evidence.fields[field] === fields[field] ? 'match' : 'mismatch' };
  });
}

function hasCurrentDocument(deposit: Deposit): boolean {
  const materialVersion = Math.max(...MATERIAL_FIELDS.map(field => lastFieldChange(deposit, field)));
  return deposit.documents.some(doc => doc.version >= materialVersion && doc.version <= deposit.versions[deposit.versions.length - 1].number);
}

export function releaseBlockers(deposit: Deposit): string[] {
  const blockers: string[] = [];
  if (!['verified', 'release_requested', 'release_approved'].includes(deposit.status)) blockers.push('The deposit must pass officer scrutiny.');
  if (evidenceRows(deposit).some(row => row.state !== 'match')) blockers.push('Current, matching bank evidence is required for every material field.');
  if (!hasCurrentDocument(deposit)) blockers.push('A receipt covering the current material details is required.');
  if (!deposit.release) blockers.push('The institution must submit a release request.');
  else {
    if (!deposit.release.checks.noDues) blockers.push('No-dues review is incomplete.');
    if (!deposit.release.checks.clearance) blockers.push('Regulatory clearance is incomplete.');
    if (!deposit.release.checks.originalReceipt) blockers.push('Original receipt/custody review is incomplete.');
    if (deposit.release.requestedBy === 'authority') blockers.push('The release approver must differ from the requester.');
  }
  return blockers;
}

export function projectWorkspace(workspace: Workspace, role: Role): Workspace {
  assertRole(role, ['institution', 'officer', 'authority']);
  const deposits = workspace.deposits.filter(d => role !== 'institution' || d.institutionId === INSTITUTION_ID);
  const ids = new Set(deposits.map(d => d.id));
  return structuredClone({ deposits, reminders: workspace.reminders.filter(r => ids.has(r.depositId)) });
}

function event(record: Deposit, actor: Role | 'system', action: string, detail: string, now: string) {
  record.timeline.push({ id: uid('event'), at: now, actor, action, detail });
}

function invalidateApproval(record: Deposit, reason: string, now: string) {
  if (record.status === 'release_approved') {
    record.status = 'release_requested';
    if (record.release) delete record.release.approvedAt;
    event(record, 'system', 'Release approval withdrawn', reason, now);
  }
}

export function applyAction(workspace: Workspace, action: Action, role: Role, now = defaultNow()): Workspace {
  assertRole(role, ['institution', 'officer', 'authority']);
  if (!action || typeof action !== 'object' || typeof action.type !== 'string') fail('A valid action is required.');
  if (!Number.isFinite(Date.parse(now))) fail('Invalid event timestamp.');
  const next = structuredClone(workspace);

  if (action.type === 'create') {
    assertRole(role, ['institution']);
    const fields = validateFields(action.fields);
    const purpose = noteText(action.purpose, 'Deposit purpose', 240);
    if (next.deposits.some(d => d.institutionId === INSTITUTION_ID && currentFields(d).bank.toLowerCase() === fields.bank.toLowerCase() && currentFields(d).reference.toLowerCase() === fields.reference.toLowerCase())) fail('This institution already has a deposit with that bank and reference.', 409);
    if (action.renewalOf) {
      const previous = next.deposits.find(d => d.id === action.renewalOf && d.institutionId === INSTITUTION_ID);
      if (!previous) throw new DomainError('The previous deposit is not available to this institution.', 404);
      if (previous.status === 'released') fail('A released deposit cannot be renewed.', 409);
      if (fields.maturityDate <= currentFields(previous).maturityDate) fail('A renewal must extend the previous maturity date.');
      if (next.deposits.some(d => d.renewalOf === previous.id && d.status !== 'released')) fail('A renewal is already linked to this deposit.', 409);
    }
    const record: Deposit = { id: uid('FDR'), institutionId: INSTITUTION_ID, institution: 'Sahyadri Institute of Technology', region: 'Western', purpose, status: 'submitted', versions: [{ number: 1, at: now, fields, note: 'Initial submission' }], evidence: [], documents: [], timeline: [], ...(action.renewalOf ? { renewalOf: action.renewalOf } : {}) };
    event(record, role, action.renewalOf ? 'Renewal submitted' : 'Deposit submitted', action.renewalOf ? `Linked to ${action.renewalOf}. Previous record retained; continuity is not assumed.` : 'Version 1 recorded. Supporting receipt and bank confirmation are pending.', now);
    next.deposits.unshift(record);
    return next;
  }

  if (action.type === 'run_reminders') {
    assertRole(role, ['officer']);
    for (const record of next.deposits) {
      if (record.status === 'released') continue;
      // A linked renewal does not establish legal continuity or effective coverage by itself.
      const linkedRenewal = next.deposits.find(d => d.renewalOf === record.id && d.status !== 'released');
      const days = Math.ceil((Date.parse(currentFields(record).maturityDate) - Date.parse(DEMO_DATE)) / DAY);
      const bucket = days < 0 ? 'past_maturity' : days <= 7 ? '7_days' : days <= 30 ? '30_days' : days <= 60 ? '60_days' : null;
      if (!bucket) continue;
      const id = `reminder-${record.id}-${bucket}-${DEMO_DATE}`;
      if (next.reminders.some(r => r.id === id)) continue;
      const baseMessage = days < 0 ? `Maturity date passed ${Math.abs(days)} days ago. Confirm renewal or authorized release; coverage is not inferred.` : `Matures in ${days} days. Review renewal evidence and assigned actions.`;
      const message = linkedRenewal ? `${baseMessage} Linked renewal ${linkedRenewal.id} is ${linkedRenewal.status.replaceAll('_', ' ')}; continuity still requires review.` : baseMessage;
      next.reminders.push({ id, depositId: record.id, bucket, createdAt: now, message });
      event(record, 'system', 'Maturity reminder queued', message, now);
    }
    return next;
  }

  if (!('id' in action) || typeof action.id !== 'string') fail('Unknown action.');
  const record = next.deposits.find(d => d.id === action.id);
  if (!record || (role === 'institution' && record.institutionId !== INSTITUTION_ID)) fail('Deposit not found in this role’s scope.', 404);
  const deposit = record as Deposit;

  switch (action.type) {
    case 'edit': {
      assertRole(role, ['institution']);
      assertStatus(deposit, ['submitted', 'correction_requested', 'verified']);
      const fields = validateFields(action.fields);
      const note = noteText(action.note, 'Revision note');
      const before = currentFields(deposit);
      const changed = (Object.keys(fields) as FieldKey[]).filter(key => fields[key] !== before[key]);
      if (!changed.length) fail('No field changes were supplied.');
      if (next.deposits.some(d => d.id !== deposit.id && d.institutionId === deposit.institutionId && currentFields(d).bank.toLowerCase() === fields.bank.toLowerCase() && currentFields(d).reference.toLowerCase() === fields.reference.toLowerCase())) fail('This institution already has that bank and FDR reference.', 409);
      const material = changed.some(key => MATERIAL_FIELDS.includes(key));
      deposit.versions.push({ number: deposit.versions[deposit.versions.length - 1].number + 1, at: now, fields, note });
      if (material || deposit.status === 'correction_requested') deposit.status = 'submitted';
      delete deposit.correction;
      event(deposit, role, 'Revision submitted', `Changed ${changed.join(', ')}. ${material ? 'Affected facts and the receipt require renewed review.' : 'Existing financial evidence is retained.'} ${note}`, now);
      break;
    }
    case 'bank_check': {
      assertRole(role, ['officer']);
      assertStatus(deposit, ['submitted', 'correction_requested', 'verified', 'release_requested', 'release_approved']);
      if (!['match', 'mismatch', 'delayed'].includes(action.scenario)) fail('Unknown bank simulation scenario.');
      if (action.scenario === 'delayed' && deposit.versions.length < 2) fail('Create a revision before simulating a delayed response.');
      const version = action.scenario === 'delayed' ? deposit.versions[deposit.versions.length - 2] : deposit.versions[deposit.versions.length - 1];
      const fields: Partial<Fields> = Object.fromEntries(MATERIAL_FIELDS.map(key => [key, version.fields[key]]));
      if (action.scenario === 'mismatch') fields.amount = Number(fields.amount) > 50_000 ? Number(fields.amount) - 50_000 : Number(fields.amount) + 1;
      deposit.evidence.push({ id: uid('evidence'), version: version.number, receivedAt: now, fields, simulated: true });
      const mismatches = evidenceRows(deposit).some(row => row.state !== 'match');
      if (mismatches) {
        invalidateApproval(deposit, 'Bank comparison no longer supports all current facts.', now);
        if (deposit.status === 'verified') deposit.status = 'submitted';
      }
      event(deposit, role, 'Simulated bank response received', `Synthetic ${action.scenario} response for version ${version.number}. This does not authenticate a real bank instrument.`, now);
      break;
    }
    case 'request_correction': {
      assertRole(role, ['officer']);
      assertStatus(deposit, ['submitted', 'verified', 'correction_requested']);
      deposit.correction = noteText(action.note, 'Correction request');
      deposit.status = 'correction_requested';
      event(deposit, role, 'Correction requested', deposit.correction, now);
      break;
    }
    case 'verify': {
      assertRole(role, ['officer']);
      assertStatus(deposit, ['submitted', 'correction_requested']);
      if (evidenceRows(deposit).some(row => row.state !== 'match')) fail('All material fields need current, matching bank evidence before verification.', 409);
      if (!hasCurrentDocument(deposit)) fail('Upload a supporting receipt covering the latest material revision before verification.', 409);
      deposit.status = 'verified'; delete deposit.correction;
      event(deposit, role, 'Scrutiny completed', 'Officer accepted the document and matching simulated bank evidence. Demo verification only.', now);
      if (deposit.renewalOf) {
        const previous = next.deposits.find(d => d.id === deposit.renewalOf);
        if (previous) event(previous, 'system', 'Linked renewal accepted', `${deposit.id} passed scrutiny. The original record remains preserved; legal coverage requires applicable bank terms.`, now);
      }
      break;
    }
    case 'request_release': {
      assertRole(role, ['institution']); assertStatus(deposit, ['verified']);
      if (evidenceRows(deposit).some(row => row.state !== 'match') || !hasCurrentDocument(deposit)) fail('Current evidence and a reviewed receipt are required before requesting release.', 409);
      const reason = noteText(action.reason, 'Release reason');
      deposit.release = { reason, requestedBy: role, requestedAt: now, checks: { noDues: false, clearance: false, originalReceipt: false } };
      deposit.status = 'release_requested';
      event(deposit, role, 'Release requested', reason, now);
      break;
    }
    case 'set_release_check': {
      assertRole(role, ['officer']); assertStatus(deposit, ['release_requested', 'release_approved']);
      if (!deposit.release) fail('There is no release request.', 409);
      if (!['noDues', 'clearance', 'originalReceipt'].includes(action.check) || typeof action.value !== 'boolean') fail('Invalid release checklist update.');
      if (deposit.release!.checks[action.check] === action.value) fail('The checklist item already has that value.', 409);
      deposit.release!.checks[action.check] = action.value;
      if (!action.value) invalidateApproval(deposit, 'A required clearance was withdrawn. Authority review must be repeated.', now);
      event(deposit, role, action.value ? 'Release check accepted' : 'Release check withdrawn', `${action.check}: ${action.value ? 'complete' : 'incomplete'}. Demonstration policy; supporting external clearance is not integrated.`, now);
      break;
    }
    case 'approve_release': {
      assertRole(role, ['authority']); assertStatus(deposit, ['release_requested']);
      const blockers = releaseBlockers(deposit);
      if (blockers.length) fail(blockers.join(' '), 409);
      deposit.status = 'release_approved'; deposit.release!.approvedAt = now;
      event(deposit, role, 'Release approved', 'Authority approved the request after prerequisite checks. No funds have moved.', now);
      break;
    }
    case 'complete_release': {
      assertRole(role, ['officer']); assertStatus(deposit, ['release_approved']);
      const blockers = releaseBlockers(deposit);
      if (blockers.length) fail(blockers.join(' '), 409);
      deposit.status = 'released'; deposit.release!.completedAt = now;
      event(deposit, role, 'Release completion recorded', 'Simulated completion recorded separately from approval. No payment or bank instruction was executed.', now);
      break;
    }
    case 'add_document': {
      assertRole(role, ['institution']); assertStatus(deposit, ['submitted', 'correction_requested', 'verified']);
      const doc = action.document;
      if (!doc || typeof doc.id !== 'string' || !doc.id || typeof doc.name !== 'string' || !doc.name || doc.name.length > 240 || !['application/pdf', 'image/png', 'image/jpeg', 'text/plain'].includes(doc.type) || !Number.isInteger(doc.size) || doc.size <= 0 || doc.size > 5 * 1024 * 1024 || doc.version !== deposit.versions[deposit.versions.length - 1].number || !Number.isFinite(Date.parse(doc.uploadedAt))) fail('Invalid document metadata. Upload PDF, PNG, JPEG or TXT up to 5 MB for the current version.');
      if (deposit.documents.some(d => d.id === doc.id)) fail('This document is already attached.', 409);
      deposit.documents.push(structuredClone(doc));
      event(deposit, role, 'Supporting receipt attached', `${doc.name} attached to version ${doc.version}.`, now);
      break;
    }
    default: fail('Unknown action.');
  }
  return next;
}

export function seedWorkspace(): Workspace {
  const records: { id: string; institutionId: string; institution: string; region: string; amount: number; maturityDate: string; status: Status; bank: string; reference: string; evidence: 'match' | 'mismatch' | 'none' | 'stale' }[] = [
    { id: 'FDR-2026-001', institutionId: INSTITUTION_ID, institution: 'Sahyadri Institute of Technology', region: 'Western', amount: 2500000, maturityDate: '2026-11-03', status: 'verified', bank: 'Demo National Bank', reference: 'DNB-26-004182', evidence: 'match' },
    { id: 'FDR-2026-002', institutionId: INSTITUTION_ID, institution: 'Sahyadri Institute of Technology', region: 'Western', amount: 1500000, maturityDate: '2027-06-30', status: 'correction_requested', bank: 'Demo Cooperative Bank', reference: 'DCB-26-007215', evidence: 'mismatch' },
    { id: 'FDR-2026-003', institutionId: 'inst-002', institution: 'Kaveri College of Engineering', region: 'Southern', amount: 4000000, maturityDate: '2026-11-19', status: 'submitted', bank: 'Demo National Bank', reference: 'DNB-26-008391', evidence: 'none' },
    { id: 'FDR-2026-004', institutionId: INSTITUTION_ID, institution: 'Sahyadri Institute of Technology', region: 'Western', amount: 1000000, maturityDate: '2027-03-15', status: 'release_requested', bank: 'Demo Union Bank', reference: 'DUB-25-002910', evidence: 'match' },
    { id: 'FDR-2026-005', institutionId: 'inst-003', institution: 'Aravali Polytechnic', region: 'Northern', amount: 2000000, maturityDate: '2026-10-22', status: 'submitted', bank: 'Demo Cooperative Bank', reference: 'DCB-25-001703', evidence: 'stale' },
    { id: 'FDR-2026-006', institutionId: 'inst-004', institution: 'Utkal Institute of Technology', region: 'Eastern', amount: 3000000, maturityDate: '2027-09-10', status: 'verified', bank: 'Demo Union Bank', reference: 'DUB-26-006022', evidence: 'match' },
    { id: 'FDR-2026-007', institutionId: 'inst-002', institution: 'Kaveri College of Engineering', region: 'Southern', amount: 1500000, maturityDate: '2026-12-10', status: 'release_requested', bank: 'Demo National Bank', reference: 'DNB-25-002063', evidence: 'match' },
  ];
  const deposits: Deposit[] = records.map((item, i) => {
    const fields: Fields = { reference: item.reference, bank: item.bank, amount: item.amount, issueDate: '2025-10-01', maturityDate: item.maturityDate, contact: `finance${i + 1}@institution.example` };
    const at = `2026-10-${String(15 + i).padStart(2, '0')}T09:00:00.000Z`;
    const record: Deposit = { id: item.id, institutionId: item.institutionId, institution: item.institution, region: item.region, purpose: i === 3 ? 'Course closure — security deposit release' : 'Institution approval — security deposit', status: item.status, versions: [{ number: 1, at, fields, note: 'Synthetic demo submission' }], evidence: [], documents: [{ id: `seed-doc-${i + 1}`, name: `${item.reference}-sample-receipt.txt`, size: 480, type: 'text/plain', uploadedAt: at, version: 1 }], timeline: [{ id: `seed-event-${i + 1}-1`, at, actor: 'institution', action: 'Deposit submitted', detail: 'Synthetic institution record entered for the SIH prototype.' }] };
    if (item.evidence !== 'none') {
      const bankFields: Partial<Fields> = Object.fromEntries(MATERIAL_FIELDS.map(key => [key, fields[key]]));
      if (item.evidence === 'mismatch') bankFields.amount = item.amount - 50000;
      record.evidence.push({ id: `seed-evidence-${i + 1}`, version: 1, receivedAt: item.evidence === 'stale' ? '2026-09-01T10:00:00.000Z' : at.replace('09:', '10:'), fields: bankFields, simulated: true });
      record.timeline.push({ id: `seed-event-${i + 1}-2`, at: at.replace('09:', '10:'), actor: 'officer', action: 'Simulated bank response received', detail: 'Demonstration evidence only. No live bank connection.' });
    }
    if (item.status === 'verified' || item.status === 'release_requested') record.timeline.push({ id: `seed-event-${i + 1}-3`, at: at.replace('09:', '11:'), actor: 'officer', action: 'Scrutiny completed', detail: 'Synthetic receipt and matching evidence reviewed by demo officer.' });
    if (item.status === 'correction_requested') {
      record.correction = 'The receipt shows ₹15,00,000 but the simulated bank response confirms ₹14,50,000. Reconcile the amount and attach a corrected receipt.';
      record.timeline.push({ id: `seed-event-${i + 1}-3`, at: at.replace('09:', '11:'), actor: 'officer', action: 'Correction requested', detail: record.correction });
    }
    if (item.status === 'release_requested') {
      record.release = { reason: i === 3 ? 'Approved course closure. Request release after documented clearances.' : 'Security deposit replacement and authorized release review.', requestedBy: 'institution', requestedAt: at.replace('09:', '12:'), checks: { noDues: true, clearance: i === 3, originalReceipt: i === 3 } };
      record.timeline.push({ id: `seed-event-${i + 1}-4`, at: at.replace('09:', '12:'), actor: 'institution', action: 'Release requested', detail: record.release.reason });
      record.timeline.push({ id: `seed-event-${i + 1}-5`, at: at.replace('09:', '13:'), actor: 'officer', action: 'Release checklist reviewed', detail: i === 3 ? 'All three demonstration checks complete. Authority approval pending.' : 'No-dues check complete; remaining clearances pending.' });
    }
    return record;
  });
  return { deposits, reminders: [] };
}
