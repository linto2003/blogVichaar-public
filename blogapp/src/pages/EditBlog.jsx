import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import "../css/EditBlogSections.css";
import { Link } from "react-router-dom";

const EditBlogSections = () => {
  const [editingField, setEditingField] = useState(null);
  const [form, setForm] = useState({});
  const [blog, setBlog] = useState({});
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axiosPrivate.get(`/blog/${id}`);
        const { blog } = response.data;
        setBlog(blog);
        setForm(blog); // initialize form for editing
      } catch (error) {
        console.error("Error fetching blog:", error);
        setError("Blog not found or failed to load.");
        navigate("/");
      }
    };

    fetchBlog();
  }, [id, axiosPrivate, navigate]);

const handleSave = async (field) => {
  try {
    if (field === "image" && image) {
      const formData = new FormData();
      formData.append("image", image);
      try{
              await axiosPrivate.put(`/blog/${blog._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      alert("Image Uploaded");
      }
    catch(error){
        alert("Error : Try Uploading again!!");
    }

    } else {
      await axiosPrivate.put(`/blog/${blog._id}`, { [field]: form[field] });
    }

    setEditingField(null);
  } catch (err) {
    console.error("Failed to update:", err);
  }
};


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const renderField = (field, label) => (
    <div className="section">
      <h4>{label}</h4>
      {editingField === field ? (
        <>
          <textarea
            value={form[field] || ""}
            onChange={(e) =>
              setForm({
                ...form,
                [field]:
                  field === "tags"
                    ? e.target.value.split(",").map((tag) => tag.trim())
                    : e.target.value,
              })
            }
          />
          <button onClick={() => handleSave(field)}>Save</button>
        </>
      ) : (
        <div onClick={() => setEditingField(field)} className="view-mode">
          {field === "tags"
            ? Array.isArray(form[field])
              ? form[field].join(", ")
              : "Click to add"
            : form[field] || "Click to add"}
        </div>
      )}
    </div>
  );

  return (
    <div className="edit-blog-page">
      <h2>Edit Blog Sections</h2>
      {error && <p className="error">{error}</p>}
      {renderField("title", "Title")}
      {renderField("content", "Content")}
      {renderField("tags", "Tags (comma-separated)")}

    <div className="section image-section">
    <h4>Image</h4>
    <input
        type="file"
        id="image"
        accept="image/*"
        onChange={handleImageChange}
    />
    {!image && blog.imageUrl && (
    <div className="preview">
        <img src={blog.imageUrl} alt="Current blog" />
    </div>
    )}
    {image && (
        <div className="preview">
        <img src={URL.createObjectURL(image)} alt="Preview" />
        <button onClick={() => handleSave("image")}>Upload Image</button>

        </div>
    )}
    </div>
    

    <Link to={`/my-blogs`} className="blog-button">
        Done
    </Link>
    </div>
  );
};

export default EditBlogSections;
