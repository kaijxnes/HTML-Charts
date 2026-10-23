// Copy buttons on the docs pages (copies to the viewer's own clipboard only).
document.querySelectorAll("[data-copy]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    var el = document.getElementById(btn.getAttribute("data-copy"));
    if (!el) return;
    var text = el.textContent;
    var done = function () {
      btn.textContent = "Copied";
      btn.classList.add("done");
      setTimeout(function () { btn.textContent = "Copy"; btn.classList.remove("done"); }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { select(el); });
    } else select(el);
  });
});
function select(el) {
  var r = document.createRange(); r.selectNodeContents(el);
  var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
}

// Chart list filters on the home page (type, number of metrics, dimensions, date column, search)
(function () {
  var box = document.querySelector(".filters");
  if (!box) return;
  var cards = Array.prototype.slice.call(document.querySelectorAll(".cards .card"));
  var f = { type: "", m: "", d: "", time: "", q: "" };
  var none = document.querySelector(".noresult"), cnt = box.querySelector("[data-count]");
  function apply() {
    var shown = 0;
    cards.forEach(function (c) {
      var ok = true, m0 = +c.dataset.m0, m1 = +c.dataset.m1, d0 = +c.dataset.d0, d1 = +c.dataset.d1;
      if (f.type && (" " + c.dataset.types + " ").indexOf(" " + f.type + " ") < 0) ok = false;
      if (f.m) { var n = +f.m; if (n >= 4 ? m1 < 4 : (n < m0 || n > m1)) ok = false; }
      if (f.d !== "" && (+f.d < d0 || +f.d > d1)) ok = false;
      if (f.time !== "" && c.dataset.time !== f.time) ok = false;
      if (f.q && c.dataset.text.indexOf(f.q) < 0) ok = false;
      c.hidden = !ok;
      if (ok) shown++;
    });
    cnt.textContent = shown;
    if (none) none.hidden = shown > 0;
  }
  box.querySelectorAll(".chip").forEach(function (b) {
    b.addEventListener("click", function () {
      var g = b.dataset.f;
      box.querySelectorAll('.chip[data-f="' + g + '"]').forEach(function (x) { x.classList.toggle("on", x === b); });
      f[g] = b.dataset.v;
      apply();
    });
  });
  box.querySelector(".fsearch").addEventListener("input", function (e) { f.q = e.target.value.trim().toLowerCase(); apply(); });
})();
