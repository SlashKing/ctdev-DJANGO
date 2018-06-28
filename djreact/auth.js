module.exports = {
    login: function(username, pass, cb) {
        this.getToken(username, pass, (res) => {
            if (res.authenticated) {
                localStorage.token = res.token
                if (cb) cb(true)
            } else {
                if (cb) cb(false)
            }
        })
    },        
    
    logout: function() {
        delete localStorage.token
    },

    loggedIn: function() {
        return !!localStorage.token
    },
	getCookie: function(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1);
			if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
		}
		return "";
	}, 
    getToken: function(username, pass, cb) {
        $.ajax({
            type: 'POST',
            url: '/obtain-auth-token/',
            data: {
                username: username,
                password: pass
            },
			
            success: function(res){
                cb({
                    authenticated: true,
                    token: res.token,
                })
            },
            error: (xhr, status, err) => {
                cb({
                    authenticated: false,
					csrfcookie: localStorage.cookie
                })
            },
		crossDomain:false,
		beforeSend: function(jqXHR, settings) {
				jqXHR.setRequestHeader("X-CSRFToken", localStorage.cookie);
			}
        })
    }, 
}