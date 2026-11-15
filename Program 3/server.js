// server.js - Native HTTP Server for Blood Donor Registry System
// Uses Node.js core modules: 'http' and 'url' (NO Express.js)

const http = require('http');
const {
    getAllDonors,
    getDonorById,
    addDonor,
    updateDonor,
    deleteDonor
} = require('./donorManager');

const PORT = process.env.PORT || 5000;

/**
 * Sends formatted JSON responses with CORS headers and status code.
 */
function sendJsonResponse(res, statusCode, payload) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(JSON.stringify(payload, null, 2));
}

/**
 * Parses incoming HTTP request body using Node.js Readable Streams.
 */
function parseRequestBody(req) {
    return new Promise((resolve, reject) => {
        let rawData = '';

        // Readable stream 'data' event
        req.on('data', (chunk) => {
            rawData += chunk;
            // Prevent oversized payload attacks (max 1MB)
            if (rawData.length > 1e6) {
                req.destroy();
                const err = new Error('Request payload too large.');
                err.statusCode = 413;
                reject(err);
            }
        });

        // Readable stream 'end' event
        req.on('end', () => {
            if (!rawData.trim()) {
                resolve({});
                return;
            }
            try {
                const parsedData = JSON.parse(rawData);
                resolve(parsedData);
            } catch (err) {
                const parseErr = new Error('Invalid JSON format in request body.');
                parseErr.statusCode = 400;
                reject(parseErr);
            }
        });

        // Readable stream 'error' event
        req.on('error', (err) => {
            reject(err);
        });
    });
}

/**
 * Main HTTP request handler.
 */
const server = http.createServer(async (req, res) => {
    // Handle CORS preflight options
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }

    try {
        const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        const pathname = parsedUrl.pathname.replace(/\/+$/, '') || '/';
        const method = req.method.toUpperCase();

        // Route: Root / Welcome info
        if (pathname === '/') {
            if (method !== 'GET') {
                sendJsonResponse(res, 405, { success: false, error: 'Method Not Allowed' });
                return;
            }
            sendJsonResponse(res, 200, {
                success: true,
                message: 'Blood Donor Registry API is running (Node.js Core Modules)',
                endpoints: {
                    'GET /donors': 'Retrieve all donors',
                    'GET /donors/:id': 'Retrieve donor by ID',
                    'POST /donors': 'Register a new donor',
                    'PUT /donors/:id': 'Update donor details',
                    'DELETE /donors/:id': 'Delete donor from registry'
                }
            });
            return;
        }

        // Route: /donors
        if (pathname === '/donors') {
            if (method === 'GET') {
                const donors = await getAllDonors();
                sendJsonResponse(res, 200, {
                    success: true,
                    count: donors.length,
                    data: donors
                });
                return;
            }

            if (method === 'POST') {
                const body = await parseRequestBody(req);
                const newDonor = await addDonor(body);
                sendJsonResponse(res, 201, {
                    success: true,
                    message: 'Donor registered successfully.',
                    data: newDonor
                });
                return;
            }

            sendJsonResponse(res, 405, {
                success: false,
                error: `Method ${method} not allowed on /donors`
            });
            return;
        }

        // Route: /donors/:id
        const donorIdMatch = pathname.match(/^\/donors\/([a-zA-Z0-9_-]+)$/);
        if (donorIdMatch) {
            const donorId = donorIdMatch[1];

            if (method === 'GET') {
                const donor = await getDonorById(donorId);
                if (!donor) {
                    sendJsonResponse(res, 404, {
                        success: false,
                        error: `Donor with ID '${donorId}' not found.`
                    });
                    return;
                }
                sendJsonResponse(res, 200, {
                    success: true,
                    data: donor
                });
                return;
            }

            if (method === 'PUT') {
                const body = await parseRequestBody(req);
                const updatedDonor = await updateDonor(donorId, body);
                sendJsonResponse(res, 200, {
                    success: true,
                    message: `Donor with ID '${donorId}' updated successfully.`,
                    data: updatedDonor
                });
                return;
            }

            if (method === 'DELETE') {
                const deletedDonor = await deleteDonor(donorId);
                sendJsonResponse(res, 200, {
                    success: true,
                    message: `Donor with ID '${donorId}' deleted successfully.`,
                    data: deletedDonor
                });
                return;
            }

            sendJsonResponse(res, 405, {
                success: false,
                error: `Method ${method} not allowed on /donors/:id`
            });
            return;
        }

        // If no route matches: 404
        sendJsonResponse(res, 404, {
            success: false,
            error: `Route not found: ${method} ${pathname}`
        });

    } catch (error) {
        const statusCode = error.statusCode || 500;
        sendJsonResponse(res, statusCode, {
            success: false,
            error: error.message || 'Internal Server Error'
        });
    }
});

if (require.main === module) {
    server.listen(PORT, () => {
        console.log('==================================================');
        console.log(`Blood Donor Registry Server running on port ${PORT}`);
        console.log(`Server URL: http://localhost:${PORT}`);
        console.log('Available API Endpoints:');
        console.log(`  GET    http://localhost:${PORT}/donors`);
        console.log(`  GET    http://localhost:${PORT}/donors/:id`);
        console.log(`  POST   http://localhost:${PORT}/donors`);
        console.log(`  PUT    http://localhost:${PORT}/donors/:id`);
        console.log(`  DELETE http://localhost:${PORT}/donors/:id`);
        console.log('==================================================');
    });
}

module.exports = server;
