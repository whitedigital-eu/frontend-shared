export default class Filter {
  type: string
  label: string
  name: string
  value: string | string[]
  config: any

  constructor(
    label,
    name,
    type = 'text',
    config = {},
    value: string | string[] = ''
  ) {
    this.type = type
    this.label = label
    this.name = name
    this.value = value
    this.config = config
  }

  static async createFromApiResponse(response: any) {
    if (!response?.['hydra:search']?.['hydra:mapping']) return
    const hydraMapping = response['hydra:search']['hydra:mapping']
    const filters: any = {
      default: [],
      advanced: [],
    }

    const partialSearchFilters = hydraMapping
      .filter(
        (searchObj: any) =>
          searchObj.variable.includes('[ipartial]') &&
          searchObj.variable !== 'statusValue[ipartial]' &&
          searchObj.variable !== 'typeValue[ipartial]'
      )
      .map((searchObj: any) => {
        return new Filter(
          Filter.getFilterLabel(searchObj.property),
          searchObj.variable
        )
      })

    const rangeFilters = hydraMapping
      .filter(
        (searchObj: any) =>
          searchObj.variable.includes('[lt]') ||
          searchObj.variable.includes('[gte]')
      )
      .map((searchObj: any) => {
        return new Filter(
          Filter.getFilterLabel(searchObj.variable),
          searchObj.variable
        )
      })

    const multisearchFilter = this.findByProperty(hydraMapping, 'multisearch')

    const customFilters: any[] = []

    if (multisearchFilter) {
      filters.default = [new Filter('Meklēt', multisearchFilter.variable)]
      filters.advanced = [
        ...partialSearchFilters,
        ...rangeFilters,
        ...customFilters,
      ]
    } else {
      filters.default = [
        ...partialSearchFilters,
        ...rangeFilters,
        ...customFilters,
      ]
    }

    return filters
  }

  static getFilterLabel = (property: string) =>
    filterPropToLabel[property] ?? property
  static findByProperty = (hydraMapping: any, variable: string) =>
    hydraMapping.find((searchObj: any) => searchObj.variable === variable)
}

const filterPropToLabel = {
  brandValue: 'Zīmols',
  customerId: 'Klients',
  vin: 'VIN',
  model: 'Modelis',
  notes: 'Piezīmes',
  customersName: 'Uzņēmuma nosaukums',
  dealTitle: 'Darījuma nosaukums',
  personFullName: 'Kontaktpersonas vārds',
  fromDate: 'Aktivitātes datums',
  userEmail: 'E-pasts',
  ipAddress: 'IP addrese',
  category: 'Kategorija',
  message: 'Paziņojums',
  'created[before]': 'Izveidots no',
  'created[after]': 'Izveidots līdz',
  value: 'Vērtība',
  countryValue: 'Valsts',
  name: 'Nosaukums',
  registrationNumber: 'Reģistrācijas numurs',
  addressPlain: 'Adrese',
  personsFullName: 'Personas vārds',
  title: 'Nosaukums',
  customerName: 'Klients',
  statusValue: 'Statuss',
  fullName: 'Vārds',
  personalCode: 'Personas kods',
  email: 'E-pasts',
  type: 'Tips',
  hasRecentDeals: 'Vai ir darījumi pēdējā mēneša laikā',
  'numAnimals[lt]': 'Ganāmpulka lielums mazāks par',
  'numAnimals[gte]': 'Ganāmpulka lielums lielāks par',
  'landArea[lt]': 'Zemes platība mazāka par',
  'landArea[gte]': 'Zemes platība lielāka par',
  active: 'Pēc aktivitātes',
  roles: 'Loma',
  'power[lt]': 'Jauda mazāka par',
  'power[gte]': 'Jauda lielāka par',
  ownerId: 'Atbildīgā persona',
  data: 'Dati',
  'manufacturingYear[gte]': 'Ražošanas gads lielāks par',
  'manufacturingYear[lt]': 'Ražošanas gads mazāks par',
  responsibleId: 'Atbildīgā persona',
  'typeValue[exact]': 'Tips',
  customerRegistrationNumber: 'Uzņēmuma reģistrācijas numurs',
  'exists[finished]': 'Pēc beigu stāvokļa',
  finished: 'Beigu stāvoklis',
}
