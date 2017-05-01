import React from 'react';
import lbryio from 'lbryio.js';
import lbryuri from 'lbryuri.js';
import FileTile from 'component/fileTile';
import FileTileStream from 'component/fileTileStream'
import {ToolTip} from 'component/tooltip.js';

const communityCategoryToolTipText = ('Community Content is a public space where anyone can share content with the ' +
'rest of the LBRY community. Bid on the names "one," "two," "three," "four" and ' +
'"five" to put your content here!');

const FeaturedCategory = (props) => {
  const {
    category,
    names,
  } = props

  return (
    <div className="card-row card-row--small">
      <h3 className="card-row__header">{category}
        {category == 'Community Top Five' &&
          <ToolTip label="What's this?" body={communityCategoryToolTipText} className="tooltip--header" />}
      </h3>
      {names && names.map(name => <FileTile key={name} displayStyle="card" uri={lbryuri.normalize(name)} />)}
    </div>
  )
}

const DiscoverPage = (props) => {
  const {
    featuredContentByCategory,
  } = props

  const categories = Object.keys(featuredContentByCategory)

  return (
    <main>
      {categories.map(category =>
        <FeaturedCategory key={category} category={category} names={featuredContentByCategory[category]} />
      )}
    </main>
  )
}

export default DiscoverPage;
