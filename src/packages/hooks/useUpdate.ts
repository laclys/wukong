import { useState, useMemo } from 'react'

/* 强制刷新！ */
export function useUpdate() {
  const [count, setCount] = useState(0)
  return useMemo(() => ({ forceupdate: () => setCount(count + 1) }), [count])
}
