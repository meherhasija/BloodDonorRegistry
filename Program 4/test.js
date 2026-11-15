/**
 * Automated Test Suite for Program 4 - Blood Donor Registry System
 * Tests all requirements: Express server, CRUD, validation, JWT auth, bcrypt, centralized error handling.
 */

const { server } = require('./server');

const BASE_URL = 'http://127.0.0.1:4000';

// ANSI color helpers for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ${colors.green}✔ PASS:${colors.reset} ${testName}`);
    passedTests++;
  } else {
    console.log(`  ${colors.red}✖ FAIL:${colors.reset} ${testName} ${details ? `(${details})` : ''}`);
    failedTests++;
  }
}

async function runTests() {
  console.log(`\n${colors.cyan}${colors.bold}====================================================${colors.reset}`);
  console.log(`${colors.cyan}${colors.bold}  STARTING AUTOMATED TESTS FOR PROGRAM 4 (CO5)${colors.reset}`);
  console.log(`${colors.cyan}${colors.bold}====================================================${colors.reset}\n`);

  try {
    // -----------------------------------------------------------------
    // TEST 1: Server Root Endpoint
    // -----------------------------------------------------------------
    console.log(`${colors.yellow}1. Testing Server & Root Endpoint...${colors.reset}`);
    const rootRes = await fetch(`${BASE_URL}/`);
    const rootData = await rootRes.json();
    assert(rootRes.status === 200, 'Root status is 200 OK');
    assert(rootData.status === 'Server is running', 'Server status confirms running');
    assert(rootData.project === 'Blood Donor Registry System', 'Correct project title returned');

    // -----------------------------------------------------------------
    // TEST 2: GET /api/donors (Retrieve All Donors)
    // -----------------------------------------------------------------
    console.log(`\n${colors.yellow}2. Testing GET /api/donors...${colors.reset}`);
    const allDonorsRes = await fetch(`${BASE_URL}/api/donors`);
    const allDonorsData = await allDonorsRes.json();
    assert(allDonorsRes.status === 200, 'GET /api/donors returns status 200');
    assert(allDonorsData.success === true, 'Response contains success: true');
    assert(Array.isArray(allDonorsData.data), 'Response data is an array of donors');
    assert(allDonorsData.count >= 1, `Donors retrieved count: ${allDonorsData.count}`);

    // -----------------------------------------------------------------
    // TEST 3: POST /api/donors with Input Validation
    // -----------------------------------------------------------------
    console.log(`\n${colors.yellow}3. Testing POST /api/donors (Input Validation)...${colors.reset}`);
    // Subtest: Missing fields
    const invalidDonor1 = { fullName: 'Incomplete Donor' };
    const invalidRes1 = await fetch(`${BASE_URL}/api/donors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidDonor1)
    });
    const invalidData1 = await invalidRes1.json();
    assert(invalidRes1.status === 400, 'Rejects payload with missing fields (HTTP 400)');
    assert(invalidData1.success === false, 'Validation failure returns success: false');
    assert(Array.isArray(invalidData1.errors), 'Returns list of specific validation errors');

    // Subtest: Invalid age (< 18) and bad phone number
    const invalidDonor2 = {
      fullName: 'Too Young',
      age: 15,
      gender: 'Male',
      bloodGroup: 'O+',
      phoneNumber: '12345',
      city: 'Delhi',
      availabilityStatus: 'Available'
    };
    const invalidRes2 = await fetch(`${BASE_URL}/api/donors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidDonor2)
    });
    const invalidData2 = await invalidRes2.json();
    assert(invalidRes2.status === 400, 'Rejects donor with age < 18 (HTTP 400)');
    assert(
      invalidData2.errors.some((e) => e.includes('Age') || e.includes('18')),
      'Returns meaningful error message for age validation'
    );
    assert(
      invalidData2.errors.some((e) => e.includes('Phone') || e.includes('10-digit')),
      'Returns meaningful error message for phone number validation'
    );

    // Subtest: Valid donor registration
    const validDonor = {
      fullName: 'Suresh Kumar',
      age: 30,
      gender: 'Male',
      bloodGroup: 'AB+',
      phoneNumber: '9123456789',
      city: 'Hyderabad',
      availabilityStatus: 'Available'
    };
    const createRes = await fetch(`${BASE_URL}/api/donors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validDonor)
    });
    const createData = await createRes.json();
    assert(createRes.status === 201, 'POST /api/donors returns 201 Created for valid input');
    assert(createData.success === true, 'Response indicates success: true');
    assert(createData.data.fullName === 'Suresh Kumar', 'Created donor has matching full name');
    assert(createData.data.id !== undefined, `New donor received assigned ID: ${createData.data.id}`);

    const createdDonorId = createData.data.id;

    // -----------------------------------------------------------------
    // TEST 4: GET /api/donors/:id (Retrieve Single Donor)
    // -----------------------------------------------------------------
    console.log(`\n${colors.yellow}4. Testing GET /api/donors/:id...${colors.reset}`);
    const getSingleRes = await fetch(`${BASE_URL}/api/donors/${createdDonorId}`);
    const getSingleData = await getSingleRes.json();
    assert(getSingleRes.status === 200, 'GET /api/donors/:id returns 200 OK');
    assert(getSingleData.data.id === createdDonorId, 'Returned donor has requested ID');

    // Subtest: Non-existent ID
    const get404Res = await fetch(`${BASE_URL}/api/donors/999999`);
    assert(get404Res.status === 404, 'Returns 404 Not Found for non-existent donor ID');

    // -----------------------------------------------------------------
    // TEST 5: PUT /api/donors/:id (Update Donor)
    // -----------------------------------------------------------------
    console.log(`\n${colors.yellow}5. Testing PUT /api/donors/:id...${colors.reset}`);
    const updatePayload = {
      fullName: 'Suresh Kumar Updated',
      age: 31,
      gender: 'Male',
      bloodGroup: 'AB+',
      phoneNumber: '9123456789',
      city: 'Secunderabad',
      availabilityStatus: 'Unavailable'
    };
    const updateRes = await fetch(`${BASE_URL}/api/donors/${createdDonorId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload)
    });
    const updateData = await updateRes.json();
    assert(updateRes.status === 200, 'PUT /api/donors/:id returns 200 OK');
    assert(updateData.data.city === 'Secunderabad', 'Donor city updated successfully');
    assert(updateData.data.availabilityStatus === 'Unavailable', 'Donor availability updated');

    // -----------------------------------------------------------------
    // TEST 6: DELETE /api/donors/:id (Delete Donor)
    // -----------------------------------------------------------------
    console.log(`\n${colors.yellow}6. Testing DELETE /api/donors/:id...${colors.reset}`);
    const deleteRes = await fetch(`${BASE_URL}/api/donors/${createdDonorId}`, {
      method: 'DELETE'
    });
    const deleteData = await deleteRes.json();
    assert(deleteRes.status === 200, 'DELETE /api/donors/:id returns 200 OK');
    assert(deleteData.success === true, 'Delete response indicates success');
    assert(deleteData.data.id === createdDonorId, 'Deleted donor ID matches');

    // Verify it is actually gone
    const checkDeletedRes = await fetch(`${BASE_URL}/api/donors/${createdDonorId}`);
    assert(checkDeletedRes.status === 404, 'Deleted donor is no longer found (404)');

    // -----------------------------------------------------------------
    // TEST 7: POST /api/auth/register (User Registration & bcrypt)
    // -----------------------------------------------------------------
    console.log(`\n${colors.yellow}7. Testing POST /api/auth/register (bcrypt hashing)...${colors.reset}`);
    const testUsername = `user_${Date.now()}`;
    const registerPayload = {
      username: testUsername,
      password: 'mypassword123',
      email: `${testUsername}@example.com`,
      fullName: 'Test Blood Volunteer'
    };

    const registerRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerPayload)
    });
    const registerData = await registerRes.json();
    assert(registerRes.status === 201, 'POST /api/auth/register returns 201 Created');
    assert(registerData.success === true, 'User registration succeeds');
    assert(registerData.data.password === undefined, 'Plain-text password is NOT returned in response');
    assert(registerData.data.username === testUsername, 'Registered username matches');

    // Test duplicate registration rejection
    const dupRegisterRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerPayload)
    });
    assert(dupRegisterRes.status === 409, 'Rejects duplicate username/email with 409 Conflict');

    // -----------------------------------------------------------------
    // TEST 8: POST /api/auth/login (Credential Verification & JWT)
    // -----------------------------------------------------------------
    console.log(`\n${colors.yellow}8. Testing POST /api/auth/login (JWT generation)...${colors.reset}`);
    // Subtest: Wrong password
    const wrongLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: testUsername, password: 'wrongpassword' })
    });
    assert(wrongLoginRes.status === 401, 'Rejects incorrect password with 401 Unauthorized');

    // Subtest: Correct password
    const validLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: testUsername, password: 'mypassword123' })
    });
    const validLoginData = await validLoginRes.json();
    assert(validLoginRes.status === 200, 'Valid credentials return 200 OK');
    assert(typeof validLoginData.token === 'string' && validLoginData.token.length > 20, 'JWT token returned successfully');
    const authToken = validLoginData.token;

    // -----------------------------------------------------------------
    // TEST 9: GET /api/protected (JWT Authentication Middleware)
    // -----------------------------------------------------------------
    console.log(`\n${colors.yellow}9. Testing GET /api/protected (JWT Auth Middleware)...${colors.reset}`);
    // Subtest: Without token
    const noTokenRes = await fetch(`${BASE_URL}/api/protected`);
    assert(noTokenRes.status === 401, 'Rejects request with missing token (HTTP 401)');

    // Subtest: With invalid token
    const invalidTokenRes = await fetch(`${BASE_URL}/api/protected`, {
      headers: { Authorization: 'Bearer this.is.an.invalid.token' }
    });
    assert(invalidTokenRes.status === 401, 'Rejects request with invalid token (HTTP 401)');

    // Subtest: With valid token
    const validProtectedRes = await fetch(`${BASE_URL}/api/protected`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const validProtectedData = await validProtectedRes.json();
    assert(validProtectedRes.status === 200, 'Allows access with valid JWT token (HTTP 200)');
    assert(validProtectedData.success === true, 'Protected route returns success: true');
    assert(validProtectedData.authenticatedUser.username === testUsername, 'Authenticated user payload decoded properly');

    // -----------------------------------------------------------------
    // TEST 10: Centralized Error Handling & 404 Route Handling
    // -----------------------------------------------------------------
    console.log(`\n${colors.yellow}10. Testing Centralized Error Handling & 404 Handler...${colors.reset}`);
    const notFoundRes = await fetch(`${BASE_URL}/api/undefined-endpoint`);
    const notFoundData = await notFoundRes.json();
    assert(notFoundRes.status === 404, 'Catch-all handler returns 404 for unknown route');
    assert(notFoundData.success === false, '404 response has success: false');

    // Subtest: Malformed JSON sent to server
    const malformedRes = await fetch(`${BASE_URL}/api/donors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{ this is not valid json }'
    });
    const malformedData = await malformedRes.json();
    assert(malformedRes.status === 400, 'Centralized error handler catches malformed JSON with 400 Bad Request');
    assert(malformedData.message.includes('JSON'), 'Error message specifically mentions JSON payload issue');

    // -----------------------------------------------------------------
    // SUMMARY
    // -----------------------------------------------------------------
    console.log(`\n${colors.cyan}${colors.bold}====================================================${colors.reset}`);
    console.log(`${colors.cyan}${colors.bold}  TEST RESULTS SUMMARY${colors.reset}`);
    console.log(`${colors.cyan}${colors.bold}====================================================${colors.reset}`);
    console.log(`Total Passed: ${colors.green}${colors.bold}${passedTests}${colors.reset}`);
    console.log(`Total Failed: ${failedTests > 0 ? colors.red : colors.green}${colors.bold}${failedTests}${colors.reset}`);

    if (failedTests === 0) {
      console.log(`\n${colors.green}${colors.bold}✔ ALL TESTS PASSED SUCCESSFULLY! (CO5 Fully Satisfied)${colors.reset}\n`);
    } else {
      console.log(`\n${colors.red}${colors.bold}✖ SOME TESTS FAILED. PLEASE REVIEW LOGS ABOVE.${colors.reset}\n`);
    }
  } catch (error) {
    console.error('Fatal test error:', error);
  } finally {
    // Close the server cleanly so the process exits
    server.close(() => {
      console.log('Test server closed.');
      process.exit(failedTests === 0 ? 0 : 1);
    });
  }
}

// Run test suite
runTests();
