// test.js - Automated API & EventEmitter Test Suite
const http = require('http');
const server = require('./server');
const fs = require('fs');
const path = require('path');

const TEST_PORT = 5055;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;
const DONORS_FILE = path.join(__dirname, 'donors.json');

// Backup original donors.json
const originalData = fs.readFileSync(DONORS_FILE, 'utf-8');

async function runTests() {
    return new Promise((resolve, reject) => {
        server.listen(TEST_PORT, '127.0.0.1', async () => {
            console.log(`\n>>> Test Server started on ${BASE_URL} <<<\n`);
            try {
                let passed = 0;
                let failed = 0;

                function assert(condition, message) {
                    if (condition) {
                        console.log(`[PASS] ${message}`);
                        passed++;
                    } else {
                        console.error(`[FAIL] ${message}`);
                        failed++;
                    }
                }

                // 1. GET /
                console.log('\n--- 1. Testing GET / (Welcome) ---');
                let res = await fetch(`${BASE_URL}/`);
                let json = await res.json();
                assert(res.status === 200, 'GET / returns 200');
                assert(json.success === true, 'GET / success is true');

                // 2. GET /donors
                console.log('\n--- 2. Testing GET /donors (Retrieve all) ---');
                res = await fetch(`${BASE_URL}/donors`);
                json = await res.json();
                assert(res.status === 200, 'GET /donors returns 200');
                assert(Array.isArray(json.data) && json.data.length >= 3, 'GET /donors returns array with initial donors');

                // 3. GET /donors/101
                console.log('\n--- 3. Testing GET /donors/101 (Retrieve by ID) ---');
                res = await fetch(`${BASE_URL}/donors/101`);
                json = await res.json();
                assert(res.status === 200, 'GET /donors/101 returns 200');
                assert(json.data.id === '101', 'Retrieved donor ID is 101');
                assert(json.data.fullName === 'Aarav Sharma', 'Retrieved donor name is Aarav Sharma');

                // 4. POST /donors (Add new donor)
                console.log('\n--- 4. Testing POST /donors (Add Donor & Trigger EventEmitter) ---');
                const newDonorPayload = {
                    fullName: 'Sneha Kulkarni',
                    age: 26,
                    gender: 'Female',
                    bloodGroup: 'B+',
                    phoneNumber: '9876543219',
                    city: 'Nashik',
                    availabilityStatus: 'Available'
                };
                res = await fetch(`${BASE_URL}/donors`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newDonorPayload)
                });
                json = await res.json();
                assert(res.status === 201, 'POST /donors returns 201 Created');
                assert(json.data.fullName === 'Sneha Kulkarni', 'Created donor has matching name');
                assert(json.data.id !== undefined, `New donor assigned ID: ${json.data.id}`);
                const createdId = json.data.id;

                // 5. GET /donors/:id (Verify persistence)
                console.log(`\n--- 5. Testing GET /donors/${createdId} (Verify Persistence in donors.json) ---`);
                res = await fetch(`${BASE_URL}/donors/${createdId}`);
                json = await res.json();
                assert(res.status === 200, `GET /donors/${createdId} returns 200`);
                assert(json.data.city === 'Nashik', 'Verified donor city from file');

                // 6. PUT /donors/:id (Update donor)
                console.log(`\n--- 6. Testing PUT /donors/${createdId} (Update Donor & Trigger EventEmitter) ---`);
                const updatePayload = {
                    city: 'Pune',
                    availabilityStatus: 'Unavailable'
                };
                res = await fetch(`${BASE_URL}/donors/${createdId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatePayload)
                });
                json = await res.json();
                assert(res.status === 200, `PUT /donors/${createdId} returns 200`);
                assert(json.data.city === 'Pune', 'Updated city is Pune');
                assert(json.data.availabilityStatus === 'Unavailable', 'Updated status is Unavailable');

                // 7. DELETE /donors/:id (Delete donor)
                console.log(`\n--- 7. Testing DELETE /donors/${createdId} (Delete Donor & Trigger EventEmitter) ---`);
                res = await fetch(`${BASE_URL}/donors/${createdId}`, {
                    method: 'DELETE'
                });
                json = await res.json();
                assert(res.status === 200, `DELETE /donors/${createdId} returns 200`);
                assert(json.data.id === createdId, 'Deleted donor ID matches');

                // 8. GET /donors/:id (Verify 404 after deletion)
                console.log(`\n--- 8. Testing GET /donors/${createdId} (Verify 404 after delete) ---`);
                res = await fetch(`${BASE_URL}/donors/${createdId}`);
                json = await res.json();
                assert(res.status === 404, 'Deleted donor returns 404 Not Found');

                // 9. Validation Error: Invalid Age and Phone Number
                console.log('\n--- 9. Testing Validation Error Handling ---');
                const invalidPayload = {
                    fullName: 'X',
                    age: 15, // under 18
                    gender: 'InvalidGender',
                    bloodGroup: 'Z+', // invalid blood group
                    phoneNumber: '123', // invalid phone
                    city: 'Goa',
                    availabilityStatus: 'Maybe'
                };
                res = await fetch(`${BASE_URL}/donors`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(invalidPayload)
                });
                json = await res.json();
                assert(res.status === 400, 'Invalid donor payload returns 400 Bad Request');
                console.log(`Expected Validation Error Message: "${json.error}"`);

                // 10. Malformed JSON Body
                console.log('\n--- 10. Testing Malformed JSON Request Handling ---');
                res = await fetch(`${BASE_URL}/donors`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: '{ malformed json: missing quotes }'
                });
                json = await res.json();
                assert(res.status === 400, 'Malformed JSON returns 400 Bad Request');
                console.log(`Expected JSON Parse Error Message: "${json.error}"`);

                // 11. Non-existent Donor for PUT and DELETE
                console.log('\n--- 11. Testing Non-existent Donor (404) ---');
                res = await fetch(`${BASE_URL}/donors/9999`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ city: 'Delhi' })
                });
                json = await res.json();
                assert(res.status === 404, 'PUT /donors/9999 returns 404 Not Found');

                res = await fetch(`${BASE_URL}/donors/9999`, {
                    method: 'DELETE'
                });
                json = await res.json();
                assert(res.status === 404, 'DELETE /donors/9999 returns 404 Not Found');

                console.log('\n==================================================');
                console.log(`Test Results: ${passed} PASSED, ${failed} FAILED`);
                console.log('==================================================\n');

                if (failed === 0) {
                    resolve();
                } else {
                    reject(new Error(`${failed} tests failed.`));
                }
            } catch (err) {
                reject(err);
            } finally {
                // Restore original donors.json
                fs.writeFileSync(DONORS_FILE, originalData, 'utf-8');
                server.close();
            }
        });
    });
}

runTests().then(() => {
    console.log('All automated tests completed successfully!');
    process.exit(0);
}).catch((err) => {
    console.error('Test error:', err);
    process.exit(1);
});
