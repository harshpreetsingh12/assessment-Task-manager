

// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { ITask } from "../models/Task.model";
import { CONF } from "../config/var";
import Groq from "groq-sdk";
import { ITask } from "../models/Task.model";
import PROMPTS from "../config/prompts";

export class AIService {
  private client: Groq;

  constructor() {
    this.client = new Groq({ apiKey: CONF.GROQ_API_KEY });
  }

  async generateDailyBriefing(tasks: ITask[]): Promise<string> {
    const taskListString = tasks
        .map((t, i) => {
            const due = t.dueDate
            ? `Due: ${new Date(t.dueDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}`
            : "No due date";

            const desc = t.description ? `Note: ${t.description}` : "";

            return `${i + 1}. ${t.title} [Priority: ${t.priority}] [${due}]${desc ? ` — ${desc}` : ""}`;
        })
        .join("\n");

   const prompt = PROMPTS.SUMMARY_GEN(taskListString)

    try {
        const completion = await this.client.chat.completions.create({
            model: CONF.GROQ_MODELS,
            messages: [{ role: "user", content: prompt }],
            max_tokens: 300,
        });
        const raw = completion.choices[0].message.content!;
        try {
            const parsed = JSON.parse(raw);
            return parsed.summary;
        } catch (parseError) {
            // LLM returned malformed JSON — build a local fallback
            console.warn("JSON parse failed, using fallback summary");
            return this.buildFallbackSummary(tasks);
        }

    } catch (error) {
        console.error("Groq API Error:", error);
        //   throw new Error("Failed to communicate with AI service.");
        return this.buildFallbackSummary(tasks); // sending custom summary for response
    }
  }

  // fallback to generate generric summary if ai failes
  private buildFallbackSummary(tasks: ITask[]): string {
    const total = tasks.length;
    const high = tasks.filter(t => t.priority === "high").length;
    const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date()).length;
  
    const parts: string[] = [];
  
    parts.push(
      total === 0
        ? "Your task list is clear — a perfect time to plan ahead."
        : `You have ${total} task${total > 1 ? "s" : ""} on your plate today.`
    );
  
    if (high > 0)
      parts.push(`${high} high-priority item${high > 1 ? "s" : ""} need${high === 1 ? "s" : ""} your attention first.`);
  
    if (overdue > 0)
      parts.push(`${overdue} task${overdue > 1 ? "s are" : " is"} overdue — tackle ${overdue > 1 ? "those" : "that"} soon.`);
  
    parts.push("Stay focused — you've got this!");
  
    return parts.join(" ");
  }

}


// export class AIService {
//   private genAI: GoogleGenerativeAI;
//   private model: any;

//   constructor() {
//     this.genAI = new GoogleGenerativeAI(CONF.GEMINI_API_KEY!);
//     this.model = this.genAI.getGenerativeModel({ model: CONF.MODEL_NAME_GEMINI });
//   }

//   /**
//    * Generates a plain-English briefing based on task data
//    */
//   async generateDailyBriefing(tasks: ITask[]): Promise<string> {
//     const taskListString = tasks
//       .map((t, i) => `${i + 1}. ${t.title} [Priority: ${t.priority}]`)
//       .join("\n");

//     const prompt = `
//       System: You are a professional productivity coach.
//       User Tasks for Today:
//       ${taskListString}

//       Instruction: Provide a friendly, concise 3-sentence daily briefing. 
//       Highlight high-priority items and be encouraging.
//     `;
//     // LLM Call
//     try {
//       const result = await this.model.generateContent(prompt);
//       const response = await result.response;
//       return response.text();
//     } catch (error) {
//       console.error("Gemini API Error:", error);
//       throw new Error("Failed to communicate with AI service.");
//     }
//   }
// }

export const aiService = new AIService();
