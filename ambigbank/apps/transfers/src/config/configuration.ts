export default () => {
  return {
    port: parseInt(process.env.PORT, 10) || 3005,
    jwt: {
      secret: process.env.JWT_SECRET,
    },
  };
};
