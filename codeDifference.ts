import "https://deno.land/x/dotenv/load.ts";

interface PullRequest {
  diff_url: string;
}

export async function fetchPRDiff(pullRequest: PullRequest): Promise<string> {
  const diffUrl = pullRequest.diff_url;

  console.log(Deno.env.get("PERSONAL_ACCESS_TOKEN"))
  const response = await fetch(diffUrl, {
    headers: {
      Accept: "application/vnd.github.v3.diff",
      Authorization: `token ${Deno.env.get("PERSONAL_ACCESS_TOKEN")}`, // Replace with actual token handling
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch PR diff: ${response.statusText}`);
  }

  return await response.text();
}
