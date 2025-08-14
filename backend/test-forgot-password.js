const axios = require('axios');

const BASE_URL = 'http://localhost:5001';

async function testForgotPassword() {
  try {
    console.log('🧪 Testing Forgot Password Functionality...\n');

    // Test 1: Forgot password with valid email (using seeded user)
    console.log('1. Testing forgot password with valid email...');
    const forgotResponse = await axios.post(`${BASE_URL}/api/auth/forgot-password`, {
      email: 'john@samplestore.com'
    });
    
    console.log('✅ Forgot password response:', forgotResponse.data);
    
    if (forgotResponse.data.data && forgotResponse.data.data.resetToken) {
      console.log('📧 Reset token received:', forgotResponse.data.data.resetToken);
      console.log('🔗 Reset URL:', forgotResponse.data.data.resetUrl);
      
      // Test 2: Reset password with the token
      console.log('\n2. Testing password reset with token...');
      const resetResponse = await axios.post(`${BASE_URL}/api/auth/reset-password/${forgotResponse.data.data.resetToken}`, {
        newPassword: 'newpassword123'
      });
      
      console.log('✅ Password reset response:', resetResponse.data);
    }

    // Test 3: Try to use the same token again (should fail)
    console.log('\n3. Testing reuse of expired token...');
    try {
      const reuseResponse = await axios.post(`${BASE_URL}/api/auth/reset-password/${forgotResponse.data.data.resetToken}`, {
        newPassword: 'anotherpassword123'
      });
      console.log('❌ Token reuse should have failed but succeeded:', reuseResponse.data);
    } catch (error) {
      console.log('✅ Token reuse correctly failed:', error.response.data);
    }

    // Test 4: Forgot password with invalid email
    console.log('\n4. Testing forgot password with invalid email...');
    try {
      const invalidResponse = await axios.post(`${BASE_URL}/api/auth/forgot-password`, {
        email: 'nonexistent@example.com'
      });
      console.log('❌ Invalid email should have failed but succeeded:', invalidResponse.data);
    } catch (error) {
      console.log('✅ Invalid email correctly failed:', error.response.data);
    }

    console.log('\n🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response ? error.response.data : error.message);
  }
}

// Run the test
testForgotPassword();
