import { SOP } from '../types/index';

const BASE_URL = process.env.NUXT_ENV_API_URL;

export async function getSOPs(): Promise<Array<SOP>> {
    const res = await fetch(`${BASE_URL}/sops/?include_documents=true`);
    if (!res.ok) {
        throw new Error(res.statusText)
    }

    const documents: Array<SOP> = await res.json();
    return documents;
}

export async function createSOP(sop: SOP): Promise<void> {
    const res = await fetch(`${BASE_URL}/sops/`, {
        method: 'POST',
        body: JSON.stringify(sop)
    });
    if (!res.ok) {
        throw new Error(res.statusText)
    }

    return;
};
