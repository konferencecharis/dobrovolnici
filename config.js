// ============================================================
//  Konfigurace webu „Staň se dobrovolníkem na Konferenci CHARIS“
//  Tohle je jediný soubor, který budeš potřebovat upravit.
// ============================================================
window.CHARIS_CONFIG = {

  // PŘEPÍNAČ PŘIHLAŠOVÁNÍ
  //  false = přihlašování ještě neběží: tlačítka na kartách vedou na formulář
  //          „Mám zájem“ na webu a texty říkají „přihlašování spustíme v lednu 2027“.
  //  true  = přihlašování běží: tlačítka na kartách vedou rovnou na Google Form
  //          (v novém okně), formulář zájemců a texty „nech nám kontakt“ se skryjí.
  registraceOtevrena: false,          // v lednu přepni na true

  // ODKAZY NA GOOGLE FORMY (použijí se jen při registraceOtevrena: true)
  // Vlož celou adresu formuláře, např. "https://forms.gle/xxxxxxxx".
  // Pokud nějaký odkaz zůstane prázdný, tlačítko otevře e-mail na příslušný kontakt.
  odkazy: {
    pomeranc: "",                     // URL Google Formu pro pomeranče
    citron: "https://forms.gle/EKaNk1pqYD5LDk5q7",                       // URL Google Formu pro citrony
    jednorazove: ""                   // URL Google Formu pro jednorázovou pomoc
  },

  // ADRESA APPS SCRIPT WEB APP pro formulář zájemců (viz apps-script/NAVOD.md).
  // Dokud je prázdná, formulář nic neodesílá: jen vypíše data do konzole
  // prohlížeče a ukáže úspěšnou hlášku (slouží k testování).
  zajemciEndpoint: "https://script.google.com/macros/s/AKfycbwME0vZZIQRFkcH1iHp8eJ_VerHGtPrLY8nGaFZm7K-sIzrOssETXzdLJ9r5o2Ax8AkSQ/exec",

  // KONTAKTY (zobrazují se na webu a používají se i v textu o osobních údajích)
  kontaktPomeranci: "detska.konference@gmail.com", // pomeranči (dětská konference)
  kontaktObecny: "KCHK-CHO@email.cz",              // citroni, jednorázová pomoc, obecné dotazy, GDPR a odvolání souhlasu

  // VERZE TEXTU SOUHLASU – ukládá se do tabulky u každé odpovědi.
  // Když změníš text souhlasu v index.html, změň i tuhle hodnotu.
  verzeSouhlasu: "2027-v1"
};
