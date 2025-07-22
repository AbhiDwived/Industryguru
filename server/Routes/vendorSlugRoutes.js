const express = require('express');
const router = express.Router();
const VendorSlugController = require('../Controller/VendorSlugController');
const { verifyVendor, checkVendorApproval } = require('../middleware/vendorAuthMiddleware');

// Slug routes
router.get('/slugs', verifyVendor, checkVendorApproval, VendorSlugController.getAllSlugs);
router.post('/slugs', verifyVendor, checkVendorApproval, VendorSlugController.createSlug);
router.put('/slugs/:id', verifyVendor, checkVendorApproval, VendorSlugController.updateSlug);
router.delete('/slugs/:id', verifyVendor, checkVendorApproval, VendorSlugController.deleteSlug);

// Sub-slug routes
router.get('/sub-slugs', verifyVendor, checkVendorApproval, VendorSlugController.getAllSubSlugs);
router.get('/sub-slugs/by-parent/:slugId', verifyVendor, checkVendorApproval, VendorSlugController.getSubSlugsByParent);
router.post('/sub-slugs', verifyVendor, checkVendorApproval, VendorSlugController.createSubSlug);
router.put('/sub-slugs/:id', verifyVendor, checkVendorApproval, VendorSlugController.updateSubSlug);
router.delete('/sub-slugs/:id', verifyVendor, checkVendorApproval, VendorSlugController.deleteSubSlug);

module.exports = router; 