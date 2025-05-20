// lib/detailsStore.ts
import { create } from "zustand";


export const useDetailsStore = create((set) => ({
  isDetailsUpdated: false,
  setIsDetailsUpdated: (val) => set({ isDetailsUpdated: val }),

  // fetchDetailsStatus: async (clerkId) => {
  //   try {
  //     const res = await fetch(`../api/get-user?clerkId=${clerkId}`);
  //     const data = await res.json();
  //     set({ isDetailsUpdated: data.isDetailsUpdated });
  //   } catch (err) {
  //     console.error("Error fetching initial details status:", err);
  //   }
  // },
}));
