import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import "./style.css";
import App from "@/App.vue";
import { createPinia } from "pinia";
import { loginStore } from "@/stores/loginStore.js";

//primevue
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import PrimeVue from "primevue/config";

// vistas
import Home from "@/components/Home.vue";
const Bienvenida = () => import("@/components/Bienvenida.vue");
const NuevaIncidencia = () =>
  import("@/components/Incidencias/NuevaIncidencia.vue");
const GestionarIncidencias = () =>
  import("@/components/Incidencias/GestionarIncidencias.vue");
const GestionarInciSabas = () =>
  import("@/components/Incidencias/GestionarInciSabas.vue");
const ReportesSabas = () =>
  import("@/components/Incidencias/ReportesSabas.vue");
const EditaincidenSabas = () =>
  import("@/components/Incidencias/EditaincidenSabas.vue");
const Estadistica = () => import("@/components/Incidencias/Estadistica.vue");
const NotFound = () => import("@/components/NotFound.vue");

// bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "primeicons/primeicons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// Crea la instancia de Pinia
const pinia = createPinia();

// Definición de las rutas
const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/bienvenida", name: "Bienvenida", component: Bienvenida },
  {
    path: "/nuevaIncidencia",
    name: "NuevaIncidencia",
    component: NuevaIncidencia,
  },
  {
    path: "/gestionarIncidencias",
    name: "GestionarIncidencias",
    component: GestionarIncidencias,
  },
  {
    path: "/GestionarInciSabas",
    name: "GestionarInciSabas",
    component: GestionarInciSabas,
  },
  {
   // path: "/EditaincidenSabas/:id/:zona/:unidad/:fechaInicio/:fechaFin/:numDias/:estado/:comunicaEmpresa/:categoria",
    path: "/EditaincidenSabas/:incidencia",
    name: "EditaincidenSabas",
    component: EditaincidenSabas,
  },
  { path: "/ReportesSabas", name: "ReportesSabas", component: ReportesSabas },
  { path: "/Estadistica", name: "Estadistica", component: Estadistica },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

// Crear el enrutador
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// Guarda de navegación
router.beforeEach((to, from, next) => {
  const login = loginStore();
  if (login.perfil === "Grabador" || login.perfil === "Administrador") {
    if (to.name === "Home") {
      next({ name: "Bienvenida" });
    } else {
      next();
    }
  } else {
    if (to.name === "Home") {
      next();
    } else {
      next({ name: "Home" });
    }
  }
});

// Monta la aplicación
const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(PrimeVue);
app.mount("#app");
