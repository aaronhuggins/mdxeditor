import React from 'react'
import * as Select from '@radix-ui/react-select'
import { SelectItem, SelectTrigger, SelectContent } from '../SelectPieces'
import type { EditorSystemComponent } from '../../../system/EditorSystemComponent'
import type { EditorLiteSystemComponent } from '../../../system/EditorLiteSystemComponent'

export type HeadingType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
export type BlockType = 'paragraph' | 'code' | 'quote' | HeadingType
export interface BlockTypeSelectProps {
  // value: BlockType | AdmonitionKind | ''
  // onValueChange: (value: BlockType) => void
  useEmitterValues: EditorLiteSystemComponent.UseEmitterValues & EditorSystemComponent.UseEmitterValues
  usePublisher: EditorLiteSystemComponent.UsePublisher & EditorSystemComponent.UsePublisher
}

export const BlockTypeSelect = ({ useEmitterValues, usePublisher }: BlockTypeSelectProps) => {
  const [currentBlockType] = useEmitterValues('currentBlockType')
  const applyBlockType = usePublisher('applyBlockType')
  return (
    <Select.Root value={currentBlockType || ('' as const)} onValueChange={applyBlockType as (value: string) => void}>
      <SelectTrigger title="Select block type" placeholder="Block type" useEmitterValues={useEmitterValues} />
      <SelectContent useEmitterValues={useEmitterValues}>
        <SelectItem value="paragraph">Paragraph</SelectItem>
        <SelectItem value="quote">Quote</SelectItem>
        <Select.Separator />
        <SelectItem value="h1">Heading 1</SelectItem>
        <SelectItem value="h2">Heading 2</SelectItem>
        <SelectItem value="h3">Heading 3</SelectItem>
        <SelectItem value="h4">Heading 4</SelectItem>
        <SelectItem value="h5">Heading 5</SelectItem>
        <SelectItem value="h6">Heading 6</SelectItem>
        <Select.Separator />
        <SelectItem value="note">Note</SelectItem>
        <SelectItem value="tip">Tip</SelectItem>
        <SelectItem value="info">Info</SelectItem>
        <SelectItem value="caution">Caution</SelectItem>
        <SelectItem value="danger">Danger</SelectItem>
      </SelectContent>
    </Select.Root>
  )
}
