import React from "react";
import { useContext } from "react";
import { useSetState } from "react-use";
import { useEffect } from "react";
import { TraversalContext } from "../../contexts";
import { RItem } from "../item";
import { Pagination } from "../pagination";
import { SearchLabels } from "../../components/searchLabels";
import { buildQs } from "../../lib/search";
import { useLocation } from "../../hooks/useLocation";
import { parser } from "../../lib/search";
import { useConfig } from "../../hooks/useConfig"

const initialState = {
  page: 0,
  items: [],
  loading: true,
  total: 0
};

export function PanelItems(props) {
  const [location, setLocation] = useLocation();
  const {PageSize} = useConfig()

  const Ctx = useContext(TraversalContext);
  const [state, setState] = useSetState(initialState);
  const { items, loading, total } = state;

  let search = location.get("q");
  let page;

  try {
    page = parseInt(location.get("page")) || 0;
  } catch {
    page = 0;
  }

  let searchParsed = undefined
  if (search && search !== "") {
    searchParsed = parser(search);
  }

  useEffect(() => {
    (async () => {
      let data;
      setState({ loading: true, total: Ctx.context.length });
      if (search) {
        let qs = buildQs(searchParsed);
        const res = await Ctx.client.search(
          Ctx.path,
          qs,
          false,
          false,
          page * PageSize,
          PageSize
        );
        data = await res.json();
      } else {
        data = await Ctx.client.getItems(Ctx.path, page * PageSize, PageSize);
      }
      setState({
        items: data.member,
        loading: false,
        total: data.items_count
      });
    })();
  }, [search, Ctx.state.path, Ctx.state.refresh, page]);

  const doPaginate = page => {
    setLocation({ page: page });
  };

  return (
    <React.Fragment>
      <div className="columns">
        <div className="column">
          <SearchLabels />
        </div>
        <div className="column">
          <Pagination
            current={page}
            total={total}
            doPaginate={doPaginate}
            pager={PageSize}
          />
        </div>
      </div>
      {loading && <div className="progress-line"></div>}
      {!loading && (
        <table className="table is-fullwidth is-hoverable">
          <thead className="is-size-7">
            <tr>
              <th></th>
              <th className="has-text-info">type</th>
              <th className="has-text-info">id/name</th>
              <th className="has-text-info">modified</th>
              <th className="has-text-info">created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items &&
              items.map(item => (
                <RItem item={item}
                  setPath={Ctx.setPath}
                  key={item["@uid"]}
                  search={search}
                  />
              ))}
            {items && items.length === 0 && (
              <tr>
                <td colSpan="6" className="has-text-centered">
                  Anything here!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </React.Fragment>
  );
}
