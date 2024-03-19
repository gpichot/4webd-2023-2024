export default () => {
  return {
    port: parseInt(process.env.PORT, 10) || 3003,
    services: {
      transfers: {
        events: {
          initiatedQueue: process.env.TRANSFERS_INITIATED_QUEUE,
          acknowledgedQueue: process.env.TRANSFERS_ACKNOWLEDGED_QUEUE,
        },
      },
    },
    queue: {
      url: process.env.QUEUE_URL,
    },
  };
};
