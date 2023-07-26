type SNNU = string | number | null | undefined

export type TextValue = SNNU
export type DecimalValue = SNNU
export type TextEditorValue = SNNU
export type SimpleSelectValue = string | string[] | null | undefined
export type SimpleStringList = string[]
export type MultipleTextFieldList = string[]
export type MapCoordinateSelectorFieldValue =
  | { address: string; lat: number; lng: number }
  | undefined
export type KeyAndValueListValue = { key: string; value: string }[]
export type DataFetchingSelectValue = string | string[]
export type DatepickerValue = string | null | undefined
export type DateTimePickerValue = string | null | undefined
export type FileUploadValue = string | string[] | undefined
export type SliderValue = number | undefined
export type FlatpickrTimePickerValue = string | null | undefined
