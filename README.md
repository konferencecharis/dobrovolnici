# Staň se dobrovolníkem na Konferenci Charis

Jednostránkový web pro dobrovolníky Konference Charis (Výstaviště Brno, 4.–11. července 2027).
Čistý statický web: HTML, CSS a trochu JavaScriptu. Žádný framework, žádný build.

## Struktura

| Soubor | K čemu je |
|---|---|
| `index.html` | stránka a všechny texty |
| `styles.css` | vzhled |
| `main.js` | logika (formulář, přepínání stavu registrace, okno s informacemi o osobních údajích) |
| `config.js` | **jediný soubor pro běžné úpravy**: přepínač přihlašování, odkazy na Google Formy, adresa Apps Scriptu, kontakty |
| `img/` | zmenšené fotky a loga |
| `apps-script/` | skript pro ukládání odpovědí do Google Tabulky a návod (`NAVOD.md`) |

## Spuštění lokálně

```bash
python3 -m http.server 8000
```

Pak otevřít http://localhost:8000.

## Přepnutí na ostré přihlašování (leden 2027)

V `config.js` nastavit `registraceOtevrena: true` a vyplnit tři odkazy v `odkazy` (Google Formy pro pomeranče, citrony a jednorázovou pomoc). Formulář zájemců se na webu skryje a tlačítka u služeb povedou na příslušné formuláře.

## Ukládání odpovědí z formuláře „Mám zájem“

Odpovědi se zapisují do Google Tabulky přes Google Apps Script. Postup nasazení je v `apps-script/NAVOD.md`, adresa nasazení je v `config.js` (`zajemciEndpoint`).

## Napojení na doménu dobrovolnici.konferencecharis.cz

Zatím **není provedeno**. Až se domluví, postup je:

1. **Soubor `CNAME`.** V kořeni repozitáře vytvořit soubor `CNAME` s jediným řádkem:
   ```
   dobrovolnici.konferencecharis.cz
   ```
2. **DNS záznam.** U správce domény `konferencecharis.cz` přidat záznam typu **CNAME**:
   - název (host): `dobrovolnici`
   - hodnota: `konferencecharis.github.io`
3. **GitHub Pages.** V repozitáři *Settings → Pages* zadat jako Custom domain `dobrovolnici.konferencecharis.cz` a po ověření DNS zapnout **Enforce HTTPS** (certifikát GitHub vystaví sám, může to trvat i několik hodin).
4. **Odkaz pro sdílení.** V `index.html` změnit `og:image` na absolutní adresu `https://dobrovolnici.konferencecharis.cz/img/og.jpg`, jinak WhatsApp a Instagram nemusí zobrazit náhled. Hned vedle lze doplnit i `og:url`.
5. Na hlavním webu přidat krátkou větu s odkazem na `https://dobrovolnici.konferencecharis.cz`.

Pokud web poběží na vlastním hostingu místo GitHub Pages, stačí nahrát obsah repozitáře (soubory `CNAME` a `README.md` nejsou nutné) do kořene subdomény.

## Důležité

- V repozitáři **nesmí být** exporty z tabulky s odpověďmi (jména, e-maily, telefony) ani originální fotky. Osobní údaje zájemců jsou jen v Google Tabulce.
- Adresa Apps Scriptu v `config.js` je veřejná (web ji potřebuje). Při zneužití stačí v Apps Scriptu udělat nové nasazení a novou adresu vložit do `config.js`.
- Pořadatel a správce údajů: Charismatická obnova, z.s. Text o zpracování osobních údajů je v `index.html` (okno `#gdpr-dialog`) a před zveřejněním ho má schválit odpovědná osoba.
