import { onMounted, Ref, ref, UnwrapRef } from 'vue'
import { FormData } from '../types/FormData'

export default function useFormData<T extends FormData>(
  baseFormData: T,
  formDataPreparationFunction: (formData: T) => Promise<T> = async (
    formData: T,
  ) => formData,
  setupWatchersFunction?: (formDataRef: Ref<T>) => void,
) {
  const formData = ref<T | null>(null)

  onMounted(async () => {
    formData.value = (await formDataPreparationFunction(
      baseFormData,
    )) as UnwrapRef<T>
    if (setupWatchersFunction) setupWatchersFunction(formData as Ref<T>)
  })

  return { formData }
}
