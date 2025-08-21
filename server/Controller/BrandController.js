const Brand = require("../Models/Brand");

async function createBrand(req, res) {
  try {
    console.log('Creating brand with data:', req.body);
    var data = new Brand({ name: req.body.name });
    await data.save();
    console.log('Brand created successfully:', data);
    res.send({ result: "Done", message: "Brand Created Successfully!", data: data });
  } catch (error) {
    console.error('Error creating brand:', error);
    if (error.code === 11000) {
      res.send({ result: "Fail", message: "Brand name already exists!" });
    } else if (error.errors && error.errors.name) {
      res.send({ result: "Fail", message: error.errors.name.message });
    } else {
      res.send({ result: "Fail", message: "Error creating brand!" });
    }
  }
}
async function getAllBrand(req, res) {
  try {
    var data = await Brand.find().sort({ _id: -1 });
    res.send({ result: "Done", count: data.length, data: data });
  } catch (error) {
    res
      .status(500)
      .send({ result: "Fail", message: "Internal Server Error!!!" });
  }
}
async function getSingleBrand(req, res) {
  try {
    var data = await Brand.findOne({ _id: req.params._id });
    if (data) res.send({ result: "Done", data: data });
    else res.send({ result: "Fail", message: "Invalid Id!!!" });
  } catch (error) {
    res
      .status(500)
      .send({ result: "Fail", message: "Internal Server Error!!!" });
  }
}

async function updateBrand(req, res) {
  try {
    var data = await Brand.findOne({ _id: req.params._id });
    if (data) {
      data.name = req.body.name ?? data.name;
      await data.save();
      res.send({ result: "Done", message: "Brand Updated Successfully!" });
    } else res.send({ result: "Fail", message: "Invalid Id!!!" });
  } catch (error) {
    if (error.code === 11000) {
      res.send({ result: "Fail", message: "Brand name already exists!" });
    } else {
      res.status(500).send({ result: "Fail", message: "Internal Server Error!!!" });
    }
  }
}
async function deleteBrand(req, res) {
  try {
    await Brand.deleteOne({ _id: req.params._id });
    res.send({ result: "Done", message: "Record is Deleted!!!" });
  } catch (error) {
    res
      .status(500)
      .send({ result: "Fail", message: "Internal Server Error!!!" });
  }
}
module.exports = [
  createBrand,
  getAllBrand,
  getSingleBrand,
  updateBrand,
  deleteBrand,
];
