export default () => {
  return {
    port: parseInt(process.env.PORT, 10) || 3004,
    jwt: {
      secret: process.env.JWT_SECRET,
    },
  };
};
