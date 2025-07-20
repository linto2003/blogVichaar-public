import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../css/IconButton.css';

const IconButton = ({ icon, state, onColor, offColor, fontSize, toggleFunction }) => {
  return (
    <button
      onClick={toggleFunction}
      className="icon-button"
      style={{
        fontSize: fontSize,
        color: state ? onColor : offColor,
      }}
      aria-label="icon-button"
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  );
};

export default IconButton;
