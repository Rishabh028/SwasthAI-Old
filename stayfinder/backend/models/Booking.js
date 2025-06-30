const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    propertyId: { type: String, required: true },
    propertyTitle: String,
    propertyImage: String,
    checkin: { type: String, required: true },
    checkout: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    bookingDate: { type: Date, default: Date.now },
    status: { type: String, default: 'confirmed' }
});

module.exports = mongoose.model('Booking', BookingSchema);