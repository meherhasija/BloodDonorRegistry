// donorManager.js - Core File System & Data Management for Blood Donor Registry
// Uses Node.js core modules: 'fs' and 'path'

const fs = require('fs');
const path = require('path');
const donorEmitter = require('./events');

// Safe file path construction using path.join()
const DATA_FILE_PATH = path.join(__dirname, 'donors.json');

const VALID_BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const VALID_GENDERS = ['male', 'female', 'other'];
const VALID_STATUSES = ['available', 'unavailable'];

/**
 * Reads donor records from the JSON file.
 * Handles missing file errors by creating an empty file if needed.
 */
async function readDonorsFile() {
    try {
        const fileContent = await fs.promises.readFile(DATA_FILE_PATH, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // Missing file: create an empty array file
            await fs.promises.writeFile(DATA_FILE_PATH, JSON.stringify([], null, 2), 'utf-8');
            return [];
        }
        if (error instanceof SyntaxError) {
            throw new Error('donors.json contains corrupted JSON data.');
        }
        throw error;
    }
}

/**
 * Writes donor records back to the JSON file safely.
 */
async function writeDonorsFile(donors) {
    const jsonString = JSON.stringify(donors, null, 2);
    await fs.promises.writeFile(DATA_FILE_PATH, jsonString, 'utf-8');
}

/**
 * Generates the next sequential donor ID.
 */
function generateNextId(donors) {
    const numericIds = donors
        .map((d) => parseInt(d.id, 10))
        .filter((num) => !isNaN(num));

    const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 100;
    return String(maxId + 1);
}

/**
 * Validates donor input fields.
 * isUpdate = false for POST (all fields required)
 * isUpdate = true for PUT (only provided fields validated)
 */
function validateDonor(data, isUpdate = false) {
    const errors = [];

    // Full Name
    if (!isUpdate || data.fullName !== undefined) {
        if (!data.fullName || typeof data.fullName !== 'string' || data.fullName.trim().length < 2) {
            errors.push('fullName is required and must be at least 2 characters.');
        }
    }

    // Age
    if (!isUpdate || data.age !== undefined) {
        const ageNum = Number(data.age);
        if (!Number.isInteger(ageNum) || ageNum < 18 || ageNum > 65) {
            errors.push('age must be an integer between 18 and 65 years.');
        }
    }

    // Gender
    if (!isUpdate || data.gender !== undefined) {
        if (!data.gender || typeof data.gender !== 'string' || !VALID_GENDERS.includes(data.gender.trim().toLowerCase())) {
            errors.push('gender must be Male, Female, or Other.');
        }
    }

    // Blood Group
    if (!isUpdate || data.bloodGroup !== undefined) {
        const bg = data.bloodGroup ? data.bloodGroup.trim().toUpperCase() : '';
        if (!VALID_BLOOD_GROUPS.includes(bg)) {
            errors.push(`bloodGroup must be one of: ${VALID_BLOOD_GROUPS.join(', ')}.`);
        }
    }

    // Phone Number
    if (!isUpdate || data.phoneNumber !== undefined) {
        const phoneStr = String(data.phoneNumber || '').trim();
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phoneStr)) {
            errors.push('phoneNumber must be a valid 10-digit number (e.g., 9876543210).');
        }
    }

    // City
    if (!isUpdate || data.city !== undefined) {
        if (!data.city || typeof data.city !== 'string' || data.city.trim().length < 2) {
            errors.push('city is required and must be at least 2 characters.');
        }
    }

    // Availability Status
    if (!isUpdate || data.availabilityStatus !== undefined) {
        const status = data.availabilityStatus ? data.availabilityStatus.trim().toLowerCase() : '';
        if (!VALID_STATUSES.includes(status)) {
            errors.push("availabilityStatus must be either 'Available' or 'Unavailable'.");
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Normalizes donor object values (proper casing, trimmed strings).
 */
function formatDonorRecord(data, id) {
    const formatted = {};
    if (id !== undefined) formatted.id = String(id);
    if (data.fullName !== undefined) formatted.fullName = data.fullName.trim();
    if (data.age !== undefined) formatted.age = parseInt(data.age, 10);
    if (data.gender !== undefined) {
        const g = data.gender.trim().toLowerCase();
        formatted.gender = g.charAt(0).toUpperCase() + g.slice(1);
    }
    if (data.bloodGroup !== undefined) formatted.bloodGroup = data.bloodGroup.trim().toUpperCase();
    if (data.phoneNumber !== undefined) formatted.phoneNumber = String(data.phoneNumber).trim();
    if (data.city !== undefined) formatted.city = data.city.trim();
    if (data.availabilityStatus !== undefined) {
        const s = data.availabilityStatus.trim().toLowerCase();
        formatted.availabilityStatus = s === 'available' ? 'Available' : 'Unavailable';
    }
    return formatted;
}

/**
 * Retrieve all donors.
 */
async function getAllDonors() {
    return await readDonorsFile();
}

/**
 * Retrieve a single donor by ID.
 */
async function getDonorById(id) {
    const donors = await readDonorsFile();
    return donors.find((d) => String(d.id) === String(id)) || null;
}

/**
 * Add a new donor record.
 */
async function addDonor(donorData) {
    const validation = validateDonor(donorData, false);
    if (!validation.isValid) {
        const err = new Error(validation.errors.join(' '));
        err.statusCode = 400;
        throw err;
    }

    const donors = await readDonorsFile();
    const newId = donorData.id && !donors.some((d) => String(d.id) === String(donorData.id))
        ? String(donorData.id)
        : generateNextId(donors);

    const formattedDonor = formatDonorRecord(donorData, newId);
    donors.push(formattedDonor);
    await writeDonorsFile(donors);

    // Emit event notification
    donorEmitter.emit('donorAdded', formattedDonor);

    return formattedDonor;
}

/**
 * Update an existing donor by ID.
 */
async function updateDonor(id, updateData) {
    if (!updateData || Object.keys(updateData).length === 0) {
        const err = new Error('No update fields provided.');
        err.statusCode = 400;
        throw err;
    }

    const validation = validateDonor(updateData, true);
    if (!validation.isValid) {
        const err = new Error(validation.errors.join(' '));
        err.statusCode = 400;
        throw err;
    }

    const donors = await readDonorsFile();
    const index = donors.findIndex((d) => String(d.id) === String(id));

    if (index === -1) {
        const err = new Error(`Donor with ID '${id}' not found.`);
        err.statusCode = 404;
        throw err;
    }

    const existingDonor = donors[index];
    const formattedUpdates = formatDonorRecord(updateData);
    delete formattedUpdates.id; // Prevent changing ID

    const updatedDonor = {
        ...existingDonor,
        ...formattedUpdates
    };

    donors[index] = updatedDonor;
    await writeDonorsFile(donors);

    // Emit event notification
    donorEmitter.emit('donorUpdated', updatedDonor);

    return updatedDonor;
}

/**
 * Delete a donor by ID.
 */
async function deleteDonor(id) {
    const donors = await readDonorsFile();
    const index = donors.findIndex((d) => String(d.id) === String(id));

    if (index === -1) {
        const err = new Error(`Donor with ID '${id}' not found.`);
        err.statusCode = 404;
        throw err;
    }

    const [deletedDonor] = donors.splice(index, 1);
    await writeDonorsFile(donors);

    // Emit event notification
    donorEmitter.emit('donorDeleted', deletedDonor);

    return deletedDonor;
}

module.exports = {
    getAllDonors,
    getDonorById,
    addDonor,
    updateDonor,
    deleteDonor,
    DATA_FILE_PATH
};
