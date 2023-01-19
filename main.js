const fs = require('fs');
const express = require('express');

let port = 3001;

module.exports = class AutoAPI {

  #express = express(); // Private instance of express app

  #endpoints = [];

  constructor(config = {}) {
    this.port = config.port?? 3001;
    this.src = config.src?? "./api";
  }

  listen(port = this.port, callback) {
    this.#express.listen(port, callback);
  }

  load() {
    this.#mapDir(this.src);
    this.#registerEndpoints();
  }

  #mapDir(path) {
    const contents = fs.readdirSync(path);
    const endpointFiles = contents.filter(file => file.endsWith('.js'));
    const dirs = contents.filter(file => fs.statSync(`${path}/${file}`).isDirectory());

    endpointFiles.forEach(file => { // Map all endpoint files
      const script = require(`${path}/${file}`);
      const fileName = file.replace(".js", "");

      let endpointObject = {
        script: script,           // Object from the file
        url: (`${path.replace(this.src, "")}/${fileName}`), // Url in the api
        path: (`${path}/${file}`),    // Path to the source file
        methods: [],                  // Supported http methods
      }

      const httpMethods = ['get', 'head', 'post', 'put', 'delete', 'options', 'trace', 'patch'];

      httpMethods.forEach(method => { // Map all supported http methods
        if (method in endpointObject.script) {
          if (typeof endpointObject.script[method] === 'function') {
            endpointObject.methods.push(method);
          }
        }
      });

      this.#endpoints.push(endpointObject); // Add endpoint to main endpoints array

    });

    dirs.forEach(dir => {
      this.#mapDir(`${path}/${dir}`);
    })

  }

  #registerEndpoints() {
    this.#endpoints.forEach(endpoint => {
      endpoint.methods.forEach(method => {
        this.#express[method](endpoint.url, endpoint.script[method]);
      });
    });
  }

}