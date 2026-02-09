import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type State = {
  ids: number[];
};

type Action = {
  updateSelectedId: (ids: number[]) => void;
  deleteSelectedId: (id: number) => void;
};

export const useIdStore = create<State & Action>()(
  persist(
    (set, get) => ({
      ids: [],
      updateSelectedId: (newIds) => set({ ids: newIds }),
      deleteSelectedId: (id) =>
        set({
          ids: get().ids.filter(
            (existingID) => Number(existingID) !== Number(id),
          ),
        }),
    }),
    {
      name: "id-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
