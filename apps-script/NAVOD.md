# Návod: ukládání odpovědí z formuláře do Google Tabulky

Formulář „Mám zájem“ na webu posílá data do Google Apps Scriptu, který je zapíše jako nový řádek do tabulky ve vašem Google účtu. Stojí to nula korun a data zůstávají u vás.

Doporučení: použijte Google účet organizace (ten, který bude správcem dat podle textu o zpracování osobních údajů), a ne soukromý účet jednotlivce.

## 1. Vytvoř tabulku

1. Přihlas se do Google účtu, ve kterém mají data zůstat.
2. Otevři [sheets.new](https://sheets.new) a pojmenuj tabulku třeba **„Dobrovolníci Charis 2027 – zájemci“**.
3. Sdílej ji jen s lidmi z organizačního týmu, kteří mají na starosti dobrovolníky (v tabulce jsou osobní údaje).

## 2. Vlož skript

1. V tabulce klikni na **Rozšíření → Apps Script**.
2. Smaž vše, co je v editoru (`function myFunction() {}`), a vlož celý obsah souboru `Code.gs` z této složky.
3. Ulož (ikona disketky, nebo `Ctrl/Cmd + S`). Projekt můžeš pojmenovat třeba „Příjem zájemců“.

## 3. Nasaď jako Web App

1. Vpravo nahoře klikni na **Nasadit → Nové nasazení**.
2. U „Vybrat typ“ (ozubené kolečko) zvol **Webová aplikace**.
3. Nastav:
   - **Popis:** např. „Formulář zájemců v1“
   - **Spustit jako:** **Já** (tvůj účet)
   - **Kdo má přístup:** **Kdokoli** (web musí umět data odeslat bez přihlášení)
4. Klikni na **Nasadit**.
5. Google tě požádá o **autorizaci**: vyber svůj účet, u upozornění „Google nezkontroloval tuto aplikaci“ klikni na **Rozšířené → Přejít na … (nebezpečné)** a povol přístup k tabulkám. Je to tvůj vlastní skript, proto toto upozornění vyskočí.
6. Zkopíruj **URL webové aplikace**, končí na `/exec`.

## 4. Vlož adresu do webu

Otevři `web/config.js` a vlož URL do `zajemciEndpoint`:

```js
zajemciEndpoint: "https://script.google.com/macros/s/XXXXXXXX/exec",
```

## 5. Otestuj

1. Otevři web, vyplň formulář a odešli.
2. V tabulce se objeví list **Zájemci** s hlavičkou a novým řádkem (čas odeslání, jméno, e-mail, telefon, služba, odpovědi, souhlasy a **verze textu souhlasu**).
3. Testovací řádky potom smaž.

Pokud se nic nezapíše: v Apps Scriptu otevři **Provádění** (levé menu), uvidíš případnou chybu. Zkontroluj také, že je u nasazení nastaveno „Kdo má přístup: Kdokoli“.

## Úprava skriptu později

Když na `Code.gs` něco změníš, musíš nasadit novou verzi: **Nasadit → Spravovat nasazení → ikona tužky → Verze: Nová verze → Nasadit**. URL zůstane stejná.

## Poznámky

- Web odesílá data tak, že odpověď skriptu nevidí (omezení prohlížeče u Apps Scriptu). Po odeslání proto vždy ukáže „Díky“, pokud požadavek odešel. Skutečný zápis ověř při testu v tabulce a občas i později.
- **Verze textu souhlasu** je v `config.js` (`verzeSouhlasu`). Když změníš text souhlasu v `index.html`, změň i toto číslo, ať je v tabulce vidět, který text zájemce odsouhlasil.
- **Doba uložení:** podle textu o zpracování se údaje mažou do 31. 12. 2027, nebo dřív po odvolání souhlasu. Smazání z tabulky je třeba udělat ručně (nezapomeň na to).
- Skript ukládá text začínající znaky `=`, `+`, `-` nebo `@` s apostrofem na začátku, aby nešlo do tabulky vložit vzorec.

## Přepnutí na ostré přihlašování

Až v lednu spustíte přihlašování, v `web/config.js` nastav `registraceOtevrena: true` a vyplň tři odkazy v `odkazy` (Google Form pro pomeranče, citrony a jednorázovou pomoc). Formulář zájemců se na webu skryje a tlačítka u služeb povedou na příslušné Google Formy.
