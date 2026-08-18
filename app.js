if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" }).catch(function () {});
}

// Channels widget loader (shared bundle, global feed).
(function () {
  var WIDGET_SRC = "https://colonialbeachapp.com/channels-widget.js";
  var statusEl = document.getElementById("status");
  var rootEl = document.getElementById("channels-root");
  function showFallback() {
    if (!statusEl) return;
    statusEl.innerHTML =
      "<div style='font-size:34px;margin-bottom:10px'>&#128250;</div>" +
      "<div>Couldn't load the channels right now.</div>" +
      "<div style='margin-top:8px;font-size:13px;opacity:.8'>Check your connection and refresh, " +
      "or open them at <a href='https://colonialbeachapp.com' target='_blank' rel='noopener'>colonialbeachapp.com</a>.</div>";
  }
  function hideSplash() {
    var splash = document.getElementById("splash");
    if (!splash) return;
    splash.style.opacity = "0";
    setTimeout(function () {
      if (splash && splash.parentNode) splash.parentNode.removeChild(splash);
    }, 600);
  }
  function mount() {
    try {
      if (window.CBChannels && typeof window.CBChannels.mount === "function") {
        if (statusEl && statusEl.parentNode) statusEl.parentNode.removeChild(statusEl);
        window.CBChannels.mount(rootEl, { showStage: false });
        return true;
      }
    } catch (_) {}
    return false;
  }
  var tries = 0;
  function waitForApi() {
    if (mount()) return;
    if (++tries > 40) {
      showFallback();
      return;
    }
    setTimeout(waitForApi, 250);
  }
  var script = document.createElement("script");
  script.src = WIDGET_SRC;
  script.async = true;
  script.onload = waitForApi;
  script.onerror = showFallback;
  document.head.appendChild(script);
  window.addEventListener("load", function () { setTimeout(hideSplash, 700); });
  setTimeout(hideSplash, 2500);
})();

// Add-to-Home-Screen prompt.
(function () {
  var KEY = "elc_a2hs_dismissed_v1";
  var bar = document.getElementById("a2hs");
  var txt = document.getElementById("a2hs-text");
  var addBtn = document.getElementById("a2hs-add");
  var xBtn = document.getElementById("a2hs-x");
  var deferred = null;
  var SHARE = '<svg class="gly" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#30d8c0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4"/><path d="M8 8l4-4 4 4"/><path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>';
  var PLUS = '<svg class="gly" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#30d8c0" stroke-width="2" stroke-linecap="round"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8M8 12h8"/></svg>';

  function standalone() { return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true; }
  function snoozed() {
    try {
      var time = +localStorage.getItem(KEY) || 0;
      return (Date.now() - time) < 14 * 864e5;
    } catch (_) { return false; }
  }
  function remember() { try { localStorage.setItem(KEY, String(Date.now())); } catch (_) {} }
  function hide() { bar.classList.remove("show"); }
  function isIOS() { return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); }
  function show(mode) {
    if (standalone() || snoozed()) return;
    if (mode === "ios") {
      addBtn.style.display = "none";
      txt.innerHTML = "Tap " + SHARE + " in the toolbar, then <b>Add to Home Screen</b> " + PLUS + ".";
    } else {
      addBtn.style.display = "";
      txt.textContent = "Get full-screen, one-tap access.";
    }
    bar.classList.add("show");
  }
  window.addEventListener("beforeinstallprompt", function (event) {
    event.preventDefault();
    deferred = event;
    show("button");
  });
  window.addEventListener("appinstalled", function () { remember(); hide(); });
  addBtn.addEventListener("click", function () {
    if (!deferred) return;
    deferred.prompt();
    if (deferred.userChoice && deferred.userChoice.then) {
      deferred.userChoice.then(function () { deferred = null; remember(); hide(); });
    } else {
      deferred = null;
      remember();
      hide();
    }
  });
  xBtn.addEventListener("click", function () { remember(); hide(); });
  setTimeout(function () {
    if (standalone() || snoozed()) return;
    if (isIOS()) show("ios");
  }, 3400);
})();

if ("serviceWorker" in navigator) {
  var refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", function () {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}
