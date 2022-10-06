import { Directories } from '../types/index';

const BASE_URL = process.env.NUXT_ENV_API_URL;

export async function getDirectories(): Promise<Array<Directories>> {
    const res = await fetch(`${BASE_URL}/directory/`);
    if (!res.ok) {
        throw new Error(res.statusText)
    }

    const documents: Array<Directories> = await res.json();
    return documents;
}

export async function createDirectories(directory: Directories): Promise<void> {
    const res = await fetch(`${BASE_URL}/directory/`, {
        method: 'POST',
        body: JSON.stringify(directory)
    });
    if (!res.ok) {
        throw new Error(res.statusText)
    }

    return;
};