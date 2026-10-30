import { context, readWorkspace, snapshot, commit, json, failure, HttpError, limitedBody } from '@/lib/server';
import type { Action } from '@/lib/contracts';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  try {
    const {owner,role} = await context(request);
    const {workspace,revision} = await readWorkspace(owner);
    return json(snapshot(workspace,revision,role));
  } catch (error) { return failure(error); }
}
export async function POST(request: Request) {
  try {
    const {owner,role} = await context(request);
    const raw = new TextDecoder().decode(await limitedBody(request,24000));
    let body: { revision: number; action: Action };
    try { body = JSON.parse(raw); } catch { throw new HttpError('Invalid request JSON.'); }
    if (!body || !body.action || typeof body.action !== 'object' || body.action.type === 'add_document') throw new HttpError('Choose a valid workflow action.');
    return json(await commit(owner,role,body.revision,body.action));
  } catch (error) { return failure(error); }
}
