import { system } from '../gurx'
import { JsxComponentDescriptor } from '../types/JsxComponentDescriptors'

export const [JsxSystem, JsxSystemType] = system((r) => {
  const jsxComponentDescriptors = r.node<JsxComponentDescriptor[]>([])

  return {
    jsxComponentDescriptors
  }
}, [])
