const fs = require('fs');
const p = require('path');

let endpoints = [];
let express = null;
let config = {};

function mapDir(path) {
  const contents = fs.readdirSync(path);
  const endpointFiles = contents.filter(file => file.endsWith('.js'));
  const dirs = contents.filter(file => fs.statSync(`${path}/${file}`).isDirectory());

  endpointFiles.forEach(file => { // Map all endpoint files
    const script = require(`${path}/${file}`);
    const fileName = file.replace(".js", "").replace(".", "/");

    let url = `${path}/${fileName}`;
    if (fileName === 'index')
      url = `${path}/`

    url = url.replace(config.src, "");

    let endpointObject = {
      script: script,           // Object from the file
      url: url,                     // Url in the api
      path: (`${path}/${file}`),    // Path to the source file
      methods: [],                  // Supported http methods
      middleware: null              // Endpoints middleware
    }

    const httpMethods = ['get', 'head', 'post', 'put', 'delete', 'options', 'trace', 'patch'];

    httpMethods.forEach(method => { // Map all supported http methods
      if (method in endpointObject.script) {
        if (typeof endpointObject.script[method] === 'function') {
          endpointObject.methods.push(method);
        }
      }
    });

    // Add middleware reference to the endpointObject
    if (script.middleware) {
      endpointObject.middleware = script.middleware;
    }

    endpoints.push(endpointObject); // Add endpoint to main endpoints array

  });

  dirs.forEach(dir => {
    mapDir(`${path}/${dir}`);
  })

}

function registerEndpoints() {
  endpoints.forEach(endpoint => {
    endpoint.methods.forEach(method => {
      express[method](endpoint.url, endpoint.script[method]);
    });
  });
}

function linkMiddleware() {
  endpoints.forEach(endpoint => {
    if (!endpoint.middleware) return; // Skip endpoints that have no middleware

    if (Array.isArray(endpoint.middleware)) { // If middleware is array of middleware functions
      endpoint.middleware.forEach(middleware => {
        express.use(endpoint.url, middleware);
      });
    }

    else { // If middleware has different middleware for different methods
      Object.keys(endpoint.middleware).forEach(method => {
        endpoint.middleware[method].forEach(middleware => {
          express[method](endpoint.url, middleware);
        })
      });
    }

  });
}

module.exports = autoRestAPI = (expressApp, conf = {}) => {

  express = expressApp;
  config.src = conf.src?? "./api";
  if (!p.isAbsolute(config.src)){
    config.src = p.join(p.dirname(module.parent.filename), config.src);
  }

  mapDir(config.src);
  linkMiddleware();
  registerEndpoints();

}
