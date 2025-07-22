const express = require('express');
const router = express.Router();
const SlugController = require('../Controller/SlugController');

// Get all slugs
router.get('/', SlugController.getAllSlugs);

// Create new slug
router.post('/', SlugController.createSlug);

// Add inner slug
router.post('/:id/inner-slug', SlugController.addInnerSlug);

// Delete slug
router.delete('/:id', SlugController.deleteSlug);

// Update slug
router.put('/:id', SlugController.updateSlug);

module.exports = router; 