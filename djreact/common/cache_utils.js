export const cacheByKey = (key,index=null) => {
	try{
		const state = localStorage.getItem(key,[]);
		if (state === null) {
			return setCache(key,[]);
		}
		return index === null ? JSON.parse(state) : JSON.parse(localStorage.getItem(key,[]))[index];
	}catch(err){
		console.log(err)
		return undefined;
	}
}
export const setCache = (key, value, isArray=true) => {
	try{
		value = value === undefined && isArray ? [] : value;
		const state = JSON.stringify(value);
		localStorage.setItem(key, state);
	}catch(err){
		// log error to console
		// TODO: create debug log, dump to a file on the server for management
		console.log(err);
	}
}
export const removeAllTimeouts = () =>{  
	let id = setTimeout(() => { }, 0 );
	while ( id ) {                     
	   // console.log( id );
	   clearTimeout( id );            
	   id--;                          
	}        
	return true
}
export const clearTimeoutNotNeg = (intervalId) => {
	return intervalId  !== -1 ? clearTimeout(intervalId) : intervalId;
}