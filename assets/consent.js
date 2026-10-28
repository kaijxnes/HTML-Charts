// Google Analytics, only after the visitor accepts.
// Nothing is loaded and no cookies are set until "Accept" is clicked. The choice is
// remembered in this browser and can be changed any time from "Cookie settings" in the footer.
// This file is for the website only – the chart scripts never load analytics.
(function () {
  var GA_ID = "G-BLRH4TTCP9";
  var KEY = "hc-analytics";            // "granted" or "denied"
  var loaded = false;

  function getChoice() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setChoice(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function loadGA() {
    if (loaded) return;
    loaded = true;
    window["ga-disable-" + GA_ID] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    gtag("js", new Date());
    gtag("config", GA_ID);              // cookie domain "auto" → shared with kaijxnes.com
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
  }

  function stopGA() {
    window["ga-disable-" + GA_ID] = true;
    if (window.gtag) gtag("consent", "update", { analytics_storage: "denied" });
    // remove any Google Analytics cookies already set, on this host and the parent domain
    var host = location.hostname, parts = host.split("."), domains = ["", host];
    for (var i = 1; i < parts.length - 1; i++) domains.push("." + parts.slice(i).join("."));
    document.cookie.split(";").forEach(function (c) {
      var name = c.split("=")[0].trim();
      if (name === "_ga" || name.indexOf("_ga_") === 0 || name === "_gid" || name === "_gat") {
        domains.forEach(function (d) {
          document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + (d ? "; domain=" + d : "");
        });
      }
    });
  }

  var banner = null;
  function showBanner() {
    if (banner) { banner.hidden = false; banner.querySelector("button").focus(); return; }
    banner = document.createElement("div");
    banner.className = "consent";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.setAttribute("aria-label", "Analytics cookies");
    var current = getChoice();
    banner.innerHTML =
      '<p><b>Analytics cookies</b> Can I use Google Analytics to see which pages are useful? It sets cookies and is only switched on if you accept. ' +
      '<a href="/privacy">How it\'s used</a>' + (current ? ' <span class="now">Currently: ' + (current === "granted" ? "accepted" : "declined") + '.</span>' : "") + '</p>' +
      '<div class="consent-btns"><button type="button" class="ok" data-c="granted">Accept analytics</button><button type="button" class="no" data-c="denied">Decline</button></div>';
    document.body.appendChild(banner);
    banner.querySelectorAll("[data-c]").forEach(function (b) {
      b.addEventListener("click", function () {
        var v = b.getAttribute("data-c");
        setChoice(v);
        if (v === "granted") loadGA(); else stopGA();
        banner.hidden = true;
      });
    });
  }

  function init() {
    var c = getChoice();
    if (c === "granted") loadGA();
    else if (c !== "denied") showBanner();
    document.querySelectorAll("[data-cookie-settings]").forEach(function (b) {
      b.addEventListener("click", function () { if (banner) { banner.remove(); banner = null; } showBanner(); });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
