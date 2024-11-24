import { CheckSquare, Trash2, Eye, createElement, Move } from 'lucide'
import { COLLAPSE_ORDER } from './Column'
import { TableProps } from './createTableConfig'
import { capitalizeFirstLetter } from '../../helpers/Global'

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

const getIconSettings = (t: (key: string) => string) =>
  ({
    edit: {
      wrapperClasses: [...iconWrapperClasses, 'wd-table-btn-edit'],
      title: capitalizeFirstLetter(t('project.edit')),
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
      title: capitalizeFirstLetter(t('project.delete')),
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
      title: capitalizeFirstLetter(t('project.view')),
      createIcon: () => {
        const icon = createElement(Eye)
        icon.setAttribute('stroke-width', (1.5).toString())
        icon.style.height = `${ACTION_ICON_SIZE}px`
        icon.style.width = `${ACTION_ICON_SIZE}px`
        return icon
      },
    },
  }) satisfies Record<string, IconSettings>

/** either object of settings, or function that renders the action icon */
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

const createActionColumn = <ResourceInstance extends Record<string, unknown>>(
  props: RemoveUndefined<TableProps>,
  clickHandlers: {
    edit: (resource: ResourceInstance) => void
    delete: (resource: ResourceInstance) => void
    view: (resource: ResourceInstance) => void
  },
  t: (key: string) => string,
): Tabulator.ColumnDefinition => ({
  title: t('project.actions').toUpperCase(),
  field: 'actions',
  width: computeActionColumnWidth(props),
  headerSort: false,
  vertAlign: 'middle',
  hozAlign: 'right',
  headerHozAlign: 'right',
  responsive: COLLAPSE_ORDER.never,
  formatter(cell: Tabulator.CellComponent) {
    const data = cell.getData() as ResourceInstance
    const iconSettings = getIconSettings(t)

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
})

export default createActionColumn
