/**
 * DEFINE GLOBAL ROUTES description: Global route constants
 */
// ROOT
export const ROUTE_ROOT = '\/'
export const LOCAL = ROUTE_ROOT + 'local\/'


/**
 * SEARCH ROUTES
 */
export const SEARCH = ROUTE_ROOT + 'search\/'
export const SEARCH_POSTS = SEARCH + 'posts\/'
export const SEARCH_USERS = SEARCH + 'users\/'
export const SEARCH_FRIENDS = SEARCH + 'friends\/'
export const SEARCH_HASHTAGS = SEARCH + 'hashtags\/'
export const SEARCH_FOLLOWING = SEARCH + 'following\/'
export const SEARCH_FOLLOWERS = SEARCH + 'followers\/'


/**
 * NOTIFICATIONS ROUTES
 */
export const NOTIFICATIONS = ROUTE_ROOT + 'notifications\/'
export const NOTIFICATIONS_UNREAD = NOTIFICATIONS + 'unread\/'


/**
 * PROFILE ROUTES
 */
export const PROFILE = ROUTE_ROOT + 'profile\/'
export function PROFILE_USER (username) { return PROFILE + username + '\/' }
export function PROFILE_IMAGES(username) { return PROFILE_USER(username) + 'images\/'}
export function PROFILE_VIDEOS(username) { return PROFILE_USER(username) + 'videos\/'}

/**
 * SETTINGS ROUTES
 */
export function PROFILE_SETTINGS(username) { return PROFILE_USER(username) + 'settings\/'}
export function PROFILE_SETTINGS_ABOUT(username) { return PROFILE_SETTINGS(username) + 'about\/'}
export function PROFILE_SETTINGS_UNAME(username) { return PROFILE_SETTINGS(username) + 'username\/'}
export function PROFILE_SETTINGS_CPASSWORD(username) { return PROFILE_SETTINGS(username) + 'change-password\/'}
export function PROFILE_SETTINGS_LPASSWORD(username) { return PROFILE_SETTINGS(username) + 'lost-password\/'}  
export function PROFILE_SETTINGS_GENDER(username) { return PROFILE_SETTINGS(username) + 'gender\/'}
export function PROFILE_SETTINGS_GENERAL(username) { return PROFILE_SETTINGS(username) + 'general\/'}  
export function PROFILE_SETTINGS_PRIVACY(username) { return PROFILE_SETTINGS(username) + 'privacy\/'}
export function PROFILE_SETTINGS_REL_STATUS(username) { return PROFILE_SETTINGS(username) + 'relationship-status\/'}
export function PROFILE_SETTINGS_INTERESTED_IN(username) { return PROFILE_SETTINGS(username) + 'interested-in\/'}
export function PROFILE_SETTINGS_EMAIL(username) { return PROFILE_SETTINGS(username) + 'email\/'}
export function PROFILE_SETTINGS_BDAY(username) { return PROFILE_SETTINGS(username) + 'birthday\/'}
