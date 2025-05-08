import {JWTPayload, SignJWT} from "npm:jose"
import "https://deno.land/x/dotenv/load.ts" 
import { makeRequest } from "./requestAsPromise.ts";


const integrationId = Deno.env.get("APP_ID")
console.log(integrationId)
const secret = Deno.readFileSync('pushshamer.2025-05-08.private-key.pem')

async function createToken(payload: JWTPayload){
    const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(secret);

    return jwt
}

const token = createToken({iss: integrationId})

export async function generateInstallationToken(installationId: number){
    const url = `https://api.github.com/installations/${installationId}/access_tokens`
    const response = makeRequest(url, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'User-Agent': 'Nathanmedo',
            'Accept': 'application/vnd.github.machine-man-preview+json'
        },
    })
    const data = (await response).json()

    return data
}