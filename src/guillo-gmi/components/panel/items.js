import React from "react";
import { useContext } from "react";
import { useSetState } from "react-use";
import { useEffect } from "react";
import { TraversalContext } from "../../contexts";
import { RItem } from "../item";
import { Pagination } from "../pagination";
import { SearchLabels } from "../../components/searchLabels";
import { buildQs } from "../../lib/search";

const initialState = {
  page: 0,
  items: [],
  loading: true,
  total: 0
};

export function PanelItems(props) {
  const Ctx = useContext(TraversalContext);
  const [state, setState] = useSetState(initialState);
  const { items, page, loading, total } = state;
  const { search, searchParsed } = Ctx.state;

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
          page * Ctx.PAGE_SIZE
        );
        data = await res.json();
      } else {
        data = await Ctx.client.getItems(Ctx.path, page * Ctx.PAGE_SIZE);
      }
      setState({
        items: data.member,
        loading: false,
        total: search ? data.items_count : Ctx.context.length
      });
    })();
  }, [search, searchParsed, page, Ctx.context]);

  const doPaginate = page => setState({ loading: true, page });

  return (
    <React.Fragment>
      <div className="columns">
        <div className="column">
          <SearchLabels />
        </div>
        <div className="column">
          <Pagination
            current={state.page}
            total={total}
            doPaginate={doPaginate}
            pager={Ctx.PAGE_SIZE}
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
            {items.map(item => (
              <RItem item={item} setPath={Ctx.setPath} key={item["@uid"]} />
            ))}
            {items.length === 0 && (
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
