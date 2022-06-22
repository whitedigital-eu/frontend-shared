import Tippy from './tippy/Main.vue'
import LoadingIcon from './loading-icon/Main.vue'
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownContent,
  DropdownItem,
  DropdownHeader,
  DropdownFooter,
  DropdownDivider,
} from './dropdown'
import LucideIcons from './lucide'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from './tab'

export default (app) => {
  app.component('Tippy', Tippy)
  app.component('LoadingIcon', LoadingIcon)
  app.component('Dropdown', Dropdown)
  app.component('DropdownToggle', DropdownToggle)
  app.component('DropdownMenu', DropdownMenu)
  app.component('DropdownContent', DropdownContent)
  app.component('DropdownItem', DropdownItem)
  app.component('DropdownHeader', DropdownHeader)
  app.component('DropdownFooter', DropdownFooter)
  app.component('DropdownDivider', DropdownDivider)
  app.component('TabGroup', TabGroup)
  app.component('TabList', TabList)
  app.component('Tab', Tab)
  app.component('TabPanels', TabPanels)
  app.component('TabPanel', TabPanel)

  for (const [key, icon] of Object.entries(LucideIcons)) {
    app.component(key, icon)
  }
}
