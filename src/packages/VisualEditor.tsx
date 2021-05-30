import { FC } from 'react'

import './VisualEditor.scss'

export const VisualEditor :FC = () => {
  return (
    <div className='visual-editor' >
      <div className='visual-editor-menu' ></div>
      <div className='visual-editor-head' ></div>
      <div className='visual-editor-body' ></div>
      <div className='visual-editor-operator' ></div>
    </div>
  )
}