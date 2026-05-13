
import fetch from 'node-fetch'; // If node version < 18, but we have type module so we can use fetch if available or node-fetch

const API_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🚀 Starting API Tests...\n');

  try {
    // 1. Check Recipes
    console.log('1. Testing GET /api/recipes...');
    const resRecipes = await fetch(`${API_URL}/recipes`);
    if (resRecipes.ok) {
      const data = await resRecipes.json();
      console.log(`✅ Success! Found ${data.data?.length || 0} recipes.\n`);
    } else {
      console.error('❌ Failed to fetch recipes\n');
    }

    // 2. Test Login (with known user from seed or created before)
    console.log('2. Testing POST /api/auth/login...');
    const loginResp = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    if (loginResp.ok) {
      const loginData = await loginResp.json();
      console.log('✅ Login Successful! Token received.\n');
      const token = loginData.token;

      // 3. Test Protected Route
      console.log('3. Testing POST /api/recipes (Protected)...');
      const createResp = await fetch(`${API_URL}/recipes`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: 'Test Recipe',
          description: 'A test recipe from API check',
          user_id: loginData.user.id,
          category_country: 'World'
        })
      });

      if (createResp.status === 201 || createResp.ok) {
        console.log('✅ Protected Route Test Passed! Recipe created.\n');
      } else {
        const error = await createResp.json();
        console.error(`❌ Protected Route Test Failed: ${error.error}\n`);
      }
    } else {
      console.warn('⚠️ Login failed (likely test user not in DB). Registration test required first.\n');
    }

  } catch (error) {
    console.error('💥 API Test Error:', error.message);
  }
}

testAPI();
