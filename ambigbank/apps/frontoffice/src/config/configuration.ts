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
      transfers: {
        url: process.env.TRANSFERS_URL,
      },
      users: {
        url: process.env.USERS_URL,
      },
    },
    jwt: {
      secret: process.env.JWT_SECRET,
    },
  };
};
