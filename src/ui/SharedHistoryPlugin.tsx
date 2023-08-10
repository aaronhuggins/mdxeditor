import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import React from 'react'
import type { EditorLiteSystemComponent } from '../system/EditorLiteSystemComponent'
import type { EditorSystemComponent } from '../system/EditorSystemComponent'

export type SharedHistoryPluginOptions = {
  useEmitterValues: EditorLiteSystemComponent.UseEmitterValues & EditorSystemComponent.UseEmitterValues
}

export const SharedHistoryPlugin = ({ useEmitterValues }: SharedHistoryPluginOptions) => {
  const [historyState] = useEmitterValues('historyState')
  return <HistoryPlugin externalHistoryState={historyState} />
}
