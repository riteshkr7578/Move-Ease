
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Mover = require('./src/models/Mover');
const Booking = require('./src/models/Booking');

const fixRoyalMovers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const royalId = '69cd10f5bf73a33f4ea6435d';
        const royalMover = await Mover.findById(royalId);
        const royalBookings = await Booking.find({ mover: royalId });

        console.log(`Initial Balance: ${royalMover.wallet.balance}`);
        
        let totalEarning = 0;
        for (const booking of royalBookings) {
            console.log(`Checking Booking ${booking._id}: Status ${booking.status}, Payment ${booking.paymentStatus}`);
            if (booking.status === 'completed' && booking.paymentStatus === 'paid') {
                const total = booking.estimatedCost || 0;
                const earning = total * 0.9;
                const fee = total * 0.1;

                console.log(`Processing Booking ${booking._id}: Total ${total}, Earning ${earning}`);
                
                // Update Booking if moverEarnings is missing
                if (!booking.moverEarnings || booking.moverEarnings === 0) {
                    booking.moverEarnings = earning;
                    booking.platformFee = fee;
                    await booking.save();
                    console.log(`Updated Booking ${booking._id} with earnings.`);
                }

                totalEarning += earning;

                // Add to ledger if not already there
                const inLedger = royalMover.ledger.some(l => l.booking && l.booking.toString() === booking._id.toString());
                if (!inLedger) {
                    royalMover.ledger.push({
                        booking: booking._id,
                        amount: earning,
                        type: 'earning',
                        paymentMethod: 'online',
                        description: `Recovery: Online Earning from #${booking._id.toString().slice(-6)} (90%)`
                    });
                }
            }
        }

        royalMover.wallet.balance = totalEarning;
        await royalMover.save();

        console.log(`Final Balance: ${royalMover.wallet.balance}`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixRoyalMovers();
