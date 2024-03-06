import dotenv from 'dotenv';
import { Prisma } from '@prisma/client';
import { expect } from 'vitest';

dotenv.config({ path: '.env.test' });

expect.extend({
  toBeDecimal(received: Prisma.Decimal, expected: Prisma.Decimal) {
    const pass = received.equals(expected);
    if (!pass) {
      return {
        message: () => `expected ${received} to be ${expected}`,
        pass: false,
      };
    }
    return {
      message: () => `expected ${received} not to be ${expected}`,
      pass: true,
    };
  },
});
