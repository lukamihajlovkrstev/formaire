import { createContext, type Dispatch, type SetStateAction } from 'react';

interface OpenContextType {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const OpenContext = createContext<OpenContextType>({
  open: false,
  setOpen: () => {},
});
