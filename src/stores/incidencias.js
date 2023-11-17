import { defineStore } from "pinia";
import {
  getIncidencias,
  guardarIncidencia, getEstadisticasPorParametroApi, borrarIncidencia,
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
      debugger;
      console.log("guardarIncidendia en incidencias.js" + incidencia);
      guardarIncidencia(incidencia).then((response) => {
        console.log("incidencias guardada" + response.data);
        // Buscar la incidencia en la lista y actualizarla
        debugger;
        const incidenciaAct = response.data;
        let i = -1;
        this.incidencias.forEach((inc, index) => {
          if (inc.id === incidencia.id) {
            i = index;
          }
        });

        debugger;
        if (i !== -1) {
          this.incidencias[i].zona = incidenciaAct.zona;
          this.incidencias[i].unidad = incidenciaAct.unidad;
          this.incidencias[i].fechaInicio = incidenciaAct.fechaInicio;
          this.incidencias[i].fechaFin = incidenciaAct.fechaFin;
          this.incidencias[i].numDias = incidenciaAct.numDias;
          this.incidencias[i].estado = incidenciaAct.estado;
          this.incidencias[i].comunicaEmpresa = incidenciaAct.comunicaEmpresa;
          this.incidencias[i].infoAdicio_grabador = incidenciaAct.infoAdicio_grabador;
          this.incidencias[i].descripcion = incidenciaAct.descripcion;
          this.incidencias[i].categoria = incidenciaAct.categoria;
          this.incidencias[i]._links = incidenciaAct._links;

          //   Ajusta los campos específicos según la categoría
          if (incidenciaAct.categoria === 'LimpiezaChoque') {
            this.incidencias[i].tipoChoque = incidenciaAct.tipoChoque;
            this.incidencias[i].gravedad = incidenciaAct.gravedad;
          } else if (incidenciaAct.categoria === 'CambiosDependencia') {
            this.incidencias[i].tipoCambio = incidenciaAct.tipoCambio;
            this.incidencias[i].tipoDependencia = incidenciaAct.tipoDependencia;
            this.incidencias[i].metrosCuadrados = incincidenciaActidencia.metrosCuadrados;
          }
        }else{
          this.incidencias.push(incidenciaAct);
        }
      }).catch((error) => {
          console.error("Error al obtener incidencias: ", error);
        });
    },

    eliminarIncidencia(incidencia) {
      return borrarIncidencia(incidencia).then(() => {
      // Busca el índice de la incidencia en la lista local
      const index = this.incidencias.findIndex((inc) => inc.id === incidencia.id);

      // Si se encuentra la incidencia, elimínala de la lista local
      if (index !== -1) {
        this.incidencias.splice(index, 1);
      } else {
        console.warn('Incidencia no encontrada en la lista local.');
      }
      // Emite un evento para notificar al componente padre que se eliminó la incidencia
      this.$emit('incidencia-eliminada', incidencia.id);
      // Retorna un indicador de éxito o cualquier otro valor necesario
      return true;
    })
    .catch((error) => {
      console.error('Error al eliminar la incidencia:', error);
      // Maneja el error adecuadamente aquí
      return false;
    });
    },
    async getEstadisticasPorParametro(estadoValor, fechaInicioValor, fechaFinValor) {
      getEstadisticasPorParametroApi(estadoValor, fechaInicioValor, fechaFinValor)
        .then((response) => {
          console.log("incidencias....................................." + response.data)       
          this.numIncidencias = response.data.numIncidencias;       
        })
        .catch((error) => {
          console.error("Error al obtener estadísticas: ", error);
        });
    },
  },
})