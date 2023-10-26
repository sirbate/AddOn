// Función para generar la solicitud a OpenAI
const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey: atob("c2stNnQyNG5BZmw5TE1Ba253bWhXQU5UM0JsYmtGSmxkUlY4MkZ0UU12Z0RjZDFlcjZB"), // process.env["OPENAI_API_KEY"]
    dangerouslyAllowBrowser: true
  });
  
const generarSolicitud = (prompt) =>{
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${atob("c2stNnQyNG5BZmw5TE1Ba253bWhXQU5UM0JsYmtGSmxkUlY4MkZ0UU12Z0RjZDFlcjZB")}`);

    var raw = JSON.stringify({
        "model": "text-davinci-003",
        "prompt": prompt,
        "max_tokens": 1024,
        "temperature": 0.5,
        "n": 1
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    return fetch("https://api.openai.com/v1/completions", requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la llamada a la API: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .catch(error => {
            throw error; // Re-lanza el error para que sea manejado en la función que lo llama.
        });
}

async function createRequest(prompt, isStream = false) {
  const stream = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-3.5-turbo',
    stream: isStream
  });

  if (isStream) return stream;
  return stream.choices;
}


module.exports = {
    generarSolicitud,
    createRequest
};

