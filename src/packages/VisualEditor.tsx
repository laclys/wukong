import { FC, useMemo } from 'react'
import { VisualConfig, VisualEditorValue } from './VisualEditor.utils'
import { EditorBlock } from './EditorBlock'

import './VisualEditor.scss'

export const VisualEditor: FC<{
  value: VisualEditorValue
  onChange: (v: VisualEditorValue) => void
  config: VisualConfig
}> = (props) => {
  console.log('props', props)

  const containerStyles = useMemo(() => {
    return {
      width: `${props.value.container.width}px`,
      height: `${props.value.container.height}px`,
    }
  }, [props.value.container.height, props.value.container.width])

  return (
    <div className="visual-editor">
      <div className="visual-editor-menu">
        {props.config.compArray.map((item) => (
          <div key={item.key} className="visual-editor-menu-item">
            {item.preview()}
            <div className="visual-editor-menu-item-name">{item.name}</div>
          </div>
        ))}
      </div>
      <div className="visual-editor-head"></div>
      <div className="visual-editor-operator"></div>
      <div className="visual-editor-body">
        <div className="visual-editor-container" style={containerStyles}>
          {props.value.block.map((i, k) => (
            <EditorBlock key={k} block={i} config={props.config} />
          ))}
        </div>
      </div>
    </div>
  )
}
