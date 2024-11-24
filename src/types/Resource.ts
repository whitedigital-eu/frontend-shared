export type IriString<
  AnyResourceString extends string,
  ResourceString extends AnyResourceString,
> = `${string}/${ResourceString}` | `${string}/${ResourceString}/${number}`

export type GuidIriString<
  AnyResourceString extends string,
  ResourceString extends AnyResourceString,
> = `${string}/${ResourceString}` | `${string}/${ResourceString}/${string}`

export interface Resource<
  AnyResourceString extends string,
  ResourceString extends AnyResourceString,
> {
  '@context': string
  '@id': IriString<AnyResourceString, ResourceString>
  '@type': string
  id: number
}

export type GuidResource<
  AnyResourceString extends string,
  ResourceString extends AnyResourceString,
> = {
  '@context': string
  '@id': GuidIriString<AnyResourceString, ResourceString>
  '@type': string
  id: string
}

export interface CrudResource<
  AnyResourceString extends string,
  ResourceString extends AnyResourceString,
> extends Resource<AnyResourceString, ResourceString> {
  created: string
  updated: string
}
