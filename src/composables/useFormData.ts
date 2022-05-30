import { onMounted, Ref, ref } from 'vue'
import { FormData } from '../types/FormData'

export default function useFormData(
  baseFormData: FormData,
  formDataPreparationFunction: (
    formData: FormData
  ) => Promise<FormData> = async (formData: FormData) => formData,
  setupWatchersFunction?: (formDataRef: Ref<FormData>) => void
) {
  const formData = ref<FormData | null>(null)

  onMounted(async () => {
    formData.value = await formDataPreparationFunction(baseFormData)
    if (setupWatchersFunction) setupWatchersFunction(formData as Ref<FormData>)
  })

  return { formData }
}
