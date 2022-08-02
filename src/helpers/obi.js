'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.ObiSpec =
  exports.Obi =
  exports.ObiBytes =
  exports.ObiString =
  exports.ObiStruct =
  exports.ObiVector =
  exports.ObiBool =
  exports.ObiInteger =
    void 0
const error_1 = require('./error')
class ObiBase {}
class ObiInteger extends ObiBase {
  constructor(schema) {
    super()
    this.isSigned = schema[0] === 'i'
    this.sizeInBytes = parseInt(schema.slice(1)) / 8
  }
  encode(value) {
    let newValue = BigInt(value)
    return Buffer.from(
      [...Array(this.sizeInBytes)]
        .map(() => {
          const dataByte = newValue % BigInt(1 << 8)
          newValue /= BigInt(1 << 8)
          return Number(dataByte)
        })
        .reverse(),
    )
  }
  decode(buff) {
    let value = BigInt(0)
    let multiplier = BigInt(1)
    for (let i = 0; i < this.sizeInBytes; i++) {
      value += BigInt(buff.readUInt8(this.sizeInBytes - i - 1)) * multiplier
      multiplier *= BigInt(1 << 8)
    }
    return [value, buff.slice(this.sizeInBytes)]
  }
}
exports.ObiInteger = ObiInteger
ObiInteger.REGEX = /^(u|i)(8|16|32|64|128|256)$/
class ObiBool extends ObiBase {
  encode(value) {
    return new ObiInteger('u8').encode(value ? BigInt(1) : BigInt(0))
  }
  decode(buff) {
    const [u8, remaining] = new ObiInteger('u8').decode(buff)
    if (u8 === BigInt(1)) return [true, remaining]
    else if (u8 === BigInt(0)) return [false, remaining]
    else
      throw new error_1.DecodeError(
        `Boolean value must be 1 or 0 but got ${u8}`,
      )
  }
}
exports.ObiBool = ObiBool
ObiBool.REGEX = /^bool$/
class ObiVector extends ObiBase {
  constructor(schema) {
    super()
    this.internalObi = ObiSpec.fromSpec(schema.slice(1, -1))
  }
  encode(value) {
    return Buffer.concat([
      new ObiInteger('u32').encode(value.length),
      ...value.map(item => this.internalObi.encode(item)),
    ])
  }
  decode(buff) {
    let [length, remaining] = new ObiInteger('u32').decode(buff)
    const value = []
    for (let i = 0; i < Number(length); i++) {
      const decodeInternalResult = this.internalObi.decode(remaining)
      value.push(decodeInternalResult[0])
      remaining = decodeInternalResult[1]
    }
    return [value, remaining]
  }
}
exports.ObiVector = ObiVector
ObiVector.REGEX = /^\[.*\]$/
class ObiStruct extends ObiBase {
  constructor(schema) {
    super()
    this.internalObiKvs = []
    let curlyCount = 0
    let kv = ['', ''],
      fill = 0
    for (const c of schema.slice(1)) {
      if (c == '{') curlyCount++
      else if (curlyCount && c == '}') curlyCount--
      else if (!curlyCount && c === ':') {
        fill = 1
        continue
      } else if (!curlyCount && (c === ',' || c === '}')) {
        kv[1] = ObiSpec.fromSpec(kv[1])
        this.internalObiKvs.push(kv)
        kv = ['', '']
        fill = 0
        continue
      }
      kv[fill] += c
    }
  }
  encode(value) {
    return Buffer.concat(
      this.internalObiKvs.map(([k, obi]) => obi.encode(value[k])),
    )
  }
  decode(buff) {
    const value = {}
    let remaining = buff
    for (const [k, obi] of this.internalObiKvs) {
      const decodeInternalResult = obi.decode(remaining)
      value[k] = decodeInternalResult[0]
      remaining = decodeInternalResult[1]
    }
    return [value, remaining]
  }
}
exports.ObiStruct = ObiStruct
ObiStruct.REGEX = /^{.*}$/
class ObiString extends ObiBase {
  encode(value) {
    return Buffer.concat([
      new ObiInteger('u32').encode(BigInt(value.length)),
      Buffer.from(value),
    ])
  }
  decode(buff) {
    const [length, remaining] = new ObiInteger('u32').decode(buff)
    return [
      remaining.slice(0, parseInt(length)).toString(),
      remaining.slice(parseInt(length)),
    ]
  }
}
exports.ObiString = ObiString
ObiString.REGEX = /^string$/
class ObiBytes {
  encode(value) {
    return Buffer.concat([
      new ObiInteger('u32').encode(value.length),
      Buffer.from(value),
    ])
  }
  decode(buff) {
    const [length, remaining] = new ObiInteger('u32').decode(buff)
    return [
      remaining.slice(0, parseInt(length)),
      remaining.slice(parseInt(length)),
    ]
  }
}
exports.ObiBytes = ObiBytes
ObiBytes.REGEX = /^bytes$/
class Obi {
  constructor(schema) {
    const normalizedSchema = schema.replace(/\s+/g, '')
    const tokens = normalizedSchema.split('/')
    this.inputObi = ObiSpec.fromSpec(tokens[0])
    this.outputObi = ObiSpec.fromSpec(tokens[1])
  }
  encodeInput(value) {
    return this.inputObi.encode(value)
  }
  decodeInput(buff) {
    const [value, remaining] = this.inputObi.decode(buff)
    if (remaining.length != 0)
      throw new error_1.DecodeError(
        'Not all data is consumed after decoding output',
      )
    return value
  }
  encodeOutput(value) {
    return this.outputObi.encode(value)
  }
  decodeOutput(buff) {
    const [value, remaining] = this.outputObi.decode(buff)
    if (remaining.length != 0)
      throw new error_1.DecodeError(
        'Not all data is consumed after decoding output',
      )
    return value
  }
}
exports.Obi = Obi
class ObiSpec {
  static fromSpec(schema) {
    for (const impl of ObiSpec.impls) {
      if (schema.match(impl.REGEX)) {
        return new impl(schema)
      }
    }
    throw new error_1.SchemaError(`No schema matched: <${schema}>`)
  }
}
exports.ObiSpec = ObiSpec
ObiSpec.impls = [ObiInteger, ObiBool, ObiVector, ObiStruct, ObiString, ObiBytes]
