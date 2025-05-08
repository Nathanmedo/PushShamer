import { fetchPRDiff } from "./codeDifference.ts";
import { callAIModel } from "./model.ts";
import { makeRequest } from "./requestAsPromise.ts";
import "https://deno.land/x/dotenv/load.ts";

const access_token = Deno.env.get("PERSONAL_ACCESS_TOKEN")

function addComment (url :string, comment_body:string, token:string){
  return makeRequest(url, {
    method: 'POST',
    headers: {
      'Authorization': 'token ' + token,
      'User-Agent': 'ColinEberhardt',
      'Accept': 'application/vnd.github.machine-man-preview+json'
    },
    body: JSON.stringify({
      body: comment_body
    }),
});
}
  

const createAIReviewComment = (response: string, commit_message: string): string => {
  return `
### 🔍 AI Review of Your Commit

> 💬 **Commit Message:** \`${commit_message}\`

---

${response}

---

🤖 _If this looks wild, blame the bot._  
![Funny review reaction](https://media.giphy.com/media/3o7TKRwpns23QMNNiE/giphy.gif)
`;
};


const createAIIssueResponse = (response: string, issue_description: string): string => {
  return `
### 🔍 AI Response to your git issue

> 💬 **Issue description:** \`${issue_description}\`

---

${response}

---

🤖 _If this looks wild, blame the bot._  
![Funny review reaction](https://media.giphy.com/media/3o7TKRwpns23QMNNiE/giphy.gif)
`;
};

const validAction = (action:string):boolean =>{
  return ['opened', "synchronize", "reopened", "edited"].indexOf(action) !== -1;
}

async function handler(request: Request): Promise<Response>{
  const payload = await request.json(); //convert the request json to object
  console.log(payload)
  const action = payload.action;

  try{
      //validate the action type that it is correct
  if(!validAction(action)){
    return new Response("Invalid action type", { status: 400 });
  }
  //there cannot be a pull request and an issue at the same time
  if(payload.pull_request){
    const code = await fetchPRDiff(payload.pull_request)
    const pull_review = await callAIModel(code, "You are a code reviewer. Please review the code and provide feedback.")
    const comment = createAIReviewComment(pull_review || "No response", payload.pull_request.title)

    addComment(payload?.issue?.comments_url, comment, access_token || "")
    return new Response("OK", { status: 200 });
  }
  
  if(payload.issue){
    const issue_body = payload.issue.body;
    const issue_response = await callAIModel(issue_body, "You are expected to provide a response to the issue, and request any additional information if necessary")
    const comment = createAIIssueResponse(issue_response || "No response", payload?.issue?.id)

    addComment(payload?.issue?.comments_url, comment, access_token || "")
    return new Response("OK", { status: 200 }); 
  }
  }catch(error){
    console.log(error)
    throw new Error("Error calling AI model")
  }

  return new Response("OK", { status: 200 });
}

Deno.serve(handler)