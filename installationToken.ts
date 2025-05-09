import "https://deno.land/x/dotenv/load.ts" 
import { App } from 'npm:@octokit/app'


const integrationId = Deno.env.get("APP_ID")
console.log(integrationId)

  // Initialize GitHub App
  const app = new App({
    appId: integrationId || "",
    privateKey: loadPrivateKey(), // Properly loaded key
  });
  
  // Function to load PEM file correctly
  function loadPrivateKey():string {
    try {
      // Deno.readFileSync returns Uint8Array, we need to decode it
      const keyData = Deno.readFileSync('pushshamer.2025-05-08.private-key.pem');
      const decoder = new TextDecoder('utf-8');
      const privateKey = decoder.decode(keyData);
      
      // Ensure proper PEM format
      if (!privateKey.includes('-----BEGIN RSA PRIVATE KEY-----')) {
        throw new Error('Invalid PEM format');
      }
      
      return privateKey;
    } catch (error) {
      console.error('Failed to load private key:', error);
      throw error;
    }
  }

  console.log(loadPrivateKey())
  
  // Main function to generate installation token
  export async function generateInstallationToken({owner, repo}: {owner: string, repo: string}): Promise<string> {
    try {
      
  
      // 2. Get installation ID
      const { data } = await app.octokit.request('GET /repos/{owner}/{repo}/installation', {
        owner,
        repo,
      });
      const installationId = data.id;
  
      // 3. Generate and return token
      const installationOctokit = await app.getInstallationOctokit(installationId);
      const { token } = await installationOctokit.auth({ type: 'installation' }) as { token: string };

       return token;
  
    } catch (error) {
      console.error('Token generation failed:', error);
      throw new Error(`Failed to generate token: ${error instanceof Error ? error.message : String(error)}`);
    }
  }