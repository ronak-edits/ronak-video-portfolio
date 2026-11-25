import dotenv from 'dotenv';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

if (isProduction) {
  const requiredVars = ['MONGO_URI', 'JWT_SECRET', 'CLIENT_URL'];
  const missing = requiredVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required production environment variables: ${missing.join(', ')}`
    );
  }
}

const env = {
  nodeEnv,
  isProduction,
  port: Number(process.env.PORT) || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGO_URI || '',
  jwt: {
    secret: process.env.JWT_SECRET || '',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  cookie: {
    name: process.env.COOKIE_NAME || 'ronak_auth_token',
    options: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    },
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
  adminSeed: {
    name: process.env.ADMIN_SEED_NAME || 'Ronak',
    email: process.env.ADMIN_SEED_EMAIL || '',
    password: process.env.ADMIN_SEED_PASSWORD || '',
  },
};

export default env;
