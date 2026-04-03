
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Mover = require('./src/models/Mover');
const Booking = require('./src/models/Booking');
const User = require('./src/models/User');

const checkMoverBalance = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Find the mover. We'll pick one that exist, or the first one.
        const mover = await Mover.findOne().populate('owner');
        if (!mover) {
            console.log('No mover found in database');
            process.exit(0);
        }

        console.log('--- Mover Info ---');
        console.log(`Name: ${mover.name}`);
        if (mover.owner) {
            console.log(`Owner: ${mover.owner.email} (${mover.owner._id})`);
        } else {
            console.log('Owner is null');
        }
        console.log(`Wallet Balance (Online): ${mover.wallet.balance}`);
        console.log(`Commission Owed (Cash): ${mover.wallet.commissionOwed}`);
        console.log(`Ledger entries: ${mover.ledger.length}`);

        const bookings = await Booking.find({});
        console.log(`\nFound total ${bookings.length} bookings in DB`);
        bookings.forEach(b => {
            console.log(`- ID: ${b._id.toString().slice(-6)}, Mover: ${b.mover}, Status: ${b.status}, Payment Status: ${b.paymentStatus}`);
        });

        // Analysis of specifically Royal Movers (69cd10f5bf73a33f4ea6435d)
        const royalId = '69cd10f5bf73a33f4ea6435d';
        const royalMovers = await Mover.findById(royalId);
        const royalBookings = await Booking.find({ mover: royalId, status: 'completed' });

        console.log(`\n--- Deep Dive: Royal Movers ---`);
        console.log(`Mover Name: ${royalMovers.name}`);
        console.log(`Wallet Balance: ${royalMovers.wallet.balance}`);
        console.log(`Completed Bookings count: ${royalBookings.length}`);
        royalBookings.forEach(b => {
             console.log(`- ID: ${b._id}, Payment Status: ${b.paymentStatus}, Cost: ${b.estimatedCost}, Earning: ${b.moverEarnings}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkMoverBalance();
