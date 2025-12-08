// Test email sending with Resend
import { Resend } from 'resend';
import { readFileSync } from 'fs';

// Load environment variables from .env file
const envFile = readFileSync('.env', 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let value = match[2].trim();
    // Remove quotes if present
    value = value.replace(/^["']|["']$/g, '');
    envVars[key] = value;
  }
});

process.env = { ...process.env, ...envVars };

const apiKey = process.env.RESEND_API_KEY;

console.log('\n🔍 Testing Resend Email Configuration\n');
console.log('='.repeat(50));

// Check if API key exists
if (!apiKey) {
  console.log('❌ RESEND_API_KEY not found in .env file');
  console.log('💡 Add your Resend API key to .env:');
  console.log('   RESEND_API_KEY="re_your_key_here"');
  process.exit(1);
}

// Check if API key format is correct
if (!apiKey.startsWith('re_')) {
  console.log('⚠️  API key format looks wrong');
  console.log('   Expected: re_...');
  console.log('   Got:', apiKey.substring(0, 10) + '...');
  process.exit(1);
}

console.log('✅ API key found:', apiKey.substring(0, 10) + '...');
console.log('');

// Initialize Resend
const resend = new Resend(apiKey);

// Test email
const testEmail = 'delivered@resend.dev'; // Resend's test email

console.log('📧 Sending test email to:', testEmail);
console.log('');

try {
  const { data, error } = await resend.emails.send({
    from: 'College Rentals <onboarding@resend.dev>',
    to: testEmail,
    subject: 'Test Email from College Rentals',
    html: `
      <h1>✅ Email Test Successful!</h1>
      <p>If you're seeing this, your Resend integration is working correctly.</p>
      <p><strong>Next steps:</strong></p>
      <ul>
        <li>Place a test order on your platform</li>
        <li>Check if emails are sent to real email addresses</li>
        <li>Check spam folder if you don't see the email</li>
      </ul>
    `,
  });

  if (error) {
    console.log('❌ Email send failed!');
    console.log('Error:', error);
    process.exit(1);
  }

  console.log('✅ Email sent successfully!');
  console.log('');
  console.log('Response data:', data);
  console.log('');
  console.log('='.repeat(50));
  console.log('✅ Resend is configured correctly!');
  console.log('');
  console.log('Next: Place an order on your platform to test real emails');
  
} catch (error) {
  console.log('❌ Unexpected error:', error.message);
  process.exit(1);
}
