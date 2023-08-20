
//Variables 

var baseText  //Donde ira el Prompt
var seccionContracto


document.addEventListener("DOMContentLoaded", function () {
  const contractTypeSelect = document.getElementById("contractType");
  const contractTypeViews = document.getElementsByClassName("contractTypeView");
  const serviceTypeViews = document.getElementsByClassName("ServiceTypeView");
  const leaseTypeViews = document.getElementsByClassName("leaseTypeView");
  const tradeTypeViews = document.getElementsByClassName("tradeTypeView");
  const agreementTypeViews = document.getElementsByClassName("agreementTypeView");



  contractTypeSelect.addEventListener("change", function () {
    console.log('Ha cambiado algo');

     // Habilitar o deshabilitar el botón según la selección de contrato
     if (contractTypeSelect.value === "Selecciona una opción") {
      generarDescripcionButton.disabled = true; // Deshabilitar el botón
  } else {
      generarDescripcionButton.disabled = false; // Habilitar el botón
  }

    for (const contractTypeView of contractTypeViews) {
      if (contractTypeSelect.value === "Contrato de trabajo") {
        contractTypeView.style.display = "block";
      } else {
        contractTypeView.style.display = "none";
      }
    }

    for (const serviceTypeView of serviceTypeViews) {
      if (contractTypeSelect.value === "Contrato de servicios") {
        serviceTypeView.style.display = "block";
      } else {
        serviceTypeView.style.display = "none";
      }
    }
    for (const leaseTypeView of leaseTypeViews) {
      if (contractTypeSelect.value === "Contrato de arrendamiento") {
        leaseTypeView.style.display = "block";
      } else {
        leaseTypeView.style.display = "none";
      }
    }


    for (const tradeTypeView of tradeTypeViews) {
      if (contractTypeSelect.value === "Contrato de compraventa") {
        tradeTypeView.style.display = "block";
      } else {
        tradeTypeView.style.display = "none";
      }
    }

    for (const agreementTypeView of agreementTypeViews) {
      if (contractTypeSelect.value === "Acuerdo de confidencialidad") {
        agreementTypeView.style.display = "block";
      } else {
        agreementTypeView.style.display = "none";
      }
    }
  });
});

Office.onReady((info) => {
  if (info.host === Office.HostType.Word) {
    // Assign event handlers and other initialization logic.
    document.getElementById("generar-descripcion").onclick = () => tryCatch(generarDescripcion);
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
    //Obtiene el valor del tipo de Contrato y el pais seleccionados 
    var contractType = document.getElementById("contractType").value;
    var country = document.getElementById("country").value;
    try {

      if (contractType === "Contrato de servicios") { // Contrato de SERVICIOS
        // Variables específicas para "ServiceTypeView"
        var partesContratantes = document.getElementById("partesContratantes").value;
        var objetoContrato = document.getElementById("objetoContrato").value;
        var duracionContrato = document.getElementById("duracionContrato").value;
        var compromisoPago = document.getElementById("compromisoPago").value;
        var clausulaNoCompetencia = document.getElementById("clausulaNoCompetencia").value;
        var responsabilidadParte = document.getElementById("responsabilidadParte").value;
        var informacionContacto = document.getElementById("informacionContacto").value;
        var firmasPartes = document.getElementById("firmasPartes").value;
        baseText = `Task: Genera un documento para un contrato de Servicios que se radique con las leyes y lineamientos de ${country},ten en cuenta que debe contener las siguientes
         secciones (Dependiendo del tipo de trabajo, agrega las secciones que correspondan y se deban validar, por cada sección agrega un texto detallado), igualmente a 
         tener en cuenta el nombre de las contrapartes ${partesContratantes}, el objeto del contrato o sea la razon por la que se hace este contrato ${objetoContrato}, la 
         duracion del contrato ${duracionContrato}, compromiso de pago de las contrapartes ${compromisoPago},a lo mismo si se especifica una responsabilidad de 
         partes ${responsabilidadParte},una clausula de no competencia si aplica ${clausulaNoCompetencia}, informacion de las partes ${informacionContacto}, y 
         firmas ${firmasPartes}
        Topic: Contrato de servicios
        Style: Business
        Tone: Professional
        Length: 2000 words
        Format: Text`;
      } else if (contractType === "Contrato de trabajo") { // Contrato de TRABAJO
        var nombre = document.getElementById("nombre").value;
        var fechaInicio = document.getElementById("fechaInicio").value;
        var fechaFinal = document.getElementById("fechaFinal").value;
        var salario = document.getElementById("salario").value;
        var lugarTrabajo = document.getElementById("lugarTrabajo").value;
        var horario = document.getElementById("horario").value;
        var firma = document.getElementById("firma").value;
        baseText = `Task: Genera un documento para un contrato de trabajo que se radique con las leyes y lineamientos de ${country},
        ten en cuenta que debe contener las siguientes secciones (Dependiendo del tipo de trabajo, agrega las secciones que correspondan y se deban validar, por cada sección agrega un texto detallado):
        - Sección de Duración del Contrato
        - Persona que va a ser contratado: ${nombre}
        - Sección de Salario: ${salario}
        - Sección de Lugar de Trabajo: ${lugarTrabajo}
        - Sección de Horario: ${horario}
        - Sección de Firma: ${firma}
        No olvides las fechas de inicio ${fechaInicio} y de fin del contrato ${fechaFinal}
        Estas secciones deben detallarse con claridad y profesionalismo.
        Topic: Contrato de servicios
        Style: Business
        Tone: Professional
        Length: 2000 words
        Format: Text`;
      } else if (contractType === "Contrato de arrendamiento") {   // Contrato de ARRENDAMIENTO  
        // Variables específicas para "LeaseTypeView"
        var arrendamientoFechaInicio = document.getElementById("arrendamientoFechaInicio").value;
        var arrendamientoFechaFin = document.getElementById("arrendamientoFechaFin").value;
        var arrendamientoInquilino = document.getElementById("arrendamientoInquilino").value;
        var arrendamientoPropietario = document.getElementById("arrendamientoPropietario").value;
        var arrendamientoInmueble = document.getElementById("arrendamientoInmueble").value;
        var arrendamientoValorArriendo = document.getElementById("arrendamientoValorArriendo").value;
        var arrendamientoDuracionContrato = document.getElementById("arrendamientoDuracionContrato").value;
        var arrendamientoFirmas = document.getElementById("arrendamientoFirmas").value;

        baseText = `Task: Genera un documento para un contrato de Arrendamiento que se radique con las leyes y lineamientos de ${country},ten en cuenta que debe contener las siguientes
        secciones (Dependiendo del tipo de trabajo, agrega las secciones que correspondan y se deban validar, por cada sección agrega un texto detallado), igualmente a 
        tener en cuenta las fechas de inicio ${arrendamientoFechaInicio} y fin del contrato ${arrendamientoFechaFin}, el nombre del inquilino que va a tomar el
        inmueble ${arrendamientoInquilino}, el dueño del inmueble o la persona que lo arrienda ${arrendamientoPropietario}, el inmueble al que se hace referencia en el 
        contrato ${arrendamientoInmueble}, el valor que tendra el arriendo ${arrendamientoValorArriendo}, se entiende que este valor es mensual o el cual sea 
        especificado, teniendo en cuenta las fechas establecidas anteriormente y ${arrendamientoDuracionContrato} establecera la duracion del contrato, al finalizar 
        el documento los espacios para las firmas de las partes ${arrendamientoFirmas},
        Topic: Contrato de Arrendamiento
        Style: Business
        Tone: Professional
        Length: 2000 words
        Format: Text`;
      } else if (contractType === "Contrato de compra y venta") {   // Contrato de COMPRAVENTA

        // Variables específicas para "TradeTypeView"
        var ventaContrato = document.getElementById("ventaContrato").value;
        var ventaFecha = document.getElementById("ventaFecha").value;
        var ventaPartes = document.getElementById("ventaPartes").value;
        var ventaObjeto = document.getElementById("ventaObjeto").value;
        var ventaPrecio = document.getElementById("ventaPrecio").value;
        var ventaFormaPago = document.getElementById("ventaFormaPago").value;
        var ventaPlazoEntrega = document.getElementById("ventaPlazoEntrega").value;
        var ventaLugarEntrega = document.getElementById("ventaLugarEntrega").value;

        baseText = `Task: Genera un documento para un contrato de Compraventa que se radique con las leyes y lineamientos de ${country},ten en cuenta que debe contener las siguientes
        secciones (Dependiendo del tipo de trabajo, agrega las secciones que correspondan y se deban validar, por cada sección agrega un texto detallado), igualmente a 
        tener en cuenta el numero de venta ${ventaContrato}, la fecha del contrato ${ventaFecha}, el nombre de las partes que hacen parte de la venta 
         ${ventaPartes}, el onjeto que hace parte del contrato ${ventaObjeto}, igualmente es importante referenciar su precio ${ventaPrecio} y su forma de pago ${ventaFormaPago},
        el plazo de entrega del objeto ${ventaPlazoEntrega}, y el lugar acordado de ebtreega ${ventaLugarEntrega},
        Topic: Contrato de Compraventa
        Style: Business
        Tone: Professional
        Length: 2000 words
        Format: Text`;
      } else if (contractType === "Acuerdo de confidencialidad") {  // Contrato de ACUERDO DE CONFIDENCIALIDAD

        // Variables específicas para "AgreementTypeView"
        var identificacionPartes = document.getElementById("identificacionPartes").value;
        var objetoAcuerdo = document.getElementById("objetoAcuerdo").value;
        var duracionAcuerdo = document.getElementById("duracionAcuerdo").value;
        var clausulasAdicionales = document.getElementById("clausulasAdicionales").value;

        baseText = `Task: Genera un documento para un ACUERDO DE CONFIDENCIALIDAD que se radique con las leyes y lineamientos de ${country},ten en cuenta que debe contener las siguientes
        secciones (Dependiendo del tipo de trabajo, agrega las secciones que correspondan y se deban validar, por cada sección agrega un texto detallado), igualmente a 
        tener en cuenta los involucrados en el acuerdo ${identificacionPartes}, la razon de por que se hace este acuerdo de confidencialidad ${objetoAcuerdo}, 
        la duracion del acuerdo ${duracionAcuerdo}, si es necesario agregar clausulas adicionales sobre el acuerdo ${clausulasAdicionales},
        Topic: ACUERDO DE CONFIDENCIALIDAD
        Style: Business
        Tone: Professional
        Length: 2000 words
        Format: Text`;
      } else {
        baseText = `De qué se compone el contrato de ${contractType}`;
      }


      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${atob("c2stUjhaZXMxdm9tQmEwYjVZd0k3eElUM0JsYmtGSjlkTURFVVFCRXh0NHNZVGs1aVlx")}`);

      console.log("Token: " + atob("c2stUjhaZXMxdm9tQmEwYjVZd0k3eElUM0JsYmtGSjlkTURFVVFCRXh0NHNZVGs1aVlx"));
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


