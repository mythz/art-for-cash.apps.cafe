import { AIReview, CanvasSize } from '../types';

interface GameContext {
  paintingCount: number;
  averageSalePrice: number;
  canvasSize: CanvasSize;
}

class AIService {
  async evaluatePainting(
    imageDataUrl: string,
    gameContext: GameContext
  ): Promise<AIReview> {
    // Convert base64 to appropriate format for Claude API
    const base64Data = imageDataUrl.split(',')[1];

    const prompt = `You are an AI art critic in a game where players paint and sell their artwork.

Analyze this painting and provide:
1. A fair price in coins (10-500 range, scaled by canvas size and quality)
2. Encouraging, specific feedback (2-3 sentences)
3. Ratings for composition, color use, creativity, and technical skill (1-10 each)

Context:
- Canvas size: ${gameContext.canvasSize.name} (${gameContext.canvasSize.width}x${gameContext.canvasSize.height})
- This is painting #${gameContext.paintingCount + 1}
- Average sale price: ${gameContext.averageSalePrice} coins

Be generous for early paintings, more discerning as the player progresses. Consider:
- Effort and detail visible
- Color harmony
- Composition and balance
- Use of canvas space
- Originality

Respond ONLY with valid JSON in this exact format (no markdown, no backticks):
{
  "price": <number between 10-500>,
  "feedback": "<encouraging feedback string>",
  "composition": <number 1-10>,
  "colorUse": <number 1-10>,
  "creativity": <number 1-10>,
  "technicalSkill": <number 1-10>
}`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'YOUR_API_KEY_HERE',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: 'image/png',
                    data: base64Data,
                  },
                },
                {
                  type: 'text',
                  text: prompt,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      let responseText = data.content[0].text;

      // Strip markdown formatting if present
      responseText = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const aiResponse = JSON.parse(responseText);

      return {
        price: aiResponse.price,
        feedback: aiResponse.feedback,
        analysisPoints: {
          composition: aiResponse.composition,
          colorUse: aiResponse.colorUse,
          creativity: aiResponse.creativity,
          technicalSkill: aiResponse.technicalSkill,
        },
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('AI evaluation error:', error);
      // Fallback pricing algorithm
      return this.generateFallbackReview(gameContext);
    }
  }

  private generateFallbackReview(gameContext: GameContext): AIReview {
    // Simple fallback based on canvas size and progression
    const basePrice = 20;
    const sizeMultiplier =
      (gameContext.canvasSize.width * gameContext.canvasSize.height) /
      (400 * 300);

    // Add bonus for early paintings
    const progressionBonus = Math.max(0, 5 - gameContext.paintingCount) * 5;

    const price = Math.floor(basePrice * sizeMultiplier + progressionBonus);

    // Vary feedback based on painting count
    const feedbackOptions = [
      "I appreciate your creative effort! Keep painting to improve your skills.",
      "This shows promise! I can see you're exploring different techniques.",
      "You're making progress! Your use of the canvas is developing nicely.",
      "I see potential in your work. Keep experimenting with colors and composition!",
      "Your artistic journey is underway! Each painting teaches you something new.",
    ];

    const feedback =
      feedbackOptions[gameContext.paintingCount % feedbackOptions.length];

    return {
      price: Math.max(10, Math.min(500, price)),
      feedback,
      analysisPoints: {
        composition: 5 + Math.floor(Math.random() * 3),
        colorUse: 5 + Math.floor(Math.random() * 3),
        creativity: 6 + Math.floor(Math.random() * 3),
        technicalSkill: 4 + Math.floor(Math.random() * 3),
      },
      timestamp: Date.now(),
    };
  }
}

export const aiService = new AIService();
