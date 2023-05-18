export type MenuItem = {
  name: string | null
  title: string
  icon: string
  subMenu: MenuItem[] | null
}

const menu = [
  {
    title: 'Ievades komponentes',
    icon: 'BriefcaseIcon',
    name: 'input-components',
  },
  {
    title: 'Tabula',
    icon: 'TableIcon',
    name: 'table-component',
  },
]

export { menu }
