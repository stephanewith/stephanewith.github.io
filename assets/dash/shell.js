/* Shared dashboard shell: nav + Motion reveals. Reads <body data-region>
   ("apac" | "eu") and data-article (path to the write-up). */
(function () {
  var body = document.body;
  var region = body.getAttribute("data-region");
  var article = body.getAttribute("data-article");
  var nav = document.createElement("nav");
  nav.className = "dk-nav";
  nav.setAttribute("aria-label", "Site");
  nav.innerHTML =
    '<a class="dk-home" href="/"><span aria-hidden="true">&larr;</span><b>Stef With</b></a>' +
    '<span class="dk-switch" role="group" aria-label="Region">' +
    '<a href="/apac-ai-marketing-dash/"' + (region === "apac" ? ' aria-current="page"' : "") + ">APAC</a>" +
    '<a href="/eu-ai-marketing-dash/"' + (region === "eu" ? ' aria-current="page"' : "") + ">Europe</a>" +
    "</span>" +
    (article ? '<a class="dk-read" href="' + article + '"><span class="long">Read the findings</span><span class="short">Findings</span><span class="arr" aria-hidden="true">&rarr;</span></a>' : "");
  body.insertBefore(nav, body.firstChild);

  var M = window.Motion;
  if (!M) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ease = [0.23, 1, 0.32, 1];
  var seen = new WeakSet();
  var selector = ".dash-card, .card, .dk-reveal";

  function reveal(el, i) {
    if (seen.has(el)) return;
    seen.add(el);
    el.style.opacity = "0";
    M.inView(
      el,
      function () {
        if (reduce) {
          M.animate(el, { opacity: [0, 1] }, { duration: 0.3 });
          return;
        }
        M.animate(el, { opacity: [0, 1], y: [18, 0] }, { duration: 0.7, ease: ease, delay: Math.min(i, 6) * 0.05 });
      },
      { margin: "0px 0px -8% 0px" }
    );
  }
  function scan() {
    var els = document.querySelectorAll(selector);
    var n = 0;
    for (var i = 0; i < els.length; i++) if (!seen.has(els[i])) reveal(els[i], n++);
  }
  var pending = false;
  new MutationObserver(function () {
    if (pending) return;
    pending = true;
    requestAnimationFrame(function () { pending = false; scan(); });
  }).observe(document.getElementById("root") || body, { childList: true, subtree: true });
  scan();
})();
