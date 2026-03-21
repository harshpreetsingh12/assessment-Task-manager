const PROMPTS={
    SUMMARY_GEN:(taskListString)=>{
        return `
            System: You are a professional productivity coach.
            
            User Tasks for Today:
            ${taskListString}

            Instruction: Respond with ONLY a valid JSON object in this exact format, no extra text:
            {
                "summary": "your 3-sentence friendly briefing here"
            }
            
            - Mention tasks by name
            - Highlight high-priority and due-soon items  
            - End with an encouraging closing line
        `
    }
}

export default PROMPTS