export default () => ({
  jwtSecret: process.env.JWT_SECRET,
  userToken: process.env.USER_TOKEN,
  rateLimitIP: process.env.RATE_LIMIT_IP,
  rateLimitToken: process.env.RATE_LIMIT_TOKEN,
  mongoUrl: process.env.MONGO_URL,
  saltRot: process.env.SALT_NUM,
  redisUrl: process.env.REDIS_URL,
});
