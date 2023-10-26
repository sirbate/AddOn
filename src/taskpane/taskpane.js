const { OpenAiRequest, generarSolicitud  } = require('./Javascript/openai');
const { recursiveParser } = require('./Javascript/Md2json');
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

/**
* Función que se ejecuta al iniciar la aplicación web.
*/
$(document).ready(function () {

  // Variables globales
  var G_LANG_DOM = {
    lang: "es",
    dom: []
  };
  var G_LANG_MESSAGES = { "en": {}, "es": {} };

  // estilos para mostrar el nombre de la empresa
  var cssRule =
    "color: #018ada;" +
    "font-size: 72px;" +
    "font-weight: bold;" +
    "text-shadow: 1px 1px 5px #018ada;" +
    "filter: dropshadow(color=#018ada, offx=1, offy=1);";


  // mostramos los datos de la empresa
  console.log("%cSINOVA S.A.S.", cssRule);

  // mostramos el vínculo de sinova
  console.log("https://www.sinova.co/");

  // Inicializa los eventos del aplicativo
  //initComponents_();
  Office.onReady((info) => {
    if (info.host === Office.HostType.Word) {
      initComponents_();
    }
  });

  // Permite cerrar todos los popover
  $("html").on("mouseup", function (e) {
    var $ele_ = $(e.target);
    if ($ele_.length > 0 && $ele_[0].className.indexOf("popover") == -1) {
      $(".popover").each(function () {
        $(this).popover("hide");
      });
    }
  });

  /*
  * Permite inicializar los eventos de la plantilla 
  */
  function initComponents_() {

    // Ocultamos el panel de tareas
    $("#pnlOtherFields").hide();
    $("#sltSections").removeAttr("required");

    // Iniciamos el campo de select
    $("#sltCountriesApp").selectpicker().on('changed.bs.select', updateLangInterface_);

    // Asignamos el evento      
    $(document).on("click", ".popover .popover__close", function () {
      $(this).parents(".popover").popover('hide');
    });

    //Mostramos el loading
    SnvaJsApi.toggleLoading(false, "Setting language...");

    // obtenemos los datos de parametros para el formulario de creación de citas
    runInitialValues();
    //google.script.run.withSuccessHandler(loadSettingsValues_).withFailureHandler(SnvaJsApi.onFailure).getSettingValues();

    // Agregamos ele evento al formulario
    //$("#frmGenerateFormat").submit(generateFormat_);

    // Definimos las opciones base del mensaje de notificacion
    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-top-full-width",
      "preventDuplicates": true,
      "onclick": null,
      "showDuration": "1000",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "hideMethod": "fadeOut"
    };
  }

  function runInitialValues() {
    var response_ = { "countries": [{ "lang": "es", "value": "co", "text": "Colombia" }, { "lang": "es", "value": "mx", "text": "México" }, { "lang": "es", "value": "es", "text": "España" }, { "lang": "en", "value": "us", "text": "Estados unidos" }], "initValues": { "country": "co", "section": ["Introduction", "Definitions", "Obligations of the parties", "duration and termination", "Remuneration", "Responsibility", "confidentiality", "Intellectual property", "Guarantee", "notifications", "Jurisdiction and applicable laws"], "fields": ["Carlos", "2023-08-21", "2023-10-20", "546456748", "Ubate", "Lunes", "Trabajar", "Carlos"], "contractType": "Work contract" }, "contractType": { "en": [{ "value": "Work contract", "text": "Work contract" }, { "value": "Services contract", "text": "Services contract" }, { "value": "Leasing contract", "text": "Leasing contract" }, { "value": "Sales contract", "text": "Sales contract" }, { "value": "Confidentiality agreement", "text": "Confidentiality agreement" }], "es": [{ "value": "Work contract", "text": "Contrato de trabajo" }, { "value": "Services contract", "text": "Contrato de servicios" }, { "value": "Leasing contract", "text": "Contrato de arrendamiento" }, { "value": "Sales contract", "text": "Contrato de compraventa" }, { "value": "Confidentiality agreement", "text": "Acuerdo de confidencialidad" }] }, "langOptions": { "optionSelect": { "en": "Select an option", "es": "Seleccione una opción" }, "optionAllBox": { "en": "Select All", "es": "Seleccionar todo" }, "dom": [{ "en": "Please select the values ​​in the fields below in order to create the desired contract.", "es": "Por favor, selecciona los valores en los campos a continuación para poder crear el contrato deseado.", "tag": "{{lang-description}}" }, { "en": "Select contract type:", "es": "Seleccionar tipo de contrato:", "tag": "{{lang-contract-type}}" }, { "en": "Select the country:", "es": "Seleccione el pais:", "tag": "{{lang-country-label}}" }, { "en": "Spanish", "es": "Español", "tag": "{{lang-app-es}}" }, { "en": "English", "es": "Ingles", "tag": "{{lang-app-en}}" }, { "en": "Spain", "es": "España", "tag": "{{lang-country-es}}" }, { "en": "Mexico", "es": "México", "tag": "{{lang-country-mx}}" }, { "en": "United States", "es": "Estados unidos", "tag": "{{lang-country-us}}" }, { "en": "Select one or more sections:", "es": "Seleccione una o varias secciones:", "tag": "{{lang-section}}" }, { "en": "Enter additional data:", "es": "Ingresa datos adicionales:", "tag": "{{lang-topic}}" }, { "en": "Select a style:", "es": "Seleccione el estilo:", "tag": "{{lang-style}}" }, { "en": "Select a tone:", "es": "Seleccione el tono:", "tag": "{{lang-tone}}" }, { "en": "Select country:", "es": "Seleccione el pais:", "tag": "{{lang-country}}" }, { "en": "Colombia", "es": "Colombia", "tag": "{{lang-country-co}}" }, { "en": "Generate document", "es": "Generar documento", "tag": "{{lang-button-submit}}" }], "popovers": { "en": { "country": { "title": "Contract country", "content": "The <b>Country</b> used as a reference to generate the contract is specified." }, "contractType": { "title": "Type of contract", "content": "The <b>Type of contract</b> is the format to be generated." }, "section": { "title": "What is a section?", "content": "Please select one or several sections that you want to add in the type of contract selected." } }, "es": { "country": { "title": "País del contrato", "content": "Se especifica el <b>País</b> que se tiene como referencia para generar el contrato." }, "contractType": { "title": "Tipo de contrato", "content": "El <b>Tipo de contrato</b>, es el formato que se desea generar." }, "section": { "title": "¿Qué es una sección?", "content": "Por favor seleccione una o varias secciones que desee agregar en el tipo de contrato seleccionado." } } }, "langValue": "co", "langMessages": { "en": { "generateMessage": "The document has been generated successfully.", "loaderGenerate": "Generating document...", "loaderLang": "Updating language...", "generateTitle": "Document Generation" }, "es": { "generateMessage": "El documento ha sido generado con éxito.", "loaderGenerate": "Generando documento...", "loaderLang": "Actualizando idioma...", "generateTitle": "Generación de documento" } }, "lang": "es", "optionNoneBox": { "en": "Deselect All", "es": "Deseleccionar todo" } } }
    loadSettingsValues_(response_)
  }

  /**
   * Permite agregar la lista de paises 
   **/
  function addCountries_(countries_) {

    // Referenciamos el select
    var $select_ = $("#sltCountriesApp").html("");
    var options_;

    // recorremos cada uno de los paises
    for (var i = 0; i < countries_.length; i++) {

      // Creamos las opciones de la opción
      options_ = {
        "data-i18n": ("{{lang-country-" + countries_[i].value + "}}"),
        "selected": (i == 0),
        "data-icon": ("fa-solid fi fi-" + countries_[i].value),
        "data-lang": countries_[i].lang,
        "value": countries_[i].value
      };

      // Creamos la opción
      $select_.append(
        $("<option>").attr(options_).text(countries_[i].text)
      );
    }

    // Actualizamos el select
    $select_.selectpicker("refresh");
  }

  /**
   * Permite establecer los datos de configuración 
   **/
  function loadSettingsValues_(response) {
    console.log(response)
    // Agregamos la lista de paises
    addCountries_(response.countries);

    // Refenciamos el los datos del dom
    G_LANG_DOM = response.langOptions;
    G_LANG_MESSAGES = response.langOptions.langMessages[G_LANG_DOM.lang];

    // Agregamos la información del campo de estilo
    addOptionSelectPicker_("sltContractType", response.contractType);

    // Definimos los parametros
    $("#sltSections").selectpicker({
      actionsBox: true,
      deselectAllText: G_LANG_DOM.optionNoneBox[G_LANG_DOM.lang],
      selectAllText: G_LANG_DOM.optionAllBox[G_LANG_DOM.lang],
      noneSelectedText: G_LANG_DOM.optionSelect[G_LANG_DOM.lang]
    });

    // Asignamos el evento a los campos de pais y tipo de contrato
    $("#sltContractType").on('change', manageSectionList_);

    // actualizamos el idioma
    updateLangInterface_(null);

    // Agregamos los datos usados anteriormente
    loadInitValues_(response.initValues);

    // ocultamos el loading
    SnvaJsApi.toggleLoading(false);
  }

  /**
   * Permite cargar los datos iniciales 
   **/
  function loadInitValues_(initValues_) {

    // Se valida si existe datos para cargar
    if (initValues_.country) {

      // Agregamos los valores
      $("#sltContractType").selectpicker("val", initValues_.contractType);
      // $("#sltSections").data("tempObject", initValues_);

      // Emulamos el cambio para habilitar el campo de tarea
      $("#sltContractType").trigger("change");
    }
  }

  /**
   * Permite generar el formato
  */
  function generateFormat_(e) {
    e.preventDefault();

    // Mostramos el loading
    SnvaJsApi.toggleLoading(true, G_LANG_MESSAGES.loaderGenerate);

    // Referenciamos el campo de paisa
    var $countrySelect_ = $("#sltCountriesApp");

    // Definimos el objeto a retornar
    var formObject_ = {
      //Sections: ($("#sltSections").val() || ""),
      //Task: ($("#sltSections").val() || ""),
      Country: ($countrySelect_.find("option:selected").text() || ""),
      Topic: "",
      Fields: [],
      ContractType: $("#sltContractType").val(),
      CountryValue: $countrySelect_.val(),
      LanguageValue: ($countrySelect_.find("option:selected").attr("data-lang") || "en")
    };

    // Permite establecer el tema
    generateTopic_(formObject_);
    console.log("formObject_", formObject_)

    // Creamos la variable para almacenar la lista de promisas
    var promiseList_ = [];



  }

  /**
   * Permite obtener la información de los topics
  */
  function generateTopic_(formObject_) {

    var $fields = $("#pnlOtherFields input, #pnlOtherFields textarea");

    // Se valida si existe campos
    if ($fields.length > 0) {

      // Recorremos cada uno de los campos
      $fields.each(function () {

        // Refenciamos el input actual
        var $input_ = $(this);

        // creamos el valor de entrada
        formObject_.Topic += $input_.attr("data-value") + "[" + $input_.val().replace(/\<|\>/g, "") + "]\n";

        // AGregamos el nombre del campo
        formObject_.Fields.push($input_.val());
      });
    }
  }

  /**
   * Permite crear la promesa para luego validarlo
  */
  function createPromise_(formObject_, sectionName_) {

    //creamos el objeto a enviar
    var sendObject_ = {
      Country: formObject_.Country,
      Topic: formObject_.Topic,
      Language: formObject_.LanguageValue,
      Task: "Generates the entire content of the " + sectionName_ + " section of a " + formObject_.ContractType + "."
    };

    // Se retorna la promesa para luego ejecutarla
    return new Promise((resolve, reject) => {
      //google.script.run.withSuccessHandler(resolve).withFailureHandler(reject).getContentBySection(sendObject_);
    });
  }

  /**
   * Permite mostrar los tipos de valores
  */
  function manageSectionList_(e) {

    // Obtenemos la información de tareas
    var noneSelectedText_ = G_LANG_DOM.optionSelect[G_LANG_DOM.lang];

    // Obtenemos los valores de tipo de contrato y paisa
    var contractType_ = $("#sltContractType option:selected").text() || "";
    var country_ = $("#sltCountriesApp option:selected").text() || "";
    var $select_ = $("#sltSections");
    $select_.removeAttr("disabled");

    // Borramos el contenido
    $select_.html('');
    $contentFields_ = $("#pnlOtherFields").html("");

    // Definimos el objeto a retornar
    var formObject_ = {
      country: country_,
      contractType: $("#sltContractType").val(),
      countryValue: $("#sltCountriesApp").val()
    };
    console.log("formObject_", formObject_);
    // Se valida si existe pais y tipo de contrato
    if (contractType_ && country_ && formObject_.contractType && formObject_.countryValue) {

      // Ocultamos el panel de tareas
      $contentFields_.show();
      $select_.attr("required", true);
      $select_.attr("disabled", true);

      // Definimos el objeto a retornar
      formObject_.languageValue = ($("#sltCountriesApp option:selected").attr("data-lang") || "en");
      console.log("formObjectTWO_", formObject_);
      // Realizamos la consulta de los datos de seccines y los campos a usar
      getSectionsParalls_(formObject_, $select_, $contentFields_);//CAMBIAR

    } else {
      // Ocultamos el panel de tareas
      $contentFields_.hide();
      $select_.removeAttr("required");
    }

    // Actualizamos las opciones
    $select_.selectpicker("refresh");
  }

  /**
   * Permite obtener la información importante para generar las secciones
   * Peticiones a GPT
  */
  function getSectionsParalls_(formObject_, $select_, $contentFields_) {
    console.log("formObject_", formObject_);
    // Creamos la variable para almacenar la lista de promisas
    var promiseList_ = [
      new Promise((resolve, reject) => {
        // google.script.run.withSuccessHandler(resolve).withFailureHandler(reject).getSectionByContract(formObject_, "sections");
      }),
      new Promise((resolve, reject) => {
        //google.script.run.withSuccessHandler(resolve).withFailureHandler(reject).getSectionByContract(formObject_, "fields");
      })
    ];

    // Ejecutamos las promesas
    Promise.all(promiseList_).then(resultArray_ => {
      console.log("resultArray_", resultArray_)
      // Agregamos los campos en el contenedor
      addFieldsByType_($contentFields_, resultArray_[1]);

      // Adicionamos los valores
      addSectionTypes_($select_, resultArray_[0]);

      // Habilitamos el select
      $select_.removeAttr("disabled");

      // Actualizamos las opciones
      $select_.selectpicker("refresh");
    }).catch(error => {

      // Maneja los errores
      console.error('Error al consultar las secciones:', error);

      // ocultamos el loading
      SnvaJsApi.toggleLoading(false);
    });
  }
  /**
   * Permite cargar todos los popovers NO BORRAR
  */
  function loadAllPopovers_() {

    // mensajes de popovers
    var messagePopover_ = G_LANG_DOM.popovers[G_LANG_DOM.lang];

    // Agregamos el popover de tárea
    initPopover_("infoContractType", messagePopover_["contractType"]);
    initPopover_("infoCountry", messagePopover_["country"]);
    initPopover_("infoSections", messagePopover_["section"]);
  }

  /**
   * Permite inicializar el popover
  */
  function initPopover_(elementId_, infoObject_) {

    // Rferebciamos el elemento
    var $element_ = $('#' + elementId_);

    // Validamos si existe la instancia
    if ($element_.data("bs.popover")) {
      $element_.popover('dispose');
    }

    // Iniciamos el popover
    $element_.popover({
      placement: 'bottom',
      html: true,
      title: '<div class="popover__header"><span>' + infoObject_.title + '</span><span class="popover__close close" data-dismiss="alert">&times;</span</div>',
      content: infoObject_.content
    });
  }

  /**
   * Permite agregar los elemento a un selectpicker
  */
  function addOptionSelectPicker_(selectId_, objectItems_) {

    // referenciamos el select
    var $select = $("#" + selectId_);
    var isInit_ = false, currValue_ = $select.val();
    var noneSelectedText_ = G_LANG_DOM.optionSelect[G_LANG_DOM.lang];

    // Se valida si no contiene opciones
    if (!objectItems_) {
      objectItems_ = $select.data("objectItems_");
    } else {

      // Agregamos los items para futura consulta
      $select.data("objectItems_", objectItems_);
      isInit_ = true;
    }

    // Borramos el contenido
    $select.html('<option value="" selected="true">' + noneSelectedText_ + '</option>');

    // definimos las opciones de acuerdo al idioma
    var options_ = objectItems_[G_LANG_DOM.lang] || [];

    // eliminamos el contenido del select
    for (var i = 0; i < options_.length; i++) {

      // Creamos la opción
      $select.append(
        $("<option>").attr({ value: options_[i].value }).text(options_[i].text)
      );
    }

    // Actualizamostodos los popovers
    loadAllPopovers_();

    // se valida si se debe de iniciar
    if (isInit_) {

      // Definimos los parametros
      $select.selectpicker({
        liveSearch: true,
        noneSelectedText: noneSelectedText_
      });
    } else {

      // refrescamos los valores
      $select.selectpicker("refresh");

      // Se valida si existe un valor 
      if (currValue_) {
        $select.selectpicker("val", currValue_);
      }
    }
  }

  /**
   * Permite visualizar un panel respectivo
  **/
  function updateLangInterface_(element) {

    //Mostramos el loading
    SnvaJsApi.toggleLoading(true, G_LANG_MESSAGES.loaderLang);

    // Referenciamos el campo de paisa
    var $countrySelect_ = $("#sltCountriesApp");

    // se valida si no existe el lenguage
    if (element) {

      // se obtiene el idiona del elemento
      var language = $countrySelect_.find("option:selected").attr("data-lang") || "en";
      var languageValue_ = $countrySelect_.val();
      console.log("language", language);
      console.log("languageValue_", languageValue_);
      // validamos si el idoma es diferente al que establecio inicialmente
      if (languageValue_ != G_LANG_DOM.langValue) {

        // tomamos el idioma definido por el usuario
        G_LANG_DOM.lang = language;
        G_LANG_DOM.langValue = languageValue_;
        G_LANG_MESSAGES = G_LANG_DOM.langMessages[G_LANG_DOM.lang];

        // guardamos la selección
        /*google.script.run.saveLanguageValue(JSON.stringify({
          lang: G_LANG_DOM.lang,
          langValue: G_LANG_DOM.langValue
        }));*/
      }
    } else {

      // Seleccinamos el idioma
      $countrySelect_.selectpicker("val", G_LANG_DOM.langValue);
    }

    // Propiedad del título
    var titleProperty_ = G_LANG_DOM.lang + "Title";
    var propertyValue_ = G_LANG_DOM.lang;

    // Recorremos cada uno de los items
    for (var i = 0; i < G_LANG_DOM.dom.length; i++) {

      // validamos si existe un titulo
      if (G_LANG_DOM.dom[i][titleProperty_]) {

        // actualizamos cada uno de los valores
        $("[data-i18n='" + G_LANG_DOM.dom[i].tag + "']").attr("title", G_LANG_DOM.dom[i][titleProperty_]).html(G_LANG_DOM.dom[i][propertyValue_]);

      } else {

        // actualizamos cada uno de los valores
        $("[data-i18n='" + G_LANG_DOM.dom[i].tag + "']").html(G_LANG_DOM.dom[i][propertyValue_]);
      }
    }

    // Actualizamos la lista de valores de estilo
    addOptionSelectPicker_("sltContractType");

    // Renderizamos el select de secciones
    //renderSelectpicker_("#sltSections", true);
    $("#sltContractType").trigger("change");

    // Actuaizamos los selects
    $(".select__picker").selectpicker("refresh");

    // se valida si el elemnto existe
    if (element) {

      //Oculta el loading
      SnvaJsApi.toggleLoading(false);
    }
  }

  /**
   * Permite renderizar el select
  */

});


//Mis FUNCIONEEEEEEEES

var datosDinamicos = [
  { valor: "opcion4", texto: "Opción 4" },
  { valor: "opcion5", texto: "Opción 5" },
  { valor: "opcion6", texto: "Opción 6" },
];

//Variables

var baseText  //Donde ira el Prompt
var sections
var sectionsTEMP
var CamposSecciones

document.addEventListener("DOMContentLoaded", function () {

  var contractTypeSelect = document.getElementById("sltContractType");
  var boton = document.getElementById("boton-generar");
  var pnlSections1 = document.getElementById("pnlSections1");

  //var boton = document.getElementById("generar-descripcion-markdown"); // Agregado
  /*
  * Se ejecuta al cambiar una seleccion de la lista
  */
  contractTypeSelect.addEventListener("change", function () {
    MostrarSecciones()
      .then(function () {

        llenarListaDesplegable();
        agregarCamposDeEntrada();
        console.log(CamposSecciones)


      })
      .catch(function (error) {
        console.error('Error:', error);
      });

  });

  /*
  *Se ejecuta al seleccionar el boton
  */

  boton.addEventListener("click", function () {
    var pruebaconsola = SeccionesSeleccionadas(); //Recibe las secciones Seleccionadas

    generarYMostrarContrato();
  });

  /*
  *Permite habilitar o deshabilitar el boton
  */
  contractTypeSelect.addEventListener("change", function () {
    console.log('Ha cambiado algo');
    console.log(contractTypeSelect);

    // Habilitar o deshabilitar el botón según la selección de contrato
    if (
      contractTypeSelect.value === "Work contract" ||
      contractTypeSelect.value === "Services contract" ||
      contractTypeSelect.value === "Leasing contract" ||
      contractTypeSelect.value === "Sales contract" ||
      contractTypeSelect.value === "Confidentiality agreement"
    ) {
      boton.disabled = false; // Habilitar el botón
      pnlSections1.style.display = "block"; //Mostrar Secciones

    } else {
      boton.disabled = true; // Deshabilitar el botón
      pnlSections1.style.display = "none"; //Ocultar Secciones
    }
    console.log(contractTypeSelect);
  });


});

//Funcion que crea Prompt para Secciones
function varruirPrompt() {
  var contractType = document.getElementById("sltContractType").value;
  console.log(contractType);
  var country = document.getElementById("sltCountriesApp").value;
  return `"Genera un arreglo de secciones (Minimo 12) para un ${contractType} en ${country}. El arreglo debe contener objetos con 'valor' y 'texto' para cada sección. Siguiendo el formato de la siguiente manera

  ([
      { "valor": "Nombre sección", "texto": "Nombre sección" },
      { "valor": "Nombre sección", "texto": "Nombre sección" },
      { "valor": "Nombre sección", "texto": "Nombre sección" }
  ])
  `;
}

/**
 * Converir String to JSON
 */

function convertirCadenaAJSON(cadena) {

    // Encuentra el contenido entre paréntesis utilizando una expresión regular
    const regex = /\[([^\]]+)\]/g;
    const matches = cadena.match(regex);
  
    if (matches && matches.length > 1) {
      const contenido = "[" + matches[1] + "]";
      try {
        // Intenta analizar el contenido entre paréntesis como JSON
        const json = JSON.parse(contenido);
        console.log(json);
        return json;
      } catch (error) {
        const json = JSON.parse(contenido);
        return json;
        //console.error('Error al analizar como JSON:', error);
      }
    }
  
    // Si no se pudo obtener o analizar como JSON, devuelve un objeto vacío
    return {};
  }

/**
 * Genera Secciones desde GPT
 */
async function MostrarSecciones() {
  SnvaJsApi.toggleLoading(true);
  var prompt = varruirPrompt();
  try {
    const output = await generarSolicitud(prompt);
    console.log(output);

    sectionsTEMP = output;
    console.log(sectionsTEMP);
    return Promise.resolve();
  } catch (error) {
    console.error('Error al generar y mostrar la respuesta:', error);
    return Promise.reject(error);
  } finally {
    SnvaJsApi.toggleLoading(false);
  }
}

/**
 * Función para llenar la lista desplegable 
 * */
function llenarListaDesplegable() {

  var selectSections = document.getElementById("contractSections");
  sections = convertirCadenaAJSON(sectionsTEMP);

  selectSections.innerHTML = "";//Limpia la lista

  sections.forEach(function (opcion) {
    var option = document.createElement("option");
    option.value = opcion.valor;
    option.textContent = opcion.texto;
    selectSections.appendChild(option);
    console.log("Funciona?")
  });

  //Inicializar Select Picker
  $("#contractSections").selectpicker("refresh");
  console.log(selectSections);
}

/**
 * Función para guardar la seleccion de la lista de SECCIONES
 */
function SeccionesSeleccionadas() {
  var select = document.getElementById("contractSections");
  var selectedSections = [];

  for (var i = 0; i < select.options.length; i++) {
    if (select.options[i].selected) {
      selectedSections.push(select.options[i].value);
    }
  }
  console.log("HE SELECCIONADO EL BOTON");
  console.log(selectedSections);

  return selectedSections;
}


function procesarDatos(datosSeleccionados) {
  // Recorremos el arreglo de datos
  for (let i = 0; i < datosSeleccionados.length; i++) {
    const prompt = "Hola, que significa " + datosSeleccionados[i]; // Tomamos un elemento del arreglo como prompt
    console.log("Esto estamos pidiendo", prompt);
    // Generamos una solicitud a la API de OpenAI
    OpenAiRequest(prompt)
      .then(result => {
        // Mostramos la respuesta en la consola
        console.log(`Respuesta para el prompt ${i}:`);
        console.log(result);
      })
      .catch(error => {
        console.error(`Error al procesar el prompt ${i}:`, error);
      });
  }
}

/***
 * Agrega los campos de entrada, con ESTILOS
 */
function agregarCamposDeEntrada() {
  var pnlOtherFields = document.getElementById("pnlOtherFields");
  var contractType = document.getElementById("sltContractType").value;
  var datos = getCamposSecciones(contractType);

  for (var i = 0; i < datos.length; i++) {
    // Crear un div que contendrá el campo de entrada y la etiqueta
    var campoContainer = document.createElement("div");
    campoContainer.className = "form-group";

    // Crear una etiqueta
    var label = document.createElement("label");
    label.textContent = datos[i];
    label.className = "label__custom";

    // Agregar el ícono de información
    var infoIcon = document.createElement("i");
    infoIcon.className = "fa__info fas fa-info-circle bgc-dark";
    infoIcon.setAttribute("data-original-title", "Información");
    infoIcon.setAttribute("data-content", "Aquí va tu información de ayuda.");
    // Agregar un espacio (en blanco) entre el ícono y el texto
    var space = document.createTextNode("\u00A0"); // Unicode for non-breaking space


    // Crear el campo de entrada (input)
    var input = document.createElement("input");
    input.type = "text";
    input.value = "";
    input.className = "form-control form-control-sm";

    // Agregar la etiqueta y el campo de entrada al contenedor
    campoContainer.appendChild(label);
    campoContainer.appendChild(space);
    //campoContainer.appendChild(infoIcon);
    campoContainer.appendChild(input);


    // Agregar el contenedor al panel de campos adicionales
    pnlOtherFields.appendChild(campoContainer);


    // Inicializar el tooltip para el ícono de información (delay para permitir que el DOM se actualice)
    setTimeout(function () {
      $("i[data-content]").popover({
        trigger: "hover",
        placement: "right",
      });
    }, 0);
  }
}


/**
 *Funcioon para obtener un arreglo de las SECCIONES por contrato 
 * */
function getCamposSecciones(contractType) {
  switch (contractType) {
    case "Work contract":
      return [
        "Datos del empleador (quien contrata)",
        "Datos del empleado (quien acepta el contrato)",
        "Fecha de inicio y duración del contrato",
        "Descripción del trabajo",
        "Horario laboral",
        "Compensación y beneficios",
        "Periodo de prueba",
        "Políticas y regulaciones",
        "Terminación del contrato",
        "Confidencialidad y propiedad intelectual",
        "Ley aplicable",
      ];

    case "Services contract":
      return [
        "Datos del proveedor de servicios",
        "Datos del cliente",
        "Descripción de los servicios",
        "Honorarios y facturación",
        "Plazos y entregables",
        "Responsabilidades del proveedor de servicios",
        "Responsabilidades del cliente",
        "Propiedad intelectual",
        "Confidencialidad",
        "Cancelación y terminación",
        "Ley aplicable y jurisdicción",
      ];

    case "Leasing contract":
      return [
        "Datos del arrendador (propietario)",
        "Datos del arrendatario (inquilino)",
        "Descripción del inmueble",
        "Plazo del arrendamiento",
        "Arriendo y depósito",
        "Responsabilidades de mantenimiento",
        "Terminación y notificación",
        "Ley aplicable y jurisdicción",
      ];

    case "Sales contract":
      return [
        "Datos del vendedor",
        "Datos del comprador",
        "Descripción del bien",
        "Precio y forma de pago",
        "Entrega y transferencia de propiedad",
        "Garantías y condiciones",
        "Responsabilidades de gastos",
        "Terminación y rescisión",
        "Ley aplicable y jurisdicción",
      ];

    case "Confidentiality agreement":
      return [
        "Datos del divulgador",
        "Datos del receptor",
        "Definición de información confidencial",
        "Obligaciones del receptor",
        "Plazo de confidencialidad",
        "Divulgación autorizada",
        "Consecuencias por incumplimiento",
        "Ley aplicable y jurisdicción",
      ];

    default:
      console.log("No se encontró una coincidencia con los tipos de contrato conocidos.");
      return [];
  }
}

// Función para imprimir la salida en Word
async function imprimirEnWord(output) {
  await Word.run(async (context) => {
    Office.context.document.setSelectedDataAsync(output, {
      coercionType: Office.CoercionType.Html
    });
    await context.sync();
  });
}


/**
 * FUNCION para obtener el PROMPT
 */
// Función para obtener el texto base
function obtenerBaseText(contractType, country, secciones) {

  baseText = `Task: Genera un documento para un ${contractType} que se radique con las leyes y lineamientos de ${country},ten en cuenta que debe contener las siguientes
     secciones (agrega las secciones que correspondan y se deban validar, por cada sección agrega un texto detallado, ${secciones} ), igualmente a 
     tener en cuenta el nombre de las contrapartes , el objeto del contrato o sea la razon por la que se hace este contrato , la 
     duracion del contrato , compromiso de pago de las contrapartes ,a lo mismo si se especifica una responsabilidad de 
     partes,una clausula de no competencia si aplica , informacion de las partes , y 
     firmas, quiero que el documento tenga titulos grandes, e identicados, en negrita y los detalles que requieras con estilos
    Topic: ${contractType} 
    Style: Business
    Language:Español
    Tone: Professional
    Length: 2000 words
    Format: Markdown`;

  return baseText;
}

// Mostrar Contrato GENERADO e imprimirlo
async function generarYMostrarContrato() {

  SnvaJsApi.toggleLoading(true);
  var contractType = document.getElementById("sltContractType").value;
  var country = document.getElementById("sltCountriesApp").value;
  var secciones = SeccionesSeleccionadas();
  var baseText = obtenerBaseText(contractType, country, secciones);
  var prompt = baseText;

  try {
    var result = await OpenAiRequest(prompt);
    var htmlText = md.render(result, {});
    const htmlContainer = "<div>" + htmlText + "</div>";
    await imprimirEnWord(htmlContainer);

    // Ocultar la pantalla de carga una vez que se ha insertado el contenido
  } catch (error) {
    console.error('Error en la generación y muestra del contrato:', error);
    // Mostrar el error en el label de depuración
    mostrarMensaje('Error en la petición: ' + error.message);
  } finally {
    SnvaJsApi.toggleLoading(false);
  }
}


