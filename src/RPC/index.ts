import { RedisRPC } from '@hermes-chat/redis-rpc'
import {
  RPCConfig,
  RPCManagerContract,
  RPCMappings,
  RPCTransportContract,
  RPCTransportList,
} from '@ioc:Hermes/RPC'
import { Manager } from '@poppinss/manager'

export default class RPC
  extends Manager<any, RPCTransportContract, RPCTransportContract, RPCMappings>
  implements RPCManagerContract
{
  protected singleton = false

  constructor(private config: RPCConfig) {
    super({})
  }

  public createRedis(mappingName, config) {
    return new RedisRPC({
      id: mappingName,
      ...config,
    })
  }

  protected getDefaultMappingName() {
    return this.config.transport
  }

  protected getMappingConfig(mappingName: keyof RPCTransportList) {
    return this.config.transports[mappingName]
  }

  protected getMappingDriver(mappingName: keyof RPCTransportList) {
    // @ts-ignore
    return this.config.transports[mappingName].driver
  }
}
