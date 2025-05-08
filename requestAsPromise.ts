import "https://deno.land/x/dotenv/load.ts"

export function makeRequest(url :string, options: RequestInit) :Promise<Response> {
  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          reject(new Error(`HTTP error! status: ${response.status}`));
        } else {
          resolve(response);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });

}

// makeRequest("https://jsonplaceholder.typicode.com/posts/1", { method: "GET"})
// .then(async(response)=> {
//     const data = await response.json();
//     console.log(data);
// })
