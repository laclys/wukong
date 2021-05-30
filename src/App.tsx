import { useState, useRef } from 'react'
import { useCallbackRef } from './packages/hooks/useCallbackRef'
import { VisualEditor } from './packages/VisualEditor'
import { visualConfig } from './visual.config'
import { VisualEditorValue } from './packages/VisualEditor.utils'

import './app.scss'

export default () => {
/*   const [pos, setPos] = useState({
    top: 0,
    left: 0,
  })

  const posRef = useRef(pos)
  posRef.current = pos

  const moveDraggier = (() => {
    const currentPos = useRef({
      sTop: 0,
      sLeft: 0,
      sX: 0,
      sY: 0,
    })

    const mouseDown = useCallbackRef((e: React.MouseEvent<HTMLDivElement>) => {
      document.addEventListener('mousemove', mouseMove)
      document.addEventListener('mouseup', mouseUp)
      currentPos.current = {
        sTop: pos.top,
        sLeft: pos.left,
        sX: e.clientX,
        sY: e.clientY,
      }
    })

    const mouseMove = useCallbackRef((e: MouseEvent) => {
      console.log('pos', pos, posRef.current)

      const { sTop, sLeft, sX, sY } = currentPos.current
      const durX = e.clientX - sX
      const durY = e.clientY - sY
      setPos({
        top: sTop + durY,
        left: sLeft + durX,
      })
    })

    const mouseUp = useCallbackRef((e: MouseEvent) => {
      document.removeEventListener('mousemove', mouseMove)
      document.removeEventListener('mouseup', mouseUp)
    })

    return {
      mouseDown,
    }
  })() */

  const [editorValue, setEditorValue] = useState({
    container: {
      height: 700,
      width: 1000
    },
    block: []
  } as VisualEditorValue)

  return (
    <div className="app-home">
{/*       <div
        style={{
          display: 'inline-flex',
          position: 'relative',
          top: `${pos.top}px`,
          left: `${pos.left}px`,
          width: '100px',
          height: '100px',
          background: 'blue',
        }}
        onMouseDown={moveDraggier.mouseDown}
      ></div> */}
      <VisualEditor config={visualConfig} value={editorValue}  onChange={setEditorValue}/>
    </div>
  )
}
