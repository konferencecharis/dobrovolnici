(function () {
  "use strict";

  var cfg = window.CHARIS_CONFIG || {};
  var odkazy = cfg.odkazy || {};
  var open = cfg.registraceOtevrena === true;
  var kontaktPom = cfg.kontaktPomeranci || "detska.konference@gmail.com";
  var kontaktObec = cfg.kontaktObecny || "KCHK-CHO@email.cz";

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------- Kontakty z configu ---------- */
  $$("[data-contact]").forEach(function (a) {
    var mail = a.getAttribute("data-contact") === "pomeranci" ? kontaktPom : kontaktObec;
    a.textContent = mail;
    a.setAttribute("href", "mailto:" + mail);
  });

  /* ---------- Přepnutí registrace otevřena / zavřená ---------- */
  $$("[data-state]").forEach(function (el) {
    var visible = el.getAttribute("data-state") === (open ? "open" : "closed");
    if (visible) el.removeAttribute("hidden"); else el.setAttribute("hidden", "");
  });

  var mailBySluzba = { pomeranc: kontaktPom, citron: kontaktObec, jednorazove: kontaktObec };

  $$("[data-sluzba]").forEach(function (btn) {
    var key = btn.getAttribute("data-sluzba");
    if (open) {
      var url = odkazy[key];
      if (url) {
        btn.setAttribute("href", url);
        btn.setAttribute("target", "_blank");
        btn.setAttribute("rel", "noopener");
      } else {
        // Odkaz na Google Form ještě není vyplněný: nabídneme aspoň e-mail.
        btn.setAttribute("href", "mailto:" + mailBySluzba[key]);
      }
    } else {
      btn.addEventListener("click", function () { preselect(key); });
    }
  });

  // V otevřeném režimu vedou odkazy „Mám zájem“ v hlavičce a hero na výběr služby.
  if (open) {
    $$("[data-cta-zajem]").forEach(function (a) { a.setAttribute("href", "#sluzby"); });
  }

  var form = $("#zajem-form");

  function preselect(key) {
    if (!form) return;
    var radio = $('input[name="sluzba"][data-key="' + key + '"]', form);
    if (radio) {
      radio.checked = true;
      clearError(radio.closest("fieldset"));
    }
  }

  /* ---------- Modal s informacemi o zpracování údajů ---------- */
  var dlg = $("#gdpr-dialog");
  var lastTrigger = null;
  if (dlg) {
    $$("[data-open-gdpr]").forEach(function (b) {
      b.addEventListener("click", function () {
        lastTrigger = b;
        if (typeof dlg.showModal === "function") {
          dlg.showModal();
          document.body.classList.add("modal-open");
        } else {
          dlg.setAttribute("open", "");
        }
      });
    });
    function onClosed() {
      document.body.classList.remove("modal-open");
      if (lastTrigger) lastTrigger.focus();
    }
    function closeDialog() {
      if (typeof dlg.close === "function") dlg.close(); else dlg.removeAttribute("open");
      onClosed(); // nespoléháme jen na událost „close“
    }
    $$("[data-close-gdpr]").forEach(function (b) { b.addEventListener("click", closeDialog); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) closeDialog(); });
    dlg.addEventListener("close", onClosed); // zavření klávesou Esc
  }

  /* ---------- Formulář zájemců ---------- */
  if (!form) return;

  var statusEl = $("#f-status");
  var submitBtn = $("#f-submit");

  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  // české/slovenské číslo: volitelná předvolba (+420, 00420, +421, 00421), pak 9 číslic
  var phoneRe = /^(?:(?:\+|00)(?:420|421))?0?[1-9]\d{8}$/;

  function setError(input, id, msg) {
    var e = document.getElementById(id);
    if (e) e.textContent = msg;
    if (input && input.setAttribute) input.setAttribute("aria-invalid", "true");
  }

  function clearError(el) {
    if (!el) return;
    var inputs = el.matches && el.matches("input, textarea") ? [el] : $$("input, textarea", el);
    inputs.forEach(function (i) { i.removeAttribute("aria-invalid"); });
    var box = el.closest(".field");
    var e = box && $(".err", box);
    if (e) e.textContent = "";
  }

  function validate() {
    var first = null;
    function bad(input, id, msg, focusEl) {
      setError(input, id, msg);
      if (!first) first = focusEl || input;
    }
    // reset
    $$("[aria-invalid]", form).forEach(function (i) { i.removeAttribute("aria-invalid"); });
    $$(".err", form).forEach(function (e) { e.textContent = ""; });

    var jmeno = form.elements.jmeno;
    var email = form.elements.email;
    var telefon = form.elements.telefon;

    if (!jmeno.value.trim() || jmeno.value.trim().length < 2) bad(jmeno, "e-jmeno", "Napiš prosím své jméno a příjmení.");
    if (!email.value.trim()) bad(email, "e-email", "Napiš prosím svůj e-mail.");
    else if (!emailRe.test(email.value.trim())) bad(email, "e-email", "Tenhle e-mail nevypadá správně. Zkontroluj ho prosím.");

    var tel = telefon.value.replace(/[\s\-().\/]/g, "");
    if (!tel) bad(telefon, "e-telefon", "Napiš prosím své telefonní číslo.");
    else if (!phoneRe.test(tel)) bad(telefon, "e-telefon", "Zadej prosím české nebo slovenské číslo, např. 777 123 456 nebo +420 777 123 456.");

    var checked = $('input[name="sluzba"]:checked', form);
    if (!checked) {
      var firstRadio = $('input[name="sluzba"]', form);
      bad(null, "e-sluzba", "Vyber prosím, o jakou službu máš zájem (případně „Ještě nevím“).", firstRadio);
    }

    var vek = form.elements.vek15;
    if (!vek.checked) bad(vek, "e-vek", "Potvrď prosím, že ti v době konference bude alespoň 15 let.");

    var gdpr = form.elements.souhlas;
    if (!gdpr.checked) bad(gdpr, "e-gdpr", "Bez souhlasu se zpracováním osobních údajů ti nemůžeme dát vědět. Zaškrtni ho prosím.");

    if (first) { first.focus(); return false; }
    return true;
  }

  // průběžné mazání chyb při opravě
  form.addEventListener("input", function (e) {
    var t = e.target;
    if (t.getAttribute && t.getAttribute("aria-invalid")) clearError(t);
  });
  form.addEventListener("change", function (e) {
    var t = e.target;
    if (t.name === "sluzba") clearError(t.closest("fieldset"));
    if (t.type === "checkbox") clearError(t);
  });

  function showStatus(kind, html) {
    statusEl.className = "form__status " + (kind ? "is-" + kind : "");
    statusEl.innerHTML = html || "";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    showStatus("", "");
    if (!validate()) return;

    // Honeypot: robot ho vyplní, člověk ne. Tváříme se, že vše proběhlo.
    if (form.elements.web.value) {
      showStatus("ok", "Díky! Ozveme se ti, jakmile spustíme přihlašování – v lednu 2027.");
      form.reset();
      return;
    }

    var data = {
      jmeno: form.elements.jmeno.value.trim(),
      email: form.elements.email.value.trim(),
      telefon: form.elements.telefon.value.trim(),
      sluzba: $('input[name="sluzba"]:checked', form).value,
      odkud: form.elements.odkud.value.trim(),
      poznamka: form.elements.poznamka.value.trim(),
      vek15: "ano",
      souhlas: "ano",
      verzeSouhlasu: cfg.verzeSouhlasu || "2027-v1"
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Odesílám…";

    function done() {
      showStatus("ok", "Díky! Ozveme se ti, jakmile spustíme přihlašování – v lednu 2027.");
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = "Odeslat";
    }
    function fail() {
      showStatus("error", "Něco se nepovedlo a tvůj kontakt se neodeslal. Zkus to prosím znovu, nebo nám napiš na <a href=\"mailto:" + kontaktObec + "\">" + kontaktObec + "</a>.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Odeslat";
    }

    var endpoint = cfg.zajemciEndpoint;
    if (!endpoint) {
      // Testovací režim: endpoint není nastavený, jen vypíšeme do konzole.
      console.log("[CHARIS formulář – testovací režim, nic se neodesílá]", data);
      setTimeout(done, 400);
      return;
    }

    // Apps Script Web App nevrací CORS hlavičky, proto no-cors a „jednoduchý“ POST
    // (application/x-www-form-urlencoded). Odpověď nelze přečíst; úspěch = požadavek odešel.
    var body = new URLSearchParams(data).toString();
    fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: body
    }).then(done).catch(fail);
  });
})();
