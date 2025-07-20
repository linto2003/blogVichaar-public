import { Link } from 'react-router-dom';
import '../css/Unauthorized.css'; // optional styling

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <h1>403 - Unauthorized</h1>
      <p>You do not have permission to view this page.</p>
      <Link to="/" className="back-home">Go to Home</Link>
    </div>
  );
};

export default Unauthorized;
