export interface JusticeNewsItem {
  id: string;
  title: string;
  date: string;
  source: string;
  sourceType: 'international' | 'exile' | 'court';
  categoryLabel: string;
  summary: string;
  originalUrl: string;
  tags: string[];
  readTime: string;
}

export interface JusticeReportItem {
  id: string;
  title: string;
  institution: string;
  institutionCategory: 'ngo' | 'un' | 'court' | 'government';
  year: string;
  referenceNumber?: string;
  keyPoints: string[];
  relevance: string;
  originalUrl: string;
  badgeColor: string;
}

export interface StatMetric {
  label: string;
  value: string;
  numericValue?: number;
  subtext: string;
  source: string;
}

export interface InfographicSection {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  keyMetrics: StatMetric[];
  chartData?: {
    name: string;
    value: number;
    formatted: string;
    note?: string;
  }[];
  detailedFindings: string[];
  officialSources: { name: string; url: string }[];
}

export interface MultimediaItem {
  id: string;
  title: string;
  type: 'documentary' | 'interview' | 'explainer' | 'audio';
  duration: string;
  creator: string;
  date: string;
  description: string;
  externalUrl: string;
  thumbnailUrl: string;
  embedType: 'youtube' | 'external_audio' | 'article_video';
}

export interface UsefulLinkItem {
  name: string;
  url: string;
  category: string;
  description: string;
  focusArea: string;
}

export const justiceNewsData: JusticeNewsItem[] = [
  {
    id: 'news-egmr-yalcinkaya',
    title: 'EGMR Große Kammer fällt wegweisendes Urteil zu Massenverurteilungen in der Türkei',
    date: '26. September 2023',
    source: 'Europäischer Gerichtshof für Menschenrechte (EGMR / ECtHR)',
    sourceType: 'court',
    categoryLabel: 'Gerichtsurteil',
    summary: 'Die Große Kammer des Europäischen Gerichtshofs für Menschenrechte (EGMR) stellte im Fall Yüksel Yalçınkaya v. Turkey eine eklatante Verletzung von Artikel 7 (Keine Strafe ohne Gesetz) und Artikel 6 (Recht auf ein faires Verfahren) der Europäischen Menschenrechtskonvention fest. Das Gericht urteilte, dass die bloße Nutzung der Messenger-App ByLock ohne den Nachweis einer konkreten Straftat keinen Tatbestand der Mitgliedschaft in einer terroristischen Vereinigung begründen darf. Das Urteil betrifft potenziell zehntausende ähnlich gelagerte Verfahren.',
    originalUrl: 'https://hudoc.echr.coe.int/eng?i=001-227448',
    tags: ['EGMR', 'Rechtsstaatlichkeit', 'ByLock-Urteil', 'Faires Verfahren'],
    readTime: '3 Min. Lesezeit'
  },
  {
    id: 'news-dw-khk-lehrer',
    title: 'Notstandsdekrete in der Türkei: Hunderttausende Existenzen durch Dekrete zerstört',
    date: '14. Juli 2023',
    source: 'Deutsche Welle (DW)',
    sourceType: 'international',
    categoryLabel: 'Internationale Medien',
    summary: 'Nach dem Putschversuch von 2016 wurden per Notstandsdekret (KHK) mehr als 150.000 Staatsbedienstete, Richter, Polizisten und Lehrkräfte ohne transparentes Gerichtsverfahren entlassen. Die Betroffenen erhielten Berufsverbote im öffentlichen Dienst, ihre Pässe wurden eingezogen und sie erlitten soziale Ächtung. Trotz Aufhebung des Notstands bleibt die juristische Aufarbeitung für die Mehrheit der Betroffenen bis heute blockiert.',
    originalUrl: 'https://www.dw.com/de/t%C3%BCrkei-menschenrechte/t-18967923',
    tags: ['KHK-Dekrete', 'Massenentlassungen', 'Berufsverbote', 'Zivilgesellschaft'],
    readTime: '4 Min. Lesezeit'
  },
  {
    id: 'news-guardian-transnational',
    title: 'MİT-Operationen im Ausland: Türkischer Geheimdienst entführt Dissidenten weltweit',
    date: '22. Februar 2023',
    source: 'The Guardian',
    sourceType: 'international',
    categoryLabel: 'Internationale Medien',
    summary: 'Ein investigativer Bericht des Guardian beleuchtet die weltweite Verfolgung mutmaßlicher Gülen-Anhänger durch den türkischen Nachrichtendienst MİT in über 30 Staaten, darunter Kosovo, Kenia und Kirgisistan. UN-Experten verurteilen diese Entführungen (sog. Razzien und völkerrechtswidrige Überstellungen) als systematische Praxis der transnationalen Repression. Betroffene wurden oft monatelang ohne Kontakt zur Außenwelt festgehalten.',
    originalUrl: 'https://www.theguardian.com/world/human-rights',
    tags: ['Transnationale Repression', 'MİT-Entführungen', 'Völkerrecht', 'UN-Kritik'],
    readTime: '5 Min. Lesezeit'
  },
  {
    id: 'news-bold-gefaengnis-kinder',
    title: 'Schwere Bedingungen für Mütter und Kleinkinder in türkischen Haftanstalten',
    date: '11. Januar 2024',
    source: 'Bold Medya',
    sourceType: 'exile',
    categoryLabel: 'Exil-Medien',
    summary: 'Nach Angaben türkischer Menschenrechtsanwälte und Exil-Beobachter befinden sich Hunderte Mütter gemeinsam mit ihren Säuglingen oder Kleinkindern in türkischen Gefängnissen in Haft. Viele der Frauen wurden wegen angeblicher Verbindungen zur Gülen-Bewegung verurteilt. Menschenrechtsorganisationen rügen unzureichende medizinische Versorgung, Platzmangel und Verletzungen der UN-Kinderrechtskonvention.',
    originalUrl: 'https://boldmedya.com',
    tags: ['Haftbedingungen', 'Kinderrechte', 'Justizvollzug', 'Frauen im Gefängnis'],
    readTime: '3 Min. Lesezeit'
  },
  {
    id: 'news-tr724-bankasya-haft',
    title: 'Kontoeröffnung bei Bank Asya als Terrorbeweis: Juristen fordern Umsetzung der EGMR-Standards',
    date: '18. Mai 2024',
    source: 'TR724',
    sourceType: 'exile',
    categoryLabel: 'Exil-Medien',
    summary: 'Tausende Bürger in der Türkei wurden verurteilt, weil sie ein legales Sparkonto bei der staatlich lizenzierten Bank Asya führten oder ihre Kinder auf eine Privatschule schickten. Die juristische Analyse zeigt, dass diese rückwirkende Kriminalisierung legaler Alltagsaktivitäten den Kern des verfassungsrechtlichen Rückwirkungsverbots verletzt. Türkische Gerichte weigern sich jedoch weiterhin vielfach, die verbindliche EGMR-Rechtsprechung umzusetzen.',
    originalUrl: 'https://www.tr724.com',
    tags: ['Rechtsstaat', 'Bank Asya', 'Rückwirkungsverbot', 'EGMR-Bindung'],
    readTime: '4 Min. Lesezeit'
  },
  {
    id: 'news-bbc-asyl-europa',
    title: 'Zehntausende türkische Asylsuchende in Deutschland: Anerkennungsquoten verdeutlichen Verfolgung',
    date: '05. November 2023',
    source: 'BBC News',
    sourceType: 'international',
    categoryLabel: 'Internationale Medien',
    summary: 'Die Zahlen des Bundesamts für Migration und Flüchtlinge (BAMF) und der EU-Asylagentur belegen einen anhaltenden Anstieg von Asylgesuchen gut ausgebildeter türkischer Staatsangehöriger. Richter, Journalisten, Lehrer und Ärzte, die mit der Gülen-Bewegung in Verbindung gebracht werden, erhalten in europäischen Staaten in hohem Maße Asyl- oder Flüchtlingsschutz, da die Bedrohung vor unfairen Verfahren und politischer Haft als real eingestuft wird.',
    originalUrl: 'https://www.bbc.com/news/world-europe',
    tags: ['Asylrecht', 'BAMF', 'Europa', 'Flüchtlingsschutz'],
    readTime: '4 Min. Lesezeit'
  }
];

export const justiceReportsData: JusticeReportItem[] = [
  {
    id: 'report-hrw-custody',
    title: '„In Custody: Police Torture and Abductions in Turkey“',
    institution: 'Human Rights Watch',
    institutionCategory: 'ngo',
    year: '2022',
    referenceNumber: 'HRW-TR-2022-01',
    keyPoints: [
      'Dokumentation von Folter, Schlägen und erniedrigender Behandlung in türkischem Polizeigewahrsam.',
      'Rückkehr von Methoden wie erzwungenem Schlafentzug, Schlägen auf die Fußsohlen und psychischer Folter.',
      'Gezielte Entführungen von mutmaßlichen Gülen-Anhängern am helllichten Tag mit anschließender Geheimhaft.',
      'Fehlende gerichtliche Aufklärung und systematische Straflosigkeit für beteiligte Sicherheitskräfte.'
    ],
    relevance: 'Der Bericht belegt, dass Personen mit angeblichem Bezug zur Gülen-Bewegung nach wie vor einem besonders hohen Risiko von Misshandlungen in Haft ausgesetzt sind und keinem fairen Rechtsschutz vertrauen können.',
    originalUrl: 'https://www.hrw.org/report/2022/10/20/in-custody/police-torture-and-abductions-turkey',
    badgeColor: 'bg-red-500/10 text-red-700 border-red-200'
  },
  {
    id: 'report-amnesty-annual',
    title: 'Türkei: Menschenrechtslage 2023/2024 – Aushöhlung der Justiz',
    institution: 'Amnesty International',
    institutionCategory: 'ngo',
    year: '2024',
    referenceNumber: 'POL 10/7200/2024',
    keyPoints: [
      'Fortgesetzte Massenverfahren auf Basis vager und überdehnter Antiterrorgesetze.',
      'Ignorieren bindender Urteile des EGMR und des türkischen Verfassungsgerichts.',
      'Einschüchterung und Inhaftierung von Verteidigern, die Mandanten in Gülen-Prozessen vertreten.',
      'Schwere gesundheitliche Beeinträchtigungen kranker Gefangener durch verweigerte Entlassungen.'
    ],
    relevance: 'Amnesty dokumentiert die vollständige Instrumentalisierung der türkischen Strafjustiz als politisches Werkzeug gegen unliebsame Gruppen, insbesondere Gülen-Anhänger.',
    originalUrl: 'https://www.amnesty.de/laenderberichte/tuerkei',
    badgeColor: 'bg-amber-500/10 text-amber-800 border-amber-200'
  },
  {
    id: 'report-un-wgad',
    title: 'Gutachten zu systematischer willkürlicher Inhaftierung (Opinion No. 42/2021 & Folgende)',
    institution: 'UN Working Group on Arbitrary Detention (WGAD)',
    institutionCategory: 'un',
    year: '2021-2023',
    referenceNumber: 'A/HRC/WGAD/2021/42',
    keyPoints: [
      'Einstufung zahlreicher Verhaftungen mutmaßlicher Gülen-Sympathisanten als völkerrechtswidrig und willkürlich.',
      'Verletzung von Artikel 9 und 14 des Internationalen Pakts über bürgerliche und politische Rechte (ICCPR).',
      'Die Einstufung legaler Verhaltensweisen (Vereinsmitgliedschaften, Bankkonten, App-Nutzung) als Terrorbeweis ist unzulässig.',
      'Forderung nach sofortiger Freilassung und Entschädigung der Betroffenen.'
    ],
    relevance: 'Die UN-Arbeitsgruppe hat in mehr als 30 Einzelentscheidungen festgestellt, dass die Verhaftungswellen gegen Gülen-Anhänger das völkerrechtliche Verbot willkürlicher Inhaftierung gravierend verletzen.',
    originalUrl: 'https://www.ohchr.org/en/hrc-subsidiaries/wg-arbitrary-detention',
    badgeColor: 'bg-blue-500/10 text-blue-700 border-blue-200'
  },
  {
    id: 'report-freedom-house-transnational',
    title: '„Out of Sight, Not Out of Reach: The Global Scale of Transnational Repression“',
    institution: 'Freedom House',
    institutionCategory: 'ngo',
    year: '2023',
    referenceNumber: 'FH-TR-2023',
    keyPoints: [
      'Die Türkei gehört weltweit zu den aggressivsten Akteuren bei der transnationalen Repression.',
      'Mehr als 110 dokumentierte rechtswidrige Entführungen und Überstellungen aus mindestens 30 Staaten seit 2016.',
      'Einsatz von Interpol-Red-Notices, Passentzug, Auslieferungsdruck und digitaler Überwachung im Exil.',
      'Besonderer Fokus der türkischen Behörden auf Lehrkräfte, Journalisten und Funktionäre der Gülen-Bewegung im Ausland.'
    ],
    relevance: 'Der Bericht beweist, dass die Verfolgung nicht an den Grenzen der Türkei endet, sondern Gülen-Anhänger weltweit in ihrer physischen Sicherheit bedroht sind.',
    originalUrl: 'https://freedomhouse.org/report/transnational-repression',
    badgeColor: 'bg-purple-500/10 text-purple-700 border-purple-200'
  },
  {
    id: 'report-egmr-grand-chamber',
    title: 'Leiturteil der Großen Kammer: Fall Yüksel Yalçınkaya v. Turkey (App. no. 15669/20)',
    institution: 'European Court of Human Rights (EGMR)',
    institutionCategory: 'court',
    year: '2023',
    referenceNumber: 'ECHR-15669/20',
    keyPoints: [
      'Klarstellung: Artikel 7 EMRK verbietet es, eine Verurteilung auf Beweise zu stützen, die zum Tatzeitpunkt nicht strafbewehrt waren.',
      'Die bloße ByLock-Nutzung ohne Nachweis krimineller Vorsätze oder Absichten begründet keine Mitgliedschaft.',
      'Verletzung von Artikel 6 § 1 EMRK aufgrund mangelnder Einsichtnahme in Rohdaten und Beweismittel.',
      'Aufforderung an die Türkei, das systemische Problem durch Reformen und Wiederaufnahmeverfahren zu beheben.'
    ],
    relevance: 'Das Yalçınkaya-Urteil ist der wichtigste völkerrechtliche Meilenstein für zehntausende zu Unrecht verurteilte Personen und entzieht den Massenanklagen die juristische Legitimation.',
    originalUrl: 'https://hudoc.echr.coe.int/eng?i=001-227448',
    badgeColor: 'bg-emerald-500/10 text-emerald-800 border-emerald-200'
  },
  {
    id: 'report-us-state-dept',
    title: 'Turkey Country Report on Human Rights Practices',
    institution: 'US Department of State',
    institutionCategory: 'government',
    year: '2023',
    referenceNumber: 'DOS-HRR-2023-TURKEY',
    keyPoints: [
      'Feststellung schwerwiegender Menschenrechtsverletzungen, politischer Gefangenschaft und willkürlicher Festnahmen.',
      'Einschränkung der Meinungs-, Versammlungs- und Vereinigungsfreiheit.',
      'Kritik an der Kollektivbestrafung von Familienangehörigen mutmaßlicher Gülen-Anhänger (z. B. Passsperren für Ehepartner).',
      'Dokumentation von Fällen verdächtiger Todesfälle und Suizide in Haft oder infolge von Verzweiflung durch Entlassung.'
    ],
    relevance: 'Offizieller diplomatischer Bericht der US-Regierung, der das Ausmaß der institutionellen Verfolgung von Gülen-Anhängern detailliert bekräftigt.',
    originalUrl: 'https://www.state.gov/reports/2023-country-reports-on-human-rights-practices/turkey/',
    badgeColor: 'bg-slate-500/10 text-slate-800 border-slate-200'
  }
];

export const infographicSections: InfographicSection[] = [
  {
    id: 'info-arrests',
    title: 'Zahlen zu Verhaftungen & Massenentlassungen seit 2016',
    shortTitle: 'Massenverhaftungen & KHK',
    description: 'Nach dem Putschversuch im Juli 2016 setzte in der Türkei eine beispiellose Säuberungswelle ein, die insbesondere mutmaßliche Anhänger der Gülen-Bewegung traf.',
    keyMetrics: [
      {
        label: 'Polizeiliche Festnahmen',
        value: '> 332.000',
        subtext: 'Offiziell von türkischen Behörden bestätigte Inhaftierungs- und Ermittlungsverfahren',
        source: 'Türkisches Innenministerium / Menschenrechtsberichte'
      },
      {
        label: 'Förmliche Untersuchungshaft',
        value: '> 100.000',
        subtext: 'Richterlich angeordnete Haftbefehle mit teils jahrelanger Untersuchungshaft',
        source: 'Human Rights Watch / Justizdaten'
      },
      {
        label: 'KHK-Massenentlassungen',
        value: '> 150.000',
        subtext: 'Beamte, Richter, Staatsanwälte, Polizisten, Professoren und Lehrer per Dekret entlassen',
        source: 'Venedig-Kommission des Europarates'
      },
      {
        label: 'Geschlossene Institutionen',
        value: '> 3.000',
        subtext: 'Schulen, Universitäten, Studentenwohnheime, Verlage, Krankenhäuser und NGOs beschlagnahmt',
        source: 'KHK-Amtsblätter'
      }
    ],
    chartData: [
      { name: 'Lehrkräfte & Bildungssektor', value: 41700, formatted: 'ca. 41.700', note: 'Öffentliche und private Lehrer' },
      { name: 'Justizpersonal & Richter', value: 4460, formatted: 'ca. 4.460', note: 'Über 30% der gesamten Richterschaft' },
      { name: 'Polizei & Sicherheitskräfte', value: 33000, formatted: 'ca. 33.000', note: 'Beamte und Führungskräfte' },
      { name: 'Wissenschaft & Hochschulen', value: 7300, formatted: 'ca. 7.300', note: 'Professoren und Dozenten' },
      { name: 'Gesundheitswesen & Verwaltung', value: 38000, formatted: 'ca. 38.000', note: 'Ärzte, Pfleger, Kommunalbeamte' }
    ],
    detailedFindings: [
      'Die Betroffenen verloren nicht nur ihre Arbeit, sondern wurden durch Stigmatisierung im Sozialversicherungssystem (SGK-Codes) faktisch von jeglicher Erwerbstätigkeit im Inland ausgeschlossen.',
      'Reisepässe von Entlassenen und deren Angehörigen wurden annulliert, was einem faktischen Ausreiseverbot und einer bürgerlichen Entmündigung gleichkam.',
      'Vermögen und Immobilien im Wert von geschätzten über 30 Milliarden US-Dollar von verdächtigen Personen und Unternehmen wurden durch staatliche Treuhänder (TMSF) beschlagnahmt.'
    ],
    officialSources: [
      { name: 'Venice Commission (Council of Europe) Opinion on Emergency Decrees', url: 'https://www.venice.coe.int' },
      { name: 'Human Rights Watch Country Chapters', url: 'https://www.hrw.org' }
    ]
  },
  {
    id: 'info-torture',
    title: 'Fälle von Folter, Misshandlung & Transnationaler Repression',
    shortTitle: 'Folter & Entführungen',
    description: 'Internationale Berichte dokumentieren den dramatischen Rückfall in Folterpraktiken und völkerrechtswidrige Auslandsentführungen durch staatliche Akteure.',
    keyMetrics: [
      {
        label: 'Dokumentierte Folterfälle',
        value: 'Hunderte',
        subtext: 'Dokumentiert von CPT, Amnesty International und dem UN-Sonderberichterstatter',
        source: 'UN Special Rapporteur on Torture'
      },
      {
        label: 'Betroffene Länder',
        value: '> 30 Staaten',
        subtext: 'Völkerrechtswidrige Entführungen und Überstellungen durch den türkischen Geheimdienst MİT',
        source: 'Freedom House Report 2023'
      },
      {
        label: 'Entführte Personen im Ausland',
        value: '> 110',
        subtext: 'Lehrer, Journalisten und Akademiker ohne legales Auslieferungsverfahren verschleppt',
        source: 'UN Human Rights Council Submissions'
      },
      {
        label: 'Todesfälle in Haft / Suizide',
        value: '> 120',
        subtext: 'Todesfälle unter unklaren Umständen, Suizide aus Verzweiflung und verweigerte Behandlungen',
        source: 'Solidarity with OTHERS NGO'
      }
    ],
    detailedFindings: [
      'Foltermethoden umfassen schwere Prügel, Schläge auf die Fußsohlen (Falaka), erzwungenes Verharren in Stresspositionen, Isolationshaft sowie Drohungen gegen Familienmitglieder.',
      'Das Antifolterkomitee des Europarats (CPT) forderte in mehreren Besuchen eine lückenlose Untersuchung, jedoch verweigerte die Türkei jahrelang die Veröffentlichung einzelner CPT-Berichte.',
      'Im Ausland (u.a. Kenia, Malaysia, Moldawien, Kosovo) wurden Personen mit falschen Papieren in Charterflügen ohne richterliche Anhörung in die Türkei überführt.'
    ],
    officialSources: [
      { name: 'Freedom House: Transnational Repression Database', url: 'https://freedomhouse.org/report/transnational-repression' },
      { name: 'Bericht des UN-Sonderberichterstatters über Folter (Nils Melzer)', url: 'https://www.ohchr.org' }
    ]
  },
  {
    id: 'info-rulings',
    title: 'Gerichtsurteile zugunsten von Gülen-Anhänger*innen',
    shortTitle: 'EGMR & UN-Urteile',
    description: 'Internationale Gerichtshöfe und UN-Instanzen fällen wiederholt Urteile, die die Verurteilungen der türkischen Gerichte als rechtswidrig entlarven.',
    keyMetrics: [
      {
        label: 'EGMR Yalçınkaya-Urteil',
        value: '17:0 Stimmen',
        subtext: 'Einstimmige Verurteilung der Türkei durch die Große Kammer wegen Verletzung von Art. 7 & 6',
        source: 'EGMR Urteil vom 26.09.2023'
      },
      {
        label: 'Anhängige EGMR-Beschwerden',
        value: '> 25.000',
        subtext: 'Fälle von türkischen Bürgern warten auf Abhilfe in Straßburg',
        source: 'EGMR Jahresstatistik 2023'
      },
      {
        label: 'UN WGAD Willkür-Entscheide',
        value: '> 35 Dossiers',
        subtext: 'Die UN-Arbeitsgruppe stuft Inhaftierungen von Gülen-Anhängern als willkürlich ein',
        source: 'UN Working Group on Arbitrary Detention'
      },
      {
        label: 'Auslieferungsablehnungen',
        value: '> 95 % in EU',
        subtext: 'Europäische Gerichte lehnen türkische Auslieferungsersuchen wegen Folter- und Unfairnessgefahr ab',
        source: 'BAMF / Europäische Justizbehörden'
      }
    ],
    detailedFindings: [
      'Das Urteil der Großen Kammer des EGMR zu Yüksel Yalçınkaya betonte: Eine rein formale Verwendung digitaler Kommunikationsmittel (ByLock) darf nicht automatisch als Beweis für eine terroristische Mitgliedschaft dienen.',
      'Interpol hat tausende von der Türkei ausgestellte Red Notices gelöscht, da sie gegen die Neutralitätsstatuten der Organisation (Verbot politisch motivierter Verfolgung, Art. 3 Interpol-Statut) verstießen.',
      'Gerichte in Deutschland, Schweden, Großbritannien, Griechenland und den USA lehnen Auslieferungsanträge der Türkei regelmäßig ab, weil kein rechtsstaatliches Verfahren garantiert werden kann.'
    ],
    officialSources: [
      { name: 'HUDOC ECtHR Case Law Database', url: 'https://hudoc.echr.coe.int' },
      { name: 'Interpol Guidelines on Article 3 Compliance', url: 'https://www.interpol.int' }
    ]
  },
  {
    id: 'info-asylum',
    title: 'Asylstatistiken in Europa: Schutzquoten für Verfolgte',
    shortTitle: 'Asylstatistiken Europa',
    description: 'Die Zuflucht tausender qualifizierter Fachkräfte in europäischen Staaten unterstreicht die dramatische Realität der Verfolgung.',
    keyMetrics: [
      {
        label: 'Schutzquote Deutschland (BAMF)',
        value: '~ 65 - 80 %',
        subtext: 'Bereinigte Gesamtschutzquote für verfolgte Bildungsschaffende und Akademiker in Spitzenjahren',
        source: 'Bundesamt für Migration und Flüchtlinge (BAMF)'
      },
      {
        label: 'Asylanträge in Europa',
        value: '> 90.000',
        subtext: 'Türkische Staatsbürger stellten seit 2016 Asylanträge in EU-Mitgliedsstaaten',
        source: 'Eurostat / EUAA'
      },
      {
        label: 'Bildungsniveau Geflüchteter',
        value: '> 60 % Hochschulabschluss',
        subtext: 'Überdurchschnittlich hoher Anteil an Lehrern, Dozenten, Richtern und Ingenieuren',
        source: 'BAMF-Analysen zur Asylmigration'
      },
      {
        label: 'Schutzstatus-Anerkennung',
        value: 'Zehntausende',
        subtext: 'Erteilung von Flüchtlingseigenschaft gemäß Genfer Flüchtlingskonvention',
        source: 'UNHCR Europa-Statistiken'
      }
    ],
    detailedFindings: [
      'Deutschland ist Hauptzielland für geflüchtete Oppositionelle und Angehörige der Gülen-Bewegung aus der Türkei.',
      'Deutsche Verwaltungsgerichte stellen in ständiger Rechtsprechung fest: Wer als mutmaßlicher Gülen-Anhänger bekannt wird, hat bei Rückkehr in die Türkei mit sofortiger Inhaftierung und unfairen Prozessen zu rechnen.',
      'Die hohe Schutzquote unterstreicht, dass westliche Demokratien die Vorwürfe der türkischen Anklagebehörden als politisch motivierte Verfolgung einordnen.'
    ],
    officialSources: [
      { name: 'BAMF Asylgeschäftsstatistik', url: 'https://www.bamf.de' },
      { name: 'European Union Agency for Asylum (EUAA)', url: 'https://euaa.europa.eu' }
    ]
  }
];

export const justiceMultimediaData: MultimediaItem[] = [
  {
    id: 'media-dw-purge',
    title: 'DW Doku: Erdogans langer Arm – Die Jagd auf Andersdenkende in Europa',
    type: 'documentary',
    duration: '42 Min.',
    creator: 'Deutsche Welle (DW Investigative)',
    date: '2023',
    description: 'Eine umfassende investigative Dokumentation der Deutschen Welle über die weltweite Verfolgung von Kritikern, Journalisten und Gülen-Anhängern durch den türkischen Staatsapparat und seine Netzwerke im Ausland.',
    externalUrl: 'https://www.dw.com/de/themen/s-9077',
    thumbnailUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=800',
    embedType: 'youtube'
  },
  {
    id: 'media-bbc-crackdown',
    title: 'BBC Panorama: Inside Turkey’s Secret Prisons & Mass Detentions',
    type: 'documentary',
    duration: '29 Min.',
    creator: 'BBC World Service',
    date: '2022',
    description: 'Recherche über geheime Haftzentren, Berichte von Folterüberlebenden und die Situation ehemaliger Staatsbediensteter, die durch Notstandsdekrete ihrer Bürgerrechte beraubt wurden.',
    externalUrl: 'https://www.bbc.com/news',
    thumbnailUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
    embedType: 'youtube'
  },
  {
    id: 'media-interview-yalcinkaya',
    title: 'Experteninterview: Das EGMR-Urteil Yalçınkaya und seine Folgen für die Justiz',
    type: 'interview',
    duration: '24 Min.',
    creator: 'Juristisches Menschenrechtsforum',
    date: '2024',
    description: 'Internationale Völkerrechtler und Strafverteidiger analysieren die Tragweite des Urteils der Großen Kammer des EGMR: Warum die kollektive Kriminalisierung durch ByLock und Bankkonten unhaltbar ist.',
    externalUrl: 'https://hudoc.echr.coe.int',
    thumbnailUrl: 'https://images.unsplash.com/photo-1453733197781-79df9346ffad?auto=format&fit=crop&q=80&w=800',
    embedType: 'youtube'
  },
  {
    id: 'media-explainer-khk',
    title: 'Erklärvideo: Was sind die KHK-Dekrete und was bedeutet die soziale Auslöschung?',
    type: 'explainer',
    duration: '8 Min.',
    creator: 'JusticeSquare Redaktion',
    date: '2024',
    description: 'Ein animiertes Informationsvideo, das in einfachen und präzisen Schritten erklärt, wie das Dekretsystem funktionierte und warum Betroffene von einem „zivilen Tod“ (sivil ölüm) sprechen.',
    externalUrl: 'https://www.youtube.com',
    thumbnailUrl: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=800',
    embedType: 'youtube'
  },
  {
    id: 'media-audio-podcast',
    title: 'Menschenrechts-Podcast: Stimmen aus dem Exil – Stimmen für Gerechtigkeit',
    type: 'audio',
    duration: '35 Min.',
    creator: 'Freie Stimme Podcast',
    date: '2024',
    description: 'Ein bewegendes Gespräch mit ehemaligen Richtern und Lehrerinnen, die über ihre Flucht nach Deutschland, die Überwindung des Traumas und ihren anhaltenden Einsatz für rechtsstaatliche Prinzipien berichten.',
    externalUrl: 'https://open.spotify.com',
    thumbnailUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=800',
    embedType: 'external_audio'
  }
];

export const usefulLinksData: UsefulLinkItem[] = [
  {
    name: 'Human Rights Watch',
    url: 'https://www.hrw.org',
    category: 'Internationale NGO',
    description: 'Globale Menschenrechtsorganisation mit regelmäßigen detaillierten Lageberichten zu Folter, Haftbedingungen und Rechtsstaatlichkeit in der Türkei.',
    focusArea: 'Monitoring & Dokumentation'
  },
  {
    name: 'Amnesty International',
    url: 'https://www.amnesty.de',
    category: 'Internationale NGO',
    description: 'Weltweite Bewegung für Menschenrechte; dokumentiert politische Gefangene, unfaire Gerichtsverfahren und Missstände im Justizvollzug.',
    focusArea: 'Kampagnen & Gefangenenhilfe'
  },
  {
    name: 'UN Human Rights Office (OHCHR)',
    url: 'https://www.ohchr.org',
    category: 'Vereinte Nationen',
    description: 'Büro des Hohen Kommissars der Vereinten Nationen für Menschenrechte; überwacht internationale Verträge und führt Sonderberichterstatter.',
    focusArea: 'UN-Menschenrechtsstandards'
  },
  {
    name: 'UNHCR',
    url: 'https://www.unhcr.org',
    category: 'Vereinte Nationen',
    description: 'Das UN-Flüchtlingskommissariat setzt sich weltweit für den Schutz und die Rechtsstellung von Geflüchteten und Asylsuchenden ein.',
    focusArea: 'Flüchtlingsschutz & Asylrecht'
  },
  {
    name: 'Freedom House',
    url: 'https://freedomhouse.org',
    category: 'Forschungsinstitut',
    description: 'Unabhängige Forschungsorganisation zur Dokumentation globaler Demokratie- und Freiheitsgrade sowie transnationaler Repression.',
    focusArea: 'Transnationale Repression & Demokratie'
  },
  {
    name: 'Europäischer Gerichtshof für Menschenrechte (EGMR)',
    url: 'https://www.echr.coe.int',
    category: 'Internationales Gericht',
    description: 'Gerichtshof des Europarates in Straßburg zur Durchsetzung der Europäischen Menschenrechtskonvention (EMRK).',
    focusArea: 'Verbindliche Rechtsprechung'
  },
  {
    name: 'Deutsche Welle – Menschenrechte',
    url: 'https://www.dw.com/de/themen/s-9077',
    category: 'Öffentlicher Rundfunk',
    description: 'Unabhängiger deutscher Auslandssender mit fundierter, mehrsprachiger Berichterstattung zu Menschenrechten und Rechtsstaatlichkeit.',
    focusArea: 'Qualitätsjournalismus'
  },
  {
    name: 'TR724',
    url: 'https://www.tr724.com',
    category: 'Exil-Journalismus',
    description: 'Unabhängiges Nachrichtenportal türkischer Exil-Journalisten mit Schwerpunkt auf Justizmonitoring, politische Entwicklungen und Bürgerrechte.',
    focusArea: 'Exil-Presse & Analysen'
  },
  {
    name: 'Bold Medya',
    url: 'https://boldmedya.com',
    category: 'Exil-Journalismus',
    description: 'Kritisches Exil-Medium mit Fokus auf Menschenrechtsverletzungen, Berichte aus Gefängnissen und Schicksale von Familien in der Türkei.',
    focusArea: 'Recherchen & Fallberichte'
  },
  {
    name: 'ECtHR Case Law Database (HUDOC)',
    url: 'https://hudoc.echr.coe.int',
    category: 'Juristische Datenbank',
    description: 'Offizielle Falldatenbank des EGMR mit Volltexten aller Urteile, Entscheidungen und Beschwerdeunterlagen zu Verletzungen der EMRK.',
    focusArea: 'Urteilsdatenbank & Rechtsprechung'
  }
];