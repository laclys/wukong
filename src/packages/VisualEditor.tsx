import { FC } from 'react'
import { VisualConfig, VisualEditorValue } from './VisualEditor.utils'

import './VisualEditor.scss'

export const VisualEditor: FC<{
  value: VisualEditorValue
  onChange: (v: VisualEditorValue) => void
  config: VisualConfig
}> = (props) => {
  console.log('props', props)
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
      <div className="visual-editor-body"></div>
      <div className="visual-editor-operator"></div>
    </div>
  )
}
