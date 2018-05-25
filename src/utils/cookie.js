export const get = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}
export const set= (name, value, days, cross_subdomain, is_secure) => {
  let cdomain = "",
    expires = "",
    secure = "";
  if (cross_subdomain) {
    const matches = document.location.hostname.match(/[a-z0-9][a-z0-9\-]+\.[a-z\.]{2,6}$/i),
      domain = matches ? matches[0] : '';
    cdomain = ((domain) ? "; domain=." + domain : "");
  }
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toGMTString();
  }
  if (is_secure) {
    secure = "; secure";
  }
  document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/" + cdomain + secure;
}

export const remove=(name, cross_subdomain) => {
  set(name, '', -1, cross_subdomain);
}