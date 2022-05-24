import { vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FileUpload from './FileUpload.vue'
import FilePreview from '../FilePreview.vue'

const dropzoneTextForSingleFile = 'Nometiet failu šeit!'
const dropzoneTextForMultipleFiles = 'Nometiet failus šeit!'

vi.mock('../../Axios/createAxiosInstance', () => ({
  baseAxios: {
    get: vi.fn(() => {
      return Promise.resolve({
        data: {
          '@id': '/api/storage/1',
          id: 1,
          contentUrl: 'test-content-url',
          filePath: 'test-file-path',
        },
      })
    }),
    delete: vi.fn(() => {
      return Promise.resolve()
    }),
  },
}))

const createWrapper = (modelValue: string | string[]) => {
  return mount(FileUpload, {
    propsData: { modelValue },
  })
}

const createEmptySingleFileUploadWrapper = () => createWrapper('')
const createEmptyMultipleFileUploadWrapper = () => createWrapper([])
const createPopulatedSingleFileUploadWrapper = () =>
  createWrapper('/api/storage/1')
const createPopulatedMultipleFileUploadWrapper = () =>
  createWrapper(['/api/storage/1', '/api/storage/2', '/api/storage/3'])

describe('FileUpload', () => {
  it('if value is a string, renders dropzone text for single file', async () => {
    const wrapper = await createEmptySingleFileUploadWrapper()

    const dropzoneMessage = wrapper.find('.dz-message')
    expect(dropzoneMessage.text()).toBe(dropzoneTextForSingleFile)
  })
  it('if value is an array, renders dropzone text for multiple files', async () => {
    const wrapper = await createEmptyMultipleFileUploadWrapper()

    const dropzoneMessage = wrapper.find('.dz-message')
    expect(dropzoneMessage.text()).toBe(dropzoneTextForMultipleFiles)
  })
  it('if an initial STRING value is passed, the initial file is rendered', async () => {
    const wrapper = await createPopulatedSingleFileUploadWrapper()
    await new Promise(process.nextTick)

    expect(wrapper.findAllComponents(FilePreview)).toHaveLength(1)
  })
  it('if an initial ARRAY of strings value is passed, the initial files are rendered', async () => {
    const wrapper = await createPopulatedMultipleFileUploadWrapper()
    await new Promise(process.nextTick)
    expect(wrapper.findAllComponents(FilePreview)).toHaveLength(3)
  })
})
