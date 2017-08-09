var mongodb;

mongodb = require('mongodb');

module.exports = function(arg) {
  var ObjectID, registry, remotes;
  registry = arg.registry, remotes = arg.remotes;
  ObjectID = function(id) {
    var e;
    if (!id) {
      return new mongodb.ObjectID();
    }
    if (id instanceof mongodb.ObjectID) {
      return id;
    }
    if (typeof id !== 'string') {
      return id;
    }
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      try {
        return new mongodb.ObjectID(id);
      } catch (error1) {
        e = error1;
        return id;
      }
    }
    return id;
  };
  registry.modelBuilder.defineValueType(ObjectID);
  remotes()._typeRegistry.registerType('objectid', {
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
      if (value === void 0 || value instanceof mongodb.ObjectID) {
        return null;
      }
      err = new Error('Value is not an instance of ObjectID.');
      err.statusCode = 400;
      return err;
    }
  });
};
