import fetch from "isomorphic-fetch"

export function request(url, options, success, error400, error, failure) {
  let headers = new Headers()
  if(options["form"] === "true"){
	if(options["multipart"] === "true"){
  		headers.append("Content-Type", "multipart/form-data;boundary=63c5979328c44e2c869349443a94200e")
	}else{
  		headers.append("Content-Type", "application/x-www-form-urlencoded;charset=utf-8")
	}
  }	else{
  		headers.append("Content-Type", "application/json;charset=utf-8")
  }
	//else{
  	//	headers.append("Content-Type", "application/x-www-form-urlencoded;charset=utf-8,application/json")
  	//}
  
  headers.append("Accept", "application/json, application/xml, text/plain, text/html, *.*")
  headers.append('Authorization', 'JWT ' + localStorage.token)
  headers.append('X-CSRFToken', localStorage.cookie)
  headers.append('X-Requested-With', 'XMLHttpRequest')
  options["headers"] = headers
  console.log(url)
  return fetch(url, options)
    .then(res => {
      if (res.status >= 200 && res.status < 300) {
        // for anything in 200-299 we expect our API to return a JSON response
		if(res.status === 204){
			res.text().then(json=>{return success(json)})
		}else{
				console.log(res)
				res.json().then(json => { 
					return success(json) })
		}
      } else if (res.status === 400) {
        // even for 400 we expect a JSON response with form errors
		console.log(res)
        res.json().then(json => { return error400(json) })
      } else {
        // For all other errors we are not sure if the response is JSON,
        // so we just want to display a generic error
        return error(res)
      }
    }).catch((ex) => { return failure(ex) })
}
export function is_this_user(me, you){
	return me == you ? true : false;
}
//below taken from http://www.howtocreate.co.uk/tutorials/javascript/browserwindow
export function getScrollXY() {
    var scrOfX = 0, scrOfY = 0;
    if( typeof( window.pageYOffset ) == 'number' ) {
        //Netscape compliant
        scrOfY = window.pageYOffset;
        scrOfX = window.pageXOffset;
    } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
        //DOM compliant
        scrOfY = document.body.scrollTop;
        scrOfX = document.body.scrollLeft;
    } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
        //IE6 standards compliant mode
        scrOfY = document.documentElement.scrollTop;
        scrOfX = document.documentElement.scrollLeft;
    }
    return [ scrOfX, scrOfY ];
}

//taken from http://james.padolsey.com/javascript/get-document-height-cross-browser/
export function getDocHeight() {
    var D = document;
    return Math.max(
        D.body.scrollHeight, D.documentElement.scrollHeight,
        D.body.offsetHeight, D.documentElement.offsetHeight,
        D.body.clientHeight, D.documentElement.clientHeight
    );
}

//document.addEventListener("scroll", function (event) {
//    if (getDocHeight() == getScrollXY()[1] + window.innerHeight) {
//        alert("Yup");
//    }
//});