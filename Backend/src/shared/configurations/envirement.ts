export const enviroment = {
  PORT: Number(process.env.PORT),
  SALT_ROUNDS: Number(process.env.SALT_ROUNDS),
  URL: 'http://localhost:',
  URL_REDIS: String(process.env.URL_REDIS),
  SECRET_JWT: String(process.env.SECRET_JWT)
}
