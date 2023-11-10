<script>
import { mapActions, mapState } from 'pinia'
import { incidenciasStore } from '@/stores/incidencias.js';
import moment from "moment";
import { ref } from 'vue';
import 'primevue/resources/primevue.min.css'; // Estilo de PrimeVue
import 'primeicons/primeicons.css'; // Iconos de PrimeIcons
import Paginator from 'primevue/paginator';

export default {
  props: ['incidencia'],
  components: {
    Paginator,
  },
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
      // return filtroDeIncidencias.slice(0, 4);
      return filtroDeIncidencias;
    },
  },
  methods: {
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
    editarIncidencia(incidencia) {
      // Emite el evento 'editarIncidencia' con la incidencia y su id
      this.$emit("editarIncidencia", {
        id: incidencia.id,
        data: incidencia
      });
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

            <table class="table table-sm" id="table">
          <thead class="table-light">
            <tr>
              <th scope="col">Número</th>
              <th scope="col">Inicio</th>
              <th scope="col">Comunica</th>
              <th scope="col">Estado</th>
              <th scope="col">Tipo de incidencia</th>
              <th scope="col">Descripción:</th>
              <th scope="col">Info. adicional</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <!-- Utilizo v-for solo para las filas de la tabla -->
            <tr v-for="(incidencia, index) in visibleIncidencias" :key="incidencia.id">
              <th>{{ incidencia.id }}</th>
              <td class="ancho-columna">{{ formatDate(incidencia.fechaInicio) }}</td>
              <td class="ancho-columna">{{ formatDate(incidencia.comunicaEmpresa) }}</td>
              <td>{{ incidencia.estado }}</td>
              <td>{{ incidencia.categoria }}</td>
              <td>{{ incidencia.descripcion }}</td>
              <td>{{ incidencia.infoAdicio_grabador }}</td>
              <td>
                <button type="button" class="btn btn-info" @click="togglePopUp(incidencia)">Consultar</button>
              </td>
              <td>
                <button type="button" class="btn btn-warning btn-sm" @click="editarIncidencia(incidencia)">Enviar a
                  SABAS/Editar</button>
              </td>
              <!--/////////////////////////// Contenido de la ventana emergente ///////////////////////////-->
              <transition name="fade">
                <div v-if="incidencia.showPopup" class="pop-up">
                  <button type="button" class="btn btn-secondary" @click="closePopUp(incidencia)">Cerrar</button>
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
            </tr>
          </tbody>
            </table>

            <!-- La lista que se mostrará en pantallas pequeñas -->
            <ul id="list">
             <li v-for="(incidencia, index) in visibleIncidencias" :key="incidencia.id">
              <p class="mb-0"><strong>Número: </strong>{{ incidencia.id }}</p>
              <p class="mb-0"><strong>Zona: </strong>{{ incidencia.zona }}</p>
              <p class="mb-0"><strong>Unidad: </strong>{{ incidencia.unidad }}</p>
              <p class="mb-0"><strong>Fecha inicio: </strong>{{ formatDate(incidencia.fechaInicio) }}</p>
              <p class="mb-0"><strong>Fecha fin: </strong>{{ formatDate(incidencia.fechaFin) }}</p>
              <p class="mb-0"><strong>Duración en días: </strong>{{ incidencia.numDias }}</p>
              <p class="mb-0"><strong>Estado: </strong>{{ incidencia.estado }}</p>
              <p class="mb-0"><strong>Fecha comunica empresa responsable: </strong>{{
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
                  Tipo de choque: {{ incidencia.tipoChoque }}
                  Gravedad: {{ incidencia.gravedad }}
                </div>
              </div>

              <div v-if="incidencia.categoria === 'CambiosDependencia'">
                <div class="container-fluid LimpiezaChoque">
                  <h5>Cambios en las dependencias oficiales:</h5>
                  Tipo de cambio: {{ incidencia.tipoCambio }}
                  Dependencias afectadas: {{ incidencia.tipoDependencia }}
                  Superficie afectada en metros: {{ incidencia.metrosCuadrados }}
                </div>
              </div>
              <td>
                <button type="button" class="btn btn-info" @click="togglePopUp(incidencia)">Consultar</button>
              </td>
              <td>
                <button type="button" class="btn btn-warning btn-sm" @click="editarIncidencia(incidencia)">Enviar a
                  SABAS/Editar</button>
              </td>
              <!--/////////////////////////// Contenido de la ventana emergente ///////////////////////////-->
              <transition name="fade">
                <div v-if="incidencia.showPopup" class="pop-up">
                  <button type="button" class="btn btn-secondary" @click="closePopUp(incidencia)">Cerrar</button>
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

/* Estilos de la tabla en pantallas grandes */
#table {
  display: table; /* Muestra la tabla en pantallas grandes */
}

/* Estilos de la lista en pantallas pequeñas */
#list {
  display: none; /* Oculta la lista por defecto */
}

/* Regla @media para pantallas pequeñas (ancho menor de 1400px) */
@media screen and (max-width: 1350px) {
  #table {
    display: none; /* Oculta la tabla en pantallas pequeñas */
  }

  #list {
    display: block; /* Muestra la lista en pantallas pequeñas */
  }
}

.ancho-columna {
  width: 95px; /* Ajusta el ancho según tu preferencia */
}
</style>


