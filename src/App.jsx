import React, { useEffect, useState } from "react";
import "./App.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import data from "./data";
import { useDispatch, useSelector } from "react-redux";
import FetchData from "./FetchData";
import { nanoid } from "nanoid";
import icon from "./assets/k1qbZAOrp7.gif";
import { deleteData, updateData } from "./features/api/postSlice";
import { create } from 'zustand'
function App() {
  const dataFromStore = useSelector((state) => state.post.posts);
  const loading = useSelector((state) => state.post.loading);
  const theme = useSelector((state) => state.post.darkmode);

  const [themeState, setthemeState] = useState(theme);

  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    themeState
      ? ((document.body.style.backgroundColor = "black"),
        (document.body.style.color = "white"))
      : ((document.body.style.backgroundColor = "white"),
        (document.body.style.color = "black"));
  }, [themeState]);

  // const dataFromStore = [];

  // const [posts, setPosts] = useState([]);
  // const fetchPosts = async () => {
  //   const res = await fetch(`https://jsonplaceholder.typicode.com/todos`);
  //   const data = await res.json();
  //   setPosts(data);
  // };

  // useEffect(() => {
  //   fetchPosts();
  // }, []);

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, { html: "#my-table" });
    doc.save("table.pdf");
  };

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");
  worksheet.addRow({ id: 1, name: "John Doe", dob: new Date(1970, 1, 1) });

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    worksheet.columns = [
      { header: "userId", key: "uid", width: 10 },
      { header: "Id", key: "id", width: 10 },
      { header: "Title", key: "name", width: 50 },
      { header: "Body", key: "body", width: 15 },
    ];

    dataFromStore.forEach((post) =>
      worksheet.addRow({
        uid: post.userId,
        id: post.id,
        name: post.title,
        body: post.completed ? "completed" : "not completed",
      })
    );

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "output.xlsx");
  };

  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedPostData, setEditedPostData] = useState({});

  const editPost = (post) => {
    setIsModalOpen(true);
    setEditedPostData(post);
  };
  const handleModalInputChange = (e) => {
    setEditedPostData({
      ...editedPostData,
      [e.target.name]: e.target.value,
    });
  };
  const handleModalSave = () => {
    // Dispatch an action to update the post with the edited values
    dispatch(updateData(editedPostData));

    // Close the modal
    setIsModalOpen(false);
    setEditedPostData({});
  };

  const handleDelete = (postId) => {
    dispatch(deleteData(postId));
  };

  const filteredData = dataFromStore.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTheme = () => {
    setthemeState(!themeState);
  };
  return (
    <>
      <button className="themebutton" onClick={toggleTheme}>
        {themeState ? "light" : "dark"}
      </button>
      <div className="buttons">
        <FetchData page={page} />
        <button onClick={exportToPDF}>Export to pdf</button>
        <button onClick={exportToExcel}>Export to excel</button>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <table id="my-table" border={1} cellSpacing={0} cellPadding={10} height={1000} width={800}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Body</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <img height={30} src={icon} alt="" />
          ) : (
            filteredData.map((post) => (
              <React.Fragment key={nanoid()}>
                <tr>
                  <td rowSpan={2}>{post.id}</td>
                  <td rowSpan={2}>{post.title}</td>
                  <td>{post.completed ? "completed" : "not completed"}</td>
                  <td rowSpan={2}>
                    <button onClick={() => handleDelete(post.id)}>
                      delete
                    </button>
                    <br /> <br />
                    <button onClick={() => editPost(post)}>Edit</button>
                  </td>
                </tr>
                <tr>
                  <td>{post.completed ? "completed" : "not completed"}</td>
                </tr>
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
      <button onClick={() => setPage(page - 1)} disabled={page === 1}>
        Previous
      </button>{" "}
      &nbsp;
      <button onClick={() => setPage(page + 1)}>Next</button>
      {isModalOpen && (
        <div className="modal">
          <h2>Edit Post</h2>
          <input
            type="text"
            name="title"
            value={editedPostData.title}
            onChange={handleModalInputChange}
          />
          <input
            type="text"
            name="completed"
            value={editedPostData.completed ? "completed" : "not completed"}
            onChange={handleModalInputChange}
          />
          <button onClick={handleModalSave}>Save</button>
          <button onClick={() => setIsModalOpen(false)}>Cancel</button>
        </div>
      )}
    </>
  );
}

export default App;
