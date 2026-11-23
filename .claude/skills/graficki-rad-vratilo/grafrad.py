"""Grafički rad 1 – Konstrukcija vratila I.
Usage: python3 grafrad.py ulaz.json izlazni_folder
Produces: popunjen obrazac (.docx), proračun korak po korak (.docx), radionički crtež (.pdf + preview.png), rezultati.json
"""
import json, math, sys, os, copy
from decimal import Decimal, ROUND_HALF_UP

HERE = os.path.dirname(os.path.abspath(__file__))


def rnd(x, n=0):
    q = Decimal(1).scaleb(-n)
    v = Decimal(repr(x)).quantize(q, rounding=ROUND_HALF_UP)
    return int(v) if n == 0 else float(v)


def fmt(x, n=None):
    if n is not None:
        x = rnd(x, n)
    if isinstance(x, float) and x.is_integer():
        x = int(x)
    s = f'{x}'
    if 'e' in s:
        s = f'{x:.6f}'.rstrip('0').rstrip('.')
    return s.replace('.', ',').replace('-', '−')


# ---------------- tables ----------------
STD_D = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24, 25, 26, 28, 30, 32, 34, 36, 38, 40, 42, 45, 48, 50, 52,
         55, 60, 63, 68, 70, 75, 80, 85, 90, 95, 100, 105, 110, 120, 125, 130, 140, 150, 160, 170, 180]

# oznaka: (sigma_D(-1) savojna min-max, tau_D(0) uvojna min-max, Rm min-max)  – Tabela 8 i 11
MAT = {
    '0270': ((150, 200), (120, 150), (340, 420)),
    '0370': ((170, 200), (140, 180), (370, 430)),
    '0460': ((190, 240), (150, 180), (420, 500)),
    '0545': ((220, 270), (170, 240), (500, 600)),
    '0645': ((280, 330), (200, 230), (600, 700)),
    '0745': ((300, 380), (220, 270), (700, 850)),
    '1330': ((220, 270), (200, 240), (500, 630)),
    '1530': ((300, 340), (230, 310), (630, 780)),
    '1730': ((340, 400), (280, 370), (750, 900)),
    '3130': ((340, 400), (290, 410), (700, 850)),
    '4130': ((360, 450), (250, 500), (700, 850)),
    '4732': ((460, 550), (340, 550), (900, 1100)),
    '5431': ((500, 600), (340, 550), (1000, 1200)),
    '1120': ((250, 330), (190, 250), (500, 650)),
    '1220': ((300, 370), (220, 280), (600, 800)),
    '4320': ((320, 400), (300, 400), (650, 950)),
    '4721': ((380, 520), (410, 560), (900, 1100)),
    '5421': ((400, 510), (430, 550), (1000, 1200)),
}

# Tabela 10 – normalni klinovi: (iznad, do, b, h, t, r)
KEYS = [(10, 12, 4, 4, 2.4, 0.2), (12, 17, 5, 5, 2.9, 0.2), (17, 22, 6, 6, 3.5, 0.4), (22, 30, 8, 7, 4.1, 0.4),
        (30, 38, 10, 8, 4.7, 0.4), (38, 44, 12, 8, 4.9, 0.5), (44, 50, 14, 9, 5.5, 0.5), (50, 58, 16, 10, 6.2, 0.5),
        (58, 65, 18, 11, 6.8, 0.5), (65, 75, 20, 12, 7.4, 0.6), (75, 85, 22, 14, 8.5, 0.6), (85, 95, 25, 14, 8.7, 0.6),
        (95, 110, 28, 16, 9.9, 0.8), (110, 130, 32, 18, 11.1, 0.8)]

# dužina klina iz sveske (d od-do → l)
KEY_L = [(10, 12, 36), (13, 17, 40), (18, 22, 45), (23, 30, 50), (31, 38, 56), (39, 44, 63), (45, 50, 70), (51, 58, 80),
         (59, 65, 90), (66, 75, 100), (76, 85, 110), (86, 95, 125), (96, 110, 140)]

XI1_C = [(10, 1), (20, .91), (30, .88), (40, .84), (50, .81), (60, .78), (70, .75), (80, .73), (100, .70), (120, .68)]
XI1_A = [(10, 1), (20, .83), (30, .77), (40, .73), (50, .70), (60, .68), (70, .66), (80, .64), (100, .62), (120, .60)]
# Slika 5, kriva Rz = 10 µm (fino obrađena površina, kao u primjeru: 500 N/mm² → 0,9)
XI2 = [(300, .91), (400, .90), (500, .90), (600, .89), (700, .88), (800, .87), (900, .86), (1000, .85), (1100, .84),
       (1200, .83), (1300, .82), (1400, .81)]
# Slika 4, alfa_k za žljeb klina
ALFA = [(0.0, 3.7), (0.1, 3.7), (0.2, 3.2), (0.3, 2.85), (0.4, 2.6), (0.5, 2.35), (0.6, 2.2)]

# ISO 286 odstupanja (µm): (iznad, do, gornje, donje)
M6 = [(10, 18, 18, 7), (18, 30, 21, 8), (30, 50, 25, 9), (50, 80, 30, 11), (80, 120, 35, 13)]
K6 = [(10, 18, 12, 1), (18, 30, 15, 2), (30, 50, 18, 2), (50, 80, 21, 2), (80, 120, 25, 3)]
P8 = [(3, 6, -12, -30), (6, 10, -15, -37), (10, 18, -18, -45), (18, 30, -22, -55), (30, 50, -26, -65)]


def interp(tab, x):
    if x <= tab[0][0]: return tab[0][1]
    for (x1, y1), (x2, y2) in zip(tab, tab[1:]):
        if x <= x2: return y1 + (y2 - y1) * (x - x1) / (x2 - x1)
    return tab[-1][1]


def key_for(d):
    for lo, hi, b, h, t, r in KEYS:
        if lo < d <= hi or (d == lo == 10):
            return b, h, t, r, f'{lo}–{hi}'
    raise ValueError(d)


def key_len(d):
    for lo, hi, l in KEY_L:
        if lo <= d <= hi: return l, f'{lo}–{hi}'
    raise ValueError(d)


def dev(tab, x):
    for lo, hi, a, b in tab:
        if lo < x <= hi: return a, b
    raise ValueError(x)


def next_std(x, at_least=0):
    for d in STD_D:
        if d >= x and d >= at_least: return d
    raise ValueError(x)


def sd(um):
    return ('+' if um > 0 else '−') + f'{abs(um) / 1000:.3f}'.replace('.', ',') if um else '0'


# ---------------- calculation ----------------
def calc(inp):
    P, n, KA, l = inp['P'], inp['n'], inp['KA'], inp['l']
    Ft, Fr, Fa, d1 = inp['Ft'], inp['Fr'], inp['Fa'], inp['d1']
    mat = inp['material'].replace('Č', '').replace('.', '').strip()
    a = l / 2
    r = {'a': a, 'mat': mat}
    FadH = Fa * d1 / 2
    r['FBH'] = rnd((Fr * a + FadH) / l); r['FAH'] = rnd((Fr * a - FadH) / l)
    r['FBV'] = rnd(Ft * a / l); r['FAV'] = r['FBV']
    r['FA'] = rnd(math.hypot(r['FAH'], r['FAV'])); r['FB'] = rnd(math.hypot(r['FBH'], r['FBV']))
    r['MV'] = -r['FAV'] * a; r['MlH'] = -r['FAH'] * a; r['MldH'] = -r['FAH'] * a - rnd(FadH); r['MdH'] = -r['FBH'] * a
    r['MV'], r['MlH'], r['MldH'], r['MdH'] = [rnd(v) for v in (r['MV'], r['MlH'], r['MldH'], r['MdH'])]
    r['Ml'] = rnd(math.hypot(r['MlH'], r['MV'])); r['Md'] = rnd(math.hypot(r['MdH'], r['MV']))
    r['Mmax'] = max(r['Ml'], r['Md']); r['Mmax_name'] = 'Mᵈ_sz' if r['Md'] >= r['Ml'] else 'Mˡ_sz'
    (s1, s2), (t1, t2), (rm1, rm2) = MAT[mat]
    r.update(sD=s1, sDr=(s1, s2), tD=t1, tDr=(t1, t2), Rm=rm1, Rmr=(rm1, rm2))
    r['a0'] = rnd(s1 / t1, 2); r['ssd'] = rnd(s1 / 4, 2); r['tud'] = rnd(t1 / 3, 2)
    r['w'] = rnd(math.pi * n / 30, 2)
    r['T0Nm'] = rnd(P * 1000 / r['w'], 2)
    r['TNm'] = rnd(P * 1000 / r['w'] * KA, 1); r['T'] = rnd(r['TNm'] * 1000)
    r['Mis'] = rnd(r['a0'] / 2 * r['T'])
    r['Miz'] = rnd(math.hypot(r['Mmax'], r['a0'] / 2 * r['T']))
    r['dis'] = rnd((32 * r['Mis'] / (math.pi * r['ssd'])) ** (1 / 3), 1)
    r['diz'] = rnd((32 * r['Miz'] / (math.pi * r['ssd'])) ** (1 / 3), 1)
    r['dsS_c'] = rnd(1.2 * r['dis'], 2); r['dsZ_c'] = rnd(1.2 * r['diz'], 2)
    r['dS'] = next_std(r['dsS_c'])
    r['dA'] = next_std(r['dsS_c'], r['dS'] + 5)
    r['dZ_rule'] = next_std(r['dsZ_c'], r['dA'] + 5)
    alloyed = mat[0] in '2345678' or mat in ('4320', '4721', '5421')
    r['alloyed'] = alloyed
    r['tries'] = []
    dZ = r['dZ_rule']
    while True:
        k = check(r, dZ, alloyed)
        r['tries'].append((dZ, k['S'], k))
        if k['S'] >= 1.5: break
        dZ = next_std(dZ + 0.5)
    r['dZ'] = dZ; r.update(k)
    T0 = rnd(inp['P'] * 1e6 / r['w'])
    r['T0'] = T0
    r['Ftk'] = rnd(2 * T0 * KA / dZ)
    r['lk'] = r['kl'] - r['b']; r['t1'] = rnd(r['h'] - r['t'], 1)
    r['p'] = rnd(r['Ftk'] / (r['lk'] * r['t1']), 1)
    # spojnica key
    bS, hS, tS, rS, rowS = key_for(r['dS'])
    r.update(bS=bS, hS=hS, tS=tS, rS=rS, klS=key_len(r['dS'])[0])
    r['dColl'] = int(math.ceil((dZ + 5) / 5.0) * 5)
    return r


def check(r, d, alloyed):
    b, h, t, rr, row = key_for(d)
    k = dict(b=b, h=h, t=t, r=rr, krow=row)
    k['td'] = rnd(t / d, 3); k['rt'] = rnd(rr / t, 3)
    k['ak'] = rnd(interp(ALFA, rr / t), 2)
    k['bk'] = rnd((k['ak'] - 1) * 0.65 + 1, 2)
    k['xi2'] = rnd(interp(XI2, r['Rm']), 2)
    k['xi1'] = rnd(interp(XI1_A if alloyed else XI1_C, d), 2)
    k['W'] = rnd((d - t) ** 3 * math.pi / 32)
    k['ss'] = rnd(r['Mmax'] / k['W'], 1); k['tu'] = rnd(r['T'] / (2 * k['W']), 1)
    k['Ss'] = rnd(r['sD'] * k['xi1'] * k['xi2'] / (k['bk'] * k['ss']), 2)
    k['St'] = rnd(r['tD'] * k['xi1'] * k['xi2'] / (k['bk'] * k['tu']), 2)
    k['S'] = rnd(k['Ss'] * k['St'] / math.hypot(k['Ss'], k['St']), 2)
    k['kl'], k['klrow'] = key_len(d)
    return k


# ---------------- obrazac ----------------
def fill_form(inp, r, out):
    import docx
    D = docx.Document(os.path.join(HERE, 'assets', 'obrazac.docx'))
    if inp.get('ime'):
        c = D.tables[0].rows[0].cells[1]
        c.paragraphs[0].add_run(inp['ime'])
    pod = [fmt(inp['P']), fmt(inp['n']), r['mat'], fmt(inp['KA']), fmt(inp['l']), fmt(inp['Ft']), fmt(inp['Fr']),
           fmt(inp['Fa'])]
    for i, v in enumerate(pod):
        p = D.tables[1].rows[i].cells[1].paragraphs[0]
        if i == 2:
            p.runs[-1].text = p.runs[-1].text.rstrip() + v
        else:
            last = p.runs[-1].text if p.runs else ''
            p.add_run(v if last.endswith(' ') else ' ' + v)
    m = lambda x: fmt(x).replace('−', '-')
    vals = {1: r['FBH'], 2: r['FAH'], 3: r['FAV'], 4: r['FBV'], 5: r['FA'], 6: r['FB'],
            8: r['MV'], 9: r['MlH'], 10: r['MldH'], 11: r['MdH'], 12: r['Ml'], 13: r['Md'],
            15: r['sD'], 16: r['tD'], 17: r['a0'], 18: r['ssd'], 19: r['tud'],
            21: r['T'], 22: r['w'], 23: r['Mis'], 24: r['Mis'], 25: r['Miz'],
            27: r['dis'], 28: r['diz'], 29: r['dS'], 30: r['dA'], 31: r['dZ'],
            33: r['b'], 34: r['h'], 35: r['t'], 36: r['r'], 37: r['td'], 38: r['rt'], 39: r['Rm'],
            40: r['ak'], 41: r['bk'], 42: r['xi2'], 43: r['xi1'], 44: r['W'], 45: r['ss'], 46: r['tu'],
            47: r['Ss'], 48: r['St'], 49: r['S'], 50: r['kl'], 51: r['t1'], 52: r['lk'], 53: r['Ftk'], 54: r['p']}
    t = D.tables[2]
    for ri, v in vals.items():
        p = t.rows[ri].cells[3].paragraphs[0]
        if p.runs:
            p.runs[0].text = m(v)
            for x in p.runs[1:]: x.text = ''
        else:
            p.add_run(m(v))
    D.save(out)


# ---------------- proračun korak po korak ----------------
def steps_doc(inp, r, out):
    import docx
    from docx.shared import Pt, RGBColor
    D = docx.Document()
    st = D.styles['Normal']; st.font.name = 'Cambria'; st.font.size = Pt(12)
    H = lambda t, l=1: D.add_heading(t, l)

    def L(*lines):
        for x in lines:
            p = D.add_paragraph(x); p.paragraph_format.space_after = Pt(2)

    def B(t):
        p = D.add_paragraph(); rr = p.add_run(t); rr.bold = True; rr.font.color.rgb = RGBColor(0xC0, 0, 0)

    f = fmt
    a = f(r['a']); l = f(inp['l']); d2 = f(inp['d1'] / 2)
    D.add_heading('GRAFIČKI RAD I – KONSTRUKCIJA VRATILA', 0)
    if inp.get('ime'): L(f"Učenik: {inp['ime']}")
    H('PRORAČUN – VRATILO I')
    H('Polazni podaci', 2)
    L(f"Snaga na pogonskom vratilu: P = {f(inp['P'])} kW = {f(inp['P'] * 1000)} W",
      f"Broj obrtaja el. motora: n₁ = {f(inp['n'])} o/min",
      f"Materijal vratila: Č.{r['mat']}",
      f"Vrsta radne mašine: K_A = {f(inp['KA'])}",
      f"Rastojanje između ležaja: l₁ = {l} mm  (zupčanik na sredini: {a} + {a} mm)",
      f"Obimna sila: F_t1 = {f(inp['Ft'])} N", f"Radijalna sila: F_r1 = {f(inp['Fr'])} N",
      f"Aksijalna sila: F_a1 = {f(inp['Fa'])} N",
      f"Podeoni prečnik zupčanika: d₁ = {f(inp['d1'])} mm  →  d₁/2 = {d2} mm")
    Fr, Fa, Ft = f(inp['Fr']), f(inp['Fa']), f(inp['Ft'])
    x1, x2 = rnd(inp['Fr'] * r['a']), rnd(inp['Fa'] * inp['d1'] / 2)
    H('1.1. OTPORI OSLONACA')
    H('1.1.1. Otpori oslonaca u "H" ravni', 2)
    L('ΣM_A = 0', f'− F_BH · {l} + F_r1 · {a} + F_a1 · d₁/2 = 0',
      f'F_BH = (F_r1 · {a} + F_a1 · d₁/2) / {l} = ({Fr} · {a} + {Fa} · {f(inp["d1"])}/2) / {l}',
      f'F_BH = ({f(x1)} + {f(x2)}) / {l} = {f(x1 + x2)} / {l} = {f(r["FBH"])} N', '',
      'ΣM_B = 0', f'F_AH · {l} − F_r1 · {a} + F_a1 · d₁/2 = 0',
      f'F_AH = (F_r1 · {a} − F_a1 · d₁/2) / {l} = ({Fr} · {a} − {Fa} · {f(inp["d1"])}/2) / {l}',
      f'F_AH = ({f(x1)} − {f(x2)}) / {l} = {f(x1 - x2)} / {l} = {f(r["FAH"])} N')
    H('1.1.2. Otpori oslonaca u "V" ravni', 2)
    L('ΣM_A = 0', f'− F_BV · {l} + F_t1 · {a} = 0',
      f'F_BV = F_t1 · {a} / {l} = {Ft} · {a} / {l} = {f(r["FBV"])} N', f'F_AV = F_BV = {f(r["FAV"])} N')
    H('1.1.3. Rezultujući otpori oslonaca', 2)
    L(f'F_A = √(F_AH² + F_AV²) = √({f(r["FAH"])}² + {f(r["FAV"])}²) = {f(r["FA"])} N',
      f'F_B = √(F_BH² + F_BV²) = √({f(r["FBH"])}² + {f(r["FBV"])}²) = {f(r["FB"])} N')
    H('1.2. MOMENTI SAVIJANJA')
    H('1.2.1. Momenti savijanja u "V" i "H" ravni', 2)
    L(f'Mˡ_szV = Mᵈ_szV = − F_AV · {a} = − {f(r["FAV"])} · {a} = {f(r["MV"])} Nmm',
      f'Mˡ_szH = − F_AH · {a} = − {f(r["FAH"])} · {a} = {f(r["MlH"])} Nmm',
      f'Mˡᵈ_szH = − F_AH · {a} − F_a1 · d₁/2 = − {f(r["FAH"])} · {a} − {Fa} · {f(inp["d1"])}/2 = {f(r["MlH"])} − {f(rnd(inp["Fa"] * inp["d1"] / 2))} = {f(r["MldH"])} Nmm',
      f'Mᵈ_szH = − F_BH · {a} = − {f(r["FBH"])} · {a} = {f(r["MdH"])} Nmm')
    H('1.2.2. Rezultujući momenti savijanja', 2)
    L(f'Mˡ_sz = √((Mˡ_szH)² + (Mˡ_szV)²) = √(({f(r["MlH"])})² + ({f(r["MV"])})²) = {f(r["Ml"])} Nmm',
      f'Mᵈ_sz = √((Mᵈ_szH)² + (Mᵈ_szV)²) = √(({f(r["MdH"])})² + ({f(r["MV"])})²) = {f(r["Md"])} Nmm',
      'M_sS = 0,  M_sA = 0,  M_sB = 0',
      f'Veći moment je {r["Mmax_name"]} = {f(r["Mmax"])} Nmm → on je mjerodavan za proračun (koristi se u 1.4.2).')
    H('1.3. MEHANIČKE KARAKTERISTIKE MATERIJALA VRATILA')
    L(f'Materijal vratila: Č.{r["mat"]} (Tabela 8)',
      f'σ_D(−1) – savojna dinamička izdržljivost: σ_D(−1) = {r["sDr"][0]} ÷ {r["sDr"][1]} N/mm²',
      f'      Usvajam: σ_D(−1) = {r["sD"]} N/mm²',
      f'τ_D(0) – uvojna izdržljivost: τ_D(0) = {r["tDr"][0]} ÷ {r["tDr"][1]} N/mm²',
      f'      Usvajam: τ_D(0) = {r["tD"]} N/mm²',
      'α₀ – koeficijent:', f'α₀ = σ_D(−1) / τ_D(0) = {r["sD"]} / {r["tD"]} = {f(r["a0"])}')
    H('1.3.1. Dozvoljeni napon savijanja', 2)
    L(f'σ_sd = σ_D(−1) / S = {r["sD"]} / 4 = {f(r["ssd"])} N/mm²')
    H('1.3.2. Dozvoljeni napon uvijanja', 2)
    L(f'τ_ud = τ_D(0) / S = {r["tD"]} / 3 = {f(r["tud"])} N/mm²')
    H('1.4. MJERODAVAN MOMENT ZA PRORAČUN VRATILA')
    H('1.4.1.1. Ugaona brzina na ulaznom vratilu', 2)
    L(f'ω₁ = π · n₁ / 30 = π · {f(inp["n"])} / 30 = {f(r["w"])} s⁻¹')
    H('1.4.1. Obrtni moment (T) – moment uvijanja', 2)
    L(f'T = (P / ω₁) · K_A = ({f(inp["P"])} · 10³ / {f(r["w"])}) · {f(inp["KA"])} = {f(r["TNm"])} Nm = {f(r["T"])} Nmm')
    H('1.4.2. Uporedni moment', 2)
    a0 = f(r['a0'])
    L(f'M_iS = √((M_sS)² + (α₀/2 · T)²) = √(0² + ({a0}/2 · {f(r["T"])})²) = {f(r["Mis"])} Nmm',
      f'M_iA = √((M_sA)² + (α₀/2 · T)²) = √(0² + ({a0}/2 · {f(r["T"])})²) = {f(r["Mis"])} Nmm',
      f'M_iZ = √(({r["Mmax_name"]})² + (α₀/2 · T)²) = √({f(r["Mmax"])}² + ({a0}/2 · {f(r["T"])})²) = {f(r["Miz"])} Nmm')
    H('1.5. DIMENZIONISANJE VRATILA I')
    H('1.5.1. Idealni prečnici', 2)
    L(f'd_iA = d_iS = ∛(32 · M_iA / (π · σ_sd)) = ∛(32 · {f(r["Mis"])} / (π · {f(r["ssd"])})) = {f(r["dis"])} mm',
      f'd_iZ = ∛(32 · M_iZ / (π · σ_sd)) = ∛(32 · {f(r["Miz"])} / (π · {f(r["ssd"])})) = {f(r["diz"])} mm')
    H('1.5.2. Stvarni prečnici', 2)
    L('Stvarne prečnike dobijamo kada idealne povećamo za 20% i zaokružimo na prvi veći standardni prečnik (Tabela 1). '
      'Između prečnika po redoslijedu S – A – Z mora biti razlika od najmanje 5 mm.',
      f'ds_S = 1,2 · d_iS = 1,2 · {f(r["dis"])} = {f(r["dsS_c"])} mm', f'      Usvajam: ds_S = {r["dS"]} mm',
      f'ds_A = ds_B = 1,2 · d_iA = 1,2 · {f(r["dis"])} = {f(r["dsS_c"])} mm  →  mora biti ≥ {r["dS"]} + 5 = {r["dS"] + 5} mm',
      f'      Usvajam: ds_A = ds_B = {r["dA"]} mm',
      f'ds_Z = 1,2 · d_iZ = 1,2 · {f(r["diz"])} = {f(r["dsZ_c"])} mm  →  mora biti ≥ {r["dA"]} + 5 = {r["dA"] + 5} mm')
    if r['dZ'] != r['dZ_rule']:
        for dz, s, _ in r['tries'][:-1]:
            L(f'      Sa {dz} mm stepen sigurnosti iznosi S = {f(s)} < 1,5 i ne zadovoljava (vidi provjeru u tački 3),')
        L(f'      pa usvajam prvi veći standardni prečnik: ds_Z = {r["dZ"]} mm')
    else:
        L(f'      Usvajam: ds_Z = {r["dZ"]} mm')
    H('1.5.3. Prečnici vratila I', 2)
    B(f'd_S = {r["dS"]} mm – prečnik vratila na mjestu spojnice')
    B(f'd_A = d_B = {r["dA"]} mm – prečnici rukavaca na osloncima A i B (mjesta ležaja)')
    B(f'd_Z = {r["dZ"]} mm – prečnik vratila na mjestu zupčanika')
    d = r['dZ']
    H('3. PROVJERA VRATILA I KLINA ISPOD ZUPČANIKA I')
    for n_, (dz, s_, k) in enumerate(r['tries'][:-1]):
        H(f'3.0.{n_ + 1}. Provjera sa d_Z = {dz} mm', 2)
        L(f'Klin iz Tabele 10 (red {k["krow"]}): b = {k["b"]} mm, h = {k["h"]} mm, t = {f(k["t"])} mm, r = {f(k["r"])} mm',
          f'r/t = {f(k["r"])} / {f(k["t"])} = {f(k["rt"])}  →  α_K = {f(k["ak"])}',
          f'β_K = (α_K − 1) · η_K + 1 = ({f(k["ak"])} − 1) · 0,65 + 1 = {f(k["bk"])}',
          f'ξ₂ = {f(k["xi2"])},  ξ₁ = {f(k["xi1"])} (d = {dz} mm)',
          f'W = (d − t)³ · π/32 = ({dz} − {f(k["t"])})³ · π/32 = {f(k["W"])} mm³',
          f'σ_s = M_s / W = {f(r["Mmax"])} / {f(k["W"])} = {f(k["ss"])} N/mm²',
          f'τ_u = T / (2W) = {f(r["T"])} / (2 · {f(k["W"])}) = {f(k["tu"])} N/mm²',
          f'S_σ = (σ_D(−1) · ξ₁ · ξ₂) / (β_K · σ_s) = ({r["sD"]} · {f(k["xi1"])} · {f(k["xi2"])}) / ({f(k["bk"])} · {f(k["ss"])}) = {f(k["Ss"])}',
          f'S_τ = (τ_D(0) · ξ₁ · ξ₂) / (β_K · τ_u) = ({r["tD"]} · {f(k["xi1"])} · {f(k["xi2"])}) / ({f(k["bk"])} · {f(k["tu"])}) = {f(k["St"])}',
          f'S = (S_σ · S_τ) / √(S_σ² + S_τ²) = ({f(k["Ss"])} · {f(k["St"])}) / √({f(k["Ss"])}² + {f(k["St"])}²) = {f(k["S"])}')
        B(f'S = {f(k["S"])} < 1,5 → NE ZADOVOLJAVA, pa se prečnik d_Z povećava na sljedeći standardni prečnik.')
    H(f'3.1. Prečnik vratila na mjestu zupčanika I: d = {d} mm', 2)
    L(f'Iz Tabele 10 – normalni klinovi (red {r["krow"]}):', f'b = {r["b"]} mm', f'h = {r["h"]} mm',
      f't = {f(r["t"])} mm', f'r = {f(r["r"])} mm', f't/d = {f(r["t"])} / {d} = {f(r["td"])}',
      f'r/t = {f(r["r"])} / {f(r["t"])} = {f(r["rt"])}',
      f'R_m = {r["Rmr"][0]} ÷ {r["Rmr"][1]} N/mm² za Č.{r["mat"]} (Tabela 11) → usvajam R_m = {r["Rm"]} N/mm²')
    H('3.2. Geometrijski faktor koncentracije napona', 2)
    L(f'α_K = {f(r["ak"])} (Slika 4, za r/t = {f(r["rt"])})',
      'η_K = 0,65 – faktor osjetljivosti materijala na koncentraciju (η_K = 0,5 ÷ 1)',
      f'β_K = (α_K − 1) · η_K + 1 = ({f(r["ak"])} − 1) · 0,65 + 1 = {f(r["bk"])}')
    H('3.3. Faktor hrapavosti površina', 2)
    L(f'ξ₂ = {f(r["xi2"])} (Slika 5, za R_m = {r["Rm"]} N/mm²)')
    H('3.4. Faktor veličine presjeka', 2)
    vr = 'legirani' if r['alloyed'] else 'ugljenični'
    L(f'ξ₁ = {f(r["xi1"])} (Tabela 12, savijanje, {vr} čelici, d = {d} mm)')
    H('3.5. Otporni moment presjeka', 2)
    L(f'W = (d − t)³ · π/32 = ({d} − {f(r["t"])})³ · π/32 = {f(r["W"])} mm³')
    H('3.6. Napon savijanja', 2)
    L(f'σ_s = M_s / W = {f(r["Mmax"])} / {f(r["W"])} = {f(r["ss"])} N/mm²   (uzima se najveći rezultujući moment savijanja)')
    H('3.7. Napon uvijanja', 2)
    L(f'τ_u = T / W_p = T / (2W) = {f(r["T"])} / (2 · {f(r["W"])}) = {f(r["tu"])} N/mm²')
    H('3.8. Stepen sigurnosti', 2)
    L(f'S_σ = (σ_D(−1) · ξ₁ · ξ₂) / (β_K · σ_s) = ({r["sD"]} · {f(r["xi1"])} · {f(r["xi2"])}) / ({f(r["bk"])} · {f(r["ss"])}) = {f(r["Ss"])}',
      f'S_τ = (τ_D(0) · ξ₁ · ξ₂) / (β_K · τ_u) = ({r["tD"]} · {f(r["xi1"])} · {f(r["xi2"])}) / ({f(r["bk"])} · {f(r["tu"])}) = {f(r["St"])}',
      f'S = (S_σ · S_τ) / √(S_σ² + S_τ²) = ({f(r["Ss"])} · {f(r["St"])}) / √({f(r["Ss"])}² + {f(r["St"])}²) = {f(r["S"])}',
      '– što zadovoljava jer S treba da bude: S = 1,5 ÷ 3' if r['S'] <= 3 else
      '– S je veći od 3: vratilo je predimenzionisano, ali zadovoljava uslov čvrstoće')
    H('3.9. Mjere klina', 2)
    L(f'Za prečnik vratila d = {d} mm mjere klina iznose: {r["b"]} x {r["h"]} x {r["kl"]} – JUS M.C2.060',
      f'Usvajam standardnu dužinu klina: l = {r["kl"]} mm (tabela: d = {r["klrow"].replace("–", " ÷ ")} → l = {r["kl"]} mm)')
    H('3.10. Dubina žljeba', 2)
    L(f'Dubina žljeba u vratilu: t = {f(r["t"])} mm',
      f'Dubina žljeba u glavčini: t₁ = h − t = {r["h"]} − {f(r["t"])} = {f(r["t1"])} mm')
    H('3.11. Korisna dužina klina', 2)
    L(f'l_K = l − b = {r["kl"]} − {r["b"]} = {r["lk"]} mm')
    H('3.12. Obimna sila na klinu', 2)
    L(f'T bez K_A: T₀ = P / ω₁ = {f(inp["P"] * 1000)} / {f(r["w"])} = {f(r["T0Nm"])} Nm = {f(r["T0"])} Nmm',
      f'F_tK = 2 · T₀ · K_A / d = 2 · {f(r["T0"])} · {f(inp["KA"])} / {d} = {f(r["Ftk"])} N')
    H('3.13. Površinski pritisak', 2)
    L(f'p = F_tK / (l_K · t₁) = {f(r["Ftk"])} / ({r["lk"]} · {f(r["t1"])}) = {f(r["p"])} N/mm²')
    H('3.14. Provjera', 2)
    L(f'p = {f(r["p"])} N/mm² < 100 N/mm² → površinski pritisak zadovoljava (glavčina od čelika, p_d = 75 ÷ 100 N/mm²).' if r['p'] < 100 else
      f'p = {f(r["p"])} N/mm² > 100 N/mm² → NE ZADOVOLJAVA!')
    D.save(out)


# ---------------- crtež ----------------
def drawing(inp, r, out_pdf, out_png):
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    from matplotlib.patches import Polygon, Circle, Arc
    plt.rcParams['font.family'] = 'DejaVu Sans'; plt.rcParams['hatch.linewidth'] = 0.5
    MM = 72 / 25.4; TH, TN = 0.5 * MM, 0.25 * MM; FS = 10.5
    fig = plt.figure(figsize=(420 / 25.4, 297 / 25.4))
    ax = fig.add_axes([0, 0, 1, 1]); ax.set_xlim(0, 420); ax.set_ylim(0, 297); ax.set_aspect('equal'); ax.axis('off')

    def L(x1, y1, x2, y2, k='thin'):
        st = {'thick': dict(lw=TH, color='k'), 'thin': dict(lw=TN, color='k'),
              'center': dict(lw=TN, color='k', dashes=(12, 2, 1.5, 2)),
              'hidden': dict(lw=TN, color='k', dashes=(4, 1.5))}[k]
        ax.plot([x1, x2], [y1, y2], solid_capstyle='butt', **st)

    def T(x, y, s, size=FS, rot=0, ha='center', va='bottom'):
        ax.text(x, y, s, fontsize=size, rotation=rot, ha=ha, va=va, rotation_mode='anchor')

    def arrow(x, y, dx, dy, ln=3.0, w=0.55):
        n = math.hypot(dx, dy); dx, dy = dx / n, dy / n; px, py = -dy, dx
        ax.add_patch(Polygon([(x, y), (x - dx * ln + px * w, y - dy * ln + py * w),
                              (x - dx * ln - px * w, y - dy * ln - py * w)], closed=True, fc='k', ec='k', lw=0.2))

    def textw(s, size=FS):
        t = ax.text(0, 0, s, fontsize=size); bb = t.get_window_extent(fig.canvas.get_renderer())
        bb = bb.transformed(ax.transData.inverted()); t.remove(); return bb.width

    def tol(x, y, main, up, lo):
        w = textw(main); x0 = x - w / 2
        T(x0, y, main, ha='left'); T(x0 + w + 0.6, y + 1.9, up, size=7, ha='left'); T(x0 + w + 0.6, y, lo, size=7, ha='left')

    def hdim(x1, x2, y, text, yr1=None, yr2=None, outside=False):
        for x, yr in ((x1, yr1), (x2, yr2)):
            if yr is None: continue
            sg = 1 if y > yr else -1; L(x, yr + sg, x, y + sg * 2)
        if outside or x2 - x1 < 8:
            L(x1 - 9, y, x2 + 9, y); arrow(x1, y, 1, 0); arrow(x2, y, -1, 0)
        else:
            L(x1, y, x2, y); arrow(x1, y, -1, 0); arrow(x2, y, 1, 0)
        if text is None: return
        if callable(text): text((x1 + x2) / 2, y + 0.8)
        elif x2 - x1 < textw(text) + 2: T(x1 - 6, y + 0.8, text)
        else: T((x1 + x2) / 2, y + 0.8, text)

    def vdim(y1, y2, x, text, xr1=None, xr2=None, tpos=None, size=FS):
        for y, xr in ((y1, xr1), (y2, xr2)):
            if xr is None: continue
            sg = 1 if x > xr else -1; L(xr + sg, y, x + sg * 2, y)
        w = textw(text, size)
        if y2 - y1 < w + 4 and tpos is None:
            L(x, y1 - 7, x, y2 + 4 + w); arrow(x, y1, 0, 1); arrow(x, y2, 0, -1)
            T(x - 0.8, y2 + 3 + w / 2, text, rot=90, size=size)
            return
        L(x, y1, x, y2); arrow(x, y1, 0, -1); arrow(x, y2, 0, 1)
        T(x - 0.8, (y1 + y2) / 2 if tpos is None else tpos, text, rot=90, size=size)

    def leader(x, y, x2, y2, text, side='right'):
        L(x, y, x2, y2); arrow(x, y, x - x2, y - y2)
        w = textw(text) + 1; xe = x2 + w if side == 'right' else x2 - w
        L(x2, y2, xe, y2); T(min(x2, xe) + 0.5, y2 + 0.6, text, ha='left')

    def rough(x, y, nn):
        h = 4.5
        L(x - h * .577, y + h, x, y); L(x, y, x + 2 * h * .577, y + 2 * h); L(x - h * .577, y + h, x + h * .577, y + h)
        T(x - 0.2, y + h + 0.8, nn, size=8.5)

    def rough_leader(x, y, x2, y2, nn):
        L(x, y, x2, y2); arrow(x, y, x - x2, y - y2); L(x2, y2, x2 - 7, y2); rough(x2 - 4, y2, nn)

    ax.add_patch(plt.Rectangle((20, 10), 390, 277, fill=False, lw=0.7 * MM))

    # geometry (true mm)
    dS, dA, dZ, dC = r['dS'], r['dA'], r['dZ'], r['dColl']
    a = r['a']; LS = r['klS'] + 10; LZ = r['kl'] + 10
    seat = min(30, 2 * (a - LZ / 2 - 8))
    coll = a - LZ / 2 - seat / 2
    if seat < 14:
        raise SystemExit(f'Sjedište ležaja bi bilo {seat} mm (< 14): rastojanje ležaja je premalo za glavčinu {LZ} mm – pitaj korisnika.')
    LA = a - LZ / 2 + seat / 2 + 30
    segs = [(dS, LS), (dA, LA), (dZ, LZ), (dC, coll), (dA, seat)]
    Ltot = sum(l for _, l in segs)
    sc = 1.0 if Ltot <= 310 and dC <= 75 else (1 / 1.5 if Ltot <= 465 else 0.5)
    scale_txt = {1.0: '1:1', 1 / 1.5: '1:1,5', 0.5: '1:2'}[sc]
    S = lambda v: v * sc
    import random
    rng = random.Random(inp.get('ime')) if inp.get('ime') else None
    V = lambda d, lo, hi: d if rng is None else rng.uniform(lo, hi)
    X0 = 78 + (310 - S(Ltot)) / 2; AY = V(200, 196, 204)
    xs = [X0]
    for d, l in segs: xs.append(xs[-1] + S(l))
    XE = xs[-1]; CH = S(2)
    Rf = {1: 2, 2: 1, 3: 2, 4: 1}

    def outline(sg):
        pts = [(X0, sg * (S(dS / 2) - CH)), (X0 + CH, sg * S(dS / 2))]
        for i, (d, l) in enumerate(segs):
            if i == 0: continue
            rr, pr, x, rf = S(d / 2), S(segs[i - 1][0] / 2), xs[i], S(Rf[i])
            if rr > pr:
                cx, cy = x - rf, pr + rf
                pts += [(cx + rf * math.cos(math.radians(-90 + 9 * k)), sg * (cy + rf * math.sin(math.radians(-90 + 9 * k)))) for k in range(11)]
                pts.append((x, sg * rr))
            else:
                pts.append((x, sg * pr)); cx, cy = x + rf, rr + rf
                pts += [(cx + rf * math.cos(math.radians(180 + 9 * k)), sg * (cy + rf * math.sin(math.radians(180 + 9 * k)))) for k in range(11)]
        re = S(segs[-1][0] / 2)
        pts += [(XE - CH, sg * re), (XE, sg * (re - CH))]
        return pts

    for sg in (1, -1):
        o = outline(sg)
        for p1, p2 in zip(o, o[1:]): L(p1[0], AY + p1[1], p2[0], AY + p2[1], 'thick')
    r0, re = S(dS / 2), S(dA / 2)
    L(X0, AY - r0 + CH, X0, AY + r0 - CH, 'thick'); L(X0 + CH, AY - r0, X0 + CH, AY + r0, 'thick')
    L(XE, AY - re + CH, XE, AY + re - CH, 'thick'); L(XE - CH, AY - re, XE - CH, AY + re, 'thick')
    for i in range(1, 5):
        x = xs[i]; rmax = S(max(segs[i - 1][0], segs[i][0]) / 2); rmin = S(min(segs[i - 1][0], segs[i][0]) / 2); rf = S(Rf[i])
        L(x, AY - rmax, x, AY - rmin - rf, 'thick'); L(x, AY + rmin + rf, x, AY + rmax, 'thick')
        xf = x - rf if segs[i][0] > segs[i - 1][0] else x + rf
        L(xf, AY - rmin, xf, AY + rmin)
    L(xs[3], AY - S(dC / 2), xs[3], AY + S(dC / 2), 'thick'); L(xs[4], AY - S(dC / 2), xs[4], AY + S(dC / 2), 'thick')
    L(X0 - 8, AY, XE + 8, AY, 'center')

    def slot(xa, xb, b):
        rr = S(b / 2)
        ax.add_patch(Arc((xa + rr, AY), 2 * rr, 2 * rr, theta1=90, theta2=270, lw=TH))
        ax.add_patch(Arc((xb - rr, AY), 2 * rr, 2 * rr, theta1=-90, theta2=90, lw=TH))
        L(xa + rr, AY + rr, xb - rr, AY + rr, 'thick'); L(xa + rr, AY - rr, xb - rr, AY - rr, 'thick')

    S1a, S1b = X0 + S(5), X0 + S(5 + r['klS']); S2a, S2b = xs[2] + S(5), xs[2] + S(5 + r['kl'])
    slot(S1a, S1b, r['bS']); slot(S2a, S2b, r['b'])

    def chole(xf, dn):
        D_, d_ = S(8.5), S(4); c = (D_ - d_) / 2 / math.tan(math.radians(30))
        for sg in (1, -1):
            L(xf, AY + sg * D_ / 2, xf + dn * c, AY + sg * d_ / 2, 'hidden')
            L(xf + dn * c, AY + sg * d_ / 2, xf + dn * (c + S(5)), AY + sg * d_ / 2, 'hidden')
            L(xf + dn * (c + S(5)), AY + sg * d_ / 2, xf + dn * (c + S(6.2)), AY, 'hidden')

    chole(X0, 1); chole(XE, -1)
    RT = S(dC / 2)
    Y1 = AY - RT - V(20, 18, 24); Y2 = Y1 - V(12, 11, 14)
    for i in range(5):
        x1, x2 = xs[i], xs[i + 1]
        r1 = AY - S(segs[i][0] / 2) if i == 0 else None
        r2 = AY - S(max(segs[i][0], segs[i + 1][0]) / 2) if i < 4 else AY - re + CH
        hdim(x1, x2, Y1, fmt(segs[i][1]), r1, r2)
    hdim(X0, XE, Y2, fmt(Ltot), AY - r0 + CH, AY - re + CH)
    YA = AY + RT + V(17, 15, 20)
    L(X0, AY + r0 - CH + 1, X0, YA + 2); L(S1a, AY + 1, S1a, YA + 2); L(S1b, AY + 1, S1b, YA + 2)
    hdim(X0, S1a, YA, None, outside=True); T(X0 - 6, YA + 0.8, '5'); hdim(S1a, S1b, YA, fmt(r['klS']))
    L(xs[2], AY + S(dZ / 2) + 2, xs[2], YA + 2); L(S2a, AY + 1, S2a, YA + 2); L(S2b, AY + 1, S2b, YA + 2)
    hdim(xs[2], S2a, YA, None, outside=True); T(xs[2] - 6, YA + 0.8, '5'); hdim(S2a, S2b, YA, fmt(r['kl']))

    def dia(x, d, b, txt):
        rr, rb = S(d / 2), S(b / 2) if b else 0
        w = textw(txt)
        if b and rr - rb - 2 < w:
            L(x, AY - rr, x, AY + rr + 3 + w); arrow(x, AY - rr, 0, -1); arrow(x, AY + rr, 0, 1)
            T(x - 0.8, AY + rr + 2 + w / 2, txt, rot=90)
            return
        tpos = AY + (rb + rr) / 2 if b else AY + max(rr / 2, w / 2 + 1.5)
        vdim(AY - rr, AY + rr, x, txt, tpos=tpos)

    dia(X0 + S(LS) * V(.5, .4, .6), dS, r['bS'], f'Ø{dS}m6')
    dia(xs[1] + S(LA) * V(.3, .2, .45), dA, 0, f'Ø{dA}k6')
    dia(xs[2] + S(LZ) * V(.5, .42, .6), dZ, r['b'], f'Ø{dZ}m6')
    dia((xs[3] + xs[4]) / 2, dC, 0, f'Ø{dC}')
    dia(xs[4] + S(seat) * V(.5, .4, .6), dA, 0, f'Ø{dA}k6')
    leader(X0 + S(2.5), AY + S(3.2), X0 - V(6, 4, 10), AY + r0 * 0.5 + V(6, 4, 12), 'A4 JUS M.A5.210', side='left')
    leader(XE - S(2.5), AY + S(3.2), XE - V(8, 6, 12), AY + RT + V(9, 7, 13), 'A4 JUS M.A5.210', side='left')
    leader(X0 + CH / 2, AY - r0 + CH / 2, X0 - V(8, 6, 12), AY - r0 - V(8, 6, 12), '2/45°', side='left')
    leader(XE - CH / 2, AY - re + CH / 2, XE + V(4, 3, 6), AY - re - V(13, 9, 15), '2/45°', side='right')
    for i, side, dx, dy in ((1, 'right', 10, 11), (2, 'left', -10, 12), (3, 'left', -10, 12), (4, 'right', 8, 18)):
        rmin = S(min(segs[i - 1][0], segs[i][0]) / 2)
        xx = xs[i] + (S(0.6) if segs[i][0] < segs[i - 1][0] else -S(0.6))
        leader(xx, AY - rmin - S(1), xs[i] + dx * V(1, .8, 1.3), AY - rmin - dy * V(1, .85, 1.25), f'R{Rf[i]}', side=side)

    def cut(x, rr, letter):
        for sg in (1, -1):
            a_, b_ = AY + sg * (rr + 2), AY + sg * (rr + 8)
            L(x, a_, x, b_, 'thick'); L(x, b_, x - 7, b_); arrow(x - 7, b_, -1, 0)
            T(x - 10, b_ + (0.8 if sg > 0 else -4.6), letter, size=12)

    cut(xs[2] + S(LZ) * V(.3, .22, .35), S(dZ / 2), 'A'); cut(X0 + S(LS) * V(.28, .2, .34), S(dS / 2), 'B')
    rough(X0 + S(LS) * V(.72, .66, .8), AY + r0, 'N7'); rough(xs[1] + S(LA) * V(.62, .55, .78), AY + S(dA / 2), 'N6')
    rough(xs[2] + S(LZ) * V(.72, .66, .8), AY + S(dZ / 2), 'N7'); rough(xs[4] + S(4), AY + re, 'N6')

    def section(cx, cy, Dd, b, t, label):
        Rr, bb, tt = S(Dd / 2), S(b), S(t); al = math.asin(bb / 2 / Rr)
        pts = [(cx + Rr * math.cos(math.pi - al - (2 * math.pi - 2 * al) * k / 120),
                cy + Rr * math.sin(math.pi - al - (2 * math.pi - 2 * al) * k / 120)) for k in range(121)]
        pts += [(cx - Rr + tt, cy - bb / 2), (cx - Rr + tt, cy + bb / 2)]
        ax.add_patch(Polygon(pts, closed=True, fc='none', ec='k', lw=TH, hatch='////'))
        L(cx - Rr - 6, cy, cx + Rr + 6, cy, 'center'); L(cx, cy - Rr - 3, cx, cy + Rr + 4, 'center')
        T(cx, cy + Rr + 7, label, size=13)
        xl = cx - math.sqrt(Rr ** 2 - bb ** 2 / 4)
        vdim(cy - bb / 2, cy + bb / 2, cx - Rr - 10, f'{b}P8', xr1=xl, xr2=xl)
        hdim(cx - Rr + tt, cx + Rr, cy - Rr - 9, lambda x_, y_: tol(x_, y_, fmt(rnd(Dd - t, 1)), '0', '−0,2'),
             yr1=cy - bb / 2, yr2=cy)
        rough_leader(cx - Rr + tt, cy + min(2.5, bb / 4), cx - Rr - 4, cy + max(Rr - 2, bb / 2 + textw(f'{b}P8') + 8), 'N8')

    cyS = min(V(84, 78, 86), Y2 - 12 - S(dZ / 2) - 8)
    secs = [(dS, r['bS'], r['tS'], 'B-B'), (dZ, r['b'], r['t'], 'A-A')]
    if rng is not None and rng.random() < 0.5: secs.reverse()
    RL, RR = S(secs[0][0] / 2), S(secs[1][0] / 2)
    cL = max(100, RL + 45) + V(0, -3, 8)
    cR = min(max(190, cL + RL + RR + 40) + V(0, 0, 10), 222 - RR)
    section(cL, cyS, *secs[0]); section(cR, cyS, *secs[1])

    rows = [(f"{r['bS']}P8", *dev(P8, r['bS'])), (f"{r['b']}P8", *dev(P8, r['b'])), (f'Ø{dS}m6', *dev(M6, dS)),
            (f'Ø{dA}k6', *dev(K6, dA)), (f'Ø{dZ}m6', *dev(M6, dZ))]
    if r['bS'] == r['b']: rows.pop(1)
    for i, (n_, u, lo) in enumerate(rows):
        y = 287 - i * 10
        ax.add_patch(plt.Rectangle((20, y - 10), 18, 10, fill=False, lw=TN))
        ax.add_patch(plt.Rectangle((38, y - 5), 15, 5, fill=False, lw=TN)); ax.add_patch(plt.Rectangle((38, y - 10), 15, 5, fill=False, lw=TN))
        T(29, y - 5, n_, size=8.5, va='center'); T(45.5, y - 2.5, sd(u), size=8, va='center'); T(45.5, y - 7.5, sd(lo), size=8, va='center')

    gx, gy = V(318, 296, 330), V(74, 70, 82)
    rough(gx, gy, 'N9'); T(gx + 7, gy + 1, '(', size=20, ha='left')
    for i, nn in enumerate(['N6', 'N7', 'N8']): rough(gx + 15 + i * 11, gy, nn)
    T(gx + 45, gy + 1, ')', size=20, ha='left')

    mass = sum(math.pi / 4 * d * d * l for d, l in segs) * 7.85e-6
    bx, by = 230, 10

    def cell(x, y, w, h, lab=None, val=None, vs=10):
        ax.add_patch(plt.Rectangle((x, y), w, h, fill=False, lw=TN))
        if lab: T(x + 0.8, y + h - 0.6, lab, size=6, ha='left', va='top')
        if val: T(x + w / 2, y + h / 2 - 1.2, val, size=vs, va='center')

    ax.add_patch(plt.Rectangle((bx, by), 180, 56, fill=False, lw=TH))
    cell(bx, by + 48, 55, 8, 'Толеранције слободних мјера:', 'JUS M.A1.420', 9)
    cell(bx + 55, by + 48, 45, 8, 'Површинска храпавост:', 'N9 (N6, N7, N8)', 9)
    cell(bx + 100, by + 48, 80, 8, 'Површинска заштита:', '—', 9)
    cell(bx, by + 40, 100, 8, 'Материјал:', f"Č.{r['mat']}", 10)
    cell(bx + 100, by + 40, 80, 8, 'Термичка обрада:', '—', 9)
    cell(bx, by + 32, 16, 8)
    px, py = bx + 2, by + 34
    ax.add_patch(Polygon([(px, py + 1), (px + 6, py), (px + 6, py + 4), (px, py + 3)], closed=True, fill=False, lw=TN))
    ax.add_patch(Circle((px + 10.5, py + 2), 2, fill=False, lw=TN)); ax.add_patch(Circle((px + 10.5, py + 2), 1, fill=False, lw=TN))
    cell(bx + 16, by + 32, 84, 8, 'Бр. комада:', '1', 9)
    cell(bx + 100, by + 32, 25, 8, 'Формат:', 'A3', 9)
    cell(bx + 125, by + 32, 30, 8, 'Маса:', f'{mass:.1f} kg'.replace('.', ','), 9)
    cell(bx + 155, by + 32, 25, 8, 'Размјера:', scale_txt, 9)
    for i, lab in enumerate(['Датум', 'Обрадио', 'Прегледао', 'Одобрио']):
        y = by + 24 - i * 6
        cell(bx, y, 20, 6); T(bx + 1, y + 1.6, lab, size=7, ha='left'); cell(bx + 20, y, 40, 6); cell(bx + 60, y, 40, 6)
    if inp.get('ime'): T(bx + 40, by + 19.6, inp['ime'], size=7.5)
    T(bx + 30, by + 26.8, 'Име и презиме', size=6.5); T(bx + 80, by + 26.8, 'Потпис', size=6.5)
    cell(bx, by, 100, 6, None, inp.get('skola', 'ЈУ ТЕХНИЧКА ШКОЛА ГРАДИШКА'), 8.5)
    cell(bx + 100, by + 12, 80, 20, 'Назив:'); T(bx + 140, by + 19, 'ВРАТИЛО I', size=17)
    cell(bx + 100, by, 60, 12, 'Ознака:', 'МАШИНСКИ ЕЛЕМЕНТИ', 9)
    cell(bx + 160, by, 20, 12, 'Лист:', '1/1', 9)
    fig.savefig(out_pdf); fig.savefig(out_png, dpi=150)
    return dict(segs=segs, Ltot=Ltot, scale=scale_txt, mass=round(mass, 2))


def main():
    inp = json.load(open(sys.argv[1], encoding='utf-8'))
    out = sys.argv[2]; os.makedirs(out, exist_ok=True)
    r = calc(inp)
    tag = inp.get('ime', '').replace(' ', '_') or 'ucenik'
    fill_form(inp, r, os.path.join(out, f'Graficki_rad_1_obrazac_{tag}.docx'))
    steps_doc(inp, r, os.path.join(out, f'Proracun_vratilo_I_{tag}.docx'))
    g = drawing(inp, r, os.path.join(out, f'Vratilo_I_crtez_{tag}.pdf'), os.path.join(out, 'preview.png'))
    r['crtez'] = g
    json.dump(r, open(os.path.join(out, 'rezultati.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1, default=str)
    keys = ['FAH', 'FBH', 'FAV', 'FA', 'FB', 'Ml', 'Md', 'T', 'Miz', 'dis', 'diz', 'dS', 'dA', 'dZ_rule', 'dZ', 'b', 'h', 't',
            'xi1', 'xi2', 'W', 'Ss', 'St', 'S', 'kl', 'Ftk', 'p']
    for k in keys: print(k, r[k])
    print('S po pokusaju:', [(a, b) for a, b, _ in r['tries']]); print('crtez:', g)


if __name__ == '__main__':
    main()
