import React from "react";
import { useEffect } from "react";
import { useSetState } from "react-use";
import { useContext } from "react";
import { TraversalContext } from "../contexts";
import { useConfig } from "../hooks/useConfig";
import { Icon } from "./ui/icon";
import { useLocation } from "../hooks/useLocation";
import Dropdown from "./input/dropdown";

/* eslint jsx-a11y/anchor-is-valid: "off" */
const initialState = { types: undefined };

export function CreateButton(props) {
  const [state, setState] = useSetState(initialState);
  const Ctx = useContext(TraversalContext);
  const Config = useConfig();
  useEffect(() => {
    (async function anyNameFunction() {
      const types = await Ctx.client.getTypes(Ctx.path);
      setState({
        types: types.filter(item => !Config.DisabledTypes.includes(item))
      });
    })();
  }, [Ctx.path]);

  const doAction = item => {
    Ctx.doAction("addItem", { type: item });
    setState({ isActive: false });
  };

  // Implement some kind of filtering
  return (
    <Dropdown
      id="dropdown-menu"
      isRight
      onChange={doAction}
      options={(state.types || []).map(item => ({ text: item, value: item }))}
     >
      <span className="icon">
        <i className="fas fa-plus"></i>
      </span>
    </Dropdown>
  )
}

export function ContextToolbar({AddButton, ...props}) {
  const [location, setLocation] = useLocation();
  const ctx = React.useContext(TraversalContext);
  const ref = React.useRef(null);

  const searchText = location.get("q");

  const onSearch = ev => {
    const search = ev.target[0].value;
    setLocation({ q: search, tab: "Items" });
    // let searchParsed = parser(search);
    // ctx.setState({ search, searchParsed });
    ev.preventDefault();
  };

  const setFocus = ev => {
    ref.current.focus();
    ev.preventDefault();
  };

  // useKey("/", setFocus)

  // cleanup form on state.search change
  React.useEffect(() => {
    if (!searchText || searchText === "") {
      ref.current.value = "";
    }
  }, [searchText]);

  return (
    <React.Fragment>
      <div className="level-item">
        <form action="" className="form" onSubmit={onSearch}>
          <div className="field has-addons">
            <div className="control">
              <input
                ref={ref}
                type="text"
                className="input is-size-7"
                placeholder="Search..."
              />
            </div>
            <div className="control">
              <button
                className="button has-background-grey-lighter is-size-7"
                type="submit"
              >
                <Icon icon="fas fa-search" />
              </button>
            </div>
          </div>
        </form>
      </div>
      {ctx.hasPerm("guillotina.AddContent") && (
        <div className="level-item">
          {AddButton!==undefined ? <AddButton /> : <CreateButton {...props} />}
        </div>
      )}
    </React.Fragment>
  );
}
