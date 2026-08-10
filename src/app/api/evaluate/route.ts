import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { formDataSchema, evaluationResponseSchema } from "@/lib/schemas";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompt-builder";
import { getWeightingInstructions } from "@/lib/weighting";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const formData = formDataSchema.parse(body);

    const weightingInstructions = getWeightingInstructions(
      formData.businessType || formData.industry || "general"
    );
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(formData, weightingInstructions);

    const message = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 16000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return Response.json(
        { error: "No response received from AI. Please try again." },
        { status: 502 }
      );
    }

    let jsonStr = textBlock.text.trim();
    // Strip markdown fences if present
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(jsonStr);
    const validated = evaluationResponseSchema.parse(parsed);

    return Response.json(validated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const isInputError = error.issues.some((e) =>
        ["companyName", "offering", "audience", "problem", "secretSauce"].includes(
          String(e.path[0])
        )
      );
      if (isInputError) {
        return Response.json(
          { error: "Please fill in all required fields.", details: error.issues },
          { status: 400 }
        );
      }
      // Schema validation of LLM output failed
      console.error("LLM output validation failed:", error.issues);
      return Response.json(
        { error: "The AI returned an unexpected format. Please try again." },
        { status: 502 }
      );
    }

    if (error instanceof SyntaxError) {
      console.error("JSON parse error from LLM response");
      return Response.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 502 }
      );
    }

    if (error instanceof Anthropic.APIError) {
      console.error("Anthropic API error:", error.status, error.message);
      if (error.status === 429) {
        return Response.json(
          { error: "Rate limited. Please wait a moment and try again." },
          { status: 429 }
        );
      }
      return Response.json(
        { error: "AI service temporarily unavailable. Please try again." },
        { status: 502 }
      );
    }

    console.error("Evaluation error:", error);
    return Response.json(
      { error: "Something went wrong while evaluating this idea. Please try again." },
      { status: 500 }
    );
  }
}
