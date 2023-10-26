/**
 * Creamos la clase con las funciónes generales
 */
var DomApi = {

  /**
   * Permite cerar un elemento en el dom
   */
  createElement: function(type, attributes) {
    var element = document.createElement(type);

    // Se valida que exista attributos
    if(attributes){
      
      // Agregamos los atributos
      DomApi.addAttributes(element, attributes);
    }
    
    // retornamos el elemento
    return element;
  },

  /**
   * Permite agregar los atributos
   */
  addAttributes: function (element, attributes){

    // Se valida si NO existe el elemento
    if(!element) return;

     // Recorremos y agregamos cada uno de los atributos
     for (var key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        
        // Se validaque no sea "class+" o "class-"
        if(["class+", "class-"].indexOf(key) == -1){
          element.setAttribute(key, attributes[key]);
        } else if(key == "class+"){
          element.classList.add(attributes[key]);
        } else if(key == "class-"){
          element.classList.remove(attributes[key]);
        }
      }
    }  
  },

  /**
   * Permite agregar varios atribbutos a un elemento
   */
  attr: function(element, attributes){

    // Recorremos y agregamos cada uno de los atributos
    DomApi.addAttributes(element, attributes); 
  },

  /**
   * Permite eliminar varios atribbutos a un elemento
   */
  removeAttr: function(element, attributes){
    // Se valida si NO existe el elemento
    if(!element) return;

    // Recorremos y agregamos cada uno de los atributos
    for (var key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        element.removeAttribute(key, attributes[key]);
      }
    }    
  }
};