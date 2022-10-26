import { User } from '../types/index';

const BASE_URL = process.env.NUXT_ENV_API_URL;

export async function getUser(id): Promise<User> {
  let res = await fetch(`${BASE_URL}/users/${id}`);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const user: User = await res.json();
  return user;
}
