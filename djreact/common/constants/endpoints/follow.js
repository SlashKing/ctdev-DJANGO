import API_EP from './config'
const f_s = '\/'
export const FOLLOWS = ''.concat('follows',f_s)
export const MY_FOLLOWING = ''.concat(FOLLOWS,'my_following\/')
export const MY_FOLLOWERS = ''.concat(FOLLOWS,'my_followers\/')
export function getFollowersFor(user_id) { return ''.concat(FOLLOWS,user_id,f_s,'followers',f_s)}
export function getFollowingFor(user_id) { return ''.concat(FOLLOWS,user_id,f_s,'following', f_s)}
export function addFollow(user_id) { return ''.concat('follows',f_s,user_id,f_s,'follow',f_s)}
export function removeFollow(user_id) { return ''.concat('follows',f_s,user_id,f_s,'remove_follow', f_s)}
export const FOLLOW_BLOCK_EP = ''.concat(API_EP, f_s,'follows',f_s,'block',f_s)