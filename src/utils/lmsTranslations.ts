export type LMSLanguage = 'de' | 'tr';

export interface TranslationDictionary {
  backToDialog: string;
  certProgram: string;
  progressDesc: string;
  adminPanel: string;
  signOut: string;
  yourProgress: string;
  completedOf: string;
  curriculumVerlauf: string;
  module: string;
  viewCourse: string;
  loading: string;
  pendingTitle: string;
  pendingText: string;
  rejectedTitle: string;
  rejectedText: string;
  backToOverview: string;
  modProgress: string;
  completed: string;
  content: string;
  learningTargets: string;
  readingMaterials: string;
  videos: string;
  bookRecommendations: string;
  optional: string;
  moduleCompleted: string;
  completeModule: string;
  certificateEmail: string;
  noReadings: string;
  noVideos: string;
  noBooks: string;
  download: string;
  read: string;
  markAsRead: string;
  watched: string;
  markAsWatched: string;
  nextModule: string;
  prevModule: string;
  loginTitle: string;
  loginSub: string;
  registerSub: string;
  emailLabel: string;
  passwordLabel: string;
  pleaseWait: string;
  loginBtn: string;
  registerBtn: string;
  or: string;
  googleBtn: string;
  noAccount: string;
  hasAccount: string;
  successTitle: string;
}

export const translations: Record<LMSLanguage, TranslationDictionary> = {
  de: {
    backToDialog: "Zurück zur Dialogplattform",
    certProgram: "Dialog Zertifikatsprogramm",
    progressDesc: "Ihre Lernfortschritte im Zertifikatsprogramm zur Förderung des interkulturellen und interreligiösen Dialogs.",
    adminPanel: "Admin Panel",
    signOut: "Abmelden",
    yourProgress: "Ihr Fortschritt",
    completedOf: "Sie haben {completed} von {total} Modulen abgeschlossen. Bleiben Sie motiviert!",
    curriculumVerlauf: "Curriculum Verlauf",
    module: "Modul",
    viewCourse: "Kurs ansehen",
    loading: "Lade...",
    pendingTitle: "Anmeldung wird geprüft",
    pendingText: "Vielen Dank für Ihre Registrierung! Ihre Anmeldung wird derzeit von einem Administrator überprüft. Sie erhalten den Zugang zur Lernplattform, sobald Ihr Konto freigeschaltet wurde.",
    rejectedTitle: "Zugang verweigert",
    rejectedText: "Leider wurde Ihr Zugang zur Plattform nicht genehmigt.",
    backToOverview: "Zurück zur Übersicht",
    modProgress: "Modul-Fortschritt",
    completed: "Abgeschlossen",
    content: "Inhalt",
    learningTargets: "Lernziele",
    readingMaterials: "Lesematerial",
    videos: "Videos",
    bookRecommendations: "Buchempfehlungen",
    optional: "Optional",
    moduleCompleted: "Modul erfolgreich beendet!",
    completeModule: "Modul abschließen",
    certificateEmail: "Zertifikat & E-Mail",
    noReadings: "Keine Lesematerialien für dieses Modul.",
    noVideos: "Keine Videos für dieses Modul.",
    noBooks: "Keine Buchempfehlungen für dieses Modul.",
    download: "Herunterladen",
    read: "Gelesen",
    markAsRead: "Als gelesen markieren",
    watched: "Gesehen",
    markAsWatched: "Als gesehen markieren",
    nextModule: "Nächstes Modul",
    prevModule: "Vorheriges Modul",
    loginTitle: "Zertifikatsprogramm",
    loginSub: "Diyalog Sertifika Programı - Anmeldung",
    registerSub: "Diyalog Sertifika Programı - Registrierung",
    emailLabel: "E-Mail-Adresse",
    passwordLabel: "Passwort",
    pleaseWait: "Bitte warten...",
    loginBtn: "Anmelden",
    registerBtn: "Registrieren",
    or: "ODER",
    googleBtn: "Mit Google anmelden",
    noAccount: "Noch kein Konto? Hier registrieren",
    hasAccount: "Bereits ein Konto? Hier anmelden",
    successTitle: "Erfolg! Das Modul wurde beendet. Ihr Zertifikat wurde heruntergeladen."
  },
  tr: {
    backToDialog: "Diyalog Platformuna Dön",
    certProgram: "Diyalog Sertifika Programı",
    progressDesc: "Kültürlerarası ve dinlerarası diyaloğu teşvik etmeye yönelik sertifika programındaki öğrenme ilerlemeniz.",
    adminPanel: "Admin Paneli",
    signOut: "Çıkış Yap",
    yourProgress: "İlerlemeniz",
    completedOf: "16 modülden {completed} tanesini tamamladınız. Motivasyonunuzu kaybetmeyin!",
    curriculumVerlauf: "Müfredat Akışı",
    module: "Modül",
    viewCourse: "Dersi Görüntüle",
    loading: "Yükleniyor...",
    pendingTitle: "Kayıt İnceleniyor",
    pendingText: "Kaydolduğunuz için teşekkür ederiz! Başvurunuz şu anda bir yönetici tarafından incelenmektedir. Hesabınız onaylanır onaylanmaz öğrenme platformuna erişebileceksiniz.",
    rejectedTitle: "Erişim Reddedildi",
    rejectedText: "Maalesef platforma erişiminiz onaylanmadı.",
    backToOverview: "Genel Bakışa Dön",
    modProgress: "Modül İlerlemesi",
    completed: "Tamamlandı",
    content: "İçerik",
    learningTargets: "Öğrenme Hedefleri",
    readingMaterials: "Okuma Materyali",
    videos: "Videolar",
    bookRecommendations: "Kitap Önerileri",
    optional: "İsteğe Bağlı",
    moduleCompleted: "Modül başarıyla tamamlandı!",
    completeModule: "Modülü Tamamla",
    certificateEmail: "Sertifika & E-posta",
    noReadings: "Bu modül için henüz okuma materyali bulunmuyor.",
    noVideos: "Bu modül için henüz video bulunmuyor.",
    noBooks: "Bu modül için henüz kitap önerisi bulunmuyor.",
    download: "İndir",
    read: "Okundu",
    markAsRead: "Okundu olarak işaretle",
    watched: "İzlendi",
    markAsWatched: "İzlendi olarak işaretle",
    nextModule: "Sonraki Modül",
    prevModule: "Önceki Modül",
    loginTitle: "Sertifika Programı",
    loginSub: "Diyalog Sertifika Programı - Giriş",
    registerSub: "Diyalog Sertifika Programı - Kayıt",
    emailLabel: "E-posta Adresi",
    passwordLabel: "Şifre",
    pleaseWait: "Lütfen bekleyin...",
    loginBtn: "Giriş Yap",
    registerBtn: "Kaydol",
    or: "VEYA",
    googleBtn: "Google ile bağlan",
    noAccount: "Henüz hesabınız yok mu? Buradan kaydolun",
    hasAccount: "Zaten bir hesabınız var mı? Buradan giriş yapın",
    successTitle: "Tebrikler! Modül başarıyla tamamlandı. Sertifikanız indirildi."
  }
};
