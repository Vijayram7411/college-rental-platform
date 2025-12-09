#!/usr/bin/env node

/**
 * Script to manually run production database migration
 * This ensures the College model is removed and collegeName field is added
 */

import { execSync } from 'child_process';

console.log('🔄 Running production database migration...\n');

try {
  // Run Prisma migrate deploy with production DATABASE_URL
  console.log('📦 Applying pending migrations...');
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: {
      ...process.env,
      // DATABASE_URL should be set in environment or .env.production
    }
  });

  console.log('\n✅ Migration completed successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Verify the migration in your database');
  console.log('2. Test registration on the production site');
  console.log('3. Check that existing users can still log in');

} catch (error) {
  console.error('\n❌ Migration failed:', error.message);
  console.error('\n💡 Troubleshooting:');
  console.error('1. Ensure DATABASE_URL environment variable is set');
  console.error('2. Check database connection');
  console.error('3. Verify Prisma schema is correct');
  process.exit(1);
}
