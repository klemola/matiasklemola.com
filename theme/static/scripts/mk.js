window.sa =
  window.sa ||
  function() {
    a = [].slice.call(arguments);
    sa.q ? sa.q.push(a) : (sa.q = [a]);
  };

window.addEventListener("load", () => {
  const consent = localStorage.getItem("mk-consent");
  setupTracking(consent);
  setupEvents();
});

function setupTracking(previousConsent) {
  const cookieConsentEl = document.getElementById("cc");
  const shouldNotTrack = navigator.doNotTrack === "1";
  const consentSet = previousConsent !== null;

  if (shouldNotTrack || consentSet || cookieConsentEl === null) {
    sa("sa_cookie", previousConsent === "approved" && !shouldNotTrack);
    return;
  }

  cookieConsentEl.className = "cookie-consent";

  window.setTracking = trackingAllowed => {
    cookieConsentEl.className = "cookie-consent--hidden";
    sa("sa_cookie", !!trackingAllowed);
    localStorage.setItem("mk-consent", trackingAllowed ? "approved" : "disallowed");
  };
}

function setupEvents() {
  const articleFooter = document.getElementById("af");
  let articleRead = false;

  window.addEventListener(
    "scroll",
    throttle(() => {
      if (!articleRead && hasUserScrolledToEL(articleFooter)) {
        articleRead = true;
        sa("article_read");
      }
    }, 100)
  );
}

function hasUserScrolledToEL(el) {
  if (!el) return false;

  const rect = el.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;

  return rect.top <= windowHeight && rect.top + rect.height >= 0;
}

function throttle(callback, limit) {
  var wait = false;
  return function() {
    if (!wait) {
      callback.apply(null, arguments);
      wait = true;
      setTimeout(function() {
        wait = false;
      }, limit);
    }
  };
}
