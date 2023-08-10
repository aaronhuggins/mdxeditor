/// <reference types="vite-plugin-svgr/client" />
import * as RadixToolbar from '@radix-ui/react-toolbar'
import { $getNodeByKey } from 'lexical'
import React from 'react'
import { CodeBlockNode, SandpackNode } from '../../nodes'
import { CodeBlockEditorType, SandpackEditorType } from '../../types/ActiveEditorType'
import styles from '../styles.module.css'
import { CodeBlockLanguageSelect } from './CodeBlockLanguageSelect'
import DeleteIcon from '../icons/delete.svg'
import { ToolbarButton, ToolbarSeparator, ViewModeSwitch } from './toolbarComponents'
import type { EditorSystemComponent } from '../../system/EditorSystemComponent'
import type { EditorLiteSystemComponent } from '../../system/EditorLiteSystemComponent'

export type ToolbarPluginOptions = {
  useEmitterValues: EditorLiteSystemComponent.UseEmitterValues & EditorSystemComponent.UseEmitterValues
  usePublisher: EditorLiteSystemComponent.UsePublisher & EditorSystemComponent.UsePublisher
}

export const ToolbarPlugin = ({ useEmitterValues, usePublisher }: ToolbarPluginOptions) => {
  const [activeEditorType, viewMode] = useEmitterValues('activeEditorType', 'viewMode')

  return (
    <RadixToolbar.Root className={styles.toolbarRoot} aria-label="Formatting options">
      {viewMode === 'editor' &&
        (activeEditorType.type === 'lexical' ? (
          <RichTextButtonSet useEmitterValues={useEmitterValues} usePublisher={usePublisher} />
        ) : activeEditorType.type === 'codeblock' ? (
          <CodeBlockButtonSet useEmitterValues={useEmitterValues} usePublisher={usePublisher} />
        ) : (
          <SandpackButtonSet useEmitterValues={useEmitterValues} usePublisher={usePublisher} />
        ))}

      <ToolbarSeparator />
      <ViewModeSwitch useEmitterValues={useEmitterValues} usePublisher={usePublisher} />
    </RadixToolbar.Root>
  )
}

const CodeBlockButtonSet: React.FC<ToolbarPluginOptions> = ({ useEmitterValues }) => {
  const [activeEditor, activeEditorType] = useEmitterValues('activeEditor', 'activeEditorType')
  return (
    <>
      <CodeBlockLanguageSelect />

      <ToolbarButton
        title="Remove code block"
        onClick={() => {
          activeEditor!.update(() => {
            const node = $getNodeByKey((activeEditorType as CodeBlockEditorType).nodeKey) as CodeBlockNode
            node.selectNext()
            node.remove()
          })
        }}
        useEmitterValues={useEmitterValues}
      >
        <DeleteIcon />
      </ToolbarButton>
    </>
  )
}

const SandpackButtonSet: React.FC<ToolbarPluginOptions> = ({ useEmitterValues }) => {
  const [activeEditor, activeEditorType] = useEmitterValues('activeEditor', 'activeEditorType')
  return (
    <>
      <ToolbarButton
        title="Remove live code block"
        onClick={() => {
          activeEditor!.update(() => {
            const node = $getNodeByKey((activeEditorType as SandpackEditorType).nodeKey) as SandpackNode
            node.selectNext()
            node.remove()
          })
        }}
        useEmitterValues={useEmitterValues}
      >
        <DeleteIcon />
      </ToolbarButton>
    </>
  )
}

const RichTextButtonSet: React.FC<ToolbarPluginOptions> = ({ useEmitterValues, usePublisher }) => {
  const [toolbarComponents] = useEmitterValues('toolbarComponents')
  return (
    <>
      {toolbarComponents.map((Component: any, index) => (
        <Component key={index} useEmitterValues={useEmitterValues} usePublisher={usePublisher} />
      ))}
    </>
  )
}
