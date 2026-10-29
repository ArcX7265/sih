'use client';

import { DEMO_DATE, type Action, type DocumentRef, type Role, type Snapshot, type Workspace } from './contracts';
import { applyAction, DomainError, projectWorkspace, seedWorkspace } from './domain';

// This adapter deliberately runs in the browser. It provides no real identity,
// authorization boundary, bank connection, or shared institutional database.
type SavedDemo = { revision: number; workspace: Workspace };
const DATABASE = 'nidhisetu-frontend-demo-v1';
const STATE = 'workspace';
const FILES = 'documents';
let connection: Promise<IDBDatabase> | undefined;

function openDatabase(): Promise<IDBDatabase> {
  if (!connection) {
    connection = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DATABASE, 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore(STATE);
        request.result.createObjectStore(FILES);
      };
      request.onerror = () => reject(new Error('Browser storage is unavailable. Allow site storage to use this demo.'));
      request.onblocked = () => reject(new Error('Close other NidhiSetu tabs and try again.'));
      request.onsuccess = () => {
        request.result.onversionchange = () => { request.result.close(); connection = undefined; };
        resolve(request.result);
      };
    }).catch(error => { connection = undefined; throw error; });
  }
  return connection;
}

// Read, revision check, state update, and any file write share one IndexedDB
// transaction so two tabs cannot silently overwrite each other's changes.
async function transaction<T>(operation: (saved: SavedDemo, tx: IDBTransaction) => T): Promise<T> {
  const database = await openDatabase();
  return new Promise<T>((resolve, reject) => {
    const tx = database.transaction([STATE, FILES], 'readwrite');
    let result: T;
    let failure: unknown;
    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(failure || new Error('Could not save the demo. Browser storage may be full.'));
    tx.onabort = () => reject(failure || new Error('The demo change could not be saved.'));
    const request = tx.objectStore(STATE).get('current');
    request.onsuccess = () => {
      try {
        const saved: SavedDemo = request.result || { revision: 0, workspace: seedWorkspace() };
        result = operation(saved, tx);
        tx.objectStore(STATE).put(saved, 'current');
      } catch (error) {
        failure = error;
        tx.abort();
      }
    };
  });
}

function roleFrom(headers?: HeadersInit): Role {
  const role = new Headers(headers).get('x-demo-role') || 'officer';
  if (!['institution', 'officer', 'authority'].includes(role)) throw new DomainError('Unknown demo persona.', 403);
  return role as Role;
}

function snapshot(saved: SavedDemo, role: Role): Snapshot {
  return { ...projectWorkspace(saved.workspace, role), revision: saved.revision, role, demoDate: DEMO_DATE };
}

function commit(saved: SavedDemo, revision: number, action: Action, role: Role): Snapshot {
  if (!Number.isInteger(revision) || revision !== saved.revision) {
    throw new DomainError('This workspace changed in another tab. Refresh and try again.', 409);
  }
  saved.workspace = applyAction(saved.workspace, action, role);
  saved.revision++;
  return snapshot(saved, role);
}

async function validateFile(file: File): Promise<void> {
  if (!file.size || file.size > 5 * 1024 * 1024) throw new DomainError('Choose a non-empty file up to 5 MB.');
  const bytes = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  const valid = (file.type === 'application/pdf' && new TextDecoder().decode(bytes.slice(0, 5)) === '%PDF-')
    || (file.type === 'image/png' && [137, 80, 78, 71, 13, 10, 26, 10].every((value, i) => bytes[i] === value))
    || (file.type === 'image/jpeg' && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255);
  if (!valid) throw new DomainError('Choose a PDF, PNG or JPEG with matching file contents.');
}

/** Response-compatible local adapter; it makes no HTTP/API requests. */
export async function workspaceRequest(url: string, init: RequestInit = {}): Promise<Response> {
  try {
    const role = roleFrom(init.headers);
    if (url === '/api/workspace' && (!init.method || init.method === 'GET')) {
      return Response.json(await transaction(saved => snapshot(saved, role)));
    }
    if (url === '/api/workspace' && init.method === 'POST') {
      const body = JSON.parse(String(init.body)) as { revision: number; action: Action };
      if (!body.action || body.action.type === 'add_document') throw new DomainError('Choose a valid workflow action.');
      return Response.json(await transaction(saved => commit(saved, body.revision, body.action, role)));
    }
    if (url === '/api/documents' && init.method === 'POST' && init.body instanceof FormData) {
      const file = init.body.get('file');
      if (!(file instanceof File)) throw new DomainError('Choose a supporting document.');
      await validateFile(file);
      const id = String(init.body.get('depositId'));
      const revision = Number(init.body.get('revision'));
      const result = await transaction((saved, tx) => {
        const deposit = projectWorkspace(saved.workspace, role).deposits.find(record => record.id === id);
        if (!deposit) throw new DomainError('This record is unavailable to this demo persona.', 404);
        const document: DocumentRef = { id: `doc-${crypto.randomUUID()}`, name: file.name, size: file.size, type: file.type, uploadedAt: `${DEMO_DATE}T12:00:00.000Z`, version: deposit.versions.at(-1)!.number };
        const result = commit(saved, revision, { type: 'add_document', id, document }, role);
        tx.objectStore(FILES).put(file, document.id);
        return result;
      });
      return Response.json(result);
    }
    return Response.json({ error: 'Unknown local demo operation.' }, { status: 404 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Could not open the browser demo.' }, { status: error instanceof DomainError ? error.status : 500 });
  }
}

export async function downloadDemoDocument(id: string, role: Role): Promise<void> {
  const database = await openDatabase();
  const file = await new Promise<{ blob: Blob; name: string }>((resolve, reject) => {
    const tx = database.transaction([STATE, FILES], 'readonly');
    const request = tx.objectStore(STATE).get('current');
    tx.onerror = () => reject(new Error('Could not read this demo document.'));
    request.onsuccess = () => {
      try {
        const saved = request.result as SavedDemo | undefined;
        const deposit = saved && projectWorkspace(saved.workspace, role).deposits.find(record => record.documents.some(document => document.id === id));
        const document = deposit?.documents.find(document => document.id === id);
        if (!document) throw new DomainError('This document is unavailable to this demo persona.', 404);
        if (id.startsWith('seed-doc-')) {
          const blob = new Blob([`SYNTHETIC NIDHISETU DEMO RECEIPT\nRecord: ${deposit!.id}\nReference: ${deposit!.versions[0].fields.reference}\nDemonstration only. No real financial instrument or bank confirmation.\n`], { type: 'text/plain' });
          resolve({ blob, name: document.name });
        } else {
          const content = tx.objectStore(FILES).get(id);
          content.onsuccess = () => content.result instanceof Blob ? resolve({ blob: content.result, name: document.name }) : reject(new Error('This file is no longer in this browser. Attach it again.'));
        }
      } catch (error) { reject(error); }
    };
  });
  const url = URL.createObjectURL(file.blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = file.name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
