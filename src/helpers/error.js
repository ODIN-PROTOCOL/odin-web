'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.SchemaError =
  exports.DecodeError =
  exports.CreateError =
  exports.UnsuccessfulCallError =
  exports.BadSignatureError =
  exports.EmptyMsgError =
  exports.EmptyRequestMsgError =
  exports.NegativeIntegerError =
  exports.InsufficientCoinError =
  exports.NotFoundError =
  exports.UndefinedError =
  exports.ValueTooLargeError =
  exports.ValueError =
  exports.QueryError =
  exports.NotIntegerError =
  exports.BandChainJSError =
    void 0
class BandChainJSError extends Error {
  constructor(message) {
    super(message)
    this.name = 'BandChainJSError'
  }
}
exports.BandChainJSError = BandChainJSError
class NotIntegerError extends BandChainJSError {
  constructor(message) {
    super(message)
    this.name = 'NotIntegerNumberError'
  }
}
exports.NotIntegerError = NotIntegerError
class QueryError extends BandChainJSError {
  constructor(message) {
    super(message)
    this.name = 'QueryError'
  }
}
exports.QueryError = QueryError
class ValueError extends BandChainJSError {
  constructor(message) {
    super(message)
    this.name = 'ValueError'
  }
}
exports.ValueError = ValueError
class ValueTooLargeError extends BandChainJSError {
  constructor(message) {
    super(message)
    this.name = 'ValueTooLargeError'
  }
}
exports.ValueTooLargeError = ValueTooLargeError
class UndefinedError extends BandChainJSError {
  constructor(message) {
    super(message)
    this.name = 'UndefinedError'
  }
}
exports.UndefinedError = UndefinedError
class NotFoundError extends BandChainJSError {
  constructor(message) {
    super(message)
    this.name = 'NotFoundError'
  }
}
exports.NotFoundError = NotFoundError
class InsufficientCoinError extends BandChainJSError {
  constructor(message) {
    super(message)
    this.name = 'InsufficientCoinError'
  }
}
exports.InsufficientCoinError = InsufficientCoinError
class NegativeIntegerError extends BandChainJSError {
  constructor(message) {
    super(message)
    this.name = 'NegativeIntegerError'
  }
}
exports.NegativeIntegerError = NegativeIntegerError
class EmptyRequestMsgError extends BandChainJSError {
  constructor(message) {
    super(message)
    this.name = 'EmptyRequestMsgError'
  }
}
exports.EmptyRequestMsgError = EmptyRequestMsgError
class EmptyMsgError extends BandChainJSError {
  constructor(message) {
    super(message)
    this.name = 'EmptyMsgError'
  }
}
exports.EmptyMsgError = EmptyMsgError
class BadSignatureError extends BandChainJSError {
  constructor(message) {
    super(message)
    this.name = 'BadSignatureError'
  }
}
exports.BadSignatureError = BadSignatureError
class UnsuccessfulCallError extends BandChainJSError {
  constructor(message) {
    super(message)
    this.name = 'UnsuccessfulCallError'
  }
}
exports.UnsuccessfulCallError = UnsuccessfulCallError
class CreateError extends BandChainJSError {
  constructor(message) {
    super(message)
    this.name = 'CreateError'
  }
}
exports.CreateError = CreateError
class DecodeError extends BandChainJSError {
  constructor(message) {
    super(message)
    this.name = 'DecodeError'
  }
}
exports.DecodeError = DecodeError
class SchemaError extends BandChainJSError {
  constructor(message) {
    super(message)
    this.name = 'SchemaError'
  }
}
exports.SchemaError = SchemaError
