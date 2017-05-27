# loopback-datatype-objectid

## Setup

add `require('loopback-datatype-objectid')(app)` in server.js before boot is called 

### Using ObjectID type

In a LoopBack model, declare a ObjectID property in the model JSON file, for example:

```javascript
...
"properties": {
    "id": {
      "type": "objectid",
      "id": true
    },
  ...
}
...
```

License: MIT