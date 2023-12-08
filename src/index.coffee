bson = require 'bson'

module.exports = (app) ->

  ObjectID = (id) ->
    if not id
      return new bson.ObjectId()

    if id instanceof bson.ObjectId
      return id

    if typeof id isnt 'string'
      return id

    if /^[0-9a-fA-F]{24}$/.test id
      try
        return new bson.ObjectId id
      catch e
        return id

    id

  app.registry.modelBuilder.defineValueType ObjectID

  app.once 'listening', ->

    app.remotes()._typeRegistry.registerType 'objectid',

      fromTypedValue: (ctx, value, options) ->
        if not value?
          return { value }

        error = @validate ctx, value

        if error
          { error }
        else
          { value }

      fromSloppyValue: (ctx, value, options) ->
        if value is ''
          return { value: undefined }

        value = new ObjectID value

        @fromTypedValue ctx, value, options

      validate: (ctx, value, options) ->
        if value is undefined or value instanceof bson.ObjectId
          return null

        err = new Error 'Value is not an instance of ObjectID.'
        err.statusCode = 400
        err

    return

  return