<script>
import Calendar from "primevue/calendar"
import { mapState, mapActions } from 'pinia'
import { incidenciasStore } from '@/stores/incidencias.js'

export default {
   props: {},
  components: {
    Calendar,   
  },
 emits: ["guardarIncidencia"],
  data() {
    return {
      incidencia: {
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
        tipoChoque:'',
        gravedad:'',          
        // CambiosDependencia: {
        //   tipoCambio: '',
        //   tipoDependencia: '',
        //   metrosCuadrados: 0,
        //   },
          tipoCambio: '',
          tipoDependencia: '',
          metrosCuadrados: 0,
          _links: ''         
      }, 
    };
  },
  computed: {
    ...mapState(incidenciasStore, ['incidencias']),
  },
  methods: {
    ...mapActions(incidenciasStore, ['getIncidencias', 'guardarIncidenciaStore']),

    guardarIncidencia(incidencia) {          
        console.log(JSON.stringify(incidencia))
        console.log(incidencia);        
        this.guardarIncidenciaStore(incidencia)
        this.limpiarIncidencia();
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
    },
  },
  created() {
    this.getIncidencias();
  },
};
</script>

<template>
  <p>
  Incidencia enviará:  {{ incidencia }}
  </p>
  <br>
  <div class="container-fluid ancho">
    <h3 class="titulo">Formulario de grabación de incidencias</h3> 
    <div class="row mt-3"> 
      <div class="col">
       <div class="row">
         <div class="col-12 col-md-6 mb-3">
           <p class="margeninput">Zona</p>
           <input type="text" placeholder="Zona destino usuario" class="form-control" v-model="incidencia.zona" />     
         </div>
         <div class="col-12 col-md-6 mb-3">
           <p class="margeninput">Unidad</p>
           <input type="text" placeholder="Introduzca la Unidad del usuario" class="form-control" v-model="incidencia.unidad" /> 
         </div>    
  </div>

  <div class="row">
    <div class="col-12 col-md-4 mb-3">     
      <p class="margeninput">Fecha de inicio de la incidencia</p>
      <Calendar v-model.trim="incidencia.fechaInicio" dateFormat="dd/MM/yy"></Calendar>      
    </div>
    <div class="col-12 col-md-4 mb-3">
      <p class="margeninput">Fecha fin de la incidencia</p>
      <Calendar v-model.trim="incidencia.fechaFin" dateFormat="dd/MM/yy"></Calendar>
    </div>
    <div class="col-12 col-md-4 mb-3">     
      <p class="margeninput">Número de días</p>
      <input type="text" placeholder="Número de días" class="form-control" v-model="incidencia.numDias" />
    </div>
  </div>
               
  <div class="row">
    <div class="col-12 col-md-4 mb-3">     
      <p class="margeninput">Estado</p>
				<select name="pais" id="estado" class="form-select" v-model="incidencia.estado">
					 <option value="Comunicada a la empresa">Comunicada a la empresa</option>
					 <option value="Comunicada a la empresa y resuelta">Comunicada a la empresa y resuelta</option>
					 <option value="Enviada al SABAS">Enviada al SABAS</option>
           <option value="Pendiente de tratar en la reunión mensual">Pendiente de tratar en la reunión mensual</option>
           <option value="En trámite">En trámite</option>
           <option value="Cerrada">Cerrada</option>
				</select> 
    </div>
    <div class="col-12 col-md-4 mb-3">
      <p class="margeninput">Fecha de comunicación por correo a la empresa responsable</p>
      <Calendar v-model.trim="incidencia.comunicaEmpresa" dateFormat="dd/MM/yy"></Calendar>
    </div> 
  </div>        
        

<div class="my-2">
      <p class="margeninput">Seleccione el tipo de incidencia</p>     
      <div class="form-radio form-radio-inline">
        <div class="form-check form-check-inline">
        <input type="radio" class="form-check-input" id="radio-1" v-model="incidencia.categoria" value="DeficienciaServicio" />
        <label for="radio-1" class="form-check-label">Deficiencias o incumplimientos en la prestación del servicio</label>
        </div>
      </div>
      <div class="form-radio form-radio-inline">
        <div class="form-check form-check-inline">
        <input type="radio" class="form-check-input" id="radio-2" v-model="incidencia.categoria" value="LimpiezaChoque" />
        <label for="radio-2" class="form-check-label">Limpieza de choque</label>
        </div>
      </div>
      <div class="form-radio form-radio-inline">
        <div class="form-check form-check-inline">
        <input type="radio" class="form-check-input" id="radio-3" v-model="incidencia.categoria" value="CambiosDependencia" />
        <label for="radio-3" class="form-check-label">Cambios en las dependencias de la Unidad</label>
        </div>
      </div>
    </div>

<div v-if="incidencia.categoria === 'DeficienciaServicio'" :disabled="incidencia.categoria === 'LimpiezaChoque' && incidencia.categoria === 'CambiosDependencia' ">
<div class="container-fluid incumplimiento">
  <div class="row">
    <div class="col-12 col-md-12 mb-3">


  <div class="container-fluid distribuyeIncumpliminetoscolumnas">  
    <div class="row mt-3"> 
      <div class="col">
       <div class="row">
         <div class="col-12 col-md-4 mb-3">
       <div class="row">
        <div class="col-12 mb-3">
          <div class="form-check form-check-inline">
            <input
              type="checkbox"
              class="form-check-input"
              id="check-1"
              v-model="incidencia.incumplimiento"
              value="LLG01O0. Falta total de prestación de servicio en una unidad"
            />
            <label for="check-1" class="form-check-label">Falta total de prestación de servicio en una unidad.</label>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12 mb-3">
          <div class="form-check form-check-inline">
            <input
              type="checkbox"
              class="form-check-input"
              id="check-2"
              v-model="incidencia.incumplimiento"
              value="LLG01O1. Limpieza de polvo en despachos, oficinas, pasillos, etc, sobre el mobiliario en general, en todas las dependencias"
            />
            <label for="check-2" class="form-check-label">Limpieza de polvo en despachos, oficinas, pasillos, etc, sobre el mobiliario en general, en todas las dependencias.</label>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12 mb-3">
          <div class="form-check form-check-inline">
            <input
              type="checkbox"
              class="form-check-input"
              id="check-3"
              v-model="incidencia.incumplimiento"
              value="LLG01O2. Vaciado y limpieza de ceniceros y papeleras"
            />
            <label for="check-3" class="form-check-label">Vaciado y limpieza de ceniceros y papeleras.</label>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12 mb-3">
          <div class="form-check form-check-inline">
            <input
              type="checkbox"
              class="form-check-input"
              id="check-4"
              v-model="incidencia.incumplimiento"
              value="LLG01O3. Escrupulosa limpieza de cuartos de aseo, servicios y vestuarios, para el mantenimiento de los mismos en perfectas condiciones higiénicas y sanitarias"
            />
            <label for="check-3" class="form-check-label">Escrupulosa limpieza de cuartos de aseo, servicios y vestuarios, para el mantenimiento de los mismos en perfectas condiciones higiénicas y sanitarias.</label>
          </div>
        </div>
      </div> 
      <div class="row">
        <div class="col-12 mb-3">
          <div class="form-check form-check-inline">
            <input
              type="checkbox"
              class="form-check-input"
              id="check-5"
              v-model="incidencia.incumplimiento"
              value="LLG01O4. Barrido y fregado de suelos"
            />
            <label for="check-3" class="form-check-label">Barrido y fregado de suelos.</label>
          </div>
        </div>
      </div> 
      <div class="row">
        <div class="col-12 mb-3">
          <div class="form-check form-check-inline">
            <input
              type="checkbox"
              class="form-check-input"
              id="check-6"
              v-model="incidencia.incumplimiento"
              value="LLG01O5. Limpieza y conservación con productos adecuados de suelos de parquet, entarimados, etc"
            />
            <label for="check-3" class="form-check-label">Limpieza y conservación con productos adecuados de suelos de parquet, entarimados, etc.</label>
          </div>
        </div>
      </div> 
      <div class="row">
        <div class="col-12 mb-3">
          <div class="form-check form-check-inline">
            <input
              type="checkbox"
              class="form-check-input"
              id="check-7"
              v-model="incidencia.incumplimiento"
              value="LLG01O6. Limpieza de suelos por aspiración de moquetas, alfombras, etc"
            />
            <label for="check-3" class="form-check-label">Limpieza de suelos por aspiración de moquetas, alfombras, etc.</label>
          </div>
        </div>
      </div>         
 
      </div>
         <div class="col-12 col-md-4 mb-3">
       <div class="row">
        <div class="col-12 mb-3">
          <div class="form-check form-check-inline">
            <input
              type="checkbox"
              class="form-check-input"
              id="check-8"
              v-model="incidencia.incumplimiento"
              value="LLG01O7. Limpieza en general de talleres"
            />
            <label for="check-3" class="form-check-label">Limpieza en general de talleres.</label>
          </div>
        </div>
      </div> 
      <div class="row">
        <div class="col-12 mb-3">
          <div class="form-check form-check-inline">
            <input
              type="checkbox"
              class="form-check-input"
              id="check-9"
              v-model="incidencia.incumplimiento"
              value="LLG01O8. Limpieza y desinfección en calabozos"
            />
            <label for="check-3" class="form-check-label">Limpieza y desinfección en calabozos.</label>
          </div>
        </div>
      </div> 
      <div class="row">
        <div class="col-12 mb-3">
          <div class="form-check form-check-inline">
            <input
              type="checkbox"
              class="form-check-input"
              id="check-10"
              v-model="incidencia.incumplimiento"
              value="LLG01O9. Cepillado de butacas, sillones, sillas, etc"
            />
            <label for="check-10" class="form-check-label">Cepillado de butacas, sillones, sillas, etc.</label>
          </div>
        </div>
      </div> 
      <div class="row">
        <div class="col-12 mb-3">
          <div class="form-check form-check-inline">
            <input
              type="checkbox"
              class="form-check-input"
              id="check-11"
              v-model="incidencia.incumplimiento"
              value="LLG0110. Limpieza con productos adecuados de todos los metales en general, tales como pomos de puertas, cromados y puertas de aluminio"
            />
            <label for="check-11" class="form-check-label">Limpieza con productos adecuados de todos los metales en general, tales como pomos de puertas, cromados y puertas de aluminio.</label>
          </div>
        </div>
      </div> 
      <div class="row">
        <div class="col-12 mb-3">
          <div class="form-check form-check-inline">
            <input
              type="checkbox"
              class="form-check-input"
              id="check-12"
              v-model="incidencia.incumplimiento"
              value="LLG0111. Limpieza de paredes, techos y cornillas, utilizando cepillos o aspiradores de polvo adecuados"
            />
            <label for="check-12" class="form-check-label">Limpieza de paredes, techos y cornillas, utilizando cepillos o aspiradores de polvo adecuados.</label>
          </div>
        </div>
      </div> 
      <div class="row">
        <div class="col-12 mb-3">
          <div class="form-check form-check-inline">
            <input
              type="checkbox"
              class="form-check-input"
              id="check-13"
              v-model="incidencia.incumplimiento"
              value="LLG0112. Limpieza exterior de aparatos de telefonía, ordenadores y sus periféricos, utilizando productos adecuados"
            />
            <label for="check-13" class="form-check-label">Limpieza exterior de aparatos de telefonía, ordenadores y sus periféricos, utilizando productos adecuados.</label>
          </div>
        </div>
      </div> 
      <div class="row">
        <div class="col-12 mb-3">
          <div class="form-check form-check-inline">
            <input
              type="checkbox"
              class="form-check-input"
              id="check-14"
              v-model="incidencia.incumplimiento"
              value="LLG0113. Limpieza de puntos de luz tales como tubos fluorescentes, lámparas, globos, apliques, flexos, etc"
            />
            <label for="check-14" class="form-check-label">Limpieza de puntos de luz tales como tubos fluorescentes, lámparas, globos, apliques, flexos, etc.</label>
          </div>
        </div>
      </div> 
         </div>    
         <div class="col-12 col-md-4 mb-3">
       <div class="row">
        <div class="col-12 mb-3">
          <div class="form-check form-check-inline">
            <input
              type="checkbox"
              class="form-check-input"
              id="check-15"
              v-model="incidencia.incumplimiento"
              value="LLG0114. Limpieza en general, barrido y limpieza de suelos mediante agua a presión de garajes y talleres"
            />
            <label for="check-15" class="form-check-label">Limpieza en general, barrido y limpieza de suelos mediante agua a presión de garajes y talleres.</label>
          </div>
        </div>
      </div> 
      <div class="row">
        <div class="col-12 mb-3">
          <div class="form-check form-check-inline">
            <input
              type="checkbox"
              class="form-check-input"
              id="check-16"
              v-model="incidencia.incumplimiento"
              value="LLG0115. Limpieza general de viales, pistas e instalaciones deportivas"
            />
            <label for="check-15" class="form-check-label">Limpieza general de viales, pistas e instalaciones deportivas.</label>
          </div>
        </div>
      </div> 
      <div class="row">
        <div class="col-12 mb-3">
          <div class="form-check form-check-inline">
            <input
              type="checkbox"
              class="form-check-input"
              id="check-17"
              v-model="incidencia.incumplimiento"
              value="LLG0116. Limpieza de cuartos de máquinas de ascensores, cuartos de grupos electrógenos, cuartos de calderas, etc"
            />
            <label for="check-17" class="form-check-label">Limpieza de cuartos de máquinas de ascensores, cuartos de grupos electrógenos, cuartos de calderas, etc.</label>
          </div>
        </div>
      </div> 
      <div class="row">
        <div class="col-12 mb-3">
          <div class="form-check form-check-inline">
            <input
              type="checkbox"
              class="form-check-input"
              id="check-18"
              v-model="incidencia.incumplimiento"
              value="LLG0117. Vaciado de papeleras en recintos y viales"
            />
            <label for="check-18" class="form-check-label">Vaciado de papeleras en recintos y viales.</label>
          </div>
        </div>
      </div> 
      <div class="row">
        <div class="col-12 mb-3">
          <div class="form-check form-check-inline">
            <input
              type="checkbox"
              class="form-check-input"
              id="check-19"
              v-model="incidencia.incumplimiento"
              value="LLG0118. Limpieza de persianas y persianeros, utilizando los medios adecuados"
            />
            <label for="check-19" class="form-check-label">Limpieza de persianas y persianeros, utilizando los medios adecuados.</label>
          </div>
        </div>
      </div> 
      <div class="row">
        <div class="col-12 mb-3">
          <div class="form-check form-check-inline">
            <input
              type="checkbox"
              class="form-check-input"
              id="check-20"
              v-model="incidencia.incumplimiento"
              value="LLG0119. Abrillantado o acristalado en suelos con los productos adecuados"
            />
            <label for="check-20" class="form-check-label">Abrillantado o acristalado en suelos con los productos adecuados.</label>
          </div>
        </div>
      </div> 
      <div class="row">
        <div class="col-12 mb-3">
          <div class="form-check form-check-inline">
            <input
              type="checkbox"
              class="form-check-input"
              id="check-21"
              v-model="incidencia.incumplimiento"
              value="LLC0101. Limpieza de cristales en ventanas y puertas por las dos caras, así como mamparas, celosías, claraboyas, etc de ese material"
            />
            <label for="check-21" class="form-check-label">Limpieza de cristales en ventanas y puertas por las dos caras, así como mamparas, celosías, claraboyas, etc de ese material.</label>
          </div>
        </div>
      </div> 
      <div class="row">
        <div class="col-12 mb-3">
          <div class="form-check form-check-inline">
            <input
              type="checkbox"
              class="form-check-input"
              id="check-22"
              v-model="incidencia.incumplimiento"
              value="LTS0101. Abrillantado o acristalado de suelos con los productos adecuado"
            />
            <label for="check-22" class="form-check-label">Abrillantado o acristalado de suelos con los productos adecuados.</label>
          </div>
        </div>
      </div> 
    </div>
  </div>
</div>
</div>   
</div>   
</div>
</div>
</div> 
</div> 
       
<div v-if="incidencia.categoria === 'LimpiezaChoque'" :disabled="incidencia.categoria === 'incumplimiento' && incidencia.categoria === 'CambiosDependencia' ">
  <div class="container-fluid incumplimiento">
    <div class="form-check form-check-inline">

        <div class="row">
        <div class="col-12 mb-3">
          <p class="margeninput">Tipo de limpieza de choque</p>
          <select name="limpiezaChoque" id="tipo_LimpiezaChoque" class="form-select" v-model="incidencia.tipoChoque">
            <option value="Desinfección y desinsectación">Desinfección y desinsectación</option>
            <option value="Desratización">Desratización</option>            
          </select>
        </div>
      </div>
      <div class="row">
        <div class="col-12 mb-3">
          <p class="margeninput">Gravedad</p>
          <select name="gravedad" id="gravedad_LimpiezaChoque" class="form-select" v-model="incidencia.gravedad">
            <option value="leve">Leve</option>
            <option value="grave">Grave</option>
            <option value="muy grave">Muy grave</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</div>
     
<div v-if="incidencia.categoria === 'CambiosDependencia'" :disabled="incidencia.categoria === 'LimpiezaChoque' && incidencia.categoria === 'incumplimiento' ">
 <div class="container-fluid incumplimiento">

<div class="form-check form-check-inline">
      <div class="row">
        <div class="col-12 mb-3">
          <p class="margeninput">Tipo de dependencia</p>
          <select name="tipo_dependencia" id="tipo_dependencia" class="form-select" v-model="incidencia.tipoDependencia">
            <option value="Despachos, oficinas y almacenes">Despachos, oficinas y almacenes.</option>
            <option value="Zonas comunes, pasillos y escaleras, salas de espera, vestíbulos y recepciones">Zonas comunes, pasillos y escaleras, salas de espera, vestíbulos y recepciones.</option>
            <option value="Patios interiores y viales de uso exclusivo oficial">Patios interiores y viales de uso exclusivo oficial.</option>
            <option value="Garajes">Garajes (solo y exclusivamente aquellos en que se guardan vehículos oficiales, uniformados y/o camuflados).</option>
            <option value="Calabozos">Calabozos (se refiere a la superficie)</option>
            <option value="W.C. y aseos">W.C. y aseos (se refiere a la superficie)</option>
            <option value="Cristales">Cristales (se refiere a la superficie) </option>
          </select>
          <p class="margeninput">Metros cuadrados de superficie afectada</p>
          <input type="number" min="0" placeholder="Introduzca introduzca los metros cuadrados de superficie" class="form-control"
          v-model.number="incidencia.metrosCuadrados" />
        </div>
      </div> 
      <div class="row">
        <div class="col-12 mb-3">
          <p class="margeninput">Tipo de cambio</p>
          <select name="tipo_cambio" id="tipo_cambio" class="form-select" v-model="incidencia.tipoCambio">
            <option value="LCD0100. Alta de dependencias">Alta de dependencias.</option>
            <option value="LCD0101. Baja de dependencias">Baja dependencias.</option>
            <option value="LCD0102. Ampliación en la extensión de dependencias">Ampliación en la extensión de dependencias.</option>
            <option value="LCD0103. Disminución en la extensión de dependencias">Disminución en la extensión de dependencias.</option>            
          </select>
          
        </div>
      </div>      
    </div>  
 
</div>

</div>
<p class="margeninput">Descripción</p>      
  <textarea name="text" placeholder="Descripción de la incidencia" class="form-control" cols="30" rows="6" v-model="incidencia.descripcion" />
    <p class="margeninput">Información adicional por parte del grabador</p>
  <textarea name="text" placeholder="Información adicional de la incidencia" class="form-control" cols="30" rows="5" v-model="incidencia.infoAdicio_grabador" />                  
    <button type="button" class="btn btn-success" @click="guardarIncidencia(incidencia)">
      Enviar por correo a empresa responsable y GUARDAR
    </button>       
   </div>
  </div>
</div>   

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
</style>


