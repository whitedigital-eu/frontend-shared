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

type FormFieldValue =
  | string
  | string[]
  | number
  | number[]
  | boolean
  | null
  | undefined

export class FormField {
  errors?: string[]
  readonly?: boolean

  public formatter: (x: this['value']) => any
  constructor(
    public type: string,
    public name: string,
    public label: string,
    public value: FormFieldValue = ''
  ) {
    this.formatter = (x) => x
  }

  public getFormatted() {
    return this.formatter(this.value)
  }
}

class TextField extends FormField {
  declare value: Exclude<TextValue, number>

  constructor(
    name: string,
    label: string,
    value?: TextValue,
    readonly = false
  ) {
    super(
      'text',
      name,
      label,
      typeof value === 'number' ? value.toString() : value
    )
    this.readonly = readonly
  }
}

class DecimalField extends FormField {
  declare value: DecimalValue
  constructor(
    name: string,
    label: string,
    value?: TextValue,
    readonly = false
  ) {
    super('decimal', name, label)
    this.readonly = readonly
    this.value = value
  }
}

class TextareaField extends FormField {
  declare value: TextEditorValue
  constructor(name: string, label: string, value?: TextEditorValue) {
    super('textarea', name, label, value)
  }
}

class SimpleSelectField extends FormField {
  declare value: SimpleSelectValue
  config: SimpleSelectConfig
  constructor(
    name: string,
    label: string,
    value?: SimpleSelectValue,
    options: SelectOption[] = [],
    readonly = false,
    create = false
  ) {
    super('simple-select', name, label, value)
    this.config = { options, create }
    this.readonly = readonly
  }
}

class DataFetchingSelectField extends FormField {
  declare value: DataFetchingSelectValue
  config: DataFetchingSelectConfig
  constructor(
    name: string,
    label: string,
    value: DataFetchingSelectValue = '',
    config: DataFetchingSelectConfig,
    readonly = false
  ) {
    super('data-fetching-select', name, label, value)
    if (!config.minSymbols) config.minSymbols = 3
    this.config = config
    this.readonly = readonly
  }
}

class DateField extends FormField {
  declare value: DatepickerValue
  constructor(name: string, label: string, value?: DatepickerValue) {
    super('date', name, label, value)
  }
}

class TimeField extends FormField {
  declare value: FlatpickrTimePickerValue
  constructor(name: string, label: string, value = '', readonly = false) {
    super('time', name, label, value)
    this.readonly = readonly
  }
}

class DateTimeField extends FormField {
  declare value: DateTimePickerValue
  constructor(
    name: string,
    label: string,
    value: DateTimePickerValue = dayjs().toISOString()
  ) {
    super('date-time', name, label, value)
  }
}

class FileUploadField extends FormField {
  declare value: FileUploadValue
  constructor(name: string, label: string, value?: FileUploadValue) {
    super('file-upload', name, label, value)
  }
}

class CheckboxField extends FormField {
  declare value: CheckboxValue
  constructor(name: string, label: string, value?: CheckboxValue) {
    super('checkbox', name, label, value)
  }
}

class SliderField extends FormField {
  declare value: SliderValue
  constructor(name: string, label: string) {
    super('slider', name, label)
  }
}

const isSelectField = (
  maybeSelectField: FormField
  //@ts-ignore
): maybeSelectField is DataFetchingSelectField | SimpleSelectField => {
  return (
    maybeSelectField.type === 'simple-select' ||
    maybeSelectField.type === 'data-fetching-select'
  )
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
  declare value: null | undefined | T
  config: SimpleSelectConfigTyped<T>
  constructor(
    name: string,
    label: string,
    value?: null | undefined | T,
    options: SelectOptionTyped<string, T>[] = [],
    readonly = false,
    create = false
  ) {
    super('simple-select', name, label, value)
    this.config = { options, create }
    this.readonly = readonly
  }
}

export class SimpleSelectFieldTM<T extends string> extends FormField {
  declare value: null | undefined | T[]
  config: SimpleSelectConfigTyped<T>
  constructor(
    name: string,
    label: string,
    value?: null | undefined | T[],
    options: SelectOptionTyped<string, T>[] = [],
    readonly = false,
    create = false
  ) {
    super('simple-select', name, label, value)
    this.config = { options, create }
    this.readonly = readonly
  }
}
