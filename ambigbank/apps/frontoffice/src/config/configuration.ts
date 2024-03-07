export default () => {
  return {
    port: parseInt(process.env.PORT, 10) || 3000,
    services: {
      notifications: {
        url: process.env.NOTIFICATIONS_URL,
      },
      bankAccounts: {
        url: process.env.BANK_ACCOUNTS_URL,
      },
    },
  };
};
