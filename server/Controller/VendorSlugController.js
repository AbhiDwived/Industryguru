const Slug = require('../Models/Slug');
const SubSlug = require('../Models/SubSlug');
const slugify = require('slugify');

// Helper function to generate slug from name
const generateSlug = (name) => {
  return slugify(name, {
    lower: true,
    strict: true
  });
};

// Get all Slugs for vendor
exports.getAllSlugs = async (req, res) => {
  try {
    const slugs = await Slug.find({ createdBy: req.vendor._id });
    return res.json({ result: "Done", data: slugs });
  } catch (err) {
    return res.status(500).json({ result: "Fail", message: err.message });
  }
};

// Create a new Slug
exports.createSlug = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ 
        result: "Fail", 
        message: "Name is required" 
      });
    }

    const slug = generateSlug(name);

    // Check if slug already exists for this vendor
    const existingSlug = await Slug.findOne({ 
      slug,
      createdBy: req.vendor._id 
    });

    if (existingSlug) {
      return res.status(400).json({ 
        result: "Fail", 
        message: "Slug already exists" 
      });
    }

    // Create new slug
    const newSlug = new Slug({
      name,
      slug,
      description,
      createdBy: req.vendor._id,
      innerSlugs: []
    });

    await newSlug.save();
    return res.status(201).json({ 
      result: "Done", 
      data: newSlug,
      message: "Slug created successfully" 
    });
  } catch (err) {
    return res.status(500).json({ 
      result: "Fail", 
      message: err.message 
    });
  }
};

// Update a Slug
exports.updateSlug = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, innerSlugs } = req.body;

    // Find the slug and verify ownership
    const existingSlug = await Slug.findOne({
      _id: id,
      createdBy: req.vendor._id
    });

    if (!existingSlug) {
      return res.status(404).json({
        result: "Fail",
        message: "Slug not found or you don't have permission to update it"
      });
    }

    const updateData = {};
    if (name) {
      updateData.name = name;
      updateData.slug = generateSlug(name);
    }
    if (description !== undefined) updateData.description = description;
    if (innerSlugs !== undefined) updateData.innerSlugs = innerSlugs;

    const updatedSlug = await Slug.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    return res.json({
      result: "Done",
      data: updatedSlug,
      message: "Slug updated successfully"
    });
  } catch (err) {
    return res.status(500).json({
      result: "Fail",
      message: err.message
    });
  }
};

// Delete a Slug
exports.deleteSlug = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find and verify ownership before deletion
    const slug = await Slug.findOne({
      _id: id,
      createdBy: req.vendor._id
    });

    if (!slug) {
      return res.status(404).json({
        result: "Fail",
        message: "Slug not found or you don't have permission to delete it"
      });
    }

    // Delete associated sub-slugs
    await SubSlug.deleteMany({ parentSlug: id });
    
    // Delete the slug
    await Slug.findByIdAndDelete(id);

    return res.json({
      result: "Done",
      message: "Slug and associated sub-slugs deleted successfully"
    });
  } catch (err) {
    return res.status(500).json({
      result: "Fail",
      message: err.message
    });
  }
};

// Get all SubSlugs for vendor
exports.getAllSubSlugs = async (req, res) => {
  try {
    const subSlugs = await SubSlug.find({ createdBy: req.vendor._id })
      .populate('parentSlug', 'name slug');
    return res.json({ result: "Done", data: subSlugs });
  } catch (err) {
    return res.status(500).json({ result: "Fail", message: err.message });
  }
};

// Create a new SubSlug
exports.createSubSlug = async (req, res) => {
  try {
    const { name, parentSlug, description } = req.body;
    
    if (!name || !parentSlug) {
      return res.status(400).json({ 
        result: "Fail", 
        message: "Name and parentSlug are required" 
      });
    }

    // Verify parent slug exists and belongs to vendor
    const parentSlugDoc = await Slug.findOne({
      _id: parentSlug,
      createdBy: req.vendor._id
    });

    if (!parentSlugDoc) {
      return res.status(400).json({ 
        result: "Fail", 
        message: "Parent slug not found or you don't have permission to use it" 
      });
    }

    const slug = generateSlug(name);

    // Check if sub-slug already exists for this vendor
    const existingSubSlug = await SubSlug.findOne({ 
      slug,
      createdBy: req.vendor._id 
    });

    if (existingSubSlug) {
      return res.status(400).json({ 
        result: "Fail", 
        message: "Sub-slug already exists" 
      });
    }

    // Create new sub-slug
    const newSubSlug = new SubSlug({
      name,
      slug,
      description,
      parentSlug,
      createdBy: req.vendor._id,
      innerSubSlugs: []
    });

    await newSubSlug.save();

    // Update parent slug's innerSlugs array
    if (!parentSlugDoc.innerSlugs.includes(slug)) {
      parentSlugDoc.innerSlugs.push(slug);
      await parentSlugDoc.save();
    }

    return res.status(201).json({ 
      result: "Done", 
      data: newSubSlug,
      message: "Sub-slug created successfully" 
    });
  } catch (err) {
    return res.status(500).json({ 
      result: "Fail", 
      message: err.message 
    });
  }
};

// Update a SubSlug
exports.updateSubSlug = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, parentSlug, innerSubSlugs } = req.body;

    // Find the sub-slug and verify ownership
    const existingSubSlug = await SubSlug.findOne({
      _id: id,
      createdBy: req.vendor._id
    });

    if (!existingSubSlug) {
      return res.status(404).json({
        result: "Fail",
        message: "Sub-slug not found or you don't have permission to update it"
      });
    }

    const updateData = {};
    if (name) {
      updateData.name = name;
      updateData.slug = generateSlug(name);
    }
    if (description !== undefined) updateData.description = description;
    if (innerSubSlugs !== undefined) updateData.innerSubSlugs = innerSubSlugs;

    // If changing parent slug, verify new parent exists and belongs to vendor
    if (parentSlug && parentSlug !== existingSubSlug.parentSlug.toString()) {
      const newParentSlug = await Slug.findOne({
        _id: parentSlug,
        createdBy: req.vendor._id
      });

      if (!newParentSlug) {
        return res.status(400).json({
          result: "Fail",
          message: "New parent slug not found or you don't have permission to use it"
        });
      }

      updateData.parentSlug = parentSlug;

      // Update old parent's innerSlugs
      const oldParentSlug = await Slug.findById(existingSubSlug.parentSlug);
      if (oldParentSlug) {
        oldParentSlug.innerSlugs = oldParentSlug.innerSlugs.filter(s => s !== existingSubSlug.slug);
        await oldParentSlug.save();
      }

      // Update new parent's innerSlugs
      if (!newParentSlug.innerSlugs.includes(updateData.slug || existingSubSlug.slug)) {
        newParentSlug.innerSlugs.push(updateData.slug || existingSubSlug.slug);
        await newParentSlug.save();
      }
    }

    const updatedSubSlug = await SubSlug.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('parentSlug', 'name slug');

    return res.json({
      result: "Done",
      data: updatedSubSlug,
      message: "Sub-slug updated successfully"
    });
  } catch (err) {
    return res.status(500).json({
      result: "Fail",
      message: err.message
    });
  }
};

// Delete a SubSlug
exports.deleteSubSlug = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find and verify ownership before deletion
    const subSlug = await SubSlug.findOne({
      _id: id,
      createdBy: req.vendor._id
    });

    if (!subSlug) {
      return res.status(404).json({
        result: "Fail",
        message: "Sub-slug not found or you don't have permission to delete it"
      });
    }

    // Remove from parent's innerSlugs array
    const parentSlug = await Slug.findById(subSlug.parentSlug);
    if (parentSlug) {
      parentSlug.innerSlugs = parentSlug.innerSlugs.filter(s => s !== subSlug.slug);
      await parentSlug.save();
    }

    // Delete the sub-slug
    await SubSlug.findByIdAndDelete(id);

    return res.json({
      result: "Done",
      message: "Sub-slug deleted successfully"
    });
  } catch (err) {
    return res.status(500).json({
      result: "Fail",
      message: err.message
    });
  }
};

// Get SubSlugs by parent Slug
exports.getSubSlugsByParent = async (req, res) => {
  try {
    const { slugId } = req.params;
    
    // Verify parent slug belongs to vendor
    const parentSlug = await Slug.findOne({
      _id: slugId,
      createdBy: req.vendor._id
    });

    if (!parentSlug) {
      return res.status(404).json({
        result: "Fail",
        message: "Parent slug not found or you don't have permission to access it"
      });
    }

    const subSlugs = await SubSlug.find({ 
      parentSlug: slugId,
      createdBy: req.vendor._id 
    }).populate('parentSlug', 'name slug');

    return res.json({ result: "Done", data: subSlugs });
  } catch (err) {
    return res.status(500).json({ result: "Fail", message: err.message });
  }
}; 