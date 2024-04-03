const express = require("express");
const router = express.Router();

const verifyAuth = require("../middlewares/authMiddleware");

const Feedback = require("../models/feedback");

router.post("/", verifyAuth, async (req, res) => {
  try {
    const { userId, typeOfFeedback, message } = req.body;

    if (!typeOfFeedback || !message) {
      return res.status(404).json({
        message: "Bad Request",
        success: false,
      });
    }

    let userFeedback = await Feedback.findOne({ user: userId });
    if (!userFeedback) {
      userFeedback = new Feedback({ user: userId });
    }

    userFeedback.feedbacks.push({ typeOfFeedback, message });

    await userFeedback.save();

    res.status(200).json({
      message: "Feedback sent successully",
      success: true,
    });
  } catch (error) {
    console.error("Error occured while posting feedback", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
