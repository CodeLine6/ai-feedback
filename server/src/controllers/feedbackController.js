const Feedback = require('../models/Feedback');
const { generateAIFeedback } = require('../utils/aiService');

const createFeedback = async (req, res) => {
  try {
    const { user_input } = req.body;
    const userId = req.user._id;

    // Generate AI feedback
    const feedback = await generateAIFeedback(user_input);

    // Save to database
    const feedbackDoc = new Feedback({
      userId,
      user_input,
      feedback
    });

    await feedbackDoc.save();

    res.status(201).json({
      success: true,
      message: 'Feedback generated successfully',
      data: {
        id: feedbackDoc._id,
        user_input: feedbackDoc.user_input,
        feedback: feedbackDoc.feedback,
        createdAt: feedbackDoc.createdAt
      }
    });
  } catch (error) {
    console.error('Feedback generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating feedback'
    });
  }
};

const getFeedbackHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const history = await Feedback.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('user_input feedback createdAt');

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching feedback history'
    });
  }
};

module.exports = {
  createFeedback,
  getFeedbackHistory
};