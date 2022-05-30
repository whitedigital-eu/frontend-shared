export default class RadioOptions {
  constructor(emptyText: string, positiveText: string, negativeText: string) {
    return [
      { text: emptyText, value: '' },
      { text: positiveText, value: true },
      { text: negativeText, value: false },
    ]
  }
}
