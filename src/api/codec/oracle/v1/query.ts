/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import {
  DataSource,
  OracleScript,
  OracleRequestPacketData,
  OracleResponsePacketData,
  ValidatorStatus,
} from "../../oracle/v1/oracle";
import { Params } from "../../oracle/v1/params";
import { DecCoin } from "../../cosmos/base/v1beta1/coin";

export const protobufPackage = "oracle.v1";

/** QueryCountsRequest is request type for the Query/Count RPC method. */
export interface QueryCountsRequest {}

/** QueryCountsResponse is response type for the Query/Count RPC method. */
export interface QueryCountsResponse {
  dataSourceCount: Long;
  oracleScriptCount: Long;
  requestCount: Long;
}

/** QueryDataRequest is request type for the Query/Data RPC method. */
export interface QueryDataRequest {
  dataHash: string;
}

/** QueryDataResponse is response type for the Query/Data RPC method. */
export interface QueryDataResponse {
  data: Uint8Array;
}

/** QueryDataSourceRequest is request type for the Query/DataSource RPC method. */
export interface QueryDataSourceRequest {
  dataSourceId: Long;
}

/** QueryDataSourceResponse is response type for the Query/DataSource RPC method. */
export interface QueryDataSourceResponse {
  dataSource?: DataSource;
}

/**
 * QueryOracleScriptRequest is request type for the Query/OracleScript RPC
 * method.
 */
export interface QueryOracleScriptRequest {
  oracleScriptId: Long;
}

/**
 * QueryOracleScriptResponse is response type for the Query/OracleScript RPC
 * method.
 */
export interface QueryOracleScriptResponse {
  oracleScript?: OracleScript;
}

/** QueryRequestRequest is request type for the Query/Request RPC method. */
export interface QueryRequestRequest {
  requestId: Long;
}

/** QueryRequestResponse is response type for the Query/Request RPC method. */
export interface QueryRequestResponse {
  requestPacketData?: OracleRequestPacketData;
  responsePacketData?: OracleResponsePacketData;
}

/** QueryParamsRequest is request type for the Query/Params RPC method. */
export interface QueryParamsRequest {}

/** QueryParamsResponse is response type for the Query/Params RPC method. */
export interface QueryParamsResponse {
  /** pagination defines an optional pagination for the request. */
  params?: Params;
}

/** QueryValidatorRequest is request type for the Query/Validator RPC method. */
export interface QueryValidatorRequest {
  validatorAddress: string;
}

/** QueryValidatorResponse is response type for the Query/Validator RPC method. */
export interface QueryValidatorResponse {
  status?: ValidatorStatus;
}

/** QueryReportersRequest is request type for the Query/Reporters RPC method. */
export interface QueryReportersRequest {
  validatorAddress: string;
}

/** QueryReportersResponse is response type for the Query/Reporters RPC method. */
export interface QueryReportersResponse {
  reporter: string[];
}

/**
 * QueryActiveValidatorsRequest is request type for the Query/ActiveValidators
 * RPC method.
 */
export interface QueryActiveValidatorsRequest {}

/**
 * QueryActiveValidatorsResponse is response type for the Query/ActiveValidators
 * RPC method.
 */
export interface QueryActiveValidatorsResponse {
  count: Long;
}

/**
 * QueryRequestSearchRequest is request type for the Query/RequestSearch RPC
 * method.
 */
export interface QueryRequestSearchRequest {
  oracleScriptId: Long;
  calldata: Uint8Array;
  askCount: Long;
  minCount: Long;
}

/**
 * QueryRequestSearchResponse is response type for the Query/RequestSearch RPC
 * method.
 */
export interface QueryRequestSearchResponse {
  requestPacketData?: OracleRequestPacketData;
  responsePacketData?: OracleResponsePacketData;
}

/**
 * QueryRequestPriceRequest is request type for the Query/RequestPrice RPC
 * method.
 */
export interface QueryRequestPriceRequest {
  symbol: string;
  askCount: Long;
  minCount: Long;
}

/**
 * QueryRequestPriceResponse is response type for the Query/RequestPrice RPC
 * method.
 */
export interface QueryRequestPriceResponse {
  oracleScriptId: Long;
  calldata: Uint8Array;
  askCount: Long;
  minCount: Long;
}

export interface QueryDataProvidersPoolRequest {}

/**
 * QueryRequestPriceResponse is response type for the Query/RequestPrice RPC
 * method.
 */
export interface QueryDataProvidersPoolResponse {
  pool: DecCoin[];
}

export interface QueryRequestIDs {
  requestIds: Long[];
}

const baseQueryCountsRequest: object = {};

export const QueryCountsRequest = {
  encode(
    _: QueryCountsRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryCountsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryCountsRequest } as QueryCountsRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): QueryCountsRequest {
    const message = { ...baseQueryCountsRequest } as QueryCountsRequest;
    return message;
  },

  toJSON(_: QueryCountsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<QueryCountsRequest>): QueryCountsRequest {
    const message = { ...baseQueryCountsRequest } as QueryCountsRequest;
    return message;
  },
};

const baseQueryCountsResponse: object = {
  dataSourceCount: Long.ZERO,
  oracleScriptCount: Long.ZERO,
  requestCount: Long.ZERO,
};

export const QueryCountsResponse = {
  encode(
    message: QueryCountsResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (!message.dataSourceCount.isZero()) {
      writer.uint32(8).int64(message.dataSourceCount);
    }
    if (!message.oracleScriptCount.isZero()) {
      writer.uint32(16).int64(message.oracleScriptCount);
    }
    if (!message.requestCount.isZero()) {
      writer.uint32(24).int64(message.requestCount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryCountsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryCountsResponse } as QueryCountsResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.dataSourceCount = reader.int64() as Long;
          break;
        case 2:
          message.oracleScriptCount = reader.int64() as Long;
          break;
        case 3:
          message.requestCount = reader.int64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryCountsResponse {
    const message = { ...baseQueryCountsResponse } as QueryCountsResponse;
    if (
      object.dataSourceCount !== undefined &&
      object.dataSourceCount !== null
    ) {
      message.dataSourceCount = Long.fromString(object.dataSourceCount);
    } else {
      message.dataSourceCount = Long.ZERO;
    }
    if (
      object.oracleScriptCount !== undefined &&
      object.oracleScriptCount !== null
    ) {
      message.oracleScriptCount = Long.fromString(object.oracleScriptCount);
    } else {
      message.oracleScriptCount = Long.ZERO;
    }
    if (object.requestCount !== undefined && object.requestCount !== null) {
      message.requestCount = Long.fromString(object.requestCount);
    } else {
      message.requestCount = Long.ZERO;
    }
    return message;
  },

  toJSON(message: QueryCountsResponse): unknown {
    const obj: any = {};
    message.dataSourceCount !== undefined &&
      (obj.dataSourceCount = (message.dataSourceCount || Long.ZERO).toString());
    message.oracleScriptCount !== undefined &&
      (obj.oracleScriptCount = (
        message.oracleScriptCount || Long.ZERO
      ).toString());
    message.requestCount !== undefined &&
      (obj.requestCount = (message.requestCount || Long.ZERO).toString());
    return obj;
  },

  fromPartial(object: DeepPartial<QueryCountsResponse>): QueryCountsResponse {
    const message = { ...baseQueryCountsResponse } as QueryCountsResponse;
    if (
      object.dataSourceCount !== undefined &&
      object.dataSourceCount !== null
    ) {
      message.dataSourceCount = object.dataSourceCount as Long;
    } else {
      message.dataSourceCount = Long.ZERO;
    }
    if (
      object.oracleScriptCount !== undefined &&
      object.oracleScriptCount !== null
    ) {
      message.oracleScriptCount = object.oracleScriptCount as Long;
    } else {
      message.oracleScriptCount = Long.ZERO;
    }
    if (object.requestCount !== undefined && object.requestCount !== null) {
      message.requestCount = object.requestCount as Long;
    } else {
      message.requestCount = Long.ZERO;
    }
    return message;
  },
};

const baseQueryDataRequest: object = { dataHash: "" };

export const QueryDataRequest = {
  encode(
    message: QueryDataRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.dataHash !== "") {
      writer.uint32(10).string(message.dataHash);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryDataRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryDataRequest } as QueryDataRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.dataHash = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryDataRequest {
    const message = { ...baseQueryDataRequest } as QueryDataRequest;
    if (object.dataHash !== undefined && object.dataHash !== null) {
      message.dataHash = String(object.dataHash);
    } else {
      message.dataHash = "";
    }
    return message;
  },

  toJSON(message: QueryDataRequest): unknown {
    const obj: any = {};
    message.dataHash !== undefined && (obj.dataHash = message.dataHash);
    return obj;
  },

  fromPartial(object: DeepPartial<QueryDataRequest>): QueryDataRequest {
    const message = { ...baseQueryDataRequest } as QueryDataRequest;
    if (object.dataHash !== undefined && object.dataHash !== null) {
      message.dataHash = object.dataHash;
    } else {
      message.dataHash = "";
    }
    return message;
  },
};

const baseQueryDataResponse: object = {};

export const QueryDataResponse = {
  encode(
    message: QueryDataResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.data.length !== 0) {
      writer.uint32(10).bytes(message.data);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryDataResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryDataResponse } as QueryDataResponse;
    message.data = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.data = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryDataResponse {
    const message = { ...baseQueryDataResponse } as QueryDataResponse;
    message.data = new Uint8Array();
    if (object.data !== undefined && object.data !== null) {
      message.data = bytesFromBase64(object.data);
    }
    return message;
  },

  toJSON(message: QueryDataResponse): unknown {
    const obj: any = {};
    message.data !== undefined &&
      (obj.data = base64FromBytes(
        message.data !== undefined ? message.data : new Uint8Array()
      ));
    return obj;
  },

  fromPartial(object: DeepPartial<QueryDataResponse>): QueryDataResponse {
    const message = { ...baseQueryDataResponse } as QueryDataResponse;
    if (object.data !== undefined && object.data !== null) {
      message.data = object.data;
    } else {
      message.data = new Uint8Array();
    }
    return message;
  },
};

const baseQueryDataSourceRequest: object = { dataSourceId: Long.ZERO };

export const QueryDataSourceRequest = {
  encode(
    message: QueryDataSourceRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (!message.dataSourceId.isZero()) {
      writer.uint32(8).int64(message.dataSourceId);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryDataSourceRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryDataSourceRequest } as QueryDataSourceRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.dataSourceId = reader.int64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryDataSourceRequest {
    const message = { ...baseQueryDataSourceRequest } as QueryDataSourceRequest;
    if (object.dataSourceId !== undefined && object.dataSourceId !== null) {
      message.dataSourceId = Long.fromString(object.dataSourceId);
    } else {
      message.dataSourceId = Long.ZERO;
    }
    return message;
  },

  toJSON(message: QueryDataSourceRequest): unknown {
    const obj: any = {};
    message.dataSourceId !== undefined &&
      (obj.dataSourceId = (message.dataSourceId || Long.ZERO).toString());
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryDataSourceRequest>
  ): QueryDataSourceRequest {
    const message = { ...baseQueryDataSourceRequest } as QueryDataSourceRequest;
    if (object.dataSourceId !== undefined && object.dataSourceId !== null) {
      message.dataSourceId = object.dataSourceId as Long;
    } else {
      message.dataSourceId = Long.ZERO;
    }
    return message;
  },
};

const baseQueryDataSourceResponse: object = {};

export const QueryDataSourceResponse = {
  encode(
    message: QueryDataSourceResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.dataSource !== undefined) {
      DataSource.encode(message.dataSource, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryDataSourceResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryDataSourceResponse,
    } as QueryDataSourceResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.dataSource = DataSource.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryDataSourceResponse {
    const message = {
      ...baseQueryDataSourceResponse,
    } as QueryDataSourceResponse;
    if (object.dataSource !== undefined && object.dataSource !== null) {
      message.dataSource = DataSource.fromJSON(object.dataSource);
    } else {
      message.dataSource = undefined;
    }
    return message;
  },

  toJSON(message: QueryDataSourceResponse): unknown {
    const obj: any = {};
    message.dataSource !== undefined &&
      (obj.dataSource = message.dataSource
        ? DataSource.toJSON(message.dataSource)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryDataSourceResponse>
  ): QueryDataSourceResponse {
    const message = {
      ...baseQueryDataSourceResponse,
    } as QueryDataSourceResponse;
    if (object.dataSource !== undefined && object.dataSource !== null) {
      message.dataSource = DataSource.fromPartial(object.dataSource);
    } else {
      message.dataSource = undefined;
    }
    return message;
  },
};

const baseQueryOracleScriptRequest: object = { oracleScriptId: Long.ZERO };

export const QueryOracleScriptRequest = {
  encode(
    message: QueryOracleScriptRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (!message.oracleScriptId.isZero()) {
      writer.uint32(8).int64(message.oracleScriptId);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryOracleScriptRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryOracleScriptRequest,
    } as QueryOracleScriptRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.oracleScriptId = reader.int64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryOracleScriptRequest {
    const message = {
      ...baseQueryOracleScriptRequest,
    } as QueryOracleScriptRequest;
    if (object.oracleScriptId !== undefined && object.oracleScriptId !== null) {
      message.oracleScriptId = Long.fromString(object.oracleScriptId);
    } else {
      message.oracleScriptId = Long.ZERO;
    }
    return message;
  },

  toJSON(message: QueryOracleScriptRequest): unknown {
    const obj: any = {};
    message.oracleScriptId !== undefined &&
      (obj.oracleScriptId = (message.oracleScriptId || Long.ZERO).toString());
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryOracleScriptRequest>
  ): QueryOracleScriptRequest {
    const message = {
      ...baseQueryOracleScriptRequest,
    } as QueryOracleScriptRequest;
    if (object.oracleScriptId !== undefined && object.oracleScriptId !== null) {
      message.oracleScriptId = object.oracleScriptId as Long;
    } else {
      message.oracleScriptId = Long.ZERO;
    }
    return message;
  },
};

const baseQueryOracleScriptResponse: object = {};

export const QueryOracleScriptResponse = {
  encode(
    message: QueryOracleScriptResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.oracleScript !== undefined) {
      OracleScript.encode(
        message.oracleScript,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryOracleScriptResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryOracleScriptResponse,
    } as QueryOracleScriptResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.oracleScript = OracleScript.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryOracleScriptResponse {
    const message = {
      ...baseQueryOracleScriptResponse,
    } as QueryOracleScriptResponse;
    if (object.oracleScript !== undefined && object.oracleScript !== null) {
      message.oracleScript = OracleScript.fromJSON(object.oracleScript);
    } else {
      message.oracleScript = undefined;
    }
    return message;
  },

  toJSON(message: QueryOracleScriptResponse): unknown {
    const obj: any = {};
    message.oracleScript !== undefined &&
      (obj.oracleScript = message.oracleScript
        ? OracleScript.toJSON(message.oracleScript)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryOracleScriptResponse>
  ): QueryOracleScriptResponse {
    const message = {
      ...baseQueryOracleScriptResponse,
    } as QueryOracleScriptResponse;
    if (object.oracleScript !== undefined && object.oracleScript !== null) {
      message.oracleScript = OracleScript.fromPartial(object.oracleScript);
    } else {
      message.oracleScript = undefined;
    }
    return message;
  },
};

const baseQueryRequestRequest: object = { requestId: Long.ZERO };

export const QueryRequestRequest = {
  encode(
    message: QueryRequestRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (!message.requestId.isZero()) {
      writer.uint32(8).int64(message.requestId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryRequestRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryRequestRequest } as QueryRequestRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.requestId = reader.int64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryRequestRequest {
    const message = { ...baseQueryRequestRequest } as QueryRequestRequest;
    if (object.requestId !== undefined && object.requestId !== null) {
      message.requestId = Long.fromString(object.requestId);
    } else {
      message.requestId = Long.ZERO;
    }
    return message;
  },

  toJSON(message: QueryRequestRequest): unknown {
    const obj: any = {};
    message.requestId !== undefined &&
      (obj.requestId = (message.requestId || Long.ZERO).toString());
    return obj;
  },

  fromPartial(object: DeepPartial<QueryRequestRequest>): QueryRequestRequest {
    const message = { ...baseQueryRequestRequest } as QueryRequestRequest;
    if (object.requestId !== undefined && object.requestId !== null) {
      message.requestId = object.requestId as Long;
    } else {
      message.requestId = Long.ZERO;
    }
    return message;
  },
};

const baseQueryRequestResponse: object = {};

export const QueryRequestResponse = {
  encode(
    message: QueryRequestResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.requestPacketData !== undefined) {
      OracleRequestPacketData.encode(
        message.requestPacketData,
        writer.uint32(10).fork()
      ).ldelim();
    }
    if (message.responsePacketData !== undefined) {
      OracleResponsePacketData.encode(
        message.responsePacketData,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryRequestResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryRequestResponse } as QueryRequestResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.requestPacketData = OracleRequestPacketData.decode(
            reader,
            reader.uint32()
          );
          break;
        case 2:
          message.responsePacketData = OracleResponsePacketData.decode(
            reader,
            reader.uint32()
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryRequestResponse {
    const message = { ...baseQueryRequestResponse } as QueryRequestResponse;
    if (
      object.requestPacketData !== undefined &&
      object.requestPacketData !== null
    ) {
      message.requestPacketData = OracleRequestPacketData.fromJSON(
        object.requestPacketData
      );
    } else {
      message.requestPacketData = undefined;
    }
    if (
      object.responsePacketData !== undefined &&
      object.responsePacketData !== null
    ) {
      message.responsePacketData = OracleResponsePacketData.fromJSON(
        object.responsePacketData
      );
    } else {
      message.responsePacketData = undefined;
    }
    return message;
  },

  toJSON(message: QueryRequestResponse): unknown {
    const obj: any = {};
    message.requestPacketData !== undefined &&
      (obj.requestPacketData = message.requestPacketData
        ? OracleRequestPacketData.toJSON(message.requestPacketData)
        : undefined);
    message.responsePacketData !== undefined &&
      (obj.responsePacketData = message.responsePacketData
        ? OracleResponsePacketData.toJSON(message.responsePacketData)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<QueryRequestResponse>): QueryRequestResponse {
    const message = { ...baseQueryRequestResponse } as QueryRequestResponse;
    if (
      object.requestPacketData !== undefined &&
      object.requestPacketData !== null
    ) {
      message.requestPacketData = OracleRequestPacketData.fromPartial(
        object.requestPacketData
      );
    } else {
      message.requestPacketData = undefined;
    }
    if (
      object.responsePacketData !== undefined &&
      object.responsePacketData !== null
    ) {
      message.responsePacketData = OracleResponsePacketData.fromPartial(
        object.responsePacketData
      );
    } else {
      message.responsePacketData = undefined;
    }
    return message;
  },
};

const baseQueryParamsRequest: object = {};

export const QueryParamsRequest = {
  encode(
    _: QueryParamsRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryParamsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryParamsRequest } as QueryParamsRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): QueryParamsRequest {
    const message = { ...baseQueryParamsRequest } as QueryParamsRequest;
    return message;
  },

  toJSON(_: QueryParamsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<QueryParamsRequest>): QueryParamsRequest {
    const message = { ...baseQueryParamsRequest } as QueryParamsRequest;
    return message;
  },
};

const baseQueryParamsResponse: object = {};

export const QueryParamsResponse = {
  encode(
    message: QueryParamsResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryParamsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryParamsResponse } as QueryParamsResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.params = Params.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryParamsResponse {
    const message = { ...baseQueryParamsResponse } as QueryParamsResponse;
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromJSON(object.params);
    } else {
      message.params = undefined;
    }
    return message;
  },

  toJSON(message: QueryParamsResponse): unknown {
    const obj: any = {};
    message.params !== undefined &&
      (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<QueryParamsResponse>): QueryParamsResponse {
    const message = { ...baseQueryParamsResponse } as QueryParamsResponse;
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromPartial(object.params);
    } else {
      message.params = undefined;
    }
    return message;
  },
};

const baseQueryValidatorRequest: object = { validatorAddress: "" };

export const QueryValidatorRequest = {
  encode(
    message: QueryValidatorRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.validatorAddress !== "") {
      writer.uint32(10).string(message.validatorAddress);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryValidatorRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryValidatorRequest } as QueryValidatorRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.validatorAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryValidatorRequest {
    const message = { ...baseQueryValidatorRequest } as QueryValidatorRequest;
    if (
      object.validatorAddress !== undefined &&
      object.validatorAddress !== null
    ) {
      message.validatorAddress = String(object.validatorAddress);
    } else {
      message.validatorAddress = "";
    }
    return message;
  },

  toJSON(message: QueryValidatorRequest): unknown {
    const obj: any = {};
    message.validatorAddress !== undefined &&
      (obj.validatorAddress = message.validatorAddress);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryValidatorRequest>
  ): QueryValidatorRequest {
    const message = { ...baseQueryValidatorRequest } as QueryValidatorRequest;
    if (
      object.validatorAddress !== undefined &&
      object.validatorAddress !== null
    ) {
      message.validatorAddress = object.validatorAddress;
    } else {
      message.validatorAddress = "";
    }
    return message;
  },
};

const baseQueryValidatorResponse: object = {};

export const QueryValidatorResponse = {
  encode(
    message: QueryValidatorResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.status !== undefined) {
      ValidatorStatus.encode(message.status, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryValidatorResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryValidatorResponse } as QueryValidatorResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.status = ValidatorStatus.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryValidatorResponse {
    const message = { ...baseQueryValidatorResponse } as QueryValidatorResponse;
    if (object.status !== undefined && object.status !== null) {
      message.status = ValidatorStatus.fromJSON(object.status);
    } else {
      message.status = undefined;
    }
    return message;
  },

  toJSON(message: QueryValidatorResponse): unknown {
    const obj: any = {};
    message.status !== undefined &&
      (obj.status = message.status
        ? ValidatorStatus.toJSON(message.status)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryValidatorResponse>
  ): QueryValidatorResponse {
    const message = { ...baseQueryValidatorResponse } as QueryValidatorResponse;
    if (object.status !== undefined && object.status !== null) {
      message.status = ValidatorStatus.fromPartial(object.status);
    } else {
      message.status = undefined;
    }
    return message;
  },
};

const baseQueryReportersRequest: object = { validatorAddress: "" };

export const QueryReportersRequest = {
  encode(
    message: QueryReportersRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.validatorAddress !== "") {
      writer.uint32(10).string(message.validatorAddress);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryReportersRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryReportersRequest } as QueryReportersRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.validatorAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryReportersRequest {
    const message = { ...baseQueryReportersRequest } as QueryReportersRequest;
    if (
      object.validatorAddress !== undefined &&
      object.validatorAddress !== null
    ) {
      message.validatorAddress = String(object.validatorAddress);
    } else {
      message.validatorAddress = "";
    }
    return message;
  },

  toJSON(message: QueryReportersRequest): unknown {
    const obj: any = {};
    message.validatorAddress !== undefined &&
      (obj.validatorAddress = message.validatorAddress);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryReportersRequest>
  ): QueryReportersRequest {
    const message = { ...baseQueryReportersRequest } as QueryReportersRequest;
    if (
      object.validatorAddress !== undefined &&
      object.validatorAddress !== null
    ) {
      message.validatorAddress = object.validatorAddress;
    } else {
      message.validatorAddress = "";
    }
    return message;
  },
};

const baseQueryReportersResponse: object = { reporter: "" };

export const QueryReportersResponse = {
  encode(
    message: QueryReportersResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.reporter) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryReportersResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryReportersResponse } as QueryReportersResponse;
    message.reporter = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.reporter.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryReportersResponse {
    const message = { ...baseQueryReportersResponse } as QueryReportersResponse;
    message.reporter = [];
    if (object.reporter !== undefined && object.reporter !== null) {
      for (const e of object.reporter) {
        message.reporter.push(String(e));
      }
    }
    return message;
  },

  toJSON(message: QueryReportersResponse): unknown {
    const obj: any = {};
    if (message.reporter) {
      obj.reporter = message.reporter.map((e) => e);
    } else {
      obj.reporter = [];
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryReportersResponse>
  ): QueryReportersResponse {
    const message = { ...baseQueryReportersResponse } as QueryReportersResponse;
    message.reporter = [];
    if (object.reporter !== undefined && object.reporter !== null) {
      for (const e of object.reporter) {
        message.reporter.push(e);
      }
    }
    return message;
  },
};

const baseQueryActiveValidatorsRequest: object = {};

export const QueryActiveValidatorsRequest = {
  encode(
    _: QueryActiveValidatorsRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryActiveValidatorsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryActiveValidatorsRequest,
    } as QueryActiveValidatorsRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): QueryActiveValidatorsRequest {
    const message = {
      ...baseQueryActiveValidatorsRequest,
    } as QueryActiveValidatorsRequest;
    return message;
  },

  toJSON(_: QueryActiveValidatorsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<QueryActiveValidatorsRequest>
  ): QueryActiveValidatorsRequest {
    const message = {
      ...baseQueryActiveValidatorsRequest,
    } as QueryActiveValidatorsRequest;
    return message;
  },
};

const baseQueryActiveValidatorsResponse: object = { count: Long.ZERO };

export const QueryActiveValidatorsResponse = {
  encode(
    message: QueryActiveValidatorsResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (!message.count.isZero()) {
      writer.uint32(8).int64(message.count);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryActiveValidatorsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryActiveValidatorsResponse,
    } as QueryActiveValidatorsResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.count = reader.int64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryActiveValidatorsResponse {
    const message = {
      ...baseQueryActiveValidatorsResponse,
    } as QueryActiveValidatorsResponse;
    if (object.count !== undefined && object.count !== null) {
      message.count = Long.fromString(object.count);
    } else {
      message.count = Long.ZERO;
    }
    return message;
  },

  toJSON(message: QueryActiveValidatorsResponse): unknown {
    const obj: any = {};
    message.count !== undefined &&
      (obj.count = (message.count || Long.ZERO).toString());
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryActiveValidatorsResponse>
  ): QueryActiveValidatorsResponse {
    const message = {
      ...baseQueryActiveValidatorsResponse,
    } as QueryActiveValidatorsResponse;
    if (object.count !== undefined && object.count !== null) {
      message.count = object.count as Long;
    } else {
      message.count = Long.ZERO;
    }
    return message;
  },
};

const baseQueryRequestSearchRequest: object = {
  oracleScriptId: Long.ZERO,
  askCount: Long.ZERO,
  minCount: Long.ZERO,
};

export const QueryRequestSearchRequest = {
  encode(
    message: QueryRequestSearchRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (!message.oracleScriptId.isZero()) {
      writer.uint32(8).int64(message.oracleScriptId);
    }
    if (message.calldata.length !== 0) {
      writer.uint32(18).bytes(message.calldata);
    }
    if (!message.askCount.isZero()) {
      writer.uint32(24).int64(message.askCount);
    }
    if (!message.minCount.isZero()) {
      writer.uint32(32).int64(message.minCount);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryRequestSearchRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryRequestSearchRequest,
    } as QueryRequestSearchRequest;
    message.calldata = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.oracleScriptId = reader.int64() as Long;
          break;
        case 2:
          message.calldata = reader.bytes();
          break;
        case 3:
          message.askCount = reader.int64() as Long;
          break;
        case 4:
          message.minCount = reader.int64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryRequestSearchRequest {
    const message = {
      ...baseQueryRequestSearchRequest,
    } as QueryRequestSearchRequest;
    message.calldata = new Uint8Array();
    if (object.oracleScriptId !== undefined && object.oracleScriptId !== null) {
      message.oracleScriptId = Long.fromString(object.oracleScriptId);
    } else {
      message.oracleScriptId = Long.ZERO;
    }
    if (object.calldata !== undefined && object.calldata !== null) {
      message.calldata = bytesFromBase64(object.calldata);
    }
    if (object.askCount !== undefined && object.askCount !== null) {
      message.askCount = Long.fromString(object.askCount);
    } else {
      message.askCount = Long.ZERO;
    }
    if (object.minCount !== undefined && object.minCount !== null) {
      message.minCount = Long.fromString(object.minCount);
    } else {
      message.minCount = Long.ZERO;
    }
    return message;
  },

  toJSON(message: QueryRequestSearchRequest): unknown {
    const obj: any = {};
    message.oracleScriptId !== undefined &&
      (obj.oracleScriptId = (message.oracleScriptId || Long.ZERO).toString());
    message.calldata !== undefined &&
      (obj.calldata = base64FromBytes(
        message.calldata !== undefined ? message.calldata : new Uint8Array()
      ));
    message.askCount !== undefined &&
      (obj.askCount = (message.askCount || Long.ZERO).toString());
    message.minCount !== undefined &&
      (obj.minCount = (message.minCount || Long.ZERO).toString());
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryRequestSearchRequest>
  ): QueryRequestSearchRequest {
    const message = {
      ...baseQueryRequestSearchRequest,
    } as QueryRequestSearchRequest;
    if (object.oracleScriptId !== undefined && object.oracleScriptId !== null) {
      message.oracleScriptId = object.oracleScriptId as Long;
    } else {
      message.oracleScriptId = Long.ZERO;
    }
    if (object.calldata !== undefined && object.calldata !== null) {
      message.calldata = object.calldata;
    } else {
      message.calldata = new Uint8Array();
    }
    if (object.askCount !== undefined && object.askCount !== null) {
      message.askCount = object.askCount as Long;
    } else {
      message.askCount = Long.ZERO;
    }
    if (object.minCount !== undefined && object.minCount !== null) {
      message.minCount = object.minCount as Long;
    } else {
      message.minCount = Long.ZERO;
    }
    return message;
  },
};

const baseQueryRequestSearchResponse: object = {};

export const QueryRequestSearchResponse = {
  encode(
    message: QueryRequestSearchResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.requestPacketData !== undefined) {
      OracleRequestPacketData.encode(
        message.requestPacketData,
        writer.uint32(10).fork()
      ).ldelim();
    }
    if (message.responsePacketData !== undefined) {
      OracleResponsePacketData.encode(
        message.responsePacketData,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryRequestSearchResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryRequestSearchResponse,
    } as QueryRequestSearchResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.requestPacketData = OracleRequestPacketData.decode(
            reader,
            reader.uint32()
          );
          break;
        case 2:
          message.responsePacketData = OracleResponsePacketData.decode(
            reader,
            reader.uint32()
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryRequestSearchResponse {
    const message = {
      ...baseQueryRequestSearchResponse,
    } as QueryRequestSearchResponse;
    if (
      object.requestPacketData !== undefined &&
      object.requestPacketData !== null
    ) {
      message.requestPacketData = OracleRequestPacketData.fromJSON(
        object.requestPacketData
      );
    } else {
      message.requestPacketData = undefined;
    }
    if (
      object.responsePacketData !== undefined &&
      object.responsePacketData !== null
    ) {
      message.responsePacketData = OracleResponsePacketData.fromJSON(
        object.responsePacketData
      );
    } else {
      message.responsePacketData = undefined;
    }
    return message;
  },

  toJSON(message: QueryRequestSearchResponse): unknown {
    const obj: any = {};
    message.requestPacketData !== undefined &&
      (obj.requestPacketData = message.requestPacketData
        ? OracleRequestPacketData.toJSON(message.requestPacketData)
        : undefined);
    message.responsePacketData !== undefined &&
      (obj.responsePacketData = message.responsePacketData
        ? OracleResponsePacketData.toJSON(message.responsePacketData)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryRequestSearchResponse>
  ): QueryRequestSearchResponse {
    const message = {
      ...baseQueryRequestSearchResponse,
    } as QueryRequestSearchResponse;
    if (
      object.requestPacketData !== undefined &&
      object.requestPacketData !== null
    ) {
      message.requestPacketData = OracleRequestPacketData.fromPartial(
        object.requestPacketData
      );
    } else {
      message.requestPacketData = undefined;
    }
    if (
      object.responsePacketData !== undefined &&
      object.responsePacketData !== null
    ) {
      message.responsePacketData = OracleResponsePacketData.fromPartial(
        object.responsePacketData
      );
    } else {
      message.responsePacketData = undefined;
    }
    return message;
  },
};

const baseQueryRequestPriceRequest: object = {
  symbol: "",
  askCount: Long.ZERO,
  minCount: Long.ZERO,
};

export const QueryRequestPriceRequest = {
  encode(
    message: QueryRequestPriceRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.symbol !== "") {
      writer.uint32(10).string(message.symbol);
    }
    if (!message.askCount.isZero()) {
      writer.uint32(16).int64(message.askCount);
    }
    if (!message.minCount.isZero()) {
      writer.uint32(24).int64(message.minCount);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryRequestPriceRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryRequestPriceRequest,
    } as QueryRequestPriceRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.symbol = reader.string();
          break;
        case 2:
          message.askCount = reader.int64() as Long;
          break;
        case 3:
          message.minCount = reader.int64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryRequestPriceRequest {
    const message = {
      ...baseQueryRequestPriceRequest,
    } as QueryRequestPriceRequest;
    if (object.symbol !== undefined && object.symbol !== null) {
      message.symbol = String(object.symbol);
    } else {
      message.symbol = "";
    }
    if (object.askCount !== undefined && object.askCount !== null) {
      message.askCount = Long.fromString(object.askCount);
    } else {
      message.askCount = Long.ZERO;
    }
    if (object.minCount !== undefined && object.minCount !== null) {
      message.minCount = Long.fromString(object.minCount);
    } else {
      message.minCount = Long.ZERO;
    }
    return message;
  },

  toJSON(message: QueryRequestPriceRequest): unknown {
    const obj: any = {};
    message.symbol !== undefined && (obj.symbol = message.symbol);
    message.askCount !== undefined &&
      (obj.askCount = (message.askCount || Long.ZERO).toString());
    message.minCount !== undefined &&
      (obj.minCount = (message.minCount || Long.ZERO).toString());
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryRequestPriceRequest>
  ): QueryRequestPriceRequest {
    const message = {
      ...baseQueryRequestPriceRequest,
    } as QueryRequestPriceRequest;
    if (object.symbol !== undefined && object.symbol !== null) {
      message.symbol = object.symbol;
    } else {
      message.symbol = "";
    }
    if (object.askCount !== undefined && object.askCount !== null) {
      message.askCount = object.askCount as Long;
    } else {
      message.askCount = Long.ZERO;
    }
    if (object.minCount !== undefined && object.minCount !== null) {
      message.minCount = object.minCount as Long;
    } else {
      message.minCount = Long.ZERO;
    }
    return message;
  },
};

const baseQueryRequestPriceResponse: object = {
  oracleScriptId: Long.ZERO,
  askCount: Long.ZERO,
  minCount: Long.ZERO,
};

export const QueryRequestPriceResponse = {
  encode(
    message: QueryRequestPriceResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (!message.oracleScriptId.isZero()) {
      writer.uint32(8).int64(message.oracleScriptId);
    }
    if (message.calldata.length !== 0) {
      writer.uint32(18).bytes(message.calldata);
    }
    if (!message.askCount.isZero()) {
      writer.uint32(24).int64(message.askCount);
    }
    if (!message.minCount.isZero()) {
      writer.uint32(32).int64(message.minCount);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryRequestPriceResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryRequestPriceResponse,
    } as QueryRequestPriceResponse;
    message.calldata = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.oracleScriptId = reader.int64() as Long;
          break;
        case 2:
          message.calldata = reader.bytes();
          break;
        case 3:
          message.askCount = reader.int64() as Long;
          break;
        case 4:
          message.minCount = reader.int64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryRequestPriceResponse {
    const message = {
      ...baseQueryRequestPriceResponse,
    } as QueryRequestPriceResponse;
    message.calldata = new Uint8Array();
    if (object.oracleScriptId !== undefined && object.oracleScriptId !== null) {
      message.oracleScriptId = Long.fromString(object.oracleScriptId);
    } else {
      message.oracleScriptId = Long.ZERO;
    }
    if (object.calldata !== undefined && object.calldata !== null) {
      message.calldata = bytesFromBase64(object.calldata);
    }
    if (object.askCount !== undefined && object.askCount !== null) {
      message.askCount = Long.fromString(object.askCount);
    } else {
      message.askCount = Long.ZERO;
    }
    if (object.minCount !== undefined && object.minCount !== null) {
      message.minCount = Long.fromString(object.minCount);
    } else {
      message.minCount = Long.ZERO;
    }
    return message;
  },

  toJSON(message: QueryRequestPriceResponse): unknown {
    const obj: any = {};
    message.oracleScriptId !== undefined &&
      (obj.oracleScriptId = (message.oracleScriptId || Long.ZERO).toString());
    message.calldata !== undefined &&
      (obj.calldata = base64FromBytes(
        message.calldata !== undefined ? message.calldata : new Uint8Array()
      ));
    message.askCount !== undefined &&
      (obj.askCount = (message.askCount || Long.ZERO).toString());
    message.minCount !== undefined &&
      (obj.minCount = (message.minCount || Long.ZERO).toString());
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryRequestPriceResponse>
  ): QueryRequestPriceResponse {
    const message = {
      ...baseQueryRequestPriceResponse,
    } as QueryRequestPriceResponse;
    if (object.oracleScriptId !== undefined && object.oracleScriptId !== null) {
      message.oracleScriptId = object.oracleScriptId as Long;
    } else {
      message.oracleScriptId = Long.ZERO;
    }
    if (object.calldata !== undefined && object.calldata !== null) {
      message.calldata = object.calldata;
    } else {
      message.calldata = new Uint8Array();
    }
    if (object.askCount !== undefined && object.askCount !== null) {
      message.askCount = object.askCount as Long;
    } else {
      message.askCount = Long.ZERO;
    }
    if (object.minCount !== undefined && object.minCount !== null) {
      message.minCount = object.minCount as Long;
    } else {
      message.minCount = Long.ZERO;
    }
    return message;
  },
};

const baseQueryDataProvidersPoolRequest: object = {};

export const QueryDataProvidersPoolRequest = {
  encode(
    _: QueryDataProvidersPoolRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryDataProvidersPoolRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryDataProvidersPoolRequest,
    } as QueryDataProvidersPoolRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): QueryDataProvidersPoolRequest {
    const message = {
      ...baseQueryDataProvidersPoolRequest,
    } as QueryDataProvidersPoolRequest;
    return message;
  },

  toJSON(_: QueryDataProvidersPoolRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<QueryDataProvidersPoolRequest>
  ): QueryDataProvidersPoolRequest {
    const message = {
      ...baseQueryDataProvidersPoolRequest,
    } as QueryDataProvidersPoolRequest;
    return message;
  },
};

const baseQueryDataProvidersPoolResponse: object = {};

export const QueryDataProvidersPoolResponse = {
  encode(
    message: QueryDataProvidersPoolResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.pool) {
      DecCoin.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryDataProvidersPoolResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryDataProvidersPoolResponse,
    } as QueryDataProvidersPoolResponse;
    message.pool = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pool.push(DecCoin.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryDataProvidersPoolResponse {
    const message = {
      ...baseQueryDataProvidersPoolResponse,
    } as QueryDataProvidersPoolResponse;
    message.pool = [];
    if (object.pool !== undefined && object.pool !== null) {
      for (const e of object.pool) {
        message.pool.push(DecCoin.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: QueryDataProvidersPoolResponse): unknown {
    const obj: any = {};
    if (message.pool) {
      obj.pool = message.pool.map((e) => (e ? DecCoin.toJSON(e) : undefined));
    } else {
      obj.pool = [];
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryDataProvidersPoolResponse>
  ): QueryDataProvidersPoolResponse {
    const message = {
      ...baseQueryDataProvidersPoolResponse,
    } as QueryDataProvidersPoolResponse;
    message.pool = [];
    if (object.pool !== undefined && object.pool !== null) {
      for (const e of object.pool) {
        message.pool.push(DecCoin.fromPartial(e));
      }
    }
    return message;
  },
};

const baseQueryRequestIDs: object = { requestIds: Long.ZERO };

export const QueryRequestIDs = {
  encode(
    message: QueryRequestIDs,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    writer.uint32(10).fork();
    for (const v of message.requestIds) {
      writer.int64(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryRequestIDs {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryRequestIDs } as QueryRequestIDs;
    message.requestIds = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.requestIds.push(reader.int64() as Long);
            }
          } else {
            message.requestIds.push(reader.int64() as Long);
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryRequestIDs {
    const message = { ...baseQueryRequestIDs } as QueryRequestIDs;
    message.requestIds = [];
    if (object.requestIds !== undefined && object.requestIds !== null) {
      for (const e of object.requestIds) {
        message.requestIds.push(Long.fromString(e));
      }
    }
    return message;
  },

  toJSON(message: QueryRequestIDs): unknown {
    const obj: any = {};
    if (message.requestIds) {
      obj.requestIds = message.requestIds.map((e) =>
        (e || Long.ZERO).toString()
      );
    } else {
      obj.requestIds = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<QueryRequestIDs>): QueryRequestIDs {
    const message = { ...baseQueryRequestIDs } as QueryRequestIDs;
    message.requestIds = [];
    if (object.requestIds !== undefined && object.requestIds !== null) {
      for (const e of object.requestIds) {
        message.requestIds.push(e);
      }
    }
    return message;
  },
};

/** Query defines the gRPC querier service. */
export interface Query {
  /** Counts queries the number of data sources, oracle scripts, and requests. */
  Counts(request: QueryCountsRequest): Promise<QueryCountsResponse>;
  /** Data queries the data source or oracle script script for given file hash. */
  Data(request: QueryDataRequest): Promise<QueryDataResponse>;
  /** DataSource queries data source info for given data source id. */
  DataSource(request: QueryDataSourceRequest): Promise<QueryDataSourceResponse>;
  /** OracleScript queries oracle script info for given oracle script id. */
  OracleScript(
    request: QueryOracleScriptRequest
  ): Promise<QueryOracleScriptResponse>;
  /** Request queries request info for given request id. */
  Request(request: QueryRequestRequest): Promise<QueryRequestResponse>;
  /**
   * Validator queries oracle info of validator for given validator
   * address.
   */
  Validator(request: QueryValidatorRequest): Promise<QueryValidatorResponse>;
  /** Reporters queries all reporters of a given validator address. */
  Reporters(request: QueryReportersRequest): Promise<QueryReportersResponse>;
  /** ActiveValidators queries all active oracle validators. */
  ActiveValidators(
    request: QueryActiveValidatorsRequest
  ): Promise<QueryActiveValidatorsResponse>;
  /** Params queries the oracle parameters. */
  Params(request: QueryParamsRequest): Promise<QueryParamsResponse>;
  /** RequestSearch queries the latest request that match the given input. */
  RequestSearch(
    request: QueryRequestSearchRequest
  ): Promise<QueryRequestSearchResponse>;
  /**
   * RequestPrice queries the latest price on standard price reference oracle
   * script.
   */
  RequestPrice(
    request: QueryRequestPriceRequest
  ): Promise<QueryRequestPriceResponse>;
  DataProvidersPool(
    request: QueryDataProvidersPoolRequest
  ): Promise<QueryDataProvidersPoolResponse>;
}

export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
  }
  Counts(request: QueryCountsRequest): Promise<QueryCountsResponse> {
    const data = QueryCountsRequest.encode(request).finish();
    const promise = this.rpc.request("oracle.v1.Query", "Counts", data);
    return promise.then((data) =>
      QueryCountsResponse.decode(new _m0.Reader(data))
    );
  }

  Data(request: QueryDataRequest): Promise<QueryDataResponse> {
    const data = QueryDataRequest.encode(request).finish();
    const promise = this.rpc.request("oracle.v1.Query", "Data", data);
    return promise.then((data) =>
      QueryDataResponse.decode(new _m0.Reader(data))
    );
  }

  DataSource(
    request: QueryDataSourceRequest
  ): Promise<QueryDataSourceResponse> {
    const data = QueryDataSourceRequest.encode(request).finish();
    const promise = this.rpc.request("oracle.v1.Query", "DataSource", data);
    return promise.then((data) =>
      QueryDataSourceResponse.decode(new _m0.Reader(data))
    );
  }

  OracleScript(
    request: QueryOracleScriptRequest
  ): Promise<QueryOracleScriptResponse> {
    const data = QueryOracleScriptRequest.encode(request).finish();
    const promise = this.rpc.request("oracle.v1.Query", "OracleScript", data);
    return promise.then((data) =>
      QueryOracleScriptResponse.decode(new _m0.Reader(data))
    );
  }

  Request(request: QueryRequestRequest): Promise<QueryRequestResponse> {
    const data = QueryRequestRequest.encode(request).finish();
    const promise = this.rpc.request("oracle.v1.Query", "Request", data);
    return promise.then((data) =>
      QueryRequestResponse.decode(new _m0.Reader(data))
    );
  }

  Validator(request: QueryValidatorRequest): Promise<QueryValidatorResponse> {
    const data = QueryValidatorRequest.encode(request).finish();
    const promise = this.rpc.request("oracle.v1.Query", "Validator", data);
    return promise.then((data) =>
      QueryValidatorResponse.decode(new _m0.Reader(data))
    );
  }

  Reporters(request: QueryReportersRequest): Promise<QueryReportersResponse> {
    const data = QueryReportersRequest.encode(request).finish();
    const promise = this.rpc.request("oracle.v1.Query", "Reporters", data);
    return promise.then((data) =>
      QueryReportersResponse.decode(new _m0.Reader(data))
    );
  }

  ActiveValidators(
    request: QueryActiveValidatorsRequest
  ): Promise<QueryActiveValidatorsResponse> {
    const data = QueryActiveValidatorsRequest.encode(request).finish();
    const promise = this.rpc.request(
      "oracle.v1.Query",
      "ActiveValidators",
      data
    );
    return promise.then((data) =>
      QueryActiveValidatorsResponse.decode(new _m0.Reader(data))
    );
  }

  Params(request: QueryParamsRequest): Promise<QueryParamsResponse> {
    const data = QueryParamsRequest.encode(request).finish();
    const promise = this.rpc.request("oracle.v1.Query", "Params", data);
    return promise.then((data) =>
      QueryParamsResponse.decode(new _m0.Reader(data))
    );
  }

  RequestSearch(
    request: QueryRequestSearchRequest
  ): Promise<QueryRequestSearchResponse> {
    const data = QueryRequestSearchRequest.encode(request).finish();
    const promise = this.rpc.request("oracle.v1.Query", "RequestSearch", data);
    return promise.then((data) =>
      QueryRequestSearchResponse.decode(new _m0.Reader(data))
    );
  }

  RequestPrice(
    request: QueryRequestPriceRequest
  ): Promise<QueryRequestPriceResponse> {
    const data = QueryRequestPriceRequest.encode(request).finish();
    const promise = this.rpc.request("oracle.v1.Query", "RequestPrice", data);
    return promise.then((data) =>
      QueryRequestPriceResponse.decode(new _m0.Reader(data))
    );
  }

  DataProvidersPool(
    request: QueryDataProvidersPoolRequest
  ): Promise<QueryDataProvidersPoolResponse> {
    const data = QueryDataProvidersPoolRequest.encode(request).finish();
    const promise = this.rpc.request(
      "oracle.v1.Query",
      "DataProvidersPool",
      data
    );
    return promise.then((data) =>
      QueryDataProvidersPoolResponse.decode(new _m0.Reader(data))
    );
  }
}

interface Rpc {
  request(
    service: string,
    method: string,
    data: Uint8Array
  ): Promise<Uint8Array>;
}

declare var self: any | undefined;
declare var window: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof self !== "undefined") return self;
  if (typeof window !== "undefined") return window;
  if (typeof global !== "undefined") return global;
  throw "Unable to locate global object";
})();

const atob: (b64: string) => string =
  globalThis.atob ||
  ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; ++i) {
    arr[i] = bin.charCodeAt(i);
  }
  return arr;
}

const btoa: (bin: string) => string =
  globalThis.btoa ||
  ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr: Uint8Array): string {
  const bin: string[] = [];
  for (let i = 0; i < arr.byteLength; ++i) {
    bin.push(String.fromCharCode(arr[i]));
  }
  return btoa(bin.join(""));
}

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | undefined
  | Long;
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
