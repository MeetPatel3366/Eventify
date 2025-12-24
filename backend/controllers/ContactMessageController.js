const ContactMessage = require("../models/ContactMessageModel");

const contactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    console.log(name,email,message);

    const newMessage = new ContactMessage({
      name,
      email,
      message,
    });

    await newMessage.save();

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = { contactForm };
