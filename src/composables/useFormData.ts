import { computed, onMounted, Ref, ref, UnwrapRef, watch } from 'vue'
import { FormData } from '../types/FormData'

export default function useFormData<
  AnyLocale extends string,
  T extends FormData,
>(
  baseFormData: T,
  formDataPreparationFunction: (formData: T) => Promise<T> = async (
    formData: T,
  ) => formData,
  options?: Partial<{
    setupWatchersFunction?: (formDataRef: Ref<T>) => void
    initialLocale?: AnyLocale
  }>,
) {
  const formData = ref<T | null>(null)

  onMounted(async () => {
    formData.value = (await formDataPreparationFunction(
      baseFormData,
    )) as UnwrapRef<T>
    if (options?.setupWatchersFunction) {
      options.setupWatchersFunction(formData as Ref<T>)
    }
  })

  const activeLocale = ref<AnyLocale | undefined>(options?.initialLocale)

  const firstLocaleWithError = computed(() => {
    if (!formData.value) return
    return Object.values(formData.value).reduce<AnyLocale | null>(
      (foundLocale, field: any) => {
        if (foundLocale || 'value' in field) return foundLocale
        return Object.entries(field).reduce<AnyLocale | null>(
          (localeWithError, [locale, subField]) => {
            if (localeWithError || !(subField as any).errors.length) {
              return localeWithError
            }
            return locale as AnyLocale
          },
          null,
        )
      },
      null,
    )
  })

  watch(firstLocaleWithError, (n) => {
    if (n) activeLocale.value = n as UnwrapRef<AnyLocale>
  })

  return { formData, activeLocale }
}
