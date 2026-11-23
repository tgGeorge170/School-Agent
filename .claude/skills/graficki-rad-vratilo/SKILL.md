---
name: graficki-rad-vratilo
description: Grafički rad 1 iz Mašinskih elemenata – Konstrukcija vratila (samo vratilo I) za bilo kojeg učenika iz razreda. Iz polaznih podataka (P, n, materijal, K_A, l, Ft, Fr, Fa, d1) pravi popunjen Word obrazac, proračun korak po korak za prepisivanje u svesku i radionički crtež A3 PDF po JUS standardu. Koristi kad korisnik pošalje podatke ili sliku podataka za grafički rad / vratilo, kaže "grafički rad", "vratilo za drugara", "uradi vratilo za ...".
---

# Grafički rad 1 – Konstrukcija vratila I

Korisnik (3. razred, Tehnička škola Gradiška) radi ovaj rad za sebe i drugare iz razreda.
Svaki drugar ima druge polazne podatke, a postupak je isti. Sve u chatu piši na srpskom,
latinicom. Radi se **samo vratilo I** (vratilo II se ne radi).

## 1. Prikupi podatke

Treba ti za svakog učenika:

| ključ | značenje | primjer |
|---|---|---|
| `ime` | ime i prezime učenika (ide u obrazac i zaglavlje crteža) | "Marko Marković" |
| `P` | snaga na pogonskom vratilu [kW] | 47 |
| `n` | broj obrtaja el. motora [o/min] | 1280 |
| `material` | materijal vratila | "Č.0460" |
| `KA` | vrsta radne mašine | 1.25 |
| `l` | rastojanje između ležaja l₁ [mm] | 170 |
| `Ft`, `Fr`, `Fa` | obimna, radijalna, aksijalna sila [N] | 8850, 4350, 1800 |
| `d1` | podeoni prečnik zupčanika [mm] | 192 |

- Podatke čitaj sa slike koju pošalje, pa ih **prije računanja potvrdi sa korisnikom**
  (AskUserQuestion), jer je rukopis često nejasan (1 i 7, 5 i 6...).
- Ako nešto fali (npr. d₁ ili ime), pitaj. Ništa ne izmišljaj.
- Materijal mora biti u tabeli `MAT` u `grafrad.py` (Č.0270–Č.0745, Č.1330, Č.1530,
  Č.1730, Č.3130, Č.4130, Č.4732, Č.5431, Č.1120, Č.1220, Č.4320, Č.4721, Č.5421).
  Ako nije, pitaj korisnika za vrijednosti iz Tabele 8 i 11.

## 2. Pokreni skriptu

```bash
S=.claude/skills/graficki-rad-vratilo
mkdir -p <scratchpad>/<ime>
cat > <scratchpad>/<ime>/ulaz.json <<'EOF'
{"ime": "Marko Marković", "P": 47, "n": 1280, "material": "Č.0460", "KA": 1.25, "l": 170,
 "Ft": 8850, "Fr": 4350, "Fa": 1800, "d1": 192}
EOF
python3 $S/grafrad.py <scratchpad>/<ime>/ulaz.json <scratchpad>/<ime>/izlaz
```

Treba `python-docx` i `matplotlib` (`pip install python-docx matplotlib` ako fale).
Skripta pravi u `izlaz/`:
- `<Ime_Prezime>_obrazac.docx` – obrazac iz `assets/obrazac.docx`, samo brojevi bez jedinica
- `<Ime_Prezime>_proracun.docx` – formula → uvrštene vrijednosti → rezultat, za prepisivanje u svesku
- `<Ime_Prezime>_crtez.pdf` – radionički crtež A3 (+ `preview.png` za provjeru)
- `rezultati.json` – sve izračunate vrijednosti

## 3. Pravila koja skripta primjenjuje (iz bilješki sa časa)

Ako korisnik kaže da se nešto promijenilo, izmijeni skriptu.
- Momenti u H/V ravni idu sa znakom minus, kao u školskom primjeru. Za 1.4.2 (M_iZ) i 3.6
  uzima se **veći** rezultujući moment.
- Materijal: iz tabele se uzima **manji broj** (σ_D(−1), τ_D(0), R_m).
- Stepen sigurnosti za dozvoljene napone: S = 4 za savijanje, S = 3 za uvijanje.
- P se pretvara u W, a moment iz Nm u Nmm. T sadrži K_A.
- 1.5.1: d_i se računa preko σ_sd, poveća za 20% i zaokruži na **prvi veći** iz Tabele 1.
  Između prečnika po redoslijedu **S – A – Z** mora biti razlika od **najmanje 5 mm**.
- Ako S ispod zupčanika ispadne < 1,5, d_Z se povećava na sljedeći standardni prečnik dok
  ne zadovolji (korisnik je tako odlučio). U proračunu piše zašto.
- Klin (Tabela 10): ako je d na granici reda, uzima se **manji** red (npr. 65 → 58–65).
- Dužina klina iz sveske: 10–12→36, 13–17→40, 18–22→45, 23–30→50, 31–38→56, 39–44→63,
  45–50→70, 51–58→80, 59–65→90, 66–75→100, 76–85→110, 86–95→125, 96–110→140.
- α_K sa Slike 4 (za r/t ≤ 0,1 → 3,7), η_K = 0,65, ξ₁ iz Tabele 12 (interpolacija,
  ugljenični ili legirani), ξ₂ sa Slike 5 za R_m (kriva Rz = 10, kao u primjeru: 500 → 0,9).
- Provjera: S = 1,5 ÷ 3, a p mora biti < 100 N/mm².

**Crtež (JUS, ne ISO):**
- Tolerancije slobodnih mjera JUS M.A1.420.
- Hrapavost:
  - N6 na mjestima ležaja,
  - N7 na spojnici i zupčaniku,
  - N8 u žljebovima,
  - N9 opšta.
- Središnje gnijezdo A4 JUS M.A5.210 na oba kraja.
- Oborene ivice se pišu „2/45°“.
- Tolerancije:
  - spojnica i zupčanik m6,
  - ležajevi k6,
  - žljeb P8,
  - mjera d−t ima odstupanja 0 / −0,2.
- Raspored dijelova vratila (dužine nisu zadane, pa ih skripta određuje sama):
  - Spojnica: dužina klina + 10.
  - Zupčanik: dužina klina + 10, na sredini između ležaja.
  - Sjedište ležaja B: 30 mm (manje ako nema mjesta).
  - Naslon: prečnik d_Z + 5, zaokružen na 5 mm. Širina mu je tolika da sredine ležaja
    budu na l₁.
  - Ležaj A: na Ø_A dijelu, isto l₁/2 od sredine zupčanika.
  - R2 na prelazima, R1 uz ležajeve.
  - Razmjera 1:1, a 1:1,5 ili 1:2 ako vratilo ne stane.
- Da crteži drugara ne izgledaju isto, skripta prema imenu učenika malo pomjera položaj kota,
  presjeka, oznaka hrapavosti i strelica, a ponekad zamijeni redoslijed presjeka A‑A i B‑B.
  Mjere i geometrija se ne mijenjaju. Isto ime uvijek daje isti crtež, a bez imena raspored
  je osnovni.

## 4. Provjeri prije slanja (obavezno)

1. Pročitaj `preview.png` i pogledaj da se ništa ne preklapa: tekst preko linija, kote preko
   zaglavlja, presjeci u zaglavlju. Ako se preklapa, popravi `grafrad.py` i pokreni ponovo.
2. Ručno preračunaj bar F_A, F_B, T, prečnike, S i p (kratka python provjera) i uporedi sa
   `rezultati.json`.
3. Ako skripta prekine („Sjedište ležaja bi bilo ... mm“), ili je p ≥ 100, ili je S > 3,
   **pitaj korisnika** šta da radiš. Nemoj sam mijenjati pravila.

## 5. Predaja

- Spakuj tri fajla u `<Ime_Prezime>_graficki_rad_1.zip` (u folderu `<Ime_Prezime>_graficki_rad_1/`) i pošalji ZIP i svaki fajl posebno (SendUserFile).
- U chatu daj kratku tabelu glavnih rezultata: F_A, F_B, Mᵈ_sz, T, d_S / d_A / d_Z, klin, S, p.
- Napomeni šta je pretpostavljeno: dužine na crtežu, ξ₂ očitan sa dijagrama i eventualno
  povećan d_Z.
- Podsjeti da se crtež štampa na **100% / Actual size**.
