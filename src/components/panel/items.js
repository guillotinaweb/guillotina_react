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
  loading: true
};

export function PanelItems(props) {
  const Ctx = useContext(TraversalContext);
  const [state, setState] = useSetState(initialState);
  const { items, page, loading } = state;
  const {search, searchParsed} = Ctx.state

  useEffect(() => {
    (async () => {
      let data;
      setState({ loading: true });
      if (search) {
        let qs = buildQs(searchParsed);
        const res = await Ctx.client.search(Ctx.path, qs, false, false, page);
        data = await res.json()
      } else {
        data = await Ctx.client.getItems(Ctx.path, page * Ctx.PAGE_SIZE);
      }
      setState({
        items: data.member,
        loading: false
      });
    })();
  }, [search, searchParsed, page, Ctx.context]);

  const doPaginate = page => setState({ loading: true, page });

  return (
    <>
      <div className="columns">
        <div className="column">
          <SearchLabels />
        </div>
        <div className="column">
          <Pagination
            current={state.page}
            total={Ctx.context.length}
            doPaginate={doPaginate}
            pager={Ctx.PAGE_SIZE}
          />
        </div>
      </div>
      {loading && <div className="progress-line"></div>}
      {!loading && (
        <table className="table is-fullwidth is-hoverable">
          <thead class="is-size-7">
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
                <td colspan="6" className="has-text-centered">
                  Anything here!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </>
  );
}
