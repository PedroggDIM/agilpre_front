import { defineStore } from "pinia";
import {
  getIncidencias,
  guardarIncidencia, getEstadisticasPorParametroApi
       } from './api-service';
import { loginStore } from "@/stores/loginStore";

export const incidenciasStore = defineStore("incidencias", {
  state: () => ({
    incidencias: [],
    numIncidencias: 0
  }),
  actions: {
        getIncidencias() {
      const dataSession = loginStore().recuperarSesion();
      debugger
      getIncidencias(dataSession).then((response) => {
        debugger;
        this.incidencias = response.data._embedded.incidenciaModels

      });
    },      
    getIncidenciaPorId(id) {
      return this.incidencias.find((p) => p.id == id);
    },
    guardarIncidenciaStore(incidencia) {
    //  debugger;
      console.log("guardarIncidendia en incidencias.js"+incidencia); 
      guardarIncidencia(incidencia)
    },
   
   async getEstadisticasPorParametro(estadoValor, fechaInicioValor, fechaFinValor) {
       getEstadisticasPorParametroApi(estadoValor, fechaInicioValor, fechaFinValor)
      .then((response) => {      
        console.log("incidencias....................................." + response.data)
        this.numIncidencias = response.data; 
      })
      .catch((error) => {      
        console.error("Error al obtener estadísticas: ", error);
      });
  },
},
})
