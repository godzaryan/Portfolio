import { z } from "zod";

export const terminalLayoutSchema = z.object({
  layout: z.enum(["default", "bento", "list", "split"]),
  theme: z.enum(["obsidian", "emerald", "neon", "crimson"]),
  animationCurve: z.enum(["smooth", "snappy", "bounce", "glitch"]),
  components: z.array(
    z.object({
      type: z.enum(["text", "project_card", "socket_map", "code_compiler", "design_sandbox"]),
      content: z.any().optional(), // Flexible content depending on component type
      props: z.record(z.string(), z.any()).optional(), // Additional props for components
    })
  ),
  message: z.string().describe("A conversational response from the AI acting as the system."),
});

export type TerminalLayout = z.infer<typeof terminalLayoutSchema>;
