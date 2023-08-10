import { markdown as markdownLanguageSupport } from '@codemirror/lang-markdown'
import type { CodeMirrorRef } from '@codesandbox/sandpack-react/components/CodeEditor/CodeMirror'
import { SandpackProvider, CodeEditor as TheEditorFromSandpack } from '@codesandbox/sandpack-react'
import React from 'react'
import type { EditorSystemComponent } from '../system/EditorSystemComponent'
import type { EditorLiteSystemComponent } from '../system/EditorLiteSystemComponent'

export type SourceEditorPluginOptions = {
  useEmitterValues: EditorLiteSystemComponent.UseEmitterValues & EditorSystemComponent.UseEmitterValues
  usePublisher: EditorLiteSystemComponent.UsePublisher & EditorSystemComponent.UsePublisher
}

export const SourceEditor = ({ useEmitterValues, usePublisher }:SourceEditorPluginOptions) => {
  const [markdown] = useEmitterValues('markdownSourceFromEditor')
  const updateMarkdown = usePublisher('markdownSourceFromEditor')
  const codeMirrorRef = React.useRef<CodeMirrorRef>(null)

  return (
    <div>
      <React.Suspense fallback={null}>
        <SandpackProvider>
          <TheEditorFromSandpack
            showLineNumbers
            additionalLanguages={[{ name: 'markdown', extensions: ['md'], language: markdownLanguageSupport() }]}
            initMode="lazy"
            filePath={`file.md`}
            code={markdown}
            onCodeUpdate={updateMarkdown}
            ref={codeMirrorRef}
          />
        </SandpackProvider>
      </React.Suspense>
    </div>
  )
}
