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

  getTranslateKeys(
    content: string
  ): ({ domain: string; context: string; text: string } | null)[] {
    const translateRegex =
      /\bt\([']([^']+)[']\s*,\s*[']([^']+)[']?(?:\s*,\s*[']([^']+)['])?\)/g
    const matches = content.match(translateRegex)

    if (!matches) {
      return []
    }

    const list = matches.map((match) => {
      const keyRegex =
        /\bt\([']([^']+)[']\s*,\s*[']([^']+)[']?(?:\s*,\s*[']([^']+)['])?\)/
      const keyMatch = keyRegex.exec(match)
      if (keyMatch && keyMatch[1] && keyMatch[2]) {
        if (
          !this.validateTranslate(keyMatch[1]) ||
          !this.validateTranslate(keyMatch[2])
        ) {
          throw new ValidationError(
            `\x1b[41mTranslation key validation failed '${keyMatch[0]}' @ ${this.fileName}\x1b[0m`
          )
        }

        return {
          domain: keyMatch[1],
          text: keyMatch[2],
          context: keyMatch[3] ?? '',
        }
      }
      return null
    })

    return list
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
