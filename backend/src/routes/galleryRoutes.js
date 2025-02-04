const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');

router.get('/getGallery', galleryController.getGallery);
router.post('/createGallery', galleryController.createGallery);
router.get('/getGalleryById/:id', galleryController.getGalleryById);
router.delete('/deleteGallery/:id', galleryController.deleteGallery);

module.exports = router;