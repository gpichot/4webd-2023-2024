export default () => {
  return {
    port: parseInt(process.env.PORT, 10) || 3005,
    services: {
      bankAccounts: {
        url: process.env.BANK_ACCOUNTS_URL,
      },
      notifications: {
        url: process.env.NOTIFICATIONS_URL,
        queue: process.env.NOTIFICATIONS_QUEUE,
      },
      transfers: {
        events: {
          initiatedQueue: process.env.TRANSFERS_INITIATED_QUEUE,
          acknowledgedQueue: process.env.TRANSFERS_ACKNOWLEDGED_QUEUE,
        },
      },
      users: { url: process.env.USERS_URL },
    },
  };
};
