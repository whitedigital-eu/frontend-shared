import dom from '@left4code/tw-starter/dist/js/dom'
import { nextTick } from 'vue'
import { icons, createIcons } from 'lucide'
import { ColumnDefinition, CellComponent } from 'tabulator-tables'

interface IconSettings {
  wrapperClass?: string
  title: string
  iconName: string
}

const iconWrapperClass = 'mr-3 last:mr-0'

const iconSettings: Record<string, IconSettings> = {
  edit: {
    wrapperClass: iconWrapperClass,
    title: 'Rediģēt',
    iconName: 'check-square',
  },
  delete: {
    wrapperClass: `text-danger ${iconWrapperClass}`,
    title: 'Dzēst',
    iconName: 'trash-2',
  },
  view: {
    wrapperClass: iconWrapperClass,
    title: 'Apskatīt',
    iconName: 'eye',
  },
}

const createIcon = (
  wrapper: HTMLElement,
  clickHandler: () => void,
  settings: IconSettings,
  dataTest: string
) => {
  const element = dom(`
    <a
      class="flex items-center ${settings.wrapperClass ?? ''}"
      title="${settings.title}"
      data-test="${dataTest}"
    >
      <i data-lucide="${
        settings.iconName
      }" style="height: 18px; width: 18px;"></i>
    </a>`)

  dom(element).on('click', async (e: Event) => {
    e.preventDefault()
    clickHandler()
  })

  wrapper.append(element[0])
}

export const renderIcons = () => {
  createIcons({
    icons,
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
    hozAlign: 'right',
    headerHozAlign: 'right',
    formatter(cell: CellComponent) {
      const data = cell.getData()

      const wrapper = dom(
        `<div class="flex lg:justify-start items-center"></div>`
      )

      if (props.movableRows) {
        wrapper.append(
          dom(
            `<i data-lucide="move" class="mr-2" style="height: 18px; width: 18px;"></i>`
          )[0]
        )
      }

      if (props.edit && canUpdateRecordFunc(cell)) {
        createIcon(
          wrapper,
          () => clickHandlers.edit(data),
          iconSettings.edit,
          'table-edit-btn'
        )
      }

      if (props.delete && canUpdateRecordFunc(cell)) {
        createIcon(
          wrapper,
          () => clickHandlers.delete(data),
          iconSettings.delete,
          'table-delete-btn'
        )
      }

      if (props.view) {
        createIcon(
          wrapper,
          () => clickHandlers.view(data),
          iconSettings.view,
          'table-view-btn'
        )
      }

      nextTick(renderIcons)

      return wrapper[0]
    },
  }
}

export default createActionColumn
