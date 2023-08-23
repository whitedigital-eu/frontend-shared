import 'vue'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $t: (domain: string, text: string, context?: string) => string
  }
}
