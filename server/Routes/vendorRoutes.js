const express = require('express');
const router = express.Router();
const { verifyVendor, checkVendorApproval } = require('../middleware/vendorAuthMiddleware');
const SlugController = require('../Controller/SlugController');
const SubSlugController = require('../Controller/SubSlugController');

// Vendor Slug Routes
router.get('/slugs', verifyVendor, checkVendorApproval, async (req, res) => {
  try {
    const slugs = await SlugController.getAllSlugs(req, res);
    return slugs;
  } catch (error) {
    return res.status(500).json({ result: "Fail", message: error.message });
  }
});

// Vendor Sub Slug Routes
router.get('/sub-slugs', verifyVendor, checkVendorApproval, async (req, res) => {
  try {
    const subSlugs = await SubSlugController.getAllSubSlugs(req, res);
    return subSlugs;
  } catch (error) {
    return res.status(500).json({ result: "Fail", message: error.message });
  }
});

router.get('/sub-slugs/by-parent/:slugId', verifyVendor, checkVendorApproval, async (req, res) => {
  try {
    const subSlugs = await SubSlugController.getSubSlugsByParent(req, res);
    return subSlugs;
  } catch (error) {
    return res.status(500).json({ result: "Fail", message: error.message });
  }
});

module.exports = router; 