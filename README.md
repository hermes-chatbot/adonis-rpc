# @hermes-chat/adonis-rpc
> Adonis 5 RPC Provider

[![npm-image]][npm-url] [![license-image]][license-url] [![typescript-image]][typescript-url]

Transport agnostic RPC provider for Adonis 5

## Installation
Setup redis from [this manual](https://docs.adonisjs.com/guides/redis) and

```bash
npm i @hermes-chat/adonis-rpc
node ace configure @hermes-chat/adonis-rpc
```


## Usage

### Client mode
```typescript
import Route from '@ioc:Adonis/Core/Route'
import RPC from '@ioc:Hermes/RPC'
Route.get('example', () => {
  const { data: result } =  await RPC.call('example', {data: 'message'})
  return result
})
```
