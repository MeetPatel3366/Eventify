const User = require("../models/UserModel");
const OauthAccount = require("../models/OauthAccountModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const {
  generateState,
  generateCodeVerifier,
  decodeIdToken,
} = require("arctic");
const google = require("../utils/google");
const handleFileUpload = require("../utils/handleFileUpload");

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

    if (user.role === "admin") {
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "Admin Login successful",
        role: user.role,
        isAdmin: true,
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
    const token = req.cookies.token;

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
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      role: user.role,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getGoogleLoginPage = async (req, res, next) => {
  const state = generateState(); // CSRF Protection
  const codeVerifier = generateCodeVerifier(); // PKCE verifier

  const allowedRoles = ["customer", "eventorganizer"];
  const requestedRole = req.query.role || "customer";

  const role = allowedRoles.includes(requestedRole)
    ? requestedRole
    : "customer";

  console.log("role : ", role);

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

  res.cookie("oauth_role", role, cookieConfig);

  res.redirect(url.toString());
};

const getGoogleLoginCallback = async (req, res, next) => {
  const intendedRole = req.cookies.oauth_role;
  //google redirect with code, and state in query params
  //we will use code to find out the user
  const { code, state } = req.query;
  console.log(code, state);

  const {
    google_oauth_state: storedState,
    google_code_verifier: codeVerifier,
  } = req.cookies;

  if (
    !code ||
    !state ||
    !storedState ||
    !codeVerifier ||
    state !== storedState
  ) {
    res.redirect(`${process.env.FRONTEND_URL}`);
    return next(
      new Error(
        "Couldn't login with Google because of invalid login attempt. Please try again!",
      ),
    );
  }

  let tokens;
  try {
    // artic will verify the code given by google with code verifier internally
    tokens = await google.validateAuthorizationCode(code, codeVerifier);
  } catch {
    res.redirect(`${process.env.FRONTEND_URL}/login`);
    return next(
      new Error(
        "Couldn't login with Google because of invalid login attempt. Please try again!",
      ),
    );
  }

  const claims = decodeIdToken(tokens.idToken());
  const { sub: googleUserId, name, email } = claims;

  // Find user with this email
  let user = await User.findOne({ email });
  let linkedAccount = null;

  // 1. If user exists, check if OAuth account is linked
  if (user) {
    linkedAccount = await OauthAccount.findOne({
      userId: user._id,
      provider: "google",
    }).lean();

    // 2. User already exists with the same email but google's oauth isn't linked , create a new OAuth account entry
    if (!linkedAccount) {
      await OauthAccount.create({
        userId: user._id,
        provider: "google",
        providerAccountId: googleUserId,
      });
    }
  }

  //3. If user does not exist, create user + oauth account without transaction
  if (!user) {
    let newUser;

    try {
      newUser = await User.create({
        username: `${name.replace(/\s+/g, "").toLowerCase()}_${Date.now()}`,
        email,
        role: intendedRole,
        isOAuthUser: true,
        isVerified: true,
      });

      await OauthAccount.create({
        userId: newUser._id,
        provider: "google",
        providerAccountId: googleUserId,
      });

      user = newUser;
    } catch (err) {
      if (newUser) {
        await User.findByIdAndDelete(newUser._id);
      }
      return next(new Error("Couldn't login with Google. Please try again!"));
    }
  }

  if (user.role == "eventorganizer") {
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

    res.clearCookie("google_oauth_state");
    res.clearCookie("google_code_verifier");

    return res.redirect(
      `${process.env.FRONTEND_URL}/login-otp-verify?email=${user.email}`,
    );
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.clearCookie("google_oauth_state");
  res.clearCookie("google_code_verifier");

  return res.redirect(`${process.env.FRONTEND_URL}/home`);
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    console.log(req.cookies);
    return res.status(200).json({
      success: true,
      message: "logged out successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select(
      "-password -otp -otpExpiry",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      profile: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const allowedUpdates = [
      "fullName",
      "phoneNumber",
      "bio",
      "organizationName",
      "organizationWebsite",
      "organizationDescription",
    ];

    const updates = {};

    allowedUpdates.forEach((field) => {
      if (req.body[field] != undefined) {
        updates[field] = req.body[field];
      }
    });

    if (req.file) {
      console.log("file", req.file);
      const imageData = await handleFileUpload(
        req.file,
        "eventify/profile-images",
        user.profileImage?.public_id,
      );

      updates.profileImage = imageData;
      console.log("imageData", imageData);
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password -otp -otpExpiry");

    console.log("up", updatedUser);
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  verify,
  verifyOtp,
  verifyLoginOtp,
  getGoogleLoginPage,
  getGoogleLoginCallback,
  getMyProfile,
  updateMyProfile,
  logout,
};
