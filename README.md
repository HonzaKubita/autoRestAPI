# AutoAPI

AutoAPI is a simple, lightweight library for building RESTful APIs quickly and easily. It allows you to organize your endpoints in a directory structure, and automatically loads and registers them with an instance of Express.js.

## Instalation

Unfortunately I didn't create an npm package for this yet. So you have to manually download the [main.js](https://github.com/HonzaKubita/AutoAPI/blob/main/main.js) file and rename it to fit your requirements. (In examples I assume you renamed it to `autoapi.js`)

## Usage

To use AutoAPI, you'll need to create a new instance of the AutoAPI class. Here's an example of how to do that:

```js
const AutoAPI = require('./autoapi.js');

const api = new AutoAPI(); // No configuration uses default values (port: 3001, src: "./api")

api.load(); // Load and register all endpoints

api.listen(3000, () => {
  console.log('API listening on port 3000');
});

```

The `load()` method scans the directory specified in the src option and maps all the endpoint files to an Express.js server.

The `listen()` method starts the Express.js server and listens on the specified port.

### Endpoints
Endpoints should be organized in a directory structure within the directory specified in the src option (default ./api). Each endpoint should be a separate JavaScript file that exports an object with methods for each supported HTTP method (e.g. get, post, put, etc.).

Example file structure:

```
|
|-- api
|    | -- getSomeData.js
|    | -- getSomeOtherData.js
|    | -- other
|             | -- getSomeOtherData.js
|-- autoapi.js
```

This will register following endpoints:
`/getSomeData`
`/getSomeOtherData`
`/other/getSomeOtherData`

Here's an example of an endpoint file:

```js
module.exports = {
  get: (req, res) => {
    res.json({ message: 'Hello, World!' });
  },
  post: (req, res) => {
    res.json({ message: 'Received a POST request' });
  }
};
```

In this example, the endpoint supports the GET and POST HTTP methods. When the load() method is called, AutoAPI will automatically register these methods with Express.js and map them to the correct URL based on the file's location within the src directory.

## Conclusion
AutoAPI makes it easy to build a RESTful API by allowing you to organize your endpoints in a directory structure, and automatically loads and registers them with an instance of Express.js. It's lightweight, easy to use and it's perfect for small and medium-sized projects that don't require a heavy framework.
