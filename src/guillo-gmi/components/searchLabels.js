import React from "react";
import { TraversalContext } from "../contexts";
import { Tag } from "./ui/tag";

export function SearchLabels(props) {
  const ctx = React.useContext(TraversalContext);
  let { search } = ctx.state;
  let { setState } = ctx;

  const clearSearch = () => {
    setState({ search: undefined, searchParsed: [] });
  };

  return (
    <div className="tags">
      {search && <Tag name="Search:" color="is-light" size="is-size-7" />}
      {search && (
        <Tag name={search} color="is-info" size="is-size-7" onRemove={() => clearSearch()} />
      )}
    </div>
  );
}
