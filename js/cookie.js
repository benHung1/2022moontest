function setCookie(c_name, value, expiredays, domain) {
    var _exdate = new Date();
    _exdate.setDate(_exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + ";domain=" + domain + ";path=/" + ((expiredays == null) ? "" : ";expires=" + _exdate.toGMTString())
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};
