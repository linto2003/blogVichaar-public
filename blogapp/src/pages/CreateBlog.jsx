import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from '../hooks/useAxiosPrivate.jsx'; 
import InputField from "../components/HelperComponent.jsx";
import "../css/CreateBlog.css";
import AdBanner from "../components/AdComponent.jsx";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);

  const [titleFocus, setTitleFocus] = useState(false);
  const [contentFocus, setContentFocus] = useState(false);
  const [tagsFocus, setTagsFocus] = useState(false);

  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const tagsRef = useRef(null);
  
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tags", tags); // Send as string, comma-separated
    if (image) formData.append("image", image);

    try {
      await axiosPrivate.post("/blog/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/"); 
    } catch (err) {
      console.error("Error creating blog:", err);
    }
  };

  return (
    <div className="create-blog-container">
      <h2>Create a New Blog</h2>
      <AdBanner />
      <form onSubmit={handleSubmit} className="create-blog-form">
        <InputField
          id="title"
          label="Blog Title"
          value={title}
          setValue={setTitle}
          isValid={true}
          setFocus={setTitleFocus}
          focus={titleFocus}
          instruction="Enter the blog title."
          inputRef={titleRef}
          icon
        />

        <InputField
          id="content"
          label="Blog Content"
          value={content}
          setValue={setContent}
          setFocus={setContentFocus}
          isValid={true}
          focus={contentFocus}
          instruction="Enter the blog content."
          inputRef={contentRef}
          icon
        />

        <InputField
          id="tags"
          label="Tags (comma-separated)"
          value={tags}
          setValue={setTags}
          setFocus={setTagsFocus}
          isValid={true}
          focus={tagsFocus}
          instruction="Enter tags like tech, health, etc."
          inputRef={tagsRef}
          icon
        />

        <label htmlFor="image">Upload Image -only png,jpg,jpeg allowed</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
        />

        {image && (
          <div className="preview">
            <img src={URL.createObjectURL(image)} alt="Preview" />
          </div>
        )}

        <button type="submit" className="submit-btn">
          Publish Blog
        </button>
      </form>
      <p className="instruction">
        Note: Ensure your image is less than 2MB for optimal performance.
      </p>

    </div>
  );
};

export default CreateBlog;
