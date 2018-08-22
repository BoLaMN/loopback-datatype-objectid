const mongodb = require('mongodb');

module.exports = function(app) {

  const ObjectID = function(id) {
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
      } catch (e) {
        return id;
      }
    }

    return id;
  };

  app.registry.modelBuilder.defineValueType(ObjectID);

  app.once('listening', function() {

    app.remotes()._typeRegistry.registerType('objectid', {

      fromTypedValue(ctx, value, options) {
        if ((value == null)) {
          return { value };
        }

        const error = this.validate(ctx, value);

        if (error) {
          return { error };
        } else {
          return { value };
        }
      },

      fromSloppyValue(ctx, value, options) {
        if (value === '') {
          return { value: undefined };
        }

        value = new ObjectID(value);

        return this.fromTypedValue(ctx, value, options);
      },

      validate(ctx, value, options) {
        if ((value === undefined) || value instanceof mongodb.ObjectID) {
          return null;
        }

        const err = new Error('Value is not an instance of ObjectID.');
        err.statusCode = 400;
        return err;
      }
    }
    );

  });

};