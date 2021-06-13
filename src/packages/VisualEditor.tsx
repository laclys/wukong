import { FC, useMemo, useRef, useState } from 'react'
import { useCallbackRef } from './hooks/useCallbackRef'
import { EditorBlock } from './EditorBlock'
import {
  createVisualBlock,
  VisualConfig,
  VisualEditorComp,
  VisualEditorValue,
  VisualEditorBlock,
} from './VisualEditor.utils'
import { useVisualCommander } from './VisualEditor.commander'
import { createEvent } from './plugin/event'

import './VisualEditor.scss'

export const VisualEditor: FC<{
  value: VisualEditorValue
  onChange: (v: VisualEditorValue) => void
  config: VisualConfig
}> = (props) => {
  // console.log('props', props)

  const [preview, setPreview] = useState(false)
  const [editing, setEditing] = useState(false)

  const [dragstart] = useState(() => createEvent())
  const [dragend] = useState(() => createEvent())

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

    // console.log('focus', focus)
    // console.log('unfocus', unfocus)
    // console.log('blocks', props.value.blocks)
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
          dragstart.emit()
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
        methods.updateBlocks([
          ...props.value.blocks,
          createVisualBlock({
            top: e.offsetY,
            left: e.offsetX,
            comp: dragDataRef.current.dragComp!,
          }),
        ])
        setTimeout(() => {
          dragend.emit()
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

  /* block在container中 */
  const blockDraggier = (() => {
    const dragData = useRef({
      startX: 0, // 拖拽开始鼠标left值
      startY: 0, // 拖拽开始鼠标top值
      startPosArray: [] as { top: number; left: number }[], // 拖拽开始时候所有选中block的top值、left值
      dragging: false, // 是否处于拖拽状态
    })

    const mousedown = useCallbackRef((e: React.MouseEvent) => {
      document.addEventListener('mousemove', mousemove)
      document.addEventListener('mouseup', mouseup)

      dragData.current = {
        startX: e.clientX,
        startY: e.clientY,
        startPosArray: focusData.focus.map(({ top, left }) => ({ top, left })),
        dragging: false,
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

      if (!dragData.current.dragging) {
        dragData.current.dragging = true
        dragstart.emit()
      }
    })

    const mouseup = useCallbackRef((e: MouseEvent) => {
      document.removeEventListener('mousemove', mousemove)
      document.removeEventListener('mouseup', mouseup)
      if (dragData.current.dragging) {
        dragend.emit()
      }
    })

    return {
      mousedown,
    }
  })()

  /* 命令管理 */
  const commander = useVisualCommander({
    value: props.value,
    focusData,
    updateBlocks: methods.updateBlocks,
    dragstart,
    dragend,
  })

  const buttons: {
    label: string | (() => string)
    icon: string | (() => string)
    tip?: string | (() => string)
    handler: () => void
  }[] = [
    {
      label: '撤销',
      icon: 'icon-back',
      handler: () => commander.undo(),
      tip: 'ctrl+z',
    },
    {
      label: '重做',
      icon: 'icon-forward',
      handler: () => commander.redo(),
      tip: 'ctrl+y, ctrl+shift+z',
    },
    {
      label: () => (preview ? '编辑' : '预览'),
      icon: () => (preview ? 'icon-edit' : 'icon-browse'),
      handler: () => {
        if (!preview) {
          methods.clearFocus()
        }
        setPreview(!preview)
      },
    },
    {
      label: '导入',
      icon: 'icon-import',
      handler: async () => {
        /*         const text = await $$dialog.textarea('', {
          title: '请输入导入的JSON字符串',
        })
        try {
          const data = JSON.parse(text || '')
          commander.updateValue(data)
        } catch (e) {
          console.error(e)
          notification.open({
            message: '导入失败！',
            description: '导入的数据格式不正常，请检查！',
          })
        } */
      },
    },
    {
      label: '导出',
      icon: 'icon-export',
      handler: () => {
        /*         $$dialog.textarea(JSON.stringify(props.value), {
            editReadonly: true,
            title: '导出的JSON数据',
          }) */
      },
    },
    /*     {
      label: '置顶',
      icon: 'icon-place-top',
      handler: () => commander.placeTop(),
      tip: 'ctrl+up',
    },
    {
      label: '置底',
      icon: 'icon-place-bottom',
      handler: () => commander.placeBottom(),
      tip: 'ctrl+down',
    }, */
    {
      label: '删除',
      icon: 'icon-delete',
      handler: () => commander.delete(),
      tip: 'ctrl+d, backspace, delete',
    },
    {
      label: '清空',
      icon: 'icon-reset',
      handler: () => {
        // commander.clear()
      },
    },
    {
      label: '关闭',
      icon: 'icon-close',
      handler: () => {
        methods.clearFocus()
        setEditing(false)
      },
    },
  ]

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
      <div className="visual-editor-head">
        {buttons.map((btn, idx) => {
          const label =
            typeof btn.label === 'function' ? btn.label() : btn.label
          const icon = typeof btn.icon === 'function' ? btn.icon() : btn.icon

          return (
            <div
              className="visual-editor-head-btn"
              key={`${idx}_BTN`}
              onClick={btn.handler}
            >
              <i className={`iconfont ${icon}`}></i>
              <span>{label}</span>
            </div>
          )
        })}
      </div>
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
