import { createApp } from "vue"
import { createRouter, createWebHashHistory } from "vue-router"
import "./style.css"
import App from "@/App.vue"
import { createPinia } from "pinia"
import { loginStore } from "@/stores/loginStore.js"

// Importar y declarar las vistas
import Home from "@/components/Home.vue"
const Bienvenida = () => import('@/components/Bienvenida.vue')
const NuevaIncidencia = () => import('@/components/NuevaIncidencia.vue')

// Importar estilos e iconos
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import "primeicons/primeicons.css"
import "@fortawesome/fontawesome-free/css/all.min.css"

// Crear la instancia de Pinia
const pinia = createPinia()

// Definir las rutas
const routes = [
  { path: "/",                      name: "Home",                 component: Home               },
  { path: "/bienvenida",            name: "Bienvenida",           component: Bienvenida         },
  { path: "/nuevaIncidencia",       name: "NuevaIncidencia",      component: NuevaIncidencia    }
]


// Crear el enrutador
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Guarda de navegación
router.beforeEach((to, from, next) => {
  const login = loginStore()

  if (to.name === "Home") {
    next()
  } else if (login.rol === "usuario" || login.rol === "administrador") {
    next()
  } else {
    next({ name: "Home" })
  }
})

// Montar la aplicación
const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount("#app")
