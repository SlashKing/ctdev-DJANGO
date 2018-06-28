import ENDPOINT from './config'
export const FRIEND_ADD_EP = ''.concat(ENDPOINT,'\/friends\/')
export function rejectRequest(id) { return ''.concat('friendrequests\/',id,'\/reject','\/') }
export function acceptRequest(id) { return ''.concat('friendrequests\/',id,'\/accept\/') }
export function cancelRequest(id) { return ''.concat('friendrequests\/',id,'\/cancel\/') }
export function getSentRequest(id) { return ''.concat('friendrequests\/',id,'\/sent_request\/') }
export function getReceivedRequest(id) { return ''.concat('friendrequests\/',id,'\/received_request\/') }

//unused
//export function FRIEND_REQUEST_BLOCK_EP(id) { ''.concat(ENDPOINT,'\/,','friendrequests',id,'\/block\/' }