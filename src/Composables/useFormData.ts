import { onMounted, ref } from 'vue'

export default function useFormData(
  baseFormData,
  formDataPreparationFunction: any = null,
  setupWatchersFunction: any = null
) {
  const formData = ref<any>(null)

  onMounted(async () => {
    formData.value = formDataPreparationFunction
      ? await formDataPreparationFunction(baseFormData)
      : baseFormData
    if (setupWatchersFunction) {
      setupWatchersFunction(formData)
    }
  })

  return { formData }
}
