import dom from '@left4code/tw-starter/dist/js/dom'
import { nextTick } from 'vue'
import {
  CheckSquare,
  createIcons,
  Eye,
  Move,
  Trash2,
  Globe,
  UserPlus,
} from 'lucide'
import { ColumnDefinition, CellComponent } from 'tabulator-tables'

interface IconSettings {
  wrapperClass?: string
  title: string
  iconName: string
}

const iconSettings: Record<string, IconSettings> = {
  edit: {
    wrapperClass: 'mr-3',
    title: 'Rediģēt',
    iconName: 'check-square',
  },
  delete: {
    wrapperClass: 'text-danger mr-3',
    title: 'Dzēst',
    iconName: 'trash-2',
  },
  view: {
    title: 'Apskatīt',
    iconName: 'eye',
  },
}

const createIcon = (
  wrapper: HTMLElement,
  clickHandler: () => void,
  settings: IconSettings
) => {
  const element = dom(`
    <a
      class="flex items-center ${settings.wrapperClass ?? ''}"
      title="${settings.title}">
      <i data-lucide="${settings.iconName}" class="w-4 h-4 mr-1"></i>
    </a>`)

  dom(element).on('click', async (e: Event) => {
    e.preventDefault()
    clickHandler()
  })

  wrapper.append(element[0])
}

const renderIcons = () => {
  createIcons({
    icons: { Eye, Trash2, CheckSquare, Move, Globe, UserPlus },
    attrs: {
      'stroke-width': 1.5,
    },
    nameAttr: 'data-lucide',
  })
}

const createActionColumn = (
  props: {
    edit: boolean
    delete: boolean
    view: boolean
    movableRows: boolean
  },
  clickHandlers: {
    edit: (resource) => void
    delete: (resource) => void
    view: (resource) => void
  },
  canUpdateRecordFunc = (cell: CellComponent) => true
): ColumnDefinition => {
  return {
    title: 'DARBĪBAS',
    field: 'actions',
    width: 100,
    headerSort: false,
    vertAlign: 'middle',
    hozAlign: 'center',
    headerHozAlign: 'center',
    formatter(cell: CellComponent) {
      const data = cell.getData()

      const wrapper = dom(
        `<div class="flex lg:justify-start items-center"></div>`
      )

      if (props.movableRows) {
        wrapper.append(
          dom(`<i data-lucide="move" class="w-4 h-4 mr-4"></i>`)[0]
        )
      }

      if (props.edit && canUpdateRecordFunc(cell)) {
        createIcon(wrapper, () => clickHandlers.edit(data), iconSettings.edit)
      }

      if (props.delete && canUpdateRecordFunc(cell)) {
        createIcon(
          wrapper,
          () => clickHandlers.delete(data),
          iconSettings.delete
        )
      }

      if (props.view) {
        createIcon(wrapper, () => clickHandlers.view(data), iconSettings.view)
      }

      nextTick(renderIcons)

      return wrapper[0]
    },
  }
}

export default createActionColumn
