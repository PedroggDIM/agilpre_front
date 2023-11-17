<script setup>
import Navbar from "@/components/Navbar.vue"
</script>

<script>
import Calendar from "primevue/calendar";
import { mapState } from 'pinia';
import { mapActions } from 'pinia';
import { incidenciasStore } from '@/stores/incidencias';

export default {
  props: {},
  components: {
    Calendar,
  },
  data() {
    return {
      fechaInicio: null,
      fechaFin: null,
      estado: null
    };
  },
  computed: {
    ...mapState(incidenciasStore, ['numIncidencias', 'getEstadisticasPorParametro']),

  },
  methods: {
    ...mapActions(incidenciasStore, ['getEstadisticasPorParametro']),
    convierteFecha(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    async obtenerEstadisticas() {
      console.log(this.estado)
      console.log(this.fechaInicio)
      console.log(this.fechaFin)
      const fechaInicioStr = this.convierteFecha(this.fechaInicio);
      const fechaFinStr = this.convierteFecha(this.fechaFin);
      console.log(this.estado)
      console.log(fechaInicioStr)
      console.log(fechaFinStr)
      await this.getEstadisticasPorParametro(this.estado, fechaInicioStr, fechaFinStr);
    },
  },
}
</script>
<template>
  <div>
    <Navbar />
  </div>
  <div>
    <h3 class="letra">Estadísticas de Incidencias</h3>
    <div class="container"><br>
      <h3 class="letra">Incidencias entre dos fechas</h3><br>
      <div class="row">
        <div class="col-md-6">
          <div class="p-field">
            <label class="texto" for="fechaInicio">Fecha de inicio: </label>
            <br />
            <Calendar v-model="fechaInicio" id="fechaInicio" :showIcon="true"></Calendar>
          </div>
        </div>
        <div class="col-md-6">
          <div class="p-field">
            <label class="texto" for="fechaFin">Fecha de fin:</label>
            <br />
            <Calendar v-model="fechaFin" id="fechaFin" :showIcon="true"></Calendar>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <p class="margeninput">Estado</p>
          <select name="estado" class="form-select" v-model="estado">
            <option value="Comunicada a la empresa">Comunicada a la empresa</option>
            <option value="Comunicada a la empresa y resuelta">Comunicada a la empresa y resuelta</option>
            <option value="Enviada al SABAS">Enviada al SABAS</option>
            <option value="Pendiente de tratar en la reunión mensual">Pendiente de tratar en la reunión mensual</option>
            <option value="En trámite">En trámite</option>
            <option value="Cerrada">Cerrada</option>
          </select>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 mt-3">
          <div class="p-field">
            <button @click="obtenerEstadisticas" class="p-button p-component">
              Obtener incidencias
            </button>
            <div>
              <p class="letra">
              <h5>Número de incidencias: {{ numIncidencias }}</h5>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.container {
  width: 95%;
  margin: 2em auto 0 auto;
  background-color: #E6E6E6;
  padding: 20px;
  border: 4px;
  border-radius: 10px;
}

.letra {
  font-family: 'Times New Roman';
  margin-left: 20px;
  margin-top: 20px;
}
</style>

