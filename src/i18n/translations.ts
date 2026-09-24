import { SupportedLanguage } from './types';

export const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // App Branding & Navigation
    'app.title': 'School AI Inbox',
    'app.subtitle': 'Share UK school notices · Extract to-dos · Sync to Google Tasks',
    'app.badge': 'UK Edition',
    'nav.gallery_mode': 'Android Photos (Long-Press)',
    'nav.inbox_mode': 'School AI Inbox',
    'nav.full_width': 'Full Width',
    'nav.android_frame': 'Android Frame',
    'nav.connect_google': 'Connect Google',
    'nav.connecting': 'Connecting...',
    'nav.logout': 'Sign Out',
    'nav.tasks_label': 'Task List:',
    'nav.refresh_lists': 'Refresh lists',
    'nav.settings': 'Settings',

    // Hero Card
    'hero.badge': 'UK Parent School Assistant',
    'hero.title_line1': 'Share any school message.',
    'hero.title_line2': 'Get a clear to-do list.',
    'hero.description':
      'Tired of digging through newsletters, paper letters, ParentPay emails, and WhatsApp groups? Let AI extract exact deadlines, payments, and kit lists into Google Tasks.',

    // Privacy Banner
    'privacy.banner_title': 'On-Device Privacy Redaction Enabled',
    'privacy.banner_desc':
      'Real child names, school names, and teacher contacts are stripped on your device before sending to the AI model.',
    'privacy.how_it_works': 'How it works',
    'privacy.shield_title': 'On-Device Privacy Shield',
    'privacy.detected_children': 'Registered children for on-device protection:',

    // Core Flow Banner
    'core_flow.title': 'Android Gallery Long-Press Share',
    'core_flow.badge': 'Core Flow',
    'core_flow.desc':
      'Long-press a notice in your Android Gallery → tap School Inbox in the Share Sheet → OCR scans first, then extracts tasks.',
    'core_flow.button': 'Try Gallery Long-Press',

    // Input Tabs
    'tab.text_share': 'Text Share',
    'tab.photo_gallery': 'Gallery Long-Press',
    'tab.camera_ocr': 'Camera OCR',
    'tab.paste_text': 'Paste Text',

    // Gallery Tab in NoticeInput
    'tab_gallery.title': 'Android Gallery Long-Press Sharing',
    'tab_gallery.subtitle':
      'Instead of simply picking a photo inside the app, simulate holding a photo in Android Google Photos to launch the system share sheet:',
    'tab_gallery.switch_button': 'Open Gallery View →',
    'tab_gallery.test_hint_title': 'Want to test the real touch-and-hold gesture (0.5s)?',
    'tab_gallery.test_hint_desc':
      'Switch to the Android Gallery view to hold down any letter with your thumb or mouse.',
    'tab_gallery.test_button': 'Long-Press Photos Now',

    // Simulator Tab
    'sim.title': 'Simulate Android Share from WhatsApp / Email',
    'sim.subtitle': 'Pick a UK school notice sample below to simulate sharing text into the app:',
    'sim.share_button': 'Simulate Share & Extract To-dos',
    'sim.quick_samples': 'Quick UK School Notice Samples',

    // Camera OCR Tab
    'camera.title': 'Take Document Photo (OCR Read First)',
    'camera.subtitle': 'Snap paper letters, newsletters, or consent forms with your camera',
    'camera.snap_button': 'Open Camera & Snap Notice',
    'camera.drop_hint': 'Or drop an image file here, or paste from clipboard (Ctrl+V)',
    'camera.browse_files': 'Browse Files',

    // Paste Text Tab
    'paste.title': 'Paste School Notice Text',
    'paste.subtitle': 'Paste text from ParentPay, Arbor, ParentMail, or WhatsApp message',
    'paste.placeholder':
      "Paste notice text here... (e.g. 'Dear Parents, Year 4 will visit Verulamium Museum on 7th Oct. Payment of £14.50 on ParentPay due Friday 2nd Oct. Bring waterproof coat and nut-free packed lunch.')",
    'paste.paste_clipboard': 'Paste from Clipboard',
    'paste.clear': 'Clear',
    'paste.analyze_button': 'Extract To-dos & Deadlines',

    // Android Gallery Screen
    'gallery.app_name': 'Google Photos',
    'gallery.os_name': 'Android Gallery',
    'gallery.tagline': 'Long-press any photo to share',
    'gallery.instructions_title': 'Long-press any document photo (0.5s)',
    'gallery.instructions_desc':
      'Hold down on any letter for 0.5 seconds to open the Android Share Sheet, then select School AI Inbox to extract tasks.',
    'gallery.cat_all': 'All Photos',
    'gallery.cat_notices': 'School Letters',
    'gallery.cat_trips': 'Trips & Consents',
    'gallery.snap_title': 'Take photo and add to gallery',
    'gallery.upload_title': 'Upload photo to gallery',
    'gallery.holding': 'Holding',
    'gallery.long_press_can_share': 'Long-press to share',
    'gallery.selected_count': '1 selected',
    'gallery.cancel_select': 'Deselect',
    'gallery.share_button': 'Share',
    'gallery.quick_tap_toast': 'Selected "{title}". Hold for 0.5s to trigger share, or tap Share below.',
    'gallery.quick_tap_btn': 'Share Now',

    // Android Share Sheet
    'sharesheet.title': 'Share 1 Document Photo',
    'sharesheet.apps_title': 'Share with App',
    'sharesheet.school_inbox_sub': 'OCR & Tasks (Recommended)',
    'sharesheet.close': 'Close',
    'sharesheet.direct_action': 'Send to School AI Inbox (OCR Scan First)',

    // Toast received
    'toast.received_from_gallery': 'Received photo shared from Android Gallery:',

    // OCR Read First Screen
    'ocr.step_badge': 'Step 1 of 2: On-Device Document Scan',
    'ocr.title': 'OCR Read First (Document Verification)',
    'ocr.subtitle':
      'Review the recognized text below before sending an anonymised version to the AI model.',
    'ocr.scanning': 'Scanning document text...',
    'ocr.confidence': 'Confidence',
    'ocr.words_detected': 'Words detected',
    'ocr.doc_type': 'Paper Letter',
    'ocr.editable_label': 'Extracted Notice Text (Editable)',
    'ocr.editable_hint': 'You can edit or correct any OCR typos before extracting tasks.',
    'ocr.retake': 'Retake / Choose Another',
    'ocr.proceed': 'Proceed to Extract Tasks →',

    // Tasks Review Screen ("係咪呢啲？")
    'review.step_badge': 'Step 2 of 2: Review & Confirm',
    'review.title': 'Is this right? (Check To-Dos)',
    'review.subtitle':
      'Review extracted tasks before adding them to Google Tasks. You can add, edit, or remove items.',
    'review.child_label': 'Child:',
    'review.school_label': 'School:',
    'review.payment_required': 'Payment Required',
    'review.items_to_bring': 'Items to Bring',
    'review.dates_to_note': 'Key Dates',
    'review.tasks_to_add': 'Tasks to Add to Google Tasks',
    'review.add_task': '+ Add Custom Task',
    'review.new_task_placeholder': 'e.g. Return consent slip to Mrs Higgins',
    'review.privacy_shield_btn': 'View On-Device Privacy Report',
    'review.select_all': 'Select All',
    'review.deselect_all': 'Deselect All',
    'review.sync_button': 'Sync {count} Tasks to Google Tasks',
    'review.back_button': 'Back',

    // Sync Confirm Modal
    'sync_modal.title': 'Confirm Sync to Google Tasks',
    'sync_modal.desc': 'The following {count} tasks will be created in your selected Google Tasks list:',
    'sync_modal.target_list': 'Target List:',
    'sync_modal.confirm_btn': 'Confirm & Add to Google Tasks',
    'sync_modal.cancel_btn': 'Cancel',
    'sync_modal.syncing': 'Adding to Google Tasks...',

    // Sync Success Modal
    'success_modal.title': 'Tasks Successfully Added!',
    'success_modal.desc': 'Added {count} tasks to "{list}". Check them in Google Tasks or on your phone.',
    'success_modal.open_google_tasks': 'Open Google Tasks Web',
    'success_modal.done': 'Done',

    // History
    'history.title': 'Recent Extracted Notices',
    'history.clear': 'Clear History',
    'history.empty': 'No processed notices yet.',

    // Settings Modal
    'settings.title': 'Settings & Preferences',
    'settings.language_section': 'Display Language',
    'settings.language_desc':
      'Choose your preferred language. Default is English (UK) for UK schools, with support for Traditional & Simplified Chinese.',
    'settings.children_section': 'Child Names (On-Device Redaction)',
    'settings.children_desc':
      'AI never sees real names. When notices contain these names, they are replaced with [CHILD_1], [CHILD_2] on your device before network requests.',
    'settings.add_child_placeholder': "Enter child's first name (e.g. Oliver, Emily, 陳小明)",
    'settings.add_child_btn': 'Add Child',
    'settings.uk_defaults_section': 'UK School Standards',
    'settings.uk_currency': 'Default Currency: £ GBP',
    'settings.uk_portals': 'Compatible Portals: ParentPay, Arbor, ParentMail, MCAS, School Ping',
    'settings.save_close': 'Save & Close',

    // Install APK Modal
    'apk.button': 'Install App (APK)',
    'apk.modal_title': 'Install Android App (APK / WebAPK)',
    'apk.webapk_title': 'Recommended: 1-Tap Direct Install (WebAPK)',
    'apk.webapk_desc': 'Install School AI Inbox directly onto your Android phone. No manual APK download or file management required!',
    'apk.step1': '1. Open this website in Chrome on your Android phone',
    'apk.step2': '2. Tap Chrome menu (⋮) -> Tap "Install app" or "Add to Home screen"',
    'apk.step3': '3. Android will automatically compile & install the signed WebAPK to your App Drawer and Home screen!',
    'apk.step3_benefit': 'Once installed, long-pressing pictures in your Gallery or Google Photos will let you choose "School AI Inbox" from the Share menu.',
    'apk.install_now': 'Install App to Android Phone',
    'apk.standalone_title': 'Or Download Standalone .APK File',
    'apk.standalone_desc': 'If you need a standalone signed/unsigned .apk file to sideload or distribute:',
    'apk.download_via_pwabuilder': 'Generate & Download .APK (PWABuilder)',
    'apk.copy_link': 'Copy App Link',
    'apk.copied': 'Copied to Clipboard!',
  },

  'zh-HK': {
    // App Branding & Navigation
    'app.title': 'School AI Inbox',
    'app.subtitle': 'Share 學校通告 · AI 抽出任務 · 射入 Google Tasks',
    'app.badge': '英國學校版',
    'nav.gallery_mode': '📱 Android 相簿 (長按相片)',
    'nav.inbox_mode': '🎒 School AI Inbox',
    'nav.full_width': '寬螢幕',
    'nav.android_frame': '手機模式',
    'nav.connect_google': '連接 Google',
    'nav.connecting': '連接中...',
    'nav.logout': '登出',
    'nav.tasks_label': '任務清單:',
    'nav.refresh_lists': '重新整理清單',
    'nav.settings': '設定',

    // Hero Card
    'hero.badge': '英國學校家長救星',
    'hero.title_line1': 'Share 任何學校通告。',
    'hero.title_line2': '自動變成清晰待辦。',
    'hero.description':
      '厭倦咗日日睇幾千字 newsletter、紙本信、ParentPay 電郵同 WhatsApp 群組？AI 幫你抽出幾時交錢、買咩、幾時交回條，一掣射入 Google Tasks。',

    // Privacy Banner
    'privacy.banner_title': '本地「借走個名」私隱保護已啟用',
    'privacy.banner_desc':
      '在手機本地先抽走小朋友真實名字、學校名、老師名，換成 [CHILD_1]、[SCHOOL]，完全唔上網。',
    'privacy.how_it_works': '運作原理',
    'privacy.shield_title': '手機本地脫敏盾牌',
    'privacy.detected_children': '已登記保護之小朋友名字：',

    // Core Flow Banner
    'core_flow.title': 'Android 系統相簿長按分享',
    'core_flow.badge': '核心流程',
    'core_flow.desc':
      '喺 Android 系統相簿長按通告相片 → 彈出 Share Sheet 揀 School Inbox → 先 OCR 後提煉。',
    'core_flow.button': '體驗相簿 Long-Press',

    // Input Tabs
    'tab.text_share': '文字 Share',
    'tab.photo_gallery': '相簿長按',
    'tab.camera_ocr': '相機 OCR',
    'tab.paste_text': '貼上文字',

    // Gallery Tab in NoticeInput
    'tab_gallery.title': 'Android 系統相簿 Long-Press 分享',
    'tab_gallery.subtitle':
      '不是在 App 入面單純揀相，而是模擬在 Android Google Photos 長按相片彈出 Share Sheet：',
    'tab_gallery.switch_button': '進入系統相簿界面 →',
    'tab_gallery.test_hint_title': '想試真實長按手勢（Hold 0.5 秒）？',
    'tab_gallery.test_hint_desc':
      '點擊按鈕切換至「Android 系統相簿」，即可用手指或滑鼠長按任何一張通告相片。',
    'tab_gallery.test_button': '立即長按相片',

    // Simulator Tab
    'sim.title': '模擬 Android Share（WhatsApp／電郵）',
    'sim.subtitle': '點擊下方英國學校通告範例，模擬從其他 App Share 入 School AI Inbox：',
    'sim.share_button': '模擬 Share 入 App 抽出待辦',
    'sim.quick_samples': '英國學校常見通告範例',

    // Camera OCR Tab
    'camera.title': '即時拍照（先進行本地 OCR 掃描）',
    'camera.subtitle': '拍攝紙本通告信件、學校電郵截圖或手寫便條',
    'camera.snap_button': '開啟相機拍攝通告',
    'camera.drop_hint': '或拖放圖片檔案至此，或直接剪貼簿貼上（Ctrl+V）',
    'camera.browse_files': '瀏覽相片檔案',

    // Paste Text Tab
    'paste.title': '貼上學校通告文字',
    'paste.subtitle': '支援 ParentPay、Arbor、ParentMail 或 WhatsApp 群組文字',
    'paste.placeholder':
      '喺度貼上通告內容... （例：Dear Parents, Year 4 will visit Verulamium Museum on 7th Oct. Payment of £14.50 on ParentPay due Friday 2nd Oct. Bring waterproof coat and nut-free packed lunch.）',
    'paste.paste_clipboard': '從剪貼簿貼上',
    'paste.clear': '清除',
    'paste.analyze_button': 'AI 抽出任務與截止日期',

    // Android Gallery Screen
    'gallery.app_name': 'Google 相簿 (Photos)',
    'gallery.os_name': 'Android 系統相簿',
    'gallery.tagline': '長按相片以分享',
    'gallery.instructions_title': '長按（Long-press）任何一張通告相片',
    'gallery.instructions_desc':
      '按住相片約 0.5 秒（Hold down），即觸發 Android 原生分享面板，再揀選 School AI Inbox 射入任務！',
    'gallery.cat_all': '全部相片',
    'gallery.cat_notices': '學校通告信件',
    'gallery.cat_trips': '課外活動 / 回條',
    'gallery.snap_title': '即時影相放落相簿',
    'gallery.upload_title': '上傳圖片到相簿',
    'gallery.holding': '長按中',
    'gallery.long_press_can_share': '長按可分享',
    'gallery.selected_count': '已選取 1 張相片',
    'gallery.cancel_select': '取消選取',
    'gallery.share_button': '分享 (Share)',
    'gallery.quick_tap_toast': '已選取「{title}」！請按住相片 0.5 秒長按，或點擊下方「分享」按鈕。',
    'gallery.quick_tap_btn': '立即分享',

    // Android Share Sheet
    'sharesheet.title': '分享 1 張通告相片',
    'sharesheet.apps_title': '分享至應用程式 (Share with App)',
    'sharesheet.school_inbox_sub': 'OCR & 提煉待辦 (推薦)',
    'sharesheet.close': '關閉',
    'sharesheet.direct_action': '🚀 射入 School AI Inbox (先 OCR 掃描文字)',

    // Toast received
    'toast.received_from_gallery': '已從系統相簿接收相片：',

    // OCR Read First Screen
    'ocr.step_badge': '第 1 步 / 共 2 步：本地紙本掃描',
    'ocr.title': 'OCR 逐字先讀（確保資料無遺漏）',
    'ocr.subtitle': '在手機本地先行辨識通告內容，確認文字無誤後再進行脫敏並上傳 AI 提煉。',
    'ocr.scanning': '正在掃描相片文字...',
    'ocr.confidence': '辨識準確度',
    'ocr.words_detected': '偵測字數',
    'ocr.doc_type': '紙本信件',
    'ocr.editable_label': 'OCR 掃描文字（可手動修改校對）',
    'ocr.editable_hint': '你可以喺度修正任何掃描字眼，確保 AI 分析準確。',
    'ocr.retake': '重新拍攝 / 另選相片',
    'ocr.proceed': '確認文字，進入待辦提煉 →',

    // Tasks Review Screen ("係咪呢啲？")
    'review.step_badge': '第 2 步 / 共 2 步：家長把關確認',
    'review.title': '「係咪呢啲？」（保護確認畫面）',
    'review.subtitle':
      '呢個畫面保護你，等 AI 唔會亂加嘢。你可以自由修改日期、刪除多餘項目，確認無誤再射入 Google Tasks。',
    'review.child_label': '小朋友：',
    'review.school_label': '學校：',
    'review.payment_required': '需要繳費',
    'review.items_to_bring': '必備物品清單',
    'review.dates_to_note': '關鍵日期',
    'review.tasks_to_add': '即將射入 Google Tasks 的任務',
    'review.add_task': '+ 新增自訂任務',
    'review.new_task_placeholder': '例如：星期五前交回條畀 Mr Smith',
    'review.privacy_shield_btn': '查看本地脫敏報告',
    'review.select_all': '全選',
    'review.deselect_all': '取消全選',
    'review.sync_button': '一掣射入 Google Tasks ({count} 項待辦)',
    'review.back_button': '返回',

    // Sync Confirm Modal
    'sync_modal.title': '確認射入 Google Tasks',
    'sync_modal.desc': '以下 {count} 個待辦事項將會自動建立至你嘅 Google Tasks 清單：',
    'sync_modal.target_list': '目標清單：',
    'sync_modal.confirm_btn': '確認並建立待辦事項',
    'sync_modal.cancel_btn': '取消',
    'sync_modal.syncing': '正在同步至 Google Tasks...',

    // Sync Success Modal
    'success_modal.title': '已成功射入 Google Tasks！',
    'success_modal.desc': '已建立 {count} 個待辦事項到「{list}」。你可以在手機 Google Tasks App 即時查看。',
    'success_modal.open_google_tasks': '開啟 Google Tasks 網頁版',
    'success_modal.done': '完成',

    // History
    'history.title': '近期處理記錄',
    'history.clear': '清除記錄',
    'history.empty': '暫無處理記錄。',

    // Settings Modal
    'settings.title': '設定與偏好',
    'settings.language_section': '顯示語言 (Display Language)',
    'settings.language_desc':
      '預設為英國學校 English (UK)，同時支援繁體中文（香港習慣）及簡體中文。',
    'settings.children_section': '小朋友名字（用於本機脫敏「借走個名」）',
    'settings.children_desc':
      'AI 永遠唔會知道小朋友真名。當通告出現以下名字時，手機會先將其置換為 [CHILD_1]、[CHILD_2] 先上傳。',
    'settings.add_child_placeholder': '輸入小朋友名字（如：陳小明、Leo、Oliver）',
    'settings.add_child_btn': '新增小朋友',
    'settings.uk_defaults_section': '英國學校標準支援',
    'settings.uk_currency': '預設貨幣：英鎊 (£ GBP)',
    'settings.uk_portals': '支援系統：ParentPay, Arbor, ParentMail, MCAS, School Ping',
    'settings.save_close': '儲存並關閉',

    // Install APK Modal
    'apk.button': '安裝 App / APK',
    'apk.modal_title': '安裝 Android 手機 App (APK / WebAPK)',
    'apk.webapk_title': '推薦方式：免手動下載，手機即時安裝 (WebAPK)',
    'apk.webapk_desc': 'Android 系統會直接將 School AI Inbox 編譯安裝為手機 App，支援相簿長按分享、全螢幕運作，無需手動管理 APK 檔案。',
    'apk.step1': '1. 用 Android 手機的 Chrome 瀏覽器打開本網址',
    'apk.step2': '2. 點擊 Chrome 右上角選單（⋮）➔ 點選「安裝應用程式」或「新增至主螢幕」',
    'apk.step3': '3. Android 系統會自動完成安裝，App 圖標即出現在手機桌面與 App 抽屜！',
    'apk.step3_benefit': '安裝後，在手機相簿長按學校信件相片，分享選單就會出現「School AI Inbox」！',
    'apk.install_now': '立即在手機安裝 App',
    'apk.standalone_title': '或生成獨立 .APK 安裝檔',
    'apk.standalone_desc': '如果你需要手動 sideload 或發送 .apk 檔案給其他人：',
    'apk.download_via_pwabuilder': '前往 PWABuilder 下載 .APK 檔案',
    'apk.copy_link': '複製 App 網址',
    'apk.copied': '已複製到剪貼簿！',
  },

  'zh-CN': {
    // App Branding & Navigation
    'app.title': 'School AI Inbox',
    'app.subtitle': 'Share 学校通知 · AI 提取任务 · 同步至 Google Tasks',
    'app.badge': '英国学校版',
    'nav.gallery_mode': '📱 Android 相册 (长按照片)',
    'nav.inbox_mode': '🎒 School AI Inbox',
    'nav.full_width': '宽屏模式',
    'nav.android_frame': '手机模式',
    'nav.connect_google': '连接 Google',
    'nav.connecting': '连接中...',
    'nav.logout': '退出登录',
    'nav.tasks_label': '任务列表:',
    'nav.refresh_lists': '刷新列表',
    'nav.settings': '设置',

    // Hero Card
    'hero.badge': '英国学校家长助手',
    'hero.title_line1': '分享任何学校通知。',
    'hero.title_line2': '自动整理清晰待办。',
    'hero.description':
      '告别冗长的周报、纸质通知信、ParentPay 缴费邮件与 WhatsApp 群聊。AI 为您提炼截止日期、必带物品与缴费明细，一键同步至 Google Tasks。',

    // Privacy Banner
    'privacy.banner_title': '本地匿名脱敏保护已开启',
    'privacy.banner_desc':
      '在手机本地先移除孩子真实姓名、学校与老师信息，替换为 [CHILD_1]、[SCHOOL]，完全不上传真实隐私。',
    'privacy.how_it_works': '运作原理',
    'privacy.shield_title': '手机本地脱敏护盾',
    'privacy.detected_children': '已登记保护的孩子姓名：',

    // Core Flow Banner
    'core_flow.title': 'Android 系统相册长按分享',
    'core_flow.badge': '核心流程',
    'core_flow.desc':
      '在 Android 系统相册长按照片 → 弹出 Share Sheet 选择 School Inbox → 先 OCR 后提取任务。',
    'core_flow.button': '体验相册长按分享',

    // Input Tabs
    'tab.text_share': '文字分享',
    'tab.photo_gallery': '相册长按',
    'tab.camera_ocr': '相机 OCR',
    'tab.paste_text': '粘贴文字',

    // Gallery Tab in NoticeInput
    'tab_gallery.title': 'Android 系统相册长按分享',
    'tab_gallery.subtitle':
      '不同于在 App 内部选图，本功能模拟在 Android Google Photos 中长按照片弹出系统分享面板：',
    'tab_gallery.switch_button': '进入系统相册界面 →',
    'tab_gallery.test_hint_title': '想要测试真实长按手势（按住 0.5 秒）？',
    'tab_gallery.test_hint_desc':
      '点击按钮切换至“Android 系统相册”，即可用手指或鼠标长按任意一张通知照片。',
    'tab_gallery.test_button': '立即长按照片',

    // Simulator Tab
    'sim.title': '模拟 Android 分享（WhatsApp / 邮件）',
    'sim.subtitle': '点击下方英国学校通知范例，模拟从其他 App 分享至 School AI Inbox：',
    'sim.share_button': '模拟分享至 App 提取待办',
    'sim.quick_samples': '英国学校常见通知范例',

    // Camera OCR Tab
    'camera.title': '即时拍照（本地 OCR 先行扫描）',
    'camera.subtitle': '拍摄纸质通知信、学校邮件截图或手写备忘',
    'camera.snap_button': '开启相机拍摄通知',
    'camera.drop_hint': '或拖放图片文件至此，或直接从剪贴板粘贴（Ctrl+V）',
    'camera.browse_files': '浏览照片文件',

    // Paste Text Tab
    'paste.title': '粘贴学校通知文本',
    'paste.subtitle': '支持 ParentPay、Arbor、ParentMail 或 WhatsApp 群聊文字',
    'paste.placeholder':
      '在此粘贴通知内容... （例：Dear Parents, Year 4 will visit Verulamium Museum on 7th Oct. Payment of £14.50 on ParentPay due Friday 2nd Oct. Bring waterproof coat and nut-free packed lunch.）',
    'paste.paste_clipboard': '从剪贴板粘贴',
    'paste.clear': '清除',
    'paste.analyze_button': 'AI 提炼待办与截止日期',

    // Android Gallery Screen
    'gallery.app_name': 'Google 相册 (Photos)',
    'gallery.os_name': 'Android 系统相册',
    'gallery.tagline': '长按照片以分享',
    'gallery.instructions_title': '长按（Long-press）任意一张通知照片',
    'gallery.instructions_desc':
      '按住照片约 0.5 秒，即可触发 Android 原生分享面板，再选择 School AI Inbox 录入待办！',
    'gallery.cat_all': '全部照片',
    'gallery.cat_notices': '学校通知信件',
    'gallery.cat_trips': '活动与回执',
    'gallery.snap_title': '即时拍照加入相册',
    'gallery.upload_title': '上传照片至相册',
    'gallery.holding': '长按中',
    'gallery.long_press_can_share': '长按可分享',
    'gallery.selected_count': '已选定 1 张照片',
    'gallery.cancel_select': '取消选定',
    'gallery.share_button': '分享 (Share)',
    'gallery.quick_tap_toast': '已选定“{title}”！请按住照片 0.5 秒长按，或点击下方“分享”按钮。',
    'gallery.quick_tap_btn': '立即分享',

    // Android Share Sheet
    'sharesheet.title': '分享 1 张通知照片',
    'sharesheet.apps_title': '分享至应用 (Share with App)',
    'sharesheet.school_inbox_sub': 'OCR & 提炼待办 (推荐)',
    'sharesheet.close': '关闭',
    'sharesheet.direct_action': '🚀 发送至 School AI Inbox (先 OCR 扫描文字)',

    // Toast received
    'toast.received_from_gallery': '已从系统相册接收照片：',

    // OCR Read First Screen
    'ocr.step_badge': '第 1 步 / 共 2 步：本地纸质扫描',
    'ocr.title': 'OCR 逐字先读（核对通知内容）',
    'ocr.subtitle': '在手机本地先行识别通知文本，确认文字无误后再进行脱敏并上传 AI 处理。',
    'ocr.scanning': '正在扫描照片文字...',
    'ocr.confidence': '识别准确度',
    'ocr.words_detected': '识别字数',
    'ocr.doc_type': '纸质信件',
    'ocr.editable_label': 'OCR 扫描文本（可手动编辑校对）',
    'ocr.editable_hint': '您可以在此修正任何扫描错字，确保 AI 分析准确。',
    'ocr.retake': '重新拍摄 / 另选照片',
    'ocr.proceed': '确认文字，进入待办提取 →',

    // Tasks Review Screen ("係咪呢啲？")
    'review.step_badge': '第 2 步 / 共 2 步：家长确认检查',
    'review.title': '待办确认清单（检查与修改）',
    'review.subtitle':
      '此页面防止 AI 虚构内容。您可以自由修改截止日期、删除多余项目，确认无误后再同步至 Google Tasks。',
    'review.child_label': '孩子：',
    'review.school_label': '学校：',
    'review.payment_required': '需要缴费',
    'review.items_to_bring': '必带物品清单',
    'review.dates_to_note': '重要日期',
    'review.tasks_to_add': '即将添加至 Google Tasks 的任务',
    'review.add_task': '+ 添加自定义待办',
    'review.new_task_placeholder': '例如：周五前向班主任提交回执',
    'review.privacy_shield_btn': '查看本地脱敏报告',
    'review.select_all': '全选',
    'review.deselect_all': '取消全选',
    'review.sync_button': '一键同步至 Google Tasks ({count} 项待办)',
    'review.back_button': '返回',

    // Sync Confirm Modal
    'sync_modal.title': '确认同步至 Google Tasks',
    'sync_modal.desc': '以下 {count} 项待办将自动添加至您的 Google Tasks 任务列表：',
    'sync_modal.target_list': '目标列表：',
    'sync_modal.confirm_btn': '确认并添加待办',
    'sync_modal.cancel_btn': '取消',
    'sync_modal.syncing': '正在同步至 Google Tasks...',

    // Sync Success Modal
    'success_modal.title': '已成功添加至 Google Tasks！',
    'success_modal.desc': '已创建 {count} 项待办至“{list}”。您可以在手机 Google Tasks 查看。',
    'success_modal.open_google_tasks': '打开 Google Tasks 网页版',
    'success_modal.done': '完成',

    // History
    'history.title': '近期处理记录',
    'history.clear': '清除记录',
    'history.empty': '暂无处理记录。',

    // Settings Modal
    'settings.title': '设置与偏好',
    'settings.language_section': '显示语言 (Display Language)',
    'settings.language_desc':
      '默认采用英国学校 English (UK)，同时提供繁体中文（香港常用）与简体中文。',
    'settings.children_section': '孩子姓名（用于本地匿名脱敏）',
    'settings.children_desc':
      'AI 不会获取真实姓名。当通知包含以下名字时，手机会在本地替换为 [CHILD_1]、[CHILD_2] 再发送。',
    'settings.add_child_placeholder': '输入孩子姓名（如：Oliver、Emily、Leo）',
    'settings.add_child_btn': '添加孩子姓名',
    'settings.uk_defaults_section': '英国学校标准支持',
    'settings.uk_currency': '默认货币：英镑 (£ GBP)',
    'settings.uk_portals': '支持系统：ParentPay, Arbor, ParentMail, MCAS, School Ping',
    'settings.save_close': '保存并关闭',

    // Install APK Modal
    'apk.button': '安装 App / APK',
    'apk.modal_title': '安装 Android 手机 App (APK / WebAPK)',
    'apk.webapk_title': '推荐方式：免手动下载，手机即时安装 (WebAPK)',
    'apk.webapk_desc': 'Android 系统会直接将 School AI Inbox 编译安装为手机 App，支持相册长按分享、全屏运行，无需手动管理 APK 文件。',
    'apk.step1': '1. 用 Android 手机的 Chrome 浏览器打开本网址',
    'apk.step2': '2. 点击 Chrome 右上角菜单（⋮）➔ 点选“安装应用”或“添加到主屏幕”',
    'apk.step3': '3. Android 系统会自动完成安装，App 图标即出现在手机桌面与应用抽屉！',
    'apk.step3_benefit': '安装后，在手机相册长按学校通知照片，分享菜单就会出现“School AI Inbox”！',
    'apk.install_now': '立即在手机安装 App',
    'apk.standalone_title': '或生成独立 .APK 安装包',
    'apk.standalone_desc': '如果您需要手动 sideload 或发送 .apk 文件给其他人：',
    'apk.download_via_pwabuilder': '前往 PWABuilder 下载 .APK 文件',
    'apk.copy_link': '复制 App 网址',
    'apk.copied': '已复制到剪贴板！',
  },
};
