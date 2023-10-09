import { createSlice } from "@reduxjs/toolkit";

const initialState ={
  posts: [], 
  loading: false, 
  darkmode:false
}

const postSlice = createSlice({
  name: "posts",
  initialState,

  reducers: {
    setData: (state, action) => {
      state.posts = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    deleteData: (state, action) => {
      const postId = action.payload;
      state.posts = state.posts.filter((post) => post.id !== postId);
    },
    updateData: (state, action) => {
      const { id } = action.payload;
  
      const index = state.posts.findIndex((post) => post.id === id);
      if (index !== -1) {
        state.posts[index] = {
          ...state.posts[index],
          ...action.payload,
        };
      }
    },
    toggleTheme:(state,action)=>{
      const theme = action.payload
      state.darkmode = theme
    }
  },
});

export const { setData, setLoading,deleteData,updateData ,toggleTheme} = postSlice.actions;
export default postSlice.reducer;
