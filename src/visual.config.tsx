import { createVisualConfig } from './packages/VisualEditor.utils'
import { Button, Input } from 'antd'

export const visualConfig = createVisualConfig()

visualConfig.registryComp('text', {
  name: '文本',
  preview: () => <span>预览文本</span>,
  render: () => <span>渲染文本</span>,
})

visualConfig.registryComp('button', {
  name: '按钮',
  preview: () => <Button type='primary' >预览按钮</Button>,
  render: () => <Button type='primary' >渲染按钮</Button>,
})

visualConfig.registryComp('input', {
  name: '输入框',
  preview: () => <Input/>,
  render: () => <Input/>,
})