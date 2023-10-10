import axios from "axios";

const host = "http://localhost:8080/api";

export function cambiarHttpPorHttps(enlace) {
  return enlace.replace("http", "https");
}
export function llamadaApi(path, method, body) {
  debugger;
  let config = {
    method: method,
    maxBodyLength: Infinity,
    url: path,
    headers: {},
  };
  if (body) {
    config.data = body,
      config.headers['Content-Type'] = 'application/json'
  }
  return axios.request(config)
}
export function guardarIncidencia(incidencia) {
  // debugger;
  console.log("guardarIncidendia en api-service.js" + incidencia);
  if (incidencia._links) {
    return llamadaApi(cambiarHttpPorHttps(incidencia._links.self.href), 'put', incidencia);
  } else {
    return llamadaApi(`${host}/incidencias`, 'post', incidencia);
  }
}

export function getEntidades(nombre, method, body) {
  return llamadaApi(`${host}/${nombre}`, method, body);
}
export function getIncidencias(dataSession) {
  return getEntidades("incidencias/all", "post", dataSession);
}