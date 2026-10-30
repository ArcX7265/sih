import { env } from 'cloudflare:workers';
import { context, readWorkspace, failure, HttpError } from '@/lib/server';
import { projectWorkspace, currentFields } from '@/lib/domain';
export const dynamic = 'force-dynamic';
export async function GET(request:Request, {params}:{params:Promise<{id:string}>}) {
  try {
    const {owner,role} = await context(request);
    const {id} = await params;
    const {workspace} = await readWorkspace(owner);
    const deposit = projectWorkspace(workspace,role).deposits.find(d=>d.documents.some(doc=>doc.id===id));
    const doc = deposit?.documents.find(d=>d.id===id);
    if(!deposit || !doc) throw new HttpError('Document not found in your permitted records.',404);
    const headers = new Headers({'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; sandbox"});
    if(id.startsWith('seed-doc-')) {
      const fields = deposit.versions.find(v=>v.number===doc.version)?.fields || currentFields(deposit);
      headers.set('Content-Type','text/plain; charset=utf-8');
      headers.set('Content-Disposition',`attachment; filename="${id}.txt"`);
      return new Response(['NIDHISETU - SYNTHETIC DEMO RECEIPT','Not issued by a bank. No monetary value.',`Institution: ${deposit.institution}`,`Record: ${deposit.id} / version ${doc.version}`,...Object.entries(fields).map(([k,v])=>`${k}: ${v}`),'This document is generated from fictional seeded data.'].join('\n'),{headers});
    }
    const object = await env.BUCKET?.get(`${owner}/${id}`);
    if(!object) throw new HttpError('Document could not be retrieved.',404);
    headers.set('Content-Type',doc.type);
    headers.set('Content-Disposition',`attachment; filename="document"; filename*=UTF-8''${encodeURIComponent(doc.name)}`);
    return new Response(object.body,{headers});
  } catch(error) {return failure(error);}
}
