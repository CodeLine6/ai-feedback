const OpenAI = require('openai');
require('dotenv').config({ path: '.env.local' });

const a4fBaseUrl = 'https://api.a4f.co/v1';
const a4fApiKey = process.env.OPENAI_API_KEY;

// Initialize OpenAI (if using real API)
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: a4fApiKey,
  baseURL: a4fBaseUrl
}) : null;

const generateAIFeedback = async (userInput) => {
  try {
    if (openai) {
      // Real OpenAI API call
      const response = await openai.chat.completions.create({
        model: "provider-2/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a helpful AI assistant providing constructive feedback. 
            Analyze the user's input and provide specific, actionable feedback that:
            1. Highlights strengths
            2. Identifies areas for improvement
            3. Offers concrete suggestions
            4. Maintains an encouraging tone
            Keep your response concise but thorough (200-400 words).`
          },
          {
            role: "user",
            content: userInput
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      });

      return response.choices[0].message.content;
    } else {
      // Mock AI response for development
      return generateMockFeedback(userInput);
    }
  } catch (error) {
    console.error('AI service error:', error);
    return generateMockFeedback(userInput);
  }
};

const generateMockFeedback = (userInput) => {
  const feedbackTemplates = [
    `Your response shows good understanding of the topic. The ideas you've presented are clear and well-structured. To enhance your work further, consider adding more specific examples to support your points. Additionally, exploring different perspectives could strengthen your analysis. Overall, this is a solid foundation that demonstrates thoughtful consideration of the subject matter.`,
    
    `This is a thoughtful response that demonstrates analytical thinking. Your main arguments are compelling and logically presented. For improvement, try to provide more detailed explanations for your key points and consider potential counterarguments. The conclusion could be stronger with a more definitive stance. Keep up the good work in developing your ideas systematically.`,
    
    `Your input reflects creativity and original thinking. The approach you've taken is innovative and shows deep engagement with the material. To make this even stronger, consider organizing your thoughts with clearer transitions between ideas. Adding more supporting evidence would also enhance the credibility of your arguments. This shows excellent potential for further development.`
  ];
  
  const randomIndex = Math.floor(Math.random() * feedbackTemplates.length);
  return feedbackTemplates[randomIndex];
};

module.exports = {
  generateAIFeedback
};