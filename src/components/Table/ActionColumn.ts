//@ts-ignore
import dom from '@left4code/tw-starter/dist/js/dom'
import { nextTick } from 'vue'
import { icons, createIcons } from 'lucide'
import { COLLAPSE_ORDER } from './Column'
import { Resource } from '../../types/Resource'

interface IconSettings {
  wrapperClass?: string
  title: string
  iconName: string
}

const iconWrapperClass = 'wd-table-btn mr-3 last:mr-0'

const iconSettings: Record<string, IconSettings> = {
  edit: {
    wrapperClass: `${iconWrapperClass} wd-table-btn-edit`,
    title: 'Rediģēt',
    iconName: 'check-square',
  },
  delete: {
    wrapperClass: `text-danger ${iconWrapperClass} wd-table-btn-delete`,
    title: 'Dzēst',
    iconName: 'trash-2',
  },
  view: {
    wrapperClass: `${iconWrapperClass} wd-table-btn-view`,
    title: 'Apskatīt',
    iconName: 'eye',
  },
}

// either object of settings, or function that renders the action icon
export type CustomAction =
  | {
      shouldShow: (data: any) => boolean
      clickHandler: (data: any) => void
      settings: IconSettings
      dataTest?: string
    }
  | ((data: any) => HTMLElement | null)

export const ACTION_ICON_SIZE = 18
export const ACTION_ICON_MR = 12
export const ACTION_ICON_TOTAL_WIDTH = ACTION_ICON_SIZE + ACTION_ICON_MR
export const ACTION_COLUMN_MIN_WIDTH = 90

const createIcon = (
  wrapper: HTMLElement,
  clickHandler: () => void,
  settings: IconSettings,
  dataTest = ''
) => {
  const element = dom(`
    <a
      class="flex items-center ${settings.wrapperClass ?? ''}"
      title="${settings.title}"
      data-test="${dataTest}"
    >
      <i data-lucide="${
        settings.iconName
      }" style="height: ${ACTION_ICON_SIZE}px; width: ${ACTION_ICON_SIZE}px;"></i>
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
    attrs: { 'stroke-width': 1.5 },
    nameAttr: 'data-lucide',
  })
}

type TableProps = {
  edit: boolean
  delete: boolean
  view: boolean
  movableRows: boolean
  canUpdateRecordFunc: (cell: Tabulator.CellComponent) => boolean
  customActions?: CustomAction[]
}

const computeActionColumnWidth = (props: TableProps) => {
  let res = 10
  if (props.edit) res += ACTION_ICON_TOTAL_WIDTH
  if (props.delete) res += ACTION_ICON_TOTAL_WIDTH
  if (props.view) res += ACTION_ICON_TOTAL_WIDTH
  if (props.customActions) {
    res += props.customActions.length * ACTION_ICON_TOTAL_WIDTH
  }
  return res > ACTION_COLUMN_MIN_WIDTH ? res : ACTION_COLUMN_MIN_WIDTH
}

const createActionColumn = (
  props: TableProps,
  clickHandlers: {
    edit: <R extends Resource<string, string>>(resource: R) => void
    delete: <R extends Resource<string, string>>(resource: R) => void
    view: <R extends Resource<string, string>>(resource: R) => void
  }
): Tabulator.ColumnDefinition => {
  return {
    title: 'DARBĪBAS',
    field: 'actions',
    width: computeActionColumnWidth(props),
    headerSort: false,
    vertAlign: 'middle',
    hozAlign: 'right',
    headerHozAlign: 'right',
    responsive: COLLAPSE_ORDER.never,
    formatter(cell: Tabulator.CellComponent) {
      const data = cell.getData() as Resource<string, string>

      const wrapper = dom(
        `<div class="flex lg:justify-start items-center"></div>`
      )

      if (props.movableRows) {
        wrapper.append(
          dom(
            `<i data-lucide="move" class="mr-2" style="height: ${ACTION_ICON_SIZE}px; width: ${ACTION_ICON_SIZE}px;"></i>`
          )[0]
        )
      }

      if (props.edit && props.canUpdateRecordFunc(cell)) {
        createIcon(
          wrapper,
          () => clickHandlers.edit(data),
          iconSettings.edit,
          'table-edit-btn'
        )
      }

      if (props.delete && props.canUpdateRecordFunc(cell)) {
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

      if (props.customActions) {
        props.customActions.forEach((a) => {
          if (typeof a === 'function') {
            const actionIcon = a(data)
            if (actionIcon) wrapper.append(actionIcon)
          } else {
            if (a.shouldShow(data)) {
              createIcon(
                wrapper,
                () => a.clickHandler(data),
                a.settings,
                a.dataTest
              )
            }
          }
        })
      }

      nextTick(renderIcons)

      return wrapper[0]
    },
  }
}

export default createActionColumn
