import { FileExporter } from './Exporter/FileExporter'
import { Command } from 'commander'

const program = new Command()

program
  .option('-p, --pattern <pattern>', 'Specify the pattern')
  .option('-s, --save-location <saveLocation>', 'Specify the save location')
  .parse(process.argv)

const options = program.opts()

const pattern = options.pattern ?? '../**/*.?(ts|vue)'
const saveLocation = options.saveLocation ?? './translations.json'
const exporter = new FileExporter(pattern)
exporter.saveTranslations(saveLocation)
