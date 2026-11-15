/**
 * Integration Test Suite for Blood Donor Registry REST API & MongoDB Integration
 * Program 5 - Full Stack Development Practical Assignment (CO6)
 *
 * Verifies:
 * 1. MongoDB Mongoose Connection
 * 2. Schema Validations (Age limits, Blood Group enums, Phone numbers)
 * 3. REST API CRUD Endpoints (POST, GET, GET by ID, PUT, DELETE)
 * 4. Search and Filtering by Name, Blood Group, City, Availability
 * 5. Dashboard Statistics (/api/stats aggregation)
 * 6. Error Handling (400 Bad Request, 404 Not Found, Invalid ObjectId)
 * 7. CORS Headers
 */

process.env.NODE_ENV = 'test';
require('dotenv').config();

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('./server');
const Donor = require('./models/Donor');

let mongoServer;

// Colors for terminal test output
const green = '\x1b[32m';
const red = '\x1b[31m';
const cyan = '\x1b[36m';
const yellow = '\x1b[33m';
const reset = '\x1b[0m';

let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ${green}✓${reset} ${message}`);
    passedTests++;
  } else {
    console.error(`  ${red}✗ FAIL:${reset} ${message}`);
    failedTests++;
  }
}

async function runTestSuite() {
  console.log(`\n${cyan}======================================================${reset}`);
  console.log(`${cyan}🧪 RUNNING FULL INTEGRATION TESTS FOR PROGRAM 5 (CO6)${reset}`);
  console.log(`${cyan}======================================================\n${reset}`);

  try {
    // 1. Initialize MongoDB in-memory server for deterministic integration testing
    console.log(`${yellow}1. Initializing MongoDB Database Connection...${reset}`);
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    assert(mongoose.connection.readyState === 1, 'MongoDB connection established successfully via Mongoose');

    // 2. Test Root & Health Check Endpoint
    console.log(`\n${yellow}2. Testing Health Check & Welcome Endpoint (GET /)...${reset}`);
    const healthRes = await request(app).get('/');
    assert(healthRes.status === 200, `Health check returned status 200 (Got ${healthRes.status})`);
    assert(healthRes.body.courseOutcome === 'CO6', 'Returns Course Outcome: CO6');
    assert(healthRes.body.status === 'Server is running healthy', 'Server health status verified');

    // 3. Test Schema Validation & Error Handling (POST /api/donors with invalid inputs)
    console.log(`\n${yellow}3. Testing Schema Validation & Bad Request Error Handling...${reset}`);
    
    // Missing required fields
    const missingRes = await request(app).post('/api/donors').send({});
    assert(missingRes.status === 400, `Empty body rejected with 400 (Got ${missingRes.status})`);
    assert(missingRes.body.success === false, 'success: false flag returned');

    // Invalid Age (< 18)
    const underageRes = await request(app).post('/api/donors').send({
      fullName: 'Too Young',
      age: 15,
      gender: 'Male',
      bloodGroup: 'O+',
      phoneNumber: '9876543210',
      city: 'Mumbai',
      availabilityStatus: 'Available'
    });
    assert(underageRes.status === 400, `Age < 18 rejected with 400 (Got ${underageRes.status})`);

    // Invalid Blood Group (e.g., C+)
    const invalidBgRes = await request(app).post('/api/donors').send({
      fullName: 'Invalid Group',
      age: 30,
      gender: 'Female',
      bloodGroup: 'C+',
      phoneNumber: '9876543210',
      city: 'Delhi',
      availabilityStatus: 'Available'
    });
    assert(invalidBgRes.status === 400, `Invalid blood group 'C+' rejected with 400 (Got ${invalidBgRes.status})`);

    // 4. Test Create Donor (POST /api/donors)
    console.log(`\n${yellow}4. Testing Donor Registration (POST /api/donors)...${reset}`);
    const donorA = {
      fullName: 'Rahul Sharma',
      age: 26,
      gender: 'Male',
      bloodGroup: 'O+',
      phoneNumber: '9876543210',
      city: 'Mumbai',
      availabilityStatus: 'Available'
    };
    const createResA = await request(app).post('/api/donors').send(donorA);
    assert(createResA.status === 201, `Donor created with 201 Created (Got ${createResA.status})`);
    assert(createResA.body.data.fullName === 'Rahul Sharma', 'Donor full name saved correctly');
    assert(createResA.body.data.bloodGroup === 'O+', 'Donor blood group saved correctly');
    const donorAId = createResA.body.data._id || createResA.body.data.id;

    // Verify record in MongoDB collection
    const dbRecord = await Donor.findById(donorAId);
    assert(dbRecord !== null, 'Record verified directly in MongoDB collection');
    assert(dbRecord.phoneNumber === '9876543210', 'Phone number matches in MongoDB');

    // Register second and third donors
    const createResB = await request(app).post('/api/donors').send({
      fullName: 'Priya Patel',
      age: 32,
      gender: 'Female',
      bloodGroup: 'A+',
      phoneNumber: '9123456780',
      city: 'Ahmedabad',
      availabilityStatus: 'Available'
    });
    const donorBId = createResB.body.data._id || createResB.body.data.id;
    assert(createResB.status === 201, 'Second donor (A+) registered successfully');

    const createResC = await request(app).post('/api/donors').send({
      fullName: 'Amit Verma',
      age: 45,
      gender: 'Male',
      bloodGroup: 'B-',
      phoneNumber: '9988776655',
      city: 'Mumbai',
      availabilityStatus: 'Unavailable'
    });
    assert(createResC.status === 201, 'Third donor (B-, Unavailable) registered successfully');

    // 5. Test Retrieve All Donors (GET /api/donors)
    console.log(`\n${yellow}5. Testing Retrieve All Donors (GET /api/donors)...${reset}`);
    const listRes = await request(app).get('/api/donors');
    assert(listRes.status === 200, `GET /api/donors returned 200 (Got ${listRes.status})`);
    assert(listRes.body.count === 3, `Expected count 3, received ${listRes.body.count}`);
    assert(Array.isArray(listRes.body.data), 'Returns an array of donors');

    // 6. Test Retrieve Single Donor By ID (GET /api/donors/:id)
    console.log(`\n${yellow}6. Testing Retrieve Donor by ID (GET /api/donors/:id)...${reset}`);
    const singleRes = await request(app).get(`/api/donors/${donorAId}`);
    assert(singleRes.status === 200, `Single donor fetched with 200 (Got ${singleRes.status})`);
    assert(singleRes.body.data.fullName === 'Rahul Sharma', 'Fetched correct donor data');

    // Invalid ID format
    const invalidIdRes = await request(app).get('/api/donors/invalid-format-id-123');
    assert(invalidIdRes.status === 400, `Invalid ObjectId returned 400 (Got ${invalidIdRes.status})`);

    // Non-existent ID
    const randomObjectId = new mongoose.Types.ObjectId();
    const notFoundRes = await request(app).get(`/api/donors/${randomObjectId}`);
    assert(notFoundRes.status === 404, `Non-existent ID returned 404 (Got ${notFoundRes.status})`);

    // 7. Test Search and Filtering
    console.log(`\n${yellow}7. Testing Searching and Filtering...${reset}`);
    
    // Search by name
    const searchRes = await request(app).get('/api/donors?search=Priya');
    assert(searchRes.status === 200, 'Search query succeeded');
    assert(searchRes.body.count === 1 && searchRes.body.data[0].fullName === 'Priya Patel', 'Search correctly filtered by name "Priya"');

    // Filter by blood group
    const bgFilterRes = await request(app).get('/api/donors?bloodGroup=O+');
    assert(bgFilterRes.body.count === 1 && bgFilterRes.body.data[0].bloodGroup === 'O+', 'Filter by bloodGroup=O+ returned exactly 1 record');

    // Filter by city
    const cityFilterRes = await request(app).get('/api/donors?city=Mumbai');
    assert(cityFilterRes.body.count === 2, `Filter by city=Mumbai returned 2 donors (Got ${cityFilterRes.body.count})`);

    // Filter by availabilityStatus
    const availFilterRes = await request(app).get('/api/donors?availabilityStatus=Unavailable');
    assert(availFilterRes.body.count === 1 && availFilterRes.body.data[0].fullName === 'Amit Verma', 'Filter by availabilityStatus=Unavailable worked');

    // 8. Test Update Donor (PUT /api/donors/:id)
    console.log(`\n${yellow}8. Testing Update Donor (PUT /api/donors/:id)...${reset}`);
    const updatePayload = {
      city: 'Pune',
      availabilityStatus: 'Unavailable',
      phoneNumber: '9876500000'
    };
    const updateRes = await request(app).put(`/api/donors/${donorAId}`).send(updatePayload);
    assert(updateRes.status === 200, `Update returned 200 OK (Got ${updateRes.status})`);
    assert(updateRes.body.data.city === 'Pune', 'Updated city is Pune');
    assert(updateRes.body.data.availabilityStatus === 'Unavailable', 'Updated status is Unavailable');

    // Verify persistence in MongoDB
    const updatedDb = await Donor.findById(donorAId);
    assert(updatedDb.city === 'Pune', 'Verified updated city persisted in MongoDB');

    // 9. Test Statistics Endpoint (GET /api/stats)
    console.log(`\n${yellow}9. Testing Dashboard Statistics (GET /api/stats)...${reset}`);
    const statsRes = await request(app).get('/api/stats');
    assert(statsRes.status === 200, `GET /api/stats returned 200 (Got ${statsRes.status})`);
    assert(statsRes.body.data.totalDonors === 3, `totalDonors is 3 (Got ${statsRes.body.data.totalDonors})`);
    assert(statsRes.body.data.availableDonors === 1, `availableDonors is 1 (Priya)`);
    assert(statsRes.body.data.unavailableDonors === 2, `unavailableDonors is 2 (Rahul & Amit)`);
    assert(statsRes.body.data.bloodGroupStats['O+'].total === 1, 'bloodGroupStats O+ count is 1');
    assert(statsRes.body.data.bloodGroupStats['A+'].total === 1, 'bloodGroupStats A+ count is 1');
    assert(statsRes.body.data.bloodGroupStats['B-'].total === 1, 'bloodGroupStats B- count is 1');
    assert(statsRes.body.data.bloodGroupStats['AB+'].total === 0, 'bloodGroupStats AB+ count is 0');
    assert(Array.isArray(statsRes.body.data.recentDonors), 'recentDonors is an array');

    // 10. Test Delete Donor (DELETE /api/donors/:id)
    console.log(`\n${yellow}10. Testing Delete Donor (DELETE /api/donors/:id)...${reset}`);
    const deleteRes = await request(app).delete(`/api/donors/${donorBId}`);
    assert(deleteRes.status === 200, `Delete returned 200 OK (Got ${deleteRes.status})`);
    
    // Verify deleted in MongoDB
    const checkDeleted = await Donor.findById(donorBId);
    assert(checkDeleted === null, 'Verified record is permanently removed from MongoDB');

    // Confirm count reduced to 2
    const remainingCount = await Donor.countDocuments();
    assert(remainingCount === 2, `Total documents count now 2 (Got ${remainingCount})`);

    // 11. Test 404 Route Handler
    console.log(`\n${yellow}11. Testing 404 Route Handler...${reset}`);
    const unhandledRes = await request(app).get('/api/non-existent-route');
    assert(unhandledRes.status === 404, `Unhandled route returned 404 (Got ${unhandledRes.status})`);

    // 12. Test CORS Headers
    console.log(`\n${yellow}12. Testing CORS Headers...${reset}`);
    const corsRes = await request(app)
      .get('/api/donors')
      .set('Origin', 'http://localhost:5173');
    assert(
      corsRes.headers['access-control-allow-origin'] === 'http://localhost:5173' ||
      corsRes.headers['access-control-allow-origin'] === '*',
      'CORS header Access-Control-Allow-Origin present and allows frontend origin'
    );

    // Summary
    console.log(`\n${cyan}======================================================${reset}`);
    console.log(`${green}🎉 TEST SUITE COMPLETED: ${passedTests} PASSED, ${failedTests} FAILED${reset}`);
    console.log(`${cyan}======================================================\n${reset}`);

    if (failedTests > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error(`\n${red}Test runner error:${reset}`, error);
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  }
}

runTestSuite();
