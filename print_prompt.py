text = """Update the chat initialization to use the exact correct Google Gen AI SDK constructor:
     ```javascript
     const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
     const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
     ```"""
print(text)
