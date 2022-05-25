import { IriString } from '../Types/Resource'
import { AxiosInstance } from 'axios'

const getLoadResourceFunctions = (axiosInstance: AxiosInstance) => {
  const loadResource = async <ResourceType>(
    resource: IriString<string, string> | ResourceType
  ): Promise<ResourceType> => {
    if (!resource) throw new Error('Resource must be truthy!')

    if (typeof resource !== 'string') return resource as ResourceType
    return (await axiosInstance.get(resource)).data
  }
  const loadAllResources = async <ResourceType>(
    resourceSources: string[] | ResourceType[]
  ): Promise<ResourceType[]> => {
    if (!resourceSources || !resourceSources.length) return []

    // assumption - if first element in array is a string, it is an array of IRI strings
    const isIriArray = typeof resourceSources[0] === 'string'

    if (!isIriArray) return resourceSources as ResourceType[]

    const promises: Promise<any>[] = []
    ;(resourceSources as string[]).forEach((resourceIri: string) =>
      promises.push(axiosInstance.get(resourceIri))
    )
    const responses: { data: ResourceType }[] = await Promise.all(promises)
    return responses.map((res: { data: ResourceType }) => res.data)
  }

  return { loadResource, loadAllResources }
}

export default getLoadResourceFunctions
