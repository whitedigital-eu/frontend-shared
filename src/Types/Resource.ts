import { Classifier, ClassifierPost } from './Classifier'
import { User, UserPost } from './User'
import { Document, DocumentPost } from './Document'
import { Audit } from './Audit'
import { FinancialAccount, FinancialAccountPost } from './FinancialAccount'
import { Email, EmailPost } from './Email'
import { IpAddress, IpAddressPost } from './IpAddress'
import { Identity, IdentityPost } from './Identity'
import { Phone, PhonePost } from './Phone'
import { Web, WebPost } from './Web'
import { Location, LocationPost } from './Location'
import { LikumiSection } from './LikumiSection'
import { LikumiArticle } from './LikumiArticle'

// not an ideal solution - numbers should be of fixed lengths!!!
export type IsoDateString =
  `${number}-${number}-${number}T${number}:${number}:${number}.${number}Z`

export const camelToSnakeCase = (str: string) => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}
export const snakeToCamelCase = (str: string) =>
  str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace('-', '').replace('_', '')
    )

export type ResourceString =
  | 'audits'
  | 'classifiers'
  | 'documents'
  | 'emails'
  | 'financial_accounts'
  | 'identities'
  | 'ip_addresses'
  | 'locations'
  | 'login'
  | 'logout'
  | 'phones'
  | 'users'
  | 'webs'
  | 'likumi_sections'
  | 'likumi_articles'

export type ResourceStringCamelcase =
  | 'emails'
  | 'phones'
  | 'webs'
  | 'locations'
  | 'ipAddresses'
  | 'financialAccounts'

export type DocumentAdditionalInfoResourceString = ResourceString &
  (
    | 'emails'
    | 'financial_accounts'
    | 'identitites'
    | 'ip_addresses'
    | 'locations'
    | 'phones'
    | 'webs'
  )

export type IriString<T extends ResourceString> =
  | `/api/${T}`
  | `/api/${T}/${number}`

export interface Resource<T extends ResourceString> {
  '@context': string
  '@id': IriString<T>
  '@type': string
  id: number
}

export interface CrudResource<T extends ResourceString> extends Resource<T> {
  created: string
  updated: string
}

export type AnyCrudResource =
  | Audit
  | Classifier
  | Document
  | Email
  | FinancialAccount
  | Identity
  | IpAddress
  | Location
  | Phone
  | User
  | Web
  | LikumiSection
  | LikumiArticle
export type AnyResourcePost =
  | ClassifierPost
  | DocumentPost
  | EmailPost
  | FinancialAccountPost
  | IdentityPost
  | IpAddressPost
  | LocationPost
  | PhonePost
  | UserPost
  | WebPost

export type DocumentAdditionalInfoPost =
  | EmailPost
  | FinancialAccountPost
  | IdentityPost
  | IpAddressPost
  | LocationPost
  | PhonePost
  | WebPost
