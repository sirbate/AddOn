/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office, Word */

Office.onReady((info) => {
  if (info.host === Office.HostType.Word) {
    // Assign event handlers and other initialization logic.
    document.getElementById("generar-descripcion").onclick = () => tryCatch(generarDescripcion);
    //document.getElementById("sideload-msg").style.display = "none";
    //document.getElementById("app-body").style.display = "flex";
  }
});

/** Default helper for invoking an action and handling errors. */
async function tryCatch(callback) {
  try {
    await callback();
  } catch (error) {
    // Note: In a production add-in, you'd want to notify the user through your add-in's UI.
    console.error(error);
  }
}


// Función que se ejecuta al hacer clic en el botón "Generar Descripción"
async function generarDescripcion() {
  await Word.run(async (context) => {
    console.log("Ejecutando funcion generarDescripcion");
    // Obtener los valores seleccionados de las listas desplegables y el campo de texto
    //Tipo de Contrato
    var contractType = document.getElementById("contractType").value;
    var country = document.getElementById("country").value;
    var additionalData = document.getElementById("additionalData").value;
    var contractStyle = document.getElementById("contractStyle").value;
    var messageTone = document.getElementById("messageTone").value;

    try {
      var baseText = `Task: Genera un documento para un ${contractType} que se radique con las leyes y lineamientos de ${country} ,
       ten en cuenta que debe contener las siguientes secciones (Dependiendo del tipo de trabajo, agrega las secciones que correspondan y se deban validar, por cada seccion agrega un texto detallado),
       que sea un documento que se use en grandes empresas, cada seccion debe detallarse con claridad y profesional
      Topic: ${additionalData} /n
      Style: ${contractStyle} /n
      Tone: ${messageTone} /n
      Format: plain text`;

      var baseText22 = `Dame un un documento para un ${contractType} que se radique con las leyes y lineamientos de ${country} , ten en cuenta que debe 
      contener las siguientes secciones (Dependiendo del tipo de trabajo, agrega las secciones que creas pertinentes), igualmente ten en cuenta esta información 
      adicional ${additionalData}, el contrato debe ser en un estilo ${contractStyle} y en un tono ${messageTone} para los interesados, lo demas en su formato correspondiente, en 
      español. Detallado cada una de las secciones, que llame la atencion y ${contractStyle}`;
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${atob("c2stUjhaZXMxdm9tQmEwYjVZd0k3eElUM0JsYmtGSjlkTURFVVFCRXh0NHNZVGs1aVlx")}`);

      console.log("Token: "+ atob("c2stUjhaZXMxdm9tQmEwYjVZd0k3eElUM0JsYmtGSjlkTURFVVFCRXh0NHNZVGs1aVlx"));
      var raw = JSON.stringify({
        "model": "text-davinci-003",
        "prompt": baseText,
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

      console.log("Data a enviar: " + JSON.stringify(requestOptions));
      
      fetch("https://api.openai.com/v1/completions", requestOptions)
        .then(response => response.json())
        .then(function (result) {

          Office.context.document.setSelectedDataAsync(result.choices[0].text.trim(), { coercionType: Office.CoercionType.Text });
        })
        .catch(error => mostrarMensaje('error', error));

    } catch (error) {
      console.log("LLEGO ERROR")
      // Mostrar el error en el label de depuración
      mostrarMensaje('Error en la petición: ' + error.message);
    }

    await context.sync();
  });
}


// Función para mostrar mensajes de depuración en el label
function mostrarMensaje(mensaje) {
  var labelDepuracion = document.getElementById('labelDepuracion');
  labelDepuracion.textContent = mensaje;
}
