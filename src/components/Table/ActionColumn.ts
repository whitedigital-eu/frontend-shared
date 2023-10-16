import { CheckSquare, Trash2, Eye, createElement, Move } from 'lucide'
import { COLLAPSE_ORDER } from './Column'
import { Resource } from '../../types/Resource'
import { TableProps } from './createTableConfig'

type RemoveUndefined<T> = { [K in keyof T]-?: Exclude<T[K], undefined> }

type IconSettings = {
  /** array of classes to be added to the wrapper element (a) */
  wrapperClasses?: string[]
  /** element title */
  title: string
  /** function that creates and returns icon as svg element */
  createIcon: () => SVGElement
}

const iconWrapperClasses = ['wd-table-btn', 'mr-3', 'last:mr-0']

export const ACTION_ICON_SIZE = 18
export const ACTION_ICON_MR = 12
export const ACTION_ICON_TOTAL_WIDTH = ACTION_ICON_SIZE + ACTION_ICON_MR
export const ACTION_COLUMN_MIN_WIDTH = 90

const iconSettings: Record<string, IconSettings> = {
  edit: {
    wrapperClasses: [...iconWrapperClasses, 'wd-table-btn-edit'],
    title: 'Rediģēt',
    createIcon: () => {
      const icon = createElement(CheckSquare)
      icon.setAttribute('stroke-width', (1.5).toString())
      icon.style.height = `${ACTION_ICON_SIZE}px`
      icon.style.width = `${ACTION_ICON_SIZE}px`
      return icon
    },
  },
  delete: {
    wrapperClasses: [
      ...iconWrapperClasses,
      'text-danger',
      'wd-table-btn-delete',
    ],
    title: 'Dzēst',
    createIcon: () => {
      const icon = createElement(Trash2)
      icon.setAttribute('stroke-width', (1.5).toString())
      icon.style.height = `${ACTION_ICON_SIZE}px`
      icon.style.width = `${ACTION_ICON_SIZE}px`
      return icon
    },
  },
  view: {
    wrapperClasses: [...iconWrapperClasses, 'wd-table-btn-view'],
    title: 'Apskatīt',
    createIcon: () => {
      const icon = createElement(Eye)
      icon.setAttribute('stroke-width', (1.5).toString())
      icon.style.height = `${ACTION_ICON_SIZE}px`
      icon.style.width = `${ACTION_ICON_SIZE}px`
      return icon
    },
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

const createIconButton = (
  clickHandler: () => void,
  settings: IconSettings,
  dataTest = '',
) => {
  const element = document.createElement('a')
  element.classList.add('flex', 'items-center')
  element.classList.add(...(settings.wrapperClasses ?? []))
  element.title = settings.title
  element.dataset.test = dataTest

  element.appendChild(settings.createIcon())

  element.addEventListener('click', function (e) {
    e.preventDefault()
    clickHandler()
  })

  return element
}

const computeActionColumnWidth = (props: TableProps) => {
  let res = 10
  if (props.edit) res += ACTION_ICON_TOTAL_WIDTH
  if (props.delete) res += ACTION_ICON_TOTAL_WIDTH
  if (props.view) res += ACTION_ICON_TOTAL_WIDTH
  if (props.movableRows) res += ACTION_ICON_TOTAL_WIDTH
  if (props.customActions) {
    res += props.customActions.length * ACTION_ICON_TOTAL_WIDTH
  }
  return res > ACTION_COLUMN_MIN_WIDTH ? res : ACTION_COLUMN_MIN_WIDTH
}

const createActionColumn = (
  props: RemoveUndefined<TableProps>,
  clickHandlers: {
    edit: <R extends Resource<string, string>>(resource: R) => void
    delete: <R extends Resource<string, string>>(resource: R) => void
    view: <R extends Resource<string, string>>(resource: R) => void
  },
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

      const wrapper = document.createElement('div')
      wrapper.classList.add('flex', 'lg:justify-start', 'items-center')

      if (props.movableRows) {
        const moveIcon = createElement(Move)
        moveIcon.setAttribute('stroke-width', (1.5).toString())
        moveIcon.style.height = `${ACTION_ICON_SIZE}px`
        moveIcon.style.width = `${ACTION_ICON_SIZE}px`
        moveIcon.classList.add('mr-2')
        wrapper.appendChild(moveIcon)
      }

      if (props.edit && props.canUpdateRecordFunc(cell)) {
        wrapper.appendChild(
          createIconButton(
            () => clickHandlers.edit(data),
            iconSettings.edit,
            'table-edit-btn',
          ),
        )
      }

      if (props.delete && props.canUpdateRecordFunc(cell)) {
        wrapper.appendChild(
          createIconButton(
            () => clickHandlers.delete(data),
            iconSettings.delete,
            'table-delete-btn',
          ),
        )
      }

      if (props.view) {
        wrapper.appendChild(
          createIconButton(
            () => clickHandlers.view(data),
            iconSettings.view,
            'table-view-btn',
          ),
        )
      }

      if (props.customActions) {
        props.customActions.forEach((a) => {
          if (typeof a === 'function') {
            const actionIcon = a(data)
            if (actionIcon) wrapper.append(actionIcon)
          } else {
            if (a.shouldShow(data)) {
              wrapper.appendChild(
                createIconButton(
                  () => a.clickHandler(data),
                  a.settings,
                  a.dataTest,
                ),
              )
            }
          }
        })
      }

      return wrapper
    },
  }
}

export default createActionColumn
