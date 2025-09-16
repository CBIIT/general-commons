import React from "react";

const convertTextToAnchors = (text) => {
  const regex = /\$\{([^}]+)\}/g; //Check if we have any ${} -- if so will turn them to anchor tags with hrefs
  let currentIndex = 0;
  let match;
  let segments = [];

  while ((match = regex.exec(text)) !== null) {
    const [fullMatch, placeholder] = match;
    const start = match.index;

    if (start > currentIndex) {
      // add text before match
      segments.push({
        type: "text",
        text: text.slice(currentIndex, start),
      });
    }
    segments.push({
      // add the url (matched via ${})
      type: "anchor",
      text: placeholder,
    });
    currentIndex = start + fullMatch.length;
  }
  segments.push({
    // once we finish the while loop add the rest of the text if applicable
    type: "text",
    text: text.slice(currentIndex),
  });

  return segments;
};

const DynamicTag = (props) => {
  const { text, keyPrefix } = props;
  const segments = convertTextToAnchors(text);

  return (
    <>
      {segments.map((segment, idx) =>
      {
        return segment.type === "anchor" ? (
          <a
            key={`${keyPrefix}-TextContentAnchor-${idx}`}
            href={
              segment.text.startsWith("http")
                ? segment.text
                : `https://${segment.text}`
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            {segment.text}
          </a>
        ) : (
          <span key={`${keyPrefix}-TextContent-${idx}`}>{segment.text}</span>
        )
    }
      )}
    </>
  );
};

export default DynamicTag;
