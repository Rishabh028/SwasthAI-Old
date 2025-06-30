const Booking = require('../models/Booking');

// POST /api/bookings
exports.createBooking = async (req, res) => {
    try {
        const { propertyId, propertyTitle, propertyImage, checkin, checkout, totalPrice } = req.body;
        if (!propertyId || !checkin || !checkout || !totalPrice) {
            return res.status(400).json({ msg: 'Missing fields' });
        }
        const booking = new Booking({
            user: req.user.id, // from auth middleware
            propertyId,
            propertyTitle,
            propertyImage,
            checkin,
            checkout,
            totalPrice
        });
        await booking.save();
        res.json({ booking });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// GET /api/bookings
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id }).sort({ bookingDate: -1 });
        res.json({ bookings });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};