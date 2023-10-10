<script setup>
import Footer from "@/components/Footer.vue"
</script>

<template>
  <div class="contenido-aplicacion">
    <div class="contenedor-principal">
    

      <div class="contenedor-vistas">
        <router-view />
      </div>
      
    <!-- Footer -->
      <div class="footer fixed-bottom">
        <Footer />
      </div>

    </div>
  </div>
</template>

<style scoped>
.contenido-aplicacion {
  width: 100%;
  height: 100%;
}

.contenedor-principal {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.contenedor-vistas {
  flex: 1;
}

.footer {
  background-color: var(--color-secundario);
  color: var(--color-primario);
  padding: 5px 0;
  text-align: center;
}
</style>
