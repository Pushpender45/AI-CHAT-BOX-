import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
    const list = await groq.models.list();
    console.log(JSON.stringify(list, null, 2));
}

main();
