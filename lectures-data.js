// Lecture content for the Predavanja tab.
//
// Filled in from photos of the student's own notebook — each entry is one
// subject, with its lessons in the order the plan teaches them. The player
// reads `title`, `summary`, every section and the `key` points aloud.
//
// Everything inside concat(...) must stay strict JSON: the app also downloads
// this file from GitHub (through the worker) to get new lessons without an update.
//
//   {
//     id: "cnc-programiranje", subject: "CNC programiranje", icon: "🔧", order: 1,
//     lessons: [{
//       id: "cnc-1-1",
//       module: "1. Programiranje NUMA",
//       title: "Uvod u numeričko upravljanje",
//       summary: "Jedna rečenica o čemu je lekcija.",
//       sections: [{ h: "Naslov dijela", img: "<svg ...>", cap: "Opis slike", p: ["Pasus."] }],
//       key: ["Ono što se pita na testu."]
//     }]
//   }
window.LECTURES = (window.LECTURES || []).concat([
  {
    "id": "termodinamika",
    "subject": "Termodinamika",
    "icon": "🔥",
    "order": 2,
    "lessons": [
      {
        "id": "tmd-1-1",
        "module": "1. Osnovni pojmovi",
        "title": "Šta je termodinamika",
        "summary": "Termodinamika izučava pretvaranje toplotne energije u druge oblike energije i obratno.",
        "sections": [
          {
            "h": "Odakle naziv",
            "p": [
              "Riječ dolazi od dvije grčke riječi. Thermos znači toplota, a dynamics znači kretanje tijela, uzimajući u obzir uzroke tog kretanja.",
              "Zajedno to znači toplota koja pokreće. Primjer je parna lokomotiva: ugalj gori, toplota pravi paru, a para gura klipove i pokreće voz."
            ]
          },
          {
            "h": "Toplota nije isto što i temperatura",
            "p": [
              "Toplota je energija, i to energija koja prelazi sa jednog tijela na drugo.",
              "Temperatura je fizička veličina. Ona pokazuje koliko je tijelo toplo, to je broj na termometru.",
              "Primjer: šolja ključale vode ima sto stepeni, a kada tople vode četrdeset. Šolja ima veću temperaturu, ali kada ima mnogo više toplote, jer ima mnogo više vode."
            ]
          },
          {
            "h": "Šta termodinamika izučava",
            "img": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 360 170\" font-family=\"Arial,Helvetica,sans-serif\" font-size=\"13\" fill=\"#1f2328\"><defs><marker id=\"a\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10z\" fill=\"context-stroke\"/></marker></defs>\n<rect x=\"10\" y=\"55\" width=\"120\" height=\"60\" rx=\"10\" fill=\"#fff4e6\" stroke=\"#d9480f\" stroke-width=\"2\"/>\n<text x=\"70\" y=\"82\" text-anchor=\"middle\" font-weight=\"bold\" fill=\"#d9480f\">TOPLOTA</text><text x=\"70\" y=\"100\" text-anchor=\"middle\">energija</text>\n<rect x=\"230\" y=\"55\" width=\"120\" height=\"60\" rx=\"10\" fill=\"#e7f5ff\" stroke=\"#1c7ed6\" stroke-width=\"2\"/>\n<text x=\"290\" y=\"82\" text-anchor=\"middle\" font-weight=\"bold\" fill=\"#1c7ed6\">MEHANIČKI</text><text x=\"290\" y=\"100\" text-anchor=\"middle\" font-weight=\"bold\" fill=\"#1c7ed6\">RAD</text>\n<path d=\"M135 68 L225 68\" stroke=\"#d9480f\" stroke-width=\"2.5\" marker-end=\"url(#a)\"/>\n<text x=\"180\" y=\"40\" text-anchor=\"middle\" font-size=\"12\">motor, turbina</text><text x=\"180\" y=\"56\" text-anchor=\"middle\" font-size=\"12\" fill=\"#868e96\">toplota → rad</text>\n<path d=\"M225 102 L135 102\" stroke=\"#1c7ed6\" stroke-width=\"2.5\" marker-end=\"url(#a)\"/>\n<text x=\"180\" y=\"128\" text-anchor=\"middle\" font-size=\"12\">trenje, kočnice</text><text x=\"180\" y=\"144\" text-anchor=\"middle\" font-size=\"12\" fill=\"#868e96\">rad → toplota</text></svg>",
            "cap": "Toplota i rad prelaze jedno u drugo",
            "p": [
              "Termodinamika izučava pojave vezane za pretvaranje toplotne energije u druge oblike energije i obratno.",
              "Toplota prelazi u rad kada u motoru automobila gorivo sagori, gasovi se šire i guraju klip. Rad prelazi u toplotu kod trenja, na primjer kada auto koči i diskovi se zagriju."
            ]
          },
          {
            "h": "Tehnička termodinamika",
            "p": [
              "Tehnička termodinamika opisuje i proučava procese uzajamnog pretvaranja toplote u mehaničku energiju i obratno. Ona je osnov za razumijevanje rada toplotnih mašina i uređaja: parnih kotlova i turbina, SUS motora, rashladnih i klima uređaja, i procesa prostiranja toplote.",
              "Primjer je termoelektrana: u kotlu gori ugalj, voda postaje para, para vrti turbinu, a turbina vrti generator koji pravi struju."
            ]
          },
          {
            "h": "Prvi i drugi zakon",
            "p": [
              "Osnovni zakon termodinamike proučava odnose između toplotne i mehaničke energije, kao i mogućnost pretvaranja toplotne energije u mehaničku. Pri tome se teži da se ostvari što veći korisni efekat.",
              "Dodatno objašnjenje: prvi zakon kaže da se energija ne može ni stvoriti ni uništiti, samo mijenja oblik. Drugi zakon kaže da se nikada sva toplota ne pretvori u rad, dio uvijek ode u okolinu.",
              "Primjer: do točkova automobila stigne samo oko trećina energije goriva, a ostalo ode kao toplota kroz auspuh i hladnjak. Zato se teži što većem korisnom efektu."
            ]
          }
        ],
        "key": [
          "Thermos znači toplota, dynamics znači kretanje uzimajući u obzir uzroke.",
          "Toplota je energija, a temperatura je fizička veličina.",
          "Termodinamika izučava pretvaranje toplotne energije u druge oblike energije i obratno.",
          "Primjena: parni kotlovi i turbine, SUS motori, rashladni i klima uređaji, prostiranje toplote.",
          "Cilj je što veći korisni efekat."
        ]
      },
      {
        "id": "tmd-1-2",
        "module": "1. Osnovni pojmovi",
        "title": "Termodinamički sistem",
        "summary": "Sistem je određena količina materije ograničena zatvorenom površinom, to jest granicom.",
        "sections": [
          {
            "h": "Sistem, granica i okolina",
            "img": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 360 230\" font-family=\"Arial,Helvetica,sans-serif\" font-size=\"13\" fill=\"#1f2328\"><defs><marker id=\"a\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10z\" fill=\"context-stroke\"/></marker></defs>\n<rect x=\"5\" y=\"5\" width=\"350\" height=\"220\" rx=\"12\" fill=\"#f1f3f5\"/>\n<text x=\"20\" y=\"28\" font-weight=\"bold\" fill=\"#868e96\">OKOLINA</text>\n<ellipse cx=\"180\" cy=\"120\" rx=\"95\" ry=\"75\" fill=\"#fff\" stroke=\"#1c7ed6\" stroke-width=\"3\" stroke-dasharray=\"8 5\"/>\n<text x=\"180\" y=\"95\" text-anchor=\"middle\" font-weight=\"bold\" fill=\"#1c7ed6\">SISTEM</text>\n<text x=\"180\" y=\"122\" text-anchor=\"middle\" font-size=\"15\">m</text><text x=\"180\" y=\"146\" text-anchor=\"middle\" font-size=\"15\">p, V, T</text>\n<path d=\"M320 185 L262 160\" stroke=\"#1f2328\" stroke-width=\"1.5\" marker-end=\"url(#a)\"/>\n<text x=\"300\" y=\"208\" text-anchor=\"middle\" font-weight=\"bold\">granica</text></svg>",
            "cap": "Sistem, granica i okolina, kao na crtežu u svesci",
            "p": [
              "Pod pojmom sistema podrazumijeva se određena količina materije ograničena nekom zatvorenom površinom, to jest granicom. Sve što nije uključeno u sistem čini okolinu sistema.",
              "Zamisli da olovkom zaokružiš ono što posmatraš. Unutar kruga je sistem, linija je granica, a sve van nje je okolina.",
              "Primjer: gas u cilindru motora je sistem, zidovi cilindra i klip su granica, a sve oko motora je okolina.",
              "Sistem na kome se posmatraju termodinamičke promjene zove se termodinamički sistem. Kroz granicu se mogu razmjenjivati masa i energija, ali postoje i sistemi kod kojih razmjena nije moguća."
            ]
          },
          {
            "h": "Vrste sistema",
            "img": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 360 140\" font-family=\"Arial,Helvetica,sans-serif\" font-size=\"13\" fill=\"#1f2328\"><defs><marker id=\"a\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10z\" fill=\"context-stroke\"/></marker></defs><text x=\"180\" y=\"22\" text-anchor=\"middle\" font-size=\"12\" fill=\"#868e96\">šta prolazi kroz granicu</text><rect x=\"6\" y=\"40\" width=\"78\" height=\"60\" rx=\"8\" fill=\"#fff\" stroke=\"#1f2328\" stroke-width=\"2\"/><text x=\"45\" y=\"125\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"12\">OTVOREN</text><text x=\"45\" y=\"62\" text-anchor=\"middle\" font-size=\"12\" fill=\"#2b8a3e\">masa ✓</text><text x=\"45\" y=\"84\" text-anchor=\"middle\" font-size=\"12\" fill=\"#2b8a3e\">energija ✓</text><rect x=\"94\" y=\"40\" width=\"78\" height=\"60\" rx=\"8\" fill=\"#fff\" stroke=\"#1f2328\" stroke-width=\"2\"/><text x=\"133\" y=\"125\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"12\">ZATVOREN</text><text x=\"133\" y=\"62\" text-anchor=\"middle\" font-size=\"12\" fill=\"#c92a2a\">masa ✗</text><text x=\"133\" y=\"84\" text-anchor=\"middle\" font-size=\"12\" fill=\"#2b8a3e\">energija ✓</text><rect x=\"182\" y=\"40\" width=\"78\" height=\"60\" rx=\"8\" fill=\"#fff\" stroke=\"#1f2328\" stroke-width=\"2\"/><text x=\"221\" y=\"125\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"12\">ADIJABATSKI</text><text x=\"221\" y=\"75\" text-anchor=\"middle\" font-size=\"12\" fill=\"#c92a2a\">toplota ✗</text><rect x=\"270\" y=\"40\" width=\"78\" height=\"60\" rx=\"8\" fill=\"#fff\" stroke=\"#1f2328\" stroke-width=\"2\"/><text x=\"309\" y=\"125\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"12\">DIJABATSKI</text><text x=\"309\" y=\"75\" text-anchor=\"middle\" font-size=\"12\" fill=\"#2b8a3e\">toplota ✓</text></svg>",
            "cap": "Četiri vrste sistema",
            "p": [
              "Otvoren sistem sa okolinom razmjenjuje i masu i energiju. Primjer je lonac bez poklopca: toplota ulazi sa ringle, a para izlazi.",
              "Zatvoren sistem ima granicu koja ne propušta masu, ali energija prolazi. Primjer je ekspres lonac sa zaključanim poklopcem.",
              "Adijabatski sistem ne razmjenjuje toplotu sa okolinom. Primjer je termos boca, u kojoj čaj ostaje topao satima.",
              "Dijabatski sistem razmjenjuje toplotu sa okolinom. Primjer je obična metalna šolja, u kojoj se čaj brzo ohladi.",
              "Trik za pamćenje: otvoren i zatvoren se odnose na masu, a adijabatski i dijabatski na toplotu. Slovo a na početku znači ne, pa adijabatski znači ne propušta toplotu."
            ]
          }
        ],
        "key": [
          "Sistem je materija ograničena granicom, sve van nje je okolina.",
          "Otvoren sistem: prolaze i masa i energija.",
          "Zatvoren sistem: masa ne prolazi, energija da.",
          "Adijabatski: nema razmjene toplote. Dijabatski: ima razmjene toplote."
        ]
      },
      {
        "id": "tmd-1-3",
        "module": "1. Osnovni pojmovi",
        "title": "Nulti zakon i termodinamička ravnoteža",
        "summary": "Toplota uvijek sama od sebe prelazi sa tijela više temperature na tijelo niže temperature.",
        "sections": [
          {
            "h": "Nulti zakon termodinamike",
            "img": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 360 190\" font-family=\"Arial,Helvetica,sans-serif\" font-size=\"13\" fill=\"#1f2328\"><defs><marker id=\"a\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10z\" fill=\"context-stroke\"/></marker></defs>\n<rect x=\"15\" y=\"20\" width=\"110\" height=\"70\" rx=\"8\" fill=\"#ffe3e3\" stroke=\"#d9480f\" stroke-width=\"2\"/><text x=\"70\" y=\"52\" text-anchor=\"middle\" font-weight=\"bold\" fill=\"#d9480f\">T_A</text><text x=\"70\" y=\"72\" text-anchor=\"middle\" font-size=\"12\">toplije</text>\n<rect x=\"235\" y=\"20\" width=\"110\" height=\"70\" rx=\"8\" fill=\"#e7f5ff\" stroke=\"#1c7ed6\" stroke-width=\"2\"/><text x=\"290\" y=\"52\" text-anchor=\"middle\" font-weight=\"bold\" fill=\"#1c7ed6\">T_B</text><text x=\"290\" y=\"72\" text-anchor=\"middle\" font-size=\"12\">hladnije</text>\n<path d=\"M130 55 L230 55\" stroke=\"#d9480f\" stroke-width=\"3\" marker-end=\"url(#a)\"/><text x=\"180\" y=\"45\" text-anchor=\"middle\" font-weight=\"bold\">Q</text>\n<path d=\"M180 100 L180 125\" stroke=\"#868e96\" stroke-width=\"2\" marker-end=\"url(#a)\"/>\n<rect x=\"15\" y=\"130\" width=\"110\" height=\"45\" rx=\"8\" fill=\"#f3f0ff\" stroke=\"#7048e8\" stroke-width=\"2\"/><text x=\"70\" y=\"158\" text-anchor=\"middle\">T</text>\n<rect x=\"235\" y=\"130\" width=\"110\" height=\"45\" rx=\"8\" fill=\"#f3f0ff\" stroke=\"#7048e8\" stroke-width=\"2\"/><text x=\"290\" y=\"158\" text-anchor=\"middle\">T</text>\n<text x=\"180\" y=\"158\" text-anchor=\"middle\" font-weight=\"bold\" fill=\"#7048e8\">T_A = T_B</text></svg>",
            "cap": "Toplota Q ide od toplijeg A ka hladnijem B dok se temperature ne izjednače",
            "p": [
              "Ako se dva sistema različitih toplotnih stanja dovedu u međusobnu vezu, toplota će se razmjenjivati kroz granicu sve dok temperature svih dijelova sistema ne budu jednake. Pri tome toplota uvijek sama od sebe prelazi sa tijela više temperature na tijelo niže temperature.",
              "Primjer: kafa ostavljena na stolu hladi se dok ne dostigne temperaturu sobe. Nikada se sama od sebe ne ugrije još više.",
              "Toplota se ponaša kao voda niz brdo: uvijek teče sa višeg na niže, i stane kada se nivoi izjednače."
            ]
          },
          {
            "h": "Termodinamička ravnoteža",
            "img": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 360 150\" font-family=\"Arial,Helvetica,sans-serif\" font-size=\"13\" fill=\"#1f2328\"><defs><marker id=\"a\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10z\" fill=\"context-stroke\"/></marker></defs>\n<rect x=\"5\" y=\"10\" width=\"110\" height=\"60\" rx=\"8\" fill=\"#fff\" stroke=\"#1f2328\" stroke-width=\"2\"/><text x=\"60\" y=\"35\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"12\">mehanička</text><text x=\"60\" y=\"56\" text-anchor=\"middle\">ΣF = 0</text>\n<rect x=\"125\" y=\"10\" width=\"110\" height=\"60\" rx=\"8\" fill=\"#fff\" stroke=\"#1f2328\" stroke-width=\"2\"/><text x=\"180\" y=\"35\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"12\">termička</text><text x=\"180\" y=\"56\" text-anchor=\"middle\">T svuda ista</text>\n<rect x=\"245\" y=\"10\" width=\"110\" height=\"60\" rx=\"8\" fill=\"#fff\" stroke=\"#1f2328\" stroke-width=\"2\"/><text x=\"300\" y=\"35\" text-anchor=\"middle\" font-weight=\"bold\" font-size=\"12\">hemijska</text><text x=\"300\" y=\"56\" text-anchor=\"middle\" font-size=\"12\">μ svuda isti</text>\n<path d=\"M60 72 L150 105\" stroke=\"#868e96\" stroke-width=\"2\" marker-end=\"url(#a)\"/><path d=\"M180 72 L180 103\" stroke=\"#868e96\" stroke-width=\"2\" marker-end=\"url(#a)\"/><path d=\"M300 72 L210 105\" stroke=\"#868e96\" stroke-width=\"2\" marker-end=\"url(#a)\"/>\n<rect x=\"85\" y=\"108\" width=\"190\" height=\"36\" rx=\"18\" fill=\"#ebfbee\" stroke=\"#2b8a3e\" stroke-width=\"2\"/><text x=\"180\" y=\"131\" text-anchor=\"middle\" font-weight=\"bold\" fill=\"#2b8a3e\">TMD RAVNOTEŽA</text></svg>",
            "cap": "Tri ravnoteže zajedno daju termodinamičku ravnotežu",
            "p": [
              "Za postojanje termodinamičke ravnoteže neophodno je da u svim dijelovima sistema postoji mehanička, termička i hemijska ravnoteža. Tada se u sistemu ništa više ne mijenja samo od sebe.",
              "Mehanička ravnoteža je postignuta ako je zbir svih sila u sistemu jednak nuli. Primjer je natezanje konopca: kada obje ekipe vuku jednako, konopac stoji.",
              "Termička ravnoteža je uspostavljena kada svi dijelovi sistema imaju jednaku temperaturu. Primjer je kafa koja se ohladila na temperaturu sobe.",
              "Hemijska ravnoteža postoji kada je hemijski potencijal jednak u svim dijelovima sistema. Hemijski potencijal je težnja supstance da se premjesti ili reaguje. Primjer je šećer u čaju: kada je čaj svuda jednako sladak, šećer više nema kuda."
            ]
          }
        ],
        "key": [
          "Nulti zakon: toplota sama od sebe ide sa toplijeg na hladnije tijelo, dok se temperature ne izjednače.",
          "Termodinamička ravnoteža je mehanička, termička i hemijska ravnoteža zajedno.",
          "Mehanička: zbir svih sila je nula. Termička: svuda ista temperatura. Hemijska: svuda isti hemijski potencijal."
        ]
      },
      {
        "id": "tmd-1-4",
        "module": "1. Osnovni pojmovi",
        "title": "Stanje i veličine stanja",
        "summary": "Stanje termodinamičkog sistema definiše se jednačinom f od p, v, T jednako nula.",
        "sections": [
          {
            "h": "Jednačina stanja",
            "p": [
              "Stanje nekog termodinamičkog sistema definiše se jednačinom f od p, v, T jednako nula. To znači da su pritisak, specifična zapremina i temperatura povezani: ako znaš dvije, treća je određena.",
              "Primjer: guma automobila ljeti na suncu. Temperatura vazduha u gumi poraste, pa poraste i pritisak."
            ]
          },
          {
            "h": "Termičke veličine stanja",
            "p": [
              "Fizičke veličine čija vrijednost određuje stanje sistema nazivaju se termičkim veličinama stanja. Neke se mjere direktno, kao pritisak manometrom i temperatura termometrom, a druge se izvode pomoću matematičke zavisnosti."
            ]
          },
          {
            "h": "Ekstenzivne i intenzivne veličine",
            "img": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 360 230\" font-family=\"Arial,Helvetica,sans-serif\" font-size=\"13\" fill=\"#1f2328\"><defs><marker id=\"a\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10z\" fill=\"context-stroke\"/></marker></defs><rect x=\"20\" y=\"30.0\" width=\"70\" height=\"90.0\" fill=\"#a5d8ff\"/><path d=\"M20 20 L20 120 L90 120 L90 20\" fill=\"none\" stroke=\"#1f2328\" stroke-width=\"2\"/><text x=\"55.0\" y=\"138\" text-anchor=\"middle\" font-size=\"12\">V = 2 L</text><text x=\"55.0\" y=\"154\" text-anchor=\"middle\" font-size=\"12\">m = 2 kg</text><text x=\"55.0\" y=\"170\" text-anchor=\"middle\" font-size=\"12\">t = 20 °C</text><path d=\"M105 70 L150 70\" stroke=\"#868e96\" stroke-width=\"2\" marker-end=\"url(#a)\"/><text x=\"127\" y=\"60\" text-anchor=\"middle\" font-size=\"11\" fill=\"#868e96\">pola</text><rect x=\"165\" y=\"75.0\" width=\"60\" height=\"45.0\" fill=\"#a5d8ff\"/><path d=\"M165 45 L165 120 L225 120 L225 45\" fill=\"none\" stroke=\"#1f2328\" stroke-width=\"2\"/><text x=\"195.0\" y=\"138\" text-anchor=\"middle\" font-size=\"12\">V = 1 L</text><text x=\"195.0\" y=\"154\" text-anchor=\"middle\" font-size=\"12\">m = 1 kg</text><text x=\"195.0\" y=\"170\" text-anchor=\"middle\" font-size=\"12\">t = 20 °C</text><rect x=\"245\" y=\"75.0\" width=\"60\" height=\"45.0\" fill=\"#a5d8ff\"/><path d=\"M245 45 L245 120 L305 120 L305 45\" fill=\"none\" stroke=\"#1f2328\" stroke-width=\"2\"/><text x=\"275.0\" y=\"138\" text-anchor=\"middle\" font-size=\"12\">V = 1 L</text><text x=\"275.0\" y=\"154\" text-anchor=\"middle\" font-size=\"12\">m = 1 kg</text><text x=\"275.0\" y=\"170\" text-anchor=\"middle\" font-size=\"12\">t = 20 °C</text><text x=\"325\" y=\"150\" font-size=\"11\" fill=\"#d9480f\" text-anchor=\"end\"></text><text x=\"180\" y=\"196\" text-anchor=\"middle\" font-size=\"12\"><tspan fill=\"#d9480f\" font-weight=\"bold\">V, m se prepolove → ekstenzivne</tspan>   </text><text x=\"180\" y=\"218\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1c7ed6\" font-weight=\"bold\">t ostaje ista → intenzivna</text></svg>",
            "cap": "Prepolovi sistem: ekstenzivne se prepolove, intenzivne ostaju iste",
            "p": [
              "Ekstenzivne veličine stanja su masa i sve veličine koje zavise od mase: zapremina, površina, unutrašnja energija.",
              "Intenzivne veličine ne zavise od mase sistema: pritisak, temperatura.",
              "Test da ih razlikuješ je da prepoloviš sistem. Primjer: flašu od dva litra vode na dvadeset stepeni prespeš na pola. U svakoj polovini je litar vode i kilogram mase, znači zapremina i masa su ekstenzivne. Temperatura je i dalje dvadeset stepeni, znači temperatura je intenzivna."
            ]
          }
        ],
        "key": [
          "Stanje sistema: f od p, v, T jednako nula. Dvije veličine određuju treću.",
          "Ekstenzivne veličine zavise od mase: masa, zapremina, površina, unutrašnja energija.",
          "Intenzivne veličine ne zavise od mase: pritisak, temperatura."
        ]
      },
      {
        "id": "tmd-1-5",
        "module": "1. Osnovni pojmovi",
        "title": "Pritisak",
        "summary": "Apsolutni pritisak je atmosferski plus nadpritisak, ili atmosferski minus podpritisak.",
        "sections": [
          {
            "h": "Jedinice pritiska",
            "p": [
              "Pritisak je sila koja djeluje na površinu, a jedinica je paskal. Primjer: oštar nož reže, a tupi ne, jer ista sila na manju površinu daje veći pritisak.",
              "Jedan bar je deset na peti paskala, to jest sto hiljada paskala.",
              "Jedna fizička atmosfera je sto jedna hiljada tristo dvadeset pet paskala, što je oko hiljadu trinaest milibara. Skoro je jednaka jednom baru.",
              "Jedna tehnička atmosfera je devet zapeta osam nula sedam puta deset na četvrti paskala."
            ]
          },
          {
            "h": "Atmosferski pritisak",
            "p": [
              "Pritisak kojim vazduh djeluje na površinu zemlje naziva se atmosferski ili barometarski pritisak, p b. On zavisi od visine i vremenskih prilika, i opada sa porastom nadmorske visine, jer je iznad tebe manje vazduha.",
              "Primjer: kada se voziš na planinu, uši ti pucaju zbog manjeg pritiska."
            ]
          },
          {
            "h": "Nadpritisak i podpritisak",
            "img": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 360 290\" font-family=\"Arial,Helvetica,sans-serif\" font-size=\"13\" fill=\"#1f2328\"><defs><marker id=\"a\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10z\" fill=\"context-stroke\"/></marker></defs>\n<path d=\"M40 20 L40 250 L345 250\" fill=\"none\" stroke=\"#1f2328\" stroke-width=\"2\"/>\n<text x=\"30\" y=\"255\" text-anchor=\"end\" font-weight=\"bold\">0</text><text x=\"200\" y=\"272\" text-anchor=\"middle\" font-size=\"11\" fill=\"#868e96\">apsolutni vakuum (nema ničega)</text>\n<path d=\"M40 140 L345 140\" stroke=\"#2b8a3e\" stroke-width=\"2\" stroke-dasharray=\"6 4\"/><text x=\"340\" y=\"132\" text-anchor=\"end\" font-weight=\"bold\" fill=\"#2b8a3e\">p_b (atmosferski)</text>\n<path d=\"M40 50 L150 50\" stroke=\"#d9480f\" stroke-width=\"2\"/>\n<path d=\"M90 248 L90 53\" stroke=\"#1f2328\" stroke-width=\"2\" marker-end=\"url(#a)\" marker-start=\"url(#a)\"/><text x=\"98\" y=\"200\" font-weight=\"bold\">p_a</text>\n<path d=\"M135 138 L135 53\" stroke=\"#d9480f\" stroke-width=\"2\" marker-end=\"url(#a)\" marker-start=\"url(#a)\"/><text x=\"142\" y=\"100\" font-weight=\"bold\" fill=\"#d9480f\">p_m</text>\n<text x=\"160\" y=\"46\" font-size=\"12\" fill=\"#d9480f\" font-weight=\"bold\">NADPRITISAK</text><text x=\"160\" y=\"62\" font-size=\"12\" fill=\"#d9480f\">p_a = p_b + p_m</text>\n<path d=\"M230 190 L330 190\" stroke=\"#1c7ed6\" stroke-width=\"2\"/>\n<path d=\"M255 248 L255 193\" stroke=\"#1f2328\" stroke-width=\"2\" marker-end=\"url(#a)\" marker-start=\"url(#a)\"/><text x=\"262\" y=\"228\" font-weight=\"bold\">p_a</text>\n<path d=\"M300 142 L300 187\" stroke=\"#1c7ed6\" stroke-width=\"2\" marker-end=\"url(#a)\" marker-start=\"url(#a)\"/><text x=\"307\" y=\"170\" font-weight=\"bold\" fill=\"#1c7ed6\">p_v</text>\n<text x=\"200\" y=\"165\" font-size=\"12\" fill=\"#1c7ed6\" font-weight=\"bold\" text-anchor=\"end\">PODPRITISAK</text><text x=\"200\" y=\"181\" font-size=\"12\" fill=\"#1c7ed6\" text-anchor=\"end\">p_a = p_b − p_v</text></svg>",
            "cap": "Dijagram pritisaka iz sveske",
            "p": [
              "Višak pritiska iznad atmosferskog zove se nadpritisak, p m. Tada je apsolutni pritisak p a jednak p b plus p m.",
              "Primjer: kada na pumpi izmjeriš gumu i piše dva bara, to je nadpritisak. Apsolutni pritisak u gumi je oko tri bara.",
              "Manjak pritiska ispod atmosferskog zove se podpritisak ili vakuum, p v. Tada je apsolutni pritisak p a jednak p b minus p v.",
              "Primjer: kada piješ na slamku, smanjiš pritisak u ustima, a atmosferski pritisak gura sok gore.",
              "Apsolutni pritisak nikada ne može biti manji od nule. Nula je potpuni vakuum."
            ]
          },
          {
            "h": "Primjer računa",
            "p": [
              "Atmosferski pritisak je jedan bar, a manometar pokazuje dva bara. Apsolutni pritisak je jedan plus dva, to jest tri bara."
            ]
          }
        ],
        "key": [
          "Jedan bar je sto hiljada paskala. Jedna fizička atmosfera je sto jedna hiljada tristo dvadeset pet paskala.",
          "Atmosferski pritisak p b opada sa porastom nadmorske visine.",
          "Nadpritisak: p a jednako p b plus p m.",
          "Podpritisak: p a jednako p b minus p v."
        ]
      },
      {
        "id": "tmd-1-6",
        "module": "1. Osnovni pojmovi",
        "title": "Masa, težina, gustina i specifična zapremina",
        "summary": "Specifična zapremina je zapremina podijeljena masom, a gustina je njena recipročna vrijednost.",
        "sections": [
          {
            "h": "Masa i težina",
            "p": [
              "Masa nekog sistema je količina materije tog sistema. Određuje se vaganjem, to jest upoređivanjem sa poznatom masom tegova. Jedinica mase je kilogram.",
              "Težina je sila kojom Zemlja privlači tijelo: G jednako m puta g, gdje je g oko devet zapeta osamdeset jedan. Jedinica težine je ista kao jedinica sile, njutn.",
              "Primjer: astronaut od osamdeset kilograma na Mjesecu ima šest puta manju težinu, ali masa mu je i dalje osamdeset kilograma."
            ]
          },
          {
            "h": "Zapremina, specifična zapremina i gustina",
            "img": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 360 220\" font-family=\"Arial,Helvetica,sans-serif\" font-size=\"13\" fill=\"#1f2328\"><defs><marker id=\"a\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10z\" fill=\"context-stroke\"/></marker></defs>\n<rect x=\"20\" y=\"20\" width=\"150\" height=\"120\" rx=\"10\" fill=\"#fff9db\" stroke=\"#e67700\" stroke-width=\"2\"/><text x=\"95\" y=\"75\" text-anchor=\"middle\" font-weight=\"bold\">1 kg perja</text><text x=\"95\" y=\"95\" text-anchor=\"middle\" font-size=\"12\">veliki prostor</text>\n<rect x=\"245\" y=\"95\" width=\"45\" height=\"45\" rx=\"4\" fill=\"#adb5bd\" stroke=\"#1f2328\" stroke-width=\"2\"/><text x=\"267\" y=\"160\" text-anchor=\"middle\" font-weight=\"bold\">1 kg olova</text>\n<text x=\"95\" y=\"165\" text-anchor=\"middle\" font-size=\"12\">v VELIKA, ρ MALA</text><text x=\"267\" y=\"178\" text-anchor=\"middle\" font-size=\"12\">v MALA, ρ VELIKA</text>\n<text x=\"95\" y=\"206\" text-anchor=\"middle\" font-weight=\"bold\">v = V / m</text><text x=\"267\" y=\"206\" text-anchor=\"middle\" font-weight=\"bold\">ρ = m / V = 1 / v</text></svg>",
            "cap": "Ista masa, različita zapremina",
            "p": [
              "Pokazatelj količine materije je i zapremina V, u kubnim metrima.",
              "Specifična zapremina je odnos zapremine i mase: v jednako V kroz m, u kubnim metrima po kilogramu. Govori koliko prostora zauzima jedan kilogram.",
              "Gustina je recipročna vrijednost specifične zapremine: ro jednako jedan kroz v, jednako m kroz V, u kilogramima po kubnom metru. Govori koliko kilograma stane u jedan kubni metar.",
              "Primjer: kilogram perja i kilogram olova jednako su teški, ali perje zauzima veliku vreću, a olovo stane u šaku. Perje ima veliku specifičnu zapreminu i malu gustinu, a olovo obrnuto."
            ]
          },
          {
            "h": "Primjer zadatka",
            "p": [
              "U posudi zapremine dva kubna metra nalazi se četiri kilograma gasa. Specifična zapremina je dva kroz četiri, to jest nula zapeta pet kubnih metara po kilogramu. Gustina je četiri kroz dva, to jest dva kilograma po kubnom metru."
            ]
          }
        ],
        "key": [
          "Masa je količina materije, u kilogramima.",
          "Težina je sila: G jednako m puta g, u njutnima.",
          "Specifična zapremina: v jednako V kroz m, kubni metar po kilogramu.",
          "Gustina: ro jednako m kroz V jednako jedan kroz v, kilogram po kubnom metru."
        ]
      }
    ]
  },
  {
    "id": "masinski-elementi",
    "subject": "Mašinski elementi",
    "icon": "⚙️",
    "order": 3,
    "lessons": [
      {
        "id": "me-1-1",
        "module": "1. Osovine i osovinice",
        "title": "Elementi za kružno kretanje",
        "summary": "Elementi za kružno kretanje su osovine, osovinice, vratila, rukavci, ležišta i ležaji, i spojnice.",
        "sections": [
          {
            "h": "Šta spada u elemente za kružno kretanje",
            "img": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 360 190\" font-family=\"Arial,Helvetica,sans-serif\" font-size=\"13\" fill=\"#1f2328\"><defs><marker id=\"a\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10z\" fill=\"context-stroke\"/></marker><pattern id=\"h\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#868e96\" stroke-width=\"1.6\"/></pattern><pattern id=\"h2\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(-45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#495057\" stroke-width=\"1.6\"/></pattern><pattern id=\"x\" patternUnits=\"userSpaceOnUse\" width=\"6\" height=\"6\"><rect width=\"6\" height=\"6\" fill=\"#ffe8cc\"/><path d=\"M0 0L6 6M6 0L0 6\" stroke=\"#e67700\" stroke-width=\"0.9\"/></pattern></defs><line x1=\"0\" y1=\"100\" x2=\"330\" y2=\"100\" stroke=\"#868e96\" stroke-width=\"1\" stroke-dasharray=\"10 3 2 3\"/><rect x=\"0\" y=\"94\" width=\"8\" height=\"12\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"8\" y=\"72\" width=\"10\" height=\"56\" rx=\"0\" fill=\"#fff3bf\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"20\" y=\"72\" width=\"10\" height=\"56\" rx=\"0\" fill=\"#fff3bf\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"30\" y=\"92\" width=\"290\" height=\"16\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"70\" y=\"74\" width=\"40\" height=\"18\" rx=\"0\" fill=\"url(#h)\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"70\" y=\"108\" width=\"40\" height=\"18\" rx=\"0\" fill=\"url(#h)\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"240\" y=\"74\" width=\"40\" height=\"18\" rx=\"0\" fill=\"url(#h)\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"240\" y=\"108\" width=\"40\" height=\"18\" rx=\"0\" fill=\"url(#h)\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"160\" y=\"40\" width=\"30\" height=\"120\" rx=\"0\" fill=\"#e7f5ff\" stroke=\"#1c7ed6\" stroke-width=\"1.5\"/><text x=\"4\" y=\"62\" text-anchor=\"start\" font-size=\"12\" fill=\"#1f2328\">spojnica</text><text x=\"175\" y=\"30\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1c7ed6\">zupčanik</text><line x1=\"90\" y1=\"150\" x2=\"90\" y2=\"128\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><text x=\"90\" y=\"164\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\">ležište</text><line x1=\"300\" y1=\"150\" x2=\"272\" y2=\"103\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><text x=\"305\" y=\"166\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\">rukavac</text><text x=\"225\" y=\"128\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\">vratilo</text></svg>",
            "cap": "Vratilo sa zupčanikom, rukavcima u ležištima i spojnicom",
            "p": [
              "U elemente za kružno kretanje spadaju: osovine, osovinice, vratila, rukavci, ležišta i ležaji, i spojnice.",
              "Svi oni rade zajedno. Vratilo ili osovina nosi dijelove koji se okreću, rukavcima se oslanja na ležišta, a spojnica povezuje dva vratila.",
              "Primjer: u mjenjaču automobila vratilo nosi zupčanike, okreće se u ležajima, a preko spojnice dobija pogon od motora."
            ]
          },
          {
            "h": "Osovine",
            "p": [
              "Osovine su mašinski elementi koji služe kao nosači nepokretnih, obrtnih ili oscilatornih mašinskih elemenata.",
              "Osovine i osovinice ne prenose snagu i obrtni moment, pa su uglavnom izložene savijanju. Osovina samo nosi teret, kao greda.",
              "Primjer: osovina prikolice nosi točkove i teret, ali je motor ne okreće."
            ]
          },
          {
            "h": "Osovinice",
            "p": [
              "Osovinice su osovine koje su relativno kratke u odnosu na prečnik, i obično služe za zglobne pokretne veze dijelova.",
              "Primjer: osovinica u šarki vrata, oko koje se vrata okreću."
            ]
          },
          {
            "h": "Vratila",
            "p": [
              "Vratila su mašinski elementi obrtnog kretanja, i služe kao nosači elemenata za prenos obrtnog momenta, kao što su spojnice, remenice, kaišnici, lančanici i zupčanici.",
              "Vratila prenose obrtni moment, to jest snagu, pa mogu biti izložena uvijanju i savijanju.",
              "Najvažnija razlika: osovina samo nosi, a vratilo nosi i prenosi obrtni moment.",
              "Primjer: vratilo elektromotora prenosi snagu na remenicu koja pokreće pumpu."
            ]
          },
          {
            "h": "Oslanjanje",
            "p": [
              "Osovine, osovinice i vratila se rukavcima oslanjaju na ležišta, odnosno ležaje. Rukavac je dio osovine ili vratila koji leži u ležištu."
            ]
          }
        ],
        "key": [
          "U elemente za kružno kretanje spadaju osovine, osovinice, vratila, rukavci, ležišta i ležaji, i spojnice.",
          "Osovine su nosači nepokretnih, obrtnih ili oscilatornih mašinskih elemenata.",
          "Osovinice su kratke u odnosu na prečnik i služe za zglobne pokretne veze.",
          "Osovine i osovinice ne prenose obrtni moment, pa su izložene savijanju.",
          "Vratila prenose obrtni moment, pa su izložena uvijanju i savijanju.",
          "Osovine, osovinice i vratila se rukavcima oslanjaju na ležišta, odnosno ležaje."
        ]
      },
      {
        "id": "me-1-2",
        "module": "1. Osovine i osovinice",
        "title": "Osovine: vrste, oblik i materijal",
        "summary": "Osovine nose mašinske dijelove koji miruju ili rotiraju, i ne prenose obrtne momente.",
        "sections": [
          {
            "h": "Šta rade osovine",
            "p": [
              "Osovine nose mašinske dijelove koji miruju ili rotiraju. Ne prenose obrtne momente."
            ]
          },
          {
            "h": "Vrste osovina",
            "img": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 360 215\" font-family=\"Arial,Helvetica,sans-serif\" font-size=\"13\" fill=\"#1f2328\"><defs><marker id=\"a\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10z\" fill=\"context-stroke\"/></marker><pattern id=\"h\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#868e96\" stroke-width=\"1.6\"/></pattern><pattern id=\"h2\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(-45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#495057\" stroke-width=\"1.6\"/></pattern><pattern id=\"x\" patternUnits=\"userSpaceOnUse\" width=\"6\" height=\"6\"><rect width=\"6\" height=\"6\" fill=\"#ffe8cc\"/><path d=\"M0 0L6 6M6 0L0 6\" stroke=\"#e67700\" stroke-width=\"0.9\"/></pattern></defs><text x=\"10\" y=\"36\" text-anchor=\"start\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">ravna</text><line x1=\"70\" y1=\"31\" x2=\"345\" y2=\"31\" stroke=\"#868e96\" stroke-width=\"1\" stroke-dasharray=\"10 3 2 3\"/><rect x=\"80\" y=\"24\" width=\"260\" height=\"14\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><text x=\"10\" y=\"90\" text-anchor=\"start\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">stepenasta</text><line x1=\"70\" y1=\"85\" x2=\"345\" y2=\"85\" stroke=\"#868e96\" stroke-width=\"1\" stroke-dasharray=\"10 3 2 3\"/><rect x=\"80\" y=\"78\" width=\"40\" height=\"14\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"120\" y=\"73\" width=\"50\" height=\"24\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"170\" y=\"68\" width=\"80\" height=\"34\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"250\" y=\"73\" width=\"50\" height=\"24\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"300\" y=\"78\" width=\"40\" height=\"14\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><circle cx=\"110\" cy=\"158\" r=\"28\" fill=\"#adb5bd\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><text x=\"110\" y=\"206\" text-anchor=\"middle\" font-size=\"13\" fill=\"#1f2328\" font-weight=\"bold\">puna</text><circle cx=\"250\" cy=\"158\" r=\"28\" fill=\"#adb5bd\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><circle cx=\"250\" cy=\"158\" r=\"16\" fill=\"#fff\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><text x=\"250\" y=\"206\" text-anchor=\"middle\" font-size=\"13\" fill=\"#1f2328\" font-weight=\"bold\">šuplja</text><line x1=\"70\" y1=\"158\" x2=\"150\" y2=\"158\" stroke=\"#868e96\" stroke-width=\"1\" stroke-dasharray=\"10 3 2 3\"/><line x1=\"210\" y1=\"158\" x2=\"290\" y2=\"158\" stroke=\"#868e96\" stroke-width=\"1\" stroke-dasharray=\"10 3 2 3\"/></svg>",
            "cap": "Ravna i stepenasta osovina, puni i šuplji presjek",
            "p": [
              "Osovine mogu biti rotirajuće, nerotirajuće, pune i šuplje.",
              "Rotirajuća osovina se okreće zajedno sa točkom. Nerotirajuća miruje, a točak se okreće na njoj preko ležaja. Šuplja osovina je lakša od pune, a skoro jednako izdržljiva.",
              "Primjer: osovina vagona se okreće zajedno sa točkovima, a osovina zadnjeg točka bicikla miruje dok se točak vrti oko nje."
            ]
          },
          {
            "h": "Podjela prema konstruktivnom izgledu",
            "p": [
              "Prema konstruktivnom izgledu osovine su ravne i stepenaste.",
              "Osovine se najčešće izrađuju kao stepenaste, čime se postiže ušteda u materijalu i smanjuje težina, ali je izrada skuplja. Osovina je deblja tamo gdje je savijanje najveće, a tanja tamo gdje je manje.",
              "Primjer: osovina vagona je najdeblja ispod glavčine točka, a tanja na krajevima, u ležajima."
            ]
          },
          {
            "h": "Primjena",
            "p": [
              "Osovine imaju najširu primjenu kao nosači točkova na vagonima, vagonetima, transportnim kolicima, prikolicama i slično."
            ]
          },
          {
            "h": "Materijal",
            "p": [
              "Osovine se izrađuju od žilavih konstruktivnih čelika, od Č nula četiri šest jedan do Č nula pet četiri pet, a za jača opterećenja Č nula šest četiri pet.",
              "Za teško opterećene osovine uzimaju se ugljenični čelici za cementaciju i poboljšanje.",
              "Žilav čelik je važan jer osovina ne smije naglo da pukne, nego mora da izdrži udarce.",
              "Primjer: osovina vagona dobije udarac svaki put kad točak pređe preko spoja šina."
            ]
          }
        ],
        "key": [
          "Osovine mogu biti rotirajuće, nerotirajuće, pune i šuplje.",
          "Prema konstruktivnom izgledu osovine su ravne i stepenaste.",
          "Stepenaste osovine štede materijal i smanjuju težinu, ali je izrada skuplja.",
          "Najšira primjena: nosači točkova na vagonima, vagonetima, kolicima i prikolicama.",
          "Materijal: žilavi konstruktivni čelici od Č nula četiri šest jedan do Č nula pet četiri pet, za jača opterećenja Č nula šest četiri pet."
        ]
      },
      {
        "id": "me-1-3",
        "module": "1. Osovine i osovinice",
        "title": "Dimenzionisanje osovina",
        "summary": "Za dimenzionisanje osovina mjerodavno je savijanje.",
        "sections": [
          {
            "h": "Šema opterećenja",
            "img": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 360 272\" font-family=\"Arial,Helvetica,sans-serif\" font-size=\"13\" fill=\"#1f2328\"><defs><marker id=\"a\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10z\" fill=\"context-stroke\"/></marker><pattern id=\"h\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#868e96\" stroke-width=\"1.6\"/></pattern><pattern id=\"h2\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(-45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#495057\" stroke-width=\"1.6\"/></pattern><pattern id=\"x\" patternUnits=\"userSpaceOnUse\" width=\"6\" height=\"6\"><rect width=\"6\" height=\"6\" fill=\"#ffe8cc\"/><path d=\"M0 0L6 6M6 0L0 6\" stroke=\"#e67700\" stroke-width=\"0.9\"/></pattern></defs><line x1=\"40\" y1=\"50\" x2=\"320\" y2=\"50\" stroke=\"#1f2328\" stroke-width=\"4\"/><path d=\"M40 52 L30 68 L50 68 Z\" fill=\"#fff\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><path d=\"M320 52 L310 68 L330 68 Z\" fill=\"#fff\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><text x=\"22\" y=\"48\" text-anchor=\"middle\" font-size=\"13\" fill=\"#1f2328\" font-weight=\"bold\">A</text><text x=\"338\" y=\"48\" text-anchor=\"middle\" font-size=\"13\" fill=\"#1f2328\" font-weight=\"bold\">B</text><line x1=\"180\" y1=\"8\" x2=\"180\" y2=\"46\" stroke=\"#d9480f\" stroke-width=\"2.5\" marker-end=\"url(#a)\"/><text x=\"192\" y=\"22\" text-anchor=\"middle\" font-size=\"13\" fill=\"#d9480f\" font-weight=\"bold\">F</text><line x1=\"40\" y1=\"100\" x2=\"40\" y2=\"74\" stroke=\"#1f2328\" stroke-width=\"2\" marker-end=\"url(#a)\"/><text x=\"56\" y=\"95\" text-anchor=\"start\" font-size=\"12\" fill=\"#1f2328\">F_A</text><line x1=\"320\" y1=\"100\" x2=\"320\" y2=\"74\" stroke=\"#1f2328\" stroke-width=\"2\" marker-end=\"url(#a)\"/><text x=\"304\" y=\"95\" text-anchor=\"end\" font-size=\"12\" fill=\"#1f2328\">F_B</text><line x1=\"40\" y1=\"115\" x2=\"180\" y2=\"115\" stroke=\"#868e96\" stroke-width=\"1\" marker-start=\"url(#a)\" marker-end=\"url(#a)\"/><line x1=\"180\" y1=\"115\" x2=\"320\" y2=\"115\" stroke=\"#868e96\" stroke-width=\"1\" marker-start=\"url(#a)\" marker-end=\"url(#a)\"/><text x=\"110\" y=\"111\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\">l/2</text><text x=\"250\" y=\"111\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\">l/2</text><text x=\"16\" y=\"155\" text-anchor=\"middle\" font-size=\"13\" fill=\"#1f2328\" font-weight=\"bold\">T</text><line x1=\"40\" y1=\"150\" x2=\"320\" y2=\"150\" stroke=\"#868e96\" stroke-width=\"1\"/><rect x=\"40\" y=\"132\" width=\"140\" height=\"18\" rx=\"0\" fill=\"#ffe3e3\" stroke=\"#d9480f\" stroke-width=\"1.5\"/><text x=\"110\" y=\"146\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\">+F_A</text><rect x=\"180\" y=\"150\" width=\"140\" height=\"18\" rx=\"0\" fill=\"#e7f5ff\" stroke=\"#1c7ed6\" stroke-width=\"1.5\"/><text x=\"250\" y=\"164\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\">−F_B</text><text x=\"18\" y=\"195\" text-anchor=\"middle\" font-size=\"13\" fill=\"#1f2328\" font-weight=\"bold\">Ms</text><line x1=\"40\" y1=\"190\" x2=\"320\" y2=\"190\" stroke=\"#868e96\" stroke-width=\"1\"/><path d=\"M40 190 L180 250 L320 190 Z\" fill=\"#fff4e6\" stroke=\"#d9480f\" stroke-width=\"2\"/><line x1=\"180\" y1=\"190\" x2=\"180\" y2=\"250\" stroke=\"#d9480f\" stroke-width=\"1.5\"/><text x=\"180\" y=\"267\" text-anchor=\"middle\" font-size=\"12\" fill=\"#d9480f\" font-weight=\"bold\">Mmax</text></svg>",
            "cap": "Šema opterećenja osovine: sile, transverzalne sile i moment savijanja",
            "p": [
              "Osovine se mogu šematski prikazati u obliku proste grede sa prepustom ili bez prepusta.",
              "Pri analitičkom rješavanju osovina prvo treba odrediti otpore u osloncima, F A i F B, pa zatim momente savijanja u kritičnim presjecima.",
              "Kada sila F djeluje u sredini, svaki oslonac nosi polovinu sile, a moment savijanja je najveći baš ispod sile.",
              "Primjer: kad staneš na sredinu daske položene na dvije cigle, daska se najviše savije u sredini."
            ]
          },
          {
            "h": "Osnovna jednačina savijanja",
            "img": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 360 174\" font-family=\"Arial,Helvetica,sans-serif\" font-size=\"13\" fill=\"#1f2328\"><defs><marker id=\"a\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10z\" fill=\"context-stroke\"/></marker><pattern id=\"h\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#868e96\" stroke-width=\"1.6\"/></pattern><pattern id=\"h2\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(-45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#495057\" stroke-width=\"1.6\"/></pattern><pattern id=\"x\" patternUnits=\"userSpaceOnUse\" width=\"6\" height=\"6\"><rect width=\"6\" height=\"6\" fill=\"#ffe8cc\"/><path d=\"M0 0L6 6M6 0L0 6\" stroke=\"#e67700\" stroke-width=\"0.9\"/></pattern></defs><rect x=\"4\" y=\"4\" width=\"352\" height=\"166\" rx=\"10\" fill=\"#f8f9fa\" stroke=\"#dee2e6\" stroke-width=\"1\"/><text x=\"180\" y=\"34\" text-anchor=\"middle\" font-size=\"16\" fill=\"#1f2328\" font-weight=\"bold\">σs = Ms / W ≤ σsd</text><text x=\"22\" y=\"34\" text-anchor=\"middle\" font-size=\"16\" fill=\"#2b8a3e\" font-weight=\"bold\">✓</text><text x=\"180\" y=\"64\" text-anchor=\"middle\" font-size=\"16\" fill=\"#1f2328\" font-weight=\"bold\">W = d³·π / 32</text><text x=\"180\" y=\"94\" text-anchor=\"middle\" font-size=\"16\" fill=\"#1f2328\" font-weight=\"bold\">d = ∛( 32·Ms / (π·σsd) )</text><text x=\"22\" y=\"94\" text-anchor=\"middle\" font-size=\"16\" fill=\"#2b8a3e\" font-weight=\"bold\">✓</text><text x=\"180\" y=\"122\" text-anchor=\"middle\" font-size=\"12\" fill=\"#868e96\">S = 4 kad rotira,  S = 3 kad miruje</text><text x=\"180\" y=\"152\" text-anchor=\"middle\" font-size=\"12\" fill=\"#868e96\">prečnik + 10 do 20 %, pa prvi veći standardni</text></svg>",
            "cap": "Formule za osovine, kvačica označava formule iz sveske sa kvačicom",
            "p": [
              "Za dimenzionisanje osovina mjerodavno je savijanje, iz osnovne jednačine savijanja: sigma s jednako M s kroz W, i to mora biti manje od sigma s d.",
              "M s je mjerodavni moment savijanja, u njutn milimetrima.",
              "W je aksijalni otporni moment kružnog poprečnog presjeka: d na treći puta pi, kroz trideset dva, u milimetrima kubnim.",
              "Sigma s d je dozvoljeni napon savijanja, to jest karakteristika materijala podijeljena stepenom sigurnosti S, u njutnima po milimetru kvadratnom."
            ]
          },
          {
            "h": "Prečnik osovine",
            "p": [
              "Iz jednačine savijanja određuje se prečnik osovine: d jednako treći korijen iz trideset dva puta M s, kroz pi puta sigma s d, u milimetrima.",
              "Za osovine koje rotiraju stepen sigurnosti je četiri, a za osovine koje miruju tri. Rotirajuća osovina dobija veći stepen sigurnosti jer se napon u njoj stalno mijenja, pa se materijal brže zamara.",
              "Ovako dobijene prečnike treba uvećati za deset do dvadeset procenata, zbog habanja i dubine žljeba za klin, i usvojiti prvi veći standardni prečnik.",
              "Primjer: ako proračun da trideset dva milimetra, poslije uvećanja se dobije oko trideset šest, pa se usvoji standardnih četrdeset milimetara."
            ]
          },
          {
            "h": "Idealni i stvarni oblik osovine",
            "img": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 360 215\" font-family=\"Arial,Helvetica,sans-serif\" font-size=\"13\" fill=\"#1f2328\"><defs><marker id=\"a\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10z\" fill=\"context-stroke\"/></marker><pattern id=\"h\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#868e96\" stroke-width=\"1.6\"/></pattern><pattern id=\"h2\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(-45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#495057\" stroke-width=\"1.6\"/></pattern><pattern id=\"x\" patternUnits=\"userSpaceOnUse\" width=\"6\" height=\"6\"><rect width=\"6\" height=\"6\" fill=\"#ffe8cc\"/><path d=\"M0 0L6 6M6 0L0 6\" stroke=\"#e67700\" stroke-width=\"0.9\"/></pattern></defs><line x1=\"20\" y1=\"105\" x2=\"340\" y2=\"105\" stroke=\"#868e96\" stroke-width=\"1\" stroke-dasharray=\"10 3 2 3\"/><path d=\"M40 89 L70 89 L70 72 L120 72 L120 63 L240 63 L240 72 L290 72 L290 89 L320 89 L320 121 L290 121 L290 138 L240 138 L240 147 L120 147 L120 138 L70 138 L70 121 L40 121 Z\" fill=\"#e7f5ff\" stroke=\"#1c7ed6\" stroke-width=\"2\"/><rect x=\"150\" y=\"33\" width=\"60\" height=\"30\" rx=\"0\" fill=\"url(#h)\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"150\" y=\"147\" width=\"60\" height=\"30\" rx=\"0\" fill=\"url(#h)\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><path d=\"M40 105 Q180 25 320 105 Q180 185 40 105 Z\" fill=\"none\" stroke=\"#d9480f\" stroke-width=\"2.2\" stroke-dasharray=\"6 4\"/><line x1=\"180\" y1=\"4\" x2=\"180\" y2=\"30\" stroke=\"#1f2328\" stroke-width=\"2.5\" marker-end=\"url(#a)\"/><text x=\"192\" y=\"18\" text-anchor=\"start\" font-size=\"13\" fill=\"#1f2328\" font-weight=\"bold\">F</text><line x1=\"40\" y1=\"195\" x2=\"40\" y2=\"124\" stroke=\"#1f2328\" stroke-width=\"2\" marker-end=\"url(#a)\"/><text x=\"48\" y=\"185\" text-anchor=\"start\" font-size=\"12\" fill=\"#1f2328\">F_A</text><line x1=\"320\" y1=\"195\" x2=\"320\" y2=\"124\" stroke=\"#1f2328\" stroke-width=\"2\" marker-end=\"url(#a)\"/><text x=\"312\" y=\"185\" text-anchor=\"end\" font-size=\"12\" fill=\"#1f2328\">F_B</text><text x=\"125\" y=\"208\" text-anchor=\"middle\" font-size=\"12\" fill=\"#d9480f\" font-weight=\"bold\">- - idealni oblik</text><text x=\"240\" y=\"208\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1c7ed6\" font-weight=\"bold\">stvarni oblik</text><text x=\"180\" y=\"197\" text-anchor=\"middle\" font-size=\"11\" fill=\"#868e96\">glavčina</text></svg>",
            "cap": "Izgled idealnog i stvarnog oblika osovine",
            "p": [
              "Idealni oblik osovine prati moment savijanja: tanak je na osloncima, a najdeblji u sredini, gdje je moment najveći. Takav oblik je težak za izradu, pa se pravi stepenasta osovina koja obuhvata idealni oblik.",
              "Primjer: tako je napravljena i stepenasta osovina vagona sa prethodne lekcije."
            ]
          }
        ],
        "key": [
          "Za dimenzionisanje osovina mjerodavno je savijanje: sigma s jednako M s kroz W, manje od sigma s d.",
          "Prečnik: d jednako treći korijen iz trideset dva puta M s, kroz pi puta sigma s d, u milimetrima.",
          "W jednako d na treći puta pi kroz trideset dva.",
          "Stepen sigurnosti: četiri za osovine koje rotiraju, tri za osovine koje miruju.",
          "Prečnik se uveća za deset do dvadeset procenata i usvoji prvi veći standardni."
        ]
      },
      {
        "id": "me-1-4",
        "module": "1. Osovine i osovinice",
        "title": "Osovinice i njihovo osiguranje",
        "summary": "Osovinice, ili svornjaci, su kratke osovine koje služe za zglobne pokretne veze dijelova.",
        "sections": [
          {
            "h": "Šta su osovinice",
            "p": [
              "Osovinice, ili svornjaci, su relativno kratke osovine u odnosu na prečnik, i služe za zglobne pokretne veze dijelova.",
              "U svojim ležištima osovinice miruju ili osciliraju, a spojeni elementi osciliraju ili rotiraju oko osovinica.",
              "Primjer: osovinica koja spaja klip i klipnjaču u motoru, takozvani bolcn."
            ]
          },
          {
            "h": "Materijal i oblik",
            "p": [
              "Izrađuju se obično od konstruktivnih čelika za manja opterećenja, a za veća opterećenja koriste se ugljenični i legirani čelici.",
              "Oblici osovinica su jednostavni, i kao takvi jeftiniji za izradu."
            ]
          },
          {
            "h": "Standardni oblici osovinica",
            "img": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 360 225\" font-family=\"Arial,Helvetica,sans-serif\" font-size=\"13\" fill=\"#1f2328\"><defs><marker id=\"a\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10z\" fill=\"context-stroke\"/></marker><pattern id=\"h\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#868e96\" stroke-width=\"1.6\"/></pattern><pattern id=\"h2\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(-45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#495057\" stroke-width=\"1.6\"/></pattern><pattern id=\"x\" patternUnits=\"userSpaceOnUse\" width=\"6\" height=\"6\"><rect width=\"6\" height=\"6\" fill=\"#ffe8cc\"/><path d=\"M0 0L6 6M6 0L0 6\" stroke=\"#e67700\" stroke-width=\"0.9\"/></pattern></defs><line x1=\"14\" y1=\"47\" x2=\"160\" y2=\"47\" stroke=\"#868e96\" stroke-width=\"1\" stroke-dasharray=\"10 3 2 3\"/><rect x=\"20\" y=\"25\" width=\"14\" height=\"44\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"34\" y=\"36\" width=\"110\" height=\"22\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><circle cx=\"130\" cy=\"47\" r=\"4\" fill=\"#fff\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><text x=\"90\" y=\"95\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">1. sa glavom</text><line x1=\"194\" y1=\"47\" x2=\"350\" y2=\"47\" stroke=\"#868e96\" stroke-width=\"1\" stroke-dasharray=\"10 3 2 3\"/><rect x=\"200\" y=\"36\" width=\"140\" height=\"22\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><circle cx=\"212\" cy=\"47\" r=\"4\" fill=\"#fff\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><circle cx=\"328\" cy=\"47\" r=\"4\" fill=\"#fff\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><text x=\"270\" y=\"95\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">2. bez glave</text><text x=\"270\" y=\"78\" text-anchor=\"middle\" font-size=\"11\" fill=\"#868e96\">rupe opciono</text><line x1=\"14\" y1=\"158\" x2=\"160\" y2=\"158\" stroke=\"#868e96\" stroke-width=\"1\" stroke-dasharray=\"10 3 2 3\"/><path d=\"M20 132 L48 147 L48 169 L20 184 Z\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"48\" y=\"147\" width=\"96\" height=\"22\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><circle cx=\"130\" cy=\"158\" r=\"4\" fill=\"#fff\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><text x=\"90\" y=\"210\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">3. sa upuštenom glavom</text><line x1=\"194\" y1=\"158\" x2=\"350\" y2=\"158\" stroke=\"#868e96\" stroke-width=\"1\" stroke-dasharray=\"10 3 2 3\"/><rect x=\"200\" y=\"136\" width=\"14\" height=\"44\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"214\" y=\"147\" width=\"80\" height=\"22\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"294\" y=\"151\" width=\"6\" height=\"14\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"300\" y=\"147\" width=\"40\" height=\"22\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><line x1=\"304\" y1=\"147\" x2=\"300\" y2=\"169\" stroke=\"#1f2328\" stroke-width=\"1\"/><line x1=\"311\" y1=\"147\" x2=\"307\" y2=\"169\" stroke=\"#1f2328\" stroke-width=\"1\"/><line x1=\"318\" y1=\"147\" x2=\"314\" y2=\"169\" stroke=\"#1f2328\" stroke-width=\"1\"/><line x1=\"325\" y1=\"147\" x2=\"321\" y2=\"169\" stroke=\"#1f2328\" stroke-width=\"1\"/><line x1=\"332\" y1=\"147\" x2=\"328\" y2=\"169\" stroke=\"#1f2328\" stroke-width=\"1\"/><line x1=\"339\" y1=\"147\" x2=\"335\" y2=\"169\" stroke=\"#1f2328\" stroke-width=\"1\"/><text x=\"270\" y=\"210\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">4. sa navojem</text></svg>",
            "cap": "Četiri standardna oblika osovinica",
            "p": [
              "Standardizovano je više oblika osovinica: sa glavom, bez glave, sa upuštenom glavom i sa navojem.",
              "Glava sprečava da osovinica propadne kroz rupu. Upuštena glava ne viri iznad površine. Navoj omogućava da se osovinica pritegne navrtkom.",
              "Primjer: osovinica sa glavom i rupom za rascjepku drži prikolicu zakačenu za traktor."
            ]
          },
          {
            "h": "Osiguranje osovinica",
            "p": [
              "Osovinice se moraju osigurati protiv uzdužnog pomjeranja i obrtanja. Bez osiguranja bi zbog vibracija polako ispale iz rupe.",
              "Najčešći oblici osiguranja su: osovinica sa navojem, gdje je navojni spoj osiguran rascjepkom; osiguranje prstenastim uskočnikom; osiguranje pomoću dvije rascjepke; osiguranje uvrtnim vijkom; i osiguranje pomoću limenog osigurača.",
              "Primjer: rascjepka na kraju osovinice kod kuke prikolice, savijena tako da ne može da ispadne."
            ]
          },
          {
            "h": "Prstenasti uskočnici",
            "img": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 360 180\" font-family=\"Arial,Helvetica,sans-serif\" font-size=\"13\" fill=\"#1f2328\"><defs><marker id=\"a\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10z\" fill=\"context-stroke\"/></marker><pattern id=\"h\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#868e96\" stroke-width=\"1.6\"/></pattern><pattern id=\"h2\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(-45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#495057\" stroke-width=\"1.6\"/></pattern><pattern id=\"x\" patternUnits=\"userSpaceOnUse\" width=\"6\" height=\"6\"><rect width=\"6\" height=\"6\" fill=\"#ffe8cc\"/><path d=\"M0 0L6 6M6 0L0 6\" stroke=\"#e67700\" stroke-width=\"0.9\"/></pattern></defs><rect x=\"25\" y=\"15\" width=\"130\" height=\"130\" rx=\"0\" fill=\"url(#h)\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><circle cx=\"90\" cy=\"80\" r=\"52\" fill=\"#fff\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><path d=\"M70.1 122.6 A47 47 0 1 1 109.9 122.6\" fill=\"none\" stroke=\"#d9480f\" stroke-width=\"8\" stroke-linecap=\"round\"/><circle cx=\"73.7\" cy=\"114.9\" r=\"7\" fill=\"#fff4e6\" stroke=\"#d9480f\" stroke-width=\"2\"/><circle cx=\"73.7\" cy=\"114.9\" r=\"2.5\" fill=\"#fff\" stroke=\"#d9480f\" stroke-width=\"1\"/><circle cx=\"106.3\" cy=\"114.9\" r=\"7\" fill=\"#fff4e6\" stroke=\"#d9480f\" stroke-width=\"2\"/><circle cx=\"106.3\" cy=\"114.9\" r=\"2.5\" fill=\"#fff\" stroke=\"#d9480f\" stroke-width=\"1\"/><text x=\"90\" y=\"170\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">1. unutrašnji – za rupe</text><circle cx=\"270\" cy=\"80\" r=\"40\" fill=\"#adb5bd\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><path d=\"M251.0 120.8 A45 45 0 1 1 289.0 120.8\" fill=\"none\" stroke=\"#d9480f\" stroke-width=\"8\" stroke-linecap=\"round\"/><circle cx=\"247.6\" cy=\"128.1\" r=\"7\" fill=\"#fff4e6\" stroke=\"#d9480f\" stroke-width=\"2\"/><circle cx=\"247.6\" cy=\"128.1\" r=\"2.5\" fill=\"#fff\" stroke=\"#d9480f\" stroke-width=\"1\"/><circle cx=\"292.4\" cy=\"128.1\" r=\"7\" fill=\"#fff4e6\" stroke=\"#d9480f\" stroke-width=\"2\"/><circle cx=\"292.4\" cy=\"128.1\" r=\"2.5\" fill=\"#fff\" stroke=\"#d9480f\" stroke-width=\"1\"/><text x=\"270\" y=\"170\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">2. vanjski – za osovine</text></svg>",
            "cap": "Unutrašnji i vanjski uskočnik (Segerov prsten)",
            "p": [
              "Prstenasti uskočnici, ili Segerovi prstenovi, služe za osiguranje od uzdužnog pomjeranja osovina, osovinica, ležaja sa kotrljanjem, a ponekad i elemenata za prenos snage.",
              "Standardizovani su unutrašnji uskočnici, za rupe, i vanjski uskočnici, za osovine. Postavljaju se posebnim kliještima u žljeb.",
              "Primjer: Segerov prsten drži kuglični ležaj u kućištu pumpe da ne isklizne."
            ]
          }
        ],
        "key": [
          "Osovinice, ili svornjaci, su kratke osovine za zglobne pokretne veze; one miruju ili osciliraju, a spojeni dijelovi osciliraju ili rotiraju oko njih.",
          "Za manja opterećenja konstruktivni čelici, za veća ugljenični i legirani čelici; oblici su jednostavni i jeftini.",
          "Standardni oblici: sa glavom, bez glave, sa upuštenom glavom, sa navojem.",
          "Osiguranje protiv uzdužnog pomjeranja i obrtanja: navoj sa rascjepkom, prstenasti uskočnik, dvije rascjepke, uvrtni vijak, limeni osigurač."
        ]
      },
      {
        "id": "me-1-5",
        "module": "1. Osovine i osovinice",
        "title": "Proračun osovinica",
        "summary": "Osovinice su napregnute na savijanje, smicanje i površinski pritisak.",
        "sections": [
          {
            "h": "Naprezanja osovinica",
            "img": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 360 262\" font-family=\"Arial,Helvetica,sans-serif\" font-size=\"13\" fill=\"#1f2328\"><defs><marker id=\"a\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10z\" fill=\"context-stroke\"/></marker><pattern id=\"h\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#868e96\" stroke-width=\"1.6\"/></pattern><pattern id=\"h2\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(-45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#495057\" stroke-width=\"1.6\"/></pattern><pattern id=\"x\" patternUnits=\"userSpaceOnUse\" width=\"6\" height=\"6\"><rect width=\"6\" height=\"6\" fill=\"#ffe8cc\"/><path d=\"M0 0L6 6M6 0L0 6\" stroke=\"#e67700\" stroke-width=\"0.9\"/></pattern></defs><rect x=\"70\" y=\"58\" width=\"66\" height=\"42\" rx=\"0\" fill=\"url(#h)\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"70\" y=\"124\" width=\"66\" height=\"42\" rx=\"0\" fill=\"url(#h)\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"224\" y=\"58\" width=\"66\" height=\"42\" rx=\"0\" fill=\"url(#h)\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"224\" y=\"124\" width=\"66\" height=\"42\" rx=\"0\" fill=\"url(#h)\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"140\" y=\"58\" width=\"80\" height=\"42\" rx=\"0\" fill=\"url(#h2)\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"140\" y=\"124\" width=\"80\" height=\"62\" rx=\"0\" fill=\"url(#h2)\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"55\" y=\"100\" width=\"250\" height=\"24\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><line x1=\"45\" y1=\"112\" x2=\"315\" y2=\"112\" stroke=\"#868e96\" stroke-width=\"1\" stroke-dasharray=\"10 3 2 3\"/><text x=\"180\" y=\"117\" text-anchor=\"middle\" font-size=\"12\" fill=\"#d9480f\" font-weight=\"bold\">σs</text><line x1=\"180\" y1=\"12\" x2=\"180\" y2=\"54\" stroke=\"#d9480f\" stroke-width=\"2.5\" marker-end=\"url(#a)\"/><text x=\"192\" y=\"26\" text-anchor=\"start\" font-size=\"13\" fill=\"#d9480f\" font-weight=\"bold\">F</text><line x1=\"103\" y1=\"218\" x2=\"103\" y2=\"170\" stroke=\"#1c7ed6\" stroke-width=\"2.2\" marker-end=\"url(#a)\"/><text x=\"98\" y=\"212\" text-anchor=\"end\" font-size=\"12\" fill=\"#1c7ed6\" font-weight=\"bold\">F/2</text><line x1=\"257\" y1=\"218\" x2=\"257\" y2=\"170\" stroke=\"#1c7ed6\" stroke-width=\"2.2\" marker-end=\"url(#a)\"/><text x=\"262\" y=\"212\" text-anchor=\"start\" font-size=\"12\" fill=\"#1c7ed6\" font-weight=\"bold\">F/2</text><text x=\"138\" y=\"50\" text-anchor=\"middle\" font-size=\"12\" fill=\"#d9480f\" font-weight=\"bold\">τs</text><text x=\"222\" y=\"50\" text-anchor=\"middle\" font-size=\"12\" fill=\"#d9480f\" font-weight=\"bold\">τs</text><line x1=\"138\" y1=\"54\" x2=\"138\" y2=\"98\" stroke=\"#d9480f\" stroke-width=\"1\" stroke-dasharray=\"3 2\"/><line x1=\"222\" y1=\"54\" x2=\"222\" y2=\"98\" stroke=\"#d9480f\" stroke-width=\"1\" stroke-dasharray=\"3 2\"/><line x1=\"42\" y1=\"100\" x2=\"42\" y2=\"124\" stroke=\"#868e96\" stroke-width=\"1\" marker-start=\"url(#a)\" marker-end=\"url(#a)\"/><text x=\"34\" y=\"116\" text-anchor=\"end\" font-size=\"13\" fill=\"#1f2328\" font-weight=\"bold\">d</text><line x1=\"140\" y1=\"232\" x2=\"220\" y2=\"232\" stroke=\"#868e96\" stroke-width=\"1\" marker-start=\"url(#a)\" marker-end=\"url(#a)\"/><text x=\"180\" y=\"228\" text-anchor=\"middle\" font-size=\"13\" fill=\"#1f2328\" font-weight=\"bold\">l</text><line x1=\"70\" y1=\"252\" x2=\"290\" y2=\"252\" stroke=\"#868e96\" stroke-width=\"1\" marker-start=\"url(#a)\" marker-end=\"url(#a)\"/><text x=\"180\" y=\"248\" text-anchor=\"middle\" font-size=\"13\" fill=\"#1f2328\" font-weight=\"bold\">L</text><text x=\"330\" y=\"70\" text-anchor=\"middle\" font-size=\"11\" fill=\"#868e96\">vilica</text><text x=\"180\" y=\"200\" text-anchor=\"middle\" font-size=\"11\" fill=\"#868e96\">poluga</text></svg>",
            "cap": "Osovinica u vilici: sila F u sredini, reakcije F kroz dva na krajevima",
            "p": [
              "Osovinice su napregnute na savijanje, smicanje i površinski pritisak.",
              "Savijanje nastaje jer sila pritiska osovinicu u sredini, a ona je oslonjena na krajevima, u vilici. Smicanje nastaje na mjestima gdje se dodiruju poluga i vilica, jer ti dijelovi pokušavaju da je presijeku. Površinski pritisak nastaje na dodirnim površinama osovinice i rupe.",
              "Primjer: makaze sijeku papir upravo smicanjem, dva sječiva se pomjeraju jedno pored drugog."
            ]
          },
          {
            "h": "Šta obuhvata proračun",
            "p": [
              "Proračun osovinica obuhvata: određivanje prečnika, provjeru napona smicanja i provjeru površinskog pritiska."
            ]
          },
          {
            "h": "Formule",
            "img": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 360 204\" font-family=\"Arial,Helvetica,sans-serif\" font-size=\"13\" fill=\"#1f2328\"><defs><marker id=\"a\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10z\" fill=\"context-stroke\"/></marker><pattern id=\"h\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#868e96\" stroke-width=\"1.6\"/></pattern><pattern id=\"h2\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(-45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#495057\" stroke-width=\"1.6\"/></pattern><pattern id=\"x\" patternUnits=\"userSpaceOnUse\" width=\"6\" height=\"6\"><rect width=\"6\" height=\"6\" fill=\"#ffe8cc\"/><path d=\"M0 0L6 6M6 0L0 6\" stroke=\"#e67700\" stroke-width=\"0.9\"/></pattern></defs><rect x=\"4\" y=\"4\" width=\"352\" height=\"196\" rx=\"10\" fill=\"#f8f9fa\" stroke=\"#dee2e6\" stroke-width=\"1\"/><text x=\"180\" y=\"34\" text-anchor=\"middle\" font-size=\"16\" fill=\"#1f2328\" font-weight=\"bold\">d = ∛( 4·F·L / (π·σsd) )</text><text x=\"180\" y=\"64\" text-anchor=\"middle\" font-size=\"16\" fill=\"#1f2328\" font-weight=\"bold\">τs = 2F / (d²·π) ≤ τsd</text><text x=\"180\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" fill=\"#868e96\">τsd = 0,8·ReH / S</text><text x=\"180\" y=\"124\" text-anchor=\"middle\" font-size=\"16\" fill=\"#1f2328\" font-weight=\"bold\">p = F / (d·l) &lt; pd</text><text x=\"180\" y=\"154\" text-anchor=\"middle\" font-size=\"16\" fill=\"#1f2328\" font-weight=\"bold\">p = F / (d·(L − l)) &lt; pd</text><text x=\"180\" y=\"182\" text-anchor=\"middle\" font-size=\"12\" fill=\"#868e96\">pd = ReH / S  (osovinica miruje)</text></svg>",
            "cap": "Formule za proračun osovinica",
            "p": [
              "Prečnik osovinice: d jednako treći korijen iz četiri F puta L, kroz pi puta sigma s d, u milimetrima.",
              "Napon smicanja: tau s jednako F kroz A, jednako dva F kroz d na kvadrat puta pi, i mora biti manje ili jednako tau s d. Osovinica se siječe u dva presjeka, zato je u brojniku dva F.",
              "Dozvoljeni napon smicanja je nula zapeta osam puta R e H, kroz S.",
              "Površinski pritisak: p jednako F kroz d puta l, za polugu u sredini, i p jednako F kroz d puta, veliko L minus l, za vilicu. Pritisak mora biti manji od dozvoljenog, p d.",
              "Dozvoljeni površinski pritisak za osovinice koje miruju je R e H kroz S. Stepen sigurnosti za jednosmjerno promjenljiva opterećenja počinje od dva zapeta pet."
            ]
          }
        ],
        "key": [
          "Osovinice su napregnute na savijanje, smicanje i površinski pritisak.",
          "Proračun osovinica obuhvata: određivanje prečnika, provjeru napona smicanja i provjeru površinskog pritiska.",
          "Napon smicanja: tau s jednako dva F kroz d na kvadrat puta pi, manje ili jednako tau s d."
        ]
      },
      {
        "id": "me-2-1",
        "module": "2. Rukavci i vratila",
        "title": "Rukavci",
        "summary": "Rukavci su mjesta na osovinama, osovinicama i vratilima na kojima se ugrađuju ležišta.",
        "sections": [
          {
            "h": "Šta su rukavci",
            "img": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 360 205\" font-family=\"Arial,Helvetica,sans-serif\" font-size=\"13\" fill=\"#1f2328\"><defs><marker id=\"a\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10z\" fill=\"context-stroke\"/></marker><pattern id=\"h\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#868e96\" stroke-width=\"1.6\"/></pattern><pattern id=\"h2\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(-45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#495057\" stroke-width=\"1.6\"/></pattern><pattern id=\"x\" patternUnits=\"userSpaceOnUse\" width=\"6\" height=\"6\"><rect width=\"6\" height=\"6\" fill=\"#ffe8cc\"/><path d=\"M0 0L6 6M6 0L0 6\" stroke=\"#e67700\" stroke-width=\"0.9\"/></pattern></defs><rect x=\"10\" y=\"60\" width=\"130\" height=\"80\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"140\" y=\"72\" width=\"190\" height=\"56\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><line x1=\"5\" y1=\"100\" x2=\"350\" y2=\"100\" stroke=\"#868e96\" stroke-width=\"1\" stroke-dasharray=\"10 3 2 3\"/><rect x=\"160\" y=\"28\" width=\"150\" height=\"34\" rx=\"0\" fill=\"url(#h)\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"160\" y=\"138\" width=\"150\" height=\"34\" rx=\"0\" fill=\"url(#h)\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"160\" y=\"62\" width=\"150\" height=\"10\" rx=\"0\" fill=\"url(#x)\" stroke=\"#e67700\" stroke-width=\"1.5\"/><rect x=\"160\" y=\"128\" width=\"150\" height=\"10\" rx=\"0\" fill=\"url(#x)\" stroke=\"#e67700\" stroke-width=\"1.5\"/><text x=\"235\" y=\"95\" text-anchor=\"middle\" font-size=\"13\" fill=\"#1f2328\" font-weight=\"bold\">rukavac</text><text x=\"75\" y=\"95\" text-anchor=\"middle\" font-size=\"13\" fill=\"#868e96\">vratilo</text><text x=\"235\" y=\"20\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\">kućište ležišta</text><line x1=\"300\" y1=\"186\" x2=\"280\" y2=\"136\" stroke=\"#1f2328\" stroke-width=\"1\"/><text x=\"300\" y=\"199\" text-anchor=\"middle\" font-size=\"12\" fill=\"#e67700\" font-weight=\"bold\">posteljica (čaura)</text></svg>",
            "cap": "Rukavac u kliznom ležištu",
            "p": [
              "Rukavci su mjesta na osovinama, osovinicama i vratilima na kojima se ugrađuju ležišta.",
              "Najčešće se izrađuju sa osovinama i vratilima kao jedinstvena cjelina, rjeđe odvojeno, pa se posebno spajaju sa osovinom i vratilom.",
              "Primjer: na radilici motora rukavci su glatko brušeni dijelovi na kojima stoje ležajne šolje."
            ]
          },
          {
            "h": "Podjela rukavaca",
            "p": [
              "Rukavci se dijele na rukavce za klizna ležišta i rukavce za kotrljajuće ležaje.",
              "Prema pravcu djelovanja opterećenja rukavci mogu biti: radijalni, ili poprečni, koji prenose opterećenje normalno na osu; aksijalni, ili uzdužni, koji prenose opterećenje u pravcu ose; i radijalno aksijalni, ili kombinovani, koji prenose i poprečna i uzdužna opterećenja.",
              "Prema položaju na vratilu rukavci su spoljašnji, ili čeoni, na kraju vratila, i unutrašnji, ili vratni, između dva dijela vratila.",
              "Primjer: rukavac na kraju osovine kolica je čeoni, a rukavac u sredini radilice je vratni."
            ]
          },
          {
            "h": "Oblici rukavaca za klizna ležišta",
            "img": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 360 255\" font-family=\"Arial,Helvetica,sans-serif\" font-size=\"13\" fill=\"#1f2328\"><defs><marker id=\"a\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10z\" fill=\"context-stroke\"/></marker><pattern id=\"h\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#868e96\" stroke-width=\"1.6\"/></pattern><pattern id=\"h2\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(-45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#495057\" stroke-width=\"1.6\"/></pattern><pattern id=\"x\" patternUnits=\"userSpaceOnUse\" width=\"6\" height=\"6\"><rect width=\"6\" height=\"6\" fill=\"#ffe8cc\"/><path d=\"M0 0L6 6M6 0L0 6\" stroke=\"#e67700\" stroke-width=\"0.9\"/></pattern></defs><rect x=\"70\" y=\"35\" width=\"45\" height=\"50\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"15\" y=\"45\" width=\"55\" height=\"30\" rx=\"0\" fill=\"#e7f5ff\" stroke=\"#1c7ed6\" stroke-width=\"1.5\"/><text x=\"60\" y=\"105\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">cilindrični</text><rect x=\"190\" y=\"35\" width=\"45\" height=\"50\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><path d=\"M135 51 L190 43 L190 77 L135 69 Z\" fill=\"#e7f5ff\" stroke=\"#1c7ed6\" stroke-width=\"1.5\"/><text x=\"180\" y=\"105\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">konični</text><rect x=\"315\" y=\"40\" width=\"38\" height=\"40\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"293\" y=\"53\" width=\"22\" height=\"14\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><circle cx=\"275\" cy=\"60\" r=\"20\" fill=\"#e7f5ff\" stroke=\"#1c7ed6\" stroke-width=\"1.5\"/><text x=\"300\" y=\"105\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">loptasti</text><rect x=\"40\" y=\"200\" width=\"100\" height=\"16\" rx=\"0\" fill=\"url(#h)\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"70\" y=\"130\" width=\"40\" height=\"70\" rx=\"0\" fill=\"#e7f5ff\" stroke=\"#1c7ed6\" stroke-width=\"1.5\"/><line x1=\"52\" y1=\"130\" x2=\"52\" y2=\"192\" stroke=\"#d9480f\" stroke-width=\"2.2\" marker-end=\"url(#a)\"/><text x=\"44\" y=\"165\" text-anchor=\"end\" font-size=\"13\" fill=\"#d9480f\" font-weight=\"bold\">F</text><text x=\"90\" y=\"240\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">aksijalni</text><rect x=\"215\" y=\"130\" width=\"28\" height=\"95\" rx=\"0\" fill=\"url(#h)\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"297\" y=\"130\" width=\"28\" height=\"95\" rx=\"0\" fill=\"url(#h)\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"255\" y=\"125\" width=\"30\" height=\"100\" rx=\"0\" fill=\"#e7f5ff\" stroke=\"#1c7ed6\" stroke-width=\"1.5\"/><rect x=\"243\" y=\"140\" width=\"54\" height=\"8\" rx=\"0\" fill=\"#e7f5ff\" stroke=\"#1c7ed6\" stroke-width=\"1.5\"/><rect x=\"243\" y=\"160\" width=\"54\" height=\"8\" rx=\"0\" fill=\"#e7f5ff\" stroke=\"#1c7ed6\" stroke-width=\"1.5\"/><rect x=\"243\" y=\"180\" width=\"54\" height=\"8\" rx=\"0\" fill=\"#e7f5ff\" stroke=\"#1c7ed6\" stroke-width=\"1.5\"/><rect x=\"243\" y=\"200\" width=\"54\" height=\"8\" rx=\"0\" fill=\"#e7f5ff\" stroke=\"#1c7ed6\" stroke-width=\"1.5\"/><text x=\"270\" y=\"245\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">grebenasti</text></svg>",
            "cap": "Oblici rukavaca za klizna ležišta",
            "p": [
              "Oblici rukavaca za klizna ležišta su: cilindrični, konični, loptasti, aksijalni i grebenasti.",
              "Cilindrični je najčešći, običan valjak. Konični se sužava, pa se zazor može podešavati. Loptasti dozvoljava da se vratilo malo nagne. Aksijalni prima silu duž ose, a grebenasti ima više prstenastih grebena, pa prima velike aksijalne sile.",
              "Primjer: loptasti rukavac radi kao zglob u ramenu, dozvoljava naginjanje u svim pravcima."
            ]
          }
        ],
        "key": [
          "Rukavci su mjesta na osovinama, osovinicama i vratilima na kojima se ugrađuju ležišta.",
          "Najčešće su jedna cjelina sa osovinom ili vratilom, rjeđe se izrađuju odvojeno.",
          "Rukavci se dijele na rukavce za klizna ležišta i rukavce za kotrljajuće ležaje.",
          "Oblici rukavaca za klizna ležišta: cilindrični, konični, loptasti, aksijalni, grebenasti."
        ]
      },
      {
        "id": "me-2-2",
        "module": "2. Rukavci i vratila",
        "title": "Vratila: podjela prema obliku",
        "summary": "Vratila prenose obrtni moment duž ose obrtanja i nose elemente za prenošenje snage.",
        "sections": [
          {
            "h": "Šta su vratila",
            "img": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 360 250\" font-family=\"Arial,Helvetica,sans-serif\" font-size=\"13\" fill=\"#1f2328\"><defs><marker id=\"a\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10z\" fill=\"context-stroke\"/></marker><pattern id=\"h\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#868e96\" stroke-width=\"1.6\"/></pattern><pattern id=\"h2\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(-45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#495057\" stroke-width=\"1.6\"/></pattern><pattern id=\"x\" patternUnits=\"userSpaceOnUse\" width=\"6\" height=\"6\"><rect width=\"6\" height=\"6\" fill=\"#ffe8cc\"/><path d=\"M0 0L6 6M6 0L0 6\" stroke=\"#e67700\" stroke-width=\"0.9\"/></pattern></defs><text x=\"20\" y=\"18\" text-anchor=\"start\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">prava (stepenasta)</text><line x1=\"15\" y1=\"45\" x2=\"345\" y2=\"45\" stroke=\"#868e96\" stroke-width=\"1\" stroke-dasharray=\"10 3 2 3\"/><rect x=\"20\" y=\"38\" width=\"30\" height=\"14\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"50\" y=\"33\" width=\"170\" height=\"24\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"220\" y=\"28\" width=\"50\" height=\"34\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"270\" y=\"38\" width=\"40\" height=\"14\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><text x=\"20\" y=\"92\" text-anchor=\"start\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">bregasto</text><line x1=\"15\" y1=\"120\" x2=\"345\" y2=\"120\" stroke=\"#868e96\" stroke-width=\"1\" stroke-dasharray=\"10 3 2 3\"/><rect x=\"20\" y=\"115\" width=\"320\" height=\"10\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><ellipse cx=\"70\" cy=\"114\" rx=\"8\" ry=\"18\" fill=\"#ffe8cc\" stroke=\"#e67700\" stroke-width=\"1.5\"/><ellipse cx=\"130\" cy=\"126\" rx=\"8\" ry=\"18\" fill=\"#ffe8cc\" stroke=\"#e67700\" stroke-width=\"1.5\"/><ellipse cx=\"190\" cy=\"114\" rx=\"8\" ry=\"18\" fill=\"#ffe8cc\" stroke=\"#e67700\" stroke-width=\"1.5\"/><ellipse cx=\"250\" cy=\"126\" rx=\"8\" ry=\"18\" fill=\"#ffe8cc\" stroke=\"#e67700\" stroke-width=\"1.5\"/><ellipse cx=\"310\" cy=\"114\" rx=\"8\" ry=\"18\" fill=\"#ffe8cc\" stroke=\"#e67700\" stroke-width=\"1.5\"/><text x=\"20\" y=\"168\" text-anchor=\"start\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">koljenasto</text><line x1=\"15\" y1=\"200\" x2=\"345\" y2=\"200\" stroke=\"#868e96\" stroke-width=\"1\" stroke-dasharray=\"10 3 2 3\"/><rect x=\"20\" y=\"194\" width=\"110\" height=\"12\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"130\" y=\"184\" width=\"14\" height=\"48\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"144\" y=\"220\" width=\"60\" height=\"12\" rx=\"0\" fill=\"#ffe8cc\" stroke=\"#e67700\" stroke-width=\"1.5\"/><rect x=\"204\" y=\"184\" width=\"14\" height=\"48\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"218\" y=\"194\" width=\"120\" height=\"12\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><line x1=\"140\" y1=\"226\" x2=\"222\" y2=\"226\" stroke=\"#868e96\" stroke-width=\"1\" stroke-dasharray=\"10 3 2 3\"/><text x=\"174\" y=\"248\" text-anchor=\"middle\" font-size=\"11\" fill=\"#868e96\">koljeno</text></svg>",
            "cap": "Pravo stepenasto, bregasto i koljenasto vratilo",
            "p": [
              "Vratila služe za prenošenje obrtnog momenta duž ose obrtanja, i kao nosači elemenata za prenošenje snage i obrtnog kretanja.",
              "Podjela vratila prema obliku: prava, bregasta, koljenasta, kardanska i gipka."
            ]
          },
          {
            "h": "Prava vratila",
            "p": [
              "Tipičan primjer pravog vratila je vratilo elektromotora. Prava vratila mogu biti glatka i stepenasta.",
              "Pri konstrukciji stepenastih vratila prelaze sa jednog prečnika na drugi treba izvoditi sa odgovarajućim radijusima zaobljenja, i tako izbjeći stvaranje koncentracije napona. Na oštrom uglu se napon skuplja, i tu vratilo prvo pukne.",
              "Primjer: plastična kesa se pocijepa od malog ureza, a bez ureza je teško pocijepati."
            ]
          },
          {
            "h": "Bregasto vratilo",
            "p": [
              "Bregasto vratilo ima poseban oblik. Služi za otvaranje i zatvaranje ventila motora sa unutrašnjim sagorijevanjem. Na njemu su izrađeni brijegovi koji služe za podizanje ventila.",
              "Primjer: u motoru automobila svaki brijeg pri svakom obrtaju gurne svoj ventil i otvori ga."
            ]
          },
          {
            "h": "Koljenasto vratilo",
            "p": [
              "Koljenasta vratila služe za pretvaranje pravolinijskog kretanja u kružno, i obratno, kružnog u pravolinijsko.",
              "Mogu biti prosta i složena. Prosto koljenasto vratilo ima samo jedno koljeno, a složeno više koljena.",
              "Imaju primjenu kod motora sa unutrašnjim sagorijevanjem, kod klipnih kompresora, ekscentar presa i još nekih mašina.",
              "Primjer: pedale bicikla rade kao koljeno: noga gura gore dolje, a osovina pedala se okreće."
            ]
          },
          {
            "h": "Kardansko vratilo",
            "img": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 360 160\" font-family=\"Arial,Helvetica,sans-serif\" font-size=\"13\" fill=\"#1f2328\"><defs><marker id=\"a\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10z\" fill=\"context-stroke\"/></marker><pattern id=\"h\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#868e96\" stroke-width=\"1.6\"/></pattern><pattern id=\"h2\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(-45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#495057\" stroke-width=\"1.6\"/></pattern><pattern id=\"x\" patternUnits=\"userSpaceOnUse\" width=\"6\" height=\"6\"><rect width=\"6\" height=\"6\" fill=\"#ffe8cc\"/><path d=\"M0 0L6 6M6 0L0 6\" stroke=\"#e67700\" stroke-width=\"0.9\"/></pattern></defs><text x=\"100\" y=\"20\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">kardansko vratilo</text><rect x=\"10\" y=\"82\" width=\"60\" height=\"16\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"70\" y=\"72\" width=\"8\" height=\"36\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"78\" y=\"72\" width=\"20\" height=\"7\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"78\" y=\"101\" width=\"20\" height=\"7\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><circle cx=\"100\" cy=\"90\" r=\"9\" fill=\"#fff4e6\" stroke=\"#d9480f\" stroke-width=\"2\"/><line x1=\"94\" y1=\"90\" x2=\"106\" y2=\"90\" stroke=\"#d9480f\" stroke-width=\"1.5\"/><line x1=\"100\" y1=\"84\" x2=\"100\" y2=\"96\" stroke=\"#d9480f\" stroke-width=\"1.5\"/><g transform=\"rotate(20 100 90)\"><rect x=\"104\" y=\"78\" width=\"8\" height=\"24\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"112\" y=\"82\" width=\"78\" height=\"16\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/></g><line x1=\"100\" y1=\"130\" x2=\"100\" y2=\"104\" stroke=\"#1f2328\" stroke-width=\"1\"/><text x=\"100\" y=\"145\" text-anchor=\"middle\" font-size=\"12\" fill=\"#d9480f\">zglobna spojnica</text><text x=\"285\" y=\"20\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">gipko vratilo</text><path d=\"M215 60 C260 20 300 140 345 100\" fill=\"none\" stroke=\"#495057\" stroke-width=\"11\"/><path d=\"M215 60 C260 20 300 140 345 100\" fill=\"none\" stroke=\"#fff\" stroke-width=\"7\" stroke-dasharray=\"2 3\"/><text x=\"285\" y=\"145\" text-anchor=\"middle\" font-size=\"11\" fill=\"#868e96\">osa mijenja položaj</text></svg>",
            "cap": "Zglobna spojnica kardanskog vratila i gipko vratilo",
            "p": [
              "Kardanska vratila primjenjuju se kod motornih vozila za prenošenje obrtnog kretanja od motora do diferencijala. Na kardanskim vratilima su ugrađene zglobne spojnice, koje dozvoljavaju da vratilo radi i pod uglom.",
              "Primjer: kod kamiona kardansko vratilo ide ispod vozila, od mjenjača do zadnje osovine."
            ]
          },
          {
            "h": "Gipko vratilo",
            "p": [
              "Gipka vratila služe za prenošenje obrtnih momenata kada je potrebno da geometrijska osa vratila mijenja svoj prostorni položaj. Primjenjuju se za prenošenje malih obrtnih momenata.",
              "Primjer: savitljivi nastavak za bušilicu, kojim se buši na teško dostupnom mjestu."
            ]
          }
        ],
        "key": [
          "Vratila služe za prenošenje obrtnog momenta duž ose obrtanja i kao nosači elemenata za prenošenje snage.",
          "Podjela vratila prema obliku: prava, bregasta, koljenasta, kardanska i gipka.",
          "Stepenasta vratila: prelazi sa radijusima zaobljenja, da se izbjegne koncentracija napona.",
          "Koljenasta vratila pretvaraju pravolinijsko kretanje u kružno i obratno; prosta imaju jedno koljeno, složena više.",
          "Kardanska vratila: od motora do diferencijala, sa zglobnim spojnicama. Gipka vratila: osa mijenja položaj, mali obrtni momenti."
        ]
      },
      {
        "id": "me-2-3",
        "module": "2. Rukavci i vratila",
        "title": "Dimenzionisanje vratila i završni proračun",
        "summary": "Vratila mogu biti izložena uvijanju, ili uvijanju i savijanju.",
        "sections": [
          {
            "h": "Opterećenje vratila",
            "p": [
              "Vratila, u zavisnosti od načina prenošenja obrtnog momenta, mogu biti izložena uvijanju, ili uvijanju i savijanju.",
              "Primjer: kad cijediš mokar peškir, uvijaš ga, isto kao što motor uvija vratilo."
            ]
          },
          {
            "h": "Vratilo izloženo samo uvijanju",
            "img": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 360 204\" font-family=\"Arial,Helvetica,sans-serif\" font-size=\"13\" fill=\"#1f2328\"><defs><marker id=\"a\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10z\" fill=\"context-stroke\"/></marker><pattern id=\"h\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#868e96\" stroke-width=\"1.6\"/></pattern><pattern id=\"h2\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(-45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#495057\" stroke-width=\"1.6\"/></pattern><pattern id=\"x\" patternUnits=\"userSpaceOnUse\" width=\"6\" height=\"6\"><rect width=\"6\" height=\"6\" fill=\"#ffe8cc\"/><path d=\"M0 0L6 6M6 0L0 6\" stroke=\"#e67700\" stroke-width=\"0.9\"/></pattern></defs><rect x=\"4\" y=\"4\" width=\"352\" height=\"196\" rx=\"10\" fill=\"#f8f9fa\" stroke=\"#dee2e6\" stroke-width=\"1\"/><text x=\"180\" y=\"32\" text-anchor=\"middle\" font-size=\"12\" fill=\"#868e96\">samo uvijanje:</text><text x=\"180\" y=\"64\" text-anchor=\"middle\" font-size=\"16\" fill=\"#1f2328\" font-weight=\"bold\">τ = T / Wp ≤ τdoz</text><text x=\"180\" y=\"94\" text-anchor=\"middle\" font-size=\"16\" fill=\"#1f2328\" font-weight=\"bold\">d = ∛( 16·T / (π·τdoz) )</text><text x=\"22\" y=\"94\" text-anchor=\"middle\" font-size=\"16\" fill=\"#2b8a3e\" font-weight=\"bold\">✓</text><text x=\"180\" y=\"122\" text-anchor=\"middle\" font-size=\"12\" fill=\"#868e96\">uvijanje i savijanje:</text><text x=\"180\" y=\"154\" text-anchor=\"middle\" font-size=\"16\" fill=\"#1f2328\" font-weight=\"bold\">Mi = √( M² + (α0·T)² )</text><text x=\"180\" y=\"184\" text-anchor=\"middle\" font-size=\"16\" fill=\"#1f2328\" font-weight=\"bold\">d = ∛( 32·Mi / (π·σdoz) )</text><text x=\"22\" y=\"184\" text-anchor=\"middle\" font-size=\"16\" fill=\"#2b8a3e\" font-weight=\"bold\">✓</text></svg>",
            "cap": "Formule za dimenzionisanje vratila, kvačica označava formule iz sveske sa kvačicom",
            "p": [
              "Ako je vratilo izloženo uvijanju, dimenzionisanje njegovog poprečnog presjeka vrši se iz osnovne jednačine uvijanja: tau jednako T kroz W p, manje ili jednako tau dozvoljeno.",
              "T je obrtni moment, a W p polarni otporni moment presjeka.",
              "Za vratilo punog kružnog presjeka prečnik je: d jednako treći korijen iz šesnaest puta T, kroz pi puta tau dozvoljeno."
            ]
          },
          {
            "h": "Vratilo izloženo uvijanju i savijanju",
            "p": [
              "Prečnici vratila izloženih uvijanju i savijanju određuju se pomoću osnovne jednačine savijanja: sigma jednako M i kroz W, manje ili jednako sigma dozvoljeno.",
              "M i je uporedni moment, koji spaja savijanje i uvijanje u jedan moment: korijen iz M na kvadrat, plus alfa nula puta T, na kvadrat.",
              "Pa je prečnik vratila: d jednako treći korijen iz trideset dva puta M i, kroz pi puta sigma dozvoljeno.",
              "Dozvoljeni napon savijanja je karakteristika materijala podijeljena stepenom sigurnosti S."
            ]
          },
          {
            "h": "Završni proračun osovina i vratila",
            "p": [
              "Završni proračun vratila i osovina obuhvata: provjeru čvrstoće, odnosno stepena sigurnosti kritičnih presjeka, i provjeru krutosti.",
              "Provjera krutosti se svodi na izračunavanje najvećeg ugiba i uglova nagiba u osloncima, kao i ugla uvijanja na vratilima.",
              "Vratilo može biti dovoljno čvrsto da ne pukne, a da se ipak previše savije. Primjer: ako se vratilo mjenjača previše ugne, zupčanici ne nalegnu dobro i brzo se istroše."
            ]
          }
        ],
        "key": [
          "Vratila mogu biti izložena uvijanju, ili uvijanju i savijanju.",
          "Samo uvijanje: d jednako treći korijen iz šesnaest puta T, kroz pi puta tau dozvoljeno.",
          "Uvijanje i savijanje: d jednako treći korijen iz trideset dva puta M i, kroz pi puta sigma dozvoljeno.",
          "Završni proračun: provjera čvrstoće kritičnih presjeka i provjera krutosti."
        ]
      },
      {
        "id": "me-3-1",
        "module": "3. Ležišta i podmazivanje",
        "title": "Ležišta: osnovni pojmovi",
        "summary": "Ležišta su oslonci osovina, osovinica i vratila.",
        "sections": [
          {
            "h": "Šta su ležišta",
            "p": [
              "Ležišta su oslonci osovina, osovinica i vratila.",
              "Ležište je pokretni spoj dva ili više dijelova mašine.",
              "Ležište služi za prenošenje opterećenja, oslanjanje i vođenje drugih dijelova mašine.",
              "Ako se dio u odnosu na druge kružno kreće, pokretni spoj se naziva ležište, a ako vrši translatorno, to jest pravolinijsko kretanje, spoj se naziva vodica.",
              "Primjer: klizne staze po kojima se pomjera sto glodalice su vodice, a ležaj u kom se okreće glavno vreteno je ležište."
            ]
          },
          {
            "h": "Klizna i kotrljajuća ležišta",
            "img": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 360 180\" font-family=\"Arial,Helvetica,sans-serif\" font-size=\"13\" fill=\"#1f2328\"><defs><marker id=\"a\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10z\" fill=\"context-stroke\"/></marker><pattern id=\"h\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#868e96\" stroke-width=\"1.6\"/></pattern><pattern id=\"h2\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(-45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#495057\" stroke-width=\"1.6\"/></pattern><pattern id=\"x\" patternUnits=\"userSpaceOnUse\" width=\"6\" height=\"6\"><rect width=\"6\" height=\"6\" fill=\"#ffe8cc\"/><path d=\"M0 0L6 6M6 0L0 6\" stroke=\"#e67700\" stroke-width=\"0.9\"/></pattern></defs><path d=\"M2 140 A88 88 0 0 1 178 140 L158 140 A68 68 0 0 0 22 140 Z\" fill=\"url(#h)\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><path d=\"M22 140 A68 68 0 0 1 158 140 L150 140 A60 60 0 0 0 30 140 Z\" fill=\"url(#x)\" stroke=\"#e67700\" stroke-width=\"1.5\"/><path d=\"M30 140 A60 60 0 0 1 150 140 Z\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><path d=\"M70 120 A22 22 0 0 1 110 120\" fill=\"none\" stroke=\"#1c7ed6\" stroke-width=\"2\" marker-end=\"url(#a)\"/><text x=\"90\" y=\"108\" text-anchor=\"middle\" font-size=\"13\" fill=\"#1c7ed6\" font-weight=\"bold\">ω</text><text x=\"90\" y=\"160\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">klizno ležište</text><text x=\"90\" y=\"175\" text-anchor=\"middle\" font-size=\"11\" fill=\"#d9480f\">trenje klizanja</text><path d=\"M182 140 A88 88 0 0 1 358 140 L340 140 A70 70 0 0 0 200 140 Z\" fill=\"url(#h)\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><circle cx=\"329.2\" cy=\"118.5\" r=\"7\" fill=\"#fff\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><circle cx=\"306.1\" cy=\"88.4\" r=\"7\" fill=\"#fff\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><circle cx=\"270.0\" cy=\"77.0\" r=\"7\" fill=\"#fff\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><circle cx=\"233.9\" cy=\"88.4\" r=\"7\" fill=\"#fff\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><circle cx=\"210.8\" cy=\"118.5\" r=\"7\" fill=\"#fff\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><path d=\"M214 140 A56 56 0 0 1 326 140 L320 140 A50 50 0 0 0 220 140 Z\" fill=\"#dee2e6\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><path d=\"M220 140 A50 50 0 0 1 320 140 Z\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><path d=\"M252 125 A22 22 0 0 1 288 125\" fill=\"none\" stroke=\"#1c7ed6\" stroke-width=\"2\" marker-end=\"url(#a)\"/><text x=\"270\" y=\"113\" text-anchor=\"middle\" font-size=\"13\" fill=\"#1c7ed6\" font-weight=\"bold\">ω</text><text x=\"270\" y=\"160\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">kotrljajući ležaj</text><text x=\"270\" y=\"175\" text-anchor=\"middle\" font-size=\"11\" fill=\"#2b8a3e\">trenje kotrljanja</text></svg>",
            "cap": "Klizno ležište i kotrljajući ležaj",
            "p": [
              "Ležišta se mogu podijeliti u dvije osnovne grupe.",
              "Klizna ležišta: rukavac je u neposrednom dodiru sa posteljicom ležišta, pa dolazi do trenja klizanja.",
              "Kotrljajući ležaji: rukavac nije u neposrednom dodiru sa osloncem, nego se između nepokretnog i pokretnog dijela ležišta nalazi niz kotrljajnih tijela, pa dolazi do trenja kotrljanja.",
              "Trenje kotrljanja je mnogo manje od trenja klizanja. Primjer: lakše je gurati kofer na točkićima nego vući kutiju po podu."
            ]
          },
          {
            "h": "Pravac opterećenja",
            "img": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 360 125\" font-family=\"Arial,Helvetica,sans-serif\" font-size=\"13\" fill=\"#1f2328\"><defs><marker id=\"a\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10z\" fill=\"context-stroke\"/></marker><pattern id=\"h\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#868e96\" stroke-width=\"1.6\"/></pattern><pattern id=\"h2\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(-45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#495057\" stroke-width=\"1.6\"/></pattern><pattern id=\"x\" patternUnits=\"userSpaceOnUse\" width=\"6\" height=\"6\"><rect width=\"6\" height=\"6\" fill=\"#ffe8cc\"/><path d=\"M0 0L6 6M6 0L0 6\" stroke=\"#e67700\" stroke-width=\"0.9\"/></pattern></defs><line x1=\"15\" y1=\"63\" x2=\"115\" y2=\"63\" stroke=\"#868e96\" stroke-width=\"1\" stroke-dasharray=\"10 3 2 3\"/><rect x=\"20\" y=\"55\" width=\"90\" height=\"16\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><line x1=\"65\" y1=\"12\" x2=\"65\" y2=\"51\" stroke=\"#d9480f\" stroke-width=\"2.5\" marker-end=\"url(#a)\"/><text x=\"65\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">radijalno</text><line x1=\"135\" y1=\"63\" x2=\"235\" y2=\"63\" stroke=\"#868e96\" stroke-width=\"1\" stroke-dasharray=\"10 3 2 3\"/><rect x=\"150\" y=\"55\" width=\"80\" height=\"16\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><line x1=\"120\" y1=\"63\" x2=\"146\" y2=\"63\" stroke=\"#d9480f\" stroke-width=\"2.5\" marker-end=\"url(#a)\"/><text x=\"190\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">aksijalno</text><line x1=\"255\" y1=\"63\" x2=\"350\" y2=\"63\" stroke=\"#868e96\" stroke-width=\"1\" stroke-dasharray=\"10 3 2 3\"/><rect x=\"265\" y=\"55\" width=\"80\" height=\"16\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><line x1=\"305\" y1=\"12\" x2=\"305\" y2=\"51\" stroke=\"#d9480f\" stroke-width=\"2.5\" marker-end=\"url(#a)\"/><line x1=\"240\" y1=\"63\" x2=\"261\" y2=\"63\" stroke=\"#d9480f\" stroke-width=\"2.5\" marker-end=\"url(#a)\"/><text x=\"300\" y=\"100\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">radijalno-aksijalno</text></svg>",
            "cap": "Pravac djelovanja opterećenja",
            "p": [
              "Prema pravcu djelovanja opterećenja ležišta mogu biti: radijalna, kad opterećenje djeluje upravno na geometrijsku osu vratila; aksijalna, kad opterećenje djeluje uzduž geometrijske ose; i radijalno aksijalna, kad istovremeno djeluju radijalno i aksijalno opterećenje.",
              "Primjer: ležaj točka automobila je radijalno aksijalan, nosi težinu auta, a u krivini prima i bočnu silu."
            ]
          }
        ],
        "key": [
          "Ležišta su oslonci osovina, osovinica i vratila.",
          "Ležište je pokretni spoj dva ili više dijelova mašine.",
          "Klizna ležišta: rukavac u neposrednom dodiru sa posteljicom, trenje klizanja.",
          "Kotrljajući ležaji: između nepokretnog i pokretnog dijela su kotrljajna tijela, trenje kotrljanja."
        ]
      },
      {
        "id": "me-3-2",
        "module": "3. Ležišta i podmazivanje",
        "title": "Klizna ležišta: prednosti, nedostaci i vrste",
        "summary": "Klizna ležišta se primjenjuju tamo gdje nije moguće ugraditi kotrljajne ležaje.",
        "sections": [
          {
            "h": "Prednosti kliznih ležišta",
            "p": [
              "Klizna ležišta se primjenjuju tamo gdje nije moguće ugraditi kotrljajne ležaje.",
              "Primjenjuju se za prečnike do petnaest milimetara i preko tristo milimetara.",
              "Pogodna su za najveće brzine, imaju dug vijek trajanja, amortizuju udare, i prigušuju buku i vibracije, jer sloj ulja radi kao jastuk.",
              "Jednostavne su konstrukcije i manjih dimenzija.",
              "Primjer: radilica u motoru automobila okreće se u kliznim ležajevima, takozvanim ležajnim šoljama."
            ]
          },
          {
            "h": "Nedostaci kliznih ležišta",
            "p": [
              "Nedostaci su: veliki gubici energije zbog trenja, habanje dodirnih površina, i potreba za podmazivanjem.",
              "Primjer: ako motor ostane bez ulja, klizni ležajevi se za par minuta pregriju i zaribaju."
            ]
          },
          {
            "h": "Radijalna ležišta",
            "img": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 360 230\" font-family=\"Arial,Helvetica,sans-serif\" font-size=\"13\" fill=\"#1f2328\"><defs><marker id=\"a\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10z\" fill=\"context-stroke\"/></marker><pattern id=\"h\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#868e96\" stroke-width=\"1.6\"/></pattern><pattern id=\"h2\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(-45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#495057\" stroke-width=\"1.6\"/></pattern><pattern id=\"x\" patternUnits=\"userSpaceOnUse\" width=\"6\" height=\"6\"><rect width=\"6\" height=\"6\" fill=\"#ffe8cc\"/><path d=\"M0 0L6 6M6 0L0 6\" stroke=\"#e67700\" stroke-width=\"0.9\"/></pattern></defs><rect x=\"30\" y=\"170\" width=\"300\" height=\"18\" rx=\"0\" fill=\"url(#h)\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"90\" y=\"110\" width=\"180\" height=\"60\" rx=\"0\" fill=\"url(#h)\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><path d=\"M90 110 L90 80 Q180 20 270 80 L270 110 Z\" fill=\"url(#h2)\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><circle cx=\"180\" cy=\"110\" r=\"48\" fill=\"url(#x)\" stroke=\"#e67700\" stroke-width=\"1.5\"/><circle cx=\"180\" cy=\"110\" r=\"40\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><line x1=\"90\" y1=\"110\" x2=\"132\" y2=\"110\" stroke=\"#1f2328\" stroke-width=\"2\"/><line x1=\"228\" y1=\"110\" x2=\"270\" y2=\"110\" stroke=\"#1f2328\" stroke-width=\"2\"/><rect x=\"104\" y=\"60\" width=\"8\" height=\"110\" rx=\"0\" fill=\"#868e96\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"248\" y=\"60\" width=\"8\" height=\"110\" rx=\"0\" fill=\"#868e96\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"99\" y=\"52\" width=\"18\" height=\"8\" rx=\"0\" fill=\"#495057\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"243\" y=\"52\" width=\"18\" height=\"8\" rx=\"0\" fill=\"#495057\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><text x=\"180\" y=\"114\" text-anchor=\"middle\" font-size=\"11\" fill=\"#868e96\">vratilo</text><line x1=\"300\" y1=\"55\" x2=\"250\" y2=\"70\" stroke=\"#1f2328\" stroke-width=\"1\"/><text x=\"305\" y=\"52\" text-anchor=\"start\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">poklopac</text><line x1=\"300\" y1=\"140\" x2=\"270\" y2=\"140\" stroke=\"#1f2328\" stroke-width=\"1\"/><text x=\"305\" y=\"144\" text-anchor=\"start\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">kućište</text><line x1=\"55\" y1=\"70\" x2=\"100\" y2=\"78\" stroke=\"#1f2328\" stroke-width=\"1\"/><text x=\"50\" y=\"68\" text-anchor=\"end\" font-size=\"12\" fill=\"#1f2328\">vijak</text><line x1=\"180\" y1=\"208\" x2=\"180\" y2=\"157\" stroke=\"#e67700\" stroke-width=\"1\"/><text x=\"180\" y=\"222\" text-anchor=\"middle\" font-size=\"12\" fill=\"#e67700\" font-weight=\"bold\">dijeljena blazinica (posteljica)</text></svg>",
            "cap": "Stojeći dvodijelni ležaj s poklopcem",
            "p": [
              "Prema konstrukciji radijalna ležišta mogu biti jednodjelna i dvodjelna.",
              "Jednodjelna ležišta mogu biti prirubna i stojeća. Prirubno se vijcima pričvrsti za zid mašine, a stojeće stoji na podlozi.",
              "Dvodjelno ležište ima kućište i poklopac, spojene vijcima, a između njih je dijeljena blazinica. Vratilo se može postaviti odozgo, bez rastavljanja ostalih dijelova.",
              "Primjer: radilica leži u dvodjelnim ležištima, jer se sa svojim koljenima ne bi mogla provući kroz jednodjelno ležište."
            ]
          },
          {
            "h": "Aksijalna ležišta",
            "img": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 360 185\" font-family=\"Arial,Helvetica,sans-serif\" font-size=\"13\" fill=\"#1f2328\"><defs><marker id=\"a\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10z\" fill=\"context-stroke\"/></marker><pattern id=\"h\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#868e96\" stroke-width=\"1.6\"/></pattern><pattern id=\"h2\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(-45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#495057\" stroke-width=\"1.6\"/></pattern><pattern id=\"x\" patternUnits=\"userSpaceOnUse\" width=\"6\" height=\"6\"><rect width=\"6\" height=\"6\" fill=\"#ffe8cc\"/><path d=\"M0 0L6 6M6 0L0 6\" stroke=\"#e67700\" stroke-width=\"0.9\"/></pattern></defs><rect x=\"120\" y=\"50\" width=\"30\" height=\"40\" rx=\"0\" fill=\"url(#h)\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"210\" y=\"50\" width=\"30\" height=\"40\" rx=\"0\" fill=\"url(#h)\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"150\" y=\"20\" width=\"60\" height=\"110\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><line x1=\"180\" y1=\"10\" x2=\"180\" y2=\"140\" stroke=\"#868e96\" stroke-width=\"1\" stroke-dasharray=\"10 3 2 3\"/><rect x=\"120\" y=\"130\" width=\"120\" height=\"12\" rx=\"0\" fill=\"url(#x)\" stroke=\"#e67700\" stroke-width=\"1.5\"/><rect x=\"100\" y=\"142\" width=\"160\" height=\"30\" rx=\"0\" fill=\"url(#h)\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><line x1=\"160\" y1=\"0\" x2=\"160\" y2=\"18\" stroke=\"#d9480f\" stroke-width=\"2.5\" marker-end=\"url(#a)\"/><text x=\"168\" y=\"13\" text-anchor=\"start\" font-size=\"12\" fill=\"#d9480f\" font-weight=\"bold\">F_a</text><line x1=\"290\" y1=\"136\" x2=\"240\" y2=\"136\" stroke=\"#1f2328\" stroke-width=\"1\"/><text x=\"295\" y=\"140\" text-anchor=\"start\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">aksijalno</text><line x1=\"290\" y1=\"70\" x2=\"240\" y2=\"70\" stroke=\"#1f2328\" stroke-width=\"1\"/><text x=\"295\" y=\"74\" text-anchor=\"start\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">radijalno</text><text x=\"180\" y=\"182\" text-anchor=\"middle\" font-size=\"11\" fill=\"#868e96\">aksijalno ležište + radijalno ležište</text></svg>",
            "cap": "Aksijalno ležište u kombinaciji sa radijalnim",
            "p": [
              "Aksijalna ležišta se koriste za prenošenje aksijalnih sila, i koriste se u kombinaciji sa radijalnim ležištima.",
              "Aksijalna ležišta mogu biti: sa ravnom dodirnom površinom, sa prstenastom, sa hidrodinamičkim podmazivanjem, sa hidrostatičkim, segmentna i grebenasta.",
              "Primjer: vertikalno vratilo hidroturbine visi na velikom aksijalnom ležištu koje nosi cijelu njegovu težinu."
            ]
          }
        ],
        "key": [
          "Prednosti: tamo gdje nije moguće ugraditi kotrljajne ležaje, prečnici do petnaest i preko tristo milimetara, najveće brzine, dug vijek, amortizuju udare, prigušuju buku i vibracije, jednostavna konstrukcija.",
          "Nedostaci: veliki gubici energije zbog trenja, habanje dodirnih površina, podmazivanje.",
          "Radijalna ležišta: jednodjelna, i to prirubna i stojeća, i dvodjelna.",
          "Aksijalna ležišta: sa ravnom dodirnom površinom, sa prstenastom, sa hidrodinamičkim podmazivanjem, sa hidrostatičkim, segmentna, grebenasta."
        ]
      },
      {
        "id": "me-3-3",
        "module": "3. Ležišta i podmazivanje",
        "title": "Posteljice ležišta",
        "summary": "Posteljica je dio koji se ugrađuje u kućište ležišta, da odvoji kućište od rukavca.",
        "sections": [
          {
            "h": "Šta je posteljica",
            "img": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 360 200\" font-family=\"Arial,Helvetica,sans-serif\" font-size=\"13\" fill=\"#1f2328\"><defs><marker id=\"a\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10z\" fill=\"context-stroke\"/></marker><pattern id=\"h\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#868e96\" stroke-width=\"1.6\"/></pattern><pattern id=\"h2\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(-45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#495057\" stroke-width=\"1.6\"/></pattern><pattern id=\"x\" patternUnits=\"userSpaceOnUse\" width=\"6\" height=\"6\"><rect width=\"6\" height=\"6\" fill=\"#ffe8cc\"/><path d=\"M0 0L6 6M6 0L0 6\" stroke=\"#e67700\" stroke-width=\"0.9\"/></pattern></defs><circle cx=\"130\" cy=\"105\" r=\"90\" fill=\"url(#h)\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><circle cx=\"130\" cy=\"105\" r=\"70\" fill=\"url(#x)\" stroke=\"#e67700\" stroke-width=\"1.5\"/><circle cx=\"130\" cy=\"105\" r=\"58\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"126\" y=\"8\" width=\"8\" height=\"40\" rx=\"0\" fill=\"#a5d8ff\" stroke=\"#1c7ed6\" stroke-width=\"1\"/><line x1=\"118\" y1=\"20\" x2=\"90\" y2=\"20\" stroke=\"#1c7ed6\" stroke-width=\"1\"/><text x=\"86\" y=\"24\" text-anchor=\"end\" font-size=\"11\" fill=\"#1c7ed6\">kanal za mazivo</text><line x1=\"285\" y1=\"45\" x2=\"200\" y2=\"60\" stroke=\"#1f2328\" stroke-width=\"1\"/><text x=\"290\" y=\"42\" text-anchor=\"start\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">kućište</text><line x1=\"285\" y1=\"105\" x2=\"197\" y2=\"105\" stroke=\"#1f2328\" stroke-width=\"1\"/><text x=\"290\" y=\"109\" text-anchor=\"start\" font-size=\"12\" fill=\"#e67700\" font-weight=\"bold\">posteljica</text><line x1=\"285\" y1=\"165\" x2=\"165\" y2=\"140\" stroke=\"#1f2328\" stroke-width=\"1\"/><text x=\"290\" y=\"169\" text-anchor=\"start\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">rukavac</text></svg>",
            "cap": "Kućište, posteljica i rukavac",
            "p": [
              "Posteljica ležišta je dio koji se ugrađuje u kućište ležišta, zbog odvajanja kućišta od rukavca, kao dijela osovine ili vratila.",
              "Produžava trajanje odvojenih dijelova, jer se troši posteljica, a ne kućište i rukavac.",
              "Izrađuje se od manje kvalitetnog i jeftinijeg materijala od kućišta i rukavca.",
              "U unutrašnjosti ima kanale za dovođenje i razvođenje maziva do mjesta podmazivanja.",
              "Primjer: kod istrošenog motora mijenjaju se samo ležajne šolje, a radilica i blok motora ostaju."
            ]
          },
          {
            "h": "Oblici i izrada",
            "p": [
              "Oblici posteljica zavise od vida podmazivanja: cilindrični i ovalni.",
              "Po konstrukciji posteljice su jednodjelne i dvodjelne.",
              "Prema načinu izrade posteljice su jednoslojne, dvoslojne i troslojne. Dodatno objašnjenje: kod višeslojnih je na čeličnu podlogu nanesen tanak sloj mekšeg kliznog materijala."
            ]
          },
          {
            "h": "Osobine materijala posteljica",
            "p": [
              "Osobine materijala od kojih se izrađuju posteljice su: otpornost na habanje; izdržljivost na pritiske i udare; sposobnost prilagođavanja rukavcu; primanje i raspoređivanje maziva; odvođenje toplote; i isti koeficijent širenja materijala rukavca i posteljice.",
              "Isti koeficijent širenja je važan jer se pri zagrijavanju oba dijela šire jednako, pa zazor ostaje isti i ležište se ne zaglavi.",
              "Primjer: bronza je čest materijal za posteljice, jer je otporna na habanje i dobro odvodi toplotu."
            ]
          }
        ],
        "key": [
          "Posteljica se ugrađuje u kućište da odvoji kućište od rukavca, i produžava trajanje odvojenih dijelova.",
          "Izrađuje se od jeftinijeg materijala i ima kanale za mazivo.",
          "Osobine materijala posteljica: otpornost na habanje, izdržljivost na pritiske i udare, prilagođavanje rukavcu, primanje i raspoređivanje maziva, odvođenje toplote, isti koeficijent širenja kao rukavac."
        ]
      },
      {
        "id": "me-3-4",
        "module": "3. Ležišta i podmazivanje",
        "title": "Trenje i podmazivanje",
        "summary": "Podmazivanje je uvođenje maziva između površina u relativnom kretanju, da se smanji trenje i trošenje.",
        "sections": [
          {
            "h": "Vrste trenja",
            "img": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 360 185\" font-family=\"Arial,Helvetica,sans-serif\" font-size=\"13\" fill=\"#1f2328\"><defs><marker id=\"a\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10z\" fill=\"context-stroke\"/></marker><pattern id=\"h\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#868e96\" stroke-width=\"1.6\"/></pattern><pattern id=\"h2\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(-45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#495057\" stroke-width=\"1.6\"/></pattern><pattern id=\"x\" patternUnits=\"userSpaceOnUse\" width=\"6\" height=\"6\"><rect width=\"6\" height=\"6\" fill=\"#ffe8cc\"/><path d=\"M0 0L6 6M6 0L0 6\" stroke=\"#e67700\" stroke-width=\"0.9\"/></pattern></defs><polygon points=\"10,30 110,30 110,85 100,75 90,85 80,75 70,85 60,75 50,85 40,75 30,85 20,75 10,85\" fill=\"#ced4da\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><polygon points=\"10,85 20,95 30,85 40,95 50,85 60,95 70,85 80,95 90,85 100,95 110,85 110,140 10,140\" fill=\"#ced4da\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><line x1=\"40\" y1=\"18\" x2=\"80\" y2=\"18\" stroke=\"#1f2328\" stroke-width=\"2\" marker-end=\"url(#a)\"/><text x=\"32\" y=\"22\" text-anchor=\"end\" font-size=\"13\" fill=\"#1f2328\" font-weight=\"bold\">v</text><text x=\"60\" y=\"156\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\">v = 0</text><text x=\"60\" y=\"176\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">suvo</text><rect x=\"140\" y=\"80\" width=\"70\" height=\"12\" rx=\"0\" fill=\"#a5d8ff\" stroke=\"none\" stroke-width=\"0\"/><polygon points=\"125,30 225,30 225,83 215,73 205,83 195,73 185,83 175,73 165,83 155,73 145,83 135,73 125,83\" fill=\"#ced4da\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><polygon points=\"125,89 135,99 145,89 155,99 165,89 175,99 185,89 195,99 205,89 215,99 225,89 225,140 125,140\" fill=\"#ced4da\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><line x1=\"155\" y1=\"18\" x2=\"195\" y2=\"18\" stroke=\"#1f2328\" stroke-width=\"2\" marker-end=\"url(#a)\"/><text x=\"147\" y=\"22\" text-anchor=\"end\" font-size=\"13\" fill=\"#1f2328\" font-weight=\"bold\">v</text><text x=\"175\" y=\"156\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\">v = 0</text><text x=\"175\" y=\"176\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">mješovito</text><rect x=\"240\" y=\"68\" width=\"100\" height=\"36\" rx=\"0\" fill=\"#a5d8ff\" stroke=\"none\" stroke-width=\"0\"/><polygon points=\"240,30 340,30 340,75 330,65 320,75 310,65 300,75 290,65 280,75 270,65 260,75 250,65 240,75\" fill=\"#ced4da\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><polygon points=\"240,97 250,107 260,97 270,107 280,97 290,107 300,97 310,107 320,97 330,107 340,97 340,140 240,140\" fill=\"#ced4da\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><line x1=\"270\" y1=\"18\" x2=\"310\" y2=\"18\" stroke=\"#1f2328\" stroke-width=\"2\" marker-end=\"url(#a)\"/><text x=\"262\" y=\"22\" text-anchor=\"end\" font-size=\"13\" fill=\"#1f2328\" font-weight=\"bold\">v</text><text x=\"290\" y=\"156\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\">v = 0</text><text x=\"290\" y=\"176\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">fluidno</text></svg>",
            "cap": "Suvo, mješovito i fluidno trenje",
            "p": [
              "Trenje između kliznih površina može biti suvo, mješovito i fluidno, to jest tečno.",
              "Kod suvog trenja površine se direktno dodiruju svojim neravninama. Kod mješovitog, mazivo djelimično razdvaja površine, ali se vrhovi neravnina još dodiruju. Kod fluidnog trenja sloj maziva potpuno razdvaja površine.",
              "Primjer: suvo trenje je kad trljaš suve dlanove, a fluidno kad su dlanovi puni sapunice, pa klize bez dodira."
            ]
          },
          {
            "h": "Podmazivanje",
            "p": [
              "Kod ležišta i vodica nije dozvoljeno trenje između suvih površina, pa se ležišta podmazuju.",
              "Podmazivanje je postupak kojim se uvođenjem maziva između površina koje su u relativnom kretanju smanjuje trenje i trošenje materijala."
            ]
          },
          {
            "h": "Tri osnovna vida podmazivanja",
            "p": [
              "Razlikuju se tri osnovna vida podmazivanja: podmazivanje potpunim slojem, granično podmazivanje i mješovito podmazivanje.",
              "Podmazivanje potpunim slojem može biti hidrostatičko, hidrodinamičko i elastohidrodinamičko. Kod hidrostatičkog pumpa ubacuje ulje pod pritiskom, a kod hidrodinamičkog samo okretanje rukavca uvlači ulje i stvara klin ulja koji podiže rukavac.",
              "Kod graničnog podmazivanja na površinama ostaje samo vrlo tanak sloj maziva, a mješovito je kombinacija graničnog i potpunog sloja.",
              "Primjer: hidrodinamičko podmazivanje liči na akvaplaning, kad se guma automobila na velikoj brzini podigne na sloj vode."
            ]
          }
        ],
        "key": [
          "Trenje između kliznih površina: suvo, mješovito, fluidno.",
          "Podmazivanje je postupak kojim se uvođenjem maziva između površina u relativnom kretanju smanjuje trenje i trošenje materijala.",
          "Tri vida: potpunim slojem, i to hidrostatičko, hidrodinamičko i elastohidrodinamičko; granično; mješovito."
        ]
      },
      {
        "id": "me-3-5",
        "module": "3. Ležišta i podmazivanje",
        "title": "Maziva i viskoznost",
        "summary": "Glavna karakteristika ulja je viskoznost, otpor klizanju između dva sloja ulja.",
        "sections": [
          {
            "h": "Čemu služe maziva",
            "p": [
              "Maziva služe za: smanjenje trenja i habanja; odvođenje toplote; prigušivanje šumova i udara; zaštitu od korozije; i odvođenje čestica koje se stvaraju habanjem.",
              "Primjer: motorno ulje vremenom pocrni, jer u njemu ostaju sitne čestice nastale habanjem, pa se mijenja."
            ]
          },
          {
            "h": "Vrste maziva",
            "p": [
              "Za podmazivanje ležišta koriste se: mineralna ulja, sintetička ulja, masti, grafit i emulzije ulja.",
              "Na izbor maziva utiču radni uslovi, to jest temperatura, broj obrtaja rukavca i prečnik rukavca, i način podmazivanja, to jest mazalicom, prstenom ili pod pritiskom.",
              "Primjer: ležaj točka se puni mašću, jer mast ostaje na mjestu, a mjenjač se puni uljem, koje lako teče do svih zupčanika."
            ]
          },
          {
            "h": "Viskoznost",
            "img": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 360 175\" font-family=\"Arial,Helvetica,sans-serif\" font-size=\"13\" fill=\"#1f2328\"><defs><marker id=\"a\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10z\" fill=\"context-stroke\"/></marker><pattern id=\"h\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#868e96\" stroke-width=\"1.6\"/></pattern><pattern id=\"h2\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(-45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#495057\" stroke-width=\"1.6\"/></pattern><pattern id=\"x\" patternUnits=\"userSpaceOnUse\" width=\"6\" height=\"6\"><rect width=\"6\" height=\"6\" fill=\"#ffe8cc\"/><path d=\"M0 0L6 6M6 0L0 6\" stroke=\"#e67700\" stroke-width=\"0.9\"/></pattern></defs><rect x=\"40\" y=\"20\" width=\"280\" height=\"12\" rx=\"0\" fill=\"#ced4da\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><line x1=\"150\" y1=\"10\" x2=\"230\" y2=\"10\" stroke=\"#1f2328\" stroke-width=\"2\" marker-end=\"url(#a)\"/><text x=\"240\" y=\"14\" text-anchor=\"start\" font-size=\"13\" fill=\"#1f2328\" font-weight=\"bold\">v</text><rect x=\"40\" y=\"34\" width=\"280\" height=\"18\" rx=\"0\" fill=\"#a5d8ff\" stroke=\"none\" stroke-width=\"0\"/><line x1=\"60\" y1=\"43\" x2=\"180\" y2=\"43\" stroke=\"#1c7ed6\" stroke-width=\"2\" marker-end=\"url(#a)\"/><rect x=\"40\" y=\"54\" width=\"280\" height=\"18\" rx=\"0\" fill=\"#d0ebff\" stroke=\"none\" stroke-width=\"0\"/><line x1=\"60\" y1=\"63\" x2=\"152\" y2=\"63\" stroke=\"#1c7ed6\" stroke-width=\"2\" marker-end=\"url(#a)\"/><rect x=\"40\" y=\"74\" width=\"280\" height=\"18\" rx=\"0\" fill=\"#a5d8ff\" stroke=\"none\" stroke-width=\"0\"/><line x1=\"60\" y1=\"83\" x2=\"124\" y2=\"83\" stroke=\"#1c7ed6\" stroke-width=\"2\" marker-end=\"url(#a)\"/><rect x=\"40\" y=\"94\" width=\"280\" height=\"18\" rx=\"0\" fill=\"#d0ebff\" stroke=\"none\" stroke-width=\"0\"/><line x1=\"60\" y1=\"103\" x2=\"96\" y2=\"103\" stroke=\"#1c7ed6\" stroke-width=\"2\" marker-end=\"url(#a)\"/><rect x=\"40\" y=\"114\" width=\"280\" height=\"18\" rx=\"0\" fill=\"#a5d8ff\" stroke=\"none\" stroke-width=\"0\"/><line x1=\"60\" y1=\"123\" x2=\"68\" y2=\"123\" stroke=\"#1c7ed6\" stroke-width=\"2\" marker-end=\"url(#a)\"/><rect x=\"40\" y=\"134\" width=\"280\" height=\"14\" rx=\"0\" fill=\"url(#h)\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><text x=\"326\" y=\"145\" text-anchor=\"start\" font-size=\"12\" fill=\"#1f2328\">v = 0</text><text x=\"180\" y=\"170\" text-anchor=\"middle\" font-size=\"11\" fill=\"#868e96\">otpor klizanju između slojeva ulja = viskoznost</text></svg>",
            "cap": "Slojevi ulja klize jedan preko drugog",
            "p": [
              "Glavna karakteristika ulja je viskoznost, koja predstavlja otpor klizanju koji se javlja između dva sloja ulja.",
              "Viskoznost može biti dinamička i kinematska.",
              "Viskoznost zavisi od temperature i pritiska. Kad se ulje zagrije postaje rjeđe, a pod većim pritiskom postaje gušće.",
              "Primjer: med je jako viskozan i teče sporo, a kad ga zagriješ, teče skoro kao voda."
            ]
          }
        ],
        "key": [
          "Maziva služe za smanjenje trenja i habanja, odvođenje toplote, prigušivanje šumova i udara, zaštitu od korozije, odvođenje čestica od habanja.",
          "Za ležišta se koriste mineralna ulja, sintetička ulja, masti, grafit, emulzije ulja.",
          "Viskoznost je otpor klizanju između dva sloja ulja.",
          "Viskoznost može biti dinamička i kinematska, i zavisi od temperature i pritiska."
        ]
      },
      {
        "id": "me-3-6",
        "module": "3. Ležišta i podmazivanje",
        "title": "Sistemi i uređaji za podmazivanje",
        "summary": "Podmazivanje može biti pojedinačno ili centralno, stalno ili periodično, slobodno ili prinudno.",
        "sections": [
          {
            "h": "Zadatak sistema za podmazivanje",
            "p": [
              "Sistem za podmazivanje treba da obezbijedi dovođenje do radnih površina potrebne količine maziva određene čistoće i viskoznosti.",
              "Na način dovođenja maziva u ležište utiču: učestanost obrtanja rukavca, opterećenje, radna temperatura i vrsta maziva.",
              "Podmazivanje može biti: pojedinačno ili centralno, stalno ili periodično, slobodno ili prinudno.",
              "Primjer: centralno podmazivanje na CNC mašini, gdje jedna pumpa sama povremeno šalje ulje do svih vodica."
            ]
          },
          {
            "h": "Podmazivanje uljima",
            "img": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 360 215\" font-family=\"Arial,Helvetica,sans-serif\" font-size=\"13\" fill=\"#1f2328\"><defs><marker id=\"a\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10z\" fill=\"context-stroke\"/></marker><pattern id=\"h\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#868e96\" stroke-width=\"1.6\"/></pattern><pattern id=\"h2\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(-45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#495057\" stroke-width=\"1.6\"/></pattern><pattern id=\"x\" patternUnits=\"userSpaceOnUse\" width=\"6\" height=\"6\"><rect width=\"6\" height=\"6\" fill=\"#ffe8cc\"/><path d=\"M0 0L6 6M6 0L0 6\" stroke=\"#e67700\" stroke-width=\"0.9\"/></pattern></defs><text x=\"95\" y=\"20\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">podmazivanje prstenom</text><rect x=\"20\" y=\"40\" width=\"150\" height=\"150\" rx=\"10\" fill=\"none\" stroke=\"#1f2328\" stroke-width=\"3\"/><rect x=\"23\" y=\"150\" width=\"144\" height=\"37\" rx=\"0\" fill=\"#a5d8ff\" stroke=\"none\" stroke-width=\"0\"/><circle cx=\"95\" cy=\"106\" r=\"48\" fill=\"none\" stroke=\"#d9480f\" stroke-width=\"4\"/><circle cx=\"95\" cy=\"80\" r=\"22\" fill=\"#adb5bd\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><path d=\"M80 62 A20 20 0 0 1 110 62\" fill=\"none\" stroke=\"#1f2328\" stroke-width=\"1.5\" marker-end=\"url(#a)\"/><text x=\"150\" y=\"120\" text-anchor=\"start\" font-size=\"11\" fill=\"#d9480f\" font-weight=\"bold\">prsten</text><text x=\"60\" y=\"175\" text-anchor=\"middle\" font-size=\"11\" fill=\"#1c7ed6\">ulje</text><text x=\"270\" y=\"20\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">mazalica sa fitiljem</text><rect x=\"225\" y=\"40\" width=\"90\" height=\"90\" rx=\"6\" fill=\"none\" stroke=\"#1f2328\" stroke-width=\"2\"/><rect x=\"228\" y=\"70\" width=\"84\" height=\"57\" rx=\"0\" fill=\"#a5d8ff\" stroke=\"none\" stroke-width=\"0\"/><rect x=\"262\" y=\"130\" width=\"16\" height=\"30\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><path d=\"M250 122 C250 45 270 40 270 62 L270 160\" fill=\"none\" stroke=\"#e67700\" stroke-width=\"5\"/><circle cx=\"270\" cy=\"176\" r=\"4\" fill=\"#1c7ed6\" stroke=\"#1c7ed6\" stroke-width=\"1\"/><text x=\"322\" y=\"60\" text-anchor=\"start\" font-size=\"11\" fill=\"#e67700\" font-weight=\"bold\">fitilj</text><line x1=\"320\" y1=\"57\" x2=\"275\" y2=\"62\" stroke=\"#e67700\" stroke-width=\"1\"/></svg>",
            "cap": "Podmazivanje prstenom i mazalica sa fitiljem",
            "p": [
              "Podmazivanje ležišta uljem može biti pojedinačno, centralno i raspršivanjem.",
              "Pojedinačno se izvodi: pomoću prstena, mazalicom sa fitiljem, mazalicom sa jastukom, mazalicom sa iglom i mazalicom sa ventilom.",
              "Kod podmazivanja prstenom slobodan prsten visi na rukavcu, a donjim dijelom je u ulju. Kad se vratilo okreće, okreće se i prsten i nosi ulje na rukavac. Kod mazalice sa fitiljem ulje se penje kroz fitilj i kaplje u ležište.",
              "Centralno podmazivanje uljem izvodi se zupčastim pumpama, a kod raspršivanja ulje dolazi do ležišta kao sitna magla.",
              "Primjer: fitilj radi isto kao fitilj u petrolejskoj lampi, sam upija i podiže tečnost."
            ]
          },
          {
            "h": "Podmazivanje mastima",
            "img": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 360 200\" font-family=\"Arial,Helvetica,sans-serif\" font-size=\"13\" fill=\"#1f2328\"><defs><marker id=\"a\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10z\" fill=\"context-stroke\"/></marker><pattern id=\"h\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#868e96\" stroke-width=\"1.6\"/></pattern><pattern id=\"h2\" patternUnits=\"userSpaceOnUse\" width=\"7\" height=\"7\" patternTransform=\"rotate(-45)\"><rect width=\"7\" height=\"7\" fill=\"#fff\"/><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"7\" stroke=\"#495057\" stroke-width=\"1.6\"/></pattern><pattern id=\"x\" patternUnits=\"userSpaceOnUse\" width=\"6\" height=\"6\"><rect width=\"6\" height=\"6\" fill=\"#ffe8cc\"/><path d=\"M0 0L6 6M6 0L0 6\" stroke=\"#e67700\" stroke-width=\"0.9\"/></pattern></defs><rect x=\"120\" y=\"20\" width=\"120\" height=\"60\" rx=\"8\" fill=\"#dee2e6\" stroke=\"#1f2328\" stroke-width=\"2\"/><line x1=\"126\" y1=\"20\" x2=\"126\" y2=\"30\" stroke=\"#1f2328\" stroke-width=\"1\"/><line x1=\"138\" y1=\"20\" x2=\"138\" y2=\"30\" stroke=\"#1f2328\" stroke-width=\"1\"/><line x1=\"150\" y1=\"20\" x2=\"150\" y2=\"30\" stroke=\"#1f2328\" stroke-width=\"1\"/><line x1=\"162\" y1=\"20\" x2=\"162\" y2=\"30\" stroke=\"#1f2328\" stroke-width=\"1\"/><line x1=\"174\" y1=\"20\" x2=\"174\" y2=\"30\" stroke=\"#1f2328\" stroke-width=\"1\"/><line x1=\"186\" y1=\"20\" x2=\"186\" y2=\"30\" stroke=\"#1f2328\" stroke-width=\"1\"/><line x1=\"198\" y1=\"20\" x2=\"198\" y2=\"30\" stroke=\"#1f2328\" stroke-width=\"1\"/><line x1=\"210\" y1=\"20\" x2=\"210\" y2=\"30\" stroke=\"#1f2328\" stroke-width=\"1\"/><line x1=\"222\" y1=\"20\" x2=\"222\" y2=\"30\" stroke=\"#1f2328\" stroke-width=\"1\"/><line x1=\"234\" y1=\"20\" x2=\"234\" y2=\"30\" stroke=\"#1f2328\" stroke-width=\"1\"/><rect x=\"132\" y=\"38\" width=\"96\" height=\"38\" rx=\"0\" fill=\"#f2d16b\" stroke=\"none\" stroke-width=\"0\"/><text x=\"180\" y=\"62\" text-anchor=\"middle\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">mast</text><rect x=\"140\" y=\"80\" width=\"80\" height=\"30\" rx=\"0\" fill=\"#f2d16b\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><path d=\"M140 110 L220 110 L195 130 L165 130 Z\" fill=\"#f2d16b\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"172\" y=\"130\" width=\"16\" height=\"30\" rx=\"0\" fill=\"#e9ecef\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><line x1=\"172\" y1=\"134\" x2=\"188\" y2=\"138\" stroke=\"#1f2328\" stroke-width=\"1\"/><line x1=\"172\" y1=\"140\" x2=\"188\" y2=\"144\" stroke=\"#1f2328\" stroke-width=\"1\"/><line x1=\"172\" y1=\"146\" x2=\"188\" y2=\"150\" stroke=\"#1f2328\" stroke-width=\"1\"/><line x1=\"172\" y1=\"152\" x2=\"188\" y2=\"156\" stroke=\"#1f2328\" stroke-width=\"1\"/><rect x=\"60\" y=\"160\" width=\"240\" height=\"30\" rx=\"0\" fill=\"url(#h)\" stroke=\"#1f2328\" stroke-width=\"1.5\"/><rect x=\"176\" y=\"160\" width=\"8\" height=\"30\" rx=\"0\" fill=\"#f2d16b\" stroke=\"none\" stroke-width=\"0\"/><path d=\"M252 30 A24 24 0 0 1 252 72\" fill=\"none\" stroke=\"#1c7ed6\" stroke-width=\"2\" marker-end=\"url(#a)\"/><text x=\"282\" y=\"56\" text-anchor=\"start\" font-size=\"12\" fill=\"#1c7ed6\" font-weight=\"bold\">zavrni</text><text x=\"110\" y=\"45\" text-anchor=\"end\" font-size=\"12\" fill=\"#1f2328\" font-weight=\"bold\">poklopac</text><line x1=\"300\" y1=\"150\" x2=\"188\" y2=\"172\" stroke=\"#1f2328\" stroke-width=\"1\"/><text x=\"304\" y=\"148\" text-anchor=\"start\" font-size=\"11\" fill=\"#1f2328\">ka ležištu</text></svg>",
            "cap": "Štauferova mazalica",
            "p": [
              "Podmazivanje mastima može biti pojedinačno i centralno.",
              "Pojedinačno se izvodi Štauferovom mazalicom, mazalicom s kuglom, mazalicom sa vijkom, mazalicom sa oprugom i mazalicom sa komorom.",
              "Štauferova mazalica je čašica napunjena mašću, sa poklopcem na navoj. Kad se poklopac zavrne, potisne mast kroz kanal u ležište.",
              "Primjer: mazalica s kuglom je mala bradavica na zglobovima poljoprivrednih mašina, u koju se mast utiskuje pištoljem za podmazivanje."
            ]
          }
        ],
        "key": [
          "Na način dovođenja maziva utiču učestanost obrtanja rukavca, opterećenje, radna temperatura i vrsta maziva.",
          "Podmazivanje može biti pojedinačno ili centralno, stalno ili periodično, slobodno ili prinudno.",
          "Uljem pojedinačno: prstenom, mazalicom sa fitiljem, sa jastukom, sa iglom, sa ventilom.",
          "Uljem centralno: zupčaste pumpe; i raspršivanje."
        ]
      }
    ]
  }
]);
