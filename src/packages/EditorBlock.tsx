import classNames from 'classnames'
import { FC, useMemo, useRef, useEffect } from 'react'
import { useUpdate } from './hooks/useUpdate'
import { VisualConfig, VisualEditorBlock } from './VisualEditor.utils'

export const EditorBlock: FC<{
  block: VisualEditorBlock
  config: VisualConfig
  onMousedown?: (e: React.MouseEvent<HTMLDivElement>) => void
}> = (props) => {
  const elRef = useRef({} as HTMLDivElement)
  const { forceupdate } = useUpdate()

  useEffect(() => {
    if (props.block.ajustPosition) {
      const { top, left } = props.block
      const { height, width } = elRef.current.getBoundingClientRect()
      props.block.ajustPosition = false
      props.block.top = top - height / 2
      props.block.left = left - width / 2
      forceupdate()
    }
  }, [])

  const styles = useMemo(() => {
    return {
      top: `${props.block.top}px`,
      left: `${props.block.left}px`,
      opacity: props.block.ajustPosition ? '0' : '',
    }
  }, [props.block.top, props.block.left, props.block.ajustPosition])


  const classes = useMemo(() => classNames([
    'visual-editor-block',
    {
      'visual-editor-block-focus': props.block.focus
    }
  ]), [props.block.focus])

  const comp = props.config.compMap[props.block.componentKey]

  let render: any
  if (!!comp) {
    render = comp.render()
  }

  return (
    <div className={classes} style={styles} ref={elRef} onMouseDown={props.onMousedown} >
      {render}
    </div>
  )
}
