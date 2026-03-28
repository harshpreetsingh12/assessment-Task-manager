

// import { GoogleGenerativeAI } from "@google/generative-ai";
import { CONF } from "../config/var";
import Groq from "groq-sdk";
import { ITask } from "../models/Task.model";
import PROMPTS from "../config/prompts";

export class AIService {
  private client: Groq;

  constructor() {
    this.client = new Groq({ apiKey: CONF.GROQ_API_KEY });
  }


  private async *fakeSteam(text: string): AsyncGenerator<string> {
      const words = text.split(' ');
      for (const word of words) {
          await new Promise(res => setTimeout(res, 80)); // ~80ms per word
          yield word + " ";
      }
  }

  async streamDailyBriefing(tasks: ITask[], onChunk: (chunk: string) => void): Promise<void> {
      const taskListString = tasks
          .map((t, i) => {
              const due = t.taskDate
                  ? `Date: ${new Date(t.taskDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}`
                  : "No date";
              const desc = t.description ? `Note: ${t.description}` : "";
              return `${i + 1}. ${t.title} [Priority: ${t.priority}] [${due}]${desc ? ` — ${desc}` : ""}`;
          })
          .join("\n");

      const prompt = PROMPTS.SUMMARY_GEN(taskListString);

      if(tasks.length===0){
        // if no tasks calling fallback for generic message
         await this.buildFallbackSummary(tasks,onChunk);
        return 
      }
      try {
          const stream = await this.client.chat.completions.create({
              model: CONF.GROQ_MODELS,
              messages: [{ role: "user", content: prompt }],
              max_tokens: 300,
              stream: true,
          });

          for await (const chunk of stream) {
              const delta = chunk.choices[0]?.delta?.content ?? "";
                if (delta) {
                  await new Promise(res => setTimeout(res, 50)); // subtle delay to show streaming
                  onChunk(delta);
              }
          }

      } catch (error) {
          console.error("Groq Stream Error:", error);
         await this.buildFallbackSummary(tasks,onChunk);
      }
  }

  // fallback to generate generric summary if ai failes
  private async buildFallbackSummary(tasks: ITask[],onChunk: (chunk: string) => void): Promise<void> {
    const total = tasks.length;
    const high = tasks.filter(t => t.priority === "high").length;
    const overdue = tasks.filter(t => t.taskDate && new Date(t.taskDate) < new Date()).length;
  
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
  
    const fallBackmsg=parts.join(" ")

    const stream=this.fakeSteam(fallBackmsg)
    for await (const chunk of stream) {
      onChunk(chunk);
    }

  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await fetch(CONF.PYTHON_SERVICE_URI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      return data.embedding;
    } catch (error) {
      console.error("Python AI Service Error:", error);
      throw error;
    }
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

