/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

export default function useArray<T>(defaultValue: T[] = []) {
  const [array, setArray] = useState<T[]>(defaultValue);

  function push(element: any[]) {
    setArray((a: T[]) => [...a, ...element]);
  }

  function filter(callback: (element: T, index: number, array: T[]) => boolean){
    setArray((a: any[]) => a.filter(callback));
  }

  function update(index: number, newElement: T) {
    setArray((a: T[]) => [...a.slice(0, index), newElement, ...a.slice(index + 1, a.length)]);
  }

  function remove(index: number) {
    setArray((a: T[]) => [...a.slice(0, index), ...a.slice(index + 1, a.length)]);
  }

  function clear() {
    setArray([]);
  }

  return { array, set: setArray, push, filter, update, remove, clear };
}
