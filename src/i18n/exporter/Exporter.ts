import fs from 'fs'
import { Glob } from 'glob'
import { FileParser } from './FileParser'
import { NestedJSON } from '../../Types/NestedJSON'

export class Exporter {
  private readonly pattern: string
  private keyList: string[] = []
  constructor(pattern: string) {
    this.pattern = pattern
  }

  private exportKeys() {
    const g3 = new Glob(this.pattern, { withFileTypes: true })
    g3.walkSync().forEach((path: any) => {
      const fileParser = new FileParser(path.fullpath())
      this.keyList.push(...fileParser.parseFile())
    })

    return this.keyList
  }

  convertArrayToObject(arr: string[]): object {
    const result: NestedJSON = {}

    for (const item of arr) {
      const keys = item.split('.')
      let obj: NestedJSON | string = result

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        obj[key] = obj[key] || {}
        obj = obj[key] as NestedJSON
      }

      const lastKey = keys[keys.length - 1]
      obj[lastKey] = this.keyToTitle(item)
    }

    return result
  }

  saveTranslations(file: string) {
    const jsonString = JSON.stringify(
      this.convertArrayToObject(this.exportKeys()),
      null,
      2
    )

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
