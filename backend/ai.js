import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyDRVhZt-1xKKm3k2rnYM93aPqzR1gT6lnI" });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: "Tell me the score out of 9, you can give partial marks The problem is Write a python code which adds two number the code is, a =5 b=3 print(a+b discliamer, only score in 0 to 9 single digit nothing else ",
  });
  console.log(response.text);
}

main();