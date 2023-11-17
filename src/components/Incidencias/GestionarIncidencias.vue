<script setup>
import Navbar from "@/components/Navbar.vue"
</script>

<script>
import Calendar from "primevue/calendar";
import { mapState, mapActions } from 'pinia';
import { incidenciasStore } from '@/stores/incidencias.js';
import { loginStore } from "@/stores/loginStore";
import InputincidenciaGrabador from './InputincidenciaGrabador.vue';

export default {
  props: {
  },
  components: {
    Calendar, InputincidenciaGrabador,
  },
  emits: ["guardarIncidencia"],
  data() {
    return {
      dataSession: null,
      incidencia: {
        id: -1,
        zona: '',
        unidad: '',
        fechaInicio: '',
        fechaFin: '',
        numDias: '',
        estado: '',
        comunicaEmpresa: '',
        infoAdicio_grabador: '',
        descripcion: '',
        categoria: '',  // DeficienciaServicio//LimpiezaChoque//CambiosDependencia
        // DeficienciaServicio:{
        // incumplimiento: [],
        // },        
        incumplimiento: [],
        // LimpiezaChoque: {
        //   tipoChoque: '',
        //   gravedad: ''
        //   },
        tipoChoque: '',
        gravedad: '',
        // CambiosDependencia: {
        //   tipoCambio: '',
        //   tipoDependencia: '',
        //   metrosCuadrados: 0,
        //   },
        tipoCambio: '',
        tipoDependencia: '',
        metrosCuadrados: 0,
        demarcacion: '',
        _links: ''
      },
      mensajeError: [],
      $form: null,
    };
  },
  computed: {
    ...mapState(incidenciasStore, ['incidencias'], loginStore, ["perfil", "correo"]),
  },
  methods: {
    ...mapActions(incidenciasStore, ['getIncidencias', 'guardarIncidenciaStore']),

    manejarEdicionIncidencia(incidenciaConId) {
      debugger;
      const incidencia = incidenciaConId.data;
      this.incidencia.id = incidenciaConId.id;
      // Rellena el formulario con los datos de la incidencia
      this.incidencia.zona = incidencia.zona;
      this.incidencia.unidad = incidencia.unidad;
      this.incidencia.fechaInicio = incidencia.fechaInicio;
      this.incidencia.fechaFin = incidencia.fechaFin;
      this.incidencia.numDias = incidencia.numDias;
      this.incidencia.estado = incidencia.estado;
      this.incidencia.comunicaEmpresa = incidencia.comunicaEmpresa;
      this.incidencia.infoAdicio_grabador = incidencia.infoAdicio_grabador;
      this.incidencia.descripcion = incidencia.descripcion;
      this.incidencia.categoria = incidencia.categoria;
      this.incidencia._links = incidencia._links;
      //  campos específicos según la categoría
      if (incidencia.categoria === 'DeficienciaServicio') {
        this.incidencia.incumplimiento = incidencia.incumplimiento;
      }
      else if (incidencia.categoria === 'LimpiezaChoque') {
        this.incidencia.tipoChoque = incidencia.tipoChoque;
        this.incidencia.gravedad = incidencia.gravedad;
      } else if (incidencia.categoria === 'CambiosDependencia') {
        this.incidencia.tipoCambio = incidencia.tipoCambio;
        this.incidencia.tipoDependencia = incidencia.tipoDependencia;
        this.incidencia.metrosCuadrados = incidencia.metrosCuadrados;
      }
    },

    guardarIncidencia(incidencia) {
      debugger;
      console.log(JSON.stringify(incidencia))
      console.log(incidencia);
      if (this.validarFormulario()) {
        // Cuadro de confirmación
        const confirmacion = confirm('¿Está seguro de que desea editar la incidencia?');
        // Si el usuario confirma, realiza la acción de guardar
        if (confirmacion) {
          this.guardarIncidenciaStore(incidencia);
          // Mensaje de confirmación del envío de la incidencia
          this.mensajeConfirmaGuardado();
          // Limpieza de los campos tras el envío de la incidencia
          this.limpiarIncidencia();
        } else {
          // Acción adicional por si el usuario cancela
        }
      }
    },
    mensajeConfirmaGuardado() {
      ventanaMensaje.innerHTML = "";
      document.getElementById("ventanaMensaje").style.display = "block";
      let texto = "Su incidencia ha sido editada y guardada en el sistema";
      let mens = (document.textContent = texto);
      let elementoHtml = document.getElementById("ventanaMensaje");
      elementoHtml.append(mens);
      setTimeout(function () {
        document.getElementById("ventanaMensaje").style.display = "none";
      }, 7000);
    },
    calcularDiferenciaDias() {
      if (this.incidencia.fechaInicio && this.incidencia.fechaFin) {
        const fechaInicio = new Date(this.incidencia.fechaInicio);
        const fechaFin = new Date(this.incidencia.fechaFin);
        const diferencia = this.calcularDiferencia(fechaInicio, fechaFin);
        this.incidencia.numDias = diferencia;
      }
    },
    calcularDiferencia(fecha1, fecha2) {
      const unDia = 24 * 60 * 60 * 1000; // 1 día en milisegundos
      const diferencia = Math.round(Math.abs((fecha1 - fecha2) / unDia));
      return diferencia;
    },

    watch: {
      'incidencia.fechaInicio': 'calcularDiferenciaDias',
      'incidencia.fechaFin': 'calcularDiferenciaDias',
    },
    limpiarIncidencia() {
      this.incidencia.fechaInicio = ''
      this.incidencia.fechaFin = '';
      this.incidencia.numDias = '';
      this.incidencia.estado = '';
      this.incidencia.comunicaEmpresa = '';
      this.incidencia.infoAdicio_grabador = '';
      this.incidencia.descripcion = '';
      this.incidencia.disponible = '';
      this.incidencia.categoria = ''
      this.incidencia.demarcacion = ''
    },
    validarFormulario() {
      this.mensajeError = [];
      let valid = true;
      if (this.incidencia.fechaInicio == null || this.incidencia.fechaInicio.trim() === '') {
        valid = false;
        this.mensajeError.push('Inserte la fecha de inicio de la incidencia.');
      } else if (this.incidencia.fechaFin != null && this.incidencia.fechaFin.trim() !== '') {
        const fechaInicio = new Date(this.incidencia.fechaInicio);
        const fechaFin = new Date(this.incidencia.fechaFin);
        if (fechaFin < fechaInicio) {
          valid = false;
          this.mensajeError.push('La fecha de finalización no puede ser anterior a la fecha de inicio.');
        }
      } if (this.incidencia.estado == null || this.incidencia.estado.trim() === '') {
        valid = false;
        this.mensajeError.push('Inserte el estado de la incidencia.');
      }
      if (this.incidencia.comunicaEmpresa == null || this.incidencia.comunicaEmpresa.trim() === '') {
        valid = false;
        this.mensajeError.push('Inserte la fecha de comunicación por correo a la empresa responsable.');
      }
      if (this.incidencia.categoria == null || this.incidencia.categoria.trim() === '') {
        valid = false;
        this.mensajeError.push('Seleccione el tipo de la incidencia.');
      } else {
        if (this.incidencia.categoria === 'LimpiezaChoque') {
          if (this.incidencia.tipoChoque == null || this.incidencia.tipoChoque === '') {
            valid = false;
            this.mensajeError.push('Indique el tipo de limpieza de choque.');
          }
          if (this.incidencia.gravedad == null || this.incidencia.gravedad === '') {
            valid = false;
            this.mensajeError.push('Indique la gravedad (leve, grave o muy grave) de la limpieza de choque. ');
          }
        } else {
          if (this.incidencia.categoria === 'CambiosDependencia') {
            if (this.incidencia.tipoCambio == null || this.incidencia.tipoCambio === '') {
              valid = false;
              this.mensajeError.push('Indique el "Tipo de dependencia".');
            }
            if (this.incidencia.tipoDependencia == null || this.incidencia.tipoDependencia === '') {
              valid = false;
              this.mensajeError.push('Indique el tipo de dependencia en el caso de que su incidencia sea un cambio en las dependencias de la Unidad. ');
            }
            if (this.incidencia.metrosCuadrados == null || this.incidencia.metrosCuadrados === '' || this.incidencia.metrosCuadrados <= 0) {
              valid = false;
              this.mensajeError.push('Indique los metros cuadrados de superficie afectada en el cambio de dependencia de la Unidad.');
            }
          }
        }
      }
      if (this.incidencia.descripcion == null || this.incidencia.descripcion.trim() === '') {
        valid = false;
        this.mensajeError.push('Debe describir brevemente la incidencia en el apartado "Descripción".');
      }
      return valid;
    },
  },
  created() {
    debugger;
    const dataSesion = loginStore().recuperarSesion();
    this.incidencia.unidad = dataSesion.unidad;
    this.incidencia.zona = dataSesion.zona;
    this.getIncidencias();
  }
};
</script>
<template>
  <div>
    <Navbar />
  </div>
  <div class="container-fluid ancho">
    <h3 class="titulo">Formulario de edición de incidencias<p class="unidad"> {{ incidencia.unidad }}</p>
    </h3>
    <div class="row mt-3">
      <div class="col">

        <div class="row">
          <div class="col-12 col-md-9 mb-3">
            <!-- Componente InputincidenciaGrabador -->
            <InputincidenciaGrabador @editarIncidencia="manejarEdicionIncidencia" />

            <!-- Mensaje de error campos validación formulario -->
            <div class="mensajeError">
              <p v-if="mensajeError.length != 0" class="error">Revise los siguientes errores, si desea que se envíe el
                formulario:</p>
              <p class="error" v-for="error in mensajeError">{{ error }}</p>
            </div>
          </div>
          <div class="col-12 col-md-3 mb-3" id="edi">
            <p class="margeninput">Estado</p>
            <select name="estado" class="form-select" v-model="incidencia.estado">
              <option value="Comunicada a la empresa">Comunicada a la empresa</option>
              <option value="Comunicada a la empresa y resuelta">Comunicada a la empresa y resuelta</option>
              <option value="Enviada al SABAS">Enviada al SABAS</option>
            </select>
            <p class="margeninput" v-if="incidencia.estado === 'Comunicada a la empresa y resuelta'">Fecha fin de la
              incidencia</p>
            <input type="date" name="fechaFin" v-model="incidencia.fechaFin" @change="calcularDiferenciaDias"
              v-if="incidencia.estado === 'Comunicada a la empresa y resuelta'" required />
            <p class="margeninput">Información adicional por parte del grabador</p>
            <textarea placeholder="Información adicional de la incidencia" class="form-control" cols="30" rows="5"
              v-model.trim="incidencia.infoAdicio_grabador" />
            <button class="btn btn-success" id="botonGuardar" @click="guardarIncidencia(incidencia)" type="submit"
              value="Enviar">
              Guardar
            </button>
            <input type="button" @click="limpiarIncidencia()" value="Limpiar" style="background-color: rgb(0, 153, 255);">
          </div>
        </div>
        <!--ventana flotante de confirmación de envío del formulario-->
      </div>
      <div id="ventanaMensaje">
      </div>
    </div>
  </div>
  <!-- <input type="hidden" name="_captcha" value="false"> -->
</template>

<style>
.ancho {
  width: 95%;
  margin: 0 auto;
  background-color: #E6E6E6;
  padding: 20px;
  border: 4px;
  border-radius: 10px;
  margin-top: 5mm;
}

.incumplimiento {
  width: 90%;
  margin: 0 auto;
  background-color: #D8D8D8;
  padding: 20px;
}

.margeninput {
  margin-top: 10px;
  margin-bottom: 0px;
}

.titulo {
  color: #0B3B2E;
}

#botonGuardar {
  margin-right: 10px;
}

#edi {
  margin-top: 60px;
}

.unidad {
  color: blue;
  font-family: 'Times New Roman', Times, serif;

}
</style>

