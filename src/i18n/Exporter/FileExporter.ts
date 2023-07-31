import { Glob } from 'glob'
import { FileParser } from './FileParser'
import { hashText } from '../translation'
import fs from 'fs'

export class FileExporter {
  private readonly pattern: string
  private keyList: {
    [key: string]: { domain: string; text: string; context: string }
  } = {}
  constructor(pattern: string) {
    this.pattern = pattern
  }

  private exportKeys() {
    const g3 = new Glob(this.pattern, { withFileTypes: true })
    g3.walkSync().forEach((path: any) => {
      const fileParser = new FileParser(path.fullpath())
      fileParser.parseFile().forEach((tr) => {
        if (tr != null) {
          const hash = hashText(tr.domain, tr.text, tr.context)
          this.keyList[hash] = tr
        }
      })
    })

    return this.keyList
  }

  saveTranslations(file: string) {
    const jsonString = JSON.stringify(this.exportKeys(), null, 2)

    fs.writeFile(file, jsonString, (err) => {
      if (err) {
        console.error('Error saving JSON object to file:', err)
        return
      }

      console.log('Translations exported:', file)
    })
  }

  private keyToTitle(item: string) {
    const title = item.split('.').pop()
    const result = title?.replace(/([A-Z])/g, ' $1') ?? ''
    return result.charAt(0).toUpperCase() + result.slice(1)
  }
}
