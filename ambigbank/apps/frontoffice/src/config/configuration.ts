export default () => {
  return {
    port: parseInt(process.env.PORT, 10) || 3000,
    services: {
      notifications: {
        url: process.env.NOTIFICATIONS_URL,
      },
    },
  };
};
