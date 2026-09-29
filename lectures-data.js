// Lecture content for the Predavanja tab.
//
// Filled in from photos of the student's own notebook — each entry is one
// subject, with its lessons in the order the plan teaches them. The player
// reads `title`, `summary`, every section and the `key` points aloud.
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
    id: "termodinamika", subject: "Termodinamika", icon: "🔥", order: 2,
    lessons: [
      {
        id: "tmd-1-1",
        module: "1. Osnovni pojmovi",
        title: "Šta je termodinamika",
        summary: "Termodinamika izučava pretvaranje toplotne energije u druge oblike energije i obratno.",
        sections: [
          { h: "Naziv", p: ["Riječ dolazi od grčkog thermos, što znači toplota, i dynamics, što znači kretanje tijela uzimajući u obzir uzroke tog kretanja.", "Toplota je energija. Temperatura je fizička veličina."] },
          { h: "Tehnička termodinamika", p: ["Tehnička termodinamika opisuje i proučava procese uzajamnog pretvaranja toplote u mehaničku energiju i obratno.", "Ona je osnov za razumijevanje rada toplotnih mašina i uređaja: parnih kotlova i turbina, SUS motora, rashladnih i klima uređaja, i procesa prostiranja toplote."] },
          { h: "Prvi i drugi zakon", p: ["Osnovni zakon termodinamike proučava odnose između toplotne i mehaničke energije, kao i mogućnost pretvaranja toplotne energije u mehaničku.", "Pri tome se teži da se ostvari što veći korisni efekat."] }
        ],
        key: ["Termodinamika izučava pretvaranje toplotne energije u druge oblike energije i obratno.", "Toplota je energija, a temperatura je fizička veličina.", "Primjeri primjene: parni kotlovi i turbine, SUS motori, rashladni i klima uređaji."]
      },
      {
        id: "tmd-1-2",
        module: "1. Osnovni pojmovi",
        title: "Termodinamički sistem",
        summary: "Sistem je određena količina materije ograničena zatvorenom površinom, to jest granicom.",
        sections: [
          { h: "Sistem, granica i okolina", p: ["Pod pojmom sistema podrazumijeva se određena količina materije ograničena nekom zatvorenom površinom, to jest granicom.", "Sve što nije uključeno u dati sistem čini okolinu sistema.", "Sistem na kome se posmatraju termodinamičke promjene naziva se termodinamički sistem. Kroz granicu se mogu razmjenjivati masa i energija."] },
          { h: "Vrste sistema", p: ["Otvoren sistem razmjenjuje sa okolinom i masu i energiju.", "Zatvoren sistem ima granicu koja ne propušta masu.", "Adijabatski sistem ne razmjenjuje toplotu sa okolinom.", "Dijabatski sistem razmjenjuje toplotu sa okolinom."] }
        ],
        key: ["Otvoren sistem: prolaze i masa i energija.", "Zatvoren sistem: ne prolazi masa.", "Adijabatski: nema razmjene toplote. Dijabatski: ima razmjene toplote."]
      },
      {
        id: "tmd-1-3",
        module: "1. Osnovni pojmovi",
        title: "Nulti zakon i termodinamička ravnoteža",
        summary: "Toplota uvijek sama od sebe prelazi sa tijela više temperature na tijelo niže temperature.",
        sections: [
          { h: "Nulti zakon termodinamike", p: ["Ako se dva sistema različitih toplotnih stanja dovedu u međusobnu vezu, toplota će se razmjenjivati kroz granicu sve dok temperature svih dijelova sistema ne budu jednake.", "Pri tome toplota uvijek sama od sebe prelazi sa tijela više temperature na tijelo niže temperature. Ako je T A veće od T B, toplota ide od A ka B."] },
          { h: "Termodinamička ravnoteža", p: ["Za postojanje termodinamičke ravnoteže neophodno je da u svim dijelovima sistema postoji mehanička, termička i hemijska ravnoteža.", "Mehanička ravnoteža je postignuta ako je zbir svih sila u sistemu jednak nuli.", "Termička ravnoteža je uspostavljena kada svi dijelovi sistema imaju jednaku temperaturu.", "Hemijska ravnoteža postoji kada je hemijski potencijal jednak u svim dijelovima sistema."] }
        ],
        key: ["Nulti zakon: toplota ide sa toplijeg na hladnije tijelo dok se temperature ne izjednače.", "Termodinamička ravnoteža je mehanička, plus termička, plus hemijska ravnoteža.", "Mehanička: zbir sila je nula. Termička: ista temperatura. Hemijska: isti hemijski potencijal."]
      },
      {
        id: "tmd-1-4",
        module: "1. Osnovni pojmovi",
        title: "Veličine stanja i pritisak",
        summary: "Stanje termodinamičkog sistema definiše se jednačinom f od p, v, T jednako nula.",
        sections: [
          { h: "Veličine stanja", p: ["Fizičke veličine čija vrijednost određuje stanje sistema nazivaju se termičkim veličinama stanja. Neke se mjere direktno, a druge se izvode pomoću matematičke zavisnosti.", "Ekstenzivne veličine zavise od mase: masa, zapremina, površina, unutrašnja energija.", "Intenzivne veličine ne zavise od mase: pritisak i temperatura."] },
          { h: "Jedinice pritiska", p: ["Jedan bar je deset na peti paskala, to jest sto hiljada paskala.", "Jedna fizička atmosfera je sto jedna hiljada tristo dvadeset pet paskala, što je oko hiljadu trinaest milibara.", "Jedna tehnička atmosfera je devet zapeta osam nula sedam puta deset na četvrti paskala."] },
          { h: "Atmosferski, nadpritisak i podpritisak", p: ["Pritisak kojim vazduh djeluje na površinu zemlje naziva se atmosferski ili barometarski pritisak, p b. On zavisi od visine i vremenskih prilika, i opada sa porastom nadmorske visine.", "Višak pritiska iznad atmosferskog zove se nadpritisak, p m. Tada je apsolutni pritisak p a jednak p b plus p m.", "Manjak pritiska ispod atmosferskog zove se podpritisak ili vakuum, p v. Tada je apsolutni pritisak p a jednak p b minus p v."] }
        ],
        key: ["Stanje sistema: f od p, v, T jednako nula.", "Ekstenzivne zavise od mase, intenzivne ne zavise.", "Nadpritisak: p a jednako p b plus p m. Podpritisak: p a jednako p b minus p v.", "Jedan bar je sto hiljada paskala."]
      },
      {
        id: "tmd-1-5",
        module: "1. Osnovni pojmovi",
        title: "Masa, gustina i specifična zapremina",
        summary: "Specifična zapremina je zapremina podijeljena masom, a gustina je njena recipročna vrijednost.",
        sections: [
          { h: "Masa i težina", p: ["Masa sistema je količina materije tog sistema. Određuje se vaganjem, upoređivanjem sa poznatom masom tegova. Jedinica je kilogram.", "Težina je sila kojom zemlja privlači tijelo: G jednako m puta g. Jedinica težine je ista kao jedinica sile, njutn."] },
          { h: "Zapremina, specifična zapremina i gustina", p: ["Pokazatelj količine materije je i zapremina V, u kubnim metrima.", "Specifična zapremina je odnos zapremine i mase: v jednako V kroz m, u kubnim metrima po kilogramu.", "Gustina je recipročna vrijednost specifične zapremine: ro jednako jedan kroz v, jednako m kroz V, u kilogramima po kubnom metru."] }
        ],
        key: ["G jednako m puta g.", "Specifična zapremina: v jednako V kroz m, kubni metar po kilogramu.", "Gustina: ro jednako m kroz V jednako jedan kroz v, kilogram po kubnom metru."]
      }
    ]
  }
]);
