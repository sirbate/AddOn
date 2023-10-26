/**
 * Librería con funciones genericas para su uso en el aplicativo
 * @autor Equipo de Desarrollo Sinova S.A.S.
*/
var SnvaJsApi = {
  
  /**
  * Función encargada de mostrar un mensaje de error producido en el archivo Code.gs
  * @params: {String} error: Error producido ejecutando alguna de las funciones del archivo Code.gs.
  */
  onFailure: function(error) {
    
    // Variable para referenciar el mensaje de error personalizado
    var customError = "";
    
    //Mostramos el error en la consola
    //console.error(error);
    
    //Convertimos el error a String
    error = String(error);
    
    //Mostramos el error en la consola
    //console.error(error);
    
    // Si es un error de red
    if(error == "NetworkError: Connection failure due to HTTP 0" || error == "NetworkError: Error de conexión debido a HTTP 0" || error == "NetworkError: Se ha producido un error en la conexión debido a HTTP 409" || error.indexOf("HTTP 0") != -1){
    
      // Mostramos al usuario un mensaje de error personalizado
      customError = "Revisa tu conexión a internet.";
    } else {
      
      // dejamos como mensaje el que retorna en el servidor
      customError = error;
    }
    
    //Mostramos el mensaje de error
    SnvaJsApi.alert("Information", customError, "error");
    
    //Oculta el loading
    SnvaJsApi.toggleLoading(false);
  },
  
  /*
  * Función encargada de mostrar una ventana de alerta
  */
  alert: function(title, message, type){

    // Se valida si es un error
    if(type == "error"){

      // Display a warning toast, with no title
      toastr.error(message, title);
    } else {
      toastr.success(message, title);
    }    
  },
  
  /**
   * Permite ocultar y mostrar el loading de engranaje
   * @param {String} display: variable con las opciones de (block,none)
   * @param {String} text: Texto que se desea mostrar en el loading
   */
  toggleLoading: function(display, text){
    
    // validamos si existe no existe un texto para definir uno por defecto
    text = text || "Espera un momento por favor...";
    
    // Si se requiere mostrar el loading
    if(display){
      
      // Mostramos el loading
      $("#loader").css("display", "flex");
      
      // nos posicionamos en la parte superior del scroll
      window.scrollTo(0, 0);
      
      // Agregamos la clase de no scroll
      $("body").addClass("not__scrolling");
      
    } else {   
    
      // Ocultamos el loading
      $("#loader").css("display", "none");
      
      // Eliminamos la clase de no scroll
      $("body").removeClass("not__scrolling");
      
    }
    
    // agregamos el texto respectivo
    $("#textLoader").html(text);
  },
  
  /**
   * Función que remplaza los acentos y caracteres latinos, por las respectivas vocales.
   * @param {String} text Texto sobre el cual se reemplazan los caracteres.
   * @return {String} Retorna el texto con los caracteres sustituidos.
   */
  removeLatinSymbols: function(text) {
    // se valida si existe un texto para comparar
    if (text) {

      // se define un objeto con los valores a reemplazar
      var object = {
        "A": /[ÃÀÁÄÂ]/g,
        "E": /[ÈÉËÊ]/g,
        "I": /[ÌÍÏÎ]/g,
        "O": /[ÒÓÖÔ]/g,
        "U": /[ÙÚÜÛ]/g,
        "a": /[ãàáäâ]/g,
        "e": /[èéëê]/g,
        "i": /[ìíïî]/g,
        "o": /[òóöô]/g,
        "u": /[ùúüû]/g
      };

      // recorremos cada uno de los registros de caracteres especiales
      for (var i in object) {

        // validamos que no sea una propiedad del sistema
        if (object.hasOwnProperty(i)) {

          // realizamos el reemplazo de la información
          text = text.replace(object[i], i);
        }
      }
    }

    // remueve el texto 
    return text;
  },

  /**
   * Permite eliminar acentos y convertir el texto en minusculas o mayusculas
   **/
  clearString: function(stringText, isUpperCase) {

    // se elimina los acentos
    stringText = SnvaJsApi.removeLatinSymbols(String(stringText)).trim();

    // validamos si se debe convertir en mayuscula
    if (isUpperCase) {

      // retornamos el texto en mayusculas
      return stringText.toUpperCase();

    } else {

      // retornamos el texto en minuscula
      return stringText.toLowerCase();

    }
  },
  
  /**
   * Permite obtener el JSON a partir de una cadena de texto
  **/
  stringToJson: function(stringValue){
    
    try{
      
      // se valida si existe algun datos
      if(stringValue){
      
        // retornamos el valor de JSON
        return JSON.parse(stringValue);
      }
    } catch(e){}
    
    // retornamos por defecto null
    return "";
  }
};