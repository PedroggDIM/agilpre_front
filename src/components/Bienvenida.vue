<script setup>
import Navbar from "@/components/Navbar.vue"
</script>

<script>
export default {
  data() {
    return {
      titulo: 'Componente de Bienvenida',
    };
  },
};
</script>

<template>
  <div>
    <Navbar />
  </div>
  <!-- Zona que invita a crear una incidencia -->
  <div>
    <div class="card_header">
        <br><br>
        <h1 class="card_titulo">AGESIL</h1>
        <p class="card_descripcion">
          Este es el texto que explica en que consiste la aplicación.
        </p>
        <p></p>
        <router-link to="/nuevaIncidencia" class="btn-gen btn-bienvenida">Nueva Incidencia</router-link>
      </div>
  </div>
</template>

<style>
.btn-bienvenida {
  background-color: #409eff;
  color: var(--color-color-TextoPrimario);
}
</style>