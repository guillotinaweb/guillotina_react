from guillotina import configure

configure.role("guillotina.Searcher", "Searcher", "can search content", True)
configure.grant(permission="guillotina.SearchContent", role="guillotina.Searcher")
