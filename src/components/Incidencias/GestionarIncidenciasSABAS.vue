<script setup>
import Navbar from "@/components/Navbar.vue"
</script>
<script>
import { mapActions, mapState } from 'pinia'
import axios from 'axios'
import { incidenciasStore } from '@/stores/incidencias.js'
import DataTable from 'datatables.net-vue3'
import DataTableLib from 'datatables.net-bs5'
import Buttons from 'datatables.net-buttons-bs5'
import ButtonsHtml5 from 'datatables.net-buttons/js/buttons.html5'
import print from 'datatables.net-buttons/js/buttons.print'
import pdfmake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import 'datatables.net-responsive-bs5';
import JsZip from 'jszip';
import Navbar from "@/components/Navbar.vue";
window.JsZip = JsZip;
DataTable.use(DataTableLib);
DataTable.use(pdfmake);
DataTable.use(ButtonsHtml5);

export default {
  components: { DataTable },
  props: ['incidencia'],

  data() {
    return {
      //    incidencias:null,
      columns: [
        {
          data: null,
          render: function (data, type, row, meta) {
            return `<button class="btn btn-success" @click="editarIncidencia(${row.id})">Editar${row.id}</button>
                  <button class="btn btn-primary" @click="editarIncidencia(${row.id})">Consultar</button>
                  <button class="btn btn-danger" @click="editarIncidencia(${row.id})">Eliminar</button>`
          }
        },
        { data: 'id' },
        { data: 'fechaInicio' },
        { data: 'numDias' },
        { data: 'estado' },
        { data: 'comunicaEmpresa' },
        { data: 'categoria' },
        { data: 'descripcion' },
        { data: 'infoAdicio_grabador' },
        { data: 'unidad' },
        { data: 'zona' },
      ],
    };
  },
  created() {
    debugger;
    this.getIncidencias();
  },
  computed: {
    ...mapState(incidenciasStore, ['getIncidencias', 'incidencias']),
  },
  methods: {
    editarIncidencia(id) {
      debugger;
      console.log(`Editar incidencia con ID: ${id}`);
    }
  },
}

</script>

<template>
  <div>
    <Navbar />
  </div>
  <h5>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Gestión y reportes de incidencias</h5>
  <div class="row">
    <div class="ancho">
      <div class="table-responsive">
        <DataTable :data="incidencias" :columns="columns" class="table table-striped table-bordred display" :options="{
          responsive: true, autoWidth: false, dom: 'Bfrtip', language: {
            search: 'Buscar', zeroRecords: 'No hay registros para mostrar',
            info: 'Mostrando del _START_a_END_de_TOTAL_registros',
            infoFiltered: '(Filtrados de _MAX_registros.)',
            paginate: { first: 'Primero', previous: 'Anterior', next: 'Siguiente', last: 'Último' }
          }
        }">
          <thead>
            <tr>
              <th>Gestión</th>
              <th>Número</th>
              <th>Fecha de inicio</th>
              <th>Días</th>
              <th>Estado</th>
              <th>Conocimiento Empresa</th>
              <th>Categoria</th>
              <th>Descripción</th>
              <th>Actualizaciones</th>
              <th>Unidad</th>
              <th>Zona</th>
            </tr>
          </thead>
        </DataTable>
      </div>
    </div>
  </div>
  <!-- <h6 v-for="item of incidencias">{{ item }}</h6> -->
  <!-- <p class="mb-0"><strong>Id: </strong>{{ incidencia.id }}</p>
          <p class="mb-0"><strong>Zona: </strong>{{ incidencia.zona }}</p>  
          <p class="mb-0"><strong>Unidad: </strong>{{ incidencia.unidad }}</p>  
          <p class="mb-0"><strong>Fecha inicio: </strong>{{ incidencia.fechaInicio }}</p>  
          <p class="mb-0"><strong>Fecha fin: </strong>{{ incidencia.fechaFin }}</p> 
          <p class="mb-0"><strong>Duración en días: </strong>{{ incidencia.numDias }}</p>   
          <p class="mb-0"><strong>Estado: </strong>{{ incidencia.estado }}</p>         						
          <p class="mb-0"><strong>Fecha de comunicación a empresa responsable: </strong>{{ incidencia.comunicaEmpresa}}</p>
          <p class="mb-0"><strong>Información adicional añadida por el grabador: </strong>{{ incidencia.infoAdicio_grabador }}</p>  
          <p class="mb-0"><strong>Descripción: </strong>{{ incidencia.descripcion }}</p>         						
          <p class="mb-0"><strong>Categoria: </strong>{{ incidencia.categoria }}</p>          -->
</template>
<style>
.ancho {
  width: 95%;
  margin: 0 auto;  
  background-color: #E6E6E6;  
  padding: 20px;  
  border: 4px;
  border-radius: 10px;
}
.mb-0 {
  margin: 5px;
}
</style>
