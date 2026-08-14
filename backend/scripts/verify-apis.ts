/**
 * Script untuk memverifikasi endpoint API publik dan fungsionalitas honeypot.
 * Dijalankan dengan `npx tsx scripts/verify-apis.ts`
 */
import 'dotenv/config';

const BASE_URL = `http://localhost:${process.env.PORT || 4000}/api`;

async function testEndpoint(name: string, endpoint: string) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`);
    if (res.ok) {
      console.log(`✅ [PASS] ${name} (${endpoint}) -> Status: ${res.status}`);
      return true;
    } else {
      console.error(`❌ [FAIL] ${name} (${endpoint}) -> Status: ${res.status}`);
      return false;
    }
  } catch (error: any) {
    console.error(`❌ [FAIL] ${name} (${endpoint}) -> Error: ${error.message}`);
    return false;
  }
}

async function testHoneypot() {
  try {
    const res = await fetch(`${BASE_URL}/contact/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderName: 'Spam Bot',
        senderEmail: 'bot@spam.com',
        message: 'Buy cheap watches!',
        website: 'http://spam.com' // Trigger honeypot
      })
    });
    
    if (res.status === 201) {
      console.log(`✅ [PASS] Honeypot Test -> Status: 201 (Silently Ignored)`);
      return true;
    } else {
      console.error(`❌ [FAIL] Honeypot Test -> Status: ${res.status}`);
      return false;
    }
  } catch (error: any) {
    console.error(`❌ [FAIL] Honeypot Test -> Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('─── Menjalankan Verifikasi API (Fase 2) ───');
  
  let allPass = true;

  // Test GET Publik
  allPass &&= await testEndpoint('Events List', '/events');
  allPass &&= await testEndpoint('Talents List', '/talents');
  allPass &&= await testEndpoint('Communities List', '/communities');
  allPass &&= await testEndpoint('Programs List', '/programs');
  allPass &&= await testEndpoint('Gallery List', '/gallery');
  allPass &&= await testEndpoint('FAQ List', '/faqs');
  allPass &&= await testEndpoint('Policy List', '/policies');
  allPass &&= await testEndpoint('Safety List', '/safety');
  allPass &&= await testEndpoint('Contact Channels List', '/contact/channels');
  allPass &&= await testEndpoint('About Content', '/about/content');
  allPass &&= await testEndpoint('About Team', '/about/team');

  // Test Honeypot
  allPass &&= await testHoneypot();

  if (allPass) {
    console.log('\n✅ SEMUA TEST BERHASIL!');
    process.exit(0);
  } else {
    console.error('\n❌ ADA TEST YANG GAGAL!');
    process.exit(1);
  }
}

runTests();
