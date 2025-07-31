import React from 'react';

export interface Translations {
  // App info
  appTitle: string;
  appDescription: string;
  
  // Download filenames - localized app names for filenames
  appNameForFile: string; // Used for download filenames
  allFilter: string; // "semua", "all", etc for filename
  
  // Core interface
  searchPlaceholder: string;
  generateSuggestions: string;
  searchSuggestions: string;
  showAll: string;
  settings: string;
  
  // Statistics
  queries: string;
  
  // Search engines
  searchEngines: {
    google: string;
    bing: string;
    duckduckgo: string;
    yahoo: string;
    bingedgear: string;
  };
  
  // Languages
  languages: {
    en: string;
    id: string;
    ar: string;
    zh: string;
    ja: string;
    ru: string;
    es: string;
    fr: string;
    de: string;
    pt: string;
    hi: string;
    ko: string;
  };
  
  // Settings
  language: string;
  engine: string;
  processingTimeWarning: string;
  engineDescription: string;
  languageDescription: string;
  behaviorOptions: string;
  newTab: string;
  newTabDescription: string;
  sameTab: string;
  sameTabDescription: string;
  copyMode: string;
  copyModeDescription: string;
  floatingTab: string;
  floatingTabDescription: string;
  close: string;
  
  // Mobile/Desktop Mode
  mobileMode: string;
  desktopMode: string;
  viewMode: string;
  
  // Floating Tab Error
  floatingTabError: string;
  floatingTabErrorDescription: string;
  openInNewTab: string;
  
  // Messages
  startTyping: string;
  configureSettings: string;
  clickShuffle: string;
  noSuggestions: string;
  allExplored: string;
  
  // Actions
  clickToSearch: string;
  clickToCopy: string;
  clickedReplaced: string;
  alreadyExplored: string;
  notYetExplored: string;
  
  // Dynamic action descriptions
  clickToOpen: string;
  clickToCopyText: string;
  
  // Copy functionality
  copySuccessMessage: string;
  copyFailedMessage: string;
  
  // Download
  download: string;
  downloading: string;
  downloadComplete: string;
  downloadFailed: string;
  downloadStatus: string;
  
  // Behavior-specific terminology
  unopened: string;
  opened: string;
  uncopied: string;
  copied: string;
  
  // Capitalized versions for modal filters
  unopenedCapital: string;
  openedCapital: string;
  uncopiedCapital: string;
  copiedCapital: string;
  
  // Capitalized versions for download headers
  unopenedHeader: string;
  openedHeader: string;
  uncopiedHeader: string;
  copiedHeader: string;
  
  // Remaining/explored terminology
  remaining: string;
  explored: string;
  
  // Filter options for modal
  all: string;
  
  // UI Elements
  smartSearchGenerator: string;
  
  // CSV Headers
  csvDownloadedAt: string;
  csvColumnNumber: string;
  csvColumnSuggestion: string;
  csvColumnStatus: string;
  csvColumnOpenedTime: string;
}

export const translations: Record<string, Translations> = {
  en: {
    appTitle: "Search Suggestion Generator",
    appDescription: "Generate intelligent search suggestions and explore them instantly across multiple search engines. Customize query count and track your exploration progress.",
    
    appNameForFile: "search-suggestion-generator",
    allFilter: "all",
    
    searchPlaceholder: "Enter your search topic...",
    generateSuggestions: "Generate random search suggestions",
    searchSuggestions: "Search Suggestions",
    showAll: "Show All",
    settings: "Settings",
    
    queries: "Queries",
    
    searchEngines: {
      google: "Google",
      bing: "Bing", 
      duckduckgo: "DuckDuckGo",
      yahoo: "Yahoo",
      bingedgear: "Bing Edgear",
    },
    
    languages: {
      en: "English",
      id: "Bahasa Indonesia",
      ar: "العربية",
      zh: "中文",
      ja: "日本語",
      ru: "Русский",
      es: "Español",
      fr: "Français",
      de: "Deutsch",
      pt: "Português",
      hi: "हिन्दी",
      ko: "한국어",
    },
    
    language: "Language",
    engine: "Search Engine",
    processingTimeWarning: "Large numbers may take longer to process",
    engineDescription: "Choose your preferred search engine",
    languageDescription: "Select language for suggestions and interface",
    behaviorOptions: "Behavior Options",
    newTab: "Open in New Tab",
    newTabDescription: "Open search results in new browser tabs",
    sameTab: "Open in Same Tab", 
    sameTabDescription: "Navigate to search results in current tab",
    copyMode: "Copy Mode",
    copyModeDescription: "Copy suggestions to clipboard instead of searching",
    floatingTab: "Open in Floating Tab",
    floatingTabDescription: "Open search results in a floating popup window",
    close: "Close",
    
    mobileMode: "Mobile",
    desktopMode: "Desktop", 
    viewMode: "View Mode",
    
    floatingTabError: "Unable to Load",
    floatingTabErrorDescription: "This search engine cannot be displayed in floating mode due to security restrictions.",
    openInNewTab: "Open in New Tab",
    
    startTyping: "Start typing to generate search suggestions",
    configureSettings: "Configure query count, search engine, and language in settings",
    clickShuffle: "Click the {icon} button to generate random search suggestions",
    noSuggestions: "No suggestions found for",
    allExplored: "All suggestions have been explored! Generate new ones or increase the query count.",
    
    clickToSearch: "Click to search on",
    clickToCopy: "Click to copy text",
    clickedReplaced: "Clicked suggestions will be replaced with new ones",
    alreadyExplored: "Already Explored",
    notYetExplored: "Not Yet Explored",
    
    clickToOpen: "Click to open on",
    clickToCopyText: "Click to copy",
    
    copySuccessMessage: "Copied to clipboard",
    copyFailedMessage: "Failed to copy",
    
    download: "Download",
    downloading: "Downloading...",
    downloadComplete: "Download complete",
    downloadFailed: "Download failed", 
    downloadStatus: "Status",
    
    unopened: "unopened",
    opened: "opened", 
    uncopied: "uncopied",
    copied: "copied",
    
    unopenedCapital: "Unopened",
    openedCapital: "Opened",
    uncopiedCapital: "Uncopied", 
    copiedCapital: "Copied",
    
    unopenedHeader: "Unopened",
    openedHeader: "Opened",
    uncopiedHeader: "Uncopied",
    copiedHeader: "Copied",
    
    remaining: "remaining",
    explored: "explored",
    
    all: "All",
    
    smartSearchGenerator: "Search Suggestion Generator",
    
    csvDownloadedAt: "Downloaded at",
    csvColumnNumber: "No",
    csvColumnSuggestion: "Search Suggestion", 
    csvColumnStatus: "Status",
    csvColumnOpenedTime: "Time Accessed",
  },
  
  id: {
    appTitle: "Generator Saran Pencarian",
    appDescription: "Hasilkan variasi saran pencarian dan jelajahi secara instan di berbagai mesin pencari. Sesuaikan jumlah kueri dan lacak kemajuan eksplorasi Anda.",
    
    appNameForFile: "generator-saran-pencarian",
    allFilter: "semua",
    
    searchPlaceholder: "Masukkan topik pencarian Anda...",
    generateSuggestions: "Hasilkan saran pencarian acak",
    searchSuggestions: "Saran Pencarian",
    showAll: "Lihat Semua",
    settings: "Pengaturan",
    
    queries: "Kueri",
    
    searchEngines: {
      google: "Google",
      bing: "Bing",
      duckduckgo: "DuckDuckGo", 
      yahoo: "Yahoo",
      bingedgear: "Bing Edgear",
    },
    
    languages: {
      en: "English",
      id: "Bahasa Indonesia",
      ar: "العربية",
      zh: "中文",
      ja: "日本語",
      ru: "Русский",
      es: "Español",
      fr: "Français",
      de: "Deutsch",
      pt: "Português",
      hi: "हिन्दी",
      ko: "한국어",
    },
    
    language: "Bahasa",
    engine: "Mesin Pencari",
    processingTimeWarning: "Jumlah besar mungkin membutuhkan waktu lebih lama untuk diproses",
    engineDescription: "Pilih mesin pencari yang Anda inginkan",
    languageDescription: "Pilih bahasa untuk saran dan antarmuka",
    behaviorOptions: "Opsi Perilaku",
    newTab: "Buka di Tab Baru",
    newTabDescription: "Buka hasil pencarian di tab browser baru",
    sameTab: "Buka di Tab Yang Sama",
    sameTabDescription: "Navigasi ke hasil pencarian di tab saat ini",
    copyMode: "Mode Salin",
    copyModeDescription: "Salin saran ke clipboard alih-alih mencari",
    floatingTab: "Buka di Tab Mengambang",
    floatingTabDescription: "Buka hasil pencarian dalam jendela popup mengambang",
    close: "Tutup",
    
    mobileMode: "Mobile",
    desktopMode: "Desktop",
    viewMode: "Mode Tampilan",
    
    floatingTabError: "Tidak Dapat Memuat",
    floatingTabErrorDescription: "Mesin pencari ini tidak dapat ditampilkan dalam mode mengambang karena pembatasan keamanan.",
    openInNewTab: "Buka di Tab Baru",
    
    startTyping: "Mulai mengetik untuk menghasilkan saran pencarian",
    configureSettings: "Konfigurasikan jumlah kueri, mesin pencari, dan bahasa di pengaturan",
    clickShuffle: "Klik tombol {icon} untuk menghasilkan saran pencarian acak",
    noSuggestions: "Tidak ada saran yang ditemukan untuk",
    allExplored: "Semua saran telah dijelajahi! Hasilkan yang baru atau tingkatkan jumlah kueri.",
    
    clickToSearch: "Klik untuk mencari di",
    clickToCopy: "Klik untuk menyalin teks",
    clickedReplaced: "Saran yang diklik akan diganti dengan yang baru",
    alreadyExplored: "Sudah Dijelajahi",
    notYetExplored: "Belum Dijelajahi",
    
    clickToOpen: "Klik untuk membuka di",
    clickToCopyText: "Klik untuk menyalin",
    
    copySuccessMessage: "Disalin ke clipboard",
    copyFailedMessage: "Gagal menyalin",
    
    download: "Unduh",
    downloading: "Mengunduh...",
    downloadComplete: "Unduhan selesai",
    downloadFailed: "Unduhan gagal",
    downloadStatus: "Status",
    
    unopened: "belum dibuka",
    opened: "sudah dibuka",
    uncopied: "belum disalin", 
    copied: "sudah disalin",
    
    unopenedCapital: "Belum Dibuka",
    openedCapital: "Sudah Dibuka",
    uncopiedCapital: "Belum Disalin",
    copiedCapital: "Sudah Disalin",
    
    unopenedHeader: "Belum Dibuka",
    openedHeader: "Sudah Dibuka", 
    uncopiedHeader: "Belum Disalin",
    copiedHeader: "Sudah Disalin",
    
    remaining: "tersisa",
    explored: "dijelajahi",
    
    all: "Semua",
    
    smartSearchGenerator: "Generator Saran Pencarian",
    
    csvDownloadedAt: "Diunduh pada",
    csvColumnNumber: "No",
    csvColumnSuggestion: "Saran Pencarian",
    csvColumnStatus: "Status", 
    csvColumnOpenedTime: "Waktu Diakses",
  },
  
  ar: {
    appTitle: "مولد اقتراحات البحث",
    appDescription: "قم بتوليد اقتراحات بحث ذكية واستكشفها فورياً عبر محركات بحث متعددة. خصص عدد الاستعلامات وتتبع تقدم الاستكشاف.",
    
    appNameForFile: "مولد-اقتراحات-البحث",
    allFilter: "الكل",
    
    searchPlaceholder: "أدخل موضوع البحث الخاص بك...",
    generateSuggestions: "توليد اقتراحات بحث عشوائية",
    searchSuggestions: "اقتراحات البحث",
    showAll: "إظهار الكل",
    settings: "الإعدادات",
    
    queries: "الاستعلامات",
    
    searchEngines: {
      google: "جوجل",
      bing: "بينغ",
      duckduckgo: "دك دك جو",
      yahoo: "ياهو",
      bingedgear: "بينغ إدجير",
    },
    
    languages: {
      en: "English",
      id: "Bahasa Indonesia", 
      ar: "العربية",
      zh: "中文",
      ja: "日本語",
      ru: "Русский",
      es: "Español",
      fr: "Français",
      de: "Deutsch",
      pt: "Português",
      hi: "हिन्दी",
      ko: "한국어",
    },
    
    language: "اللغة",
    engine: "محرك البحث",
    processingTimeWarning: "الأرقام الكبيرة قد تستغرق وقتاً أطول للمعالجة",
    engineDescription: "اختر محرك البحث المفضل لديك",
    languageDescription: "اختر اللغة للاقتراحات والواجهة",
    behaviorOptions: "خيارات السلوك",
    newTab: "فتح في تبويب جديد",
    newTabDescription: "فتح نتائج البحث في تبويبات متصفح جديدة",
    sameTab: "فتح في نفس التبويب",
    sameTabDescription: "الانتقال إلى نتائج البحث في التبويب الحالي",
    copyMode: "وضع النسخ",
    copyModeDescription: "نسخ الاقتراحات إلى الحافظة بدلاً من البحث",
    floatingTab: "فتح في تبويب عائم",
    floatingTabDescription: "فتح نتائج البحث في نافذة منبثقة عائمة",
    close: "إغلاق",
    
    mobileMode: "الهاتف المحمول",
    desktopMode: "سطح المكتب",
    viewMode: "وضع العرض",
    
    floatingTabError: "غير قادر على التحميل",
    floatingTabErrorDescription: "لا يمكن عرض محرك البحث هذا في الوضع العائم بسبب قيود الأمان.",
    openInNewTab: "فتح في تبويب جديد",
    
    startTyping: "ابدأ بالكتابة لتوليد اقتراحات البحث",
    configureSettings: "قم بتكوين عدد الاستعلامات ومحرك البحث واللغة في الإعدادات",
    clickShuffle: "انقر على زر {icon} لتوليد اقتراحات بحث عشوائية",
    noSuggestions: "لم يتم العثور على اقتراحات لـ",
    allExplored: "تم استكشاف جميع الاقتراحات! قم بتوليد اقتراحات جديدة أو زيادة عدد الاستعلامات.",
    
    clickToSearch: "انقر للبحث في",
    clickToCopy: "انقر لنسخ النص",
    clickedReplaced: "سيتم استبدال الاقتراحات المنقورة بأخرى جديدة",
    alreadyExplored: "تم الاستكشاف بالفعل",
    notYetExplored: "لم يتم الاستكشاف بعد",
    
    clickToOpen: "انقر للفتح في",
    clickToCopyText: "انقر للنسخ",
    
    copySuccessMessage: "تم النسخ إلى الحافظة",
    copyFailedMessage: "فشل في النسخ",
    
    download: "تحميل",
    downloading: "جاري التحميل...",
    downloadComplete: "اكتمل التحميل",
    downloadFailed: "فشل التحميل",
    downloadStatus: "الحالة",
    
    unopened: "لم يتم فتحها",
    opened: "تم فتحها",
    uncopied: "لم يتم نسخها",
    copied: "تم نسخها",
    
    unopenedCapital: "لم يتم فتحها",
    openedCapital: "تم فتحها",
    uncopiedCapital: "لم يتم نسخها",
    copiedCapital: "تم نسخها",
    
    unopenedHeader: "لم يتم فتحها",
    openedHeader: "تم فتحها",
    uncopiedHeader: "لم يتم نسخها", 
    copiedHeader: "تم نسخها",
    
    remaining: "متبقية",
    explored: "مستكشفة",
    
    all: "الكل",
    
    smartSearchGenerator: "مولد اقتراحات البحث",
  },
  
  zh: {
    appTitle: "搜索建议生成器",
    appDescription: "生成智能搜索建议并在多个搜索引擎中即时探索。自定义查询数量并跟踪您的探索进度。",
    
    appNameForFile: "搜索建议生成器",
    allFilter: "全部",
    
    searchPlaceholder: "输入您的搜索主题...",
    generateSuggestions: "生成随机搜索建议",
    searchSuggestions: "搜索建议",
    showAll: "显示全部",
    settings: "设置",
    
    queries: "查询",
    
    searchEngines: {
      google: "谷歌",
      bing: "必应",
      duckduckgo: "DuckDuckGo",
      yahoo: "雅虎",
      bingedgear: "必应 Edgear",
    },
    
    languages: {
      en: "English",
      id: "Bahasa Indonesia",
      ar: "العربية", 
      zh: "中文",
      ja: "日本語",
      ru: "Русский",
      es: "Español",
      fr: "Français",
      de: "Deutsch",
      pt: "Português",
      hi: "हिन्दी",
      ko: "한국어",
    },
    
    language: "语言",
    engine: "搜索引擎",
    processingTimeWarning: "大数量可能需要更长时间处理",
    engineDescription: "选择您喜欢的搜索引擎",
    languageDescription: "选择建议和界面的语言",
    behaviorOptions: "行为选项",
    newTab: "在新标签页中打开",
    newTabDescription: "在新的浏览器标签页中打开搜索结果",
    sameTab: "在同一标签页中打开",
    sameTabDescription: "在当前标签页中导航到搜索结果",
    copyMode: "复制模式",
    copyModeDescription: "将建议复制到剪贴板而不是搜索",
    floatingTab: "在浮动标签页中打开",
    floatingTabDescription: "在浮动弹窗窗口中打开搜索结果",
    close: "关闭",
    
    mobileMode: "手机",
    desktopMode: "桌面",
    viewMode: "查看模式",
    
    floatingTabError: "无法加载",
    floatingTabErrorDescription: "由于安全限制，此搜索引擎无法在浮动模式下显示。",
    openInNewTab: "在新标签页中打开",
    
    startTyping: "开始输入以生成搜索建议",
    configureSettings: "在设置中配置查询数量、搜索引擎和语言",
    clickShuffle: "点击 {icon} 按钮生成随机搜索建议",
    noSuggestions: "未找到相关建议",
    allExplored: "所有建议都已探索！生成新的建议或增加查询数量。",
    
    clickToSearch: "点击在以下搜索",
    clickToCopy: "点击复制文本",
    clickedReplaced: "点击的建议将被新的建议替换",
    alreadyExplored: "已探索",
    notYetExplored: "尚未探索",
    
    clickToOpen: "点击打开",
    clickToCopyText: "点击复制",
    
    copySuccessMessage: "已复制到剪贴板",
    copyFailedMessage: "复制失败",
    
    download: "下载",
    downloading: "下载中...",
    downloadComplete: "下载完成",
    downloadFailed: "下载失败",
    downloadStatus: "状态",
    
    unopened: "未打开",
    opened: "已打开",
    uncopied: "未复制",
    copied: "已复制",
    
    unopenedCapital: "未打开",
    openedCapital: "已打开", 
    uncopiedCapital: "未复制",
    copiedCapital: "已复制",
    
    unopenedHeader: "未打开",
    openedHeader: "已打开",
    uncopiedHeader: "未复制",
    copiedHeader: "已复制",
    
    remaining: "剩余",
    explored: "已探索",
    
    all: "全部",
    
    smartSearchGenerator: "搜索建议生成器",
  },
  
  ja: {
    appTitle: "検索提案ジェネレーター",
    appDescription: "インテリジェントな検索提案を生成し、複数の検索エンジンで即座に探索できます。クエリ数をカスタマイズし、探索の進行状況を追跡します。",
    
    appNameForFile: "検索提案ジェネレーター",
    allFilter: "すべて",
    
    searchPlaceholder: "検索トピックを入力してください...",
    generateSuggestions: "ランダムな検索提案を生成",
    searchSuggestions: "検索提案",
    showAll: "すべて表示",
    settings: "設定",
    
    queries: "クエリ",
    
    searchEngines: {
      google: "グーグル",
      bing: "ビング",
      duckduckgo: "DuckDuckGo",
      yahoo: "ヤフー",
      bingedgear: "ビング Edgear",
    },
    
    languages: {
      en: "English",
      id: "Bahasa Indonesia",
      ar: "العربية",
      zh: "中文",
      ja: "日本語",
      ru: "Русский",
      es: "Español",
      fr: "Français", 
      de: "Deutsch",
      pt: "Português",
      hi: "हिन्दी",
      ko: "한국어",
    },
    
    language: "言語",
    engine: "検索エンジン",
    processingTimeWarning: "大きな数値は処理に時間がかかる場合があります",
    engineDescription: "お好みの検索エンジンを選択してください",
    languageDescription: "提案とインターフェースの言語を選択",
    behaviorOptions: "動作オプション",
    newTab: "新しいタブで開く",
    newTabDescription: "検索結果を新しいブラウザタブで開く",
    sameTab: "同じタブで開く",
    sameTabDescription: "現在のタブで検索結果に移動",
    copyMode: "コピーモード",
    copyModeDescription: "検索ではなくクリップボードに提案をコピー",
    floatingTab: "フローティングタブで開く",
    floatingTabDescription: "フローティングポップアップウィンドウで検索結果を開く",
    close: "閉じる",
    
    mobileMode: "モバイル",
    desktopMode: "デスクトップ",
    viewMode: "表示モード",
    
    floatingTabError: "読み込めません",
    floatingTabErrorDescription: "セキュリティ制限により、この検索エンジンはフローティングモードで表示できません。",
    openInNewTab: "新しいタブで開く",
    
    startTyping: "検索提案を生成するために入力を開始してください",
    configureSettings: "設定でクエリ数、検索エンジン、言語を設定してください",
    clickShuffle: "{icon} ボタンをクリックしてランダムな検索提案を生成",
    noSuggestions: "提案が見つかりませんでした",
    allExplored: "すべての提案が探索されました！新しいものを生成するかクエリ数を増やしてください。",
    
    clickToSearch: "クリックして検索",
    clickToCopy: "クリックしてテキストをコピー",
    clickedReplaced: "クリックされた提案は新しいものに置き換えられます",
    alreadyExplored: "すでに探索済み",
    notYetExplored: "まだ探索されていません",
    
    clickToOpen: "クリックして開く",
    clickToCopyText: "クリックしてコピー",
    
    copySuccessMessage: "クリップボードにコピーしました",
    copyFailedMessage: "コピーに失敗しました",
    
    download: "ダウンロード",
    downloading: "ダウンロード中...",
    downloadComplete: "ダウンロード完了",
    downloadFailed: "ダウンロード失敗",
    downloadStatus: "ステータス",
    
    unopened: "未開封",
    opened: "開封済み",
    uncopied: "未コピー",
    copied: "コピー済み",
    
    unopenedCapital: "未開封",
    openedCapital: "開封済み",
    uncopiedCapital: "未コピー", 
    copiedCapital: "コピー済み",
    
    unopenedHeader: "未開封",
    openedHeader: "開封済み",
    uncopiedHeader: "未コピー",
    copiedHeader: "コピー済み",
    
    remaining: "残り",
    explored: "探索済み",
    
    all: "すべて",
    
    smartSearchGenerator: "検索提案ジェネレーター",
  },
  
  ru: {
    appTitle: "Генератор поисковых предложений",
    appDescription: "Генерируйте умные поисковые предложения и мгновенно исследуйте их в нескольких поисковых системах. Настройте количество запросов и отслеживайте прогресс исследования.",
    
    appNameForFile: "генератор-поисковых-предложений",
    allFilter: "все",
    
    searchPlaceholder: "Введите вашу поисковую тему...",
    generateSuggestions: "Генерировать случайные поисковые предложения",
    searchSuggestions: "Поисковые предложения",
    showAll: "Показать все",
    settings: "Настройки",
    
    queries: "Запросы",
    
    searchEngines: {
      google: "Google",
      bing: "Bing",
      duckduckgo: "DuckDuckGo",
      yahoo: "Yahoo",
      bingedgear: "Bing Edgear",
    },
    
    languages: {
      en: "English",
      id: "Bahasa Indonesia",
      ar: "العربية",
      zh: "中文",
      ja: "日本語",
      ru: "Русский",
      es: "Español",
      fr: "Français",
      de: "Deutsch",
      pt: "Português",
      hi: "हिन्दी",
      ko: "한국어",
    },
    
    language: "Язык",
    engine: "Поисковая система",
    processingTimeWarning: "Большие числа могут потребовать больше времени для обработки",
    engineDescription: "Выберите предпочитаемую поисковую систему",
    languageDescription: "Выберите язык для предложений и интерфейса",
    behaviorOptions: "Опции поведения",
    newTab: "Открыть в новой вкладке",
    newTabDescription: "Открывать результаты поиска в новых вкладках браузера",
    sameTab: "Открыть в той же вкладке",
    sameTabDescription: "Переходить к результатам поиска в текущей вкладке",
    copyMode: "Режим копирования",
    copyModeDescription: "Копировать предложения в буфер обмена вместо поиска",
    floatingTab: "Открыть в плавающей вкладке",
    floatingTabDescription: "Открыть результаты поиска в плавающем всплывающем окне",
    close: "Закрыть",
    
    mobileMode: "Мобильный",
    desktopMode: "Рабочий стол",
    viewMode: "Режим просмотра",
    
    floatingTabError: "Невозможно загрузить",
    floatingTabErrorDescription: "Эта поисковая система не может быть отображена в плавающем режиме из-за ограничений безопасности.",
    openInNewTab: "Открыть в новой вкладке",
    
    startTyping: "Начните печатать для генерации поисковых предложений",
    configureSettings: "Настройте количество запросов, поисковую систему и язык в настройках",
    clickShuffle: "Нажмите кнопку {icon} для генерации случайных поисковых предложений",
    noSuggestions: "Предложения не найдены для",
    allExplored: "Все предложения исследованы! Сгенерируйте новые или увеличьте количество запросов.",
    
    clickToSearch: "Нажмите для поиска в",
    clickToCopy: "Нажмите для копирования текста",
    clickedReplaced: "Нажатые предложения будут заменены новыми",
    alreadyExplored: "Уже исследовано",
    notYetExplored: "Еще не исследовано",
    
    clickToOpen: "Нажмите для открытия в",
    clickToCopyText: "Нажмите для копирования",
    
    copySuccessMessage: "Скопировано в буфер обмена",
    copyFailedMessage: "Не удалось скопировать",
    
    download: "Скачать",
    downloading: "Загружается...",
    downloadComplete: "Загрузка завершена",
    downloadFailed: "Загрузка не удалась",
    downloadStatus: "Статус",
    
    unopened: "не открыто",
    opened: "открыто",
    uncopied: "не скопировано",
    copied: "скопировано",
    
    unopenedCapital: "Не открыто",
    openedCapital: "Открыто",
    uncopiedCapital: "Не скопировано",
    copiedCapital: "Скопировано",
    
    unopenedHeader: "Не открыто",
    openedHeader: "Открыто",
    uncopiedHeader: "Не скопировано",
    copiedHeader: "Скопировано",
    
    remaining: "осталось",
    explored: "исследовано",
    
    all: "Все",
    
    smartSearchGenerator: "Генератор поисковых предложений",
  },
  
  es: {
    appTitle: "Generador de Sugerencias de Búsqueda",
    appDescription: "Genera sugerencias de búsqueda inteligentes y explóralas instantáneamente en múltiples motores de búsqueda. Personaliza el número de consultas y rastrea tu progreso de exploración.",
    
    appNameForFile: "generador-sugerencias-busqueda",
    allFilter: "todo",
    
    searchPlaceholder: "Ingresa tu tema de búsqueda...",
    generateSuggestions: "Generar sugerencias de búsqueda aleatorias",
    searchSuggestions: "Sugerencias de Búsqueda",
    showAll: "Mostrar Todo",
    settings: "Configuración",
    
    queries: "Consultas",
    
    searchEngines: {
      google: "Google",
      bing: "Bing",
      duckduckgo: "DuckDuckGo",
      yahoo: "Yahoo",
      bingedgear: "Bing Edgear",
    },
    
    languages: {
      en: "English",
      id: "Bahasa Indonesia",
      ar: "العربية",
      zh: "中文",
      ja: "日本語",
      ru: "Русский",
      es: "Español",
      fr: "Français",
      de: "Deutsch",
      pt: "Português",
      hi: "हिन्दी",
      ko: "한국어",
    },
    
    language: "Idioma",
    engine: "Motor de Búsqueda",
    processingTimeWarning: "Los números grandes pueden tardar más en procesarse",
    engineDescription: "Elige tu motor de búsqueda preferido",
    languageDescription: "Selecciona idioma para sugerencias e interfaz",
    behaviorOptions: "Opciones de Comportamiento",
    newTab: "Abrir en Nueva Pestaña",
    newTabDescription: "Abrir resultados de búsqueda en nuevas pestañas del navegador",
    sameTab: "Abrir en la Misma Pestaña",
    sameTabDescription: "Navegar a resultados de búsqueda en la pestaña actual",
    copyMode: "Modo Copiar",
    copyModeDescription: "Copiar sugerencias al portapapeles en lugar de buscar",
    floatingTab: "Abrir en Pestaña Flotante",
    floatingTabDescription: "Abrir resultados de búsqueda en una ventana emergente flotante",
    close: "Cerrar",
    
    mobileMode: "Móvil",
    desktopMode: "Escritorio",
    viewMode: "Modo de Vista",
    
    floatingTabError: "No se puede cargar",
    floatingTabErrorDescription: "Este motor de búsqueda no puede mostrarse en modo flotante debido a restricciones de seguridad.",
    openInNewTab: "Abrir en Nueva Pestaña",
    
    startTyping: "Comienza a escribir para generar sugerencias de búsqueda",
    configureSettings: "Configura el número de consultas, motor de búsqueda e idioma en configuración",
    clickShuffle: "Haz clic en el botón {icon} para generar sugerencias de búsqueda aleatorias",
    noSuggestions: "No se encontraron sugerencias para",
    allExplored: "¡Todas las sugerencias han sido exploradas! Genera nuevas o aumenta el número de consultas.",
    
    clickToSearch: "Haz clic para buscar en",
    clickToCopy: "Haz clic para copiar texto",
    clickedReplaced: "Las sugerencias clicadas serán reemplazadas con nuevas",
    alreadyExplored: "Ya Explorado",
    notYetExplored: "Aún No Explorado",
    
    clickToOpen: "Haga clic para abrir en",
    clickToCopyText: "Haga clic para copiar",
    
    copySuccessMessage: "Copiado al portapapeles",
    copyFailedMessage: "Error al copiar",
    
    download: "Descargar",
    downloading: "Descargando...",
    downloadComplete: "Descarga completa",
    downloadFailed: "Descarga fallida",
    downloadStatus: "Estado",
    
    unopened: "sin abrir",
    opened: "abierto",
    uncopied: "sin copiar",
    copied: "copiado",
    
    unopenedCapital: "Sin Abrir",
    openedCapital: "Abierto",
    uncopiedCapital: "Sin Copiar",
    copiedCapital: "Copiado",
    
    unopenedHeader: "Sin Abrir",
    openedHeader: "Abierto",
    uncopiedHeader: "Sin Copiar",
    copiedHeader: "Copiado",
    
    remaining: "restantes",
    explored: "exploradas",
    
    all: "Todo",
    
    smartSearchGenerator: "Generador de Sugerencias de Búsqueda",
  },
  
  fr: {
    appTitle: "Générateur de Suggestions de Recherche",
    appDescription: "Générez des suggestions de recherche intelligentes et explorez-les instantanément sur plusieurs moteurs de recherche. Personnalisez le nombre de requêtes et suivez vos progrès d'exploration.",
    
    appNameForFile: "generateur-suggestions-recherche",
    allFilter: "tout",
    
    searchPlaceholder: "Entrez votre sujet de recherche...",
    generateSuggestions: "Générer des suggestions de recherche aléatoires",
    searchSuggestions: "Suggestions de Recherche",
    showAll: "Tout Afficher",
    settings: "Paramètres",
    
    queries: "Requêtes",
    
    searchEngines: {
      google: "Google",
      bing: "Bing", 
      duckduckgo: "DuckDuckGo",
      yahoo: "Yahoo",
      bingedgear: "Bing Edgear",
    },
    
    languages: {
      en: "English",
      id: "Bahasa Indonesia",
      ar: "العربية",
      zh: "中文",
      ja: "日本語",
      ru: "Русский",
      es: "Español",
      fr: "Français",
      de: "Deutsch",
      pt: "Português",
      hi: "हिन्दी",
      ko: "한국어",
    },
    
    language: "Langue",
    engine: "Moteur de Recherche",
    processingTimeWarning: "Les grands nombres peuvent prendre plus de temps à traiter",
    engineDescription: "Choisissez votre moteur de recherche préféré",
    languageDescription: "Sélectionnez la langue pour les suggestions et l'interface",
    behaviorOptions: "Options de Comportement",
    newTab: "Ouvrir dans un Nouvel Onglet",
    newTabDescription: "Ouvrir les résultats de recherche dans de nouveaux onglets du navigateur",
    sameTab: "Ouvrir dans le Même Onglet",
    sameTabDescription: "Naviguer vers les résultats de recherche dans l'onglet actuel",
    copyMode: "Mode Copie",
    copyModeDescription: "Copier les suggestions dans le presse-papiers au lieu de rechercher",
    floatingTab: "Ouvrir dans un Onglet Flottant",
    floatingTabDescription: "Ouvrir les résultats de recherche dans une fenêtre popup flottante",
    close: "Fermer",
    
    mobileMode: "Mobile",
    desktopMode: "Bureau",
    viewMode: "Mode d'Affichage",
    
    floatingTabError: "Impossible de charger",
    floatingTabErrorDescription: "Ce moteur de recherche ne peut pas être affiché en mode flottant en raison de restrictions de sécurité.",
    openInNewTab: "Ouvrir dans un Nouvel Onglet",
    
    startTyping: "Commencez à taper pour générer des suggestions de recherche",
    configureSettings: "Configurez le nombre de requêtes, le moteur de recherche et la langue dans les paramètres",
    clickShuffle: "Cliquez sur le bouton {icon} pour générer des suggestions de recherche aléatoires",
    noSuggestions: "Aucune suggestion trouvée pour",
    allExplored: "Toutes les suggestions ont été explorées ! Générez-en de nouvelles ou augmentez le nombre de requêtes.",
    
    clickToSearch: "Cliquez pour rechercher sur",
    clickToCopy: "Cliquez pour copier le texte",
    clickedReplaced: "Les suggestions cliquées seront remplacées par de nouvelles",
    alreadyExplored: "Déjà Exploré",
    notYetExplored: "Pas Encore Exploré",
    
    clickToOpen: "Cliquez pour ouvrir sur",
    clickToCopyText: "Cliquez pour copier",
    
    copySuccessMessage: "Copié dans le presse-papiers",
    copyFailedMessage: "Échec de la copie",
    
    download: "Télécharger",
    downloading: "Téléchargement...",
    downloadComplete: "Téléchargement terminé",
    downloadFailed: "Échec du téléchargement",
    downloadStatus: "Statut",
    
    unopened: "non ouvert",
    opened: "ouvert",
    uncopied: "non copié",
    copied: "copié",
    
    unopenedCapital: "Non Ouvert",
    openedCapital: "Ouvert", 
    uncopiedCapital: "Non Copié",
    copiedCapital: "Copié",
    
    unopenedHeader: "Non Ouvert",
    openedHeader: "Ouvert",
    uncopiedHeader: "Non Copié",
    copiedHeader: "Copié",
    
    remaining: "restantes",
    explored: "explorées",
    
    all: "Tout",
    
    smartSearchGenerator: "Générateur de Suggestions de Recherche",
  },
  
  de: {
    appTitle: "Suchvorschläge Generator",
    appDescription: "Erstellen Sie intelligente Suchvorschläge und erkunden Sie sie sofort über mehrere Suchmaschinen. Passen Sie die Anzahl der Abfragen an und verfolgen Sie Ihren Erkundungsfortschritt.",
    
    appNameForFile: "suchvorschlaege-generator",
    allFilter: "alle",
    
    searchPlaceholder: "Geben Sie Ihr Suchthema ein...",
    generateSuggestions: "Zufällige Suchvorschläge generieren",
    searchSuggestions: "Suchvorschläge",
    showAll: "Alle Anzeigen",
    settings: "Einstellungen",
    
    queries: "Abfragen",
    
    searchEngines: {
      google: "Google",
      bing: "Bing",
      duckduckgo: "DuckDuckGo",
      yahoo: "Yahoo",
      bingedgear: "Bing Edgear",
    },
    
    languages: {
      en: "English",
      id: "Bahasa Indonesia",
      ar: "العربية",
      zh: "中文",
      ja: "日本語", 
      ru: "Русский",
      es: "Español",
      fr: "Français",
      de: "Deutsch",
      pt: "Português",
      hi: "हिन्दी",
      ko: "한국어",
    },
    
    language: "Sprache",
    engine: "Suchmaschine",
    processingTimeWarning: "Große Zahlen können länger zur Verarbeitung brauchen",
    engineDescription: "Wählen Sie Ihre bevorzugte Suchmaschine",
    languageDescription: "Sprache für Vorschläge und Benutzeroberfläche auswählen",
    behaviorOptions: "Verhaltensoptionen",
    newTab: "In Neuem Tab Öffnen",
    newTabDescription: "Suchergebnisse in neuen Browser-Tabs öffnen",
    sameTab: "Im Gleichen Tab Öffnen",
    sameTabDescription: "Zu Suchergebnissen im aktuellen Tab navigieren",
    copyMode: "Kopiermodus",
    copyModeDescription: "Vorschläge in die Zwischenablage kopieren statt zu suchen",
    floatingTab: "In schwebendem Tab öffnen",
    floatingTabDescription: "Suchergebnisse in einem schwebenden Popup-Fenster öffnen",
    close: "Schließen",
    
    mobileMode: "Mobil",
    desktopMode: "Desktop",
    viewMode: "Anzeigemodus",
    
    floatingTabError: "Kann nicht laden",
    floatingTabErrorDescription: "Diese Suchmaschine kann aufgrund von Sicherheitsbeschränkungen nicht im schwebenden Modus angezeigt werden.",
    openInNewTab: "In neuem Tab öffnen",
    
    startTyping: "Beginnen Sie zu tippen, um Suchvorschläge zu generieren",
    configureSettings: "Konfigurieren Sie Anzahl der Abfragen, Suchmaschine und Sprache in den Einstellungen",
    clickShuffle: "Klicken Sie auf die {icon} Schaltfläche, um zufällige Suchvorschläge zu generieren",
    noSuggestions: "Keine Vorschläge gefunden für",
    allExplored: "Alle Vorschläge wurden erkundet! Erstellen Sie neue oder erhöhen Sie die Anzahl der Abfragen.",
    
    clickToSearch: "Klicken Sie, um zu suchen auf",
    clickToCopy: "Klicken Sie, um Text zu kopieren",
    clickedReplaced: "Angeklickte Vorschläge werden durch neue ersetzt",
    alreadyExplored: "Bereits Erkundet",
    notYetExplored: "Noch Nicht Erkundet",
    
    clickToOpen: "Klicken Sie, um zu öffnen auf",
    clickToCopyText: "Klicken Sie zum Kopieren",
    
    copySuccessMessage: "In Zwischenablage kopiert",
    copyFailedMessage: "Kopieren fehlgeschlagen",
    
    download: "Herunterladen",
    downloading: "Wird heruntergeladen...",
    downloadComplete: "Download abgeschlossen",
    downloadFailed: "Download fehlgeschlagen",
    downloadStatus: "Status",
    
    unopened: "nicht geöffnet",
    opened: "geöffnet",
    uncopied: "nicht kopiert",
    copied: "kopiert",
    
    unopenedCapital: "Nicht Geöffnet",
    openedCapital: "Geöffnet",
    uncopiedCapital: "Nicht Kopiert",
    copiedCapital: "Kopiert",
    
    unopenedHeader: "Nicht Geöffnet",
    openedHeader: "Geöffnet",
    uncopiedHeader: "Nicht Kopiert",
    copiedHeader: "Kopiert",
    
    remaining: "verbleibende",
    explored: "erkundet",
    
    all: "Alle",
    
    smartSearchGenerator: "Suchvorschläge Generator",
  },
  
  pt: {
    appTitle: "Gerador de Sugestões de Pesquisa",
    appDescription: "Gere sugestões de pesquisa inteligentes e explore-as instantaneamente em vários motores de busca. Personalize o número de consultas e acompanhe seu progresso de exploração.",
    
    appNameForFile: "gerador-sugestoes-pesquisa",
    allFilter: "tudo",
    
    searchPlaceholder: "Digite seu tópico de pesquisa...",
    generateSuggestions: "Gerar sugestões de pesquisa aleatórias",
    searchSuggestions: "Sugestões de Pesquisa",
    showAll: "Mostrar Tudo",
    settings: "Configurações",
    
    queries: "Consultas",
    
    searchEngines: {
      google: "Google",
      bing: "Bing",
      duckduckgo: "DuckDuckGo",
      yahoo: "Yahoo",
      bingedgear: "Bing Edgear",
    },
    
    languages: {
      en: "English",
      id: "Bahasa Indonesia",
      ar: "العربية",
      zh: "中文",
      ja: "日本語",
      ru: "Русский",
      es: "Español",
      fr: "Français",
      de: "Deutsch",
      pt: "Português",
      hi: "हिन्दी",
      ko: "한국어",
    },
    
    language: "Idioma",
    engine: "Motor de Busca",
    processingTimeWarning: "Números grandes podem demorar mais para processar",
    engineDescription: "Escolha seu motor de busca preferido",
    languageDescription: "Selecione idioma para sugestões e interface",
    behaviorOptions: "Opções de Comportamento",
    newTab: "Abrir em Nova Aba",
    newTabDescription: "Abrir resultados de pesquisa em novas abas do navegador",
    sameTab: "Abrir na Mesma Aba",
    sameTabDescription: "Navegar para resultados de pesquisa na aba atual",
    copyMode: "Modo Copiar",
    copyModeDescription: "Copiar sugestões para a área de transferência em vez de pesquisar",
    floatingTab: "Abrir em Aba Flutuante",
    floatingTabDescription: "Abrir resultados de pesquisa em uma janela popup flutuante",
    close: "Fechar",
    
    mobileMode: "Mobile",
    desktopMode: "Desktop",
    viewMode: "Modo de Visualização",
    
    floatingTabError: "Não é possível carregar",
    floatingTabErrorDescription: "Este motor de busca não pode ser exibido no modo flutuante devido a restrições de segurança.",
    openInNewTab: "Abrir em Nova Aba",
    
    startTyping: "Comece a digitar para gerar sugestões de pesquisa",
    configureSettings: "Configure número de consultas, motor de busca e idioma nas configurações",
    clickShuffle: "Clique no botão {icon} para gerar sugestões de pesquisa aleatórias",
    noSuggestions: "Nenhuma sugestão encontrada para",
    allExplored: "Todas as sugestões foram exploradas! Gere novas ou aumente o número de consultas.",
    
    clickToSearch: "Clique para pesquisar no",
    clickToCopy: "Clique para copiar texto",
    clickedReplaced: "Sugestões clicadas serão substituídas por novas",
    alreadyExplored: "Já Explorado",
    notYetExplored: "Ainda Não Explorado",
    
    clickToOpen: "Clique para abrir no",
    clickToCopyText: "Clique para copiar",
    
    copySuccessMessage: "Copiado para a área de transferência",
    copyFailedMessage: "Falha ao copiar",
    
    download: "Baixar",
    downloading: "Baixando...",
    downloadComplete: "Download completo",
    downloadFailed: "Download falhou",
    downloadStatus: "Status",
    
    unopened: "não aberto",
    opened: "aberto",
    uncopied: "não copiado",
    copied: "copiado",
    
    unopenedCapital: "Não Aberto",
    openedCapital: "Aberto",
    uncopiedCapital: "Não Copiado",
    copiedCapital: "Copiado",
    
    unopenedHeader: "Não Aberto",
    openedHeader: "Aberto",
    uncopiedHeader: "Não Copiado",
    copiedHeader: "Copiado",
    
    remaining: "restantes",
    explored: "exploradas",
    
    all: "Tudo",
    
    smartSearchGenerator: "Gerador de Sugestões de Pesquisa",
  },
  
  hi: {
    appTitle: "खोज सुझाव जेनरेटर",
    appDescription: "बुद्धिमान खोज सुझाव उत्पन्न करें और उन्हें कई खोज इंजनों पर तुरंत एक्सप्लोर करें। क्वेरी संख्या को कस्टमाइज़ करें और अपनी एक्सप्लोरेशन प्रगति को ट्रैक करें।",
    
    appNameForFile: "खोज-सुझाव-जेनरेटर",
    allFilter: "सभी",
    
    searchPlaceholder: "अपना खोज विषय दर्ज करें...",
    generateSuggestions: "यादृच्छिक खोज सुझाव उत्पन्न करें",
    searchSuggestions: "खोज सुझाव",
    showAll: "सभी दिखाएं",
    settings: "सेटिंग्स",
    
    queries: "क्वेरीज़",
    
    searchEngines: {
      google: "गूगल",
      bing: "बिंग",
      duckduckgo: "DuckDuckGo",
      yahoo: "याहू",
      bingedgear: "बिंग Edgear",
    },
    
    languages: {
      en: "English",
      id: "Bahasa Indonesia",
      ar: "العربية",
      zh: "中文",
      ja: "日本語",
      ru: "Русский",
      es: "Español",
      fr: "Français",
      de: "Deutsch",
      pt: "Português",
      hi: "हिन्दी",
      ko: "한국어",
    },
    
    language: "भाषा",
    engine: "खोज इंजन",
    processingTimeWarning: "बड़ी संख्याओं को प्रोसेस करने में अधिक समय लग सकता है",
    engineDescription: "अपना पसंदीदा खोज इंजन चुनें",
    languageDescription: "सुझावों और इंटरफेस के लिए भाषा चुनें",
    behaviorOptions: "व्यवहार विकल्प",
    newTab: "नए टैब में खोलें",
    newTabDescription: "खोज परिणामों को नए ब्राउज़र टैब में खोलें",
    sameTab: "उसी टैब में खोलें",
    sameTabDescription: "वर्तमान टैब में खोज परिणामों पर नेविगेट करें",
    copyMode: "कॉपी मोड",
    copyModeDescription: "खोजने के बजाय सुझावों को क्लिपबोर्ड पर कॉपी करें",
    floatingTab: "फ्लोटिंग टैब में खोलें",
    floatingTabDescription: "फ्लोटिंग पॉपअप विंडो में खोज परिणाम खोलें",
    close: "बंद करें",
    
    mobileMode: "मोबाइल",
    desktopMode: "डेस्कटॉप",
    viewMode: "व्यू मोड",
    
    floatingTabError: "लोड नहीं हो सकता",
    floatingTabErrorDescription: "सुरक्षा प्रतिबंधों के कारण यह खोज इंजन फ्लोटिंग मोड में प्रदर्शित नहीं हो सकता।",
    openInNewTab: "नए टैब में खोलें",
    
    startTyping: "खोज सुझाव उत्पन्न करने के लिए टाइप करना शुरू करें",
    configureSettings: "सेटिंग्स में क्वेरी संख्या, खोज इंजन और भाषा कॉन्फ़िगर करें",
    clickShuffle: "यादृच्छिक खोज सुझाव उत्पन्न करने के लिए {icon} बटन पर क्लिक करें",
    noSuggestions: "के लिए कोई सुझाव नहीं मिला",
    allExplored: "सभी सुझावों का पता लगाया गया है! नए उत्पन्न करें या क्वेरी संख्या बढ़ाएं।",
    
    clickToSearch: "में खोजने के लिए क्लिक करें",
    clickToCopy: "टेक्स्ट कॉपी करने के लिए क्लिक करें",
    clickedReplaced: "क्लिक किए गए सुझावों को नए से बदल दिया जाएगा",
    alreadyExplored: "पहले से एक्सप्लोर्ड",
    notYetExplored: "अभी तक एक्सप्लोर्ड नहीं",
    
    clickToOpen: "में खोलने के लिए क्लिक करें",
    clickToCopyText: "कॉपी करने के लिए क्लिक करें",
    
    copySuccessMessage: "क्लिपबोर्ड पर कॉपी हो गया",
    copyFailedMessage: "कॉपी करने में असफल",
    
    download: "डाउनलोड",
    downloading: "डाउनलोड हो रहा है...",
    downloadComplete: "डाउनलोड पूरा",
    downloadFailed: "डाउनलोड असफल",
    downloadStatus: "स्थिति",
    
    unopened: "नहीं खोला गया",
    opened: "खोला गया",
    uncopied: "कॉपी नहीं किया गया",
    copied: "कॉपी किया गया",
    
    unopenedCapital: "नहीं खोला गया",
    openedCapital: "खोला गया",
    uncopiedCapital: "कॉपी नहीं किया गया",
    copiedCapital: "कॉपी किया गया",
    
    unopenedHeader: "नहीं खोला गया",
    openedHeader: "खोला गया",
    uncopiedHeader: "कॉपी नहीं किया गया",
    copiedHeader: "कॉपी किया गया",
    
    remaining: "शेष",
    explored: "एक्सप्लोर्ड",
    
    all: "सभी",
    
    smartSearchGenerator: "खोज सुझाव जेनरेटर",
  },
  
  ko: {
    appTitle: "검색 제안 생성기",
    appDescription: "지능적인 검색 제안을 생성하고 여러 검색 엔진에서 즉시 탐색하세요. 쿼리 수를 사용자 정의하고 탐색 진행 상황을 추적하세요.",
    
    appNameForFile: "검색-제안-생성기",
    allFilter: "모두",
    
    searchPlaceholder: "검색 주제를 입력하세요...",
    generateSuggestions: "무작위 검색 제안 생성",
    searchSuggestions: "검색 제안",
    showAll: "모두 보기",
    settings: "설정",
    
    queries: "쿼리",
    
    searchEngines: {
      google: "구글",
      bing: "빙",
      duckduckgo: "DuckDuckGo",
      yahoo: "야후",
      bingedgear: "빙 Edgear",
    },
    
    languages: {
      en: "English",
      id: "Bahasa Indonesia",
      ar: "العربية",
      zh: "中文",
      ja: "日本語",
      ru: "Русский",
      es: "Español",
      fr: "Français",
      de: "Deutsch",
      pt: "Português",
      hi: "हिन्दी",
      ko: "한국어",
    },
    
    language: "언어",
    engine: "검색 엔진",
    processingTimeWarning: "큰 숫자는 처리하는 데 더 오래 걸릴 수 있습니다",
    engineDescription: "선호하는 검색 엔진을 선택하세요",
    languageDescription: "제안 및 인터페이스 언어 선택",
    behaviorOptions: "동작 옵션",
    newTab: "새 탭에서 열기",
    newTabDescription: "새 브라우저 탭에서 검색 결과 열기",
    sameTab: "같은 탭에서 열기",
    sameTabDescription: "현재 탭에서 검색 결과로 이동",
    copyMode: "복사 모드",
    copyModeDescription: "검색 대신 클립보드로 제안 복사",
    floatingTab: "플로팅 탭에서 열기",
    floatingTabDescription: "플로팅 팝업 창에서 검색 결과 열기",
    close: "닫기",
    
    mobileMode: "모바일",
    desktopMode: "데스크톱",
    viewMode: "보기 모드",
    
    floatingTabError: "로드할 수 없음",
    floatingTabErrorDescription: "보안 제한으로 인해 이 검색 엔진은 플로팅 모드로 표시할 수 없습니다.",
    openInNewTab: "새 탭에서 열기",
    
    startTyping: "검색 제안을 생성하려면 입력을 시작하세요",
    configureSettings: "설정에서 쿼리 수, 검색 엔진 및 언어를 구성하세요",
    clickShuffle: "무작위 검색 제안을 생성하려면 {icon} 버튼을 클릭하세요",
    noSuggestions: "에 대한 제안을 찾을 수 없습니다",
    allExplored: "모든 제안이 탐색되었습니다! 새로운 것을 생성하거나 쿼리 수를 늘리세요.",
    
    clickToSearch: "에서 검색하려면 클릭하세요",
    clickToCopy: "텍스트를 복사하려면 클릭하세요",
    clickedReplaced: "클릭된 제안은 새로운 것으로 교체됩니다",
    alreadyExplored: "이미 탐색됨",
    notYetExplored: "아직 탐색되지 않음",
    
    clickToOpen: "에서 열려면 클릭하세요",
    clickToCopyText: "복사하려면 클릭하세요",
    
    copySuccessMessage: "클립보드에 복사됨",
    copyFailedMessage: "복사 실패",
    
    download: "다운로드",
    downloading: "다운로드 중...",
    downloadComplete: "다운로드 완료",
    downloadFailed: "다운로드 실패",
    downloadStatus: "상태",
    
    unopened: "열지 않음",
    opened: "열림",
    uncopied: "복사하지 않음",
    copied: "복사됨",
    
    unopenedCapital: "열지 않음",
    openedCapital: "열림",
    uncopiedCapital: "복사하지 않음",
    copiedCapital: "복사됨",
    
    unopenedHeader: "열지 않음",
    openedHeader: "열림",
    uncopiedHeader: "복사하지 않음",
    copiedHeader: "복사됨",
    
    remaining: "남은",
    explored: "탐색됨",
    
    all: "모두",
    
    smartSearchGenerator: "검색 제안 생성기",
  },
};

// Helper function to get context-aware terminology
export const getContextualTerminology = (t: Translations, copyMode: boolean) => {
  return {
    remaining: copyMode ? t.uncopied : t.unopened,
    explored: copyMode ? t.copied : t.opened,
    // Capitalized versions for modal filters
    remainingCapital: copyMode ? t.uncopiedCapital : t.unopenedCapital,
    exploredCapital: copyMode ? t.copiedCapital : t.openedCapital,
    // Header versions for downloads
    remainingHeader: copyMode ? t.uncopiedHeader : t.unopenedHeader,
    exploredHeader: copyMode ? t.copiedHeader : t.openedHeader,
    // Dynamic action descriptions
    clickAction: copyMode ? t.clickToCopyText : t.clickToOpen,
    // Keep generic terms for backwards compatibility
    remainingGeneric: t.remaining,
    exploredGeneric: t.explored
  };
};

// RTL languages list
const RTL_LANGUAGES = ['ar'];

export function useLanguage() {
  return React.useContext(LanguageContext);
}

// Helper function to check if language is RTL
export function isRTLLanguage(language: string): boolean {
  return RTL_LANGUAGES.includes(language);
}

const LanguageContext = React.createContext<{
  language: string;
  t: Translations;
  setLanguage: (lang: string) => void;
  isRTL: boolean;
}>({
  language: 'en',
  t: translations.en,
  setLanguage: () => {},
  isRTL: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = React.useState('en');
  const isRTL = isRTLLanguage(language);

  // Update document direction when language changes
  React.useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{
      language,
      t: translations[language] || translations.en,
      setLanguage,
      isRTL,
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export default LanguageContext;