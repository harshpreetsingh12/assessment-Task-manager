

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


  private async *fakeStream(text: string): AsyncGenerator<string> {
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

    const stream=this.fakeStream(fallBackmsg)
    for await (const chunk of stream) {
      onChunk(chunk);
    }

  }

    async generateEmbedding(text: string): Promise<number[]> {
      try {
      const response = await fetch(
       CONF.HUGGING_FACE_EMBEDDINGS,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: text }),
        }
      );
    
      const data = await response.json();

      // const response = await fetch(process.env.PYTHON_SERVICE_URI, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ text }),
      // });

      // const data = await response.json();
      // return data.embedding;
      return data;
    } catch (error) {
      console.error("Python AI Service Error:", error);
      throw error;
    }
  }
  async streamChatResponse(
      userQuestion: string, 
      retrievedTasks: any[], 
      onChunk: (chunk: string) => void
    ): Promise<void> {
        //  Format retrieved tasks into a string for the prompt
        const contextString = retrievedTasks
            .map((t, i) => {
                const status = t.status ? `[Status: ${t.status}]` : "";
                const desc = t.description ? ` - ${t.description}` : "";
                return `${i + 1}. ${t.title} ${status}${desc}`;
            })
            .join("\n");

        const prompt = PROMPTS.CHAT_ASSISTANT(userQuestion, contextString);

        // console.log(userQuestion,contextString)
        // Handle empty results case
        if (retrievedTasks.length === 0) {
            const fallBackmsg="I couldn't find any tasks related to that request. Try rephrasing or adding more details!"
            const stream=this.fakeStream(fallBackmsg)
            for await (const chunk of stream) {
              onChunk(chunk);
            }
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
                    await new Promise(res => setTimeout(res, 30)); 
                    onChunk(delta);
                }
            }
        } catch (error) {
            console.error("Groq Chat Stream Error:", error);
            const stream=this.fakeStream("I ran into a bit of trouble accessing your tasks right now. Please try again in a moment.")
            for await (const chunk of stream) {
              onChunk(chunk);
            }
        }
    }
    
}

export const aiService = new AIService();

