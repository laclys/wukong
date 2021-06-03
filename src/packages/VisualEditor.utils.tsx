export interface VisualEditorBlock {
  /* comp的key，通过这个来找config中的comp */
  componentKey: string 
  top: number
  left: number
  /* 是否需要调整位置 */
  ajustPosition: boolean
  /* 当前是否被选中 */
  focus: boolean
}

/* 
  编辑器编辑的数据类型
*/
export interface VisualEditorValue {
  container: {
    height: number
    width: number
  }
  blocks: VisualEditorBlock[]
}

/* 
  编辑器预定组件类型
*/
export interface VisualEditorComp {
  key: string
  name: string
  preview: () => JSX.Element
  render: () => JSX.Element
}

export function createVisualConfig () {
  // 对应block数据 通过key找到component对象 render到容器中
  const compMap: { [k: string]: VisualEditorComp } = {}
  // menu渲染组件列表
  const compArray: VisualEditorComp[] = []

  /* 注册一个组件 */
  function registryComp(key: string, option: Omit<VisualEditorComp, 'key'>) {
    if(compMap[key]) {
      const idx = compArray.indexOf(compMap[key])
      compArray.splice(idx, 1)
    }
    const newComp = {
      key,
      ...option
    }
    compArray.push(newComp)
    compMap[key] = newComp
  }

  return {
    registryComp,
    compMap,
    compArray
  }
}

/* 创建一个block数据 */
export function createVisualBlock({ top, left, comp }: { top: number, left: number, comp: VisualEditorComp}): VisualEditorBlock {
  return {
    componentKey: comp.key,
    top,
    left,
    ajustPosition: true,
    focus: false
  }
}

export type VisualConfig = ReturnType<typeof createVisualConfig>