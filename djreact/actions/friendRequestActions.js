import * from '../common/constants/actiontypes/friendRequest'
import * from '../common/constants/endpoints/friendRequest'
export function sendFriendRequest() {
    return {type: SEND_FRIEND_REQUEST}
}
export function rejectFriendRequest() {
    return {type: REJECT_FRIEND_REQUEST}
}
export function acceptFriendRequest() {
    return {type: ACCEPT_FRIEND_REQUEST}
}
export function blockFriendRequest() {
    return {type: BLOCK_FRIEND_REQUEST}
}