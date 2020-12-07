import React, { useCallback } from "react";

const SuggestionsListComponent = ({
  showSuggestions,
  userInput,
  filteredSuggestions,
  activeSuggestion,
  handleClick,
  ...props
}) => {
  if (showSuggestions && userInput) {
    if (filteredSuggestions.length) {
      return (
        <ul className="suggestions">
          {filteredSuggestions.map((suggestion, index) => {
            let className;
            // Flag the active suggestion with a class
            if (index === activeSuggestion) {
              className = "suggestion-active";
            }
            if (suggestion.id && suggestion.location_name && suggestion.type) {
              return (
                <li
                  className={className}
                  key={suggestion.id}
                  onClick={(e) =>
                    handleClick(
                      {
                        id: suggestion.id,
                        name: suggestion.location_name,
                        type: suggestion.type,
                      },
                      e
                    )
                  }
                >
                  <p className="alignleft">{suggestion.location_name}</p>
                  <p className="alignright" style={{ color: "#999" }}>
                    {suggestion.type}{" "}
                  </p>
                </li>
              );
            } else {
              return (
                <p>{suggestion}</p>
                //   <li
                //     className={className}
                //     key={suggestion.id}
                //     onClick={(e) => {
                //       console.log(suggestion);
                //     }}
                //   >
                //     <p>{suggestion.activity_name}</p>
                //     {/* <p className="alignright" style={{ color: "#999" }}>
                //       {suggestion.type}{" "}
                //     </p> */}
                //   </li>
              );
            }
          })}
        </ul>
      );
    } else {
      return (
        <ul className="suggestions">
          <li> loading ...</li>;
        </ul>
      );
    }
  }
  return null;
};

export default SuggestionsListComponent;
