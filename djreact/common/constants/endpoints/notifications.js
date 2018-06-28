export const NOTIFICATIONS_URL = "notifications\/"
export const NOTIFICATIONS_LIMIT = "?limit=10"
export const NOTIFICATIONS_MARK_ALL_READ = NOTIFICATIONS_URL + "mark_all_as_read\/"
export const NOTIFICATIONS_MARK_AS_READ = (id) => NOTIFICATIONS_URL + id + "\/" + "mark_as_read\/"
export const NOTIFICATIONS_MARK_AS_UNREAD = (id) => NOTIFICATIONS_URL + id + "\/" + "mark_as_unread\/"
export const NOTIFICATIONS_MARK_AS_DELETED = (id) => NOTIFICATIONS_URL + id + "\/" + "mark_as_deleted\/"
export const NOTIFICATIONS_MARK_AS_UNDELETED = (id) => NOTIFICATIONS_URL + id + "\/" + "mark_as_undeleted\/"
export const NOTIFICATIONS_UNREAD = NOTIFICATIONS_URL + "unread\/"