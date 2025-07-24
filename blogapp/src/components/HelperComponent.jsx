import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const InputField = ({
  id,
  label,
  value,
  setValue,
  isValid,
  setFocus,
  focus,
  icon,
  instruction,
  type = "text",
  inputRef = null,
  multiline = false
}) => {
  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          ref={inputRef}
          aria-invalid={!isValid}
          aria-describedby={`${id}-note`}
          rows={10}
          className="form-textarea"
        />
      ) : (
      <div className="input-with-icon">
        <input
          type={type}
          id={id}
          ref={inputRef}
          autoComplete="off"
          onChange={(e) => setValue(e.target.value)}
          value={value}
          required
          aria-invalid={!isValid}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
        {icon && value && (
          <FontAwesomeIcon
            icon={isValid ? faCheck : faTimes}
            className={isValid ? "icon valid" : "icon invalid"}
          />
        )}
      </div>
      )}
      {focus && value && !isValid && (
        <p className="instructions">
          <FontAwesomeIcon icon={faInfoCircle} /> {instruction}
        </p>
      )}
    </div>
    
  );
};

export default InputField;
