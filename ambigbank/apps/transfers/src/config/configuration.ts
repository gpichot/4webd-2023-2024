export default () => {
  return {
    port: parseInt(process.env.PORT, 10) || 3005,
    services: { bankAccounts: { url: process.env.BANK_ACCOUNTS_URL } },
  };
};
