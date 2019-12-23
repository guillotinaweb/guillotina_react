import React from "react";
import { TraversalContext } from "../contexts";
import { Tag } from "./ui/tag";
import {useLocation} from '../hooks/useLocation'

export function SearchLabels(props) {

  const [location, setLocation, del] = useLocation()
  const ctx = React.useContext(TraversalContext);
  // let { search } = ctx.state;
  // let { setState } = ctx;
  const search = location.get("q")

  const clearSearch = () => {
    del("q")
    // setState({ search: undefined, searchParsed: [] });
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
