const User = require("../Models/User")
const fs = require("fs")
const bcrypt = require("bcrypt")
const passwordValidator = require("password-validator")
const jwt = require("jsonwebtoken")
const { sendSMS } = require("../Services/sms-service") // Import SMS service
const Vendor = require("../Models/Vendor")

// Password Schema
var schema = new passwordValidator()
schema
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(100) // Maximum length 100
  .has()
  .uppercase(1) // Must have uppercase letters
  .has()
  .lowercase(1) // Must have lowercase letters
  .has()
  .digits(1) // Must have at least 2 digits
  .has()
  .not()
  .spaces() // Should not have spaces
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123", "Admin123", "Qwerty@123"]) // Blacklist these values

// Register User
async function createUser(req, res) {
  if (!schema.validate(req.body.password)) {
    return res.send({
      result: "Fail",
      message: "Password must be 8–100 characters long, contain at least 1 digit, uppercase, lowercase letter, and no spaces.",
    });
  }

  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.send({ result: "Fail", message: "Username already exists" });
    }

    // Normalize phone number
    let normalizedPhone = req.body.phone.replace(/\D/g, '');
    if (normalizedPhone.length > 10) {
      normalizedPhone = normalizedPhone.slice(-10);
    }
    if (normalizedPhone.length !== 10) {
      return res.send({ result: "Fail", message: "Invalid phone number. Please provide a 10-digit number." });
    }
    normalizedPhone = `+91${normalizedPhone}`;

    const otp = Math.floor(100000 + Math.random() * 900000);
    const hash = await bcrypt.hash(req.body.password, 12);

    const data = new User({
      ...req.body,
      phone: normalizedPhone, // Use normalized phone
      password: hash,
      otp,
      otpGeneratedAt: new Date(),
    });

    await data.save();

    const otpMessage = `Your OTP for registration on industry guru web portal is ${otp}. Valid for 30 minutes. Please do not share this OTP.Regards,Optima connect`;

    await sendSMS(data.phone, otpMessage);

    res.send({
      result: "Done",
      message: "Registration successful! OTP has been sent to your phone.",
      data: {
        _id: data._id,
        name: data.name,
        phone: data.phone,
        email: data.email,
      },
    });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).send({ result: "Fail", message: "Internal Server Error!!!" });
  }
}

// Verify OTP
async function verifyOtp(req, res) {
  const { email, otp } = req.body;

  try {
    console.log(`\n=== OTP Verification Request ===`);
    console.log(`Email: ${email}`);
    console.log(`OTP: ${otp}`);

    const user = await User.findOne({ email });

    if (!user) {
      console.log(`User not found for email: ${email}`);
      return res.send({ result: "Fail", message: "User not found" });
    }

    console.log(`User found:`);
    console.log(`- ID: ${user._id}`);
    console.log(`- Name: ${user.name}`);
    console.log(`- isPhoneVerified: ${user.isPhoneVerified}`);
    console.log(`- OTP in DB: ${user.otp}`);
    console.log(`- OTP Generated At: ${user.otpGeneratedAt}`);

    // Force check the actual boolean value
    const isVerified = user.isPhoneVerified;
    console.log(`Strict verification check: ${isVerified} (type: ${typeof isVerified})`);

    // Only return "already verified" if explicitly true
    if (isVerified === true) {
      console.log(`Phone already verified, redirecting to login`);
      return res.send({ result: "Done", message: "Phone number is already verified. You can login now." });
    }

    // Check if OTP exists
    if (!user.otp) {
      console.log(`No OTP found in database`);
      return res.send({ result: "Fail", message: "No OTP found. Please request a new OTP." });
    }

    // Check OTP expiry (30 minutes)
    const now = new Date();
    const otpGeneratedTime = new Date(user.otpGeneratedAt);
    const expiry = new Date(otpGeneratedTime.getTime() + 30 * 60 * 1000);
    
    console.log(`Time check:`);
    console.log(`- Now: ${now}`);
    console.log(`- OTP Generated: ${otpGeneratedTime}`);
    console.log(`- Expiry: ${expiry}`);
    console.log(`- Is Expired: ${now > expiry}`);

    if (now > expiry) {
      console.log(`OTP expired`);
      return res.send({ result: "Fail", message: "OTP has expired. Please request a new OTP." });
    }

    // Check if OTP matches
    const dbOtp = String(user.otp);
    const inputOtp = String(otp);
    console.log(`OTP comparison: DB='${dbOtp}' vs Input='${inputOtp}'`);
    
    if (dbOtp !== inputOtp) {
      console.log(`OTP mismatch`);
      return res.send({ result: "Fail", message: "Invalid OTP. Please try again." });
    }

    // Clear OTP and verify phone
    console.log(`OTP verified successfully, updating user...`);
    user.otp = null;
    user.otpGeneratedAt = null;
    user.isPhoneVerified = true;
    await user.save();

    console.log(`User updated successfully`);
    console.log(`=== OTP Verification Complete ===\n`);
    
    res.send({ result: "Done", message: "Phone verified successfully!" });

  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).send({ result: "Fail", message: "Internal Server Error!!!" });
  }
}


// Get Users
async function getAllUser(req, res) {
  try {
    var data = await User.find().sort({ _id: -1 });
    res.send({ result: "Done", count: data.length, data: data });
  } catch (error) {
    res
      .status(500)
      .send({ result: "Fail", message: "Internal Server Error!!!" });
  }
}

// Get Single User
async function getSingleUser(req, res) {
  try {
    const user = await User.findById(req.params._id);

    if (!user) {
      return res.send({ result: "Fail", message: "User not found" });
    }

    // If user is an inactive vendor, show limited info
    if (user.role === "Vendor" && !user.isActive) {
      return res.send({
        result: "Done",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isActive: user.isActive,
        },
        message: "Inactive vendor: Only basic profile info shown",
      });
    }

    // Otherwise, send full user data
    res.send({ result: "Done", data: user });

  } catch (error) {
    res.status(500).send({
      result: "Fail",
      message: "Internal Server Error!!!",
    });
  }
}

// Update User
async function updateUser(req, res) {
  try {
    var data = await User.findOne({ _id: req.params._id });
    if (data) {
      data.name = req.body.name ?? data.name;
      data.email = req.body.email ?? data.email;
      data.phone = req.body.phone ?? data.phone;
      data.addressline1 = req.body.addressline1 ?? data.addressline1;
      data.addressline2 = req.body.addressline2 ?? data.addressline2;
      data.addressline3 = req.body.addressline3 ?? data.addressline3;
      data.pin = req.body.pin ?? data.pin;
      data.city = req.body.city ?? data.city;
      data.state = req.body.state ?? data.state;

      data.pan = req.body.pan ?? data.pan;
      data.bank_no = req.body.bank_no ?? data.bank_no;
      data.bank_ac_name = req.body.bank_ac_name ?? data.bank_ac_name;
      data.bank_ifsc = req.body.bank_ifsc ?? data.bank_ifsc;
      data.bank_branch = req.body.bank_branch ?? data.bank_branch;
      data.bank_name = req.body.bank_name ?? data.bank_name;
      data.upi = req.body.upi ?? data.upi;

      // Add this line to update isActive status
      data.isActive = req.body.isActive ?? data.isActive;

      try {
        if (req.file?.filename) {
          // Delete old profile picture if it exists
          if (data.pic) {
            try {
              fs.unlinkSync("public/users/" + data.pic);
            } catch (error) {
              console.error("Error deleting old profile picture:", error);
            }
          }
          data.pic = req.file.filename;
        }
      } catch (error) {
        console.error("Error handling profile picture:", error);
      }

      await data.save();
      res.send({
        result: "Done",
        message: "Record is Updated!!!",
        data: data // Send back the updated user data
      });
    } else {
      res.send({ result: "Fail", message: "Invalid Id!!!" });
    }
  } catch (error) {
    if (error.keyValue) {
      res.send({ result: "Fail", message: "Name Must Be Unique!!!" });
    } else {
      res.status(500).send({ result: "Fail", message: "Internal Server Error!!!" });
    }
  }
}

// Delete User
async function deleteUser(req, res) {
  try {
    await User.deleteOne({ _id: req.params._id });
    res.send({ result: "Done", message: "Record is Deleted!!!" });
  } catch (error) {
    res
      .status(500)
      .send({ result: "Fail", message: "Internal Server Error!!!" });
  }
}

// Login
async function login(req, res) {
  try {
    // First try to find in User model
    let data = await User.findOne({ username: req.body.username });

    // If not found in User model, try Vendor model
    if (!data) {
      data = await Vendor.findOne({ username: req.body.username });
    }

    if (!data) {
      return res.send({ result: "Fail", message: "Invalid Username or Password!!!" });
    }

    const isMatch = await bcrypt.compare(req.body.password, data.password);
    if (!isMatch) {
      return res.send({ result: "Fail", message: "Invalid Username or Password!!!" });
    }

    // Only check phone verification for regular users, not vendors
    if (data.role === "User" && !data.isPhoneVerified) {
      return res.send({
        result: "Fail",
        message: "Please verify your phone number before logging in.",
      });
    }

    // Determine JWT key based on role
    let key;
    if (data.role === "User") {
      key = process.env.JWT_BUYER_KEY;
    } else if (data.role === "Admin") {
      key = process.env.JWT_ADMIN_KEY;
    } else if (data.role === "Vendor") {
      key = process.env.JWT_VENDOR_KEY;
    }

    jwt.sign({ data }, key, (error, token) => {
      if (error) {
        return res.status(500).send({
          result: "Fail",
          message: "Internal Server Error!!!",
          error: error,
        });
      } else {
        return res.send({
          result: "Done",
          data: data,
          token: token,
          message: data.role === "Vendor" && !data.isApproved ?
            "Your account is pending approval. Please wait for admin review." :
            undefined
        });
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).send({
      result: "Fail",
      message: "Internal Server Error!!!",
    });
  }
}


// Forgot Password - Send OTP via SMS
async function forgetPassword1(req, res) {
  try {
    var data = await User.findOne({ username: req.body.username });
    if (data) {
      const otp = Math.floor(100000 + Math.random() * 900000);
      data.otp = otp;
      data.otpGeneratedAt = new Date();
      await data.save();

      if (data.phone) {
        const smsMessage = `Your OTP for registration on industry guru web portal is ${otp}. Valid for 30 minutes. Please do not share this OTP.Regards,Optima connect`;
        await sendSMS(data.phone, smsMessage);
      }

      res.send({
        result: "Done",
        message: "OTP Has Been Sent to Your Registered Phone!!!",
      });
    } else {
      res.send({ result: "Fail", message: "Username Not Found!!!" });
    }
  } catch (error) {
    res.status(500).send({ result: "Fail", message: "Internal Server Error!!!" });
  }
}

// Forgot Password - Verify OTP
async function forgetPassword2(req, res) {
  try {
    const { username, otp } = req.body;

    const data = await User.findOne({ username });

    if (!data) {
      return res.send({ result: "Fail", message: "Username not found!!!" });
    }

    // Ensure OTP exists and is valid
    if (!data.otp) {
      return res.send({ result: "Fail", message: "No OTP found for this user." });
    }

    // Compare OTPs as strings to avoid type mismatch
    if (String(data.otp) !== String(otp)) {
      return res.send({ result: "Fail", message: "Invalid OTP entered." });
    }

    // Check OTP expiry
    const otpExpiryTime = 10 * 60 * 1000; // 10 minutes
    const now = Date.now();
    const otpGeneratedAt = new Date(data.otpGeneratedAt).getTime();

    if (isNaN(otpGeneratedAt)) {
      return res.send({ result: "Fail", message: "Invalid OTP generation time." });
    }

    if (now - otpGeneratedAt > otpExpiryTime) {
      return res.send({ result: "Fail", message: "OTP has expired. Please request a new one." });
    }

    // All checks passed
    return res.send({ result: "Done", message: "OTP Matched!!!" });

  } catch (error) {
    console.error("OTP Verification Error:", error);
    return res.status(500).send({ result: "Fail", message: "Internal Server Error!!!" });
  }
}

// Forgot Password - Reset Password
async function forgetPassword3(req, res) {
  try {
    var data = await User.findOne({ username: req.body.username });
    if (data) {
      if (schema.validate(req.body.password)) {
        bcrypt.hash(req.body.password, 12, async (error, hash) => {
          if (error) res.send({ result: "Fail", error: error });
          else {
            data.password = hash;
            await data.save();
            res.send({ result: "Done", message: "Password is Updated!!!" });
          }
        });
      } else {
        res.send({
          result: "Fail",
          message: "Password must be 8–100 characters long, contain at least 1 digit, uppercase, lowercase letter, and no spaces.",
        });
      }
    } else res.send({ result: "Fail", message: "Unauthorized Activity!!!" });
  } catch (error) {
    res.status(500).send({ result: "Fail", message: "Internal Server Error!!!" });
  }
}
module.exports = [
  createUser,
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser,
  login,
  forgetPassword1,
  forgetPassword2,
  forgetPassword3,
  verifyOtp // �� Add this line
];
