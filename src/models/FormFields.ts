import {
  DataFetchingSelectConfig,
  SimpleSelectConfig,
} from '../types/InputFields'
import { SelectOption } from './SelectOption'
import dayjs from 'dayjs'

export class FormField {
  public formatter: (x: any) => any
  constructor(
    public type: string,
    public name: string,
    public label: string,
    public value: string | string[] | boolean | null = ''
  ) {
    this.formatter = (x) => x
  }

  public getFormatted() {
    return this.formatter(this.value)
  }
}

class TextField extends FormField {
  readonly: boolean
  constructor(name: string, label: string, value = '', readonly = false) {
    super('text', name, label, value)
    this.readonly = readonly
  }
}

class DecimalField extends FormField {
  readonly: boolean
  constructor(name: string, label: string, value = '', readonly = false) {
    super('decimal', name, label, value)
    this.readonly = readonly
  }
}

class TextareaField extends FormField {
  constructor(name: string, label: string, value = '') {
    super('textarea', name, label, value)
  }
}

class SimpleSelectField extends FormField {
  config: SimpleSelectConfig
  readonly: boolean
  constructor(
    name: string,
    label: string,
    value: string | string[] = '',
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
  config: DataFetchingSelectConfig
  readonly: boolean
  constructor(
    name: string,
    label: string,
    value: string | string[] = '',
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
  constructor(name, label, value = '') {
    super('date', name, label, value)
  }
}

class DateTimeField extends FormField {
  constructor(name, label, value: string | null = dayjs().toISOString()) {
    super('date-time', name, label, value)
  }
}

class FileUploadField extends FormField {
  constructor(name: string, label: string, value: string | string[] = '') {
    super('file-upload', name, label, value)
  }
}

class CheckboxField extends FormField {
  constructor(name: string, label: string, value = false) {
    super('checkbox', name, label, value)
  }
}

class SliderField extends FormField {
  constructor(name: string, label: string) {
    super('slider', name, label)
  }
}

export {
  TextField,
  TextareaField,
  SimpleSelectField,
  DataFetchingSelectField,
  DateField,
  DateTimeField,
  FileUploadField,
  CheckboxField,
  SliderField,
  DecimalField,
}
