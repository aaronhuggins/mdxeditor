import { getRealmFactory, realmFactoryToComponent } from '../gurx'
import React from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { EditorSystem } from './Editor'
import { ViewModeSystem } from './ViewMode'
import { SandpackSystem } from './Sandpack'
import { LinkDialogSystem } from './LinkDialog'
import { JsxSystem } from './Jsx'
import { OnChangeSystem } from './OnChange'
import { ToolbarSystem } from './Toolbar'
import 'mdast-util-directive'

export declare namespace EditorSystemComponent {
  export type UsePublisher = typeof usePublisher;
  export type UseEmitterValues = typeof useEmitterValues;
}

export const {
  Component: EditorSystemComponent,
  usePublisher,
  useEmitterValues
} = realmFactoryToComponent(
  getRealmFactory(EditorSystem, ViewModeSystem, SandpackSystem, LinkDialogSystem, JsxSystem, OnChangeSystem, ToolbarSystem),
  {
    required: {
      markdownSource: 'markdownSource',
      headMarkdown: 'headMarkdown',
      jsxComponentDescriptors: 'jsxComponentDescriptors',
      sandpackConfig: 'sandpackConfig',
      toolbarComponents: 'toolbarComponents',
      markdownParseOptions: 'markdownParseOptions',
      lexicalConvertOptions: 'lexicalConvertOptions',
      lexicalNodes: 'lexicalNodes'
    },
    optional: {
      imageUploadHandler: 'imageUploadHandler',
      editorRootElementRef: 'editorRootElementRef',
      viewMode: 'viewMode',
      linkAutocompleteSuggestions: 'linkAutocompleteSuggestions',
      imageAutocompleteSuggestions: 'imageAutocompleteSuggestions',
      codeBlockLanguages: 'codeBlockLanguages',
      customLeafDirectiveEditors: 'customLeafDirectiveEditors'
    },
    events: {
      onChange: 'onChange'
    }
  },
  ({ children }: React.PropsWithChildren) => {
    return (
      <div>
        <CaptureLexicalEditor />
        {children}
      </div>
    )
  }
)

const CaptureLexicalEditor: React.FC = () => {
  const setEditor = usePublisher('editor')
  const [lexicalEditor] = useLexicalComposerContext()
  React.useEffect(() => setEditor(lexicalEditor), [lexicalEditor, setEditor])
  return null
}
