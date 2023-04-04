import { WithContext as ReactTags } from "react-tag-input";
import { useEffect, useState } from "react";

import * as questionServices from "~/services/questionServices";
import "./TagsInput.scss";

function CustomTagsInput({ tags, setTags }) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await questionServices.getTags("all");
      console.log(result);
      setSuggestions(
        result.tags.map((tag) => ({
          id: tag.name,
          text: tag.name,
        }))
      );
    };
    fetchData();
  }, []);

  const handleAddition = (tag) => {
    setTags([...tags, tag]);
  };

  const handleDelete = (i) => {
    const newTags = [...tags];
    newTags.splice(i, 1);
    setTags(newTags);
  };

  return (
    suggestions.length > 0 && (
      <ReactTags
        classNames={{
          tags: "tagsClass",
          tagInput: "tagInputClass",
          tagInputField: "tagInputFieldClass",
          selected: "selectedClass",
          tag: "tagClass",
          remove: "removeClass",
          suggestions: "suggestionsClass",
          activeSuggestion: "activeSuggestionClass",
          editTagInput: "editTagInputClass",
          editTagInputField: "editTagInputField",
          clearAll: "clearAllClass",
        }}
        tags={tags}
        suggestions={suggestions.map((tag) => ({
          id: tag?.text,
          text: tag?.text,
        }))}
        placeholder="Enter tag..."
        handleDelete={handleDelete}
        handleAddition={handleAddition}
        delimiters={[9, 13, 32, 188]}
        allowDragDrop={false}
        inputFieldPosition="inline"
        autofocus={false}
      />
    )
  );
}

export default CustomTagsInput;
