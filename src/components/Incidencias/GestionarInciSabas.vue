<script setup>
import Navbar from "@/components/Navbar.vue"
</script>

<script>
import { mapActions, mapState } from 'pinia'
import { incidenciasStore } from '@/stores/incidencias.js';
import { borrarIncidencia } from "@/stores/api-service.js";
import moment from "moment";
import { ref } from 'vue';
import 'primevue/resources/primevue.min.css'; // Estilo de PrimeVue
import 'primeicons/primeicons.css'; // Iconos de PrimeIcons
import Paginator from 'primevue/paginator';
import jsPDF from 'jspdf'

export default {
  name: 'pdf',
  props: ['incidencia'],
  components: {
    Paginator, jsPDF,
  },
  emits: ["editarIncidencia"],
  data() {
    return {
      //  incidencia,
      estados: [
        'Comunicada a la empresa',
        'Comunicada a la empresa y resuelta',
        'Enviada al SABAS',
        'Pendiente de tratar en la reunión mensual',
        'En trámite',
        'Cerrada'
      ],
      busquedaEstado: '',
      popUp: false, // ventana emergente   
      //Para la paginación       
      first: 0, // Primera página
      rows: 10, // Elementos por página
    };
  },
  computed: {
    ...mapState(incidenciasStore, ['incidencias']),
    // Paginación de la tabla
    visibleIncidencias() {
      return this.filtroDeBusqueda.slice(this.first, this.first + this.rows);
    },
    filtroDeBusqueda() {
      const filtroDeIncidencias = this.incidencias.filter((incidencia) =>
        incidencia.estado.toLowerCase().includes(this.busquedaEstado.toLowerCase())
      );
      return filtroDeIncidencias;
    },
  },
  methods: {

    ...mapActions(incidenciasStore, ["getIncidencias", "eliminarIncidencia"]),

    onPageChange(event) {
      console.log(this.first)
      this.first = event.first;
      this.rows = event.rows;
    },
    togglePopUp(incidencia) {
      incidencia.showPopup = true;
      this.$emit('setPopupData', incidencia); // Emite los datos de la incidencia al popup
    },
    closePopUp(incidencia) {
      incidencia.showPopup = false;
    },
    formatDate(date) {
      if (date) {
        return moment(date).format("YYYY-MM-DD"); // Formatea la fecha si no es null
      } else {
        return "No finalizada"; // Muestra "No finalizada" si la fecha es null
      }
    },

    borrarIncidenciaSabas(incidencia) {
      console.log(incidencia)
      if (confirm("¿Estás seguro de que deseas borrar la incidencia?")) {

        this.eliminarIncidencia(incidencia).then((r) => {
          console.log('aquí' + incidencia)
          if (r.data) {
            let eliminado = false;
            for (let i = 0; i < this.incidencias.length && !eliminado; i++) {
              let incidenciaAux = this.incidencias[i];
              if (incidenciaAux.id === incidencia.id) {
                eliminado = true;
                this.incidencias.splice(i, 1);
              }
            }
          }
        });
      }
    },
    downloadPDF(incidencia) {
      var pdf = new jsPDF();
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 255);
      pdf.text('-------------------------------------', 20, 12);
      pdf.text('Información de la incidencia', 20, 17);
      pdf.text('-------------------------------------', 20, 22);
      pdf.setTextColor(0);
      pdf.setFontSize(14);
      pdf.setTextColor(255, 0, 0);
      pdf.text(`Incidencia ${JSON.stringify(incidencia.id)} (${JSON.stringify(incidencia.unidad)})`, 15, 30);
      pdf.setTextColor(0);
      pdf.text(`Fecha de inicio:  ${this.formatDate(incidencia.fechaInicio)}`, 15, 40);
      pdf.text(`Fecha de comunicación a empresa  responsable:  ${this.formatDate(incidencia.fechaInicio)}`, 15, 50);
      pdf.text(`Fecha fin:  ${this.formatDate(incidencia.fechaFin)}`, 15, 60);
      pdf.text(`Duración en días: ${incidencia.numDias}`, 15, 70);
      pdf.text(`Estado: ${incidencia.estado}`, 15, 80);

      pdf.setTextColor(0, 0, 255);
      pdf.text('Categoría:', 15, 90);
      pdf.setTextColor(0);

      pdf.setTextColor(0, 0, 255);
      pdf.text(`${incidencia.categoria}`, 15, 100);
      pdf.setTextColor(0);
      if (incidencia.categoria === 'DeficienciaServicio') {
        pdf.text('Incumplimientos:', 15, 110);
        pdf.setFontSize(10);
        incidencia.incumplimiento.forEach((item, index) => {
          const maxLineWidth = pdf.internal.pageSize.width - 20; // Tamaño máximo de la línea
          const textLines = pdf.splitTextToSize(`${index + 1}. ${item}`, maxLineWidth);
          textLines.forEach((line, lineIndex) => {
            pdf.text(line, 15, 120 + index * 15 + lineIndex * 5);
          });
        });
      } else if (incidencia.categoria === 'LimpiezaChoque') {
        pdf.text(`Tipo de choque: ${incidencia.tipoChoque}`, 15, 130);
        pdf.text(`Gravedad: ${incidencia.gravedad}`, 15, 140);
      } else if (incidencia.categoria === 'CambiosDependencia') {
        pdf.text(`Tipo de cambio: ${incidencia.tipoCambio}`, 15, 110);
        pdf.setFontSize(11);
        pdf.text(`Dependencias afectadas: ${incidencia.tipoDependencia}`, 10, 120);
        pdf.setFontSize(14);
        pdf.text(`Superficie afectada en metros: ${incidencia.metrosCuadrados}`, 15, 130);
      }
      pdf.setFontSize(14);

      pdf.text(`Descripción: ${incidencia.descripcion}`, 15, 180);
      const maxLineWidth = pdf.internal.pageSize.width - 30;

      const textLines = pdf.splitTextToSize(`Información adicional: ${incidencia.infoAdicio_grabador}`, maxLineWidth);
      textLines.forEach((line, index) => {
        pdf.text(line, 15, 190 + index * 10);
      });

      pdf.save('incidencia.pdf');
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
      <div class="table-container">
        <select v-model="busquedaEstado" class="form-control mb-3">
          <option value="">Selecciona un estado</option>
          <option v-for="estado in estados" :key="estado" :value="estado">{{ estado }}</option>
        </select>
        <!-- Define la tabla y su cabecera dentro del mismo contenedor -->
        <div class="table-container">

          <table class="table table-hover table-sm" id="table">
            <thead class="table-light">
              <tr>
                <th scope="col">Núm:</th>
                <th scope="col">Unidad</th>
                <th scope="col">Inicio</th>
                <th scope="col">Comunica</th>
                <th scope="col">Estado</th>
                <th scope="col">Tipo </th>
                <th scope="col">Descripción</th>
                <th scope="col">Info. adicional</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <!-- Utilizo v-for solo para las filas de la tabla -->
              <tr v-for="(incidencia, index) in visibleIncidencias" :key="incidencia.id">
                <th>{{ incidencia.id }}</th>
                <th>{{ incidencia.unidad }}</th>
                <td>{{ formatDate(incidencia.fechaInicio) }}</td>
                <td>{{ formatDate(incidencia.comunicaEmpresa) }}</td>
                <td :class="{
                  'estado-rojo': incidencia.estado === 'Pendiente de tratar en la reunión mensual',
                  'estado-azul': incidencia.estado === 'Enviada al SABAS'
                }">
                  {{ incidencia.estado }}
                </td>

                <td>{{ incidencia.categoria }}</td>
                <td>{{ incidencia.descripcion }}</td>
                <td>{{ incidencia.infoAdicio_grabador }}</td>
                <td>
                  <button type="button" class="btn btn-info btn-sm" @click="togglePopUp(incidencia)">Consultar</button>
                </td>
                <td>
                  <!-- Botón editar -->
                  <router-link class="btn btn-success btn-sm"
                    :to="{ name: 'EditaincidenSabas', params: { incidencia: JSON.stringify(incidencia) } }">
                    Editar
                  </router-link>

                </td>
                <td>
                  <button type="button" class="btn btn-warning btn-sm"
                    @click="borrarIncidenciaSabas(incidencia)">Eliminar</button>
                </td>
                <!--/////////////////////////// Contenido de la ventana emergente ///////////////////////////-->
                <transition name="fade">
                  <div v-if="incidencia.showPopup" class="pop-up">
                    <div class="pdf">
                      <button type="button" class="btn btn-success mr-2" @click="downloadPDF(incidencia)">Descargar en
                        PDF</button><br><br>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <button type="button" class="btn btn-secondary" @click="closePopUp(incidencia)">Cerrar</button>
                    </div>


                    <div class="pop-up-inner">
                      <p class="mb-0"><strong>Zona: </strong>{{ incidencia.zona }}</p>
                      <p class="mb-0"><strong>Unidad: </strong>{{ incidencia.unidad }}</p>
                      <p class="mb-0"><strong>Fecha inicio incidencia: </strong>{{ formatDate(incidencia.fechaInicio) }}
                      </p>
                      <p class="mb-0"><strong>Fecha de comunicación a la empresa responsable: </strong>{{
                        formatDate(incidencia.comunicaEmpresa) }}</p>
                      <p class="mb-0"><strong>Fecha fin: </strong>{{ formatDate(incidencia.fechaFin) }}</p>
                      <p class="mb-0"><strong>Duración en días: </strong>{{ incidencia.numDias }}</p>
                      <p class="mb-0"><strong>Estado: </strong>{{ incidencia.estado }}</p>
                      <p class="mb-0"><strong>Categoria: </strong>{{ incidencia.categoria }}</p>
                      <div v-if="incidencia.categoria === 'DeficienciaServicio'">
                        <div class="container-fluid incumplimiento">
                          <h5>Incumplimientos:</h5>
                          <ul>
                            <li v-for="(item, index) in incidencia.incumplimiento" :key="index">{{ item }}</li>
                          </ul>
                        </div>
                      </div>
                      <div v-if="incidencia.categoria === 'LimpiezaChoque'">
                        <div class="container-fluid LimpiezaChoque">
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
                      <p class="mb-0"><strong>Descripción: </strong>{{ incidencia.descripcion }}</p>
                      <p class="mb-0"><strong>Información adicional añadida por el grabador: </strong>{{
                        incidencia.infoAdicio_grabador }}</p>
                    </div>
                  </div>
                </transition>
              </tr>
            </tbody>
          </table>

          <!-- La lista que se mostrará en pantallas pequeñas -->
          <ul id="list">
            <li v-for="(incidencia, index) in visibleIncidencias" :key="incidencia.id">
              <p class="mb-0"><strong>Núm: </strong>{{ incidencia.id }}</p>
              <p class="mb-0"><strong>Zona: </strong>{{ incidencia.zona }}</p>
              <p class="mb-0"><strong>Unidad: </strong>{{ incidencia.unidad }}</p>
              <p class="mb-0"><strong>Fecha inicio incidencia: </strong>{{ formatDate(incidencia.fechaInicio) }}
              </p>
              <p class="mb-0"><strong>Fecha de comunicación a la empresa responsable: </strong>{{
                formatDate(incidencia.comunicaEmpresa) }}</p>
              <p class="mb-0"><strong>Fecha fin: </strong>{{ formatDate(incidencia.fechaFin) }}</p>
              <p class="mb-0"><strong>Duración en días: </strong>{{ incidencia.numDias }}</p>
              <p class="mb-0"><strong>Estado: </strong>{{ incidencia.estado }}</p>
              <p class="mb-0"><strong>Categoria: </strong>{{ incidencia.categoria }}</p>
              <div v-if="incidencia.categoria === 'DeficienciaServicio'">
                <div class="container-fluid incumplimiento">
                  <h5>Incumplimientos:</h5>
                  <ul>
                    <li v-for="(item, index) in incidencia.incumplimiento" :key="index">{{ item }}</li>
                  </ul>
                </div>
              </div>
              <div v-if="incidencia.categoria === 'LimpiezaChoque'">
                <div class="container-fluid LimpiezaChoque">
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
              <p class="mb-0"><strong>Descripción: </strong>{{ incidencia.descripcion }}</p>
              <p class="mb-0"><strong>Información adicional añadida por el grabador: </strong>{{
                incidencia.infoAdicio_grabador }}</p>
              <td>
                <button type="button" class="btn btn-info btn-sm" @click="togglePopUp(incidencia)">Consultar</button>
              </td>
              <td>
                <!-- Botón editar -->
                <router-link class="btn btn-success"
                  :to="{ name: 'EditaincidenSabas', params: { incidencia: JSON.stringify(incidencia) } }">
                  Editar
                </router-link>

              </td>
              <td>
                <button type="button" class="btn btn-warning btn-sm"
                  @click="borrarIncidenciaSabas(incidencia)">Eliminar</button>
              </td>
              <!--/////////////////////////// Contenido de la ventana emergente ///////////////////////////-->
              <transition name="fade">
                <div v-if="incidencia.showPopup" class="pop-up">
                  <!-- <button type="button" class="btn btn-secondary" @click="closePopUp(incidencia)">Cerrar</button> -->

                  <div class="pdf">
                    <button type="button" class="btn btn-success mr-2" @click="downloadPDF(incidencia)">Descargar en
                      PDF</button><br><br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button type="button" class="btn btn-secondary" @click="closePopUp(incidencia)">Cerrar</button>
                  </div>

                  <div class="pop-up-inner">
                    <p class="mb-0"><strong>Zona: </strong>{{ incidencia.zona }}</p>
                    <p class="mb-0"><strong>Unidad: </strong>{{ incidencia.unidad }}</p>
                    <p class="mb-0"><strong>Fecha inicio incidencia: </strong>{{ formatDate(incidencia.fechaInicio) }}</p>
                    <p class="mb-0"><strong>Fecha de comunicación a la empresa responsable: </strong>{{
                      formatDate(incidencia.comunicaEmpresa) }}</p>
                    <p class="mb-0"><strong>Fecha fin: </strong>{{ formatDate(incidencia.fechaFin) }}</p>
                    <p class="mb-0"><strong>Duración en días: </strong>{{ incidencia.numDias }}</p>
                    <p class="mb-0"><strong>Estado: </strong>{{ incidencia.estado }}</p>
                    <p class="mb-0"><strong>Categoria: </strong>{{ incidencia.categoria }}</p>
                    <div v-if="incidencia.categoria === 'DeficienciaServicio'">
                      <div class="container-fluid incumplimiento">
                        <h5>Incumplimientos:</h5>
                        <ul>
                          <li v-for="(item, index) in incidencia.incumplimiento" :key="index">{{ item }}</li>
                        </ul>
                      </div>
                    </div>
                    <div v-if="incidencia.categoria === 'LimpiezaChoque'">
                      <div class="container-fluid LimpiezaChoque">
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
                    <p class="mb-0"><strong>Descripción: </strong>{{ incidencia.descripcion }}</p>
                    <p class="mb-0"><strong>Información adicional añadida por el grabador: </strong>{{
                      incidencia.infoAdicio_grabador }}</p>
                  </div>
                </div>
              </transition>
            </li>
          </ul>
        </div>
        <div>
          <!-- /////////////////////////// Paginación de PrimeVue paginator////////////////////////////           -->
          <Paginator :rows="rows" v-model:first="first" :totalRecords="filtroDeBusqueda.length"
            @onPageChange="onPageChange"></Paginator>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
#edi {
  background-color: rgb(191, 220, 243);
  display: inline-block;
  border: 4px;
  border-radius: 10px;
  height: 400px;

}

.pop-up {
  background-color: rgba(33, 41, 52, .85);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  line-height: 2;
}

.pop-up-inner {
  background: #e2e0e0c4;
  max-width: 80%;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.estado-rojo {
  color: #FE2E64 !important;
  display: inline-block;
  padding: 5px 10px;
  border-radius: 50px;
  margin: 5px;

}

.estado-azul {
  color: blue !important;
  display: inline-block;
  padding: 5px 10px;
  border-radius: 50px;
  margin: 5px;
}

/* Estilos en pantallas pequeñas / reducidas */
#table {
  display: table;
}

#list {
  display: none;
}

@media screen and (max-width: 1350px) {
  #table {
    display: none;
  }

  #list {
    display: block;
  }
}
</style>

