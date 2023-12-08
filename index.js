var bson;

bson = require('bson');

module.exports = function(app) {
  var ObjectID;
  ObjectID = function(id) {
    var e;
    if (!id) {
      return new bson.ObjectId();
    }
    if (id instanceof bson.ObjectId) {
      return id;
    }
    if (typeof id !== 'string') {
      return id;
    }
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      try {
        return new bson.ObjectId(id);
      } catch (error1) {
        e = error1;
        return id;
      }
    }
    return id;
  };
  app.registry.modelBuilder.defineValueType(ObjectID);
  app.once('listening', function() {
    app.remotes()._typeRegistry.registerType('objectid', {
      fromTypedValue: function(ctx, value, options) {
        var error;
        if (value == null) {
          return {
            value: value
          };
        }
        error = this.validate(ctx, value);
        if (error) {
          return {
            error: error
          };
        } else {
          return {
            value: value
          };
        }
      },
      fromSloppyValue: function(ctx, value, options) {
        if (value === '') {
          return {
            value: void 0
          };
        }
        value = new ObjectID(value);
        return this.fromTypedValue(ctx, value, options);
      },
      validate: function(ctx, value, options) {
        var err;
        if (value === void 0 || value instanceof bson.ObjectId) {
          return null;
        }
        err = new Error('Value is not an instance of ObjectID.');
        err.statusCode = 400;
        return err;
      }
    });
  });
};
