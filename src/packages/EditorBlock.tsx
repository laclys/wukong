import { FC, useMemo } from 'react'
import { VisualConfig, VisualEditorBlock } from './VisualEditor.utils'

export const EditorBlock: FC<{
  block: VisualEditorBlock
  config: VisualConfig
}> = (props) => {
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
    <div className="visual-editor-block" style={styles}>
      {render}
    </div>
  )
}
