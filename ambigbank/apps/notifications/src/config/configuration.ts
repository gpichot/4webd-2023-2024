export default () => {
  return {
    port: parseInt(process.env.PORT, 10) || 3002,
    services: {
      queue: {
        url: process.env.QUEUE_URL,
        queue: process.env.NOTIFICATIONS_QUEUE,
      },
    },
  };
};
