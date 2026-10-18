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
