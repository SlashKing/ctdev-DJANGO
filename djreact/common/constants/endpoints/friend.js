import ENDPOINT from './config'
export const FRIENDS_URL = "friends\/"
export const ADD_FRIEND = ''.concat('friends','\/')
export const BLOCK_FRIEND = ''.concat('friends','\/','block','\/')
export function removeFriend(id) { return ''.concat('friends','\/',id, '\/','remove','\/')}