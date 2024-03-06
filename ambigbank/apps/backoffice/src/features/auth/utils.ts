import * as bcrypt from 'bcrypt';

export async function createPasswordHash(password: string) {
  const hash = await bcrypt.hash(password, 10);
  return hash;
}

export async function checkPasswordValid(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}
