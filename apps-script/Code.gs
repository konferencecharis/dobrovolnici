/**
 * Příjem formuláře „Mám zájem“ (web dobrovolníků Konference CHARIS) do Google Tabulky.
 *
 * Skript je „vázaný“ na tabulku: vytvoř tabulku, v ní Rozšíření → Apps Script
 * a vlož sem tento kód. Postup je v NAVOD.md.
 */

var SHEET_NAME = "Zájemci";

var HEADERS = [
  "Čas odeslání",
  "Jméno a příjmení",
  "E-mail",
  "Telefon",
  "Služba",
  "Jak se dozvěděl(a)",
  "Poznámka",
  "Alespoň 15 let",
  "Souhlas se zpracováním údajů",
  "Verze textu souhlasu"
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var p = (e && e.parameter) || {};

    // Základní kontrola: povinná pole a souhlasy.
    if (!p.jmeno || !p.email || !p.telefon || !p.sluzba || p.vek15 !== "ano" || p.souhlas !== "ano") {
      return json_({ ok: false, error: "missing_fields" });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    }

    sheet.appendRow([
      new Date(),
      safe_(p.jmeno),
      safe_(p.email),
      safe_(p.telefon),
      safe_(p.sluzba),
      safe_(p.odkud),
      safe_(p.poznamka),
      p.vek15,
      p.souhlas,
      safe_(p.verzeSouhlasu)
    ]);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

// Jen pro ruční kontrolu v prohlížeči (otevři adresu Web App).
function doGet() {
  return ContentService.createTextOutput("Formulář zájemců běží.");
}

// Ochrana proti vložení vzorců do tabulky (text začínající = + - @ se uloží jako text).
function safe_(v) {
  var s = String(v == null ? "" : v).slice(0, 2000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
