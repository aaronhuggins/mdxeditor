import React from 'react'
import * as Select from '@radix-ui/react-select'
import DropDownIcon from '../icons/arrow_drop_down.svg'
import classNames from 'classnames'
import styles from '../styles.module.css'
import { InstantTooltip } from './InstantTooltip'
import type { EditorSystemComponent } from '../../system/EditorSystemComponent'
import type { EditorLiteSystemComponent } from '../../system/EditorLiteSystemComponent'

export const SelectItem = React.forwardRef<HTMLDivElement | null, { className?: string; children: React.ReactNode; value: string }>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Select.Item {...props} ref={forwardedRef} className={classNames(className, styles.toolbarNodeKindSelectItem)}>
        <Select.ItemText>{children}</Select.ItemText>
      </Select.Item>
    )
  }
)

type SelectTriggerProps = {
  title: string
  placeholder: string
  className?: string
  useEmitterValues: EditorLiteSystemComponent.UseEmitterValues & EditorSystemComponent.UseEmitterValues
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({ title, placeholder, className, useEmitterValues }) => {
  return (
    <InstantTooltip title={title} useEmitterValues={useEmitterValues}>
      <Select.Trigger aria-label={placeholder} className={classNames(styles.toolbarNodeKindSelectTrigger, className)}>
        <Select.Value placeholder={placeholder} />
        <Select.Icon className={styles.toolbarNodeKindSelectDropdownArrow}>
          <DropDownIcon />
        </Select.Icon>
      </Select.Trigger>
    </InstantTooltip>
  )
}

type SelectContentProps = {
  children: React.ReactNode
  className?: string
  useEmitterValues: SelectTriggerProps['useEmitterValues']
}

export const SelectContent: React.FC<SelectContentProps> = ({
  children,
  className = styles.toolbarNodeKindSelectContainer,
  useEmitterValues
}) => {
  const [editorRootElementRef] = useEmitterValues('editorRootElementRef')

  return (
    <Select.Portal container={editorRootElementRef?.current}>
      <Select.Content className={className} onCloseAutoFocus={(e) => e.preventDefault()} position="popper">
        <Select.Viewport>{children}</Select.Viewport>
      </Select.Content>
    </Select.Portal>
  )
}

type SelectButtonTriggerProps = {
  children: React.ReactNode
  title: string
  className?: string
  useEmitterValues: SelectTriggerProps['useEmitterValues']
}

export const SelectButtonTrigger: React.FC<SelectButtonTriggerProps> = ({
  children,
  title,
  className,
  useEmitterValues
}) => {
  return (
    <InstantTooltip title={title} useEmitterValues={useEmitterValues}>
      <Select.Trigger className={classNames(styles.toolbarButtonSelectTrigger, className)}>
        {children}
        <Select.Icon className={styles.toolbarNodeKindSelectDropdownArrow}>
          <DropDownIcon />
        </Select.Icon>
      </Select.Trigger>
    </InstantTooltip>
  )
}
