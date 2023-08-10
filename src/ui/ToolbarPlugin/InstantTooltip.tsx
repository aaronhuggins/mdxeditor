import * as Tooltip from '@radix-ui/react-tooltip'
import classNames from 'classnames'
import React, { ReactNode } from 'react'
import type { EditorSystemComponent } from '../../system/EditorSystemComponent'
import type { EditorLiteSystemComponent } from '../../system/EditorLiteSystemComponent'
import styles from '../styles.module.css'

type InstantTooltipProps = {
  title: string
  children: ReactNode
  useEmitterValues: EditorLiteSystemComponent.UseEmitterValues & EditorSystemComponent.UseEmitterValues
}

export const InstantTooltip = React.forwardRef<HTMLButtonElement, InstantTooltipProps>(({ title, children, useEmitterValues }, ref) => {
  const [editorRootElementRef] = useEmitterValues('editorRootElementRef')

  return (
    <Tooltip.Provider delayDuration={100}>
      <Tooltip.Root>
        <Tooltip.Trigger ref={ref} asChild>
          <span>{children}</span>
        </Tooltip.Trigger>
        <Tooltip.Portal container={editorRootElementRef?.current}>
          <Tooltip.Content className={classNames(styles.tooltipContent)} sideOffset={10}>
            {title}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
})
