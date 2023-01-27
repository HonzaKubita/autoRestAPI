# AutoAPI

AutoAPI is a simple utility for automatically mapping and registering endpoints in an Express.js application. It allows you to organize your endpoints in a directory structure and automatically register them with the Express.js app, without the need to manually import and register each endpoint.

## Instalation

Via npm:

```
npm i @honzakubita/autoapi
```

## Usage

To use AutoAPI in your Express.js app, you'll need to require it at the top of your server file:

```js
const AutoAPI = require('./autoapi.js');

```

Then, you'll need to initialize it by passing in your Express.js app and optionally a configuration object:

Without configuration:

```js
AutoAPI(app);
```

With configuration:

```js
AutoAPI(app, { src: './api' });
```

The configuration object allows you to specify the source directory where your endpoints are located. If no src property is provided, the default value is './api'.

AutoAPI maps all endpoint files located in the source directory and its subdirectories. All files should be in .js format. (Files with other extensions are ignored.)

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
    res.send({ message: 'Hello, World!' });
  },
  post: (req, res) => {
    res.send({ message: 'Received a POST request' });
  }
};
```

In this example, the endpoint supports the GET and POST HTTP methods. When the load() method is called, AutoAPI will automatically register these methods with Express.js and map them to the correct URL based on the file's location within the src directory.

## Full inplementation example

```js
const express = require('express');
const AutoAPI = require('auto-api');

const app = express();

AutoAPI(app, { src: './api' });

app.listen(3000, () => {
  console.log('Server running on port 3000!');
});
```

## Conclusion
AutoAPI makes it easy to organize and register your endpoints for an existing Express.js application. By using the directory structure and naming conventions, you can keep your endpoints organized and easily identify them. You can also easily add, modify, or delete endpoints without having to manually import or register them in the Express.js app.
