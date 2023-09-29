<script>
import { mapActions, mapState } from "pinia"
import { loginStore } from "@/stores/loginStore"

export default {
  computed: {
    ...mapState(loginStore, ["rol","nombre"]),
  },
  methods: {
    ...mapActions(loginStore, ["cerrarSesion"]),
    cerrarSesionNav() {
      this.cerrarSesion();
      this.$router.push({ name: "Home" });
    },
  },
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-custom my-custom-nav">
    <div class="container-fluid">
      <div class="d-flex justify-content-start align-items-center">
        <div class="navbar-brand">
          <a href="#">
            <img src="/LogoAgesil.png" alt="Logo" />
          </a>
        </div>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <router-link class="nav-link" to="/nuevaIncidencia">Crear Incidencia</router-link>
          <router-link class="nav-link" to="/gestionarIncidencias">Gestionar Incidencias</router-link>
        </ul>
        <ul class="navbar-nav ms-auto">
          <!-- Desplegable de usuario -->
          <li v-if="rol !== ''" class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="usuarioDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="fas fa-user"></i> <!-- Icono de usuario -->
            </a>
            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-lg-end" aria-labelledby="usuarioDropdown">
              <li class="dropdown-item">
                <strong>{{ nombre }}</strong>
              </li>
              <li class="dropdown-item">
                {{ rol }}
              </li>
              <li class="dropdown-divider"></li>
              <li class="dropdown-item">
                <button class="btn btn-link" @click="cerrarSesionNav()">Cerrar Sesión</button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background: var(--gradiente-navbar);
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
}

.navbar-brand {
  display: flex;
  align-items: center;
  height: 100%;
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--color-Textoprimario);
}

.navbar-brand img {
  max-width: var(--ancho-max-logo);
  max-height: calc(var(--ancho-max-logo) * var(--proporcion-logo));
  margin-right: 0.5rem;
}

.navbar-nav {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  margin: 0;
}

.nav-item {
  margin-left: 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-Textoprimario);
}

.nav-item:last-child {
  margin-right: 0;
}

.nav-link {
  display: block;
  padding: 0.5rem 1rem;
  color: var(--color-Textoprimario);
  text-decoration: none;
  transition: color var(--tiempo-transicion);
  text-shadow: 2px 2px 2px rgba(255, 255, 255, 0.8), -1px -1px 1px rgba(0, 0, 0, 0.5),
    0 0 2px rgba(0, 0, 0, 0.3);
}

.nav-link:hover {
  color: inherit;
  text-shadow: 3px 3px 3px rgba(255, 255, 255, 0.8), -2px -2px 2px rgba(0, 0, 0, 0.5),
    0 0 4px rgba(0, 0, 0, 0.3);
}

.nav-link.active {
  color: transparent;
}

.toggle-login {
  position: absolute;
  right: 1.5em;
}

/* Para dispositivos pequeños */
@media (max-width: 767px) {
  .navbar {
    height: auto;
    position: sticky;
    padding: 1rem;
    z-index: 999;
  }

  .navbar-brand {
    font-size: 1.2rem;
  }

  .navbar-nav {
    flex-direction: column;
    margin-top: 1rem;
    height: auto;
  }

  .nav-item {
    margin-bottom: 1rem;
    margin-right: 0;
    text-align: center;
  }

  .toggle-login {
    margin-right: auto;
    margin-right: 0;
    margin-top: 1rem;
  }
}
</style>
