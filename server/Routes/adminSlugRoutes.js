const express = require('express');
const router = express.Router();
const SlugController = require('../Controller/SlugController');
const SubSlugController = require('../Controller/SubSlugController');
const jwt = require('jsonwebtoken');

// Admin middleware for authentication
const verifyAdminMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send({ result: "Fail", message: "Token missing!" });
  
  // Verify admin token
  jwt.verify(token, process.env.JWT_ADMIN_KEY, (error) => {
    if (error) return res.status(401).send({ result: "Fail", message: "Invalid or expired admin token." });
    next();
  });
};

// Admin Slug Routes
router.get('/slugs', verifyAdminMiddleware, SlugController.getAllSlugs);
router.post('/slugs', verifyAdminMiddleware, SlugController.createSlug);
router.put('/slugs/:id', verifyAdminMiddleware, SlugController.updateSlug);
router.delete('/slugs/:id', verifyAdminMiddleware, SlugController.deleteSlug);
router.post('/slugs/:id/inner-slug', verifyAdminMiddleware, SlugController.addInnerSlug);

// Admin Sub-Slug Routes
router.get('/sub-slugs', verifyAdminMiddleware, SubSlugController.getAllSubSlugs);
router.get('/sub-slugs/by-parent/:slugId', verifyAdminMiddleware, SubSlugController.getSubSlugsByParent);
router.post('/sub-slugs', verifyAdminMiddleware, SubSlugController.createSubSlug);
router.put('/sub-slugs/:id', verifyAdminMiddleware, SubSlugController.updateSubSlug);
router.delete('/sub-slugs/:id', verifyAdminMiddleware, SubSlugController.deleteSubSlug);
router.post('/sub-slugs/:id/inner-sub-slug', verifyAdminMiddleware, SubSlugController.addInnerSubSlug);

module.exports = router; 