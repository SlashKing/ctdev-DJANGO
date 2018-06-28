
export function getProtocol(){
	switch(window.location.protocol){
		case 'http:':
			return 'http:\/\/'
		case 'https:':
			return 'https:\/\/'
		default: 
			return 'http:\/\/'
	}
}

export const DOMAIN_EP = '192.168.0.13:8000/'
export const DJANGO_EP = ''
export const BASE_ENDPOINT = "".concat(getProtocol(),DOMAIN_EP)
export const API_EP =  BASE_ENDPOINT + 'api\/'
export const MEDIA_EP = BASE_ENDPOINT + 'media\/'
export function setupApiEndpoint(trailing_url){
	const endpoint = "".concat(API_EP,trailing_url)
	return endpoint
}
export function setupEndpoint(trailing_url){
	const endpoint = "".concat(BASE_ENDPOINT,trailing_url)
return endpoint
}