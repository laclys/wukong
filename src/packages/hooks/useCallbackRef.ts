import { useCallback, useRef } from 'react'
/* 
  需要得到一个不变的函数引用，但这个不变的函数执行的时候，执行的是传递的最新函数
*/
export function useCallbackRef<FN extends (...args: any[]) => any>(fn: FN): FN {
  const fnRef = useRef(fn)
  fnRef.current = fn

  return useCallback(((...args: any[]) => fnRef.current(...args)) as FN, [])
}
