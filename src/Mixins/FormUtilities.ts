import { createInitialAxiosInstance } from '../Axios/createAxiosInstance'
import SelectOption from '../Models/SelectOption'
import { ClassifierType } from '../Types/Classifier'
import { FormData } from '../Types/FormData'
import { IpAddressType } from '../Types/IpAddress'
import { FinancialAccountType } from '../Types/FinancialAccount'
import { IdentityType } from '../Types/Identity'

const initialAxios = createInitialAxiosInstance()

export const setSelectOptions = async (
  formData: FormData,
  fieldName: string,
  optionsPromise: Promise<any>
): Promise<any> => {
  formData[fieldName].config.options = await optionsPromise
}
export const setSelectOptionsWithFirstAsValue = async (
  formData: FormData,
  fieldName: string,
  optionsPromise: Promise<any>
): Promise<any> => {
  const options = await optionsPromise
  formData[fieldName].config.options = options
  if (options.length) formData[fieldName].value = options[0].value
}

export const getUserSelectOptions = async () => {
  try {
    return (await initialAxios.get('users?active=true')).data[
      'hydra:member'
    ].map(SelectOption.createFromUser)
  } finally {
  }
}

export const getUserSelectOptionsWithId = async () => {
  try {
    return (await initialAxios.get('users?active=true')).data[
      'hydra:member'
    ].map(SelectOption.createFromUserWithId)
  } finally {
  }
}

export const loadCountrySelectOptions = async () => {
  const res = await initialAxios.get('classifiers', {
    params: { type: ClassifierType.country, pagination: false },
  })
  return res.data['hydra:member'].map(SelectOption.createFromClassifier)
}

export const loadDocumentTypeSelectOptions = async () => {
  const res = await initialAxios.get('classifiers', {
    params: { type: ClassifierType.documentType, pagination: false },
  })
  return res.data['hydra:member'].map(SelectOption.createFromClassifier)
}

export const loadIdentityStatusOptions = async () => {
  const res = await initialAxios.get('classifiers', {
    params: { type: ClassifierType.identityStatus, pagination: false },
  })
  return res.data['hydra:member'].map(SelectOption.createFromClassifier)
}

export const loadUserRoleSelectOptions = async () => {
  // return (await initialAxios.get('user_roles')).data['hydra:member'].map(
  //   SelectOption.createFromUserRole
  // )
  return []
}

export const loadCurrencySelectOptions = async () => {
  const res = await initialAxios.get('classifiers', {
    params: { type: ClassifierType.currency, pagination: false },
  })
  return res.data['hydra:member'].map(SelectOption.createFromClassifier)
}

export const loadLikumiSectionSelectOptions = async () => {
  const res = await initialAxios.get('likumi_sections', {
    params: { pagination: false },
  })
  return res.data['hydra:member'].map(SelectOption.createFromLikumiSection)
}

export const loadLikumiArticleSelectOptions = async (
  likumiSectionId: number
) => {
  const res = await initialAxios.get('likumi_articles', {
    params: { pagination: false, 'section.id': likumiSectionId },
  })
  return res.data['hydra:member'].map(SelectOption.createFromLikumiArticle)
}

export const classifierTypeSelectOptions: SelectOption[] = [
  new SelectOption('Dokumenta tips', ClassifierType.documentType),
  new SelectOption('Valsts', ClassifierType.country),
  new SelectOption('Valūta', ClassifierType.currency),
  new SelectOption('Identitātes statuss', ClassifierType.identityStatus),
]

export const ipAddressTypeSelectOptions: SelectOption[] = [
  new SelectOption('IPv4', IpAddressType.ipv4),
  new SelectOption('IPv6', IpAddressType.ipv6),
]

export const financialAccountTypeSelectOptions: SelectOption[] = [
  new SelectOption(
    'Latvijas bankas konts',
    FinancialAccountType.localBankAccount
  ),
  new SelectOption('Eiropas bankas konts', FinancialAccountType.euBankAccount),
  new SelectOption(
    'Globālas bankas konts',
    FinancialAccountType.globalBankAccount
  ),
  new SelectOption(
    'Kriptovalūtas maciņa konts',
    FinancialAccountType.cryptoVallet
  ),
]

export const identityTypeSelectOptions: SelectOption[] = [
  new SelectOption('Privāta persona', IdentityType.individual),
  new SelectOption('Juridiska persona', IdentityType.company),
]
