/* eslint-disable @typescript-eslint/no-empty-interface */
import { Decimal } from '@prisma/client';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as vitest from 'vitest';
interface CustomMatchers<R = unknown> {
  toBeDecimal(n: number | Decimal): R;
}

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
