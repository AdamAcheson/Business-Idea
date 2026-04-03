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

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullText = "";

          const messageStream = anthropic.messages.stream({
            model: "claude-sonnet-4-20250514",
            max_tokens: 8192,
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }],
          });

          messageStream.on("text", (text) => {
            fullText += text;
            // Send token count progress to client
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "progress", tokens: fullText.length })}\n\n`
              )
            );
          });

          const finalMessage = await messageStream.finalMessage();

          // Parse and validate the complete response
          let jsonStr = fullText.trim();
          if (jsonStr.startsWith("```")) {
            jsonStr = jsonStr
              .replace(/^```(?:json)?\n?/, "")
              .replace(/\n?```$/, "");
          }

          const parsed = JSON.parse(jsonStr);
          const validated = evaluationResponseSchema.parse(parsed);

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "done", data: validated })}\n\n`
            )
          );
          controller.close();
        } catch (error) {
          let errorMessage =
            "Something went wrong while evaluating this idea. Please try again.";

          if (error instanceof z.ZodError) {
            const isInputError = error.issues.some((e) =>
              [
                "companyName",
                "offering",
                "audience",
                "problem",
                "secretSauce",
              ].includes(String(e.path[0]))
            );
            errorMessage = isInputError
              ? "Please fill in all required fields."
              : "The AI returned an unexpected format. Please try again.";
          } else if (error instanceof SyntaxError) {
            errorMessage = "Failed to parse AI response. Please try again.";
          } else if (error instanceof Anthropic.APIError) {
            errorMessage =
              error.status === 429
                ? "Rate limited. Please wait a moment and try again."
                : "AI service temporarily unavailable. Please try again.";
          }

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", error: errorMessage })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }
    console.error("Evaluation error:", error);
    return Response.json(
      {
        error:
          "Something went wrong while evaluating this idea. Please try again.",
      },
      { status: 500 }
    );
  }
}
