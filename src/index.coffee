mongodb = require 'mongodb'

module.exports = ({ registry, remotes }) ->

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
    catch e
      return id

    return

  registry.modelBuilder.defineValueType ObjectID

  remotes().defineType 'ObjectId',
    fromTypedValue: (ctx, value) ->
      if not value?
        return { value }

      value = new ObjectID value
      error = @validate ctx, value

      if error
        { error }
      else 
        { value }

    fromSloppyValue: (ctx, value) ->
      objectConverter = ctx.typeRegistry.getConverter 'object'
      result = objectConverter.fromSloppyString ctx, value

      if result.error 
        result 
      else 
        @fromTypedValue ctx, result.value

    validate: (ctx, value) ->
      if not value?
        return null

      if typeof value isnt 'object' or !(value instanceof ObjectID)
        return new Error 'Value is not an instance of ObjectID.'

      null

  return