import React from "react";

const FieldError = ({ errorMessage, show }) => {
  return (
    <div className="text-[red] font-semibold text-xs">
      {show && <p className="error-text">{errorMessage}</p>}
    </div>
  );
};

export default FieldError;