import { Directory } from '../types/index';

const BASE_URL = process.env.NUXT_ENV_API_URL;

export async function getDirectories(): Promise<Array<any>> {
    const res = await fetch(`${BASE_URL}/directory/`);
    if (!res.ok) {
        throw new Error(res.statusText)
    }

    const directories: Array<any> = await res.json();
    return directories;
}

export async function createDirectories(directory: Directory): Promise<void> {
    const res = await fetch(`${BASE_URL}/directory/`, {
        method: 'POST',
        body: JSON.stringify(directory)
    });
    if (!res.ok) {
        throw new Error(res.statusText)
    }
    return;
};


export async function getSops(id: number): Promise<Array<any>> {
    const res = await fetch(`${BASE_URL}/directory/getSops/${id}`);
    if (!res.ok) {
        throw new Error(res.statusText)
    }

    const directories: Array<any> = await res.json();
    return directories;
}