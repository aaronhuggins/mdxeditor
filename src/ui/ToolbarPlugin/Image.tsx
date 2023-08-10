import * as Dialog from '@radix-ui/react-dialog'
import * as RadixToolbar from '@radix-ui/react-toolbar'
import type { EditorSystemComponent } from '../../system/EditorSystemComponent'
import type { EditorLiteSystemComponent } from '../../system/EditorLiteSystemComponent'

import React from 'react'

import classNames from 'classnames'
import { useCombobox } from 'downshift'
import AddPhotoIcon from '../icons/add_photo.svg'
import DropDownIcon from '../icons/arrow_drop_down.svg'
import CheckIcon from '../icons/check.svg'
import CloseIcon from '../icons/close.svg'
import styles from '../styles.module.css'
import { InstantTooltip } from './InstantTooltip'
import { DialogButton } from './DialogButton'

export type ImageButtonOptions = {
  useEmitterValues: EditorLiteSystemComponent.UseEmitterValues & EditorSystemComponent.UseEmitterValues
  usePublisher: EditorLiteSystemComponent.UsePublisher & EditorSystemComponent.UsePublisher
}

export const ImageButton = React.forwardRef<HTMLButtonElement, ImageButtonOptions>(({ useEmitterValues, usePublisher }, forwardedRef) => {
  const [imageAutocompleteSuggestions] = useEmitterValues('imageAutocompleteSuggestions')
  const insertImage = usePublisher('insertImage')

  return (
    <DialogButton
      ref={forwardedRef}
      submitButtonTitle="Insert Image"
      dialogInputPlaceholder="Paste or select image URL"
      tooltipTitle="Insert image"
      onSubmit={insertImage}
      buttonContent={<AddPhotoIcon />}
      autocompleteSuggestions={imageAutocompleteSuggestions}
      useEmitterValues={useEmitterValues}
    />
  )
})

type OldImageButtonProps = RadixToolbar.ToolbarButtonProps & {
  useEmitterValues: ImageButtonOptions['useEmitterValues']
  usePublisher: ImageButtonOptions['usePublisher']
}

export const OldImageButton = React.forwardRef<HTMLButtonElement, OldImageButtonProps>((props, forwardedRef) => {
  const { useEmitterValues, usePublisher } = props
  const [editorRootElementRef, imageAutocompleteSuggestions] = useEmitterValues('editorRootElementRef', 'imageAutocompleteSuggestions')
  const [open, setOpen] = React.useState(false)
  const insertImage = usePublisher('insertImage')

  const onSubmit = React.useCallback(
    (url: string) => {
      insertImage(url)
      setOpen(false)
    },
    [insertImage]
  )

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <RadixToolbar.Button className={styles.toolbarButton} {...props} ref={forwardedRef}>
          <InstantTooltip title="Insert image" useEmitterValues={useEmitterValues}>
            <AddPhotoIcon />
          </InstantTooltip>
        </RadixToolbar.Button>
      </Dialog.Trigger>
      <Dialog.Portal container={editorRootElementRef!.current}>
        <Dialog.Overlay className={styles.dialogOverlay} />
        <Dialog.Content className={styles.dialogContent}>
          <ImageForm initialUrl="" onSubmit={onSubmit} imageAutocompleteSuggestions={imageAutocompleteSuggestions} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
})

interface ImageFormProps {
  initialUrl: string
  onSubmit: (url: string) => void
  imageAutocompleteSuggestions: string[]
}

const MAX_SUGGESTIONS = 20

const ImageForm: React.FC<ImageFormProps> = ({ initialUrl, onSubmit, imageAutocompleteSuggestions }) => {
  const [items, setItems] = React.useState(imageAutocompleteSuggestions.slice(0, MAX_SUGGESTIONS))

  const { isOpen, getToggleButtonProps, getMenuProps, getInputProps, highlightedIndex, getItemProps, selectedItem } = useCombobox({
    initialInputValue: initialUrl,
    onInputValueChange({ inputValue }) {
      inputValue = inputValue?.toLowerCase() || ''
      const matchingItems = []
      for (const url of imageAutocompleteSuggestions) {
        if (url.toLowerCase().includes(inputValue)) {
          matchingItems.push(url)
          if (matchingItems.length >= MAX_SUGGESTIONS) {
            break
          }
        }
      }
      setItems(matchingItems)
    },
    items,
    itemToString(item) {
      return item ?? ''
    }
  })

  const onSubmitEH = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(selectedItem || '')
  }

  const onKeyDownEH = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        ;(e.target as HTMLInputElement).form?.reset()
      } else if (e.key === 'Enter' && (!isOpen || items.length === 0)) {
        e.preventDefault()
        onSubmit((e.target as HTMLInputElement).value)
      }
    },
    [isOpen, items, onSubmit]
  )

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const downshiftInputProps = getInputProps()

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const inputProps = {
    ...downshiftInputProps,
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDownEH(e)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      downshiftInputProps.onKeyDown(e)
    }
  }

  const dropdownIsVisible = isOpen && items.length > 0

  return (
    <form onSubmit={onSubmitEH} className={classNames(styles.linkDialogEditForm)}>
      <div className={styles.linkDialogInputContainer}>
        <div data-visible-dropdown={dropdownIsVisible} className={styles.linkDialogInputWrapper}>
          <input
            placeholder="Paste or select an image url"
            className={styles.linkDialogInput}
            {...inputProps}
            autoFocus
            size={30}
            data-editor-dialog={true}
          />
          <button aria-label="toggle menu" type="button" {...getToggleButtonProps()}>
            <DropDownIcon />
          </button>
        </div>

        <div className={styles.linkDialogAutocompleteContainer}>
          <ul {...getMenuProps()} data-visible={dropdownIsVisible}>
            {items.map((item, index: number) => (
              <li
                data-selected={selectedItem === item}
                data-highlighted={highlightedIndex === index}
                key={`${item}${index}`}
                {...getItemProps({ item, index })}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ActionButton type="submit" title="Insert image" aria-label="Insert image" className={styles.primaryActionButton}>
        <CheckIcon />
      </ActionButton>

      <Dialog.Close className={styles.actionButton}>
        <CloseIcon />
      </Dialog.Close>
    </form>
  )
}

const ActionButton = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<'button'>>(({ className, ...props }, ref) => {
  return <button className={classNames(styles.actionButton, className)} ref={ref} {...props} />
})
