import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import env from '../config/env.js';
import Admin from '../models/Admin.js';

/**
 * Seeds or updates the initial admin account using environment variables.
 * Never hardcodes production credentials.
 *
 * Usage:
 *   npm run seed:admin
 */
const seedAdmin = async () => {
  const { name, email, password } = env.adminSeed;

  if (!env.mongoUri) {
    console.error('[Seed] MONGO_URI is required in environment variables.');
    process.exit(1);
  }

  if (!email || !password) {
    console.error(
      '[Seed] ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD must be set in environment variables.'
    );
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('[Seed] ADMIN_SEED_PASSWORD must be at least 8 characters.');
    process.exit(1);
  }

  try {
    await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 5000 });
    const passwordHash = await bcrypt.hash(password, 12);

    const existing = await Admin.findOne({ email: email.toLowerCase().trim() });

    if (existing) {
      existing.name = name || existing.name;
      existing.passwordHash = passwordHash;
      await existing.save();
      console.log(`[Seed] Updated existing admin account: ${existing.email}`);
    } else {
      const created = await Admin.create({
        name: name || 'Ronak',
        email: email.toLowerCase().trim(),
        passwordHash,
      });
      console.log(`[Seed] Created initial admin account: ${created.email}`);
    }
  } catch (error) {
    console.error(`[Seed] Failed to seed admin: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();
