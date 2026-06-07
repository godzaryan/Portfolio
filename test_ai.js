import { createGroq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
  try {
    const res = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      schema: z.object({ response: z.string() }),
      prompt: "Hello"
    });
    console.log(res.object);
  } catch(e) {
    console.error("GROQ ERROR:", e);
  }
}
main();
