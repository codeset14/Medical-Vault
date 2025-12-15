/// <reference path="../pb_data/types.d.ts" />

routerAdd("POST", "/chatbot", async (c) => {
  try {
    // Read request body
    const body = await c.req.json();
    const userMessage = body.message;

    if (!userMessage) {
      return c.json(400, { error: "Message is required" });
    }

    // Read Gemini API key from environment variable
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return c.json(500, { error: "Gemini API key not set" });
}


    if (!GEMINI_API_KEY) {      

      return c.json(500, { error: "Gemini API key not configured" });
    }

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: userMessage }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    // Extract Gemini reply safely
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "No response from Gemini";

    return c.json(200, { reply });

  } catch (error) {
    return c.json(500, { error: error.message });
  }
});
