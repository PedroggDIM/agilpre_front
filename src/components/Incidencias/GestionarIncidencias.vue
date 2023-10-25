<script setup>
import Navbar from "@/components/Navbar.vue"
</script>
<script>
import { mapActions, mapState } from 'pinia'
import { incidenciasStore } from '@/stores/incidencias.js';
import moment from "moment";

export default {
  props: ['incidencia'],
  emits: ["editarIncidencia"],

  data() {
    return {
      estados: [
        'Comunicada a la empresa',
        'Comunicada a la empresa y resuelta',
        'Enviada al SABAS',
        'Pendiente de tratar en la reunión mensual',
        'En trámite',
        'Cerrada'
      ],
      busquedaEstado: ''
    };
  },
  computed: {
    ...mapState(incidenciasStore, ['incidencias']),
    filtroDeBusqueda() {
      const filtroDeIncidencias = this.incidencias.filter((incidencia) =>
        incidencia.estado.toLowerCase().includes(this.busquedaEstado.toLowerCase())
      );
      // return filtroDeIncidencias.slice(0, 4);
      return filtroDeIncidencias;
    },
  },
  methods: {
    formatDate(date) {
      return moment(date).format("YYYY/MM/DD");
    },
  }
}
</script>

<template>
  <div>
    <Navbar />
  </div>
  <div class="container-fluid ancho">
    <div>
      <h5>Buscar por Estado</h5>
      <select v-model="busquedaEstado" class="form-control mb-3">
        <option value="">Selecciona un estado</option>
        <option v-for="estado in estados" :key="estado" :value="estado">{{ estado }}</option>
      </select>
      <div class="row">
        <div class="col-12 col-md-10 mb-3">

          <div v-for="incidencia in filtroDeBusqueda" :key="incidencia.id" class="card m-0 p-0">
            <!-- <div class="card-header text-primary"><strong>Estado: </strong>{{ incidencia.estado }}</div>             -->
            <div class="card">

              <p class="mb-0"><strong>Número de incidencia: </strong>{{ incidencia.id }}</p>
              <p class="mb-0"><strong>Zona: </strong>{{ incidencia.zona }}</p>
              <p class="mb-0"><strong>Unidad: </strong>{{ incidencia.unidad }}</p>
              <p class="mb-0"><strong>Fecha inicio: </strong>{{ formatDate(incidencia.fechaInicio) }}</p>
              <p class="mb-0"><strong>Fecha fin: </strong>{{ formatDate(incidencia.fechaFin) }}</p>
              <p class="mb-0"><strong>Duración en días: </strong>{{ incidencia.numDias }}</p>
              <p class="mb-0"><strong>Estado: </strong>{{ incidencia.estado }}</p>
              <p class="mb-0"><strong>Fecha de comunicación a la empresa: </strong>{{
                formatDate(incidencia.comunicaEmpresa) }}</p>
              <p class="mb-0"><strong>Información adicional añadida por el grabador: </strong>{{
                incidencia.infoAdicio_grabador }}</p>
              <p class="mb-0"><strong>Descripción: </strong>{{ incidencia.descripcion }}</p>
              <p class="mb-0"><strong>Categoria: </strong>{{ incidencia.categoria }}</p>

              <div v-if="incidencia.categoria === 'DeficienciaServicio'">
                <div class="container-fluid incumplimiento">
                  <h5>Incumplimientos:</h5>
                  {{ incidencia.incumplimiento }}
                </div>
              </div>

              <div v-if="incidencia.categoria === 'LimpiezaChoque'">
                <div class="container-fluid LimpiezaChoque">
                  <h5>Limpieza de choque:</h5>
                  Tipo de choque: {{ incidencia.tipoChoque }}<br>
                  Gravedad: {{ incidencia.gravedad }}
                </div>
              </div>

              <div v-if="incidencia.categoria === 'CambiosDependencia'">
                <div class="container-fluid LimpiezaChoque">
                  <h5>Cambios en las dependencias oficiales:</h5>
                  Tipo de cambio: {{ incidencia.tipoCambio }}<br>
                  Dependencias afectadas: {{ incidencia.tipoDependencia }}<br>
                  Superficie afectada en metros: {{ incidencia.metrosCuadrados }}
                </div>
              </div>
              <div class="col-12 col-md-12 mb-3" id="botones">
                <button type="button" class="btn btn-success">Enviar al SABAS</button>&nbsp;
                <!-- <button type="button" class="btn btn-warning" @click="editarIncidencia(incidencia)">Editar</button> -->
                <button type="button" class="btn btn-warning">Editar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.ancho {
  width: 95%;
  margin: 0 auto;
  /* Centra horizontalmente el contenido */
  background-color: #E6E6E6;
  /* Color de fondo gris claro */
  padding: 20px;
  /* Espacio interno para separar el contenido del borde */
  border: 4px;
  border-radius: 10px;
}

.mb-0 {
  margin: 5px;
}

#botones {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
</style>