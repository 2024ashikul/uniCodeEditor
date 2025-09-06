import { API_URL } from "./config";

export async function sendAIRequest(route, prompt) {
  try {
    const response = await fetch(`${API_URL}/${route}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Request failed:", error);
    return { error: true, message: error.message };
  }
}