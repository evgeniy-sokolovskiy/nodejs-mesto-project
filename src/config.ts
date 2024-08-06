const { PORT = 3000 } = process.env;
const { MONGO_URI = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const { JWT_TOKEN = 'some-secret-key' } = process.env;

export default {
  PORT,
  MONGO_URI,
  JWT_TOKEN,
};
