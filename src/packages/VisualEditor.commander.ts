import { useRef } from 'react'
import deepcopy from 'deepcopy'
import { useCallbackRef } from './hooks/useCallbackRef'
import { useCommander } from './plugin/command.plugin'
import { VisualEditorBlock, VisualEditorValue } from './VisualEditor.utils'

export function useVisualCommander({
  value,
  focusData,
  updateBlocks,
  dragstart,
  dragend,
}: {
  value: VisualEditorValue
  focusData: {
    focus: VisualEditorBlock[]
    unfocus: VisualEditorBlock[]
  }
  updateBlocks: (blocks: VisualEditorBlock[]) => void
  dragstart: { on: (cb: () => void) => void; off: (cb: () => void) => void }
  dragend: { on: (cb: () => void) => void; off: (cb: () => void) => void }
}) {
  const commander = useCommander()

  /* 删除! */
  commander.useRegistry({
    name: 'delete',
    keyboard: ['backspace', 'delete', 'ctrl+d'],
    execute() {
      console.log('执行删除命令')
      // console.log(this.data)
      let data = {
        before: deepcopy(value.blocks),
        after: deepcopy(focusData.unfocus),
      }
      return {
        redo: () => {
          // console.log('重做删除命令')
          updateBlocks(deepcopy(data.after))
        },
        undo: () => {
          // console.log('撤回删除命令')
          updateBlocks(deepcopy(data.before))
        },
      }
    },
  })

  /* drag command */
  ;(() => {
    const dragData = useRef({ before: null as null | VisualEditorBlock[] })
    const handler = {
      dragstart: useCallbackRef(
        () => (dragData.current.before = deepcopy(value.blocks))
      ),
      dragend: useCallbackRef(() => commander.state.commands.drag()),
    }
    /**
     * 拖拽命令，适用于三种情况：
     * - 从菜单拖拽组件到容器画布；
     * - 在容器中拖拽组件调整位置
     * - 拖拽调整组件的宽度和高度；
     */
    commander.useRegistry({
      name: 'drag',
      init() {
        dragData.current = { before: null }
        dragstart.on(handler.dragstart)
        dragend.on(handler.dragend)
        return () => {
          dragstart.off(handler.dragstart)
          dragend.off(handler.dragend)
        }
      },
      execute() {
        let before = deepcopy(dragData.current.before!)
        let after = deepcopy(value.blocks)
        return {
          redo: () => {
            updateBlocks(deepcopy(after))
          },
          undo: () => {
            updateBlocks(deepcopy(before))
          },
        }
      },
    })
  })()

  commander.useInit()

  return {
    delete: () => commander.state.commands.delete(),
    undo: () => commander.state.commands.undo(),
    redo: () => commander.state.commands.redo(),
  }
}
