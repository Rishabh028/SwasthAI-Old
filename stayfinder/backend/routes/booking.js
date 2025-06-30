const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth'); // You need auth middleware for JWT

router.post('/', auth, bookingController.createBooking);
router.get('/', auth, bookingController.getMyBookings);

module.exports = router;