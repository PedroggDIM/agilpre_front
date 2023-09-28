<script>
import { loginStore } from "@/stores/loginStore"

export default {
  data() {
    return {
      usuario: {
        nombre: "",
        clave: "",
      },
      errorInicioSesion: false,
    }
  },
  methods: {
    async iniciarSesion() {
      // Esperar a que loginstore se comunique con la api y guardar respuesta
      const exito = await loginStore().iniciarSesion(this.usuario.nombre, this.usuario.clave)
      
      if (exito) {
        this.$router.push("/bienvenida")
      } else {
        this.errorInicioSesion = true
      }
    },
    resetearFormulario() {
      this.usuario.nombre = ""
      this.usuario.clave = ""
      this.errorInicioSesion = false
    },
  },
}
</script>

<template>
  <div class="container">
    <div class="row justify-content-center mt-5">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body text-center">
            <div class="mb-4">
              <img src="loginIcon.webp" alt="Imagen de login" class="rounded-circle">
            </div>
            <h2 class="mb-4">Iniciar sesión</h2>
            <form @submit.prevent="iniciarSesion">
              <div class="mb-3">
                <input type="text" class="form-control" placeholder="Usuario" v-model="usuario.nombre">
              </div>
              <div class="mb-3">
                <input type="password" class="form-control" placeholder="Contraseña" v-model="usuario.clave">
              </div>
              <button type="submit" class="btn btn-primary">Enviar</button>
              <button type="button" class="btn btn-secondary" @click="resetearFormulario()">Borrar</button>
            </form>
            <div v-if="errorInicioSesion" class="text-danger mt-3">
              Usuario o contraseña incorrectos
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.container {
  text-align: center;
  padding-top: 20px;
}

.card {
  margin-top: 20px;
}

.card-body {
  text-align: center;
}

.card img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.card h2 {
  margin-bottom: 20px;
}

.form-control {
  margin-bottom: 15px;
}

.btn-primary {
  margin-right: 10px;
}

.text-danger {
  margin-top: 10px;
}
</style>
