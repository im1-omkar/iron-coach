import type { Request, Response } from "express";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are a strict, no-nonsense AI mentor.

Rules:
- Be direct, blunt, and demanding.
- Call out weak reasoning and excuses.
- Do not be polite or reassuring.
- Force the user to think clearly.
- Always push for action.
- End every response with a concrete challenge.
`;

export default async function makeChat(req: Request, res: Response) {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "missing message" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.3,
      max_tokens: 400,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
    });

    const aiMessage = completion.choices[0]?.message?.content ?? "";
    return res.json({ response: aiMessage });
  } catch (err) {
    console.error("makeChat error:", err);
    return res.status(500).json({ error: "server error" });
  }
}
