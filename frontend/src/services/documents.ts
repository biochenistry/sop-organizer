import { Document } from '../types/index';

const BASE_URL = process.env.NUXT_ENV_API_URL;

export async function getDocuments(): Promise<Array<Document>> {
    const res = await fetch(`${BASE_URL}/documents/`);
    if (!res.ok) {
        throw new Error(res.statusText)
    }

    const documents: Array<Document> = await res.json();
    return documents;
}

export async function uploadDocument(data: any): Promise<Array<Document>> {
    const res = await fetch(`${BASE_URL}/documents/upload`, {
        method: 'POST',
        body: data
    });
    if (!res.ok) {
        throw new Error(res.statusText)
    }

    const documents: Array<Document> = await res.json();
    return documents;
}