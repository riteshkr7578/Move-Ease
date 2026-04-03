
const mongoose = require('mongoose');
const Booking = require('./src/models/Booking');
const Mover = require('./src/models/Mover');
require('dotenv').config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const bookingIdToSearch = 'd9b55c18';
    // Find booking where the ID (as a string or part of ObjectId) matches. 
    // Since MongoDB uses ObjectIds, but the user says "Booking ID: d9b55c18", 
    // it's likely the last 8 chars of the ObjectId or just the full ObjectId if it was short.
    // Let's search for bookings and filter manually or use a regex on the string representation of _id.
    
    const bookings = await Booking.find({});
    const booking = bookings.find(b => b._id.toString().toLowerCase().includes(bookingIdToSearch.toLowerCase()));

    if (!booking) {
      console.log(`Booking with ID ${bookingIdToSearch} not found.`);
      process.exit(0);
    }

    console.log('--- Booking Found ---');
    console.log('ID:', booking._id);
    console.log('Status:', booking.status);
    console.log('Payment Status:', booking.paymentStatus);
    console.log('Estimated Cost:', booking.estimatedCost);
    console.log('Platform Fee:', booking.platformFee);

    const mover = await Mover.findById(booking.mover);
    if (!mover) {
      console.log('Mover not found for this booking.');
      process.exit(0);
    }

    console.log('\n--- Mover Found ---');
    console.log('Mover Name:', mover.name);
    console.log('Wallet Balance:', mover.wallet.balance);
    console.log('Last 3 Ledger Entries:', mover.ledger.slice(-3));

    // Check if deduction is needed
    // 10% of 2094.44 = 209.444
    const expectedDeduction = 209.444; 
    
    const alreadyDeducted = mover.ledger.some(entry => 
      entry.booking && entry.booking.toString() === booking._id.toString() && 
      (entry.type === 'deduction' || entry.type === 'commission')
    );

    if (booking.status === 'completed' && !alreadyDeducted) {
      console.log('\nApplying manual deduction...');
      
      mover.wallet.balance -= expectedDeduction;
      mover.ledger.push({
        booking: booking._id,
        amount: expectedDeduction,
        type: 'deduction',
        paymentMethod: 'cash',
        description: `Manual Fix: Commission deduction for Cash Booking ${bookingIdToSearch} (ID: ${booking._id})`
      });

      await mover.save();
      console.log('Deduction applied successfully.');
      console.log('New Wallet Balance:', mover.wallet.balance);
    } else {
      console.log('\nNo deduction applied. Either booking is not completed or deduction already exists.');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

run();
