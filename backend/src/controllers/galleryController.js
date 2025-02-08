const Gallery = require('../models/gallery');

exports.getGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find();
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createGallery = async (req, res) => {
  try {
    const { username, title, description, image, song } = req.body;
    const gallery = new Gallery({ username, title, description, image, song });
    await gallery.save();
    res.status(201).json(gallery);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getGalleryById = async (req, res) => {
  try {
    const { username } = req.params;
    const gallery = await Gallery.find({ username });

    return res.json(gallery);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findByIdAndDelete(id);
    if (!gallery) {
      return res.status(404).json({ error: 'Gallery not found' });
    }
    res.json({ message: 'Gallery deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};