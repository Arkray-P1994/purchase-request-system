import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type State = {
  ids: number[];
};

type Action = {
  updateSelectedId: (ids: number[]) => void;
  deleteSelectedId: (ids: number) => void;
};

export const useIdStore = create<State & Action>()(
  persist(
    (set, get) => ({
      ids: [],
      updateSelectedId: (newIds) => set({ ids: newIds }),
      deleteSelectedId: (id) =>
        set({
          ids: get().ids.filter((exisitngID) => exisitngID !== id),
        }),
    }),
    {
      name: "id-storage", // unique key in storage
      storage: createJSONStorage(() => sessionStorage), // or localStorage
    }
  )
);
