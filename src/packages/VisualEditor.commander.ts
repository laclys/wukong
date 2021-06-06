import { useRef } from 'react'
import { useCallbackRef } from './hooks/useCallbackRef'
import { useCommander } from './plugin/command.plugin'
import deepcopy from 'deepcopy'
import { VisualEditorBlock, VisualEditorValue } from './VisualEditor.utils'

export function useVisualCommander({
  value,
  focusData,
  updateBlocks,
}: {
  value: VisualEditorValue
  focusData: {
    focus: VisualEditorBlock[]
    unfocus: VisualEditorBlock[]
  }
  updateBlocks: (blocks: VisualEditorBlock[]) => void
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
  commander.useInit()

  return {
    delete: () => commander.state.commands.delete(),
  }
}
