// Bilingual content data: materials, G-codes/M-codes, curriculum, resources.

const MATERIALS = {
  aluminum:  { label: { sr: "Aluminijum (6061)", en: "Aluminum (6061)" }, vc: 300, feedFactor: 1.3 },
  brass:     { label: { sr: "Mesing", en: "Brass" }, vc: 150, feedFactor: 1.1 },
  mildsteel: { label: { sr: "Meki čelik (S235/1018)", en: "Mild Steel (S235/1018)" }, vc: 120, feedFactor: 1.0 },
  stainless: { label: { sr: "Nerđajući čelik (304)", en: "Stainless Steel (304)" }, vc: 60, feedFactor: 0.7 },
  toolsteel: { label: { sr: "Alatni čelik (predkaljeni)", en: "Tool Steel (pre-hard)" }, vc: 55, feedFactor: 0.6 },
  castiron:  { label: { sr: "Sivi liv", en: "Cast Iron" }, vc: 90, feedFactor: 0.9 },
  plastic:   { label: { sr: "Plastika (Acetal/POM)", en: "Plastic (Acetal/POM)" }, vc: 200, feedFactor: 1.5 },
  titanium:  { label: { sr: "Titanijum", en: "Titanium" }, vc: 45, feedFactor: 0.5 },
};

const GCODES = [
  { code: "G00", cat: { sr: "Pozicioniranje", en: "Positioning" }, desc: { sr: "Brzi hod (bez rezanja)", en: "Rapid positioning (rapid traverse, no cutting)" } },
  { code: "G01", cat: { sr: "Interpolacija", en: "Interpolation" }, desc: { sr: "Linearna interpolacija — pravolinijski radni hod", en: "Linear interpolation — straight-line feed move" } },
  { code: "G02", cat: { sr: "Interpolacija", en: "Interpolation" }, desc: { sr: "Kružna interpolacija, u smjeru kazaljke na satu (CW)", en: "Circular interpolation, clockwise (CW)" } },
  { code: "G03", cat: { sr: "Interpolacija", en: "Interpolation" }, desc: { sr: "Kružna interpolacija, suprotno kazaljki na satu (CCW)", en: "Circular interpolation, counter-clockwise (CCW)" } },
  { code: "G04", cat: { sr: "Kontrola programa", en: "Program control" }, desc: { sr: "Zadrška (pauza) — čekanje programiranog vremena", en: "Dwell — pause for a programmed time" } },
  { code: "G17", cat: { sr: "Izbor ravni", en: "Plane selection" }, desc: { sr: "Izbor XY ravni", en: "Select XY plane" } },
  { code: "G18", cat: { sr: "Izbor ravni", en: "Plane selection" }, desc: { sr: "Izbor XZ ravni (uobičajeno kod struga)", en: "Select XZ plane (typical lathe default)" } },
  { code: "G19", cat: { sr: "Izbor ravni", en: "Plane selection" }, desc: { sr: "Izbor YZ ravni", en: "Select YZ plane" } },
  { code: "G20", cat: { sr: "Jedinice", en: "Units" }, desc: { sr: "Inčne jedinice (Fanuc stil; neke mašine koriste G70)", en: "Inch units (Fanuc-style; some controls use G70)" } },
  { code: "G21", cat: { sr: "Jedinice", en: "Units" }, desc: { sr: "Metrične jedinice (Fanuc stil; neke mašine koriste G71)", en: "Metric units (Fanuc-style; some controls use G71)" } },
  { code: "G28", cat: { sr: "Pozicioniranje", en: "Positioning" }, desc: { sr: "Povratak u referentnu (nultu) poziciju", en: "Return to reference/home position" } },
  { code: "G40", cat: { sr: "Korekcija alata", en: "Compensation" }, desc: { sr: "Ukidanje korekcije radijusa alata", en: "Cutter radius compensation cancel" } },
  { code: "G41", cat: { sr: "Korekcija alata", en: "Compensation" }, desc: { sr: "Korekcija radijusa alata, lijevo od putanje", en: "Cutter radius compensation, left of path" } },
  { code: "G42", cat: { sr: "Korekcija alata", en: "Compensation" }, desc: { sr: "Korekcija radijusa alata, desno od putanje", en: "Cutter radius compensation, right of path" } },
  { code: "G43", cat: { sr: "Korekcija alata", en: "Compensation" }, desc: { sr: "Korekcija dužine alata, pozitivna", en: "Tool length compensation, positive" } },
  { code: "G49", cat: { sr: "Korekcija alata", en: "Compensation" }, desc: { sr: "Ukidanje korekcije dužine alata", en: "Tool length compensation cancel" } },
  { code: "G53", cat: { sr: "Koordinatni sistemi", en: "Coordinate systems" }, desc: { sr: "Kretanje u mašinskom koordinatnom sistemu (nemodalno)", en: "Move in machine coordinate system (non-modal)" } },
  { code: "G54–G59", cat: { sr: "Koordinatni sistemi", en: "Coordinate systems" }, desc: { sr: "Izbor radnog koordinatnog sistema 1–6", en: "Select work coordinate system 1–6" } },
  { code: "G80", cat: { sr: "Ciklusi", en: "Canned cycles" }, desc: { sr: "Ukidanje fiksnog (kanonskog) ciklusa", en: "Cancel canned (fixed) cycle" } },
  { code: "G81", cat: { sr: "Ciklusi", en: "Canned cycles" }, desc: { sr: "Jednostavan ciklus bušenja", en: "Simple drilling cycle" } },
  { code: "G82", cat: { sr: "Ciklusi", en: "Canned cycles" }, desc: { sr: "Bušenje sa zadrškom (upuštanje/zaravnjivanje)", en: "Drilling with dwell (spot/counterbore)" } },
  { code: "G83", cat: { sr: "Ciklusi", en: "Canned cycles" }, desc: { sr: "Ciklus dubokog bušenja (lomljenje strugotine)", en: "Peck drilling cycle (deep holes, chip breaking)" } },
  { code: "G84", cat: { sr: "Ciklusi", en: "Canned cycles" }, desc: { sr: "Ciklus urezivanja navoja (narezivanje)", en: "Tapping cycle" } },
  { code: "G90", cat: { sr: "Način pozicioniranja", en: "Positioning mode" }, desc: { sr: "Apsolutno pozicioniranje — koordinate od nulte tačke obratka", en: "Absolute positioning — coordinates from part zero" } },
  { code: "G91", cat: { sr: "Način pozicioniranja", en: "Positioning mode" }, desc: { sr: "Inkrementalno pozicioniranje — koordinate od posljednje pozicije", en: "Incremental positioning — coordinates from last position" } },
  { code: "G92", cat: { sr: "Koordinatni sistemi", en: "Coordinate systems" }, desc: { sr: "Postavljanje/pomjeranje ishodišta radnog koordinatnog sistema", en: "Set/shift the work coordinate origin" } },
  { code: "G94", cat: { sr: "Način posmaka", en: "Feed mode" }, desc: { sr: "Posmak po minuti (mm/min ili in/min)", en: "Feed per minute (mm/min or in/min)" } },
  { code: "G95", cat: { sr: "Način posmaka", en: "Feed mode" }, desc: { sr: "Posmak po obrtaju (mm/obrt ili in/obrt) — uobičajeno kod struga", en: "Feed per revolution (mm/rev or in/rev) — common on lathes" } },
  { code: "G96", cat: { sr: "Način rada vretena", en: "Spindle mode" }, desc: { sr: "Konstantna rezna brzina (CSS) — uključeno (struganje)", en: "Constant surface speed (CSS) control — on (turning)" } },
  { code: "G97", cat: { sr: "Način rada vretena", en: "Spindle mode" }, desc: { sr: "Ukidanje konstantne rezne brzine — direktan broj obrtaja", en: "Constant surface speed cancel — direct RPM" } },
];

const MCODES = [
  { code: "M00", cat: { sr: "Kontrola programa", en: "Program control" }, desc: { sr: "Zaustavljanje programa (bezuslovno) — mašina staje, pritisni start za nastavak", en: "Program stop (unconditional) — machine halts, press cycle start to resume" } },
  { code: "M01", cat: { sr: "Kontrola programa", en: "Program control" }, desc: { sr: "Opcionalno zaustavljanje — samo ako je operater to uključio", en: "Optional stop — only halts if operator has it enabled" } },
  { code: "M02", cat: { sr: "Kontrola programa", en: "Program control" }, desc: { sr: "Kraj programa", en: "End of program" } },
  { code: "M03", cat: { sr: "Vreteno", en: "Spindle" }, desc: { sr: "Pokretanje vretena, u smjeru kazaljke na satu (CW)", en: "Spindle start, clockwise (CW)" } },
  { code: "M04", cat: { sr: "Vreteno", en: "Spindle" }, desc: { sr: "Pokretanje vretena, suprotno kazaljki na satu (CCW)", en: "Spindle start, counter-clockwise (CCW)" } },
  { code: "M05", cat: { sr: "Vreteno", en: "Spindle" }, desc: { sr: "Zaustavljanje vretena", en: "Spindle stop" } },
  { code: "M06", cat: { sr: "Alat", en: "Tooling" }, desc: { sr: "Promjena alata", en: "Tool change" } },
  { code: "M08", cat: { sr: "Rashladna tečnost", en: "Coolant" }, desc: { sr: "Uključivanje rashladne tečnosti", en: "Coolant on" } },
  { code: "M09", cat: { sr: "Rashladna tečnost", en: "Coolant" }, desc: { sr: "Isključivanje rashladne tečnosti", en: "Coolant off" } },
  { code: "M30", cat: { sr: "Kontrola programa", en: "Program control" }, desc: { sr: "Kraj programa, povratak na početak", en: "End of program, reset to the start" } },
];

const CURRICULUM = [
  {
    name: { sr: "CNC програмирање", en: "CNC Programming" },
    open: true,
    modules: [
      {
        title: { sr: "1. Програмирање НУМА", en: "1. Programming the CNC control" },
        topics: {
          sr: ["Увод у нумеричко управљање", "Координатни систем и референтне тачке", "Креирање програма", "Структура и садржај програма", "Технолошка документација"],
          en: ["Introduction to numerical control", "Coordinate systems & reference points", "Creating a program", "Program structure & content", "Technological documentation"],
        },
      },
      {
        title: { sr: "2. Програмирање НУМА глодалица", en: "2. CNC Milling Programming" },
        topics: {
          sr: ["ЦНЦ глодалице", "Програмирање кретања код глодалице", "Чеоно глодање", "Израда контуре", "Израда утора и џепова", "Израда рупа и отвора"],
          en: ["CNC milling machines", "Programming milling movement", "Face milling", "Contour machining", "Slots & pockets", "Holes"],
        },
      },
      {
        title: { sr: "3. Програмирање НУМА струга", en: "3. CNC Turning Programming" },
        topics: {
          sr: ["НУМА стругови", "Програмирање кретања код струга", "Израда рупа на стругу", "Програмирање израде контуре на стругу", "Програмирање израде жљебова", "Програмирање стругања навоја"],
          en: ["CNC lathes", "Programming lathe movement", "Drilling on the lathe", "Contour turning", "Grooving", "Thread turning"],
        },
      },
    ],
  },
  {
    name: { sr: "Практична настава", en: "Shop / Practical Training" },
    modules: [
      {
        title: { sr: "1. Обрада на стругу", en: "1. Conventional Lathe Work" },
        topics: {
          sr: ["Струг", "Стругарски ножеви", "Уздужно стругање", "Израда отвора на стругу", "Обрада конуса", "Усијецање жљебова"],
          en: ["The lathe", "Turning tools", "Longitudinal turning", "Drilling on the lathe", "Taper turning", "Grooving"],
        },
      },
      {
        title: { sr: "2. Обрада на глодалици и брусилици", en: "2. Conventional Milling & Grinding" },
        topics: {
          sr: ["Глодалица", "Алати за глодање", "Обрада хоризонталних и вертикалних равних површина", "Глодање под углом", "Остале операције на глодалици", "Подиони апарат"],
          en: ["The milling machine", "Milling tools", "Flat surface machining", "Angle milling", "Other milling operations", "Dividing head"],
        },
      },
      {
        title: { sr: "3. Припрема НУМА за рад", en: "3. CNC Setup & Operation" },
        topics: {
          sr: ["Припрема CNC глодалице", "Рад са управљачким јединицама CNC глодалице", "Припрема алата и прибора за CNC глодалицу", "Дефинисање нултих тачака на CNC глодалици", "Израда и контрола комада на CNC глодалици", "Припрема CNC струга", "Рад са управљачким јединицама CNC струга", "Припрема алата и прибора за CNC струг", "Дефинисање нултих тачака на CNC стругу", "Израда и контрола комада на CNC стругу"],
          en: ["Preparing the CNC mill", "Operating the CNC mill control unit", "Preparing tools/workholding for the mill", "Setting zero points on the mill", "Producing & inspecting parts on the mill", "Preparing the CNC lathe", "Operating the CNC lathe control unit", "Preparing tools/workholding for the lathe", "Setting zero points on the lathe", "Producing & inspecting parts on the lathe"],
        },
      },
    ],
  },
  {
    name: { sr: "Технологија обраде", en: "Machining Technology (theory)" },
    modules: [
      {
        title: { sr: "1. Основи теорије обраде резањем", en: "1. Cutting Theory Fundamentals" },
        topics: {
          sr: ["Основи теорије обраде метала резањем", "Обрада тестерисањем", "Обрада на стругу", "Обрада на бушилицама", "Обрада на глодалицама"],
          en: ["Fundamentals of metal cutting theory", "Sawing", "Turning", "Drilling", "Milling"],
        },
      },
      {
        title: { sr: "2. Напредни поступци обраде", en: "2. Advanced Processes" },
        topics: {
          sr: ["Обрада на машинама за провлачење", "Обрада на машинама за брушење и глачање", "Израда навоја и зупчаника", "Неконвенционални поступци обраде", "Разрада технолошког процеса"],
          en: ["Broaching", "Grinding & honing", "Thread & gear cutting", "Non-conventional machining", "Designing a technological process"],
        },
      },
    ],
  },
  {
    name: { sr: "Машински елементи", en: "Machine Elements" },
    modules: [
      {
        title: { sr: "1. Осовине, вратила, лежајеви, спојнице", en: "1. Axles, Shafts, Bearings, Couplings" },
        topics: {
          sr: ["Осовине, осовинице", "Вратила", "Лежишта и лежаји", "Спојнице"],
          en: ["Axles", "Shafts", "Bearings", "Couplings"],
        },
      },
      {
        title: { sr: "2. Зупчасти, ланчани и каишни преносници", en: "2. Gear, Chain & Belt Drives" },
        topics: {
          sr: ["Цилиндрични зупчасти парови", "Конусни зупчасти парови", "Пужни преносник", "Ланчани парови", "Каишни (ремени) парови"],
          en: ["Spur gear pairs", "Bevel gear pairs", "Worm drives", "Chain drives", "Belt drives"],
        },
      },
    ],
  },
  {
    name: { sr: "Моделирање и симулација помоћу рачунара", en: "CAD Modeling & Simulation" },
    modules: [
      {
        title: { sr: "1. Моделирање основних елемената", en: "1. Modeling Basic Elements" },
        topics: {
          sr: ["Моделирање стандардних машинских елемената", "Моделирање осовина и вратила", "Моделирање лежајева", "Моделирање спојница", "Моделирање фрикционих преносника"],
          en: ["Modeling standard machine elements", "Modeling axles & shafts", "Modeling bearings", "Modeling couplings", "Modeling friction drives"],
        },
      },
      {
        title: { sr: "2. Моделирање зупчаника", en: "2. Modeling Gears" },
        topics: {
          sr: ["Моделирање зупчаника", "Моделирање зупчастог преносника са цилиндричним зупчаницима", "Моделирање конусних и пужних зупчастих преносника", "Симулација рада зупчастог преносника"],
          en: ["Modeling gears", "Modeling spur gear trains", "Modeling bevel & worm gear trains", "Simulating gear train operation"],
        },
      },
      {
        title: { sr: "3. Моделирање преносника и документације", en: "3. Modeling Drives & Documentation" },
        topics: {
          sr: ["Моделирање ланчаног преносника", "Моделирање каишног (ременог) преносника", "Моделирање сложенијих склопова", "Израда техничке документације"],
          en: ["Modeling chain drives", "Modeling belt drives", "Modeling complex assemblies", "Producing technical documentation"],
        },
      },
    ],
  },
  {
    name: { sr: "Рачунари и програмирање", en: "Computers & Programming" },
    modules: [
      {
        title: { sr: "Креирање програма у C/C++", en: "Programming in C/C++" },
        topics: {
          sr: ["Основе програмирања", "Линијска структура програма", "Разгранита структура програма"],
          en: ["Programming basics", "Linear program structures", "Branching program structures"],
        },
      },
    ],
  },
  {
    name: { sr: "Хидраулика и пнеуматика", en: "Hydraulics & Pneumatics" },
    modules: [
      {
        title: { sr: "Хидраулички системи", en: "Hydraulic Systems" },
        topics: {
          sr: ["Основни закони хидраулике", "Хидраулички системи и њихова намјена", "Хидраулички симболи"],
          en: ["Fundamental laws of hydraulics", "Hydraulic systems & their purpose", "Hydraulic schematic symbols"],
        },
      },
    ],
  },
  {
    name: { sr: "Термодинамика", en: "Thermodynamics" },
    modules: [
      {
        title: { sr: "1. Основни појмови", en: "1. Fundamentals" },
        topics: {
          sr: ["Основни појмови", "Идеални гас и мјешавине идеалних гасова", "Реални гасови и паре", "Простирање топлоте и измјењивачи топлоте", "Кружни процеси"],
          en: ["Basic concepts", "Ideal gas & gas mixtures", "Real gases & vapors", "Heat transfer & heat exchangers", "Thermodynamic cycles"],
        },
      },
      {
        title: { sr: "2. Гријање, хлађење и постројења", en: "2. Heating, Cooling & Plants" },
        topics: {
          sr: ["Основе технике гријања", "Основе технике хлађења", "Термоенергетска постројења", "Хидротурбинска постројења"],
          en: ["Heating technique basics", "Cooling technique basics", "Thermal power plants", "Hydro turbine plants"],
        },
      },
    ],
  },
  {
    name: { sr: "Основи предузетништва", en: "Entrepreneurship Basics" },
    modules: [
      {
        title: { sr: "1. Предузетништво", en: "1. Entrepreneurship" },
        topics: {
          sr: ["Појам, развој и значај предузетништва", "Основне одреднице предузетништва", "Профил успјешног предузетника", "Утицај окружења на предузетништво", "Предузетничка идеја"],
          en: ["Concept & importance of entrepreneurship", "Key features of entrepreneurship", "Profile of a successful entrepreneur", "Environment's impact on entrepreneurship", "The entrepreneurial idea"],
        },
      },
      {
        title: { sr: "2. Пословање", en: "2. Running a Business" },
        topics: {
          sr: ["Бизнис план", "Маркетинг у предузетничком бизнису", "Финансијски аспекти пословања", "Организациони аспекти предузетништва", "Правни и институционални оквир"],
          en: ["Business plan", "Marketing for a small business", "Financial aspects of running a business", "Organizational aspects", "Legal & institutional framework"],
        },
      },
    ],
  },
  {
    name: { sr: "Општеобразовни предмети", en: "General subjects" },
    modules: [
      {
        title: { sr: "", en: "" },
        topics: {
          sr: ["Математика", "Српски језик", "Страни језик (енглески/њемачки/италијански/руски)", "Физичко васпитање", "Изборни предмет: Вјеронаука / Етика / Демократија и људска права / Култура религија"],
          en: ["Math", "Serbian language", "Foreign language (English/German/Italian/Russian)", "PE", "Elective: Religion / Ethics / Democracy & Human Rights / Culture of Religions"],
        },
      },
    ],
  },
];

const RESOURCES = {
  textbooks: [
    {
      title: "Mašinski elementi — Miroslav Ognjanović",
      url: "https://pdfcoffee.com/mainski-elementi-miroslav-ognjanovipdf-pdf-free.html",
      desc: {
        sr: "Standardni regionalni udžbenik o osovinama, ležajevima, spojnicama, zupčanicima — dobro se poklapa sa spiskom tema iz Mašinskih elemenata.",
        en: "Standard regional textbook on shafts, bearings, couplings, gears — matches the Mašinski elementi topic list closely.",
      },
    },
    {
      title: "Tehnologija obrade za II mašinsku struku",
      url: "https://pdfcoffee.com/tehnologija-obrade-za-ii-mastr-pdf-free.html",
      desc: {
        sr: "Poklapa se sa modulom Tehnologija obrade.",
        en: "Aligns with the Tehnologija obrade module.",
      },
    },
    {
      title: "Mašinski elementi I — skripta za usmeni",
      url: "https://pdfcoffee.com/mainski-elementi-i-skripta-za-usmeni-pdf-free.html",
      desc: {
        sr: "Bilješke u stilu pripreme za ispit, dobre za usmeni.",
        en: "Exam-prep style notes, good for oral exam review.",
      },
    },
    {
      title: "Univerzitet u Banjoj Luci — Mašinski fakultet",
      url: "https://www.unibl.org/en/members/faculties/faculty-of-mechanical-engineering",
      desc: {
        sr: "Objavljuje besplatne skripte za Mehaniku i srodne predmete — ista terminologija, provjerljiv univerzitetski izvor.",
        en: "Publishes free lecture notes (skripte) for Mehanika and related subjects — same terminology, verifiable university source.",
      },
    },
  ],
  cnc: [
    {
      title: "CNCCookbook — G-code tutorial",
      url: "https://www.cnccookbook.com/cnc-programming-g-code/",
      desc: {
        sr: "Jasan uvod, objašnjava razlike u programiranju glodalice i struga.",
        en: "Clear intro, explains mill vs. lathe programming differences.",
      },
    },
    {
      title: "HelmanCNC — Beginner lessons",
      url: "https://www.helmancnc.com/cnc/beginner-lessons/",
      desc: {
        sr: "Jednostavni riješeni primjeri za glodalicu i strug, pokriva Fanuc/Siemens/Haas.",
        en: "Simple worked examples for mill and lathe, covers Fanuc/Siemens/Haas.",
      },
    },
  ],
  tips: [
    {
      sr: "<strong>CNC programiranje / Praktična nastava:</strong> nauči tabelu G/M kodova napamet, a zatim ručno prati programe na papiru prije pokretanja — vrijeme u radionici je ograničeno, a greške koštaju materijal.",
      en: "<strong>CNC programiranje / Praktična nastava:</strong> drill the G/M-code table until it's automatic, then hand-trace programs on paper before running them — shop time is limited and mistakes cost material.",
    },
    {
      sr: "<strong>Mašinski elementi / Tehnologija obrade:</strong> ovo se direktno nadovezuje na mehaniku i materijale iz 1. i 2. razreda — popravi sve nejasnoće iz tih godina sada.",
      en: "<strong>Mašinski elementi / Tehnologija obrade:</strong> this builds directly on 1st–2nd year mechanics and materials — patch any shaky spots from those years now.",
    },
    {
      sr: "<strong>Poveži alate sa domaćim zadaćama:</strong> koristi Kalkulator brzina i posmaka i za zadatke iz Tehnologije obrade, ne samo u radionici, da ti brojevi ostanu intuitivni do ispita.",
      en: "<strong>Cross-link tools to homework:</strong> use the Feeds &amp; Speeds calculator on Tehnologija obrade problem sets, not just in the shop, so the numbers stay intuitive by exam time.",
    },
  ],
};
