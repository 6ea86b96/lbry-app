import React from 'react'
import {
  connect,
} from 'react-redux'
import {
  selectFetchingRewards,
  selectClaimedRewardsByType,
  makeSelectRewardByType,
  selectRewardsByType,
} from 'selectors/rewards'
import AuthOverlay from './view'

const makeSelect = () => {
  const selectRewardByType = makeSelectRewardByType()

  const select = (state) => ({
    fetchingRewards: selectFetchingRewards(state),
    claimedRewardsByType: selectClaimedRewardsByType(state),
    newUserReward: selectRewardByType(state, { reward_type: 'new_user' }),
    rewards: selectRewardsByType(state),
  })

  return select
}

const perform = (dispatch) => ({
})

export default connect(makeSelect, perform)(AuthOverlay)
