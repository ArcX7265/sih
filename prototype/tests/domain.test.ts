import test from 'node:test';
import assert from 'node:assert/strict';
import { applyAction, currentFields, DomainError, evidenceRows, projectWorkspace, releaseBlockers, seedWorkspace } from '../lib/domain.ts';
import type { Action, Deposit, Fields, Workspace } from '../lib/contracts.ts';

const get = (w: Workspace, id = 'FDR-2026-001'): Deposit => w.deposits.find(d => d.id === id)!;
const edit = (w: Workspace, change: Partial<Fields>, id = 'FDR-2026-001') => applyAction(w, { type: 'edit', id, fields: { ...currentFields(get(w, id)), ...change }, note: 'Corrected supporting details' }, 'institution');
const attach = (w: Workspace, id = 'FDR-2026-001') => applyAction(w, { type: 'add_document', id, document: { id: crypto.randomUUID(), name: 'updated-receipt.pdf', type: 'application/pdf', size: 250, uploadedAt: '2026-10-28T12:00:00Z', version: get(w, id).versions.at(-1)!.number } }, 'institution');
const error = (fn: () => unknown, status: number) => assert.throws(fn, e => e instanceof DomainError && e.status === status);

test('institution projection and writes are scoped and copied', () => {
  const w = seedWorkspace();
  const scoped = projectWorkspace(w, 'institution');
  assert.equal(scoped.deposits.length, 3);
  assert.ok(scoped.deposits.every(d => d.institutionId === 'inst-001'));
  scoped.deposits[0].institution = 'Mutated';
  assert.notEqual(w.deposits[0].institution, 'Mutated');
  error(() => applyAction(w, { type: 'edit', id: 'FDR-2026-003', fields: currentFields(get(w, 'FDR-2026-003')), note: 'Attempt to access other institution' }, 'institution'), 404);
  error(() => applyAction(w, { type: 'bank_check', id: 'FDR-2026-001', scenario: 'match' }, 'institution'), 403);
  error(() => applyAction(w, { type: 'approve_release', id: 'FDR-2026-004' }, 'officer'), 403);
});

test('material edit creates immutable version and field scoped stale evidence', () => {
  const w = seedWorkspace();
  const old = structuredClone(w);
  const next = edit(w, { amount: 2600000 });
  assert.deepEqual(w, old);
  assert.equal(get(next).versions.length, 2);
  assert.equal(get(next).versions[0].fields.amount, 2500000);
  assert.equal(get(next).status, 'submitted');
  assert.equal(evidenceRows(get(next)).find(r => r.field === 'amount')!.state, 'stale');
  assert.equal(evidenceRows(get(next)).find(r => r.field === 'maturityDate')!.state, 'match');
  error(() => applyAction(next, { type: 'verify', id: get(next).id }, 'officer'), 409);
});

test('contact-only changes retain financial evidence and document review', () => {
  let w = edit(seedWorkspace(), { contact: 'newfinance@institution.example' });
  assert.equal(get(w).status, 'verified');
  assert.ok(evidenceRows(get(w)).every(row => row.state === 'match'));
  w = applyAction(w, { type: 'request_release', id: get(w).id, reason: 'Authorized course closure review' }, 'institution');
  assert.equal(get(w).status, 'release_requested');
});

test('instrument identity changes invalidate all prior confirmation', () => {
  for (const change of [{ reference: 'NEW-REFERENCE-998' }, { bank: 'Another Demo Bank' }]) {
    const w = edit(seedWorkspace(), change);
    assert.ok(evidenceRows(get(w)).every(row => row.state === 'stale'));
  }
});

test('delayed response cannot confirm edited field or supersede current evidence', () => {
  let w = edit(seedWorkspace(), { amount: 2600000 });
  w = applyAction(w, { type: 'bank_check', id: get(w).id, scenario: 'delayed' }, 'officer');
  assert.equal(evidenceRows(get(w)).find(r => r.field === 'amount')!.state, 'stale');
  w = applyAction(w, { type: 'bank_check', id: get(w).id, scenario: 'match' }, 'officer');
  w = applyAction(w, { type: 'bank_check', id: get(w).id, scenario: 'delayed' }, 'officer', '2026-10-28T13:00:00Z');
  assert.ok(evidenceRows(get(w)).every(row => row.state === 'match'));
  assert.equal(get(w).evidence.length, 4);
});

test('changed-back field needs confirmation of its latest version', () => {
  let w = edit(seedWorkspace(), { amount: 2600000 });
  w = edit(w, { amount: 2500000 });
  assert.equal(evidenceRows(get(w)).find(r => r.field === 'amount')!.state, 'stale');
});

test('correction workflow needs receipt for material revision before acceptance', () => {
  const id = 'FDR-2026-002';
  let w = seedWorkspace();
  error(() => applyAction(w, { type: 'verify', id }, 'officer'), 409);
  w = edit(w, { amount: 1450000 }, id);
  w = applyAction(w, { type: 'bank_check', id, scenario: 'match' }, 'officer');
  error(() => applyAction(w, { type: 'verify', id }, 'officer'), 409);
  w = attach(w, id);
  w = applyAction(w, { type: 'verify', id }, 'officer');
  assert.equal(get(w, id).status, 'verified');
  assert.equal(get(w, id).versions.length, 2);
  assert.equal(get(w, id).correction, undefined);
});

test('release is blocked by missing clearances; approval and completion separate', () => {
  let w = seedWorkspace();
  error(() => applyAction(w, { type: 'approve_release', id: 'FDR-2026-007' }, 'authority'), 409);
  const id = 'FDR-2026-004';
  assert.deepEqual(releaseBlockers(get(w, id)), []);
  error(() => applyAction(w, { type: 'complete_release', id }, 'officer'), 409);
  w = applyAction(w, { type: 'approve_release', id }, 'authority');
  assert.equal(get(w, id).status, 'release_approved');
  assert.equal(get(w, id).release!.completedAt, undefined);
  w = applyAction(w, { type: 'complete_release', id }, 'officer');
  assert.equal(get(w, id).status, 'released');
  assert.ok(get(w, id).release!.completedAt);
  error(() => applyAction(w, { type: 'complete_release', id }, 'officer'), 409);
});

test('withdrawn prerequisite invalidates approval and prevents completion', () => {
  const id = 'FDR-2026-004';
  let w = applyAction(seedWorkspace(), { type: 'approve_release', id }, 'authority');
  w = applyAction(w, { type: 'set_release_check', id, check: 'clearance', value: false }, 'officer');
  assert.equal(get(w, id).status, 'release_requested');
  assert.equal(get(w, id).release!.approvedAt, undefined);
  error(() => applyAction(w, { type: 'complete_release', id }, 'officer'), 409);
  error(() => applyAction(w, { type: 'approve_release', id }, 'authority'), 409);
});

test('new bank discrepancy invalidates approval', () => {
  const id = 'FDR-2026-004';
  let w = applyAction(seedWorkspace(), { type: 'approve_release', id }, 'authority');
  w = applyAction(w, { type: 'bank_check', id, scenario: 'mismatch' }, 'officer');
  assert.equal(get(w, id).status, 'release_requested');
  assert.ok(releaseBlockers(get(w, id)).length);
});

test('stale evidence is not matching evidence', () => {
  const record = get(seedWorkspace(), 'FDR-2026-005');
  assert.ok(evidenceRows(record).every(row => row.state === 'stale'));
});

test('reminders deduplicate and maturity never marks an instrument released', () => {
  const once = applyAction(seedWorkspace(), { type: 'run_reminders' }, 'officer');
  const twice = applyAction(once, { type: 'run_reminders' }, 'officer');
  assert.equal(once.reminders.length, 4);
  assert.deepEqual(once, twice);
  assert.equal(get(twice, 'FDR-2026-005').status, 'submitted');
  assert.ok(twice.reminders.find(r => r.depositId === 'FDR-2026-005')!.message.includes('coverage is not inferred'));
});

test('renewal preserves previous record and pending renewal cannot suppress reminders', () => {
  const before = seedWorkspace();
  let w = applyAction(before, { type: 'create', fields: { ...currentFields(get(before)), reference: 'DNB-NEW-271', maturityDate: '2027-11-03' }, purpose: 'Renewal of security deposit', renewalOf: 'FDR-2026-001' }, 'institution');
  const renewal = w.deposits[0];
  assert.equal(renewal.renewalOf, 'FDR-2026-001');
  assert.deepEqual(get(w), get(before));
  w = applyAction(w, { type: 'run_reminders' }, 'officer');
  assert.ok(w.reminders.some(r => r.depositId === 'FDR-2026-001'));
  error(() => applyAction(w, { type: 'create', fields: { ...currentFields(get(before)), reference: 'DNB-NEW-272', maturityDate: '2027-12-03' }, purpose: 'Duplicate renewal', renewalOf: 'FDR-2026-001' }, 'institution'), 409);
});

test('accepted linked renewal does not imply legal continuity or suppress old maturity review', () => {
  const before = seedWorkspace();
  let w = applyAction(before, { type: 'create', fields: { ...currentFields(get(before)), reference: 'DNB-NEW-333', maturityDate: '2027-11-03' }, purpose: 'Renewal security deposit', renewalOf: 'FDR-2026-001' }, 'institution');
  const id = w.deposits[0].id;
  w = attach(w, id);
  w = applyAction(w, { type: 'bank_check', id, scenario: 'match' }, 'officer');
  w = applyAction(w, { type: 'verify', id }, 'officer');
  w = applyAction(w, { type: 'run_reminders' }, 'officer');
  const reminder = w.reminders.find(r => r.depositId === 'FDR-2026-001');
  assert.ok(reminder);
  assert.match(reminder.message, /verified; continuity still requires review/);
  assert.equal(get(w).status, 'verified');
});

test('runtime field validation rejects malformed amounts, dates, emails and action payloads', () => {
  const w = seedWorkspace();
  for (const change of [{ amount: -1 }, { amount: NaN }, { amount: 12.123 }, { maturityDate: '2026-02-30' }, { issueDate: '2028-01-01' }, { contact: 'not-an-email' }]) error(() => edit(w, change), 400);
  error(() => applyAction(w, { type: 'unknown' } as unknown as Action, 'officer'), 400);
  error(() => applyAction(w, { type: 'bank_check', id: 'FDR-2026-001', scenario: 'evil' } as unknown as Action, 'officer'), 400);
});
