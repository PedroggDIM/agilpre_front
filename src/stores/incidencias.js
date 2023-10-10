import { defineStore } from "pinia";
import {
  getIncidencias,
  guardarIncidencia 
       } from './api-service';
import { loginStore } from "@/stores/loginStore";

export const incidenciasStore = defineStore("incidencias", {
  state: () => ({
    incidencias: []
  }),
  actions: {
    
    getIncidencias() {
      const dataSession = loginStore().recuperarSesion();
      debugger
      getIncidencias(dataSession).then((response) => {
        debugger;
        this.incidencias = response.data._embedded.incidenciaModels;
        // this.incidencias.forEach((incidencia) => {
        //   this.formatearFecha(incidencia);
        // });
      });
    },  
    
    getIncidenciaPorId(id) {
      return this.incidencias.find((p) => p.id == id);
    },
    guardarIncidenciaStore(incidencia) {
    //  debugger;
      console.log("guardarIncidendia en incidencias.js"+incidencia); 
      guardarIncidencia(incidencia)
      //return guardarIncidencia(incidencia);
    },
    // eliminarIncidencia(incidencia) {
    //   return borrarIncidencia(incidencia);
    // },   
  },
});
