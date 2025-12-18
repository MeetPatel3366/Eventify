const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { generateState, generateCodeVerifier } = require("arctic");
const google = require("../utils/google");

const register = async (req, res) => {
  try {
    const { username, email, password, confirmpassword, role } = req.body;

    if (!username || !email || !password || !confirmpassword) {
      return res.status(400).json({
        success: false,
        message: "all fields required",
      });
    }

    if (role == "admin") {
      return res.status(403).json({
        success: false,
        message: "admin registeration is not allowed",
      });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({
        success: false,
        message: "user already exists",
      });
    }

    if (password !== confirmpassword) {
      return res.status(400).json({
        success: false,
        message: "passwords do not match",
      });
    }

    const PASSWORD_REGEX =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and a special character.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      otp,
      otpExpiry,
    });

    const transporter = nodemailer.createTransport({
      host: process.env.MAILHOST,
      port: parseInt(process.env.MAILPORT, 10),
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: "Eventify - Email Verification OTP",
      html: `
      <h2>Email Verification</h2>
      <p>Your OTP for Eventify registration is:</p>
      <h1>${otp}</h1>
      <p>This OTP will expire in 10 minutes.</p>
    `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: "registration successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password is required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "invalid credentials",
      });
    }

    if (!user.isVerified) {
      const newOtp = crypto.randomInt(100000, 1000000);
      user.otp = newOtp;
      user.otpExpiry = Date.now() + 10 * 60 * 1000;
      await user.save();

      const transporter = nodemailer.createTransport({
        host: process.env.MAILHOST,
        port: parseInt(process.env.MAILPORT, 10),
        secure: false,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.MAIL_USERNAME,
        to: email,
        subject: "Eventify - Email Verification OTP",
        html: `
        <h2>Email Verification</h2>
        <p>Your OTP for Eventify registration is:</p>
        <h1>${otp}</h1>
        <p>This OTP will expire in 10 minutes.</p>
      `,
      };

      await transporter.sendMail(mailOptions);

      return res.status(403).json({
        success: false,
        message: "Email not verified. A new OTP has been sent to your email.",
        needsVerification: true,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const otp = crypto.randomInt(100000, 1000000);
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    const transporter = nodemailer.createTransport({
      host: process.env.MAILHOST,
      port: parseInt(process.env.MAILPORT, 10),
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: "Eventify Login OTP",
      html: `
        <h2>Email Verification</h2>
        <p>Your login OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP will expire in 10 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "OTP sent to email. please verify to complete login.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "email and OTP are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "user already verified",
      });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const verify = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({
        success: false,
      });
    }

    const decoded = jwt.verify(token, "secret");
    return res.status(200).json({
      success: true,
      role: decoded.role,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    if (user.role == "eventorganizer") {
      if (user.organizerStatus == "pending") {
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        return res.status(403).json({
          success: false,
          message: "Waiting for admin approval",
        });
      }

      if (user.organizerStatus == "rejected") {
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        return res.status(403).json({
          success: false,
          message: "Organizer request rejected by admin",
        });
      }
    }

    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      role: user.role,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getGoogleLoginPage = async (req, res) => {
  const state = generateState(); // CSRF Protection
  const codeVerifier = generateCodeVerifier(); // PKCE verifier

  const url = google.createAuthorizationURL(state, codeVerifier, [
    "openid", // for ID token
    "profile", // basic profile info
    "email", // user email
  ]);

  const cookieConfig = {
    httpOnly: true,
    secure: false,
    maxAge: 10 * 60 * 1000,
    sameSite: "lax", // keep cookies on Google redirect
  };

  res.cookie("google_oauth_state", state, cookieConfig);
  res.cookie("google_code_verifier", codeVerifier, cookieConfig);

  res.redirect(url.toString());
};

module.exports = {
  register,
  login,
  verify,
  verifyOtp,
  verifyLoginOtp,
  getGoogleLoginPage,
};
