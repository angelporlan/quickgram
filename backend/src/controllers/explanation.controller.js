import OpenAI from "openai";
import { UserExerciseAttempt } from "../models/UserExerciseAttempt.js";
import { Exercise } from "../models/Exercise.js";
import { AttemptExplanation } from "../models/AttemptExplanation.js";
import { checkAndConsumeAiUsage } from "../services/aiUsage.service.js";
import { User } from "../models/User.js";

const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
});

export const explainAttempt = async (req, res) => {
    try {
        const userId = req.user.id;
        const attemptId = req.params.id;

        const attempt = await UserExerciseAttempt.findOne({
            where: {
                id: attemptId,
                user_id: userId
            },
            include: {
                model: Exercise,
                as: 'exercise'
            }
        });

        if (!attempt) {
            return res.status(404).json({ message: "Attempt not found" });
        }

        if (attempt.is_fully_correct) {
            return res.json({
                explanation: "Your answer is fully correct. No explanation needed 🎉",
                cached: true
            });
        }

        const cachedExplanation = await AttemptExplanation.findOne({
            where: { attempt_id: attempt.id }
        });

        if (cachedExplanation) {
            return res.json({
                explanation: cachedExplanation.explanation,
                cached: true
            });
        }

        const user = await User.findByPk(userId);

        const usageCheck = await checkAndConsumeAiUsage(user, { dryRun: true });

        if (!usageCheck.allowed) {
            return res.status(403).json({
                message: "Daily AI explanation limit reached",
                limit: usageCheck.limit
            });
        }

        let prompt = '';
        const systemPromptJson = `
You are an English B2 exam teacher.

Output requirements:
- Return the explanation in strict JSON format.
- Structure:
{
  "general_feedback": "string (motivational feedback + summary of performance)",
  "corrections": [
    {
        "question_id": number (the gap id),
        "status": "correct" | "incorrect",
        "user_answer": "string",
        "correct_answer": "string",
        "explanation": "string (concise grammar/vocabulary rule)"
    }
  ]
}
`;

        const systemPromptHtml = `
You are an English B2 exam teacher.

Output requirements:
- Return the explanation ONLY in HTML
- Use semantic HTML tags (div, p, ul, li, strong)
- Include inline CSS styles (do NOT use external styles or classes)
- Structure the response with clear sections:
  - Title
  - Why it's incorrect
  - Correct answer
  - Explanation
- Use simple, readable styling (fonts, spacing, colors)
- Do NOT include markdown
- Do NOT include explanations outside the HTML
`;

        const isMultipleChoice = attempt.exercise.type === 'multiple_choice' || attempt.exercise.type === 'multiple-choice';

        if (isMultipleChoice) {
            prompt = `
${systemPromptJson}

Exercise:
${attempt.exercise.question_text}

Correct answer:
${attempt.exercise.correct_answer}

Student answer:
${JSON.stringify(attempt.user_answer)}

Explain clearly why the student answer is wrong and what the correct option is for each incorrect gap.
`;
        } else {
            prompt = `
${systemPromptHtml}

Exercise:
${attempt.exercise.question_text}

Correct answer:
${attempt.exercise.correct_answer}

Student answer:
${JSON.stringify(attempt.user_answer)}

Explain clearly:
- Why the student answer is wrong
- What the correct option is
- Give a short grammar or vocabulary explanation
- Keep it concise and easy to understand
`;
        }


        const completion = await openai.chat.completions.create({
            model: "tngtech/deepseek-r1t2-chimera:free",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.4
        });

        const explanationText = completion.choices[0].message.content;

        const finalUsage = await checkAndConsumeAiUsage(user);

        await AttemptExplanation.create({
            attempt_id: attempt.id,
            explanation: explanationText,
            model: "tngtech/deepseek-r1t2-chimera:free"
        });

        return res.json({
            explanation: explanationText,
            cached: false,
            remaining: finalUsage.remaining
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error generating explanation" });
    }
};
