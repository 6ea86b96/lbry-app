import * as types from 'constants/action_types'
import lbry from 'lbry'
import lbryio from 'lbryio';
import rewards from 'rewards'

export function doFetchRewards() {
  return function(dispatch, getState) {
    const state = getState()

    dispatch({
      type: types.FETCH_REWARDS_STARTED,
    })

    lbryio.call('reward', 'list', {}).then(function(userRewards) {
      dispatch({
        type: types.FETCH_REWARDS_COMPLETED,
        data: { userRewards }
      })
    });
  }
}

export function doClaimReward(reward) {
  return function(dispatch, getState) {
    dispatch({
      type: types.CLAIM_REWARD_STARTED,
      data: { reward }
    })
    try {
      const success = (reward) => {
        dispatch({
          type: types.CLAIM_REWARD_COMPLETED,
          data: {
            reward
          }
        })
        dispatch(doFetchRewards())
      }
      const failure = (error) => {
        dispatch({
          type: types.CLAIM_REWARD_FAILED,
          data: {
            reward,
            message: error.message,
          }
        })
      }
      rewards.claimReward(reward.reward_type).then(success, failure)
    } catch(err) {
      console.error(err)
    }
  }
}

export function doClearErrorMessage() {
  return {
    type: types.CLEAR_CLAIM_REWARD_ERROR,
  }
}
