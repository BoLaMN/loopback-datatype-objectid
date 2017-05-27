mongodb = require 'mongodb'

module.exports = (app) ->

  ObjectID = (id) ->
    if not id
      return new mongodb.ObjectID()

    if id instanceof mongodb.ObjectID
      return id

    if typeof id != 'string'
      return id

    try
      if /^[0-9a-fA-F]{24}$/.test(id)
        return new mongodb.ObjectID(id)
      else
        return id
    catch
      return id

    return

  app.registry.modelBuilder.defineValueType ObjectID

  return