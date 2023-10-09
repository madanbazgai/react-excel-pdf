import create from "zustand";

const useStore = create((set) => ({
  posts: [],
  loading: false,
  darkmode: false,

  setData: (payload) => set((state) => ({ posts: payload })),

  setLoading: (payload) => set((state) => ({ loading: payload })),

  deleteData: (payload) =>
    set((state) => ({
      posts: state.posts.filter((post) => post.id !== payload),
    })),

  updateData: (payload) =>
    set((state) => {
      const index = state.posts.findIndex((post) => post.id === payload.id);
      if (index !== -1) {
        state.posts[index] = {
          ...state.posts[index],
          ...payload,
        };
      }
      return { posts: state.posts };
    }),
    
  toggleTheme: (payload) => set((state) => ({ darkmode: payload })),
}));

export default useStore;
