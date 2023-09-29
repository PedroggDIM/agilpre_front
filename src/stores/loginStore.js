import { defineStore } from "pinia"
import sha1 from "crypto-js/sha1";

export const loginStore = defineStore("login", {
  state: () => ({
    rol: "",
    nombre: ""
  }),
  actions: {
    iniciarSesion(nombreUsuario, claveUsuario) {
      // Se necesita una llamada a la API aqui.
      this.nombre = nombreUsuario
      // Haremos un SHA1 de la clave y la enviaremos a la API.
      let clave = sha1(claveUsuario).toString();  
      console.log("Clave: ",clave) // Este lo borramos cuando la api este funcionando.

      let exito = true // Segun la respuesta de la api daremos true o false.
      this.rol = "usuario" // Lo traemos de la api solo en caso de true.
      return exito;
    },

    cerrarSesion() {
      this.nombre = ""
      this.rol = ""
    },
  },
})
