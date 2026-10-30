import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { applyAction, projectWorkspace, seedWorkspace } from '@/lib/domain';
import { DEMO_DATE, type Action, type Role, type Snapshot, type Workspace } from '@/lib/contracts';

export class HttpError extends Error { constructor(message: string, public status = 400) { super(message); } }
export async function limitedBody(request: Request, limit: number): Promise<Uint8Array> {
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const {value,done} = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) { await reader.cancel(); throw new HttpError('Request exceeds the allowed size.',413); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const result = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { result.set(chunk,offset); offset += chunk.byteLength; }
  return result;
}
export async function context(request: Request) {
  const user = await getChatGPTUser();
  if (!user) throw new HttpError('Sign in to open your private demo workspace.', 401);
  const role = request.headers.get('x-demo-role') || new URL(request.url).searchParams.get('role') || 'officer';
  if (!['institution', 'officer', 'authority'].includes(role)) throw new HttpError('Unknown demo persona.');
  if (request.method !== 'GET') {
    const origin = request.headers.get('origin');
    if (!origin || origin !== new URL(request.url).origin) throw new HttpError('This action must come from this portal.', 403);
  }
  if (!env.DB) throw new HttpError('Database is not configured.', 503);
  return { owner: user.userId, role: role as Role, db: env.DB };
}
export async function readWorkspace(owner: string) {
  const db = env.DB!;
  let row = await db.prepare('SELECT payload, revision FROM workspaces WHERE owner_id = ?').bind(owner).first<{payload:string;revision:number}>();
  if (!row) {
    const state = seedWorkspace();
    await db.prepare('INSERT OR IGNORE INTO workspaces (owner_id, payload, revision, updated_at) VALUES (?, ?, 0, ?)').bind(owner, JSON.stringify(state), new Date().toISOString()).run();
    row = await db.prepare('SELECT payload, revision FROM workspaces WHERE owner_id = ?').bind(owner).first<{payload:string;revision:number}>();
  }
  if (!row) throw new HttpError('Workspace could not be loaded.', 503);
  return { workspace: JSON.parse(row.payload) as Workspace, revision: row.revision };
}
export function snapshot(workspace: Workspace, revision: number, role: Role): Snapshot {
  return { ...projectWorkspace(workspace, role), revision, role, demoDate: DEMO_DATE };
}
export async function commit(owner: string, role: Role, revision: number, action: Action) {
  if (!Number.isInteger(revision) || revision < 0) throw new HttpError('A valid workspace revision is required.');
  const current = await readWorkspace(owner);
  if (revision !== current.revision) throw new HttpError('This workspace changed in another tab. Refresh and try again.', 409);
  const next = applyAction(current.workspace, action, role);
  const result = await env.DB!.prepare('UPDATE workspaces SET payload = ?, revision = revision + 1, updated_at = ? WHERE owner_id = ? AND revision = ?')
    .bind(JSON.stringify(next), new Date().toISOString(), owner, revision).run();
  if (result.meta.changes !== 1) throw new HttpError('Another update just arrived. Refresh and try again.', 409);
  return snapshot(next, revision + 1, role);
}
export function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { 'Cache-Control':'private, no-store', 'X-Content-Type-Options':'nosniff' } });
}
export function failure(error: unknown) {
  const e = error as { status?: number; message?: string };
  const status = e.status && e.status >= 400 && e.status < 600 ? e.status : 500;
  if (status === 500) console.error('NidhiSetu request failed', error);
  return json({error: status === 500 ? 'The request could not be completed. Please retry.' : e.message}, status);
}
