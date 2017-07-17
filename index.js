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
    try {
      if (/^[0-9a-fA-F]{24}$/.test(id)) {
        return new mongodb.ObjectID(id);
      } else {
        return id;
      }
    } catch (error1) {
      e = error1;
      return id;
    }
  };
  registry.modelBuilder.defineValueType(ObjectID);
  remotes().defineType('ObjectId', {
    fromTypedValue: function(ctx, value) {
      var error;
      if (value == null) {
        return {
          value: value
        };
      }
      value = new ObjectID(value);
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
    fromSloppyValue: function(ctx, value) {
      var objectConverter, result;
      objectConverter = ctx.typeRegistry.getConverter('object');
      result = objectConverter.fromSloppyString(ctx, value);
      if (result.error) {
        return result;
      } else {
        return this.fromTypedValue(ctx, result.value);
      }
    },
    validate: function(ctx, value) {
      if (value == null) {
        return null;
      }
      if (typeof value !== 'object' || !(value instanceof ObjectID)) {
        return new Error('Value is not an instance of ObjectID.');
      }
      return null;
    }
  });
};
