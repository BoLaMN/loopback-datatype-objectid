var mongodb = require('mongodb');

module.exports = function(app) {

  var ObjectID = function(id) {
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
    } catch (error) { 
      return id;
    }

  };

  app.registry.modelBuilder.defineValueType(ObjectID);

};