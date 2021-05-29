import { useState, useRef } from 'react'

import './app.scss'

export default () => {

  const [pos, setPos] = useState({
    top: 0,
    left: 0
  })

  const moveDraggier = (() => {

    const currentPos = useRef({
      sTop: 0,
      sLeft: 0,
      sX: 0,
      sY: 0
    })

    const mouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      document.addEventListener('mousemove', mouseMove)
      document.addEventListener('mouseup', mouseUp)
      currentPos.current = {
        sTop: pos.top,
        sLeft: pos.left,
        sX: e.clientX,
        sY: e.clientY
      }
    }

    const mouseMove = (e: MouseEvent) => {
      const { sTop, sLeft, sX, sY } = currentPos.current
      const durX = e.clientX - sX
      const durY = e.clientY - sY
      setPos({
        top: sTop + durY,
        left: sLeft + durX
      })
    }

    const mouseUp = (e: MouseEvent) => {
      document.removeEventListener('mousemove', mouseMove)
      document.removeEventListener('mouseup', mouseUp)
    }

    return {
      mouseDown
    }

  })()


  return <div className="app-home">
    <div >hello world</div>
    <div style={{
      display: 'inline-flex',
      position: 'relative',
      top: `${pos.top}px`,
      left: `${pos.left}px`,
      width: '100px',
      height: '100px',
      background: 'blue',
    }}
    onMouseDown={moveDraggier.mouseDown}
    
    ></div>
  </div>
}
