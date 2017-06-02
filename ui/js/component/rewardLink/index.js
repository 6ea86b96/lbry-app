import React from 'react'
import {
  connect,
} from 'react-redux'
import {
  makeSelectHasClaimedReward,
  selectClaimingReward,
  selectErrorMessage,
} from 'selectors/rewards'
import {
  doClaimReward,
  doClearErrorMessage,
} from 'actions/rewards'
import RewardLink from './view'

const makeSelect = () => {
  const selectHasClaimedReward = makeSelectHasClaimedReward()

  const select = (state, props) => ({
    claimed: selectHasClaimedReward(state, props),
    currentlyClaimingReward: selectClaimingReward(state),
    errorMessage: selectErrorMessage(state),
  })

  return select
}

const perform = (dispatch) => ({
  claimReward: (reward) => dispatch(doClaimReward(reward)),
  clearError: () => dispatch(doClearErrorMessage()),
})

export default connect(makeSelect, perform)(RewardLink)
