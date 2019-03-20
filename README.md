# JSON-over-HTTP RPC server for Express

Getting tired of REST and GraphQL and just want to expose some JavaScript functions to clients over HTTP?

Me too!

```sh
npm i -g @fictorial/express-rpc
```

```sh
# optional; for PORT, etc.
# $EDITOR .env

express-rpc my_rpcs.js

# or when developing
# DEBUG=express-rpc node index.js ./example/my_rpcs.js
```

```JavaScript
// ./example/my_rpcs.js

module.exports = {
  greet: ({ name }) => {
    return { greeting: `Hello, ${name || 'anon'}` }
  }
}
```

```sh
curl -H 'Content-type: application/json' --data-binary '{ "name": "Brian" }' localhost:2999/rpc/greet
```

```
{ "greeting": "Hello, Brian" }
```

## Notes

The exported RPCs can be nested and then referenced by clients using familiar dot-notation
e.g. `localhost:2999/greetings.hello`, etc.

Exported functions can be `async`.

If your RPC throws the `Error` thrown is used in the response:
- `Error.code` for the HTTP status code; default: 500

- `Error.message` for the body of the response `{ error: { message: "..." }}`

`this` inside a handler is the `req` from Express.
