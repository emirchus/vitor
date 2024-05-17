import React from "react";

export const useToggle = (initialState = false): [boolean, () => void] => {
  const [state, setState] = React.useState(initialState);
  const toggle = () => setState(prev => !prev);
  return [state, toggle];
};
