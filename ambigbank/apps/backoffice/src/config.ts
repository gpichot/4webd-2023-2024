function coerceToNumber(str: string | undefined, defaultValue: number): number {
  const num = str ? parseInt(str, 10) : NaN;
  return isNaN(num) ? defaultValue : num;
}
// FIXME: retrieve this from env
const config = {
  port: coerceToNumber(process.env.PORT, 3001),
};

export default config;
