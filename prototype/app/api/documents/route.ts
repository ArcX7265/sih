import { env } from 'cloudflare:workers';
import { context, readWorkspace, commit, json, failure, HttpError, limitedBody } from '@/lib/server';
import { INSTITUTION_ID } from '@/lib/contracts';
export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  let uploadedKey: string | undefined;
  try {
    const {owner,role} = await context(request);
    if (role !== 'institution') throw new HttpError('Use the institution persona to submit supporting evidence.',403);
    if (!env.BUCKET) throw new HttpError('Document storage is unavailable.',503);
    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > 5*1024*1024 + 12000) throw new HttpError('Files must be 5 MB or smaller.',413);
    const body = await limitedBody(request,5*1024*1024+12000);
    const form = await new Response(body as BodyInit,{headers:{'content-type':request.headers.get('content-type')||''}}).formData();
    const file = form.get('file');
    const id = String(form.get('depositId') || '');
    const revision = Number(form.get('revision'));
    if (!(file instanceof File) || !file.size || file.size > 5*1024*1024) throw new HttpError('Choose a PDF, PNG or JPEG file up to 5 MB.');
    const allowed = ['application/pdf','image/png','image/jpeg'];
    if (!allowed.includes(file.type)) throw new HttpError('Only PDF, PNG and JPEG documents are supported.');
    const {workspace} = await readWorkspace(owner);
    const deposit = workspace.deposits.find(d=>d.id===id && d.institutionId===INSTITUTION_ID);
    if (!deposit) throw new HttpError('Deposit is outside your institution scope.',403);
    const bytes = new Uint8Array(await file.arrayBuffer());
    const valid = file.type==='application/pdf' ? new TextDecoder().decode(bytes.slice(0,5))==='%PDF-' : file.type==='image/png' ? bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71&&bytes[4]===13&&bytes[5]===10&&bytes[6]===26&&bytes[7]===10 : bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
    if (!valid) throw new HttpError('File content does not match its document type.');
    const docId = crypto.randomUUID();
    const name = file.name.replace(/[\x00-\x1f\x7f/\\]/g,'_').slice(0,150) || 'document';
    uploadedKey = `${owner}/${docId}`;
    await env.BUCKET.put(uploadedKey,bytes,{httpMetadata:{contentType:file.type}});
    const result = await commit(owner,role,revision,{type:'add_document',id,document:{id:docId,name,size:file.size,type:file.type,uploadedAt:new Date().toISOString(),version:deposit.versions.at(-1)!.number}});
    uploadedKey = undefined;
    return json(result);
  } catch(error) {
    if(uploadedKey) await env.BUCKET?.delete(uploadedKey).catch(()=>{});
    return failure(error);
  }
}
