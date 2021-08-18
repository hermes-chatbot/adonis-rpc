import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { RedisRPC } from '@hermes-chat/redis-rpc'
import {
  RPCConfig,
  RPCManagerContract,
  RPCMappings,
  RPCTransportContract,
  RPCTransportList,
} from '@ioc:Hermes/RPC'
import { Manager } from '@poppinss/manager'
import { IocResolver } from '../IocResolver'

export default class RPC
  extends Manager<any, RPCTransportContract, RPCTransportContract, RPCMappings>
  implements RPCManagerContract, RPCTransportContract
{
  protected singleton = true

  protected iocResolver?: IocResolver

  constructor(private config: RPCConfig, app?: ApplicationContract) {
    super({})
    if (app) {
      this.iocResolver = new IocResolver(app)
    }
  }

  private getResolver(handler: string): IocResolver {
    if (!this.iocResolver) {
      throw new Error(
        `Cannot resolve string based event handler "${handler}". IoC container is not provided to the event emitter`
      )
    }

    return this.iocResolver
  }

  public createRedis(mappingName, config) {
    return new RedisRPC({
      id: mappingName,
      ...config,
    })
  }

  public async register(methodName: string, handler: string | ((message: any) => any)) {
    if (typeof handler === 'string') {
      handler = this.getResolver(handler).getEventHandler(methodName, handler)
    }
    this.use().register(methodName, handler)
    return this
  }

  public async call(methodName: string, params: any): Promise<any> {
    return this.use().call(methodName, params)
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
