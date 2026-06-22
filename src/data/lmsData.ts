export interface BilingualText {
  de: string;
  tr: string;
}

export interface LearningTarget {
  id: string;
  text: BilingualText;
}

export interface ReadingMaterial {
  id: string;
  title: BilingualText;
  description: BilingualText;
  url: string;
}

export interface BookRecommendation {
  id: string;
  title: BilingualText;
  author: string;
  description: BilingualText;
}

export interface VideoMaterial {
  id: string;
  title: BilingualText;
  description: BilingualText;
  youtubeId: string;
}

export interface ModuleContent {
  id: string;
  week: number; // represents Module Number (1-16)
  title: BilingualText;
  description: BilingualText;
  learningTargets: LearningTarget[];
  readingMaterials: ReadingMaterial[];
  bookRecommendations: BookRecommendation[];
  videos: VideoMaterial[];
}

export const lmsModules: ModuleContent[] = [
  {
    id: "mod-1",
    week: 1,
    title: {
      de: "Modul 1: Grundlagen des Dialogs",
      tr: "Modül 1: Diyaloğun Temelleri"
    },
    description: {
      de: "Eine grundlegende Perspektive auf das Konzept des Dialogs – von Definitionen und Grenzen bis hin zu Identitäten und Pluralismus.",
      tr: "Tanımlardan sınırlara, kimliklerden çoğulculuğa diyalog kavramına dair temel bir bakış açısı."
    },
    learningTargets: [
      {
        id: "mod1-t1",
        text: {
          de: "Definition, Ziel und Grenzen des Dialogbegriffs verstehen",
          tr: "Diyalog kavramının tanımı, amacı ve sınırlarını kavrama"
        }
      },
      {
        id: "mod1-t2",
        text: {
          de: "Konzepte von Identität, Diskriminierung, Rassismus und Pluralismus analysieren",
          tr: "Kimlik, ayrımcılık, ırkçılık ve çoğulculuk kavramlarını analiz etme"
        }
      },
      {
        id: "mod1-t3",
        text: {
          de: "Die grundlegenden Unterschiede zwischen religiöser Verkündung (Teblig), Missionierung und Dialog begreifen",
          tr: "Tebliğ ve misyonerlik ile diyalog arasındaki temel farkları anlama"
        }
      }
    ],
    readingMaterials: [
      {
        id: "mod1-r-is",
        title: {
          de: "Die Liebe zum Menschen (İnsan Sevgisi)",
          tr: "İnsan Sevgisi"
        },
        description: {
          de: "Ein grundlegender Aufsatz über universelle Menschenliebe, Toleranz und Respekt.",
          tr: "İnsan sevgisi, hoşgörü ve evrensel insani değerler üzerine bir kılavuz."
        },
        url: "https://fgulen.com/tr/eserleri/kirik-testi/insan-sevgisi"
      },
      {
        id: "mod1-r-kik",
        title: {
          de: "Globalisierung, Rassismus und Identitäten",
          tr: "Küreselleşme, Irkçılık ve Kimlikler"
        },
        description: {
          de: "Herausforderungen und Gefahren rassistischer Einstellungen in einer sich globalisierenden Welt.",
          tr: "Küreselleşme sürecinde kimliklerin korunması ve ırkçılıkla mücadele felsefesi."
        },
        url: "https://herkul.org/kirik-testi/kuresellesme-irkcilik-ve-kimlikler"
      },
      {
        id: "mod1-r-c",
        title: {
          de: "Pluralismus (Çoğulculuk)",
          tr: "Çoğulculuk"
        },
        description: {
          de: "Betrachtungen über gesellschaftliche Vielfalt, gegenseitige Akzeptanz und soziale Harmonie.",
          tr: "Çok kültürlü ve çok sesli bir toplumda bir arada yaşamanın esasları."
        },
        url: "https://www.herkul.org/kirik-testi/cogulculuk"
      },
      {
        id: "mod1-r-ikd",
        title: {
          de: "Ungläubige sollten nicht als 'Kafir' bezeichnet werden",
          tr: "İnançsızlara kâfir denmemeli"
        },
        description: {
          de: "Über theologische Terminologie und die Notwendigkeit von respektvoller und inklusiver Sprache.",
          tr: "Teolojik kavramların kullanımı ve insanlara saygılı hitap üslubu üzerine önemli bir makale."
        },
        url: "https://fgulen.com/tr/eserleri/fikir-atlasi/inancsizlara-kafir-denmemeli"
      },
      {
        id: "mod1-r-m",
        title: {
          de: "Nichtgläubige nicht pauschal in dieselbe Kategorie einordnen",
          tr: "İman etmeyenlerin hepsini aynı kategoride mütalaa etmemeli"
        },
        description: {
          de: "Umfassende theologische Einblicke zur Differenzierung im Umgang mit Nichtglaubenden.",
          tr: "İnançsızlık kategorilerinin teolojik açıdan analizi ve ayrımcı dilden kaçınma üzerine bir yazı."
        },
        url: "https://fgulen.com/tr/eserleri/cizgimizi-hecelerken/la-ilahe-illallah-demek-kurtulusa-yeter-mi"
      },
      {
        id: "mod1-r-dk",
        title: {
          de: "Handbuch: Errungenschaften des Dialogs",
          tr: "Diyaloğun Kazanımları El Kitapçığı"
        },
        description: {
          de: "Broschüre über den Nutzen des Dialogs auf individueller, gesellschaftlicher und institutioneller Ebene.",
          tr: "Diyaloğun bireysel, toplumsal ve kurumsal düzeydeki kazanımlarını ele alan el kitapçığı."
        },
        url: "#"
      },
      {
        id: "mod1-r-dt-da",
        title: {
          de: "Lesebegleiter: Interreligiöser Dialog im Wandel der Geschichte (D. Aydüz)",
          tr: "Diyaloğun Temelleri Okuma Rehberi: Tarih Boyunca Dinlerarası Diyalog (D. Aydüz)"
        },
        description: {
          de: "Analyse der geschichtlichen Entwicklung des Dialogs als eine zeitlose, menschliche Praxis.",
          tr: "Diyalog kavramının tarih boyunca gösterdiği dönüşüm ve peygamberlerin pratiklerine dair analiz."
        },
        url: "https://can-ada.net/wp-content/uploads/2023/02/Davut-Ayduz-Tarih-Boyunca-Dinler-Arasi-Diyalog-IsikYayinlari.pdf"
      },
      {
        id: "mod1-r-dt-ak",
        title: {
          de: "Lesebegleiter: Warum Dialog? (A. Kurucan)",
          tr: "Diyaloğun Temelleri Okuma Rehberi: Niçin Diyalog? (A. Kurucan)"
        },
        description: {
          de: "Theologische Begründung des Dialogs aus Sicht des Korans und der Sunna als Widerspiegelung des Glaubens.",
          tr: "Dinlerarası diyaloğun bir iman zafiyeti değil, aksine imanın bir yansıması olduğuna dair makale."
        },
        url: "https://cetele.org/wp-content/uploads/2017/12/Ahmet-Kurucan-Nicin-Diyalog-Diyalogun-Temelleri-IsikYayinlari.pdf"
      },
      {
        id: "mod1-r-dt-fg",
        title: {
          de: "Lesebegleiter: Beharrlichkeit im Dialog (F. Gülen)",
          tr: "Diyaloğun Temelleri Okuma Rehberi: Diyalogta Israr (F. Gülen)"
        },
        description: {
          de: "Die Bedeutung von Geduld, Kontinuität und Aufrichtigkeit angesichts von Kritik und Hindernissen.",
          tr: "Diyalog çalışmalarında karşılaşılan zorluklar karşısında sabır, kararlılık ve niyet temizliği."
        },
        url: "https://herkul.org/kirik-testi/diyalogda-israr/"
      },
      {
        id: "mod1-r-dt-hs",
        title: {
          de: "Lesebegleiter: Warum Dialog? (H. Şener)",
          tr: "Diyaloğun Temelleri Okuma Rehberi: Neden Diyalog? (H. Şener)"
        },
        description: {
          de: "Über das Verständnisdefizit im Kommunikationszeitalter und den Dialog zum Schutz der Menschenwürde.",
          tr: "Müslüman kimliğin korunması ve küresel barış adına diyaloğun kaçınılmaz bir gereklilik olduğu üzerine."
        },
        url: "https://fgulen.com/tr/basindan-tr/kose-yazilari/Halid-Sener-HaberX-Neden-Diyalog-1"
      }
    ],
    bookRecommendations: [
      {
        id: "mod1-b-nd",
        title: {
          de: "Warum Dialog? (Niçin Diyalog)",
          tr: "Niçin Diyalog"
        },
        author: "Ahmet Kurucan",
        description: {
          de: "Ein wichtiges Werk, das die Notwendigkeit, theologische Grundlagen und Praxis des interkulturellen Dialogs analysiert.",
          tr: "Diyaloğun dinlerarası ve insani temellerini, günümüz dünyasındaki lüzumunu ele alan kapsamlı çalışma."
        }
      },
      {
        id: "mod1-b-ddht",
        title: {
          de: "Religiöse und historische Grundlagen des Dialogs",
          tr: "Diyaloğun Dini ve Tarihi Temelleri"
        },
        author: "Derleme",
        description: {
          de: "Eine wissenschaftliche Sammlung über den historischen Verlauf und die religionswissenschaftliche Notwendigkeit des Friedensadler-Dialogs.",
          tr: "Dinler arası diyaloğun referans kaynaklarından ve tarihteki uygulamalarından derlenmiş nitelikli bir eser."
        }
      },
      {
        id: "mod1-b-di",
        title: {
          de: "Dialogue in Islam",
          tr: "Dialogue in Islam"
        },
        author: "Ahmet Kurucan",
        description: {
          de: "Eine englischsprachige Einführung in das Dialogverständnis aus der Perspektive islamischer Kernquellen.",
          tr: "İslam'ın temel kaynaklarından hareketle diyalog vizyonunu İngilizce okuyuculara sunan kitap."
        }
      },
      {
        id: "mod1-b-nbd",
        title: {
          de: "Was für ein Dialog? (Nasıl Bir Diyalog)",
          tr: "Nasıl Bir Diyalog"
        },
        author: "Şerif Ali Tekalan",
        description: {
          de: "Ein Buch über die Prinzipien, Werte und methodischen Standards für einen aufrichtigen, nachhaltigen Dialog.",
          tr: "Dürüst, seviyeli ve kalıcı bir diyalog kurabilmenin adabı, metodolojisi ve sınırları üzerine."
        }
      }
    ],
    videos: [
      {
        id: "mod1-v-de",
        title: {
          de: "Dialog und Integration",
          tr: "Diyalog ve Entegrasyon"
        },
        description: {
          de: "Ein Dialog- und Integrationsdiskurs zur Überwindung gesellschaftlicher Spaltung.",
          tr: "Toplumsal uyum ve sivil katılımda diyaloğun ve entegrasyonun rolü."
        },
        youtubeId: "NWuNA3z3rBA"
      },
      {
        id: "mod1-v-kd",
        title: {
          de: "Welches Dialogverständnis in einer sich globalisierenden Welt?",
          tr: "Küreselleşen dünyada nasıl bir diyalog anlayışımız olmalı?"
        },
        description: {
          de: "Analysen über die Art und die Grundwerte des Dialogs, die im globalen Zeitalter erforderlich sind.",
          tr: "Küresel çağın gereksinimlerine göre şekillenen yapıcı diyalog anlayışı ve yaklaşımları."
        },
        youtubeId: "6HQH1IB7Lt4"
      },
      {
        id: "mod1-v-ddnd",
        title: {
          de: "Was interreligiöser Dialog NICHT ist | Ahmet Kurucan",
          tr: "Dinlerarası Diyalog Ne Değildir? | AHMET KURUCAN"
        },
        description: {
          de: "Aufklärung über häufige Missverständnisse und Fehlinterpretationen über interreligiösen Dialog.",
          tr: "Dinlerarası diyaloğa yönelik haksız ithamlar, şüpheler ve kavramsal doğrulardan bahseden bir video."
        },
        youtubeId: "HqD_ACBtQ1E"
      },
      {
        id: "mod1-v-ddzm",
        title: {
          de: "Ist interreligiöser Dialog eine Notwendigkeit? | Ahmet Kurucan",
          tr: "Dinler Arası Diyalog Zaruri mi? | AHMET KURUCAN"
        },
        description: {
          de: "Über die theologische und gesellschaftliche Unerlässlichkeit des Dialogs im heutigen Zeitalter.",
          tr: "Günümüz çoğulcu dünyasında dinler arası ve kültürlerarası diyaloğun dini ve akli zaruretleri."
        },
        youtubeId: "SSHyKHZJnx0"
      },
      {
        id: "mod1-v-hhsa",
        title: {
          de: "Hizmet-Bewegung und bürgerschaftliches Engagement",
          tr: "Hizmet Hareketi ve Sivil Angajman"
        },
        description: {
          de: "Die Grundlagen des bürgerschaftlichen und sozialen Engagements der Hizmet-Bewegung im Westen.",
          tr: "Hizmet Hareketi'nin sivil toplum bilinci ve demokratik katılım felsefesi üzerine değerlendirme."
        },
        youtubeId: "LhfRBPyOKGQ"
      },
      {
        id: "mod1-v-db1",
        title: {
          de: "Dialog-Treffen: Warum Dialog? Buchbesprechung Teil 1",
          tr: "Diyalog Buluşmaları: Niçin Diyalog? Kitap Müzakeresi 1.Kısım"
        },
        description: {
          de: "Erster Teil der Müzakere des bekannten Buchs 'Niçin Diyalog' von Ahmet Kurucan.",
          tr: "Ahmet Kurucan'ın 'Niçin Diyalog?' eseri üzerine gerçekleştirilen kitap müzakeresinin ilk durağı."
        },
        youtubeId: "38a82Jo1vO4"
      },
      {
        id: "mod1-v-db2",
        title: {
          de: "Dialog-Treffen: Warum Dialog? Buchbesprechung Teil 2",
          tr: "Diyalog Buluşmaları: Niçin Diyalog? Kitap Müzakeresi 2. Kısım"
        },
        description: {
          de: "Zweiter Teil der Müzakere des bekannten Buchs 'Niçin Diyalog' von Ahmet Kurucan.",
          tr: "Ahmet Kurucan'ın 'Niçin Diyalog?' eseri üzerine gerçekleştirilen kitap müzakeresinin ikinci halkası."
        },
        youtubeId: "FEBFt_5qMK8"
      },
      {
        id: "mod1-v-db3",
        title: {
          de: "Dialog-Treffen: Warum Dialog? Buchbesprechung Teil 3",
          tr: "Diyalog Buluşmaları: Niçin Diyalog? Kitap Müzakeresi 3. Kısım"
        },
        description: {
          de: "Dritter Teil der Müzakere des bekannten Buchs 'Niçin Diyalog' von Ahmet Kurucan.",
          tr: "Ahmet Kurucan'ın 'Niçin Diyalog?' eseri üzerine gerçekleştirilen kitap müzakeresinin üçüncü halkası."
        },
        youtubeId: "I70Avnbr8Sg"
      }
    ]
  },
  {
    id: "mod-2",
    week: 2,
    title: {
      de: "Modul 2: Dialog aus der Perspektive des Korans",
      tr: "Modül 2: Kuran Perspektifinde Diyalog"
    },
    description: {
      de: "Die Perspektive des Korans auf Nichtmuslime, Stilregeln und heilige Verse, die den Dialog betonen.",
      tr: "Kuran’ın gayrimüslimlere bakış açısı, üslup ölçüleri ve diyaloğa vurgu yapan kutsal ayetler."
    },
    learningTargets: [
      {
        id: "mod2-t1",
        text: {
          de: "Die Haltung des Korans gegenüber Nichtmuslimen und den Dialogstil kennenlernen",
          tr: "Kuran’ın gayrimüslimlere bakış açısını ve diyalog üslubunu öğrenme"
        }
      },
      {
        id: "mod2-t2",
        text: {
          de: "Analyse of Koranversen, die gegenseitigen Respekt und Dialog betonen",
          tr: "Karşılıklı saygı ve diyaloğu vurgulayan Kuran ayetlerini inceleme"
        }
      },
      {
        id: "mod2-t3",
        text: {
          de: "Die richtige Exegese (Tafsir) von Versen über das Nicht-Verbünden mit Nichtmuslimen, Gefangenschaft, Töten usw. erlernen",
          tr: "Gayrimüslimleri dost edinmeme, esir etme, öldürme vb. ayetlerin doğru tefsirini öğrenme"
        }
      }
    ],
    readingMaterials: [
      {
        id: "mod2-r1",
        title: {
          de: "Prinzipien des Zusammenlebens im Heiligen Koran",
          tr: "Kuran-ı Kerim'de Birlikte Yaşam İlkeleri"
        },
        description: {
          de: "Zusammengestellte Verserklärungen aus maßgeblichen Exegese-Quellen.",
          tr: "İlgili tefsir kaynaklarından derlenmiş ayet açıklamaları."
        },
        url: "#"
      }
    ],
    bookRecommendations: [
      {
        id: "mod2-b1",
        title: {
          de: "Koran und Dialog",
          tr: "Kuran ve Diyalog"
        },
        author: "Prof. Dr. Suat Yıldırım",
        description: {
          de: "Beziehungen zu den Schriftbesitzern (Ahl al-Kitab) und Dialog aus koranischer Sicht.",
          tr: "Kuranî perspektiften ehli kitapla ilişkiler ve diyalog."
        }
      }
    ],
    videos: [
      {
        id: "mod2-v1",
        title: {
          de: "Das Konzept des 'Anderen' im Koran und Toleranz",
          tr: "Kuran'da Öteki Kavramı ve Hoşgörü"
        },
        description: {
          de: "Wahrnehmung des Anderen und interreligiöse Beziehungen im Lichte der Verse.",
          tr: "Ayetler ışığında öteki algısı ve dinler arası ilişkiler."
        },
        youtubeId: "dQw4w9WgXcQ"
      }
    ]
  },
  {
    id: "mod-3",
    week: 3,
    title: {
      de: "Modul 3: Dialog aus der Perspektive der Sunna",
      tr: "Modül 3: Sünnet Perspektifinde Diyalog"
    },
    description: {
      de: "Die Beziehungen des Propheten (s.a.w.) zu verschiedenen Glaubensgemeinschaften und seine Menschenrechtsperspektive.",
      tr: "Peygamber Efendimiz'in (sav) farklı inanç gruplarıyla münasebetleri ve insan hakları perspektifi."
    },
    learningTargets: [
      {
        id: "mod3-t1",
        text: {
          de: "Die Beziehungen des Propheten (s.a.w.) zu Polytheisten, Juden und Christen verstehen",
          tr: "Efendimiz’in (sav) müşriklerle, Yahudilerle ve Hristiyanlarla münasebetlerini kavrama"
        }
      },
      {
        id: "mod3-t2",
        text: {
          de: "Die Auswanderung nach Abessinien, die Charta von Medina und das Abkommen von Hudaybiyya im Hinblick auf den Dialog analysieren",
          tr: "Habeşistan Hicreti, Medine Vesikası ve Hudeybiye Anlaşması'nı diyalog açısından analiz etme"
        }
      },
      {
        id: "mod3-t3",
        text: {
          de: "Die Perspektive des Propheten (s.a.w.) zu Pluralismus und Menschenrechten bewerten",
          tr: "Efendimiz’in (sav) çoğulculuk ve insan hakları perspektifini değerlendirme"
        }
      }
    ],
    readingMaterials: [
      {
        id: "mod3-r1",
        title: {
          de: "Die Charta von Medina und die pluralistische Gesellschaftsordnung",
          tr: "Medine Vesikası ve Çoğulcu Toplum Düzeni"
        },
        description: {
          de: "Der Beitrag des verfassungsrechtlichen Konsenses der Prophetenzeit zur heutigen Dialogarbeit.",
          tr: "Hz. Peygamber dönemi anayasal uzlaşı metninin günümüz diyalog çalışmalarına katkısı."
        },
        url: "#"
      }
    ],
    bookRecommendations: [
      {
        id: "mod3-b1",
        title: {
          de: "Nichtmuslime im Leben unseres Propheten",
          tr: "Peygamber Efendimiz’in Hayatında Gayrimüslimler"
        },
        author: "İbrahim Canan",
        description: {
          de: "Dialog-Modelle mit Mitgliedern anderer Religionen aus der Sunna-Perspektive.",
          tr: "Sünnet perspektifinde diğer din mensuplarıyla diyalog modelleri."
        }
      }
    ],
    videos: []
  },
  {
    id: "mod-4",
    week: 4,
    title: {
      de: "Modul 4: Dialog in der historischen Praxis",
      tr: "Modül 4: Tarihsel Pratikte Diyalog"
    },
    description: {
      de: "Historische Erfahrungen des Zusammenlebens unter verschiedenen islamischen Staaten und Denkern.",
      tr: "İslam tarihi boyunca farklı devletler ve düşünce önderlerinin bir arada yaşama tecrübeleri."
    },
    learningTargets: [
      {
        id: "mod4-t1",
        text: {
          de: "Untersuchung von Dialogbeispielen aus den Epochen der Umayyaden, Abbasiden, Al-Andalus, Seldschuken und Osmanen",
          tr: "Emevi, Abbasi, Endülüs, Selçuklu ve Osmanlı Dönemlerinden diyalog örneklerini inceleme"
        }
      },
      {
        id: "mod4-t2",
        text: {
          de: "Die Dialog- und Liebe-Praxis von Persönlichkeiten wie Ahmet Yesevi, Rumi und Yunus Emre verstehen",
          tr: "Ahmet Yesevi, Mevlana, Yunus Emre gibi isimlerin diyalog ve sevgi pratiklerini anlama"
        }
      },
      {
        id: "mod4-t3",
        text: {
          de: "Entwicklung einer heutigen Perspektive auf historische Wendepunkte wie die Kreuzzüge und die mongolische Invasion",
          tr: "Haçlı seferleri, Moğol istilası vb. kırılma noktalarına günümüzden bakış geliştirme"
        }
      }
    ],
    readingMaterials: [
      {
        id: "mod4-r1",
        title: {
          de: "Toleranz und gemeinsame Kultur in Al-Andalus",
          tr: "Endülüs'te Hoşgörü ve Ortak Kültür"
        },
        description: {
          de: "Die historische Erfahrung von Al-Andalus und das friedliche Zusammenspiel der Religionen.",
          tr: "Dinlerin barış içinde etkileşim kurduğu tarihi Endülüs tecrübesi."
        },
        url: "#"
      }
    ],
    bookRecommendations: [
      {
        id: "mod4-b1",
        title: {
          de: "Fihi Ma Fih (Mevlana)",
          tr: "Fihi Ma Fih (Mevlana)"
        },
        author: "Mevlana Celaleddin Rumi",
        description: {
          de: "Ein sufistischer Leitfaden, der die gesamte Menschheit mit Liebe und Verständnis umarmt.",
          tr: "Bütün insanlığı sevgi ve anlayışla kucaklayan tasavvufi rehber."
        }
      }
    ],
    videos: []
  },
  {
    id: "mod-5",
    week: 5,
    title: {
      de: "Modul 5: Dialog aus der Perspektive von Hizmet",
      tr: "Modül 5: Hizmet Perspektifinde Diyalog"
    },
    description: {
      de: "Der Dialogansatz, die Vision und die Praktiken der Hizmet-Bewegung auf institutioneller und individueller Ebene.",
      tr: "Hizmet Hareketi'nin kurumsal ve bireysel düzeydeki diyalog yaklaşımı, vizyonu ve uygulamaları."
    },
    learningTargets: [
      {
        id: "mod5-t1",
        text: {
          de: "Die Dialogvision der Hizmet-Bewegung sowie die Rolle des Dialogs in den Werken und der Praxis des ehrwürdigen Meisters erlernen",
          tr: "Hizmet hareketinin diyalog vizyonunu, Üstad hazretlerinin eserlerinde ve pratiğinde diyaloğun yerini öğrenme"
        }
      },
      {
        id: "mod5-t2",
        text: {
          de: "Die Perspektive und die Dialoginitiativen des Hocaefendi analysieren",
          tr: "Hocaefendi’nin diyalog konusundaki bakış açısını ve diyalog girişimlerini analiz etme"
        }
      }
    ],
    readingMaterials: [
      {
        id: "mod5-r1",
        title: {
          de: "Hizmet und globale Dialogschritte",
          tr: "Hizmet ve Küresel Diyalog Adımları"
        },
        description: {
          de: "Die Philosophie weltweiter Bildungs- und Dialogstiftungen, die von der Bewegung inspiriert wurden.",
          tr: "Hizmet Hareketi'nin dünya çapında başlattığı diyalog ve eğitim vakıflarının felsefesi."
        },
        url: "#"
      }
    ],
    bookRecommendations: [
      {
        id: "mod5-b1",
        title: {
          de: "Friedensbrücken: Weltweite Schulen der Hizmet-Bewegung",
          tr: "Barış Köprüleri: Dünyaya Açılan Hizmet Okulları"
        },
        author: "Kolektif",
        description: {
          de: "Die Geschichte der Schulen, die in verschiedenen Teilen der Welt Samen der Liebe und des Friedens säen.",
          tr: "Farklı coğrafyalarda sevgi ve barış tohumları eken okulların hikayesi."
        }
      }
    ],
    videos: []
  },
  {
    id: "mod-6",
    week: 6,
    title: {
      de: "Modul 6: Dialog in der Praxis",
      tr: "Modül 6: Pratikte Diyalog"
    },
    description: {
      de: "Nachhaltige Dialogkompetenzen im Berufsleben, in Nachbarschaftsbeziehungen und im Alltag.",
      tr: "İş yaşamında, komşuluk ilişkilerinde ve günlük yaşamda sürdürülebilir diyalog kurma becerileri."
    },
    learningTargets: [
      {
        id: "mod6-t1",
        text: {
          de: "Dialog durch Kollegen, Nachbarn und tägliche Begegnungen fördern",
          tr: "İş arkadaşları, komşular ve günlük karşılaşmalar yoluyla diyalog geliştirmek"
        }
      },
      {
        id: "mod6-t2",
        text: {
          de: "Anstandsregeln (Adab), Kommunikationspannen und zu beachtende Maße im Dialog begreifen",
          tr: "Diyalogda adabı muaşeret kuralları, yol kazaları ve dikkat edilmesi gereken ölçüleri kavramak"
        }
      },
      {
        id: "mod6-t3",
        text: {
          de: "Praktische Empfehlungen für den Aufbau dauerhafter und aufrichtiger Freundschaften entwickeln",
          tr: "Kalıcı ve samimi dostluk kurma adına pratik tavsiyeler geliştirmek"
        }
      }
    ],
    readingMaterials: [
      {
        id: "mod6-r1",
        title: {
          de: "Umgangsformen im alltäglichen Dialog",
          tr: "Günlük Diyalogda Adabı Muaşeret"
        },
        description: {
          de: "Gegenseitiger Respekt, Höflichkeit und die richtige Wortwahl im praktischen Zusammensein.",
          tr: "Pratik hayatta karşılıklı saygı, nezaket ve doğru kelime tercihleri."
        },
        url: "#"
      }
    ],
    bookRecommendations: [
      {
        id: "mod6-b1",
        title: {
          de: "Wie man Freunde gewinnt und Menschen beeinflusst",
          tr: "Dost Kazanma ve İnsanları Etkileme Sanatı"
        },
        author: "Dale Carnegie",
        description: {
          de: "Ein globaler Klassiker über Kommunikation und den Aufbau dauerhafter Beziehungen.",
          tr: "İletişimin ve kalıcı bağlar kurmanın küresel klasiklerindendir."
        }
      }
    ],
    videos: []
  },
  {
    id: "mod-7",
    week: 7,
    title: {
      de: "Modul 7: Die Haltung der katholischen, orthodoxen und protestantischen Kirche zum Dialog",
      tr: "Modül 7: Katolik/Ortodoks/Protestan Kilisenin Müslümanlar ile Diyaloğa Bakışı"
    },
    description: {
      de: "Offizielle and praktische Ansätze christlicher Konfessionen zum Dialog mit dem Islam und Muslimen.",
      tr: "Hristiyan mezheplerinin İslam diniyle ve Müslümanlarla diyalog kurmaya yönelik resmi ve pratik yaklaşımları."
    },
    learningTargets: [
      {
        id: "mod7-t1",
        text: {
          de: "Gemeinsame Themen identifizieren, die als Dialoganlass dienen können (Umwelt, Familie, Nachbarschaft, Fasten etc.)",
          tr: "Diyalog vesilesi olabilecek ortak temaları (çevre, aile, komşuluk, oruç vb.) belirlemek"
        }
      },
      {
        id: "mod7-t2",
        text: {
          de: "Wichtige Feiertage in religiösen Kalendern kennenlernen, die Möglichkeiten für den Dialog bieten",
          tr: "Dini takvimlerde diyalog vesilesi olabilecek önemli günler"
        }
      },
      {
        id: "mod7-t3",
        text: {
          de: "Für den Dialog offene christliche Gruppen und herausragende historische Persönlichkeiten im Dialog kennenlernen",
          tr: "Diyaloğa açık hristiyan grupları ve diyalogda öne çıkan tarihi isimleri tanımak"
        }
      }
    ],
    readingMaterials: [
      {
        id: "mod7-r1",
        title: {
          de: "Das II. Vatikanische Konzil und 'Nostra Aetate'",
          tr: "II. Vatikan Konsili ve Nostra Aetate"
        },
        description: {
          de: "Die historische Erklärung über das Verhältnis der katholischen Kirche zu den nichtchristlichen Religionen.",
          tr: "Katolik Kilisesi'nin diğer dinlerle ilişkilerinde dönüm noktası olan bildiri belgesi."
        },
        url: "#"
      }
    ],
    bookRecommendations: [],
    videos: []
  },
  {
    id: "mod-8",
    week: 8,
    title: {
      de: "Modul 8: Grundlegende Themen des Christentums",
      tr: "Modül 8: Hristiyanlığa Dair Temel Konular"
    },
    description: {
      de: "Grundlegende Annahmen, heilige Schriften, Konfessionen und Jenseits- und Gottesdienstverständnis des christlichen Glaubens.",
      tr: "Hristiyan inancının temel kabulleri, kutsal kitapları, mezhepleri ve ibadet anlayışları."
    },
    learningTargets: [
      {
        id: "mod8-t1",
        text: {
          de: "Maria und Jesus aus christlicher Sicht betrachten",
          tr: "Hz. Meryem (as) ve Hz. İsa (as) kavramlarına Hristiyanlık perspektifinden bakış"
        }
      },
      {
        id: "mod8-t2",
        text: {
          de: "Die Struktur der Apostel und der Evangelien (heilige Texte) verstehen",
          tr: "Havariler ve İncillerin (kutsal metinlerin) yapısını anlama"
        }
      },
      {
        id: "mod8-t3",
        text: {
          de: "Christliche Konfessionen, Jenseitsvorstellungen und Gottesdienstformen kennenlernen",
          tr: "Hristiyan mezheplerini, ahiret ve ibadet anlayışlarını tanıma"
        }
      }
    ],
    readingMaterials: [
      {
        id: "mod8-r1",
        title: {
          de: "Christlicher Glaube und Gottesdienst",
          tr: "Hristiyanlık İnanç ve İbadeti"
        },
        description: {
          de: "Eine Zusammenfassung der Geburt, Gestaltung und Hauptkonfessionen des Christentums.",
          tr: "Hristiyanlığın doğuşu, şekillenmesi ve temel mezhepleri hakkında özet."
        },
        url: "#"
      }
    ],
    bookRecommendations: [
      {
        id: "mod8-b1",
        title: {
          de: "Wörterbuch der Weltreligionen",
          tr: "Dünya Dinleri Sözlüğü"
        },
        author: "Günay Tümer, Abdurrahman Küçük",
        description: {
          de: "Eine unparteiische Quelle, die die Glaubenssysteme der Religionen untersucht.",
          tr: "Dinlerin inanç sistemlerini tarafsızca inceleyen başvuru kaynağı."
        }
      }
    ],
    videos: []
  },
  {
    id: "mod-9",
    week: 9,
    title: {
      de: "Modul 9: Die Haltung du Judentums zum Dialog mit Muslimen",
      tr: "Modül 9: Yahudiliğin Müslümanlar ile Diyaloğa Bakışı"
    },
    description: {
      de: "Teile des Judentums, die für den Dialog offen sind, Gemeinsamkeiten in heiligen Schriften und zeitgenössische Interpretationen von Koranversen.",
      tr: "Yahudiliğin diyaloğa açık kesimleri, kutsal metinlerdeki ortak noktalar ve Kur'an ayetlerinin güncel yorumları."
    },
    learningTargets: [
      {
        id: "mod9-t1",
        text: {
          de: "Für den Dialog offene jüdische Gruppen kennenlernen und Kommunikationskanäle identifizieren",
          tr: "Diyaloğa açık Yahudi grupları öğrenme ve iletişim kanallarını tanıma"
        }
      },
      {
        id: "mod9-t2",
        text: {
          de: "Gemeinsame humane Themen in Tora und Koran bestimmen",
          tr: "Tevrat ve Kuran’da geçen ortak insani temaları belirleme"
        }
      },
      {
        id: "mod9-t3",
        text: {
          de: "Zum richtigen Verständnis und zur Exegese von Koranversen über Juden im historischen Kontext beitragen",
          tr: "Kuran’da Yahudilerle ilgili geçen ayetlerin doğru bağlamda anlaşılması ve tefsirini kavrama"
        }
      }
    ],
    readingMaterials: [
      {
        id: "mod9-r1",
        title: {
          de: "Gemeinsame moralische Regeln in Tora und Koran",
          tr: "Tevrat ve Kuran'daki Ortak Ahlaki Kurallar"
        },
        description: {
          de: "Vergleichendes Lesen der heiligen Bücher.",
          tr: "Mukayeseli kutsal kitap okumaları."
        },
        url: "#"
      }
    ],
    bookRecommendations: [],
    videos: []
  },
  {
    id: "mod-10",
    week: 10,
    title: {
      de: "Modul 10: Die Haltung anderer Weltreligionen zum Dialog with Muslimen",
      tr: "Modül 10: Diğer Dünya Dinlerinin ve İnanç Gruplarının Müslümanlar ile Diyaloğa Bakışı"
    },
    description: {
      de: "Konstruktive Beziehungen zu Hinduismus, Buddhismus, verschiedenen Glaubensströmungen sowie deistischen, atheistischen und agnostischen Denkweisen aufbauen.",
      tr: "Hinduizm, Budizm, farklı inanç ekolleri ve deist, ateist, agnostik düşünce yapılarıyla yapıcı ilişkiler kurmak."
    },
    learningTargets: [
      {
        id: "mod10-t1",
        text: {
          de: "Die grundlegenden Ansätze asiatischer Religionen wie Hinduismus und Buddhismus lernen",
          tr: "Hinduizm ve Budizm gibi Asya dinlerinin temel yaklaşımlarını öğrenme"
        }
      },
      {
        id: "mod10-t2",
        text: {
          de: "Die Haltung von Glaubensgemeinschaften wie den Ahmadiyya und Bahai zum Dialog kennenlernen",
          tr: "Ahmedilik ve Bahailik inanç gruplarının diyaloğa bakışını tanıma"
        }
      },
      {
        id: "mod10-t3",
        text: {
          de: "Gesunde Kommunikationsmethoden mit atheistischen, deistischen und agnostischen Gruppen entwickeln",
          tr: "Ateist, deist ve agnostik gruplarla sağlıklı iletişim metotlarını geliştirme"
        }
      }
    ],
    readingMaterials: [
      {
        id: "mod10-r1",
        title: {
          de: "Frieden mit verschiedenen Glaubenswelten",
          tr: "Farklı İnanç Dünyalarıyla Barış"
        },
        description: {
          de: "Der gemeinsame Nenner des Dialogs mit östlicher Weisheit und säkularer Philosophie.",
          tr: "Doğu bilgeliği ve seküler felsefelerle diyaloğun ortak paydası."
        },
        url: "#"
      }
    ],
    bookRecommendations: [],
    videos: []
  },
  {
    id: "mod-11",
    week: 11,
    title: {
      de: "Modul 11: Dialog durch soziale Verantwortung, Menschenrechte und Umweltprojekte",
      tr: "Modül 11: Sosyal Sorumluluk, İnsan Hakları ve Çevre Projeleri Yoluyla Diyalog"
    },
    description: {
      de: "Dialog durch gemeinsames Eintreten gegen humane und ökologische Krisen; Teilen von sozialer und ökologischer Verantwortung.",
      tr: "İnsani ve çevresel krizlere karşı birlikte durarak diyalog kurmak; sosyal ve ekolojik sorumlulukları paylaşmak."
    },
    learningTargets: [
      {
        id: "mod11-t1",
        text: {
          de: "Gemeinsame soziale Verantwortungsprojekte für Menschen mit Behinderungen, Waisenhäuser, Altenheime, Frauenhäuser usw. entwerfen",
          tr: "Engelliler, yetimhaneler, huzurevleri, sığınma evleri vb. yönelik ortak sosyal sorumluluk faaliyetleri tasarlama"
        }
      },
      {
        id: "mod11-t2",
        text: {
          de: "Bewusstsein schaffen für den Menschenrechtsrahmen, Erklärungen und internationale zivilgesellschaftliche Menschenrechtsorganisationen",
          tr: "İnsan hakları çerçevesi, beyannameleri ve uluslararası insan hakları sivil kuruluşları hakkında bilinçlenme"
        }
      },
      {
        id: "mod11-t3",
        text: {
          de: "Planung gemeinsamer, auf Nachhaltigkeit ausgerichteter Aktivitäten anlässlich des Weltwassertags, Umwelttags usw.",
          tr: "Dünya su günü, çevre günü vb. tarihleri değerlendirerek sürdürülebilirlik odaklı ortak faaliyetler planlama"
        }
      }
    ],
    readingMaterials: [
      {
        id: "mod11-r1",
        title: {
          de: "Ökologie und interreligiöses Umweltbewusstsein",
          tr: "Ekoloji ve Dinlerarası Çevre Bilinci"
        },
        description: {
          de: "Der gemeinsame Aufruf aller Religionen zum Umweltschutz und gegen Verschwendung.",
          tr: "Bütün dinlerin çevre koruma ve israf karşıtlığı konusundaki ortak çağrısı."
        },
        url: "#"
      }
    ],
    bookRecommendations: [
      {
        id: "mod11-b1",
        title: {
          de: "Erklärung zum Weltethos",
          tr: "Küresel Ahlak Bildirisi"
        },
        author: "Hans Küng",
        description: {
          de: "Die Deklaration gemeinsamer ethischer Regeln für den Weltfrieden.",
          tr: "Dünya barışı için ortak etik kuralların beyannamesi."
        }
      }
    ],
    videos: []
  },
  {
    id: "mod-12",
    week: 12,
    title: {
      de: "Modul 12: Dialog durch Sport, Kunst und kulturelle Aktivitäten",
      tr: "Modül 12: Spor, Sanat ve Kültürel Faaliyetler Yoluyla Diyalog"
    },
    description: {
      de: "Brücken aus Kultur, Sport und Kunst bauen, die Vielfalt in Bereicherung verwandeln.",
      tr: "Farklılıkları zenginliğe dönüştüren kültür, spor ve sanat köprüleri kurmak."
    },
    learningTargets: [
      {
        id: "mod12-t1",
        text: {
          de: "Praktiken entwickeln, um die verschiedenen Kulturgruppen, die unsere Gesellschaft bilden, kennenzulernen und vorzustellen",
          tr: "Yaşadığımız toplumu oluşturan farklı kültür gruplarını tanıma ve tanıtma pratikleri geliştirme"
        }
      },
      {
        id: "mod12-t2",
        text: {
          de: "Die Feinheiten von Multikulturalität und interkultureller Kommunikation verinnerlichen",
          tr: "Çok kültürlülük ve kültürlerarası iletişimin ipuçlarını özümseme"
        }
      },
      {
        id: "mod12-t3",
        text: {
          de: "Kennenlernen von Veranstaltungsformaten wie Friedens- und Freundschaftsturnieren, Naturwanderungen oder Radtouren",
          tr: "Barış, dostluk temalı turnuvalar, doğa yürüyüşleri, bisiklet turları gibi etkinlik formatlarını öğrenme"
        }
      }
    ],
    readingMaterials: [
      {
        id: "mod12-r1",
        title: {
          de: "Die universelle Sprache von Kultur, Sport und Kunst",
          tr: "Kültür, Spor ve Sanatın Evrensel Dili"
        },
        description: {
          de: "Die Kraft von sportlichen Wettkämpfen und künstlerischen Workshops beim Abbau von Vorurteilen.",
          tr: "Ortak spor müsabakaları ve sanatsal atölyelerin ön yargıları kırmadaki gücü."
        },
        url: "#"
      }
    ],
    bookRecommendations: [],
    videos: []
  },
  {
    id: "mod-13",
    week: 13,
    title: {
      de: "Modul 13: Effektive Dialogkompetenzen",
      tr: "Modül 13: Etkin Diyalog Becerileri"
    },
    description: {
      de: "Fähigkeit, schwierige Themen anzusprechen, gesundes Networking und effektive Dialogmethoden.",
      tr: "Zor konuları konuşabilme, sağlıklı ağ oluşturma (networking) ve etkili diyalog metodolojileri."
    },
    learningTargets: [
      {
        id: "mod13-t1",
        text: {
          de: "Sensibilitäten im Dialog mit Menschen aus verschiedenen Kulturen erlernen",
          tr: "Farklı kültürden insanlarla diyalogda dikkat edilmesi gereken hassasiyetleri öğrenme"
        }
      },
      {
        id: "mod13-t2",
        text: {
          de: "Empfehlungen für effektives Networking und den Aufbau institutioneller Netzwerke entwickeln",
          tr: "Etkili networking ve kurumsal ağ oluşturma adına öneriler geliştirme"
        }
      },
      {
        id: "mod13-t3",
        text: {
          de: "Konstruktive Methoden für Gespräche über schwierige Fragen und Tabuthemen kennenlernen",
          tr: "Zor sorular ve tabu konular üzerine konuşurken uygulanacak yapıcı yöntemleri tanıma"
        }
      }
    ],
    readingMaterials: [
      {
        id: "mod13-r1",
        title: {
          de: "Leitfaden zur Beantwortung schwieriger Fragen",
          tr: "Zor Soruları Cevaplama Rehberi"
        },
        description: {
          de: "Konstruktive Dialogtaktiken gegen voreingenommene oder provokative Fragen.",
          tr: "Ön yargı içeren veya provoke amaçlı sorulara karşı geliştirilecek yapıcı diyalog taktikleri."
        },
        url: "#"
      }
    ],
    bookRecommendations: [
      {
        id: "mod13-b1",
        title: {
          de: "Die Kunst des Verhandelns",
          tr: "Müzakere Sanatı"
        },
        author: "Roger Fisher",
        description: {
          de: "Wissenschaftliche Wege zur Überwindung von Meinungsverschiedenheiten durch Dialog.",
          tr: "Anlaşmazlıkları diyalogla aşmanın bilimsel yolları."
        }
      }
    ],
    videos: []
  },
  {
    id: "mod-14",
    week: 14,
    title: {
      de: "Modul 14: Dialogkultur und Qualität im Dialog",
      tr: "Modül 14: Diyalog Kültürü ve Diyalogda Kalite"
    },
    description: {
      de: "Qualitätssteigerung in der Dialogarbeit, Entwicklung von Standards und Initiierung lokaler Kooperationen.",
      tr: "Diyalog çalışmalarında niteliği artırmak, standartlar geliştirmek ve yerel işbirlikleri üretmek."
    },
    learningTargets: [
      {
        id: "mod14-t1",
        text: {
          de: "Definition von Qualität im Dialog und Erstellung des entsprechenden Rahmens",
          tr: "Diyalogda kalite tanımı ve bunun çerçevesini oluşturma"
        }
      },
      {
        id: "mod14-t2",
        text: {
          de: "Produktion hochwertiger Dialoginhalte und -programme sowie Festlegung von Schlüsselzielen",
          tr: "Kaliteli diyalog içerikleri, programları üretme ve kilit hedefler belirleme"
        }
      },
      {
        id: "mod14-t3",
        text: {
          de: "Entwicklung einer nachhaltigen Zusammenarbeit mit lokalen Partnern auf zivilgesellschaftlicher Ebene",
          tr: "Yerel partnerlerle sivil düzeyde sürdürülebilir işbirliği geliştirme"
        }
      }
    ],
    readingMaterials: [
      {
        id: "mod14-r1",
        title: {
          de: "Institutioneller Dialog und Qualitätsstandards",
          tr: "Kurumsal Diyalog ve Kalite Standartları"
        },
        description: {
          de: "Ein Leitfaden für die Akkreditierung von Dialogvereinen.",
          tr: "Diyalog derneklerinin verimli çalışması için kurumsal akreditasyon rehberi."
        },
        url: "#"
      }
    ],
    bookRecommendations: [],
    videos: []
  },
  {
    id: "mod-15",
    week: 15,
    title: {
      de: "Modul 15: Häufig gestellte Fragen zum Thema Frau im Islam",
      tr: "Modül 15: İslam’da Kadın Konusunda Sıkça Sorulanlar"
    },
    description: {
      de: "Aufklärung über Frauenrechte, Polygamie sowie historische zivile und rechtliche Institutionen im Rahmen des islamischen Denkens.",
      tr: "İslam düşüncesi çerçevesinde kadın hakları, çok eşlilik, tarihi sivil ve hukuki müesseseler üzerine bilgilendirme."
    },
    learningTargets: [
      {
        id: "mod15-t1",
        text: {
          de: "Frauenrechte im Islam und das Verständnis des geschlechtlichen Gleichgewichts erlernen",
          tr: "İslam'da temel kadın hakları ve toplumsal cinsiyet dengesini öğrenme"
        }
      },
      {
        id: "mod15-t2",
        text: {
          de: "Den historischen Kontext der Polygamie und der Ehen des Propheten (s.a.w.) verstehen",
          tr: "Çok eşlilik ve Peygamberimiz’in (sav) gerçekleştirdiği evliliklerin tarihi bağlamını anlama"
        }
      },
      {
        id: "mod15-t3",
        text: {
          de: "Die historische Entwicklung der Sklaven- und Konkubinenwirtschaft und die Haltung des Islams zu diesen Institutionen verstehen",
          tr: "Kölelik ve cariyelik müessesesinin tarihi gelişimini ve İslamiyet'in bu kurumlara yaklaşımını öğrenme"
        }
      }
    ],
    readingMaterials: [
      {
        id: "mod15-r1",
        title: {
          de: "Islam und Frauenrechte im gesellschaftlichen Leben",
          tr: "Sosyal Yaşamda İslam ve Kadın Hakları"
        },
        description: {
          de: "Wissenschaftliche Erklärungen zu historischen Missverständnissen.",
          tr: "Tarihsel yanılgılara karşı akademik açıklamalar."
        },
        url: "#"
      }
    ],
    bookRecommendations: [],
    videos: []
  },
  {
    id: "mod-16",
    week: 16,
    title: {
      de: "Modul 16: Häufig gestellte Fragen zum Verhältnis von Staat und Individuum im Islam",
      tr: "Modül 16: İslam’da Devlet Birey Münasebeti Konusunda Sıkça Sorulanlar"
    },
    description: {
      de: "Islamische Staatstheorie, korrekte Analyse des Scharia-Begriffs, Untersuchung von Demokratie- und Säkularismusvorstellungen.",
      tr: "İslam siyaset teorisi, Şeriat kavramının doğru tahlili, Demokrasi ve Laiklik algılarının analizi."
    },
    learningTargets: [
      {
        id: "mod16-t1",
        text: {
          de: "Das Staats- und Politikverständnis im Islam sowie die korrekte Bedeutung des Scharia-Begriffs begreifen",
          tr: "İslam'da Devlet ve Siyaset anlayışı ile Şeriat kavramının doğru anlamını kavrama"
        }
      },
      {
        id: "mod16-t2",
        text: {
          de: "Historisch-theoretischer Vergleich der Institution des Kalifats und des Konzepts des Säkularismus (Laizismus)",
          tr: "Hilafet kuruluşu ve Laiklik kavramlarının tarihsel-teorik dengesini mukayese etme"
        }
      },
      {
        id: "mod16-t3",
        text: {
          de: "Vereinbarkeit von Islam und Demokratie sowie die Rechte der Zivilgesellschaft bewerten",
          tr: "İslam ve Demokrasi uyumu ile sivil toplum haklarını değerlendirme"
        }
      }
    ],
    readingMaterials: [
      {
        id: "mod16-r1",
        title: {
          de: "Islam, Demokratie und die moderne Gesellschaft",
          tr: "İslam, Demokrasi ve Çağdaş Toplum"
        },
        description: {
          de: "Die Beziehungen zwischen Religion und Staat sowie die Rolle des religiösen Menschen in einer demokratischen Bürgergesellschaft.",
          tr: "Din-devlet ilişkileri ve demokratik bir toplumda dindarların sivil rolü."
        },
        url: "#"
      }
    ],
    bookRecommendations: [],
    videos: []
  }
];
