import * as types from 'constants/action_types'

const reducers = {}
const defaultState = {
}

reducers[types.FETCH_REWARDS_STARTED] = function(state, action) {
  const newRewards = Object.assign({}, state.rewards, {
    fetching: true,
  })

  return Object.assign({}, state, newRewards)
}

reducers[types.FETCH_REWARDS_COMPLETED] = function(state, action) {
  const {
    userRewards,
  } = action.data

  const byRewardType = {}
  userRewards.forEach(reward => byRewardType[reward.reward_type] = reward)
  const newRewards = Object.assign({}, state.rewards, {
    byRewardType: byRewardType,
    fetching: false
  })

  return Object.assign({}, state, newRewards)
}

reducers[types.CLAIM_REWARD_STARTED] = function(state, action) {
  const {
    reward,
  } = action.data

  const newRewards = Object.assign({}, state, {
    claiming: reward.reward_type,
    errorMessage: undefined,
  })

  return Object.assign({}, state, newRewards)
}

reducers[types.CLAIM_REWARD_COMPLETED] = function(state, action) {
  return Object.assign({}, state, {
    claiming: false,
    errorMessage: undefined,
  })
}

reducers[types.CLAIM_REWARD_FAILED] = function(state, action) {
  const {
    message,
  } = action.data

  return Object.assign({}, state, {
    claiming: false,
    errorMessage: message,
  })
}

reducers[types.CLEAR_CLAIM_REWARD_ERROR] = function(state, action) {
  return Object.assign({}, state, {
    errorMessage: undefined,
  })
}

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
