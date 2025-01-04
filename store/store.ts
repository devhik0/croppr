import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type MyState = {
  videos: { id: string; name: string; description: string; uri: string }[];
  addVideo: (video: MyState["videos"][0]) => void;
};

export const useVideoStore = create<MyState>()(
  persist(
    (set, get) => ({
      videos: [],
      addVideo: (video) => {
        set((state) => ({
          videos: [...state.videos, { ...video }],
        }));
      },
    }),
    {
      name: "video-storage", // name of item in the storage (must be unique)
      storage: createJSONStorage(() => AsyncStorage), // (optional) by default the 'localStorage' is used
      partialize: (state) => ({ videos: state.videos }),
    }
  )
);
