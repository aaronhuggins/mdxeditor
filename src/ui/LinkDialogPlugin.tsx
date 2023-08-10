/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as Popover from '@radix-ui/react-popover'
import * as Tooltip from '@radix-ui/react-tooltip'
import React from 'react'

import { createCommand, LexicalCommand } from 'lexical'
import CheckIcon from './icons/check.svg'
import CloseIcon from './icons/close.svg'
import CopyIcon from './icons/content_copy.svg'
import EditIcon from './icons/edit.svg'
import LinkOffIcon from './icons/link_off.svg'
import OpenInNewIcon from './icons/open_in_new.svg'
import DropDownIcon from './icons/arrow_drop_down.svg'
import classNames from 'classnames'
import { useCombobox } from 'downshift'
import type { EditorSystemComponent } from '../system/EditorSystemComponent'
import type { EditorLiteSystemComponent } from '../system/EditorLiteSystemComponent'
import styles from './styles.module.css'

export type LinkDialogPluginOptions = {
  useEmitterValues: EditorLiteSystemComponent.UseEmitterValues & EditorSystemComponent.UseEmitterValues
  usePublisher: EditorLiteSystemComponent.UsePublisher & EditorSystemComponent.UsePublisher
}

export const OPEN_LINK_DIALOG: LexicalCommand<undefined> = createCommand()

interface LinkEditFormProps {
  initialUrl: string
  onSubmit: (url: string) => void
  onCancel: () => void
  linkAutocompleteSuggestions: string[]
}

const MAX_SUGGESTIONS = 20

export function LinkEditForm({ initialUrl, onSubmit, onCancel, linkAutocompleteSuggestions }: LinkEditFormProps) {
  const [items, setItems] = React.useState(linkAutocompleteSuggestions.slice(0, MAX_SUGGESTIONS))

  const { isOpen, getToggleButtonProps, getMenuProps, getInputProps, highlightedIndex, getItemProps, selectedItem } = useCombobox({
    initialInputValue: initialUrl,
    onInputValueChange({ inputValue }) {
      inputValue = inputValue?.toLowerCase() || ''
      const matchingItems = []
      for (const url of linkAutocompleteSuggestions) {
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

  const downshiftInputProps = getInputProps()

  const inputProps = {
    ...downshiftInputProps,
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDownEH(e)
      downshiftInputProps.onKeyDown(e)
    }
  }

  const dropdownIsVisible = isOpen && items.length > 0

  return (
    <form onSubmit={onSubmitEH} onReset={onCancel} className={classNames(styles.linkDialogEditForm)}>
      <div className={styles.linkDialogInputContainer}>
        <div data-visible-dropdown={dropdownIsVisible} className={styles.linkDialogInputWrapper}>
          <input className={styles.linkDialogInput} {...inputProps} autoFocus size={30} data-editor-dialog={true} />
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

      <ActionButton type="submit" title="Set URL" aria-label="Set URL">
        <CheckIcon />
      </ActionButton>

      <ActionButton type="reset" title="Cancel change" aria-label="Cancel change">
        <CloseIcon />
      </ActionButton>
    </form>
  )
}

export function LinkDialogPlugin({ useEmitterValues, usePublisher }: LinkDialogPluginOptions) {
  const [editorRootElementRef] = useEmitterValues('editorRootElementRef')
  const publishWindowChange = usePublisher('onWindowChange')
  const [linkDialogState, linkAutocompleteSuggestions, activeEditor] = useEmitterValues(
    'linkDialogState',
    'linkAutocompleteSuggestions',
    'activeEditor'
  )
  const updateLinkUrl = usePublisher('updateLinkUrl')
  const cancelLinkEdit = usePublisher('cancelLinkEdit')
  const switchFromPreviewToLinkEdit = usePublisher('switchFromPreviewToLinkEdit')
  const removeLink = usePublisher('removeLink')
  const applyLinkChanges = usePublisher('applyLinkChanges')

  React.useEffect(() => {
    const update = () => {
      activeEditor?.getEditorState().read(() => {
        publishWindowChange(true)
      })
    }

    window.addEventListener('resize', update)
    // TODO: get the right scroller
    window.addEventListener('scroll', update)

    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update)
    }
  }, [activeEditor, publishWindowChange])

  const [copyUrlTooltipOpen, setCopyUrlTooltipOpen] = React.useState(false)

  const theRect = linkDialogState?.rectangle

  const onSubmitEH = React.useCallback(
    (url: string) => {
      updateLinkUrl(url)
      applyLinkChanges(true)
    },
    [applyLinkChanges, updateLinkUrl]
  )

  const urlIsExternal = linkDialogState.type === 'preview' && linkDialogState.url.startsWith('http')

  return (
    <Popover.Root open={linkDialogState.type !== 'inactive'}>
      <Popover.Anchor
        data-visible={linkDialogState.type === 'edit'}
        className={styles.linkDialogAnchor}
        style={{
          top: theRect?.top,
          left: theRect?.left,
          width: theRect?.width,
          height: theRect?.height
        }}
      />

      <Popover.Portal container={editorRootElementRef?.current}>
        <Popover.Content
          className={classNames(styles.linkDialogPopoverContent)}
          sideOffset={5}
          onOpenAutoFocus={(e) => e.preventDefault()}
          key={linkDialogState.linkNodeKey}
        >
          {linkDialogState.type === 'edit' && (
            <LinkEditForm
              initialUrl={linkDialogState.url}
              onSubmit={onSubmitEH}
              onCancel={cancelLinkEdit.bind(null, true)}
              linkAutocompleteSuggestions={linkAutocompleteSuggestions}
            />
          )}

          {linkDialogState.type === 'preview' && (
            <>
              <a
                className={styles.linkDialogPreviewAnchor}
                href={linkDialogState.url}
                {...(urlIsExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
                title={urlIsExternal ? `Open ${linkDialogState.url} in new window` : linkDialogState.url}
              >
                <span>{linkDialogState.url}</span>
                {urlIsExternal && <OpenInNewIcon />}
              </a>
              <ActionButton onClick={() => switchFromPreviewToLinkEdit(true)} title="Edit link URL" aria-label="Edit link URL">
                <EditIcon />
              </ActionButton>
              <Tooltip.Provider>
                <Tooltip.Root open={copyUrlTooltipOpen}>
                  <Tooltip.Trigger asChild>
                    <ActionButton
                      title="Copy to clipboard"
                      aria-label="Copy link URL"
                      onClick={() => {
                        void window.navigator.clipboard.writeText(linkDialogState.url).then(() => {
                          setCopyUrlTooltipOpen(true)
                          setTimeout(() => setCopyUrlTooltipOpen(false), 1000)
                        })
                      }}
                    >
                      {copyUrlTooltipOpen ? <CheckIcon /> : <CopyIcon />}
                    </ActionButton>
                  </Tooltip.Trigger>
                  <Tooltip.Portal container={editorRootElementRef?.current}>
                    <Tooltip.Content className={classNames(styles.tooltipContent)} sideOffset={5}>
                      Copied!
                      <Tooltip.Arrow />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>

              <ActionButton title="Remove link" aria-label="Remove link" onClick={() => removeLink(true)}>
                <LinkOffIcon />
              </ActionButton>
            </>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

const ActionButton = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<'button'>>(({ className, ...props }, ref) => {
  return <button className={classNames(styles.actionButton, className)} ref={ref} {...props} />
})
