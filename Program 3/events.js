// events.js - Custom EventEmitter for Blood Donor Registry notifications
// Uses Node.js core module: 'events'

const EventEmitter = require('events');

class DonorEventEmitter extends EventEmitter {}

const donorEmitter = new DonorEventEmitter();

// Notification when a new donor is added
donorEmitter.on('donorAdded', (donor) => {
    console.log('\n--------------------------------------------------');
    console.log('[NOTIFICATION: EVENT EMITTED -> donorAdded]');
    console.log(`Timestamp : ${new Date().toISOString()}`);
    console.log(`Donor ID  : ${donor.id}`);
    console.log(`Name      : ${donor.fullName}`);
    console.log(`Blood Grp : ${donor.bloodGroup}`);
    console.log(`Status    : ${donor.availabilityStatus}`);
    console.log(`City      : ${donor.city}`);
    console.log('Action    : Donor has been registered in the system.');
    console.log('--------------------------------------------------\n');
});

// Notification when a donor's details are updated
donorEmitter.on('donorUpdated', (donor) => {
    console.log('\n--------------------------------------------------');
    console.log('[NOTIFICATION: EVENT EMITTED -> donorUpdated]');
    console.log(`Timestamp : ${new Date().toISOString()}`);
    console.log(`Donor ID  : ${donor.id}`);
    console.log(`Name      : ${donor.fullName}`);
    console.log(`Blood Grp : ${donor.bloodGroup}`);
    console.log(`Status    : ${donor.availabilityStatus}`);
    console.log(`City      : ${donor.city}`);
    console.log('Action    : Donor details have been successfully updated.');
    console.log('--------------------------------------------------\n');
});

// Notification when a donor is deleted
donorEmitter.on('donorDeleted', (donor) => {
    console.log('\n--------------------------------------------------');
    console.log('[NOTIFICATION: EVENT EMITTED -> donorDeleted]');
    console.log(`Timestamp : ${new Date().toISOString()}`);
    console.log(`Donor ID  : ${donor.id}`);
    console.log(`Name      : ${donor.fullName}`);
    console.log(`Blood Grp : ${donor.bloodGroup}`);
    console.log('Action    : Donor has been removed from the registry.');
    console.log('--------------------------------------------------\n');
});

module.exports = donorEmitter;
