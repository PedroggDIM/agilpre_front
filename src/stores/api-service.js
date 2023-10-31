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
  console.log(incidencia)
  console.log(incidencia._links)
  console.log("guardarIncidendia en api-service.js" + incidencia);
  if (incidencia._links) {
   // return llamadaApi(cambiarHttpPorHttps(incidencia._links.self.href), 'put', incidencia);
    return llamadaApi(`${host}/incidencias/${incidencia.id}`, 'put', incidencia);
    console.log("En put")
  } else {
    return llamadaApi(`${host}/incidencias`, 'post', incidencia);
  }
  // const url = incidencia._links
  //   ? cambiarHttpPorHttps(incidencia._links.self.href)
  //   : `${host}/incidencias`;
  // const method = incidencia._links ? "put" : "post";
  // return llamadaApi(url, method, incidencia);
}

export function getEntidades(nombre, method, body) {
  return llamadaApi(`${host}/${nombre}`, method, body);
}
export function getIncidencias(dataSession) {
  return getEntidades("incidencias/all", "post", dataSession);
}

export function getEstadisticasPorParametroApi(estadoValor, fechaInicioValor, fechaFinValor)  {
 return llamadaApi(`${host}/incidencias/obtenerNumeroIncidencias?estado=${estadoValor}&fechaInicio=${fechaInicioValor}&fechaFin=${fechaFinValor}`, 'get', null)
}



