export type EventLanguage = 'de' | 'tr';

export interface BVMEvent {
  id: string;
  title: string;
  titleTr?: string;
  category: string;
  categoryTr?: string;
  stream: string;
  streamTr?: string;
  date: string;
  location: string;
  locationTr?: string;
  image: string;
  description: string;
  descriptionTr?: string;
  wasErwartetSie: string[];
  wasErwartetSieTr?: string[];
  fuerWen: string;
  fuerWenTr?: string;
  badge?: string;
  badgeTr?: string;
  requiresRegistration?: boolean;
  notice?: {
    type?: string;
    title: string;
    titleTr?: string;
    message: string;
    messageTr?: string;
  };
}

export const eventUiStrings = {
  de: {
    pageTitlePrefix: 'Unsere',
    pageTitleHighlight: 'Veranstaltungen',
    pageSubtitle: 'Entdecken Sie unser vielfältiges Angebot in Gießen und Wetzlar. Von kulturellen Festen bis hin zu Bildungsworkshops – bei uns ist jeder willkommen.',
    languageLabel: 'Sprache / Dil',
    viewAllEvents: 'Alle Events ansehen',
    detailsAndRegister: 'Details & Anmeldung',
    detailsAndInfo: 'Details & Info',
    viewDetails: 'Details ansehen',
    backToOverview: 'Zurück zur Übersicht',
    whatToExpect: 'Was erwartet Sie?',
    whoIsThisFor: 'Für wen ist dieses Angebot?',
    dateLabel: 'Datum',
    timeLabel: 'Uhrzeit',
    locationLabel: 'Ort',
    timeSuffix: 'Uhr',
    registrationStatus: 'Status',
    participation: 'Teilnahme',
    registration: 'Anmeldung',
    cancelled: 'Abgesagt',
    cancelledNoticeTitle: 'Veranstaltung abgesagt',
    cancelledNoticeText: 'Dieses Event muss leider entfallen. Wir bitten um Ihr Verständnis und freuen uns darauf, Sie bei einem unserer nächsten Termine begrüßen zu dürfen!',
    postponed: 'Verschoben',
    pastEvent: 'Geschlossen',
    eventFinished: 'Veranstaltung beendet',
    eventFinishedText: 'Dieses Event hat bereits stattgefunden.',
    openToAll: 'Offen für alle',
    noRegistrationNeeded: 'Keine Anmeldung nötig',
    noRegistrationText: 'Kommen Sie einfach vorbei! Dieses Fest ist offen für alle Bürgerinnen, Bürger, Nachbarn und Gäste. Eine vorherige Anmeldung ist nicht erforderlich.',
    freeAdmission: 'Eintritt frei & herzlich willkommen',
    requestQuery: 'Anfrage',
    contactPersonName: 'Vollständiger Name (Kontaktperson)',
    namePlaceholder: 'Ihr Name',
    emailLabel: 'E-Mail Adresse',
    emailPlaceholder: 'beispiel@mail.de',
    attendeeCountLabel: 'Anzahl Personen',
    personSingle: 'Person',
    personPlural: 'Personen',
    attendeeNameLabel: 'Name von Teilnehmer',
    specialNotesLabel: 'Besondere Hinweise',
    specialNotesPlaceholder: 'z.B. Allergien, vegetarisch, medizinische Hinweise...',
    nonBindingNotice: 'Dies ist eine unverbindliche Anfrage. Wir prüfen die Kapazitäten und senden Ihnen eine Bestätigung.',
    submitRequest: 'Anfrage senden',
    submitting: 'Wird gesendet...',
    submissionError: 'Es gab ein Problem bei der Anmeldung. Bitte versuchen Sie es später erneut.',
    privacyNote: 'Mit der Anmeldung stimmen Sie unseren Datenschutzbestimmungen zu.',
    thankYouTitle: 'Vielen Dank!',
    thankYouText: 'Wir haben Ihre Anmeldung erhalten. Da unsere Plätze begrenzt sind, prüfen wir derzeit die Kapazität und senden Ihnen in Kürze eine verbindliche Bestätigung per E-Mail.',
    shareTitle: 'Event teilen',
    nextEventIn: 'Nächstes Event in:',
    eventNotFound: 'Event nicht gefunden',
    switchLanguageTooltip: 'Sprache wechseln (Deutsch / Türkisch)'
  },
  tr: {
    pageTitlePrefix: 'Etkinlik ve',
    pageTitleHighlight: 'Programlarımız',
    pageSubtitle: 'Gießen ve Wetzlar bölgesindeki zengin etkinlik programlarımızı keşfedin. Kültür buluşmalarından eğitim atölyelerine kadar herkes davetlidir.',
    languageLabel: 'İçerik Dili / Sprache',
    viewAllEvents: 'Tüm Etkinlikleri Gör',
    detailsAndRegister: 'Detaylar & Kayıt',
    detailsAndInfo: 'Detaylar & Bilgi',
    viewDetails: 'Detayları İncele',
    backToOverview: 'Etkinlik Listesine Dön',
    whatToExpect: 'Sizi Neler Bekliyor?',
    whoIsThisFor: 'Bu Program Kimler İçin?',
    dateLabel: 'Tarih',
    timeLabel: 'Saat',
    locationLabel: 'Konum',
    timeSuffix: '',
    registrationStatus: 'Durum',
    participation: 'Katılım',
    registration: 'Kayıt',
    cancelled: 'İptal Edildi',
    cancelledNoticeTitle: 'Etkinlik İptal Edilmiştir',
    cancelledNoticeText: 'Bu etkinlik maalesef iptal edilmiştir. Anlayışınız için teşekkür eder, sizleri sonraki etkinliklerimizde ağırlamaktan mutluluk duyarız!',
    postponed: 'Ertelendi',
    pastEvent: 'Tamamlandı',
    eventFinished: 'Etkinlik Sona Erdi',
    eventFinishedText: 'Bu etkinlik daha önce gerçekleştirilmiştir.',
    openToAll: 'Herkese Açık',
    noRegistrationNeeded: 'Kayıt Gerekmez',
    noRegistrationText: 'Sadece gelin! Bu program tüm vatandaşlara, komşulara ve misafirlere açıktır. Önceden kayıt yaptırmanız gerekmez.',
    freeAdmission: 'Giriş serbesttir & herkes davetlidir',
    requestQuery: 'Talep',
    contactPersonName: 'Ad Soyad (İletişim Kişisi)',
    namePlaceholder: 'Adınız ve Soyadınız',
    emailLabel: 'E-posta Adresi',
    emailPlaceholder: 'ornek@eposta.com',
    attendeeCountLabel: 'Kişi Sayısı',
    personSingle: 'Kişi',
    personPlural: 'Kişi',
    attendeeNameLabel: 'Katılımcı Adı',
    specialNotesLabel: 'Özel Notlar & İstekler',
    specialNotesPlaceholder: 'Örn. vejetaryen, gıda alerjisi veya diğer özel durumlar...',
    nonBindingNotice: 'Bu bir ön kayıt talebidir. Kontenjan kontrol edilerek tarafınıza onay mesajı gönderilecektir.',
    submitRequest: 'Kayıt Talebini Gönder',
    submitting: 'Gönderiliyor...',
    submissionError: 'Kayıt gönderilirken bir sorun oluştu. Lütfen daha sonra tekrar deneyiniz.',
    privacyNote: 'Kaydınızı tamamlayarak gizlilik politikamızı kabul etmiş olursunuz.',
    thankYouTitle: 'Teşekkür Ederiz!',
    thankYouText: 'Kayıt başvurunuz bize ulaştı. Kontenjan durumunu kontrol edip en kısa sürede e-posta adresinize kesin onay ileteceğiz.',
    shareTitle: 'Etkinliği Paylaş',
    nextEventIn: 'Sonraki etkinliğe kalan süre:',
    eventNotFound: 'Etkinlik bulunamadı',
    switchLanguageTooltip: 'Dili değiştir (Türkçe / Almanca)'
  }
};

const STORAGE_KEY = 'bvm_events_lang_pref';

export function getSavedEventsLanguage(): EventLanguage {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'tr' || saved === 'de') return saved;
  } catch (e) {
    // ignore
  }
  return 'de';
}

export function saveEventsLanguage(lang: EventLanguage) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (e) {
    // ignore
  }
}

export function getLocalizedEvent(event: any, lang: EventLanguage) {
  if (!event) return null;
  const isTr = lang === 'tr';

  return {
    ...event,
    title: isTr && event.titleTr ? event.titleTr : event.title,
    category: isTr && event.categoryTr ? event.categoryTr : event.category,
    stream: isTr && event.streamTr ? event.streamTr : event.stream,
    description: isTr && event.descriptionTr ? event.descriptionTr : event.description,
    wasErwartetSie: (isTr && event.wasErwartetSieTr && event.wasErwartetSieTr.length > 0)
      ? event.wasErwartetSieTr
      : event.wasErwartetSie,
    fuerWen: isTr && event.fuerWenTr ? event.fuerWenTr : event.fuerWen,
    badge: isTr && event.badgeTr ? event.badgeTr : event.badge,
    location: isTr && event.locationTr ? event.locationTr : event.location,
    notice: event.notice ? {
      ...event.notice,
      title: isTr && event.notice.titleTr ? event.notice.titleTr : event.notice.title,
      message: isTr && event.notice.messageTr ? event.notice.messageTr : event.notice.message,
    } : undefined
  };
}
