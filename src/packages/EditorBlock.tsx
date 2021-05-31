import { FC, useMemo, useRef, useEffect } from 'react'
import { useUpdate } from './hooks/useUpdate'
import { VisualConfig, VisualEditorBlock } from './VisualEditor.utils'

export const EditorBlock: FC<{
  block: VisualEditorBlock
  config: VisualConfig
}> = (props) => {

  const elRef = useRef({} as HTMLDivElement)
  const { forceupdate } = useUpdate()

  useEffect(() => {
    if(props.block.ajustPosition) {
      const { top, left } = props.block
      const { height, width  } = elRef.current.getBoundingClientRect()
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
    }
  }, [props.block.top, props.block.left])

  const comp = props.config.compMap[props.block.componentKey]

  let render: any
  if (!!comp) {
    render = comp.render()
  }

  return (
    <div className="visual-editor-block" style={styles} ref={elRef} >
      {render}
    </div>
  )
}
