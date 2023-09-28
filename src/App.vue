<script setup>
import Navbar from "@/components/Navbar.vue"
import Footer from "@/components/Footer.vue"
</script>

<template>
  <div class="contenido-aplicacion">
    <div class="contenedor-principal">
      <div>
        <Navbar />
      </div>
      <div class="contenedor-vistas">
        <router-view />
      </div>
      <div class="footer">
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
  padding: 20px 0;
  text-align: center;
}
</style>
