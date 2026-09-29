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
//       sections: [{ h: "Naslov dijela", p: ["Pasus.", "Pasus."] }],
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
              "Riječ dolazi od dvije grčke riječi. Thermos znači toplota. Dynamics znači kretanje tijela, uzimajući u obzir uzroke tog kretanja.",
              "Zajedno to znači toplota koja pokreće. Najbolja slika je stara parna lokomotiva: ugalj gori, toplota pravi paru, a para gura klipove i pokreće cijeli voz."
            ]
          },
          {
            "h": "Toplota nije isto što i temperatura",
            "p": [
              "Toplota je energija. To je energija koja prelazi sa jednog tijela na drugo.",
              "Temperatura je fizička veličina. Ona pokazuje koliko je tijelo toplo, to je broj koji vidiš na termometru.",
              "Primjer: šolja ključale vode ima sto stepeni, a puna kada tople vode ima samo četrdeset. Šolja ima veću temperaturu, ali kada ima mnogo više toplote, jer ima mnogo više vode. Kadom bi otopio mnogo više leda nego šoljom.",
              "Isto je sa varnicom od brusilice. Ima preko hiljadu stepeni, a ne opeče ruku, jer je sićušna i nosi jako malo toplote."
            ]
          },
          {
            "h": "Šta termodinamika izučava",
            "p": [
              "Termodinamika izučava pojave vezane za pretvaranje toplotne energije u druge oblike energije i obratno.",
              "Toplota u rad: u motoru automobila gorivo sagori, gasovi se zagriju, šire se i guraju klip. Klip okreće radilicu, a ona točkove.",
              "Rad u toplotu: kada zimi trljaš ruke, one se zagriju. Kada auto koči, kočioni diskovi se toliko zagriju da mogu da se usijaju. Tu se kretanje pretvorilo u toplotu."
            ]
          },
          {
            "h": "Tehnička termodinamika",
            "p": [
              "Tehnička termodinamika opisuje i proučava procese uzajamnog pretvaranja toplote u mehaničku energiju i obratno. Ona je osnov za razumijevanje rada toplotnih mašina i uređaja.",
              "Termoelektrana: u parnom kotlu gori ugalj, voda postaje para, para vrti turbinu, a turbina vrti generator koji pravi struju.",
              "SUS motor, to jest motor sa unutrašnjim sagorijevanjem, kakav je u svakom autu.",
              "Frižider i klima uređaj rade obrnuto: troše rad da izbace toplotu napolje. Zato je rešetka iza frižidera topla, tuda izlazi toplota izvučena iz hrane.",
              "Tu spada i prostiranje toplote, na primjer kako radijator grije sobu."
            ]
          },
          {
            "h": "Prvi i drugi zakon",
            "p": [
              "Osnovni zakon termodinamike proučava odnose između toplotne i mehaničke energije, kao i mogućnost pretvaranja toplotne energije u mehaničku. Pri tome se teži da se ostvari što veći korisni efekat.",
              "Prvi zakon, kao dodatno objašnjenje: energija se ne može ni stvoriti ni uništiti, može samo da pređe iz jednog oblika u drugi. Kao kad mijenjaš novac u drugu valutu, oblik se promijeni, ali vrijednost ostaje.",
              "Drugi zakon, kao dodatno objašnjenje: nikada se sva toplota ne može pretvoriti u rad, dio uvijek ode u okolinu. Zato je motor auta vruć. Samo oko trećine energije goriva stigne do točkova, ostatak ode kroz auspuh i hladnjak.",
              "Zato se kaže da se teži što većem korisnom efektu: želimo da što manje energije propadne kao otpadna toplota."
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
            "p": [
              "Pod pojmom sistema podrazumijeva se određena količina materije ograničena nekom zatvorenom površinom, to jest granicom. Sve što nije uključeno u sistem čini okolinu sistema.",
              "Zamisli da olovkom zaokružiš ono što želiš da posmatraš. Ono unutar kruga je sistem, linija kruga je granica, a sve van kruga je okolina. Upravo to je crtež u svesci: elipsa u kojoj je masa m i veličine p, V i T.",
              "Primjer: gas zatvoren u cilindru motora je sistem. Zidovi cilindra i klip su granica. Motor i vazduh oko njega su okolina.",
              "Sistem na kome se posmatraju termodinamičke promjene zove se termodinamički sistem. Kroz granicu se mogu razmjenjivati masa i energija, ali postoje i sistemi kod kojih razmjena nije moguća."
            ]
          },
          {
            "h": "Otvoren sistem",
            "p": [
              "Otvoren sistem sa okolinom razmjenjuje i masu i energiju.",
              "Lonac bez poklopca na šporetu: toplota ulazi sa ringle, a para izlazi napolje. Prolaze i energija i materija.",
              "Motor automobila: usisava vazduh i gorivo, a izbacuje izduvne gasove. I ljudsko tijelo je otvoren sistem, jedemo, dišemo i odajemo toplotu."
            ]
          },
          {
            "h": "Zatvoren sistem",
            "p": [
              "Zatvoren sistem ima granicu koja ne propušta masu, ali energija može da prođe.",
              "Ekspres lonac sa zaključanim poklopcem: toplota ulazi sa ringle, ali voda i para ostaju unutra.",
              "Napumpana lopta na suncu: vazduh ne izlazi, ali se zagrijava od sunca."
            ]
          },
          {
            "h": "Adijabatski i dijabatski sistem",
            "p": [
              "Adijabatski sistem ne razmjenjuje toplotu sa okolinom.",
              "Najbolji primjer je termos boca. Čaj u njoj ostaje topao satima jer toplota skoro ne prolazi kroz zidove. Isto važi za rashladnu torbu na plaži.",
              "Dijabatski sistem razmjenjuje toplotu sa okolinom. Obična metalna šolja je dijabatska: čaj u njoj se brzo ohladi jer toplota lako izlazi.",
              "Trik za pamćenje: otvoren i zatvoren se odnose na masu. Adijabatski i dijabatski se odnose na toplotu. Slovo a na početku znači ne, kao u riječi asimetričan, pa adijabatski znači ne propušta toplotu."
            ]
          }
        ],
        "key": [
          "Sistem je materija ograničena granicom, sve van nje je okolina.",
          "Otvoren sistem: prolaze i masa i energija, kao lonac bez poklopca.",
          "Zatvoren sistem: masa ne prolazi, energija da, kao ekspres lonac.",
          "Adijabatski: nema razmjene toplote, kao termos. Dijabatski: ima razmjene toplote, kao obična šolja."
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
            "p": [
              "Ako se dva sistema različitih toplotnih stanja dovedu u međusobnu vezu, toplota će se razmjenjivati kroz granicu sve dok temperature svih dijelova sistema ne budu jednake. Pri tome toplota uvijek sama od sebe prelazi sa tijela više temperature na tijelo niže temperature.",
              "Na crtežu u svesci tijelo A je toplije od tijela B, pa toplota ide od A ka B."
            ]
          },
          {
            "h": "Primjeri iz života",
            "p": [
              "Kafa ostavljena na stolu se hladi dok ne dostigne temperaturu sobe. Sok izvađen iz frižidera se grije do temperature sobe. Nikada se kafa sama od sebe ne ugrije još više od hladnije sobe.",
              "Toplota se ponaša kao voda koja teče niz brdo: uvijek ide sa višeg na niže, i stane tek kada se nivoi izjednače.",
              "Termometar radi upravo zbog ovog zakona. Držiš ga pod pazuhom par minuta, dok se njegova temperatura ne izjednači sa tvojom, i tek onda pokazuje tačnu vrijednost.",
              "Dodatno, u knjigama se nulti zakon često piše i ovako: ako su dva tijela svako za sebe u ravnoteži sa trećim tijelom, onda su u ravnoteži i međusobno. Treće tijelo je obično termometar."
            ]
          },
          {
            "h": "Termodinamička ravnoteža",
            "p": [
              "Za postojanje termodinamičke ravnoteže neophodno je da u svim dijelovima sistema postoji mehanička, termička i hemijska ravnoteža. Kada su ispunjena sva tri uslova, u sistemu se ništa više ne mijenja samo od sebe."
            ]
          },
          {
            "h": "Mehanička ravnoteža",
            "p": [
              "Mehanička ravnoteža je postignuta ako je zbir svih sila u sistemu jednak nuli.",
              "Kao natezanje konopca: kada obje ekipe vuku jednako jako, konopac stoji u mjestu. Ili klip u cilindru, koji miruje kada gas iznutra gura jednako jako kao pritisak spolja."
            ]
          },
          {
            "h": "Termička ravnoteža",
            "p": [
              "Termička ravnoteža je uspostavljena kada svi dijelovi sistema imaju jednaku temperaturu.",
              "Kao kafa koja se potpuno ohladila na temperaturu sobe. Više nema razlike, pa toplota više ne teče."
            ]
          },
          {
            "h": "Hemijska ravnoteža",
            "p": [
              "Hemijska ravnoteža postoji kada je hemijski potencijal jednak u svim dijelovima sistema.",
              "Hemijski potencijal možeš zamisliti kao težnju neke supstance da se premjesti ili reaguje. Kada staviš šećer u čaj, on se rastapa i širi. Kada se potpuno rastopi i svuda je čaj jednako sladak, šećer više nema kuda, i to je hemijska ravnoteža."
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
              "Stanje nekog termodinamičkog sistema definiše se jednačinom f od p, v, T jednako nula. To znači da su pritisak, specifična zapremina i temperatura međusobno povezani.",
              "Ako znaš dvije od te tri veličine, treća je određena. To je kao lična karta sistema.",
              "Primjer: guma automobila. Kada auto stoji ljeti na suncu, vazduh u gumi se zagrije, i pritisak u gumi poraste. Temperatura se promijenila, pa se promijenio i pritisak."
            ]
          },
          {
            "h": "Termičke veličine stanja",
            "p": [
              "Fizičke veličine čija vrijednost određuje stanje sistema nazivaju se termičkim veličinama stanja.",
              "Neke od njih su direktno mjerljive: pritisak mjerimo manometrom, temperaturu termometrom. Druge se izvode pomoću matematičke zavisnosti, na primjer unutrašnja energija."
            ]
          },
          {
            "h": "Ekstenzivne i intenzivne veličine",
            "p": [
              "Ekstenzivne veličine stanja su masa i sve veličine koje zavise od mase: zapremina, površina, unutrašnja energija.",
              "Intenzivne veličine su one koje ne zavise od mase sistema: pritisak, temperatura.",
              "Test da ih razlikuješ: prepolovi sistem. Imaš flašu od dva litra vode na dvadeset stepeni. Presipaš pola u čašu. U čaši je sada litar, a masa je pola, znači zapremina i masa su ekstenzivne. Ali voda u čaši je i dalje na dvadeset stepeni, znači temperatura je intenzivna.",
              "Kao pica: ako je prepoloviš, prepolovi se težina i cijena, ali ukus i toplina parčeta ostaju isti."
            ]
          }
        ],
        "key": [
          "Stanje sistema: f od p, v, T jednako nula. Dvije veličine određuju treću.",
          "Ekstenzivne veličine zavise od mase: masa, zapremina, površina, unutrašnja energija.",
          "Intenzivne veličine ne zavise od mase: pritisak, temperatura.",
          "Test: prepolovi sistem. Ekstenzivna se prepolovi, intenzivna ostaje ista."
        ]
      },
      {
        "id": "tmd-1-5",
        "module": "1. Osnovni pojmovi",
        "title": "Pritisak",
        "summary": "Apsolutni pritisak je atmosferski plus nadpritisak, ili atmosferski minus podpritisak.",
        "sections": [
          {
            "h": "Šta je pritisak",
            "p": [
              "Pritisak je sila koja djeluje na jednu površinu. Računa se kao sila podijeljena površinom, a jedinica je paskal, to jest njutn po kvadratnom metru. Ovo je dodatno objašnjenje.",
              "Zato oštar nož reže, a tupi ne: ista sila na manju površinu daje veći pritisak. Zato štikla probije pod, a patika ne. I zato skije ne propadaju u snijeg, sila je razvučena na veliku površinu."
            ]
          },
          {
            "h": "Jedinice pritiska",
            "p": [
              "Jedan bar je deset na peti paskala, to jest sto hiljada paskala.",
              "Jedna fizička atmosfera je sto jedna hiljada tristo dvadeset pet paskala, što je oko hiljadu trinaest milibara. To je normalan pritisak vazduha na nivou mora, i skoro je jednak jednom baru.",
              "Jedna tehnička atmosfera je devet zapeta osam nula sedam puta deset na četvrti paskala.",
              "Jedan paskal je jako mali pritisak, otprilike kao list papira koji leži na stolu. Zato se u tehnici najčešće koristi bar."
            ]
          },
          {
            "h": "Atmosferski pritisak",
            "p": [
              "Pritisak kojim vazduh djeluje na površinu zemlje naziva se atmosferski ili barometarski pritisak, p b. Mjeri se barometrom.",
              "Mi živimo na dnu okeana vazduha. Sav vazduh iznad nas ima težinu i pritiska nas odozgo.",
              "Atmosferski pritisak zavisi od visine i od vremenskih prilika. Sa porastom nadmorske visine opada, jer je iznad tebe manje vazduha.",
              "Zato ti pucaju uši kada se voziš na planinu ili letiš avionom. Zato se kesica čipsa napuše na planini. I zato na visokim planinama voda ključa na nižoj temperaturi od sto stepeni."
            ]
          },
          {
            "h": "Nadpritisak",
            "p": [
              "Višak pritiska iznad atmosferskog zove se nadpritisak, p m. Mjeri se manometrom.",
              "Apsolutni pritisak je tada p a jednako p b plus p m.",
              "Primjer: kada na pumpi izmjeriš gumu i piše dva bara, to je nadpritisak. Pravi, apsolutni pritisak u gumi je oko tri bara, jer se dodaje i jedan bar atmosferskog. Nadpritisak je i u ekspres loncu i u flaši gaziranog soka, zato šišti kada je otvoriš."
            ]
          },
          {
            "h": "Podpritisak ili vakuum",
            "p": [
              "Manjak pritiska ispod atmosferskog zove se podpritisak ili vakuum, p v.",
              "Apsolutni pritisak je tada p a jednako p b minus p v.",
              "Primjer: kada piješ na slamku, smanjiš pritisak u ustima. Atmosferski pritisak spolja tada gura sok uz slamku. Isti princip koriste usisivač, vantuz koji se zalijepi za pločice, i vakuum pakovanje kafe, koje je tvrdo jer vazduh spolja pritiska kesu.",
              "Apsolutni pritisak nikada ne može biti manji od nule. Nula je potpuni vakuum, gdje nema ničega."
            ]
          },
          {
            "h": "Dijagram iz sveske",
            "p": [
              "Na dnu dijagrama je nula, potpuni vakuum. Iznad nje je linija atmosferskog pritiska p b.",
              "Iznad linije p b je oblast nadpritiska: apsolutni pritisak je p b plus p m.",
              "Ispod linije p b je oblast podpritiska: apsolutni pritisak je p b minus p v.",
              "Primjer računa: atmosferski pritisak je jedan bar, manometar pokazuje dva bara, pa je apsolutni pritisak tri bara. Ako vakuummetar pokazuje nula zapeta tri bara, apsolutni pritisak je nula zapeta sedam bara."
            ]
          }
        ],
        "key": [
          "Jedan bar je sto hiljada paskala. Jedna fizička atmosfera je sto jedna hiljada tristo dvadeset pet paskala.",
          "Atmosferski pritisak p b opada sa porastom nadmorske visine.",
          "Nadpritisak: p a jednako p b plus p m, kao guma automobila.",
          "Podpritisak: p a jednako p b minus p v, kao slamka ili usisivač."
        ]
      },
      {
        "id": "tmd-1-6",
        "module": "1. Osnovni pojmovi",
        "title": "Masa, težina, gustina i specifična zapremina",
        "summary": "Specifična zapremina je zapremina podijeljena masom, a gustina je njena recipročna vrijednost.",
        "sections": [
          {
            "h": "Masa",
            "p": [
              "Masa nekog sistema je količina materije tog sistema. Određuje se vaganjem, to jest upoređivanjem mase tijela sa poznatom masom tegova, kao na staroj vagi na pijaci. Jedinica mase je kilogram.",
              "Masa je ista gdje god da se nalaziš, i na Zemlji i na Mjesecu."
            ]
          },
          {
            "h": "Težina",
            "p": [
              "Težina je sila kojom Zemlja privlači neko tijelo: G jednako m puta g, gdje je g ubrzanje zemljine teže, oko devet zapeta osamdeset jedan metar u sekundi na kvadrat. Jedinice težine su iste kao jedinice sile, to je njutn.",
              "Primjer: astronaut ima osamdeset kilograma. Na Zemlji njegova težina je oko sedamsto osamdeset pet njutna. Na Mjesecu je šest puta manja, oko sto trideset njutna, zato tamo skakuće. Ali njegova masa je i dalje osamdeset kilograma."
            ]
          },
          {
            "h": "Zapremina",
            "p": [
              "Pokazatelj količine materije nekog sistema je i zapremina V tog sistema, u kubnim metrima. Jedan kubni metar je hiljadu litara."
            ]
          },
          {
            "h": "Specifična zapremina",
            "p": [
              "Odnos ukupne zapremine sistema i mase je specifična zapremina: v jednako V kroz m, u kubnim metrima po kilogramu.",
              "Ona govori koliko prostora zauzima jedan kilogram materije.",
              "Staro pitanje: šta je teže, kilogram perja ili kilogram olova? Isto su teški. Ali kilogram perja zauzima ogromnu vreću, a kilogram olova stane u šaku. Perje ima veliku specifičnu zapreminu, a olovo malu.",
              "Kilogram vode je jedan litar, pa voda ima specifičnu zapreminu nula zapeta nula nula jedan kubni metar po kilogramu. Kilogram vazduha zauzima oko nula zapeta osamdeset tri kubna metra."
            ]
          },
          {
            "h": "Gustina",
            "p": [
              "Recipročna vrijednost specifične zapremine je gustina: ro jednako jedan kroz v, jednako m kroz V, u kilogramima po kubnom metru.",
              "Gustina govori koliko kilograma stane u jedan kubni metar. Voda ima hiljadu kilograma po kubnom metru, čelik oko sedam hiljada osamsto pedeset, a vazduh samo oko jedan zapeta dva.",
              "Zato ulje pliva na vodi, ima manju gustinu. A kamen tone, ima veću.",
              "Recipročno znači: što je jedna veća, druga je manja. Veliko pakovanje perja ima malu gustinu i veliku specifičnu zapreminu."
            ]
          },
          {
            "h": "Primjer zadatka",
            "p": [
              "U posudi zapremine dva kubna metra nalazi se četiri kilograma gasa.",
              "Specifična zapremina je dva kroz četiri, to jest nula zapeta pet kubnih metara po kilogramu.",
              "Gustina je četiri kroz dva, to jest dva kilograma po kubnom metru. Provjera: jedan kroz nula zapeta pet je dva, tačno."
            ]
          }
        ],
        "key": [
          "Masa je količina materije, u kilogramima, i ista je svuda.",
          "Težina je sila: G jednako m puta g, u njutnima.",
          "Specifična zapremina: v jednako V kroz m, kubni metar po kilogramu.",
          "Gustina: ro jednako m kroz V jednako jedan kroz v, kilogram po kubnom metru."
        ]
      }
    ]
  }
]);
