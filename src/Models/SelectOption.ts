export class SelectOption {
  constructor(public text: string, public value: string) {}
}

export class IconSelectOption extends SelectOption {
  constructor(text: string, value: string, public icon: string) {
    super(text, value)
  }
}
