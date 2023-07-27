// not an ideal solution - numbers should be of fixed lengths!!!
export type IsoDateString =
  `${number}-${number}-${number}T${number}:${number}:${number}.${number}Z`

export type IriString<
  AnyResourceString extends string,
  ResourceString extends AnyResourceString,
> = `/api/${ResourceString}` | `/api/${ResourceString}/${number}`

export interface Resource<
  AnyResourceString extends string,
  ResourceString extends AnyResourceString,
> {
  '@context': string
  '@id': IriString<AnyResourceString, ResourceString>
  '@type': string
  id: number
}

export interface CrudResource<
  AnyResourceString extends string,
  ResourceString extends AnyResourceString,
> extends Resource<AnyResourceString, ResourceString> {
  created: string
  updated: string
}
