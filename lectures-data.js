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
  }
]);
