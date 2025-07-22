const express = require('express');
const router = express.Router();
const SubSlugController = require('../Controller/SubSlugController');

// Get all sub-slugs
router.get('/', SubSlugController.getAllSubSlugs);

// Get sub-slugs by parent slug
router.get('/by-parent/:slugId', SubSlugController.getSubSlugsByParent);

// Create new sub-slug
router.post('/', SubSlugController.createSubSlug);

// Add inner sub-slug
router.post('/:id/inner-subslug', SubSlugController.addInnerSubSlug);

// Delete sub-slug
router.delete('/:id', SubSlugController.deleteSubSlug);

// Update sub-slug
router.put('/:id', SubSlugController.updateSubSlug);

module.exports = router; 