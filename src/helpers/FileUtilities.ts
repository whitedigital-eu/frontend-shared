const imageExtensions: string[] = [
  'apng',
  'avif',
  'gif',
  'jpg',
  'jpeg',
  'jfif',
  'pjpeg',
  'pjp',
  'png',
  'svg',
  'webp',
]

const previewSiteUrl = 'https://view.officeapps.live.com/op/view.aspx?src='

//source: https://docs.microsoft.com/en-us/deployoffice/compat/office-file-format-reference
const popularWordFileExtensions = ['doc', 'docm', 'docx', 'dot', 'dotm', 'dotx']
const popularExcelFileExtensions = [
  'csv',
  'dbf',
  'dif',
  'xls',
  'xlsx',
  'xlsb',
  'xlsm',
]
const fileExtensionsToPreview = [
  ...popularWordFileExtensions,
  ...popularExcelFileExtensions,
]

export { imageExtensions, previewSiteUrl, fileExtensionsToPreview }
