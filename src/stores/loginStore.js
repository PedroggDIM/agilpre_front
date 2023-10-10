import { defineStore } from "pinia"
import sha1 from "crypto-js/sha1";
import axios from "axios";

export const loginStore = defineStore("login", {
  state: () => ({
    correo: "",
    perfil: '',
    zona: '',
    unidad: ''
  }),
  actions: {
    iniciarSesion(nombreUsuario, claveUsuario) {
      const clave = sha1(claveUsuario).toString();

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:8080/api/login',
        headers: {},
      };
      let body = {
        correo: nombreUsuario,
        contrasenia: claveUsuario
      }; // cambiar por clave cuando en la base de datos se cifre la contraseña

      config.data = body,
        config.headers['Content-Type'] = 'application/json'

      return axios.request(config);
    },

    establecerSesion(data){
       // Se necesita una llamada a la API aqui.
       this.correo = data.correo
       this.perfil = data.perfil;
       this.zona = data.zona;
       this.unidad = data.unidad;

    },

    recuperarSesion(){
      return {correo: this.correo, perfil: this.perfil, zona: this.zona, unidad: this.unidad};
    },

    cerrarSesion() {
      this.nombre = ""
      this.rol = ""
    },
  },
})
