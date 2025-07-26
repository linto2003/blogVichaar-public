import '../css/BlogTile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faFire, faEye, faBookBookmark } from '@fortawesome/free-solid-svg-icons';

const BlogTile = ({ blog , bookmarked}) => {

  return (
    <>
    <div className="blog-tile">
      {blog.imageUrl &&
      <img className="avatar" src={blog.imageUrl} alt="blog banner" />}
      <h2>{blog.title}</h2>
      <p>{blog.content.slice(0, 200)}...</p>
      <div className="author-details">
        <div className="author-row">
          <img className="author-avatar" src={blog.author?.avatarUrl} alt="Author Avatar" />
          <p><strong>Author:</strong> {blog.author?.username}</p>
        </div>

        <div className="details-row">
          <span className="fa-layers fa-fw" style={{ fontSize: '2rem' }}>
              <FontAwesomeIcon icon={faHeart} transform="shrink-4 down-2 right-2" style={{ color: 'red' }} />
              <FontAwesomeIcon icon={faFire} transform="shrink-6 down-2 right-2" style={{ color: 'orange' }} />
            </span>
          <p>{blog.likes.length}</p>

          <FontAwesomeIcon icon={faEye} />
          <p>{blog.views.length}</p>

        </div>
        <div className="bookmark-row">
            <span className="fa-layers fa-fw" style={{ fontSize: '2rem' }}>
              <FontAwesomeIcon icon={faBookBookmark} transform="shrink-4 down-2 right-2" style={{ color: bookmarked ? 'blue' : 'gray' }} />
            </span>
          </div>
      </div>

      <p><strong>Date:</strong> {new Date(blog.createdAt).toLocaleDateString()}</p>
    </div>
    </>
  );
};

export default BlogTile;
