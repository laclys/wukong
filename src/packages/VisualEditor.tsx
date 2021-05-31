import { FC, useMemo, useRef } from 'react'
import { VisualConfig, VisualEditorValue } from './VisualEditor.utils'
import { EditorBlock } from './EditorBlock'

import './VisualEditor.scss'
import { useCallbackRef } from './hooks/useCallbackRef'

export const VisualEditor: FC<{
  value: VisualEditorValue
  onChange: (v: VisualEditorValue) => void
  config: VisualConfig
}> = (props) => {
  console.log('props', props)

  const containerRef = useRef({} as HTMLDivElement)

  const containerStyles = useMemo(() => {
    return {
      width: `${props.value.container.width}px`,
      height: `${props.value.container.height}px`,
    }
  }, [props.value.container.height, props.value.container.width])

  const menuDraggier = (() => {
    const block = {
      dragstart: useCallbackRef((e: React.DragEvent<HTMLDivElement>) => {
        containerRef.current.addEventListener('dragenter', container.dragenter)
        containerRef.current.addEventListener('dragover', container.dragover)
        containerRef.current.addEventListener('dragleave', container.dragleave)
        containerRef.current.addEventListener('drop', container.drop)
      }),

      dragend: useCallbackRef((e: React.DragEvent<HTMLDivElement>) => {
        containerRef.current.removeEventListener(
          'dragenter',
          container.dragenter
        )
        containerRef.current.removeEventListener('dragover', container.dragover)
        containerRef.current.removeEventListener(
          'dragleave',
          container.dragleave
        )
        containerRef.current.removeEventListener('drop', container.drop)
      }),
    }

    const container = {
      dragenter: useCallbackRef((e: DragEvent) => {
        e.dataTransfer!.dropEffect = 'move'
      }),
      dragover: useCallbackRef((e: DragEvent) => {
        e.preventDefault()
      }),
      dragleave: useCallbackRef((e: DragEvent) => {
        e.dataTransfer!.dropEffect = 'none'
      }),
      drop: useCallbackRef((e: DragEvent) => {
        console.log('!!!', 'add new block')
      }),
    }

    return block
  })()

  return (
    <div className="visual-editor">
      <div className="visual-editor-menu">
        {props.config.compArray.map((item) => (
          <div
            key={item.key}
            className="visual-editor-menu-item"
            draggable
            onDragStart={menuDraggier.dragstart}
            onDragEnd={menuDraggier.dragend}
          >
            {item.preview()}
            <div className="visual-editor-menu-item-name">{item.name}</div>
          </div>
        ))}
      </div>
      <div className="visual-editor-head"></div>
      <div className="visual-editor-operator"></div>
      <div className="visual-editor-body">
        <div
          className="visual-editor-container"
          style={containerStyles}
          ref={containerRef}
        >
          {props.value.block.map((i, k) => (
            <EditorBlock key={k} block={i} config={props.config} />
          ))}
        </div>
      </div>
    </div>
  )
}
