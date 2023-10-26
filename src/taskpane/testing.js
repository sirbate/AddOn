var { generarSolicitud, createRequest } = require('./Javascript/openai');
const MarkdownIt = require('markdown-it');
const HTMLParser = require('html-to-json-parser');
var DOMParser = require('xmldom').DOMParser;
var parser = new DOMParser({
    errorHandler: {
        warning: function (w) { },
        error: function (e) { },
        fatalError: function (e) { console.error(e) }
    }
});

const md = new MarkdownIt();

const testGenerateContract = function () {

    var prompt = `
Task: Genera un documento para un Services contract que se radique con las leyes y lineamientos de co,ten en cuenta que debe contener las siguientes
     secciones (agrega las secciones que correspondan y se deban validar, por cada sección agrega un texto detallado,  ), igualmente a 
     tener en cuenta el nombre de las contrapartes , el objeto del contrato o sea la razon por la que se hace este contrato , la 
     duracion del contrato , compromiso de pago de las contrapartes ,a lo mismo si se especifica una responsabilidad de 
     partes,una clausula de no competencia si aplica , informacion de las partes , y 
     firmas, quiero que el documento tenga titulos grandes, e identicados, en negrita y los detalles que requieras con estilos
    Topic: Services contract 
    Style: Business
    Tone: Professional
    Length: 1000 words
    Format: Markdown
`;
    try {
        createRequest(prompt).then(choices => {

            const text = choices[0].message.content;
            console.log(text);
            var md = new MarkdownIt();
            var result = md.parse(text);
            console.log("----------------------");
            console.log(result);
            console.log("----------------------");


        }).catch(err => {
            console.log(err);
        });

    } catch (error) {
        console.error('Error en la generación y muestra del contrato:', error);
        // Mostrar el error en el label de depuración
        console.log('Error en la petición: ' + error.message);
    }
}

const testMd2object = () => {
    const text = `# **Contrato de Servicios**

## **Introducción**
Este Contrato de Servicios (en adelante, "Contrato") se celebra entre [Nombre del Cliente] (en adelante, "Cliente") y [Nombre del Proveedor] (en adelante, "Proveedor") con el objetivo de establec
er los términos y condiciones para la prestación de servicios por parte del Proveedor al Cliente.

## **1. Contrapartes**
Las contrapartes del presente Contrato son:

**Cliente:**

- Nombre: [Nombre del Cliente]
- Dirección: [Dirección del Cliente]
- Ciudad: [Ciudad del Cliente]
- País: [País del Cliente]
- Teléfono: [Teléfono del Cliente]
- Correo Electrónico: [Correo Electrónico del Cliente]

**Proveedor:**

- Nombre: [Nombre del Proveedor]
- Dirección: [Dirección del Proveedor]
- Ciudad: [Ciudad del Proveedor]
- País: [País del Proveedor]
- Teléfono: [Teléfono del Proveedor]
- Correo Electrónico: [Correo Electrónico del Proveedor]

## **2. Objeto del Contrato**
El objeto de este Contrato es la prestación de los siguientes servicios por parte del Proveedor al Cliente:

[Descripción detallada de los servicios a ser prestados]

## **3. Duración del Contrato**
La duración de este Contrato será de [Duración del Contrato] a partir de la fecha de firma del mismo, a menos que sea terminado de acuerdo a las disposiciones establecidas en la sección 7 de este
 Contrato.

## **4. Compromiso de Pago**
El Cliente se compromete a realizar los pagos correspondientes a los servicios prestados por el Proveedor según los términos y condiciones establecidos en la sección de pagos adjunta a este Contr
ato.

## **5. Responsabilidad de las Partes**
- El Proveedor se compromete a realizar los servicios de manera profesional y competente, de acuerdo con las mejores prácticas de la industria.
- El Cliente se compromete a proporcionar al Proveedor toda la información, documentos y recursos necesarios para la correcta prestación de los servicios.

## **6. Clausula de No Competencia**
Ambas partes acuerdan que durante la vigencia de este Contrato y por un período de [Período de No Competencia] posterior a su terminación, ninguna de las partes competirá directamente con los ser
vicios prestados por la otra parte en el área geográfica en la que se realiza esta prestación de servicios.

## **7. Terminación del Contrato**
Este Contrato puede ser terminado por cualquiera de las partes mediante notificación por escrito a la otra parte con [Periodo de Notificación para Terminación] de antelación. Ambas partes deberán
 cumplir con todos los compromisos pendientes antes de la fecha de terminación.

## **8. Información Confidencial**
Cada parte se compromete a mantener la confidencialidad de la información confidencial revelada por la otra parte en relación con este Contrato. La información confidencial no podrá ser divulgada
 a terceros sin el consentimiento previo y por escrito de la parte que la reveló.

## **9. Ley Aplicable y Jurisdicción**
Este Contrato se regirá e interpretará de acuerdo con las leyes del [País], y cualquier disputa relacionada con este Contrato estará sujeta a la jurisdicción exclusiva de los tribunales de [Ciuda
d].

## **10. Firma**
Este Contrato puede ser firmado en [Número de Copias a Firmar] copias, cada una de las cuales se considerará un original, con el mismo efecto que si se hubiera firmado el contrato completo.      

Aceptado y firmado por:

**Cliente:**

__________________________
Nombre: [Nombre del Cliente]
Fecha: [Fecha de Firma]

**Proveedor:**

__________________________
Nombre: [Nombre del Proveedor]`;

    var result = md.render(text, {});
    result = "<div>" + result + "</div>";
    var document = parser.parseFromString(result, 'text/xml');

    HTMLParser.default(document, true).then(parsedHtml => {
        const jsonContent = JSON.parse(parsedHtml);
        const jsonParsed = recursiveParser(jsonContent);
        console.log(jsonParsed);
    })

}

const recursiveParser = (obj) => {
    const result = [];
    if (obj.content && Array.isArray(obj.content)) {
        obj.content.forEach((item) => {
            if (typeof item === "string") {
                result.push({
                    type: obj.type ? obj.type : '',
                    content: item
                });
            } else if (typeof item === "object") {
                const subResult = recursiveParser(item); // Llamada recursiva para objetos anidados
                if (!subResult) return
                subResult.forEach(value => {
                    result.push(value);
                })
            }
        });
    }

    return result;
}

testMd2object();