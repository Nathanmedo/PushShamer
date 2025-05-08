import {OpenAI} from "npm:openai"
import "https://deno.land/x/dotenv/load.ts"


const token = Deno.env.get("PERSONAL_ACCESS_TOKEN");
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";


export async function callAIModel(input: string, content:string){
    const client = new OpenAI({
        baseURL: endpoint,
        apiKey: token
    })

    try{
        const response = await client.chat.completions.create({
            model,
            messages: [
                { role: "system", content},
                { role: "user", content: input }
              ],
            temperature: 0.2,
            top_p: 1
        })
    
        console.log(response.choices[0].message.content);
    
        const result = response.choices[0].message.content;
    
        return result
    }catch(err){
        console.log(err)
        throw new Error("Error calling AI model")
    }
}