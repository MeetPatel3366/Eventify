import Event from "../models/EventModel.js";
import Booking from "../models/BookingModel.js";
import { cloudinary } from "../utils/cloudinary.js";
import handleFileUpload from "../utils/handleFileUpload.js";

const addEvent = async (req, res) => {
  try {
    const {
      name,
      category,
      datetime,
      location,
      description,
      totalSeats,
      price,
      pincode,
    } = req.body;

    let imageData = null;
    if (req.files && req.files.image && req.files.image[0]) {
      imageData = await handleFileUpload(
        req.files.image[0],
        "eventify/events",
        null,
        true,
      );
    }

    let themesData = [];
    if (req.body.themes) {
      const parsedThemes = JSON.parse(req.body.themes);
      const themeFiles = req.files?.themeImages || [];
      let fileIndex = 0;

      for (const theme of parsedThemes) {
        const imageCount = parseInt(theme.imageCount) || 0;
        const themeImages = [];

        for (let i = 0; i < imageCount && fileIndex < themeFiles.length; i++) {
          const uploaded = await handleFileUpload(
            themeFiles[fileIndex],
            "eventify/themes",
            null,
            true,
          );
          if (uploaded) themeImages.push(uploaded);
          fileIndex++;
        }

        themesData.push({
          name: theme.name,
          images: themeImages,
        });
      }
    }

    const newEvent = await Event.create({
      name,
      category,
      datetime: new Date(datetime),
      location,
      description,
      price,
      pincode: pincode || "",
      organizerId: req.user.id,
      status: "pending",
      totalSeats,
      availableSeats: totalSeats,
      image: imageData,
      themes: themesData,
    });

    console.log("newEvent: ", newEvent);

    return res.status(201).json({
      success: true,
      message: "event submitted for approval",
      event: newEvent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "approved" })
      .populate("organizerId", "username email")
      .populate("category", "name");

    if (events.length == 0) {
      return res.status(200).json({
        success: true,
        message: "no approved events found at this time.",
        events: [],
      });
    }

    const updatedEvents = events.map((event) => ({
      ...event._doc,
      isCompleted: new Date(event.datetime) < new Date(),
      image: event.image?.secure_url || null,
    }));

    return res.status(200).json({
      success: true,
      message: "approved events fetched successfully",
      events: updatedEvents,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateEvent = async (req, res) => {
  try {
    const eventID = await req.params.id;

    const event = await Event.findById(eventID);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `event not found with id: ${eventID}`,
      });
    }

    event.name = req.body.name || event.name;
    event.category = req.body.category || event.category;
    event.datetime = new Date(req.body.datetime) || event.datetime;
    event.location = req.body.location || event.location;
    event.description = req.body.description || event.description;
    event.price = req.body.price || event.price;
    event.pincode = req.body.pincode !== undefined ? req.body.pincode : event.pincode;
    event.status = "pending";
    event.totalSeats = req.body.totalSeats || event.totalSeats;
    event.availableSeats =
      req.body.totalSeats !== undefined
        ? req.body.totalSeats - (event.totalSeats - event.availableSeats)
        : event.availableSeats;

    // Handle main image (upload.fields)
    if (req.files && req.files.image && req.files.image[0]) {
      const imageData = await handleFileUpload(
        req.files.image[0],
        "eventify/events",
        event.image?.public_id,
        true,
      );
      event.image = imageData;
    }

    // Handle themes update
    if (req.body.themes) {
      const parsedThemes = JSON.parse(req.body.themes);
      const themeFiles = req.files?.themeImages || [];
      let fileIndex = 0;

      // Delete old theme images from Cloudinary
      if (event.themes && event.themes.length > 0) {
        for (const oldTheme of event.themes) {
          for (const img of oldTheme.images) {
            if (img.public_id) {
              try {
                await cloudinary.uploader.destroy(img.public_id);
              } catch (e) {
                console.error("Failed to delete old theme image:", e);
              }
            }
          }
        }
      }

      const themesData = [];
      for (const theme of parsedThemes) {
        const imageCount = parseInt(theme.imageCount) || 0;
        const themeImages = [];

        // Check for existing images that are kept
        if (theme.existingImages) {
          themeImages.push(...theme.existingImages);
        }

        for (let i = 0; i < imageCount && fileIndex < themeFiles.length; i++) {
          const uploaded = await handleFileUpload(
            themeFiles[fileIndex],
            "eventify/themes",
            null,
            true,
          );
          if (uploaded) themeImages.push(uploaded);
          fileIndex++;
        }

        themesData.push({
          name: theme.name,
          images: themeImages,
        });
      }

      event.themes = themesData;
    }

    const updatedEvent = await event.save();

    console.log("updated Event : ", updatedEvent);

    return res.status(200).json({
      success: true,
      message: "event updated successfully",
      updatedEvent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getEvent = async (req, res) => {
  try {
    const eventID = await req.params.id;
    const event = await Event.findById(eventID)
      .populate("category", "name")
      .populate("organizerId", "username email");
    if (!event) {
      return res.status(404).json({
        success: false,
        message: `event not found with id: ${eventID}`,
      });
    }

    console.log("event : ", event);

    const isCompleted = new Date(event.datetime) < new Date();

    return res.status(200).json({
      success: true,
      message: `event ${eventID} fetched successfully`,
      event: {
        ...event.toObject(),
        isCompleted: new Date(event.datetime) < new Date(),
        image: event.image?.secure_url || null,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const eventID = await req.params.id;
    const event = await Event.findByIdAndDelete(eventID);
    if (!event) {
      return res.status(404).json({
        success: true,
        message: `event not found with id: ${eventID}`,
      });
    }

    if (event.image?.public_id) {
      await cloudinary.uploader.destroy(event.image.public_id);
    }

    // Delete theme images from Cloudinary
    if (event.themes && event.themes.length > 0) {
      for (const theme of event.themes) {
        for (const img of theme.images) {
          if (img.public_id) {
            try {
              await cloudinary.uploader.destroy(img.public_id);
            } catch (e) {
              console.error("Failed to delete theme image:", e);
            }
          }
        }
      }
    }

    console.log("delete event : ", event);

    return res.status(200).json({
      success: true,
      message: `event deleted with id: ${eventID} successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const approveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "organizerId",
      "username email",
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "event not found",
      });
    }

    event.status = "approved";
    event.feedback = "";
    await event.save();

    return res.status(200).json({
      success: true,
      message: "Event approved successfully",
      event: {
        ...event._doc,
        image: event.image?.secure_url || null,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const rejectEvent = async (req, res) => {
  try {
    const { feedback } = req.body;
    console.log("feedback: ", feedback);
    const event = await Event.findById(req.params.id).populate(
      "organizerId",
      "username email",
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "event not found",
      });
    }

    event.status = "rejected";
    event.feedback = feedback || "no feedback provided";

    await event.save();

    return res.status(200).json({
      success: true,
      message: "event rejected",
      event: {
        ...event._doc,
        image: event.image?.secure_url || null,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyEvents = async (req, res) => {
  try {
    // This tells the browser/Postman: "Do not store this, always ask for a fresh copy"
    res.set("Cache-Control", "no-store");
    const events = await Event.find({ organizerId: req.user.id }).populate(
      "category",
      "name",
    );

    if (events.length == 0) {
      return res.status(404).json({
        success: false,
        message: "events not found",
      });
    }

    const updatedEvents = events.map((event) => ({
      ...event.toObject(),
      image: event.image?.secure_url || null,
    }));

    return res.status(200).json({
      success: true,
      message: "events fetched successfully",
      events: updatedEvents,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyEventsWithStats = async (req, res) => {
  try {
    const events = await Event.find({
      organizerId: req.user.id,
      status: "approved",
    }).populate("category", "name");

    if (events.length == 0) {
      return res.status(200).json({
        success: false,
        message: "no approved events found",
        events: [],
      });
    }

    const eventsWithStats = await Promise.all(
      events.map(async (event) => {
        const bookings = await Booking.find({
          eventId: event._id,
          status: "confirmed",
        });

        const totalRevenue = bookings.reduce(
          (total, booking) => total + booking.totalAmount,
          0,
        );

        return {
          ...event.toObject(),
          bookedSeats: event.totalSeats - event.availableSeats,
          totalRevenue,
        };
      }),
    );

    return res.status(200).json({
      success: true,
      message: "events with stats fetched successfully",
      events: eventsWithStats,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "pending" })
      .populate("organizerId", "username email")
      .populate("category", "name");

    if (events.length == 0) {
      return res.status(404).json({
        success: false,
        message: "no pending events found",
      });
    }

    const updatedEvents = events.map((event) => ({
      ...event._doc,
      image: event.image?.secure_url || null,
    }));

    return res.status(200).json({
      success: true,
      message: "pending events fetched successfully",
      events: updatedEvents,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getRejectedEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "rejected" })
      .populate("organizerId", "username email")
      .populate("category", "name");

    if (events.length == 0) {
      return res.status(404).json({
        success: false,
        message: "no pending events found",
      });
    }

    const updatedEvents = events.map((event) => ({
      ...event._doc,
      image: event.image?.secure_url || null,
    }));

    return res.status(200).json({
      success: true,
      message: "pending events fetched successfully",
      events: updatedEvents,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getEventProgress = async (req, res) => {
  try {
    const events = await Event.find({ status: "approved" })
      .sort({
        datetime: 1,
      })
      .populate("category", "name");
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 29, 999);

    const processedEvents = events.map((event) => {
      const eventDate = new Date(event.datetime);
      let progressStatus = "";
      let progressPercentage = 0;

      if (eventDate > endOfToday) {
        progressStatus = "Planned";
        progressPercentage = 30;
      } else if (eventDate >= startOfToday && eventDate <= endOfToday) {
        progressStatus = "Ongoing";
        progressPercentage = 70;
      } else {
        progressStatus = "Completed";
        progressPercentage = 100;
      }

      return {
        ...event._doc,
        image: event.image?.secure_url || null,
        progressStatus,
        progressPercentage,
        isCompleted: new Date(event.datetime) < new Date(),
      };
    });

    return res.status(200).json({
      success: true,
      count: processedEvents.length,
      data: processedEvents,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  getEvent,
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  approveEvent,
  rejectEvent,
  getMyEvents,
  getPendingEvents,
  getRejectedEvents,
  getMyEventsWithStats,
  getEventProgress,
};
