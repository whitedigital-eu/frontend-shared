export type Nullable<T> = { [K in keyof T]: T[K] | null }
export type NullableOptional<T> = { [K in keyof T]?: T[K] | null }

export type NotNullableRequired<T> = { [K in keyof T]-?: NonNullable<T[K]> }
export type NotNullableOptional<T> = { [K in keyof T]?: NonNullable<T[K]> }

export type Modify<T, R> = Omit<T, keyof R> & R
