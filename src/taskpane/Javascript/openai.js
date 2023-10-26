// Función para generar la solicitud a OpenAI
const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey: atob("c2stNnQyNG5BZmw5TE1Ba253bWhXQU5UM0JsYmtGSmxkUlY4MkZ0UU12Z0RjZDFlcjZB"), // process.env["OPENAI_API_KEY"]
    dangerouslyAllowBrowser: true,
});

async function OpenAiRequest(prompt, isStream = false) {
    const stream = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
        max_tokens: 1024,
        stream: isStream
    });

    if (isStream) return stream;
    return stream.choices[0].message.content;
}

module.exports = {
    OpenAiRequest
};

