import {
  SelectConfig,
  LabelProps,
  MapProps,
  PhoneNumberFieldConfig,
  DataFetchingSelectConfig,
  DateFieldConfig,
} from '../types/InputFields'
import dayjs from 'dayjs'
import {
  TextValue,
  DecimalValue,
  TextEditorValue,
  DatepickerValue,
  DateTimePickerValue,
  SliderValue,
  FlatpickrTimePickerValue,
  StringListValue,
  KeyAndValueListValue,
  MultipleTextFieldListValue,
  MapCoordinateSelectorFieldValue,
} from '../components/Inputs/ValueTypes'

export type FormFieldValue =
  | string
  | string[]
  | number
  | number[]
  | boolean
  | null
  | undefined
  | KeyAndValueListValue
  | MapCoordinateSelectorFieldValue

export abstract class FormField {
  public errors?: string[]
  public readonly?: boolean
  public abstract value: FormFieldValue

  public formatter: (x: this['value']) => any

  protected constructor(
    public type: string,
    public name: string,
    public label: string,
    public labelArray?: string[],
    public mapData?: MapProps,
    public text?: LabelProps,
  ) {
    this.formatter = (x) => x
  }

  public getFormatted() {
    return this.formatter(this.value)
  }
}

export type TextFieldConfig = Partial<{
  readonly: boolean
  wrapperAttributes: Record<string, unknown>
  labelAttributes: Record<string, unknown>
  inputAttributes: Record<string, unknown>
}>

class TextField extends FormField {
  value: Exclude<TextValue, number>
  config?: TextFieldConfig

  constructor(
    name: string,
    label: string,
    value?: TextValue,
    config?: TextFieldConfig,
  ) {
    super('text', name, label)
    this.value = typeof value === 'number' ? value.toString() : value
    this.config = config
  }
}

export type DecimalFieldConfig = Partial<{
  maxDecimals: number
  wrapperAttributes: Record<string, unknown>
  labelAttributes: Record<string, unknown>
  inputAttributes: Record<string, unknown>
}>

class DecimalField extends FormField {
  public value: Exclude<DecimalValue, string>
  public config?: DecimalFieldConfig

  constructor(
    name: string,
    label: string,
    value?: Exclude<DecimalValue, string>,
    config?: DecimalFieldConfig,
  ) {
    super('decimal', name, label)
    this.value = value
    this.config = config
  }
}

class TextareaField extends FormField {
  public value: Exclude<TextEditorValue, number>

  constructor(
    name: string,
    label: string,
    value?: Exclude<TextEditorValue, number>,
  ) {
    super('textarea', name, label)
    this.value = value
  }
}

class HtmlContentField extends FormField {
  public value: Exclude<TextEditorValue, number>

  constructor(
    name: string,
    label: string,
    value?: Exclude<TextEditorValue, number>,
  ) {
    super('html-content', name, label)
    this.value = value
  }
}

export class SimpleSelectField<T extends string | string[]> extends FormField {
  public value: T | null | undefined
  config: SelectConfig<T extends string ? T : T[number]>

  constructor(
    name: string,
    label: string,
    value?: T | null,
    config: SelectConfig<T extends string ? T : T[number]> = {},
  ) {
    super('simple-select', name, label)
    this.value = value
    this.config = config
  }

  setOptions(
    options: SelectOption<string, T extends string ? T : T[number]>[],
  ) {
    if (!this.config.tomSelectSettings) {
      this.config.tomSelectSettings = {}
    }
    this.config.tomSelectSettings.options = options
  }
}

class DataFetchingSelectField<T extends string | string[]> extends FormField {
  public value: T | null | undefined
  config: DataFetchingSelectConfig<T extends string ? T : T[number]>

  constructor(
    name: string,
    label: string,
    value: T | null | undefined,
    config: DataFetchingSelectConfig<T extends string ? T : T[number]>,
  ) {
    super('data-fetching-select', name, label)
    this.value = value
    this.config = config
  }

  setOptions(
    options: SelectOption<string, T extends string ? T : T[number]>[],
  ) {
    if (!this.config.tomSelectSettings) {
      this.config.tomSelectSettings = {}
    }
    this.config.tomSelectSettings.options = options
  }
}

class PhoneNumberField extends FormField {
  public value: string | null | undefined
  config?: PhoneNumberFieldConfig

  constructor(
    name: string,
    label: string,
    value: string | null | undefined = '',
    config?: PhoneNumberFieldConfig,
  ) {
    super('phone-number', name, label)
    this.value = value
    this.config = config
  }
}

class DateField extends FormField {
  public value: DatepickerValue
  config: DateFieldConfig

  constructor(
    name: string,
    label: string,
    value?: DatepickerValue,
    config?: DateFieldConfig,
  ) {
    super('date', name, label)
    this.value = value
    this.config = config ?? {}
  }
}

class TimeField extends FormField {
  constructor(
    name: string,
    label: string,
    public value: FlatpickrTimePickerValue,
    readonly = false,
  ) {
    super('time', name, label)
    this.readonly = readonly
  }
}

class DateTimeField extends FormField {
  constructor(
    name: string,
    label: string,
    public value: DateTimePickerValue = dayjs().toISOString(),
    public config:
      | { hoursStep?: number; minutesStep?: number }
      | undefined = undefined,
  ) {
    super('date-time', name, label)
  }
}

class FileUploadField<T extends string | string[]> extends FormField {
  public value: T | null | undefined
  public allowDownload = false
  public allowEdit = false
  public allowDelete = true
  public hostUrl = ''

  constructor(
    name: string,
    label: string,
    value?: T | null,
    config?: {
      allowDownload?: boolean
      allowEdit?: boolean
      allowDelete?: boolean
      hostUrl?: string
    },
  ) {
    super('file-upload', name, label)
    this.value = value
    if (config) {
      this.allowDownload = config.allowDownload ?? this.allowDownload
      this.allowEdit = config.allowEdit ?? this.allowEdit
      this.allowDelete = config.allowDelete ?? this.allowDelete
      this.hostUrl = config.hostUrl ?? this.hostUrl
    }
  }
}

class CheckboxField extends FormField {
  value: boolean
  readonly = false

  constructor(
    name: string,
    label: string,
    value?: boolean | undefined,
    readonly = false,
  ) {
    super('checkbox', name, label)
    this.value = value ?? false
    this.readonly = readonly
  }
}

class SliderField extends FormField {
  constructor(
    name: string,
    label: string,
    public value: SliderValue,
  ) {
    super('slider', name, label)
  }
}

const isSelectField = (
  maybeSelectField: any,
): maybeSelectField is
  | DataFetchingSelectField<any>
  | SimpleSelectField<any> => {
  return (
    maybeSelectField.type === 'simple-select' ||
    maybeSelectField.type === 'data-fetching-select'
  )
}

class TimeWithCurrentField extends FormField {
  public value: FlatpickrTimePickerValue

  constructor(
    name: string,
    label: string,
    value: FlatpickrTimePickerValue = null,
    readonly = false,
  ) {
    super('time-with-current', name, label)
    this.value = value
    this.readonly = readonly
  }
}

class SignatureField extends FormField {
  public value: string | null
  public editMode = false

  constructor(
    name: string,
    label: string,
    value = '',
    config?: {
      editMode?: boolean
    },
  ) {
    super('signature', name, label)
    this.value = value
    if (config) {
      this.editMode = config.editMode ?? this.editMode
    }
  }
}

class GovernmentIdField extends FormField {
  value: string | null

  constructor(name: string, label: string, value = '', readonly = false) {
    super('government-id', name, label)
    this.value = value
    this.readonly = readonly
  }
}

class PublicFileUploadField<
  T extends string | string[],
> extends FileUploadField<T> {
  public setPublic = true

  constructor(name: string, label: string, value?: T | null) {
    super(name, label, value)
  }
}

class TextArrayField extends FormField {
  public value: StringListValue = []

  constructor(name: string, label: string, value: StringListValue = []) {
    super('text-list', name, label)
    this.value = value
  }
}

class KeyAndValueArrayField extends FormField {
  public value: KeyAndValueListValue = []

  constructor(
    name: string,
    label: string,
    text: LabelProps,
    value: KeyAndValueListValue = [],
  ) {
    super('key-and-value-list', name, label)
    this.value = value
    this.text = text
  }
}

class MultipleTextFields extends FormField {
  public value: MultipleTextFieldListValue = []

  constructor(
    name: string,
    label: string,
    labelArray: string[],
    value: MultipleTextFieldListValue = [],
  ) {
    super('multiple-text-fields', name, label, labelArray)
    this.labelArray = labelArray
    this.value = value
  }
}

class MapCoordinateSelectorField extends FormField {
  public value: MapCoordinateSelectorFieldValue = {
    address: '',
    lat: 0,
    lng: 0,
  }

  constructor(
    name: string,
    label: string,
    mapData: MapProps,
    value: MapCoordinateSelectorFieldValue = { address: '', lat: 0, lng: 0 },
  ) {
    super('map-coordinate-selector', name, label)
    this.mapData = mapData
    this.value = value
  }
}

export class PlainTextareaField extends FormField {
  value: Exclude<TextValue, number>
  constructor(
    name: string,
    label: string,
    value?: TextValue,
    readonly = false,
  ) {
    super('plain-textarea', name, label)
    this.value = typeof value === 'number' ? value.toString() : value
    this.readonly = readonly
  }
}

class CollectionField<ValueType> extends FormField {
  //@ts-ignore
  value: ValueType[] | null | undefined
  constructor(
    name: string,
    label: string,
    value?: ValueType[] | null | undefined,
  ) {
    super('collection', name, label)
    this.value = value
  }
}

export {
  TextField,
  TextareaField,
  HtmlContentField,
  DataFetchingSelectField,
  PhoneNumberField,
  DateField,
  TimeField,
  DateTimeField,
  FileUploadField,
  CheckboxField,
  SliderField,
  DecimalField,
  TimeWithCurrentField,
  SignatureField,
  isSelectField,
  GovernmentIdField,
  PublicFileUploadField,
  TextArrayField,
  KeyAndValueArrayField,
  MultipleTextFields,
  MapCoordinateSelectorField,
  CollectionField,
}

export class SelectOption<
  T extends string = string,
  V extends string = string,
> {
  constructor(
    public text: T,
    public value: V,
  ) {}
}

export type AnyFormField =
  | TextField
  | TextareaField
  | TextArrayField
  | KeyAndValueArrayField
  | MultipleTextFields
  | MapCoordinateSelectorField
  | HtmlContentField
  | SimpleSelectField<any>
  | DataFetchingSelectField<any>
  | DateField
  | TimeField
  | DateTimeField
  | FileUploadField<any>
  | CheckboxField
  | SliderField
  | DecimalField
  | TimeWithCurrentField
  | SignatureField
  | GovernmentIdField
  | PublicFileUploadField<any>
  | CollectionField<any>
  | PhoneNumberField
