const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const galleryRoutes = require('./galleryRoutes');


router.use('/api/v1/user', userRoutes);
router.use('/api/v1/gallery', galleryRoutes);


module.exports = router;