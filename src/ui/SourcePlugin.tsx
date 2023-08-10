/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react'
import { Diff, Hunk, parseDiff } from 'react-diff-view'
import { diffLines, formatLines } from 'unidiff'
import type { EditorSystemComponent } from '../system/EditorSystemComponent'
import type { EditorLiteSystemComponent } from '../system/EditorLiteSystemComponent'

import 'react-diff-view/style/index.css'

const SourceEditor = React.lazy(() => import('./SourceEditor').then((module) => ({ default: module.SourceEditor })))

export function DiffViewer({ oldText, newText }: { oldText: string; newText: string }) {
  const diffText = formatLines(diffLines(oldText, newText), { context: 3 })
  if (diffText.trim() === '') return <div>No changes</div>
  const [diff] = parseDiff(diffText, { nearbySequences: 'zip' })

  return (
    <Diff viewType="split" diffType="modify" hunks={diff.hunks || []}>
      {(hunks) => hunks.map((hunk) => <Hunk key={hunk.content} hunk={hunk} />)}
    </Diff>
  )
}

export type MarkdownDiffViewOptions = {
  useEmitterValues: EditorLiteSystemComponent.UseEmitterValues & EditorSystemComponent.UseEmitterValues
}

export function MarkdownDiffView({ useEmitterValues }: MarkdownDiffViewOptions) {
  const [markdown, headMarkdown] = useEmitterValues('markdownSource', 'headMarkdown')
  return <DiffViewer oldText={headMarkdown} newText={markdown} />
}

export interface ViewModeProps {
  children: React.ReactNode
  useEmitterValues: EditorLiteSystemComponent.UseEmitterValues & EditorSystemComponent.UseEmitterValues
  usePublisher: EditorLiteSystemComponent.UsePublisher & EditorSystemComponent.UsePublisher
}

export const ViewModeToggler: React.FC<ViewModeProps> = ({ children, useEmitterValues, usePublisher }) => {
  const [viewMode] = useEmitterValues('viewMode')
  // keep the RTE always mounted, otherwise the state is lost
  return (
    <div>
      <div style={{ display: viewMode === 'editor' ? 'block' : 'none' }}>{children}</div>
      {viewMode === 'diff' ? <MarkdownDiffView useEmitterValues={useEmitterValues} /> : null}
      {viewMode === 'markdown' ? (
        <React.Suspense fallback={null}>
          <SourceEditor useEmitterValues={useEmitterValues} usePublisher={usePublisher} />
        </React.Suspense>
      ) : null}
    </div>
  )
}
