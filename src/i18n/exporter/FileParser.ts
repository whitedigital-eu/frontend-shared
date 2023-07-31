import fs from 'fs'

export class FileParser {
  private readonly fileName: string
  constructor(fileName: string) {
    this.fileName = fileName
  }

  validateTranslate(text: string) {
    const pattern = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*$/
    return pattern.test(text)
  }

  getFileContent() {
    return fs.readFileSync(this.fileName, 'utf8')
  }

  getTranslateKeys(content: string): string[] {
    const translateRegex = /\bt\(['"]([^'"]+)['"]/g
    const matches = content.match(translateRegex)

    if (!matches) {
      return []
    }

    return matches.map((match) => {
      const keyRegex = /\bt\(['"]([^'"]+)['"]/
      const keyMatch = keyRegex.exec(match)
      if (keyMatch && keyMatch[1]) {
        if (!this.validateTranslate(keyMatch[1])) {
          throw new ValidationError(
            `\x1b[41mTranslation key validation failed '${keyMatch[1]}' @ ${this.fileName}\x1b[0m`
          )
        }
        return keyMatch[1]
      }
      return ''
    })
  }

  /**
   * returns array with key list
   * @return string[]
   */
  parseFile() {
    return this.getTranslateKeys(this.getFileContent())
  }
}

class ValidationError extends Error {}
