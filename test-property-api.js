import http from 'http';
import https from 'https';

// Helper function to make HTTP requests
function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(data);
    }
    req.end();
  });
}

async function testPropertyAPI() {
  try {
    console.log('Testing Property API...\n');

    // Step 1: Login
    console.log('1. Logging in...');
    const loginResponse = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, JSON.stringify({
      email: 'admin@rentzy.com',
      password: 'admin123'
    }));

    const loginData = JSON.parse(loginResponse.body);
    console.log('Login response:', loginData);

    if (!loginData.success) {
      console.log('Login failed!');
      return;
    }

    // Step 2: Verify OTP (we'll use a mock OTP for testing)
    console.log('\n2. Verifying OTP...');
    const otpResponse = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/verify-otp',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, JSON.stringify({
      otp: '199260', // Use the OTP from login response
      sessionId: loginData.sessionId
    }));

    const otpData = JSON.parse(otpResponse.body);
    console.log('OTP verification response:', otpData);

    if (!otpData.success) {
      console.log('OTP verification failed!');
      return;
    }

    // Extract session cookie
    const sessionCookie = otpResponse.headers['set-cookie'] ? 
      otpResponse.headers['set-cookie'][0] : null;
    
    if (!sessionCookie) {
      console.log('No session cookie found!');
      return;
    }

    console.log('Session cookie:', sessionCookie);

    // Step 3: Test property creation
    console.log('\n3. Creating property...');
    const propertyData = {
      propertyType: "residential",
      name: "Test Luxury Villa",
      address: "123 Test Drive",
      city: "Test City",
      state: "Test State",
      zipCode: "12345",
      description: "A test property for API validation",
      ownerName: "Test Owner",
      ownerEmail: "test@example.com",
      squareFootage: 3000,
      bedrooms: 4,
      bathrooms: 3,
      yearBuilt: 2020,
      totalTokens: 1000,
      tokenPrice: 500,
      tokenName: "TEST01",
      tokenSymbol: "TST",
      homeValueEstimate: 200000000,
      images: ["https://example.com/image1.jpg"],
      zoningPermitsShortTerm: true,
      allowsFractionalization: true,
      allowsRentziEquity: true,
      furnished: "yes",
      ownershipType: "full_owner",
      availableWeeksPerYear: 40,
      nightlyBaseRate: 500,
      cleaningFee: 100,
      minimumStay: 2,
      guestCapacity: 8,
      featuredAmenities: ["pool", "wifi"],
      checkInTime: "3:00 PM",
      checkOutTime: "11:00 AM",
      houseRules: "No smoking, no pets"
    };

    const propertyResponse = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/properties',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie
      }
    }, JSON.stringify(propertyData));

    const propertyResponseData = JSON.parse(propertyResponse.body);
    console.log('Property creation response:', propertyResponseData);

    // Step 4: Test property analytics
    console.log('\n4. Testing property analytics...');
    const analyticsResponse = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/properties/analytics',
      method: 'GET',
      headers: {
        'Cookie': sessionCookie
      }
    });

    const analyticsData = JSON.parse(analyticsResponse.body);
    console.log('Analytics response:', analyticsData);

    // Step 5: Test validation rules
    console.log('\n5. Testing validation rules...');
    const rulesResponse = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/properties/validation-rules',
      method: 'GET',
      headers: {
        'Cookie': sessionCookie
      }
    });

    const rulesData = JSON.parse(rulesResponse.body);
    console.log('Validation rules response:', rulesData);

    console.log('\n✓ All tests completed successfully!');

  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testPropertyAPI();