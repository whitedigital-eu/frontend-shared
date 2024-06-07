import { IriString } from '../types/Resource'
import { AxiosInstance, AxiosRequestConfig } from 'axios'

const getLoadResourceFunctions = (axiosInstance: AxiosInstance) => {
  const loadResource = async <ResourceType>(
    resource: IriString<string, string> | ResourceType,
    config?: AxiosRequestConfig,
  ): Promise<ResourceType> => {
    if (!resource) throw new Error('Resource must be truthy!')

    if (typeof resource !== 'string') return resource as ResourceType
    return (await axiosInstance.get(resource, config)).data
  }
  const loadAllResources = async <ResourceType>(
    resourceSources: string[] | ResourceType[],
    config?: AxiosRequestConfig,
  ): Promise<ResourceType[]> => {
    if (!resourceSources || !resourceSources.length) return []

    // assumption - if first element in array is a string, it is an array of IRI strings
    const isIriArray = typeof resourceSources[0] === 'string'

    if (!isIriArray) return resourceSources as ResourceType[]

    const promises: Promise<{ data: ResourceType }>[] = []
    ;(resourceSources as string[]).forEach((resourceIri: string) =>
      promises.push(axiosInstance.get(resourceIri, config)),
    )
    const responses = await Promise.all(promises)
    return responses.map((res: { data: ResourceType }) => res.data)
  }

  const loadResourceList = async <ResourceType>(
    resource: IriString<string, string>,
    config?: AxiosRequestConfig,
  ): Promise<ResourceType[]> => {
    if (!resource) throw new Error('Resource must be truthy!')
    return (await axiosInstance.get(resource, config)).data['hydra:member']
  }

  return { loadResource, loadAllResources, loadResourceList }
}

export default getLoadResourceFunctions
