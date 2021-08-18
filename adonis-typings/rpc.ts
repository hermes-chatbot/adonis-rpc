declare module '@ioc:Hermes/RPC' {
  import { ManagerContract } from '@poppinss/manager'
  import { RedisRPC, RedisRpcOptions } from '@hermes-chat/redis-rpc'

  export interface RPCTransportContract {
    register(methodName: string, handler: (data: any) => Promise<any> | any): void
    call(methodName: string, params: any): Promise<any>
  }

  export interface BaseRPCTransportConfig {
    driver: string
  }
  export interface RedisRPCTransportConfig extends BaseRPCTransportConfig, RedisRpcOptions {
    driver: 'redis'
    channels: {
      request: `rpc:${string}`
      response: `rpc:${string}`
    }
  }

  export type RpcHandler<T = any> = (message: T) => any

  export interface RedisRPCTransportContract extends RedisRPC {}

  // Must be set on the user land using declaration merging
  export interface RPCTransportList {
    redis: {
      implementation: RedisRPCTransportContract
      config: RedisRPCTransportConfig
    }
  }

  export type RPCMappings = Record<
    keyof RPCTransportList,
    RPCTransportList[keyof RPCTransportList]['implementation']
  >

  export interface RPCConfig {
    transport: keyof RPCTransportList
    preloadFile?: string
    transports: {
      [K in keyof RPCTransportList]: RPCTransportList[K]['config']
    }
  }
  export type RPCManagerContract = ManagerContract<
    any,
    RPCTransportContract,
    RPCTransportContract,
    RPCMappings
  >

  const RPCProvider: RPCManagerContract

  export default RPCProvider
}
