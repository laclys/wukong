import { FC, useMemo, useRef } from 'react'
import { useCallbackRef } from './hooks/useCallbackRef'
import { EditorBlock } from './EditorBlock'
import {
  createVisualBlock,
  VisualConfig,
  VisualEditorComp,
  VisualEditorValue,
  VisualEditorBlock,
} from './VisualEditor.utils'

import './VisualEditor.scss'

export const VisualEditor: FC<{
  value: VisualEditorValue
  onChange: (v: VisualEditorValue) => void
  config: VisualConfig
}> = (props) => {
  // console.log('props', props)

  const containerRef = useRef({} as HTMLDivElement)

  const containerStyles = useMemo(() => {
    return {
      width: `${props.value.container.width}px`,
      height: `${props.value.container.height}px`,
    }
  }, [props.value.container.height, props.value.container.width])

  const focusData = useMemo(() => {
    const focus: VisualEditorBlock[] = []
    const unfocus: VisualEditorBlock[] = []
    props.value.blocks.forEach((block) => {
      ;(block.focus ? focus : unfocus).push(block)
    })
    return {
      focus,
      unfocus,
    }
  }, [props.value.blocks])

  /* 对外方法 */
  const methods = {
    /* 更新blocks，触发重新渲染 */
    updateBlocks: (blocks: VisualEditorBlock[]) => {
      props.onChange({
        ...props.value,
        blocks: [...blocks],
      })
    },
    /* 清空选中block */
    clearFocus: (external?: VisualEditorBlock) => {
      ;(!!external
        ? focusData.focus.filter((i) => i !== external)
        : focusData.focus
      ).forEach((j) => {
        j.focus = false
      })
      // console.log('!@!', props.value.blocks )
      methods.updateBlocks(props.value.blocks) //修改原数组就好
    },
  }

  /* 
    拖拽逻辑处理 从menu菜单中拖拽预定义组件到容器中
  */
  const menuDraggier = (() => {
    const dragDataRef = useRef({
      dragComp: null as VisualEditorComp | null,
    })

    const block = {
      dragstart: useCallbackRef(
        (e: React.DragEvent<HTMLDivElement>, dragComp: VisualEditorComp) => {
          containerRef.current.addEventListener(
            'dragenter',
            container.dragenter
          )
          containerRef.current.addEventListener('dragover', container.dragover)
          containerRef.current.addEventListener(
            'dragleave',
            container.dragleave
          )
          containerRef.current.addEventListener('drop', container.drop)

          dragDataRef.current.dragComp = dragComp
        }
      ),

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

        props.onChange({
          ...props.value,
          blocks: [
            ...props.value.blocks,
            createVisualBlock({
              top: e.offsetY,
              left: e.offsetX,
              comp: dragDataRef.current.dragComp!,
            }),
          ],
        })
      }),
    }

    return block
  })()

  /* 
  处理block元素选中事件
*/
  const focusHandle = (() => {
    const block = (
      e: React.MouseEvent<HTMLDivElement>,
      block: VisualEditorBlock
    ) => {
      // console.log('点击了block！！！')

      if (e.shiftKey) {
        console.log('press shift')
        /* 如果按住shift，如果此时没有选中block，就选中，否则状态取反 */
        if (focusData.focus.length <= 1) {
          block.focus = true
        } else {
          block.focus = !block.focus
        }
      } else {
        if (!block.focus) {
          block.focus = true
          methods.clearFocus(block)
        }
      }
      setTimeout(() => {
        blockDraggier.mousedown(e)
      })
    }

    const container = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget) {
        return
      }
      // console.log('点击了container！！！')
      if (!e.shiftKey) {
        // 点击且按住shift键
        methods.clearFocus()
      }
    }

    return {
      block,
      container,
    }
  })()

  const blockDraggier = (() => {
    const dragData = useRef({
      startX: 0, // 拖拽开始鼠标left值
      startY: 0, // 拖拽开始鼠标top值
      startPosArray: [] as { top: number; left: number }[], // 拖拽开始时候所有选中block的top值、left值
    })

    const mousedown = useCallbackRef((e: React.MouseEvent) => {
      document.addEventListener('mousemove', mousemove)
      document.addEventListener('mouseup', mouseup)

      dragData.current = {
        startX: e.clientX,
        startY: e.clientY,
        startPosArray: focusData.focus.map(({ top, left }) => ({ top, left })),
      }
    })
    const mousemove = useCallbackRef((e: MouseEvent) => {
      const { startX, startY, startPosArray } = dragData.current
      const { clientX: moveX, clientY: moveY } = e
      const durX = moveX - startX,
        durY = moveY - startY
      focusData.focus.forEach((block, idx) => {
        const { left, top } = startPosArray[idx]

        block.left = left + durX
        block.top = top + durY
      })
      methods.updateBlocks(props.value.blocks)
    })

    const mouseup = useCallbackRef((e: MouseEvent) => {
      document.removeEventListener('mousemove', mousemove)
      document.removeEventListener('mouseup', mouseup)
    })

    return {
      mousedown,
    }
  })()

  return (
    <div className="visual-editor">
      <div className="visual-editor-menu">
        {props.config.compArray.map((item) => (
          <div
            key={item.key}
            className="visual-editor-menu-item"
            draggable
            onDragStart={(e) => menuDraggier.dragstart(e, item)}
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
          onMouseDown={focusHandle.container}
        >
          {props.value.blocks.map((i, k) => (
            <EditorBlock
              key={k}
              block={i}
              config={props.config}
              onMousedown={(e) => focusHandle.block(e, i)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
