import {
  DataFetchingSelectConfig,
  SimpleSelectConfig,
} from '../types/InputFields'
import { SelectOption } from './SelectOption'
import dayjs from 'dayjs'
import {
  TextValue,
  DecimalValue,
  TextEditorValue,
  DatepickerValue,
  DataFetchingSelectValue,
  SimpleSelectValue,
  DateTimePickerValue,
  FileUploadValue,
  CheckboxValue,
  SliderValue,
  FlatpickrTimePickerValue,
} from '../components/Inputs/ValueTypes'

export type FormFieldValue =
  | string
  | string[]
  | number
  | number[]
  | boolean
  | null
  | undefined

export abstract class FormField {
  public errors?: string[]
  public readonly?: boolean
  public abstract value: FormFieldValue

  public formatter: (x: this['value']) => any
  protected constructor(
    public type: string,
    public name: string,
    public label: string
  ) {
    this.formatter = (x) => x
  }

  public getFormatted() {
    return this.formatter(this.value)
  }
}

class TextField extends FormField {
  value: Exclude<TextValue, number>
  constructor(
    name: string,
    label: string,
    value?: TextValue,
    readonly = false
  ) {
    super('text', name, label)
    this.value = typeof value === 'number' ? value.toString() : value
    this.readonly = readonly
  }
}

class DecimalField extends FormField {
  public value: Exclude<DecimalValue, string>
  constructor(
    name: string,
    label: string,
    value?: Exclude<DecimalValue, string>,
    readonly = false
  ) {
    super('decimal', name, label)
    this.value = value
    this.readonly = readonly
  }
}

class TextareaField extends FormField {
  public value: Exclude<TextEditorValue, number>
  constructor(
    name: string,
    label: string,
    value?: Exclude<TextEditorValue, number>
  ) {
    super('textarea', name, label)
    this.value = value
  }
}

class SimpleSelectField extends FormField {
  public value: SimpleSelectValue
  config: SimpleSelectConfig
  constructor(
    name: string,
    label: string,
    value?: SimpleSelectValue,
    options: SelectOption[] = [],
    readonly = false,
    create = false
  ) {
    super('simple-select', name, label)
    this.value = value
    this.config = { options, create }
    this.readonly = readonly
  }
}

class DataFetchingSelectField extends FormField {
  public value: DataFetchingSelectValue
  config: DataFetchingSelectConfig
  constructor(
    name: string,
    label: string,
    value: DataFetchingSelectValue = '',
    config: DataFetchingSelectConfig,
    readonly = false
  ) {
    super('data-fetching-select', name, label)
    this.value = value
    const defaultConfig: Partial<DataFetchingSelectConfig> = { minSymbols: 3 }
    this.config = { ...defaultConfig, ...config }
    this.readonly = readonly
  }
}

class DateField extends FormField {
  public value: DatepickerValue
  constructor(name: string, label: string, value?: DatepickerValue) {
    super('date', name, label)
    this.value = value
  }
}

class TimeField extends FormField {
  constructor(
    name: string,
    label: string,
    public value: FlatpickrTimePickerValue,
    readonly = false
  ) {
    super('time', name, label)
    this.readonly = readonly
  }
}

class DateTimeField extends FormField {
  constructor(
    name: string,
    label: string,
    public value: DateTimePickerValue = dayjs().toISOString()
  ) {
    super('date-time', name, label)
  }
}

class FileUploadField extends FormField {
  public value: FileUploadValue
  constructor(name: string, label: string, value?: FileUploadValue) {
    super('file-upload', name, label)
    this.value = value
  }
}

class CheckboxField extends FormField {
  value: CheckboxValue
  constructor(name: string, label: string, value?: CheckboxValue) {
    super('checkbox', name, label)
    this.value = value
  }
}

class SliderField extends FormField {
  constructor(name: string, label: string, public value: SliderValue) {
    super('slider', name, label)
  }
}

const isSelectField = (
  maybeSelectField: any
): maybeSelectField is DataFetchingSelectField | SimpleSelectField => {
  return (
    maybeSelectField.type === 'simple-select' ||
    maybeSelectField.type === 'data-fetching-select' ||
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
    readonly = false
  ) {
    super('time-with-current', name, label)
    this.value = value
    this.readonly = readonly
  }
}

class SignatureField extends FormField {
  public value: string | null
  constructor(name: string, label: string, value = '') {
    super('signature', name, label)
    this.value = value
  }
}

export {
  TextField,
  TextareaField,
  SimpleSelectField,
  DataFetchingSelectField,
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
}

// START OF NEW TYPED FIELDS!
export type SimpleSelectConfigTyped<T extends string> = {
  options: SelectOptionTyped<string, T>[]
  create?: boolean
}

export class SelectOptionTyped<T extends string, V extends string> {
  constructor(public text: T, public value: V) {}
}

export class SimpleSelectFieldTS<T extends string> extends FormField {
  public value: null | undefined | T
  config: SimpleSelectConfigTyped<T>
  constructor(
    name: string,
    label: string,
    value?: null | undefined | T,
    options: SelectOptionTyped<string, T>[] = [],
    readonly = false,
    create = false
  ) {
    super('simple-select', name, label)
    this.value = value
    this.config = { options, create }
    this.readonly = readonly
  }
}

export class SimpleSelectFieldTM<T extends string> extends FormField {
  public value: null | undefined | T[]
  config: SimpleSelectConfigTyped<T>
  constructor(
    name: string,
    label: string,
    value?: null | undefined | T[],
    options: SelectOptionTyped<string, T>[] = [],
    readonly = false,
    create = false
  ) {
    super('simple-select', name, label)
    this.value = value
    this.config = { options, create }
    this.readonly = readonly
  }
}

export type AnyFormField =
  | TextField
  | TextareaField
  | SimpleSelectField
  | DataFetchingSelectField
  | DateField
  | TimeField
  | DateTimeField
  | FileUploadField
  | CheckboxField
  | SliderField
  | DecimalField
  | TimeWithCurrentField
  | SignatureField
  | SimpleSelectFieldTS<any>
  | SimpleSelectFieldTM<any>
