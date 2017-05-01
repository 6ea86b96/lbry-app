import React from 'react';
import lbry from 'lbry';
import lbryio from 'lbryio';
import lbryuri from 'lbryuri';
import lighthouse from 'lighthouse';
import FileTile from 'component/fileTile'
import FileTileStream from 'component/fileTileStream'
import Link from 'component/link'
import {ToolTip} from 'component/tooltip';
import {BusyMessage} from 'component/common';

const fetchResultsStyle = {
  color: '#888',
  textAlign: 'center',
  fontSize: '1.2em'
}

const SearchActive = (props) => {
  return (
    <div style={fetchResultsStyle}>
      <BusyMessage message="Looking up the Dewey Decimals" />
    </div>
  )
}

const searchNoResultsStyle = {
  textAlign: 'center'
}, searchNoResultsMessageStyle = {
  fontStyle: 'italic',
  marginRight: '5px'
};

const SearchNoResults = (props) => {
  const {
    query,
  } = props

  return (
    <section style={searchNoResultsStyle}>
      <span style={searchNoResultsMessageStyle}>No one has checked anything in for {query} yet.</span>
      <Link label="Be the first" href="?publish" />
    </section>
  )
}

const SearchResults = (props) => {
  const {
    results
  } = props

  const rows = [],
      seenNames = {}; //fix this when the search API returns claim IDs

  for (let {name, claim, claim_id, channel_name, channel_id, txid, nout} of results) {
    const uri = lbryuri.build({
      channelName: channel_name,
      contentName: name,
      claimId: channel_id || claim_id,
    });

    rows.push(
      <FileTileStream key={uri} uri={uri} />
    );
  }

  return (
    <div>{rows}</div>
  )
}

const SearchPage = (props) => {
  const isValidUri = (query) => true
  const {
    query,
  } = props

  return (
    <main className="main--single-column">
      { isValidUri(query) ?
        <section className="section-spaced">
          <h3 className="card-row__header">
            Exact URL
            <ToolTip label="?" body="This is the resolution of a LBRY URL and not controlled by LBRY Inc." className="tooltip--header" />
          </h3>
          <FileTile uri={query} showEmpty={true} />
        </section> : '' }
      <section className="section-spaced">
        <h3 className="card-row__header">
          Search Results for {query}
          <ToolTip label="?" body="These search results are provided by LBRY, Inc." className="tooltip--header" />
        </h3>
        <SearchResults query={query} />
      </section>
    </main>
  )
}

export default SearchPage
