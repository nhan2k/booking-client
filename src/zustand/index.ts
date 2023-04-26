import { create } from 'zustand';

const useImgPathStore = create((set) => ({
  imgPath: '',
  setImgPath: (imgPath: string) => set({ imgPath }),
}));

export { useImgPathStore };
