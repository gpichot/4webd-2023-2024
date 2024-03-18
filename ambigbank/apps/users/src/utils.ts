import crypto from 'crypto';

export async function createPasswordHash(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

export async function checkPasswordValid(password: string, hash: string) {
  const [salt, originalHash] = hash.split(':');
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);

      const ok = crypto.timingSafeEqual(
        Buffer.from(originalHash, 'hex'),
        derivedKey,
      );
      resolve(ok);
    });
  });
}
