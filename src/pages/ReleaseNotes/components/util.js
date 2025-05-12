import React from "react";

export const convertTextToAnchors = (text, keyPrefix = '') => {
    const regex = /\$\{([^}]+)\}/g; //Check if we have any ${} -- if so will turn them to anchor tags with hrefs
    const allText = [];
    let currentIndex = 0;
    let match;
    let key = 0;
  
    while ((match = regex.exec(text)) !== null) {
      const [fullMatch, placeholder] = match;
      const start = match.index;
  
      if (start > currentIndex) { // add text before match
        allText.push(
          <span key={keyPrefix + "-TextContent-" + ++key}>
            {text.slice(currentIndex, start)}
          </span>
        );
      }
  
      allText.push( //add the url (matched via ${})
        <a
          key={keyPrefix + "-TextContentAnchor-" + ++key}
          href={placeholder.startsWith("http") ? placeholder : `https://${placeholder}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {placeholder}
        </a>
      );
  
      currentIndex = start + fullMatch.length;
    }
  
    if (currentIndex < text.length) { // once we finish the while loop add the rest of the text if applicable
        allText.push(
        <span key={keyPrefix + "-TextContent-" + ++key}>
          {text.slice(currentIndex)}
        </span>
      );
    }
  
    return <>{allText}</>;
  };
  
