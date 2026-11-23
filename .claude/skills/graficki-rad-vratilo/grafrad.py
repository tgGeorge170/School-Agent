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
    import re, subprocess, tempfile, docx
    from docx.shared import Pt, RGBColor
    from docx.oxml.ns import qn
    from docx.oxml import OxmlElement

    def M(x, n=None):
        return fmt(x, n).replace('−', '-').replace(',', '{,}')

    md = []

    def tx(_t, **v):
        return re.sub(r'«(\w+)»', lambda m: str(v[m.group(1)]), _t)

    def H(level, t): md.append('#' * level + ' ' + t)
    def P(t): md.append(t)
    def E(_t, **v): md.append('$$' + tx(_t, **v) + '$$')
    def IM(_t, **v): return '$' + tx(_t, **v) + '$'
    def box(style, *lines): md.append(f'::: {{custom-style="{style}"}}\n' + '\n\n'.join(lines) + '\n:::')

    a, l, d1 = M(r['a']), M(inp['l']), M(inp['d1'])
    Fr, Fa, Ft = M(inp['Fr']), M(inp['Fa']), M(inp['Ft'])
    U = r'\ \mathrm{N}'; Nmm = r'\ \mathrm{Nmm}'; mm = r'\ \mathrm{mm}'; Nmm2 = r'\ \mathrm{N/mm^2}'

    box('Naslov', 'П Р О Р А Ч У Н')
    box('NaslovOkvir', 'ВРАТИЛО - I')
    if inp.get('ime'): box('Desno', f"Ученик: {inp['ime']}")
    H(2, 'ПОДАЦИ ЗА ПРОРАЧУН')
    P(f"Снага на погонском вратилу: {IM(r'P = «v»\ \mathrm{kW}', v=M(inp['P']))}\n\n"
      f"Број обртаја ел. мотора: {IM(r'n_1 = «v»\ \mathrm{min^{-1}}', v=M(inp['n']))}\n\n"
      f"Материјал вратила: Č.{r['mat']}\n\n"
      f"Врста радне машине: {IM(r'K_A = «v»', v=M(inp['KA']))}\n\n"
      f"Растојање између лежаја: {IM(r'l_1 = «v»' + mm, v=l)}\n\n"
      f"Обимна сила: {IM(r'F_{t1} = «v»' + U, v=Ft)}, радијална сила: {IM(r'F_{r1} = «v»' + U, v=Fr)}, "
      f"аксијална сила: {IM(r'F_{a1} = «v»' + U, v=Fa)}\n\n"
      f"Подеони пречник зупчаника: {IM(r'd_1 = «v»' + mm, v=d1)}")

    H(2, '1.1. ОТПОРИ ОСЛОНАЦА')
    H(3, '1.1.1. Отпори ослонаца у "H" равни:')
    E(r'\sum M_A^{F_i} = 0')
    P(IM(r'l = «l»\ \mathrm{mm}', l=l) + ' - задато растојање између лежаја (ослонаца) вратила I')
    E(r'-F_{BH}\cdot «l» + F_{r1}\cdot «a» + F_{a1}\cdot\frac{d_1}{2} = 0', l=l, a=a)
    E(r'F_{BH} = \frac{F_{r1}\cdot «a» + F_{a1}\cdot\frac{d_1}{2}}{«l»} = \frac{«Fr»\cdot «a» + «Fa»\cdot\frac{«d1»}{2}}{«l»} = «R»' + U,
      a=a, l=l, Fr=Fr, Fa=Fa, d1=d1, R=M(r['FBH']))
    E(r'\sum M_B^{F_i} = 0')
    E(r'F_{AH}\cdot «l» - F_{r1}\cdot «a» + F_{a1}\cdot\frac{d_1}{2} = 0', l=l, a=a)
    E(r'F_{AH} = \frac{F_{r1}\cdot «a» - F_{a1}\cdot\frac{d_1}{2}}{«l»} = \frac{«Fr»\cdot «a» - «Fa»\cdot\frac{«d1»}{2}}{«l»} = «R»' + U,
      a=a, l=l, Fr=Fr, Fa=Fa, d1=d1, R=M(r['FAH']))
    H(3, '1.1.2. Отпори ослонаца у "V" равни:')
    E(r'\sum M_A^{F_i} = 0')
    E(r'-F_{BV}\cdot «l» + F_{t1}\cdot «a» = 0', l=l, a=a)
    E(r'F_{BV} = \frac{F_{t1}\cdot «a»}{«l»} = \frac{«Ft»\cdot «a»}{«l»} = «R»' + U, a=a, l=l, Ft=Ft, R=M(r['FBV']))
    E(r'F_{AV} = F_{BV} = «R»' + U, R=M(r['FAV']))
    H(3, '1.1.3. Резултујући отпори ослонаца:')
    E(r'F_A = \sqrt{F_{AH}^2 + F_{AV}^2} = \sqrt{«x»^2 + «y»^2} = «R»' + U, x=M(r['FAH']), y=M(r['FAV']), R=M(r['FA']))
    E(r'F_B = \sqrt{F_{BH}^2 + F_{BV}^2} = \sqrt{«x»^2 + «y»^2} = «R»' + U, x=M(r['FBH']), y=M(r['FBV']), R=M(r['FB']))

    H(2, '1.2. МОМЕНТИ САВИЈАЊА')
    H(3, '1.2.1. Моменти савијања у "V" и "H" равни:')
    E(r'M^{l}_{sz_V} = M^{d}_{sz_V} = -F_{AV}\cdot «a» = -«x»\cdot «a» = «R»' + Nmm, a=a, x=M(r['FAV']), R=M(r['MV']))
    E(r'M^{l}_{sz_H} = -F_{AH}\cdot «a» = -«x»\cdot «a» = «R»' + Nmm, a=a, x=M(r['FAH']), R=M(r['MlH']))
    E(r'M^{ld}_{sz_H} = -F_{AH}\cdot «a» - F_{a1}\cdot\frac{d_1}{2} = -«x»\cdot «a» - «Fa»\cdot\frac{«d1»}{2} = «R»' + Nmm,
      a=a, x=M(r['FAH']), Fa=Fa, d1=d1, R=M(r['MldH']))
    E(r'M^{d}_{sz_H} = -F_{BH}\cdot «a» = -«x»\cdot «a» = «R»' + Nmm, a=a, x=M(r['FBH']), R=M(r['MdH']))
    H(3, '1.2.2. Резултујући моменти савијања:')
    E(r'M^{l}_{sz} = \sqrt{\left(M^{l}_{sz_H}\right)^2 + \left(M^{l}_{sz_V}\right)^2} = \sqrt{\left(«x»\right)^2 + \left(«y»\right)^2} = «R»' + Nmm,
      x=M(r['MlH']), y=M(r['MV']), R=M(r['Ml']))
    E(r'M^{d}_{sz} = \sqrt{\left(M^{d}_{sz_H}\right)^2 + \left(M^{d}_{sz_V}\right)^2} = \sqrt{\left(«x»\right)^2 + \left(«y»\right)^2} = «R»' + Nmm,
      x=M(r['MdH']), y=M(r['MV']), R=M(r['Md']))
    E(r'M_{s_{S}} = 0,\quad M_{s_A} = 0,\quad M_{s_B} = 0')
    mname = r'M^{d}_{sz}' if r['Md'] >= r['Ml'] else r'M^{l}_{sz}'
    P('Мјеродаван је већи резултујући момент савијања: ' + IM(mname + r' = «R»' + Nmm, R=M(r['Mmax'])))

    H(2, '1.3. МЕХАНИЧКЕ КАРАКТЕРИСТИКЕ МАТЕРИЈАЛА ВРАТИЛА')
    P(f"Материјал вратила Č.{r['mat']}")
    P(IM(r'\sigma_{D(-1)}') + ' - динамичка чврстоћа на савијање или савојна динамичка издржљивост')
    E(r'\sigma_{D(-1)} = «x» \div «y»' + Nmm2, x=r['sDr'][0], y=r['sDr'][1])
    P('Усвајам: ' + IM(r'\sigma_{D(-1)} = «x»' + Nmm2, x=r['sD']))
    P(IM(r'\tau_{D(0)}') + ' - увојна издржљивост при једносмјерној промјени напона')
    E(r'\tau_{D(0)} = «x» \div «y»' + Nmm2, x=r['tDr'][0], y=r['tDr'][1])
    P('Усвајам: ' + IM(r'\tau_{D(0)} = «x»' + Nmm2, x=r['tD']))
    P(IM(r'\alpha_0') + ' - коефицијент')
    E(r'\alpha_0 = \frac{\sigma_{D(-1)}}{\tau_{D(0)}} = \frac{«x»}{«y»} = «R»', x=r['sD'], y=r['tD'], R=M(r['a0']))
    H(3, '1.3.1. Дозвољени напон савијања:')
    E(r'\sigma_{sd} = \frac{\sigma_{D(-1)}}{S} = \frac{«x»}{4} = «R»' + Nmm2, x=r['sD'], R=M(r['ssd']))
    H(3, '1.3.2. Дозвољени напон увијања:')
    E(r'\tau_{ud} = \frac{\tau_{D(0)}}{S} = \frac{«x»}{3} = «R»' + Nmm2, x=r['tD'], R=M(r['tud']))

    H(2, '1.4. МЈЕРОДАВАН МОМЕНТ ЗА ПРОРАЧУН ВРАТИЛА')
    H(3, '1.4.1. Обртни момент (T) - момент увијања:')
    E(r'T = \frac{P}{\omega}\cdot K_A = \frac{«P»\cdot 10^3}{«w»}\cdot «KA» = «T1»\ \mathrm{Nm} = «T2»' + Nmm,
      P=M(inp['P']), w=M(r['w']), KA=M(inp['KA']), T1=M(r['TNm']), T2=M(r['T']))
    H(4, '4.1.1. Угаона брзина на улазном вратилу:')
    E(r'\omega_1 = \omega_{ul} = \frac{\pi\cdot n_{EM}}{30} = \frac{\pi\cdot «n»}{30} = «R»\ \mathrm{s^{-1}}', n=M(inp['n']), R=M(r['w']))
    H(3, '1.4.2. Упоредни момент:')
    a0, T = M(r['a0']), M(r['T'])
    E(r'M_{is} = \sqrt{\left(M_{s_{S}}\right)^2 + \left(\frac{\alpha_0}{2}\cdot T\right)^2} = \sqrt{0^2 + \left(\frac{«a0»}{2}\cdot «T»\right)^2} = «R»' + Nmm, a0=a0, T=T, R=M(r['Mis']))
    E(r'M_{iA} = \sqrt{\left(M_{s_A}\right)^2 + \left(\frac{\alpha_0}{2}\cdot T\right)^2} = \sqrt{0^2 + \left(\frac{«a0»}{2}\cdot «T»\right)^2} = «R»' + Nmm, a0=a0, T=T, R=M(r['Mis']))
    E(r'M_{iz} = \sqrt{\left(«mn»\right)^2 + \left(\frac{\alpha_0}{2}\cdot T\right)^2} = \sqrt{\left(«x»\right)^2 + \left(\frac{«a0»}{2}\cdot «T»\right)^2} = «R»' + Nmm,
      mn=mname, x=M(r['Mmax']), a0=a0, T=T, R=M(r['Miz']))

    H(2, '1.5. ДИМЕНЗИОНИСАЊЕ ВРАТИЛА - I')
    H(3, '1.5.1. Идеални пречници:')
    E(r'd_{iA} = d_{iS} = \sqrt[3]{\frac{32\cdot M_{iA}}{\pi\cdot\sigma_{sd}}} = \sqrt[3]{\frac{32\cdot «x»}{\pi\cdot «s»}} = «R»' + mm,
      x=M(r['Mis']), s=M(r['ssd']), R=M(r['dis']))
    E(r'd_{iZ} = \sqrt[3]{\frac{32\cdot M_{iZ}}{\pi\cdot\sigma_{sd}}} = \sqrt[3]{\frac{32\cdot «x»}{\pi\cdot «s»}} = «R»' + mm,
      x=M(r['Miz']), s=M(r['ssd']), R=M(r['diz']))
    H(3, '1.5.2. Стварни пречници:')
    P('Стварне пречнике вратила добићемо када идеалне пречнике повећамо за 20% и стандардизујемо их '
      '(први већи стандардни пречник). Између пречника по редосљеду S – A – Z мора бити разлика од најмање 5 mm.')
    E(r'ds_S = 1{,}2\cdot d_{iS} = 1{,}2\cdot «x» = «R»' + mm, x=M(r['dis']), R=M(r['dsS_c']))
    P('Усвајам: ' + IM(r'ds_S = «R»' + mm, R=r['dS']))
    E(r'ds_A = ds_B = 1{,}2\cdot d_{iA} = 1{,}2\cdot «x» = «R»' + mm + r'\quad\Rightarrow\quad ds_A \ge «m» + 5 = «k»' + mm,
      x=M(r['dis']), R=M(r['dsS_c']), m=r['dS'], k=r['dS'] + 5)
    P('Усвајам: ' + IM(r'ds_A = ds_B = «R»' + mm, R=r['dA']))
    E(r'ds_Z = 1{,}2\cdot d_{iZ} = 1{,}2\cdot «x» = «R»' + mm + r'\quad\Rightarrow\quad ds_Z \ge «m» + 5 = «k»' + mm,
      x=M(r['diz']), R=M(r['dsZ_c']), m=r['dA'], k=r['dA'] + 5)
    if r['dZ'] != r['dZ_rule']:
        for i_, (dz, s_, _) in enumerate(r['tries'][:-1]):
            P(f'Са {IM(r"ds_Z = «d»" + mm, d=dz)} степен сигурности износи {IM(r"S = «s» < 1{,}5", s=M(s_))} и НЕ ЗАДОВОЉАВА (тачка 3.0.{i_ + 1}).')
        P('Усвајам први већи стандардни пречник: ' + IM(r'ds_Z = «R»' + mm, R=r['dZ']))
    else:
        P('Усвајам: ' + IM(r'ds_Z = «R»' + mm, R=r['dZ']))
    H(3, '1.5.3. Пречници вратила I:')
    box('Okvir',
        IM(r'd_S = «x»' + mm, x=r['dS']) + ' - пречник вратила на мјесту спојнице.',
        IM(r'd_A = d_B = «x»' + mm, x=r['dA']) + ' - пречници рукаваца на ослонцима A и B (тј. на мјестима лежаја).',
        IM(r'd_Z = «x»' + mm, x=r['dZ']) + ' - пречник вратила на мјесту зупчаника.')

    box('Naslov3', '3\\. ПРОВЈЕРА ВРАТИЛА И КЛИНА ИСПОД ЗУПЧАНИКА I')

    def check_eqs(k, d):
        E(r'W = \left(d - t\right)^3\cdot\frac{\pi}{32} = \left(«d» - «t»\right)^3\cdot\frac{\pi}{32} = «R»\ \mathrm{mm^3}', d=d, t=M(k['t']), R=M(k['W']))
        return k

    for i_, (dz, s_, k) in enumerate(r['tries'][:-1]):
        H(3, f'3.0.{i_ + 1}. Провјера са d = {dz} mm:')
        P(f"Из Табеле 10 (ред {k['krow']}): " + IM(r'b = «b»\ \mathrm{mm},\ h = «h»\ \mathrm{mm},\ t = «t»\ \mathrm{mm},\ r = «r»\ \mathrm{mm}',
                                                      b=k['b'], h=k['h'], t=M(k['t']), r=M(k['r'])))
        E(r'\frac{r}{t} = \frac{«r»}{«t»} = «R»\ \Rightarrow\ \alpha_K = «ak»', r=M(k['r']), t=M(k['t']), R=M(k['rt']), ak=M(k['ak']))
        E(r'\beta_K = \left(\alpha_K - 1\right)\cdot\eta_K + 1 = \left(«ak» - 1\right)\cdot 0{,}65 + 1 = «R»', ak=M(k['ak']), R=M(k['bk']))
        E(r'\xi_2 = «x2»,\quad \xi_1 = «x1»', x2=M(k['xi2']), x1=M(k['xi1']))
        check_eqs(k, dz)
        E(r'\sigma_S = \frac{M_S}{W} = \frac{«m»}{«w»} = «R»' + Nmm2, m=M(r['Mmax']), w=M(k['W']), R=M(k['ss']))
        E(r'\tau_u = \frac{T}{2W} = \frac{«T»}{2\cdot «w»} = «R»' + Nmm2, T=T, w=M(k['W']), R=M(k['tu']))
        E(r'S_\sigma = \frac{\sigma_{D(-1)}\cdot\xi_1\cdot\xi_2}{\beta_K\cdot\sigma_S} = \frac{«s»\cdot «x1»\cdot «x2»}{«bk»\cdot «ss»} = «R»',
          s=r['sD'], x1=M(k['xi1']), x2=M(k['xi2']), bk=M(k['bk']), ss=M(k['ss']), R=M(k['Ss']))
        E(r'S_\tau = \frac{\tau_{D(0)}\cdot\xi_1\cdot\xi_2}{\beta_K\cdot\tau_u} = \frac{«s»\cdot «x1»\cdot «x2»}{«bk»\cdot «tu»} = «R»',
          s=r['tD'], x1=M(k['xi1']), x2=M(k['xi2']), bk=M(k['bk']), tu=M(k['tu']), R=M(k['St']))
        E(r'S = \frac{S_\sigma\cdot S_\tau}{\sqrt{S_\sigma^2 + S_\tau^2}} = \frac{«a»\cdot «b»}{\sqrt{«a»^2 + «b»^2}} = «R»',
          a=M(k['Ss']), b=M(k['St']), R=M(k['S']))
        box('Crveno', IM(r'S = «s» < 1{,}5', s=M(k['S'])) + ' - НЕ ЗАДОВОЉАВА, па се пречник ' + IM('d_Z') + ' повећава на сљедећи стандардни пречник.')

    d = r['dZ']
    H(3, f'3.1. Пречник вратила на мјесту зупчаника I: d = {d} mm')
    P('Из Табеле 10. - нормални клинови:')
    E(r'b = «x»' + mm, x=r['b']); E(r'h = «x»' + mm, x=r['h']); E(r't = «x»' + mm, x=M(r['t'])); E(r'r = «x»' + mm, x=M(r['r']))
    E(r'\frac{t}{d} = \frac{«t»}{«d»} = «R»', t=M(r['t']), d=d, R=M(r['td']))
    E(r'\frac{r}{t} = \frac{«r»}{«t»} = «R»', r=M(r['r']), t=M(r['t']), R=M(r['rt']))
    P(IM(r'R_m = \left(«x» \div «y»\right)' + Nmm2, x=r['Rmr'][0], y=r['Rmr'][1]) + f" - за Č.{r['mat']} из Табеле 11. - затезна чврстоћа; усвајам "
      + IM(r'R_m = «x»' + Nmm2, x=r['Rm']))
    H(3, '3.2. Геометријски фактор концентрације напона:')
    E(r'\beta_K = \left(\alpha_K - 1\right)\cdot\eta_K + 1')
    E(r'\beta_K = \left(«ak» - 1\right)\cdot 0{,}65 + 1 = «R»', ak=M(r['ak']), R=M(r['bk']))
    P(IM(r'\alpha_K = «x»', x=M(r['ak'])) + ' - (Слика 4.)')
    P(IM(r'\eta_K = 0{,}65') + ' - фактор осјетљивости материјала на концентрацију ' + IM(r'\left(\eta_K = 0{,}5 \div 1\right)'))
    H(3, '3.3. Фактор храпавости површина:')
    P(IM(r'\xi_2 = «x»', x=M(r['xi2'])) + ' - са Слике 5.')
    H(3, '3.4. Фактор величине пресјека:')
    P(IM(r'\xi_1 = «x»', x=M(r['xi1'])) + ' - Табела 12.')
    H(3, '3.5. Отпорни момент пресјека:')
    E(r'W = \left(d - t\right)^3\cdot\frac{\pi}{32} = \left(«d» - «t»\right)^3\cdot\frac{\pi}{32} = «R»\ \mathrm{mm^3}', d=d, t=M(r['t']), R=M(r['W']))
    H(3, '3.6. Напон савијања:')
    E(r'\sigma_S = \frac{M_S}{W} = \frac{«m»}{«w»} = «R»' + Nmm2, m=M(r['Mmax']), w=M(r['W']), R=M(r['ss']))
    P('\\- усваја се највећи резултујући момент савијања из тачке 1.2.2.')
    H(3, '3.7. Напон увијања:')
    E(r'\tau_u = \frac{T}{W_p} = \frac{T}{2W} = \frac{«T»}{2\cdot «w»} = «R»' + Nmm2, T=T, w=M(r['W']), R=M(r['tu']))
    H(3, '3.8. Степен сигурности:')
    E(r'S_\sigma = \frac{\sigma_{D(-1)}\cdot\xi_1\cdot\xi_2}{\beta_K\cdot\sigma_S} = \frac{«s»\cdot «x1»\cdot «x2»}{«bk»\cdot «ss»} = «R»',
      s=r['sD'], x1=M(r['xi1']), x2=M(r['xi2']), bk=M(r['bk']), ss=M(r['ss']), R=M(r['Ss']))
    E(r'S_\tau = \frac{\tau_{D(0)}\cdot\xi_1\cdot\xi_2}{\beta_K\cdot\tau_u} = \frac{«s»\cdot «x1»\cdot «x2»}{«bk»\cdot «tu»} = «R»',
      s=r['tD'], x1=M(r['xi1']), x2=M(r['xi2']), bk=M(r['bk']), tu=M(r['tu']), R=M(r['St']))
    E(r'S = \frac{S_\sigma\cdot S_\tau}{\sqrt{S_\sigma^2 + S_\tau^2}} = \frac{«a»\cdot «b»}{\sqrt{«a»^2 + «b»^2}} = «R»',
      a=M(r['Ss']), b=M(r['St']), R=M(r['S']))
    P('\\- што задовољава јер S треба да буде: ' + IM(r'S = 1{,}5 \div 3') if r['S'] <= 3 else
      '\\- S је веће од 3: вратило задовољава услов чврстоће, али је предимензионисано.')
    H(3, f"3.9. За пречник вратила d = {d} mm мјере клина износе: {r['b']} x {r['h']} x {r['kl']} - JUS M.C2.060")
    P(f"Усвајам стандардну дужину клина: l = {r['kl']} mm (за d = {r['klrow'].replace('–', ' - ')} mm).")
    H(3, '3.10. Дубина жљеба у вратилу: ' + f"t = {fmt(r['t'])} mm")
    P('а дубина жљеба у главчини: ' + IM(r't_1 = h - t = «h» - «t» = «R»' + mm, h=r['h'], t=M(r['t']), R=M(r['t1'])))
    H(3, '3.11. Корисна дужина клина:')
    E(r'l_K = l - b = «l» - «b» = «R»' + mm, l=r['kl'], b=r['b'], R=r['lk'])
    H(3, '3.12. Обимна сила на клину:')
    E(r'F_{tK} = \frac{2\cdot T\cdot K_A}{d} = \frac{2\cdot «T0»\cdot «KA»}{«d»} = «R»' + U, T0=M(r['T0']), KA=M(inp['KA']), d=d, R=M(r['Ftk']))
    P('(овдје је ' + IM(r'T = \frac{P}{\omega_1} = \frac{«P»}{«w»} = «T0»' + Nmm, P=M(inp['P'] * 1000), w=M(r['w']), T0=M(r['T0'])) + ' без фактора ' + IM('K_A') + ')')
    H(3, '3.13. Површински притисак:')
    E(r'p = \frac{F_{tK}}{l_K\cdot t_1} = \frac{«F»}{«l»\cdot «t»} = «R»' + Nmm2, F=M(r['Ftk']), l=r['lk'], t=M(r['t1']), R=M(r['p']))
    if r['p'] < 100:
        H(3, '3.14. Површински притисак задовољава јер је за главчине од челика:')
        E(r'p_d = 75 \div 100' + Nmm2)
    else:
        box('Crveno', '3.14. Површински притисак НЕ ЗАДОВОЉАВА (p ≥ 100 N/mm²).')

    with tempfile.TemporaryDirectory() as td:
        src = os.path.join(td, 'p.md'); tmp = os.path.join(td, 'p.docx')
        open(src, 'w', encoding='utf-8').write('\n\n'.join(md) + '\n')
        subprocess.run(['pandoc', src, '-f', 'markdown+tex_math_dollars', '-o', tmp], check=True)
        D = docx.Document(tmp)

    RED = RGBColor(0xC0, 0, 0)
    MNS = 'http://schemas.openxmlformats.org/officeDocument/2006/math'
    from lxml import etree
    word = re.compile(r'^[\w,]+$')
    def rt(e):
        if e is None or e.tag != f'{{{MNS}}}r': return None
        t = e.find(f'{{{MNS}}}t'); return t.text if t is not None else None
    for parent in list(D.element.body.iter()):
        kids = list(parent)
        i = 0
        while i + 2 < len(kids):
            x, c, y = rt(kids[i]), rt(kids[i + 1]), rt(kids[i + 2])
            if x and c == ',' and y and x[-1].isdigit() and y[0].isdigit():
                kids[i].find(f'{{{MNS}}}t').text = x + ',' + y
                parent.remove(kids[i + 1]); parent.remove(kids[i + 2]); del kids[i + 1:i + 3]
                continue
            i += 1
    for parent in D.element.body.iter():
        prev = None
        for ch in list(parent):
            if ch.tag != f'{{{MNS}}}r':
                prev = None; continue
            t = ch.find(f'{{{MNS}}}t'); rp = ch.find(f'{{{MNS}}}rPr')
            key = etree.tostring(rp) if rp is not None else b''
            if prev is not None and t is not None and t.text and word.match(t.text) and prev[1] == key:
                prev[0].text += t.text; parent.remove(ch); continue
            prev = (t, key) if (t is not None and t.text and word.match(t.text)) else None

    def border(p_or_style_el, color='C00000', sz=12):
        pPr = p_or_style_el.get_or_add_pPr()
        b = OxmlElement('w:pBdr')
        for side in ('top', 'left', 'bottom', 'right'):
            e = OxmlElement(f'w:{side}'); e.set(qn('w:val'), 'single'); e.set(qn('w:sz'), str(sz))
            e.set(qn('w:space'), '4'); e.set(qn('w:color'), color); b.append(e)
        pPr.append(b)

    byname = {x.name.lower(): x for x in D.styles}
    for nm in ('normal', 'body text', 'first paragraph'):
        if nm in byname:
            byname[nm].font.name = 'Calibri'; byname[nm].font.size = Pt(12)
    for nm, size in (('heading 2', 13), ('heading 3', 12), ('heading 4', 12)):
        if nm in byname:
            s = byname[nm]; s.font.color.rgb = RGBColor(0, 0, 0); s.font.bold = True; s.font.size = Pt(size); s.font.name = 'Calibri'
            if nm == 'heading 2': s.font.underline = True
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    for p in D.paragraphs:
        sn = p.style.name
        if sn in ('Naslov', 'NaslovOkvir'):
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for run in p.runs: run.font.size = Pt(26 if sn == 'Naslov' else 18); run.font.bold = sn == 'NaslovOkvir'; run.font.color.rgb = RED
        if sn == 'NaslovOkvir':
            border(p._p); p.paragraph_format.left_indent = Pt(160); p.paragraph_format.right_indent = Pt(160)
        if sn == 'Okvir':
            border(p._p); p.paragraph_format.space_after = Pt(0)
        if sn == 'Naslov3':
            for run in p.runs: run.font.size = Pt(15); run.font.bold = True; run.font.color.rgb = RED; run.font.underline = True
        if sn == 'Crveno':
            for run in p.runs: run.font.bold = True; run.font.color.rgb = RED
        if sn == 'Desno':
            p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
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
    fill_form(inp, r, os.path.join(out, f'{tag}_obrazac.docx'))
    steps_doc(inp, r, os.path.join(out, f'{tag}_proracun.docx'))
    g = drawing(inp, r, os.path.join(out, f'{tag}_crtez.pdf'), os.path.join(out, 'preview.png'))
    r['crtez'] = g
    json.dump(r, open(os.path.join(out, 'rezultati.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1, default=str)
    keys = ['FAH', 'FBH', 'FAV', 'FA', 'FB', 'Ml', 'Md', 'T', 'Miz', 'dis', 'diz', 'dS', 'dA', 'dZ_rule', 'dZ', 'b', 'h', 't',
            'xi1', 'xi2', 'W', 'Ss', 'St', 'S', 'kl', 'Ftk', 'p']
    for k in keys: print(k, r[k])
    print('S po pokusaju:', [(a, b) for a, b, _ in r['tries']]); print('crtez:', g)


if __name__ == '__main__':
    main()
