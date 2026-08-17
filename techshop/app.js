/**
 * TechShop A to Z Interactive Engine & Architecture Guide
 * Pure Vanilla JavaScript
 */

// ==========================================
// 1. DATA REPOSITORIES (Synced with Real Backend)
// ==========================================

// Roles & Actors Data
const ROLES_DATA = {
  admin: {
    title: 'Admin & موظفو الأدمن',
    subtitle: 'الإدارة والتشغيل والرقابة الشاملة على المنصة',
    icon: 'fa-shield-halved',
    interface: 'ويب داشبورد (Web Dashboard)',
    responsibilities: [
      'موافقة وتفعيل حسابات البائعين الجدد وفحص الأوراق والنشاط (Admin\\VendorController).',
      'مراجعة واعتماد المنتجات الجديدة وتعديلات الأسعار والـ Variants.',
      'إدارة الزونز الجغرافية (Polygons) وجدولة الشيفتات واعتماد المناديب (ShiftService / ZoneService).',
      'مراجعة طلبات استرجاع الأموال (OrderRefundService) وطلبات سحب أرباح التجار (VendorWithdrawalService).',
      'إدارة السلايدرز، السبوتلايت، والإشعارات الجماعية عبر BulkNotificationService و FirebaseService.'
    ],
    techModels: ['User (Role: admin, admin_employee)', 'Zone', 'Shift', 'BulkNotification', 'Setting', 'PrivacyPolicy']
  },
  vendor: {
    title: 'Vendor & موظفو التاجر',
    subtitle: 'إدارة المتجر والفروع والكتالوج والطلبات والأرباح',
    icon: 'fa-shop',
    interface: 'لوحة تحكم الويب + API للتاجر (Vendor Panel & API)',
    responsibilities: [
      'اختيار باقة الاشتراك وإدارتها (PlanService / SubscriptionService).',
      'إدارة المنتجات البسيطة والمتغيرة (SimpleProduct & VariableProduct Strategy).',
      'إدارة الفروع المتعددة وتعيين موظفي الفروع ومتابعة المخزون اللحظي (BranchService).',
      'استقبال الطلبات وتجهيزها وبث الحالات عبر WebSockets Reverb (vendor.orders).',
      'متابعة الرصيد الصافي وطلب سحب الأرباح وفتح تذاكر الدعم الفني (TicketService).'
    ],
    techModels: ['Vendor', 'VendorUser', 'Branch', 'BranchProductStock', 'BranchProductVariantStock', 'VendorBalanceTransaction', 'VendorWithdrawal']
  },
  customer: {
    title: 'Customer (العميل)',
    subtitle: 'تصفح المتجر، الشراء، التتبع، وشحن الطرود P2P',
    icon: 'fa-user',
    interface: 'تطبيق الموبايل (Mobile API / Flutter / React Native)',
    responsibilities: [
      'تصفح الماركتبليس، المطاعم، الصيدليات، السوبرماركت والسلايدرز (DiscoveryFeedService).',
      'إضافة المنتجات للسلة، تطبيق الكوبونات، واختيار عنوان التوصيل داخل الزون.',
      'الدفع عبر المحفظة، نقاط المكافآت، أو بطاقات الائتمان عبر Kashier Gateway.',
      'تتبع مسار الطلب لحظياً والدردشة مع المندوب وتقييم الخدمة.',
      'إنشاء شحنات باكدج (Package Shipment) لشحن أي طرد لمستخدم آخر مع نظام التفاوض وعروض الأسعار.'
    ],
    techModels: ['Address', 'CartItem', 'Order', 'PackageShipment', 'WalletTransaction', 'PointTransaction', 'Favorite']
  },
  delivery: {
    title: 'Delivery (المندوب)',
    subtitle: 'استلام الشحنات وتوصيل طلبات الماركتبليس والطرود',
    icon: 'fa-motorcycle',
    interface: 'تطبيق المندوب (Mobile API)',
    responsibilities: [
      'حجز وبدء الشيفتات في الزون المحددة وإرسال طلبات الاستراحة (ShiftService / DeliveryBreakService).',
      'استقبال إشعارات التعيين وقبول/رفض المهام بناءً على أسباب معتمدة (DeliveryDeclineReasonService).',
      'تنفيذ مسار التوصيل المتسلسل (Multi-Vendor Pickup -> Dropoff).',
      'تقديم عروض أسعار تنافسية لشحنات الطرود (PackageShipmentNegotiationService).',
      'متابعة محفظة المندوب وعمولات التوصيل وطلب سحب الرصيد (DeliveryWalletRequestService).'
    ],
    techModels: ['Delivery', 'Shift', 'DeliveryAssignment', 'DeliveryAssignmentLocation', 'DeliveryAssignmentPickup', 'DeliveryWalletTransaction']
  }
};

// 20 Modules Complete Directory - Synced with Backend
const MODULES_DATA = [
  {
    id: 1,
    title: 'المستخدمين والمصادقة (Authentication & Identity)',
    category: 'auth',
    icon: 'fa-user-lock',
    goal: 'إدارة الهوية وتسجيل الدخول الموحد لكل أطراف المنصة مع دعم الـ OTP والـ Tokens.',
    features: [
      'تسجيل ودخول من الويب وتطبيقات الموبايل عبر Laravel Sanctum.',
      'تحقق إيميل وموبايل برموز OTP باستخدام WhySmsService.',
      'استعادة وإعادة تعيين كلمة المرور عبر PasswordController و ResetPasswordController.',
      'إدارة البروفايل وتحديث FCM Tokens للإشعارات اللحظية عبر FirebaseService.',
      'تفعيل/إيقاف الحسابات وتعيين الأدوار عبر Spatie Laravel Permission.'
    ],
    models: ['User', 'Verification'],
    controllers: ['Api\\AuthController', 'Api\\ProfileController', 'Admin\\UserController', 'Auth\\AuthenticatedSessionController'],
    services: ['AdminUserService', 'CustomerService', 'WhySmsService', 'FirebaseService']
  },
  {
    id: 2,
    title: 'عناوين العميل والمطابقة الجغرافية (Customer Addresses & Zones)',
    category: 'auth',
    icon: 'fa-map-pin',
    goal: 'حفظ وتحديد مواقع توصيل العميل بدقة ومطابقتها مع مضلعات الـ Zones.',
    features: [
      'إضافة وتعديل وحذف عناوين التوصيل للعميل مع تحديد العنوان الافتراضي.',
      'تخزين الإحداثيات الجغرافية بدقة (Latitude / Longitude).',
      'الربط التلقائي وحساب مسافات التوصيل عبر GoogleMapsDirectionsService و ZoneService.'
    ],
    models: ['Address', 'Zone'],
    controllers: ['Api\\AddressController', 'Admin\\ZoneController'],
    services: ['AddressService', 'ZoneService', 'GoogleMapsDirectionsService']
  },
  {
    id: 3,
    title: 'التجار وتخصيص الأنواع (Vendors & Multi-Type Handling)',
    category: 'catalog',
    icon: 'fa-store',
    goal: 'إدارة شركاء الماركتبليس (مطاعم، صيدليات، كافيهات، سوبرماركت) ومواعيد العمل.',
    features: [
      'أنواع تجار مختلفة (VendorType) مع إعدادات سلوك خاصة بكل نوع.',
      'سير عمل تسجيل التاجر (RegisteredVendorController) ثم مراجعة واعتماد الأدمن.',
      'تحديد مواعيد العمل وفترات التشغيل اليومية عبر VendorTimeSlot.',
      'إدارة صلاحيات موظفي التاجر عبر VendorUser و VendorUserService.'
    ],
    models: ['Vendor', 'VendorType', 'VendorUser', 'VendorSetting', 'VendorTimeSlot'],
    controllers: ['Admin\\VendorController', 'Vendor\\VendorController', 'Api\\VendorController', 'Api\\VendorTypeController'],
    services: ['VendorService', 'VendorTypeService', 'VendorUserService', 'VendorTimeSlotService', 'VendorTypeAssignmentService']
  },
  {
    id: 4,
    title: 'الباقات والاشتراكات والجدولة (Plans & Cron Automation)',
    category: 'finance',
    icon: 'fa-file-invoice-dollar',
    goal: 'التحكم في حصص التاجر وتطبيق قواعد الترقية والتخفيض وأوامر الكرون اليومية.',
    features: [
      'خطط أسعار بمدة وسعر وحد أقصى لعدد المنتجات والفروع وتمييز المنتجات.',
      'تجديد وترقية فورية للاشتراكات عبر SubscriptionService و PlanService.',
      'تخفيض مجدول (Downgrade) يبدأ بعد انتهاء الفترة الحالية (PLAN_SWITCHING.md).',
      'أوامر Artisan مجدولة: subscriptions:expire و subscriptions:activate-scheduled.'
    ],
    models: ['Plan', 'VendorSubscription'],
    controllers: ['Admin\\PlanController', 'Vendor\\SubscriptionController'],
    services: ['PlanService', 'SubscriptionService']
  },
  {
    id: 5,
    title: 'التصنيفات والـ Variants متعددة اللغات (Catalog Hierarchy)',
    category: 'catalog',
    icon: 'fa-sitemap',
    goal: 'بناء شجرة التصنيفات وخصائص المنتجات مع دعم الترجمة (Spatie Translatable).',
    features: [
      'شجرة تصنيفات هرمية متعددة اللغات (عربي/إنجليزي) مع توليد آلي للـ Slugs.',
      'خصائص موحدة (Variants & Options) مثل الحجم، اللون، السعة.',
      'إمكانية تقديم التاجر طلبات (CategoryRequest / VariantRequest) لإضافة عناصر جديدة.',
      'موافقة أو رفض الأدمن على الطلبات مع إشعار التاجر.'
    ],
    models: ['Category', 'CategoryRequest', 'Variant', 'VariantOption', 'VariantRequest'],
    controllers: ['Admin\\CategoryController', 'Vendor\\CategoryController', 'Api\\CategoryController', 'Admin\\VariantController'],
    services: ['CategoryService', 'VariantService']
  },
  {
    id: 6,
    title: 'الكتالوج ونمط التصميم للمنتجات (Product Strategy Pattern)',
    category: 'catalog',
    icon: 'fa-box-open',
    goal: 'إدارة المنتجات البسيطة والمتغيرة بنمط استراتيجي مرن ومعالجة الصور.',
    features: [
      'تطبيق Strategy Pattern عبر Services/ProductTypes (SimpleProduct & VariableProduct).',
      'معالجة وضغط وتوليد الصور المصغرة عبر ImageService و Intervention Image.',
      'بث تحديثات المنتجات اللحظية عبر قنوات Reverb: products و vendor.products.{id}.',
      'موافقة الأدمن وتفعيل وتمييز المنتجات في الواجهة الرئيسية.'
    ],
    models: ['Product', 'ProductImage', 'ProductCategory', 'ProductRelation', 'ProductVariant', 'ProductVariantValue'],
    controllers: ['Vendor\\ProductController', 'Admin\\ProductController', 'Api\\ProductController'],
    services: ['ProductService', 'ImageService', 'ProductTypes\\SimpleProduct', 'ProductTypes\\VariableProduct']
  },
  {
    id: 7,
    title: 'الفروع والمخزون والتنبيهات (Multi-Branch Inventory)',
    category: 'catalog',
    icon: 'fa-code-branch',
    goal: 'تشغيل التاجر عبر فروع متعددة مع جرد مستقل وتنبيهات انخفاض الستوك.',
    features: [
      'إدارة الفروع ومواقعها الجغرافية لكل تاجر عبر BranchService.',
      'مخزون مستقل على مستوى الفرع للمنتج العادي وقيم الـ Variants.',
      'تنبيهات انخفاض المخزون اللحظية للتجار عبر InventoryAlertService.',
      'لوحات تحكم مخصصة للفروع عبر BranchDashboardController.'
    ],
    models: ['Branch', 'BranchProductStock', 'BranchProductVariantStock'],
    controllers: ['Vendor\\BranchController', 'Vendor\\BranchDashboardController', 'Api\\Vendor\\BranchController'],
    services: ['BranchService', 'InventoryAlertService']
  },
  {
    id: 8,
    title: 'الاكتشاف والتسويق (Discovery, Sliders & Spotlights)',
    category: 'catalog',
    icon: 'fa-bullhorn',
    goal: 'تحسين ظهور المحتوى والمنتجات في الواجهة الرئيسية للعميل.',
    features: [
      'سلايدرز تفاعلية (Sliders) مع تواريخ صلاحية يديرها الأدمن عبر SliderService.',
      'أقسام التمييز (Spotlights) لأفضل المتاجر والعروض الحصرية.',
      'قائمة المفضلة (Favorites) للمستخدمين لحفظ المنتجات والمتاجر.'
    ],
    models: ['Slider', 'Spotlight', 'Favorite'],
    controllers: ['Admin\\SliderController', 'Admin\\SpotlightController', 'Api\\SliderController', 'Api\\SpotlightController'],
    services: ['SliderService', 'SpotlightService']
  },
  {
    id: 9,
    title: 'السلة والكوبونات والتحقق (Cart & Coupon Logic)',
    category: 'orders',
    icon: 'fa-cart-shopping',
    goal: 'تجهيز الطلب والتحقق من التوفر والخصومات قبل الدفع.',
    features: [
      'إضافة منتجات من تجار مختلفين للسلة مع خيارات الـ Variants وحساب المجموع.',
      'تطبيق كوبونات الخصم العامة أو المقيدة بتجار محددين وفحص شروط الاستخدام.',
      'التحقق اللحظي من توفر المخزون في فروع التجار المعنية عبر CartService.'
    ],
    models: ['CartItem', 'Coupon'],
    controllers: ['Api\\CartController', 'Admin\\CouponController'],
    services: ['CartService', 'CouponService']
  },
  {
    id: 10,
    title: 'إدارة الطلبات وتقسيم التجار (Order Splitting Engine)',
    category: 'orders',
    icon: 'fa-receipt',
    goal: 'إدارة دورة حياة الطلبات وتقسيمها المتعدد بين التجار وتتبع الفواتير.',
    features: [
      'إنشاء Order رئيسي وتقسيمه آلياً إلى عدة VendorOrder لكل تاجر مع توليد PDF Invoice.',
      'تتبع حالات التاجر: Pending -> Processing -> Ready -> Delivered.',
      'سجل تاريخ الحالات (OrderLog) مع بث الإشعارات عبر Reverb و FCM.',
      'دعم الاستلام من الفرع (Pickup) أو التوصيل عبر المناديب.'
    ],
    models: ['Order', 'VendorOrder', 'VendorOrderItem', 'OrderLog'],
    controllers: ['Api\\OrderController', 'Vendor\\OrderController', 'Admin\\OrderController'],
    services: ['OrderService', 'DeliveryOrderRealtimeService', 'NotificationService']
  },
  {
    id: 11,
    title: 'الاسترجاع والمطالبات (Order Refund Management)',
    category: 'finance',
    icon: 'fa-rotate-left',
    goal: 'معالجة طلبات استرجاع المبالغ وحماية حقوق العميل والتاجر.',
    features: [
      'تقديم العميل طلب استرجاع بعد تسليم الطلب مع ذكر السبب وإرفاق الصور.',
      'مراجعة الأدمن للطلب وقبوله أو رفضه عبر OrderRefundService.',
      'إعادة المبالغ تلقائياً إلى محفظة العميل أو إلغاء المعاملة عند القبول.'
    ],
    models: ['OrderRefundRequest'],
    controllers: ['Api\\OrderRefundController', 'Admin\\OrderRefundController'],
    services: ['OrderRefundService']
  },
  {
    id: 12,
    title: 'المدفوعات الآمنة وتكامل Kashier (Secure Payments & Webhooks)',
    category: 'finance',
    icon: 'fa-wallet',
    goal: 'إدارة المحافظ، بوابات الدفع الإلكتروني Kashier، والتسويات المالية.',
    features: [
      'محفظة العميل ونظام تجميع واستبدال نقاط المكافآت (PointTransaction).',
      'تكامل KashierClient مع توقيع الـ Webhooks الآمن (KashierWebhookSignature).',
      'معالجة الـ Webhooks المتكررة بأمان (Idempotency) عبر PaymentWebhookEvent.',
      'حساب رصيد التاجر، خصم عمولة المنصة، ودورة سحب الأرباح (VendorWithdrawalService).'
    ],
    models: ['PaymentAttempt', 'PaymentWebhookEvent', 'WalletTransaction', 'PointTransaction', 'VendorBalanceTransaction', 'VendorWithdrawal'],
    controllers: ['Api\\KashierWebhookController', 'Api\\TransactionController', 'Admin\\VendorWithdrawalController', 'Vendor\\WithdrawalController'],
    services: ['Payments\\KashierClient', 'Payments\\KashierWebhookService', 'Payments\\PaymentAttemptService', 'Payments\\PaymentFinalizationService', 'VendorWithdrawalService']
  },
  {
    id: 13,
    title: 'انضمام واعتماد المناديب (Delivery Onboarding & Verification)',
    category: 'orders',
    icon: 'fa-id-card',
    goal: 'تحويل المتقدمين إلى مناديب معتمدين مع التدقيق والتحقق من الوثائق.',
    features: [
      'تقديم طلب Become Delivery عبر الموبايل أو الويب مع رفع رخصة القيادة والوثائق.',
      'مراجعة وتدقيق وفحص وثائق المندوب من قبل الأدمن عبر DeliveryRequestService.',
      'تفعيل بروفايل المندوب وربطه بالزونات المتاحة ومحفظة التوصيل.'
    ],
    models: ['DeliveryRequest', 'Delivery'],
    controllers: ['Api\\BecomeDeliveryController', 'Api\\DeliveryRegisterController', 'Admin\\DeliveryRequestController'],
    services: ['DeliveryRegistrationService', 'DeliveryRequestService', 'DeliveryService']
  },
  {
    id: 14,
    title: 'الزونز الجغرافية والشيفتات (Zones, Shifts & Breaks)',
    category: 'orders',
    icon: 'fa-draw-polygon',
    goal: 'تنظيم التغطية الجغرافية بـ Polygons وضمان تواجد المناديب أثناء الذروة.',
    features: [
      'رسم مناطق جغرافية مضلعة (Polygon GeoJSON) وتعيين رسوم التوصيل والحدود.',
      'إنشاء شيفتات عمل بطاقة استيعابية وأوقات محددة عبر ShiftService.',
      'حجز وبدء وإنهاء الشيفت وإرسال طلبات استراحة (Break Requests).',
      'إدارة أسباب رفض المهام المعتمدة للمناديب عبر DeliveryDeclineReasonService.'
    ],
    models: ['Zone', 'Shift', 'DeliveryBreak', 'DeliveryDeclineReason'],
    controllers: ['Admin\\ZoneController', 'Admin\\ShiftController', 'Api\\Delivery\\ShiftController', 'Api\\Delivery\\BreakController'],
    services: ['ZoneService', 'ShiftService', 'DeliveryBreakService', 'DeliveryDeclineReasonService', 'DeliveryAvailabilityService']
  },
  {
    id: 15,
    title: 'تعيينات التوصيل والتتبع اللحظي (Multi-Pickup Dispatching)',
    category: 'orders',
    icon: 'fa-truck-fast',
    goal: 'تنفيذ توصيل طلبات الماركتبليس ومتابعة مسار المندوب بالـ GPS اللحظي.',
    features: [
      'خوارزمية تعيين الطلب لأقرب مندوب نشط في الزون عبر DeliveryAssignmentService.',
      'دعم الاستلام المتعدد (Multi-Vendor Pickup) بالترتيب الجغرافي الأمثل.',
      'تتبع مباشر لموقع المندوب وبث الإحداثيات لحظياً عبر قنوات Reverb.',
      'تقييم العميل لأداء مندوب التوصيل بعد الإتمام عبر DeliveryAssignmentRating.'
    ],
    models: ['DeliveryAssignment', 'DeliveryAssignmentPickup', 'DeliveryAssignmentLocation', 'DeliveryAssignmentRating'],
    controllers: ['Api\\DeliveryController', 'Admin\\DeliveryAssignmentController'],
    services: ['DeliveryAssignmentService', 'DeliveryOrderRealtimeService', 'DeliveryOrderZoneService']
  },
  {
    id: 16,
    title: 'محفظة المندوب والتحويلات (Delivery Wallet & Payouts)',
    category: 'finance',
    icon: 'fa-coins',
    goal: 'إدارة أرباح ورصيد المندوب ومستحقات الشحن والتوصيل وسحب الرصيد.',
    features: [
      'سجل ليدجر دقيق لكل معاملة توصيل (DeliveryWalletTransaction).',
      'طلبات سحب الرصيد ومراجعتها من قبل الإدارة المالية للأدمن.',
      'إمكانية التعديل والإيداع المباشر من الأدمن للمكافآت أو التسويات عبر DeliveryWalletRequestService.'
    ],
    models: ['DeliveryWalletTransaction', 'DeliveryWalletRequest'],
    controllers: ['Api\\Delivery\\WalletRequestController', 'Admin\\DeliveryWalletRequestController'],
    services: ['DeliveryWalletRequestService']
  },
  {
    id: 17,
    title: 'شحنات الباكدج وتفاوض المناديب (P2P Package Shipment & Negotiation)',
    category: 'orders',
    icon: 'fa-box',
    goal: 'خدمة توصيل طرود من مستخدم إلى مستخدم مع نظام تفاوض وعروض أسعار.',
    features: [
      'إنشاء شحنة مع تحديد نقاط الاستلام والتسليم وأبعاد الطرد (PackageSize).',
      'تسعير ديناميكي حسب المسافة مع استقبال عروض تفاوضية من المناديب (Offers).',
      'قبول العرض، الدفع، وتثبيت التعيين عبر كود التحقق وإثبات التسليم.',
      'بث لحظي لتحديثات الشحنة والمفاوضات عبر قنوات Reverb المخصصة.'
    ],
    models: ['PackageSize', 'PackageShipment', 'PackageShipmentOffer', 'PackageShipmentAssignment', 'PackageShipmentDropoff', 'PackageShipmentLog'],
    controllers: ['Api\\PackageShipmentController', 'Api\\DeliveryPackageShipmentController', 'Admin\\PackageShipmentController'],
    services: ['PackageShipmentService', 'PackageShipmentNegotiationService', 'PackageShipmentAssignmentService', 'PackageSizeService', 'DeliveryPackageShipmentRealtimeService']
  },
  {
    id: 18,
    title: 'تذاكر الدعم الفني (Customer & Vendor Support Tickets)',
    category: 'ops',
    icon: 'fa-headset',
    goal: 'قناة رسمية لحل المشكلات والاستفسارات بين العملاء والتجار والأدمن.',
    features: [
      'فتح تذاكر دعم بمواضيع وأولويات ومرفقات مختلفة عبر TicketService.',
      'مراسلات داخلية وتعيين التذاكر لموظفي الدعم المختصين.',
      'إغلاق التذاكر وتقييم جودة الدعم الفني وعرض بيانات التواصل (Support).'
    ],
    models: ['Ticket', 'TicketMessage', 'Support'],
    controllers: ['Api\\TicketController', 'Vendor\\TicketController', 'Admin\\TicketController', 'Api\\SupportController'],
    services: ['TicketService']
  },
  {
    id: 19,
    title: 'المحادثات اللحظية عبر Reverb (Realtime Chat & Echo)',
    category: 'ops',
    icon: 'fa-comments',
    goal: 'تواصل مباشر وسريع أثناء تنفيذ الطلب أو شحنة الطرد عبر WebSockets.',
    features: [
      'محادثة مباشرة بين العميل ومندوب التوصيل أثناء الرحلة عبر ConversationService.',
      'إمكانية تدخل الأدمن في المحادثة للمساعدة في حل النزاعات.',
      'بث فوري للرسائل عبر قناة conversation.{id} في Reverb مع أرشفة الرسائل.'
    ],
    models: ['Conversation', 'ConversationMessage'],
    controllers: ['Api\\ConversationController', 'Api\\Delivery\\ConversationController', 'Admin\\ConversationController'],
    services: ['ConversationService']
  },
  {
    id: 20,
    title: 'التقارير، التقييمات، والتصدير (Reporting, Ratings & FCM Broadcast)',
    category: 'ops',
    icon: 'fa-sliders',
    goal: 'مراقبة جودة الخدمة، التقارير التحليلية، التصدير لـ Excel/PDF، والإشعارات الجماعية.',
    features: [
      'تقييم المنتجات والتجار والمناديب والإبلاغ عن المخالفات (Reports).',
      'تقارير أداء وإيرادات مفصلة للأدمن والتجار عبر ReportingService.',
      'تصدير التقارير والفواتير لـ Excel و PDF عبر ExportService و Maatwebsite/Laravel-PDF.',
      'إرسال إشعارات جماعية Bulk FCM مقسمة حسب الشرائح عبر BulkNotificationService.'
    ],
    models: ['ProductRating', 'VendorRating', 'ProductReport', 'VendorReport', 'BulkNotification', 'Setting', 'PrivacyPolicy'],
    controllers: ['Admin\\ReportController', 'Vendor\\ReportController', 'Admin\\BulkNotificationController', 'Api\\RatingController', 'Api\\ReportController'],
    services: ['ReportingService', 'ExportService', 'BulkNotificationService', 'FirebaseService']
  }
];

// Order Simulator Stages
const SIMULATOR_STAGES = [
  {
    step: 1,
    title: '1. التصفح والإضافة للسلة',
    badge: 'العميل يختار المنتجات من تجار مختلفين',
    desc: 'يقوم العميل باختيار وجبة من مطعم "Burger King" وعلاج من "صيدلية العزبي" وإضافتهما لنفس سلة الشراء مع تطبيق كوبون الخصم.',
    models: ['CartItem', 'Product', 'ProductVariant', 'Coupon'],
    visualHtml: `
      <div style="display:flex; flex-direction:column; gap:10px;">
        <div style="background:rgba(99,102,241,0.15); padding:10px 14px; border-radius:8px; border-right:3px solid #6366f1;">
          <strong><i class="fa-solid fa-burger"></i> مطعم البرجر:</strong> ساندوتش دبل تشيز (x2)
        </div>
        <div style="background:rgba(6,182,212,0.15); padding:10px 14px; border-radius:8px; border-right:3px solid #06b6d4;">
          <strong><i class="fa-solid fa-pills"></i> صيدلية العزبي:</strong> فيتامين سي + مسكن
        </div>
        <div style="color:#10b981; font-size:0.85rem; font-weight:700;">
          <i class="fa-solid fa-ticket"></i> تم تطبيق كوبون: TECH20 (خصم 20%)
        </div>
      </div>
    `
  },
  {
    step: 2,
    title: '2. اختيار العنوان وحساب الزون والدفع',
    badge: 'تحديد موقع التوصيل وبوابة الدفع',
    desc: 'يحدد العميل عنوان التوصيل. يقوم النظام آلياً بمطابقة إحداثيات العنوان مع مضلعات الـ Zones لتحديد تكلفة التوصيل ثم تنفيذ الدفع عبر المحفظة أو Kashier.',
    models: ['Address', 'Zone', 'PaymentAttempt', 'WalletTransaction'],
    visualHtml: `
      <div style="display:flex; flex-direction:column; gap:10px;">
        <div style="background:rgba(16,185,129,0.15); padding:10px 14px; border-radius:8px;">
          <i class="fa-solid fa-location-crosshairs text-emerald"></i> <strong>الزون:</strong> القاهرة الجديدة - التجمع الخامس (Polygon Matched)
        </div>
        <div style="background:rgba(245,158,11,0.15); padding:10px 14px; border-radius:8px;">
          <i class="fa-solid fa-credit-card text-amber"></i> <strong>طريقة الدفع:</strong> Kashier Gateway + رصيد المحفظة (Idempotent Webhook)
        </div>
      </div>
    `
  },
  {
    step: 3,
    title: '3. المعالجة السحرية: تقسيم الطلب (Order Splitting)',
    badge: 'تحويل الطلب العام إلى طلبات تجار فرعية',
    desc: 'يقوم OrderService بإنشاء سجل Order رئيسي للعميل، ثم تقسيمه آلياً إلى عدة VendorOrders مستقلة بحيث يرى كل تاجر بنوده فقط.',
    models: ['Order', 'VendorOrder (ID: #VO-101 & #VO-102)', 'VendorOrderItem'],
    visualHtml: `
      <div style="text-align:center;">
        <div style="background:rgba(99,102,241,0.25); padding:8px 12px; border-radius:8px; display:inline-block; margin-bottom:10px;">
          <strong>Order #9401 (الطلب الرئيسي)</strong>
        </div>
        <div style="display:flex; justify-content:center; gap:12px;">
          <div style="background:rgba(6,182,212,0.15); padding:8px 12px; border-radius:8px; font-size:0.85rem;">
            VendorOrder A: Burger King
          </div>
          <div style="background:rgba(16,185,129,0.15); padding:8px 12px; border-radius:8px; font-size:0.85rem;">
            VendorOrder B: صيدلية العزبي
          </div>
        </div>
      </div>
    `
  },
  {
    step: 4,
    title: '4. قبول وتجهيز التجار للمنتجات',
    badge: 'Pending -> Processing -> Ready for Pickup',
    desc: 'يتلقى كل تاجر إشعاراً فورياً عبر WebSockets Reverb وFCM، ويبدأ في تحضير الطلب وتحديث حالته إلى "جاهز للاستلام" مع خصم المخزون من الفرع تلقائياً.',
    models: ['BranchProductStock', 'OrderLog', 'Realtime Channel: vendor.order'],
    visualHtml: `
      <div style="display:flex; flex-direction:column; gap:8px;">
        <div style="display:flex; justify-content:space-between; background:rgba(0,0,0,0.3); padding:8px 12px; border-radius:6px;">
          <span>Burger King (فرع التجمع)</span>
          <span style="color:#10b981; font-weight:bold;">جاهز للاستلام ✔</span>
        </div>
        <div style="display:flex; justify-content:space-between; background:rgba(0,0,0,0.3); padding:8px 12px; border-radius:6px;">
          <span>صيدلية العزبي</span>
          <span style="color:#06b6d4; font-weight:bold;">جاري التجهيز...</span>
        </div>
      </div>
    `
  },
  {
    step: 5,
    title: '5. تعيين المندوب والاستلام المتسلسل والتسليم',
    badge: 'Multi-Pickup Routing & Realtime GPS',
    desc: 'يقوم النظام بتعيين الطلب لمندوب نشط بالشيفت، يقوم المندوب بالمرور على التاجر الأول ثم التاجر الثاني بالترتيب، ثم التوجه لموقع العميل مع تتبع GPS مباشر.',
    models: ['DeliveryAssignment', 'DeliveryAssignmentPickup', 'DeliveryAssignmentLocation'],
    visualHtml: `
      <div style="background:rgba(99,102,241,0.15); padding:12px; border-radius:8px; font-size:0.9rem;">
        <div style="color:#06b6d4; margin-bottom:4px;"><i class="fa-solid fa-motorcycle"></i> المندوب: أحمد سمير (على بُعد 1.2 كم)</div>
        <div style="color:#94a3b8; font-size:0.8rem;">مسار التحرك: استلام من المتجر 1 &larr; استلام من المتجر 2 &larr; تسليم العميل</div>
      </div>
    `
  },
  {
    step: 6,
    title: '6. تسليم الطلب، تسوية الأرباح، والتقييم',
    badge: 'Delivered & Financial Settlement',
    desc: 'يتم تسجيل التسليم بنجاح، إضافة أرباح التاجر الصافية بعد خصم العمولة لمحفظته، إضافة أجرة التوصيل لمحفظة المندوب، وإتاحة التقييم أو الاسترجاع للعميل.',
    models: ['VendorBalanceTransaction', 'DeliveryWalletTransaction', 'ProductRating', 'OrderRefundRequest'],
    visualHtml: `
      <div style="display:flex; flex-direction:column; gap:8px;">
        <div style="color:#10b981; font-weight:700;"><i class="fa-solid fa-circle-check"></i> تم التسليم بنجاح (Order Completed)</div>
        <div style="font-size:0.85rem; color:#94a3b8;">تم تحويل صافي أرباح التجار لمحفظتهم، وإضافة عمولة التوصيل للمندوب.</div>
      </div>
    `
  }
];

// Presentation Slides Data
const PRESENTATION_SLIDES = [
  {
    tag: 'مقدمة المنصة',
    title: 'ما هو مشروع TechShop؟',
    desc: 'منصة تجارة إلكترونية ذكية وشاملة تجمع بين الماركتبليس متعدد التجار، نظام التوصيل المتطور بالشيفتات والزونز، وشحن الطرود المستقل بين المستخدمين P2P.',
    points: [
      '<strong>تغطية واسعة:</strong> مطاعم، صيدليات، كافيهات، وسوبرماركت.',
      '<strong>بنية متينة:</strong> مبني على Laravel 12 وSanctum وReverb.',
      '<strong>فصل تشغيلي:</strong> 4 أطراف معنية بصلاحيات وإمكانيات مخصصة.'
    ]
  },
  {
    tag: 'الهيكل والأطراف',
    title: 'الأطراف الرئيسية الأربعة',
    desc: 'يتكامل النظام بسلاسة لخدمة 4 أطراف رئيسية عبر واجهات ويب وتطبيقات موبايل مهيأة هندسياً بأعلى معايير الأداء.',
    points: [
      '<strong>الأدمن (Web):</strong> موافقات، إعدادات، زونز، شيفتات، فلوس، ودعم مركزي.',
      '<strong>التاجر (Web + API):</strong> كتالوج، فروع، ستوك، اشتراكات، وأرباح.',
      '<strong>العميل (Mobile):</strong> تصفح، سلة، دفع، تتبع، وشحن باكدج P2P.',
      '<strong>المندوب (Mobile):</strong> شيفتات، مهام توصيل متسلسلة، ومحفظة خاصة.'
    ]
  },
  {
    tag: 'الابتكار التشغيلي',
    title: 'قلب النظام: رحلة الطلب وتقسيم التجار',
    desc: 'عندما يطلب العميل من أكثر من تاجر في سلة واحدة، يتعامل النظام بذكاء هندسي يوزع المهام ويجمعها في تجربة توصيل واحدة.',
    points: [
      '<strong>Order Splitting:</strong> تقسيم الطلب إلى VendorOrders مستقلة آلياً.',
      '<strong>Multi-Pickup:</strong> مسار استلام متسلسل للمندوب يقلل الوقت والتكلفة.',
      '<strong>Idempotent Payments:</strong> حماية كاملة للمدفوعات عبر المحفظة وبوابة Kashier.'
    ]
  },
  {
    tag: 'ميزة تنافسية',
    title: 'نظام شحن الباكدج (User-to-User P2P)',
    desc: 'خدمة لوجستية فريدة تتيح لأي مستخدم إرسال أي شحنة أو طرد لمستخدم آخر مع نظام مفاوضة وتسعير فوري.',
    points: [
      '<strong>حرية التسعير:</strong> تسعير بالمسافة مع استقبال عروض المناديب (Offers).',
      '<strong>تأمين التسليم:</strong> إثبات استلام وتسليم وتتبع لحظي على الخريطة.',
      '<strong>تكامل مالي:</strong> تسوية مستحقات المندوب فور اكتمال عملية التسليم.'
    ]
  },
  {
    tag: 'المعمارية والهندسة',
    title: 'البنية التقنية (Architecture & Stack)',
    desc: 'تصميم هندسي متقدم يعتمد على فصل الاهتمامات (Separation of Concerns) وسهولة التوسع والصيانة.',
    points: [
      '<strong>Sanctum & Spatie:</strong> أمان عالي وصلاحيات دقيقة لكل دور.',
      '<strong>WebSockets (Reverb & Echo):</strong> تحديثات لحظية ومحادثات فورية.',
      '<strong>Scheduled Tasks:</strong> إدارة الاشتراكات والشيفتات آلياً عبر Console.'
    ]
  },
  {
    tag: 'الخلاصة',
    title: 'TechShop في جملة واحدة',
    desc: 'TechShop = ماركتبليس متعدد التجار + طلبات مقسّمة لكل تاجر + توصيل تشغيلي بالزونز والشيفتات + شحن باكدج من مستخدم لمستخدم + اشتراكات بائعين + محفظة ومدفوعات ودعم وتشغيل مركزي من الأدمن.',
    points: [
      '<strong>20 موديول</strong> متكامل لتغطية كافة العمليات التشغيلية والتجارية.',
      '<strong>مرونة كاملة</strong> لتوسيع نطاق الأعمال وإضافة فئات وتجار جدد.',
      '<strong>جاهزية تشغيلية</strong> للويب وتطبيقات الموبايل بأعلى كفاءة.'
    ]
  }
];

// ERD Node Details
const ERD_DETAILS = {
  Customer: {
    title: 'Customer Entity (العميل)',
    desc: 'المستخدم النهائي للتطبيق، يمتلك سجلات العناوين، السلة، المحفظة، الطلبات، وشحنات الطرود.',
    models: ['User', 'Address', 'CartItem', 'Order', 'PackageShipment', 'WalletTransaction']
  },
  Vendor: {
    title: 'Vendor Entity (التاجر)',
    desc: 'الشريك التجاري، يمتلك باقة اشتراك، فروع متعددة، كتالوج منتجات ومخزون، ورصيد أرباح قابل للسحب.',
    models: ['Vendor', 'Branch', 'Product', 'VendorSubscription', 'VendorBalanceTransaction', 'VendorWithdrawal']
  },
  VendorOrder: {
    title: 'VendorOrder (تقسيم الطلب)',
    desc: 'الربط الجوهري في المنصة؛ كل طلب رئيسي (Order) ينقسم إلى سجلات VendorOrder مخصصة لكل تاجر لمعالجة المنتجات بشكل مستقل.',
    models: ['Order', 'VendorOrder', 'VendorOrderItem', 'OrderLog']
  },
  DeliveryAssignment: {
    title: 'DeliveryAssignment (التوصيل المتسلسل)',
    desc: 'المهمة المسندة للمندوب لجمع الأصناف من فروع التجار (Pickups) وتسليمها للعميل مع تتبع GPS مباشر.',
    models: ['DeliveryAssignment', 'DeliveryAssignmentPickup', 'DeliveryAssignmentLocation']
  },
  Admin: {
    title: 'Admin Central (الإدارة المركزية)',
    desc: 'لوحة القيادة والمراقبة للمنصة، مسؤولة عن الموافقات، تسعير الباقات، ضبط الزونز والشيفتات، وسحب الأرباح.',
    models: ['User (admin)', 'Zone', 'Shift', 'Plan', 'Setting', 'BulkNotification']
  }
};

// ==========================================
// 2. AUDIO SYNTHESIZER (Web Audio API)
// ==========================================
let audioEnabled = true;
let audioCtx = null;

function playUiSound(type = 'click') {
  if (!audioEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'click') {
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } else if (type === 'step') {
      osc.frequency.setValueAtTime(580, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1100, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } else if (type === 'success') {
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.08);
      osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    }
  } catch (e) {
    // Graceful fallback
  }
}

// ==========================================
// 3. UI CONTROLLERS & RENDERERS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initRolesSection();
  initSimulator();
  initModulesGrid();
  initSearch();
  initPresentationMode();
  initDiagramInteractive();
  initFolderExplorer();
  initSoundToggle();
  initToastAndCopy();
});

// Reading Progress & Navbar Spy
function initNavbarScroll() {
  const progressBar = document.getElementById('scrollProgressBar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    // Scroll spy
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// Roles Section Tabs
function initRolesSection() {
  const tabs = document.querySelectorAll('.role-tab');
  const displayContainer = document.getElementById('roleCardDisplay');

  if (!displayContainer || tabs.length === 0) return;

  function renderRole(roleKey) {
    const role = ROLES_DATA[roleKey];
    if (!role || !displayContainer) return;

    displayContainer.innerHTML = `
      <div class="role-display-header">
        <div class="role-title-group">
          <div class="role-avatar"><i class="fa-solid ${role.icon}"></i></div>
          <div class="role-title-text">
            <h3>${role.title}</h3>
            <span>${role.subtitle}</span>
          </div>
        </div>
        <div class="role-interface-badge">
          <i class="fa-solid fa-display"></i> ${role.interface}
        </div>
      </div>

      <div class="role-features-grid">
        <div class="role-feature-box">
          <h4><i class="fa-solid fa-list-check"></i> المهام والمسؤوليات الأساسية</h4>
          <ul>
            ${role.responsibilities.map(r => `<li><i class="fa-solid fa-check"></i> <span>${r}</span></li>`).join('')}
          </ul>
        </div>
        <div class="role-feature-box">
          <h4><i class="fa-solid fa-database"></i> النماذج والجداول المرتبطة</h4>
          <div class="sim-tech-pills" style="margin-top: 10px;">
            ${role.techModels.map(m => `<span class="sim-pill">${m}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      playUiSound('click');
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderRole(tab.dataset.role);
    });
  });

  // Render initial role (admin)
  renderRole('admin');
}

// Order Simulator
function initSimulator() {
  const simBody = document.getElementById('simBodyContent');
  const statusBadge = document.getElementById('simStatusBadge');
  const prevBtn = document.getElementById('simPrevBtn');
  const nextBtn = document.getElementById('simNextBtn');
  const autoBtn = document.getElementById('simAutoPlayBtn');
  const navItems = document.querySelectorAll('.step-nav-item');

  if (!simBody || !statusBadge || !prevBtn || !nextBtn || !autoBtn) return;

  let currentStep = 1;
  let autoPlayTimer = null;

  function renderStage(stepNumber) {
    const stage = SIMULATOR_STAGES.find(s => s.step === stepNumber);
    if (!stage || !simBody) return;

    statusBadge.textContent = `المرحلة ${stage.step} من 6: ${stage.badge}`;
    
    simBody.innerHTML = `
      <div class="sim-stage-box">
        <div class="sim-stage-desc">
          <h3>${stage.title}</h3>
          <p>${stage.desc}</p>
          <div class="sim-tech-pills">
            ${stage.models.map(m => `<span class="sim-pill">${m}</span>`).join('')}
          </div>
        </div>
        <div class="sim-visual-box">
          ${stage.visualHtml}
        </div>
      </div>
    `;

    // Update stepper
    navItems.forEach(item => {
      const step = parseInt(item.dataset.step);
      item.classList.remove('active', 'completed');
      if (step === stepNumber) {
        item.classList.add('active');
      } else if (step < stepNumber) {
        item.classList.add('completed');
      }
    });

    prevBtn.disabled = stepNumber === 1;
    if (stepNumber === 6) {
      nextBtn.innerHTML = 'إعادة المحاكاة <i class="fa-solid fa-rotate-right"></i>';
    } else {
      nextBtn.innerHTML = 'التالي <i class="fa-solid fa-arrow-left"></i>';
    }
  }

  function goToStep(step) {
    playUiSound('step');
    currentStep = step;
    if (currentStep > 6) currentStep = 1;
    if (currentStep < 1) currentStep = 1;
    renderStage(currentStep);
  }

  prevBtn.addEventListener('click', () => goToStep(currentStep - 1));
  nextBtn.addEventListener('click', () => {
    if (currentStep === 6) {
      goToStep(1);
    } else {
      goToStep(currentStep + 1);
    }
  });

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      goToStep(parseInt(item.dataset.step));
    });
  });

  autoBtn.addEventListener('click', () => {
    playUiSound('click');
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
      autoBtn.classList.remove('playing');
      autoBtn.innerHTML = '<i class="fa-solid fa-play"></i> تشغيل تلقائي';
    } else {
      autoBtn.classList.add('playing');
      autoBtn.innerHTML = '<i class="fa-solid fa-pause"></i> إيقاف مؤقت';
      autoPlayTimer = setInterval(() => {
        if (currentStep >= 6) {
          goToStep(1);
        } else {
          goToStep(currentStep + 1);
        }
      }, 3500);
    }
  });

  renderStage(1);
}

// 20 Modules Grid and Filter
function initModulesGrid() {
  const grid = document.getElementById('modulesGrid');
  const searchInput = document.getElementById('moduleSearchInput');
  const filterTags = document.querySelectorAll('.filter-tag');

  let activeCategory = 'all';
  let searchTerm = '';

  function renderModules() {
    if (!grid) return;

    const filtered = MODULES_DATA.filter(mod => {
      const matchCat = activeCategory === 'all' || mod.category === activeCategory;
      const matchText = mod.title.includes(searchTerm) || 
                        mod.goal.includes(searchTerm) || 
                        mod.models.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchCat && matchText;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding:3rem; color:var(--text-muted);">
          <i class="fa-solid fa-box-open" style="font-size:3rem; margin-bottom:1rem;"></i>
          <p>لا توجد موديولات تطابق معايير البحث.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(mod => `
      <div class="module-card" data-module-id="${mod.id}">
        <div>
          <div class="module-card-top">
            <div class="module-num">${mod.id}</div>
            <div class="module-icon-wrap"><i class="fa-solid ${mod.icon}"></i></div>
          </div>
          <h3 class="module-title">${mod.title}</h3>
          <p class="module-desc">${mod.goal}</p>
          <div class="module-models-preview">
            ${mod.models.slice(0, 3).map(m => `<span class="model-tag">${m}</span>`).join('')}
            ${mod.models.length > 3 ? `<span class="model-tag">+${mod.models.length - 3}</span>` : ''}
          </div>
        </div>
        <div class="module-card-footer">
          <span>${mod.features.length} ميزات تشغيلية</span>
          <div class="module-view-btn">تفاصيل الموديول <i class="fa-solid fa-arrow-left"></i></div>
        </div>
      </div>
    `).join('');

    // Attach click for modal details
    document.querySelectorAll('.module-card').forEach(card => {
      card.addEventListener('click', () => {
        playUiSound('click');
        const id = parseInt(card.dataset.moduleId);
        openModuleModal(id);
      });
    });
  }

  filterTags.forEach(tag => {
    tag.addEventListener('click', () => {
      playUiSound('click');
      filterTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      activeCategory = tag.dataset.category;
      renderModules();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim();
      renderModules();
    });
  }

  renderModules();
}

// Module Detail Modal Popup
function openModuleModal(moduleId) {
  const mod = MODULES_DATA.find(m => m.id === moduleId);
  const modal = document.getElementById('moduleModal');
  const header = document.getElementById('moduleModalHeader');
  const body = document.getElementById('moduleModalBody');

  if (!mod || !modal) return;

  header.innerHTML = `
    <div style="display:flex; align-items:center; gap:1rem;">
      <div class="module-icon-wrap" style="width:52px; height:52px; font-size:1.5rem;">
        <i class="fa-solid ${mod.icon}"></i>
      </div>
      <div>
        <div style="font-size:0.85rem; color:var(--accent-secondary); font-weight:bold;">الموديول رقم #${mod.id}</div>
        <h2 style="font-size:1.6rem; font-weight:800;">${mod.title}</h2>
      </div>
    </div>
  `;

  body.innerHTML = `
    <div>
      <div class="modal-section-title"><i class="fa-solid fa-bullseye"></i> الهدف من الموديول</div>
      <p style="color:var(--text-secondary); font-size:1rem;">${mod.goal}</p>
    </div>

    <div>
      <div class="modal-section-title"><i class="fa-solid fa-list-check"></i> الميزات والوظائف المشمولة</div>
      <ul style="list-style:none; display:flex; flex-direction:column; gap:0.6rem;">
        ${mod.features.map(f => `
          <li style="color:var(--text-secondary); display:flex; align-items:flex-start; gap:0.6rem;">
            <i class="fa-solid fa-circle-check text-emerald" style="margin-top:4px;"></i>
            <span>${f}</span>
          </li>
        `).join('')}
      </ul>
    </div>

    <div>
      <div class="modal-section-title"><i class="fa-solid fa-database"></i> نماذج قاعدة البيانات (Models)</div>
      <div class="sim-tech-pills">
        ${mod.models.map(m => `<span class="sim-pill">${m}</span>`).join('')}
      </div>
    </div>

    <div>
      <div class="modal-section-title"><i class="fa-solid fa-code"></i> وحدات التحكم والخدمات (Controllers & Services)</div>
      <div style="display:flex; flex-direction:column; gap:0.5rem;">
        ${mod.controllers.map(c => `
          <div style="background:rgba(0,0,0,0.3); padding:0.4rem 0.8rem; border-radius:6px; font-family:var(--font-mono); font-size:0.85rem; color:var(--accent-secondary);">
            <i class="fa-solid fa-file-code"></i> Controller: ${c}
          </div>
        `).join('')}
        ${mod.services ? mod.services.map(s => `
          <div style="background:rgba(0,0,0,0.3); padding:0.4rem 0.8rem; border-radius:6px; font-family:var(--font-mono); font-size:0.85rem; color:var(--accent-emerald);">
            <i class="fa-solid fa-gear"></i> Service: ${s}
          </div>
        `).join('') : ''}
      </div>
    </div>
  `;

  modal.classList.add('active');

  const closeBtn = document.getElementById('closeModuleModal');
  closeBtn.onclick = () => modal.classList.remove('active');
  modal.onclick = (e) => {
    if (e.target === modal) modal.classList.remove('active');
  };
}

// Global Quick Search
function initSearch() {
  const triggerBtn = document.getElementById('searchTriggerBtn');
  const modal = document.getElementById('searchModal');
  const closeBtn = document.getElementById('closeSearchModal');
  const input = document.getElementById('globalSearchInput');
  const resultsBox = document.getElementById('searchResults');

  if (!triggerBtn || !modal || !input || !resultsBox) return;

  function openSearch() {
    playUiSound('click');
    modal.classList.add('active');
    setTimeout(() => input.focus(), 100);
  }

  function closeSearch() {
    modal.classList.remove('active');
  }

  triggerBtn.addEventListener('click', openSearch);
  if (closeBtn) closeBtn.addEventListener('click', closeSearch);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeSearch();
  });

  // Keyboard shortcut Ctrl+K or /
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement.tagName !== 'INPUT')) {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeSearch();
    }
  });

  input.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) {
      resultsBox.innerHTML = '<div class="search-hint">اكتب للبحث الفوري في الـ 20 موديول ونماذج قاعدة البيانات والمسارات التقنية...</div>';
      return;
    }

    const matches = MODULES_DATA.filter(m => 
      m.title.toLowerCase().includes(q) ||
      m.goal.toLowerCase().includes(q) ||
      m.models.some(model => model.toLowerCase().includes(q))
    );

    if (matches.length === 0) {
      resultsBox.innerHTML = '<div class="search-hint">لم يتم العثور على أي نتائج مطابقة.</div>';
      return;
    }

    resultsBox.innerHTML = matches.map(m => `
      <div class="search-item" data-id="${m.id}">
        <div class="search-item-info">
          <h4><i class="fa-solid ${m.icon}" style="margin-left:6px; color:var(--accent-secondary);"></i> ${m.title}</h4>
          <span>${m.goal}</span>
        </div>
        <span class="badge-tech">#${m.id}</span>
      </div>
    `).join('');

    document.querySelectorAll('.search-item').forEach(item => {
      item.addEventListener('click', () => {
        closeSearch();
        openModuleModal(parseInt(item.dataset.id));
      });
    });
  });
}

// Presentation Slide Mode
function initPresentationMode() {
  const triggerBtn = document.getElementById('presentationModeBtn');
  const presOverlay = document.getElementById('presentationMode');
  const prevBtn = document.getElementById('presPrev');
  const nextBtn = document.getElementById('presNext');
  const exitBtn = document.getElementById('presExit');
  const counter = document.getElementById('presCounter');
  const body = document.getElementById('presBody');

  if (!triggerBtn || !presOverlay) return;

  let currentSlide = 0;

  function renderSlide(index) {
    const slide = PRESENTATION_SLIDES[index];
    if (!slide || !body) return;

    counter.textContent = `Slide ${index + 1} of ${PRESENTATION_SLIDES.length}`;
    body.innerHTML = `
      <div class="slide-content-box">
        <span class="slide-tag">${slide.tag}</span>
        <h2 class="slide-title">${slide.title}</h2>
        <p class="slide-desc">${slide.desc}</p>
        <div class="slide-points">
          ${slide.points.map(p => `<div class="slide-point-item">${p}</div>`).join('')}
        </div>
      </div>
    `;

    prevBtn.disabled = index === 0;
    if (index === PRESENTATION_SLIDES.length - 1) {
      nextBtn.textContent = 'إنهاء العرض';
    } else {
      nextBtn.innerHTML = 'التالي <i class="fa-solid fa-chevron-left"></i>';
    }
  }

  function openPres() {
    playUiSound('success');
    currentSlide = 0;
    renderSlide(0);
    presOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closePres() {
    presOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  triggerBtn.addEventListener('click', openPres);
  exitBtn.addEventListener('click', closePres);

  prevBtn.addEventListener('click', () => {
    if (currentSlide > 0) {
      playUiSound('step');
      currentSlide--;
      renderSlide(currentSlide);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentSlide < PRESENTATION_SLIDES.length - 1) {
      playUiSound('step');
      currentSlide++;
      renderSlide(currentSlide);
    } else {
      closePres();
    }
  });

  // Keyboard navigation for presentation
  window.addEventListener('keydown', (e) => {
    if (!presOverlay.classList.contains('active')) return;
    if (e.key === 'ArrowLeft' || e.key === ' ') {
      if (currentSlide < PRESENTATION_SLIDES.length - 1) {
        playUiSound('step');
        currentSlide++;
        renderSlide(currentSlide);
      }
    } else if (e.key === 'ArrowRight') {
      if (currentSlide > 0) {
        playUiSound('step');
        currentSlide--;
        renderSlide(currentSlide);
      }
    } else if (e.key === 'Escape') {
      closePres();
    }
  });
}

// Diagram Interactive Node Popover
function initDiagramInteractive() {
  const panel = document.getElementById('diagramInfoPanel');
  const nodes = document.querySelectorAll('[data-node]');

  nodes.forEach(node => {
    node.addEventListener('click', () => {
      playUiSound('click');
      const key = node.dataset.node;
      const data = ERD_DETAILS[key];

      if (data && panel) {
        panel.innerHTML = `
          <div>
            <div style="font-weight:800; font-size:1.1rem; color:var(--accent-secondary); margin-bottom:4px;">
              <i class="fa-solid fa-circle-nodes"></i> ${data.title}
            </div>
            <p style="font-size:0.92rem; color:var(--text-secondary); margin-bottom:8px;">${data.desc}</p>
            <div class="sim-tech-pills">
              ${data.models.map(m => `<span class="sim-pill">${m}</span>`).join('')}
            </div>
          </div>
        `;
      } else if (panel) {
        panel.innerHTML = `
          <div style="font-size:0.95rem; color:var(--text-primary);">
            <strong><i class="fa-solid fa-diagram-nested text-cyan"></i> عنصر: ${key}</strong>
            <div style="color:var(--text-secondary); margin-top:4px;">عنصر نشط في خريطة العلاقات يربط بين جداول النظام عبر Foreign Keys وعلاقات Eloquent المتسلسلة.</div>
          </div>
        `;
      }
    });
  });
}

// Sound Toggle
function initSoundToggle() {
  const soundBtn = document.getElementById('soundToggleBtn');
  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    audioEnabled = !audioEnabled;
    soundBtn.innerHTML = audioEnabled 
      ? '<i class="fa-solid fa-volume-high"></i>' 
      : '<i class="fa-solid fa-volume-xmark" style="color:var(--accent-rose);"></i>';
    showToast(audioEnabled ? 'تم تفعيل المؤثرات الصوتية' : 'تم كتم المؤثرات الصوتية');
  });
}

// Toast Notification & Copy Summary
function initToastAndCopy() {
  const copyBtn = document.getElementById('copySummaryBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      playUiSound('success');
      const summaryText = "TechShop = ماركتبليس متعدد التجار + طلبات مقسّمة لكل تاجر + توصيل تشغيلي بالزونز والشيفتات + شحن باكدج من مستخدم لمستخدم + اشتراكات بائعين + محفظة ومدفوعات ودعم وتشغيل مركزي من الأدمن.";
      navigator.clipboard.writeText(summaryText).then(() => {
        showToast('تم نسخ ملخص النظام بنجاح!');
      });
    });
  }
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

// ==========================================
// 4. LARAVEL 8 ROOT FOLDERS DATA & CONTROLLER
// ==========================================

const FOLDERS_DATA = {
  app: {
    folder: '/app',
    name: 'مجلد التطبيق ومنطق الأعمال (Core Business Logic)',
    icon: 'fa-code',
    accentColor: 'var(--accent-laravel)',
    badge: '80% من وقتك اليومي',
    roleText: 'هذا هو المجلد الأكثر أهمية في المشروع؛ ستقضي فيه معظم ساعات عملك كمطور باك إند. أي كود يخص منطق التطبيق (حسابات، تقسيم طلبات، خصم رصيد، بوابات دفع، فحص صلاحيات، نماذج قاعدة البيانات) يكتب بداخل هذا المجلد.',
    tree: `app/
 ├── Http/
 │    ├── Controllers/        (استقبال الطلبات: Admin, Vendor, Api)
 │    ├── Requests/           (فحص صحة المدخلات Form Validation)
 │    ├── Resources/          (تنسيق الـ JSON للموبايل)
 │    └── Middleware/         (فلاتر الحماية والصلاحيات)
 ├── Models/                  (جداول قاعدة البيانات ككائنات - مثل User.php, Order.php)
 ├── Services/                (العمليات المعقدة - مثل OrderService.php, KashierPaymentService.php)
 ├── Console/Commands/        (أوامر الكرون والجدولة - مثل ExpireSubscriptions.php)
 ├── Events/ & Listeners/     (أحداث النظام والبث اللحظي عبر Reverb)
 └── Helpers/helpers.php      (دوال مساعدة عامة)`,
    codeSample: `namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class Order extends Model
{
    // الحقول المسموح ملؤها
    protected $fillable = ['user_id', 'address_id', 'total_amount', 'status'];

    // علاقة: الطلب ينتمي لعميل
    public function user() {
        return $this->belongsTo(User::class);
    }

    // علاقة: الطلب ينقسم لعدة طلبات تجار (Order Splitting)
    public function vendorOrders() {
        return $this->hasMany(VendorOrder::class);
    }
}`,
    codeFile: 'app/Models/Order.php',
    proTips: 'احرص دائماً على تطبيق نمط <strong>Thin Controller, Fat Service</strong>؛ لا تكتب كود العمليات الحسابية وتقسيم الطلبات داخل الكنترولر، بل انقلها دائماً إلى <code>app/Services/</code> لتسهيل الاختبار وإعادة الاستخدام.'
  },
  bootstrap: {
    folder: '/bootstrap',
    name: 'مفتاح تشغيل المحرك والتهيئة (App Bootstrapping)',
    icon: 'fa-power-off',
    accentColor: 'var(--accent-primary)',
    badge: 'تهيئة وإقلاع السيرفر',
    roleText: 'مسؤول عن تشغيل التطبيق وتهيئة الإعدادات الأساسية والميدلويرز في Laravel 12. نادراً ما تعدل عليه، إلا عند تسجيل Global Middlewares أو استثناء مسارات معينة من حماية CSRF أو ضبط الـ Exception Handling الموحد.',
    tree: `bootstrap/
 ├── app.php          (الملف الرئيسي لتهيئة المسارات والميدلويرز في Laravel 12)
 ├── providers.php    (قائمة الـ Service Providers المفعلة)
 └── cache/           (كاش لملفات الخدمات والمسارات لتسريع السيرفر)`,
    codeSample: `use Illuminate\\Foundation\\Application;
use Illuminate\\Foundation\\Configuration\\Middleware;
use Illuminate\\Foundation\\Configuration\\Exceptions;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->statefulApi(); // تأمين Sanctum API للموبايل
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // تخصيص استجابة الأخطاء الموحدة
    })->create();`,
    codeFile: 'bootstrap/app.php',
    proTips: 'في Laravel 12 تم دمج وإلغاء ملف <code>Kernel.php</code> القديم، وأصبح ملف <code>bootstrap/app.php</code> هو المكان الرسمي الوحيد لضبط التوجيه والميدلويرز العامة.'
  },
  config: {
    folder: '/config',
    name: 'لوحة الإعدادات والمفاتيح المركزية (Configuration)',
    icon: 'fa-gears',
    accentColor: 'var(--accent-secondary)',
    badge: 'الإعدادات والمفاتيح',
    roleText: 'يحتوي على إعدادات قواعد البيانات، مفاتيح بوابات الدفع Kashier، وإعدادات الـ WebSockets والـ Push Notifications. يقرأ القيم من ملف <code>.env</code> عبر دالة <code>env()</code> لضمان عدم تسريب البيانات الحساسة.',
    tree: `config/
 ├── app.php          (اسم التطبيق، التوقيت Timezone، اللغة الافتراضية)
 ├── auth.php         (حراس التوثيق Sanctum Guards وجداول المستخدمين)
 ├── database.php     (بيانات الاتصال بـ MySQL و Redis)
 ├── reverb.php       (إعدادات سيرفر الريال تايم والـ WebSockets)
 ├── sanctum.php      (مدة انتهاء الـ Tokens والصلاحيات)
 ├── permission.php   (إعدادات حزمة Spatie Permissions)
 └── services.php     (مفاتيح Google Maps، Firebase FCM، وبوابة Kashier)`,
    codeSample: `return [
    // مفاتيح بوابة دفع Kashier
    'kashier' => [
        'mode' => env('KASHIER_MODE', 'test'),
        'api_key' => env('KASHIER_API_KEY'),
        'secret_key' => env('KASHIER_SECRET_KEY'),
        'merchant_id' => env('KASHIER_MERCHANT_ID'),
    ],

    // إعدادات إشعارات Firebase للموبايل
    'fcm' => [
        'server_key' => env('FCM_SERVER_KEY'),
    ],
];`,
    codeFile: 'config/services.php',
    proTips: 'لا تكتب كلمات المرور والمفاتيح السرية مباشرة داخل ملفات config بل استخدم دائماً دالة <code>env(\'KEY_NAME\')</code> لتبقى بياناتك آمنة وقابلة للتغيير بين بيئة التطوير والإنتاج.'
  },
  database: {
    folder: '/database',
    name: 'هندسة وتأسيس قاعدة البيانات (Migrations & Seeders)',
    icon: 'fa-database',
    accentColor: 'var(--accent-emerald)',
    badge: 'تأسيس وبناء الجداول',
    roleText: 'المسؤول عن بناء الجداول (Migrations)، إضافة أعمدة وفهارس جديدة، وحقن بيانات الاختبار الأولية (Seeders). بدلاً من عمل الجداول يدوياً في phpMyAdmin، تكتب كود PHP ينشئ الجداول تلقائياً وبشكل موحد لجميع المطورين.',
    tree: `database/
 ├── migrations/      (ملفات إنشاء وتعديل الجداول بتسلسل زمني)
 │    ├── 2026_01_01_create_users_table.php
 │    ├── 2026_01_02_create_orders_table.php
 │    └── 2026_01_03_create_package_shipments_table.php
 ├── seeders/         (ملفات حقن بيانات أولية - مستخدم أدمن وباقات جاهزة)
 │    ├── DatabaseSeeder.php
 │    └── AdminPermissionsSeeder.php
 └── factories/       (توليد بيانات وهمية عشوائية Fake Data للاختبار)`,
    codeSample: `use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\Facades\\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('package_shipments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sender_id')->constrained('users')->cascadeOnDelete();
            $table->decimal('pickup_lat', 10, 7);
            $table->decimal('pickup_lng', 10, 7);
            $table->decimal('price', 10, 2)->default(0);
            $table->enum('status', ['pending', 'negotiating', 'accepted', 'delivered'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('package_shipments');
    }
};`,
    codeFile: 'database/migrations/...create_package_shipments_table.php',
    proTips: 'لا تعدل أبداً على ملف Migration قديم تم رفعه وتشغيله على سيرفر الإنتاج؛ بل أنشئ دائماً ملف Migration جديد عبر الأمر <code>php artisan make:migration add_column_to_table</code>.'
  },
  public: {
    folder: '/public',
    name: 'المجلد العام للويب ونقطة الدخول (Web Root & Assets)',
    icon: 'fa-globe',
    accentColor: 'var(--accent-amber)',
    badge: 'المجلد المتاح للإنترنت',
    roleText: 'المجلد الوحيد في السيرفر المفتوح للجمهور على الإنترنت. عندما يطلب المستخدم رابط الموقع، فإن سيرفر Nginx / Apache يوجهه مباشرة إلى <code>public/index.php</code>. أي ملف أو صورة عامة تريد أن يراها المتصفح بدون حماية تضعها هنا.',
    tree: `public/
 ├── index.php        (نقطة دخول كافة طلبات المشروع)
 ├── storage          (اختصار Symlink يشير لمجلد الصور والفواتير المرفوعة)
 ├── build/           (ملفات الـ CSS والـ JS المجمعة والجاهزة للإنتاج)
 ├── .htaccess        (إعدادات إعادة توجيه الروابط في خوادم Apache)
 └── favicon.ico      (أيقونة الموقع في المتصفح)`,
    codeSample: `define('LARAVEL_START', microtime(true));

// 1. تحميل محرك Composer Autoload
require __DIR__.'/../vendor/autoload.php';

// 2. إقلاع وتشغيل التطبيق من bootstrap/app.php
$app = require_once __DIR__.'/../bootstrap/app.php';

// 3. معالجة الطلب وإرجاع الـ Response للعميل
$response = $app->handleRequest(
    Illuminate\\Http\\Request::capture()
);

$response->send();`,
    codeFile: 'public/index.php',
    proTips: 'يجب دائماً ضبط إعدادات الـ Web Server (Nginx/Apache) ليشير الـ Document Root إلى مجلد <code>public/</code> وليس للجذر، لمنع الوصول لملف <code>.env</code> الحساس.'
  },
  resources: {
    folder: '/resources',
    name: 'أصول الواجهات والترجمات (Frontend & Views)',
    icon: 'fa-palette',
    accentColor: 'var(--accent-purple)',
    badge: 'القوالب والترجمات',
    roleText: 'يحتوي على كل ما يخص الواجهة الأمامية قبل أن يتم تجميعها مثل قوالب الـ Blade للفواتير والبريد، وملفات الترجمة العربية والإنجليزية، وملفات الـ CSS/JS قبل معالجتها بـ Vite.',
    tree: `resources/
 ├── views/           (قوالب الـ Blade HTML - فواتير PDF، لوحات تحكم)
 │    ├── emails/     (قوالب رسائل البريد)
 │    └── invoices/   (قالب فاتورة الطلب order-invoice.blade.php)
 ├── css/ & js/       (ملفات التنسيق والجافاسكربت قبل معالجتها بـ Vite)
 └── lang/            (ملفات الترجمة عربي / إنجليزي ar/messages.php, en/messages.php)`,
    codeSample: `<div class="invoice-box" dir="rtl">
    <h2>فاتورة طلب رقم #{{ $order->id }}</h2>
    <p>اسم العميل: {{ $order->user->name }}</p>
    <p>إجمالي المبلغ: {{ number_format($order->total_amount, 2) }} ج.م</p>
    <p>حالة الطلب: {{ __('order.status.' . $order->status) }}</p>
</div>`,
    codeFile: 'resources/views/invoices/order.blade.php',
    proTips: 'استخدم دائماً دالة <code>__(\'messages.key\')</code> للترجمة بدلاً من كتابة النصوص الثابتة داخل الكود لضمان دعم اللغتين العربية والإنجليزية بسهولة.'
  },
  routes: {
    folder: '/routes',
    name: 'إشارات المرور وخريطة مسارات التطبيق (Routing Endpoints)',
    icon: 'fa-route',
    accentColor: 'var(--accent-rose)',
    badge: 'توجيه طلبات الـ API والويب',
    roleText: 'المكان الذي تربط فيه كل رابط (Endpoint URL) بكنترولر أو دالة معينة، وتحدد نوع الحماية المطلوبة (مثل Bearer Tokens لتطبيق الموبايل أو Sessions للوحة الويب).',
    tree: `routes/
 ├── api.php          (كل مسارات API الموبايل - تبدأ بـ /api/ وتعمل بـ Sanctum Token)
 ├── web.php          (مسارات لوحة الويب للتاجر والأدمن - تعتمد على Session و CSRF)
 ├── channels.php     (قنوات البث اللحظي للـ WebSockets في Laravel Reverb)
 └── console.php      (جدولة مهام الكرون الدورية Scheduler)`,
    codeSample: `use App\\Http\\Controllers\\Api\\OrderController;
use App\\Http\\Controllers\\Api\\PackageShipmentController;
use Illuminate\\Support\\Facades\\Route;

// مسارات محمية بتوكن الدخول Sanctum
Route::middleware('auth:sanctum')->group(function () {
    // مسارات الطلبات
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);

    // مسارات شحن الطرود P2P
    Route::post('/package-shipments', [PackageShipmentController::class, 'store']);
    Route::post('/package-shipments/{id}/offers', [PackageShipmentController::class, 'submitOffer']);
});`,
    codeFile: 'routes/api.php',
    proTips: 'قم دائماً بتجميع المسارات المتشابهة داخل <code>Route::group</code> مع <code>Route::middleware(\'auth:sanctum\')</code> لتأمينها وتطبيق معايير الـ RESTful API الموحدة.'
  },
  storage: {
    folder: '/storage',
    name: 'مستودع الملفات المرفوعة وسجلات النظام (Uploads & Logs)',
    icon: 'fa-box-archive',
    accentColor: '#3b82f6',
    badge: 'الصور وسجلات الأخطاء',
    roleText: 'المستودع الداخلي لتخزين الصور والملفات وفواتير الـ PDF التي يرفعها المستخدمون، بالإضافة لملفات سجلات الأخطاء (Logs) التي ترجع إليها لمعرفة سبب أي مشكلة برمجية تحدث على السيرفر.',
    tree: `storage/
 ├── app/
 │    └── public/     (الصور المرفوعة: منتجات، رخص القيادة للمناديب)
 ├── framework/       (ملفات كاش الجلسات والفيوز لتسريع السيرفر)
 └── logs/
      └── laravel.log (أهم ملف للمطور: يسجل كل الأخطاء والـ Exceptions)`,
    codeSample: `// كود حفظ صورة مرفوعة من المستخدم وتخزينها في storage/app/public/products
$path = $request->file('image')->store('products', 'public');

// تسجيل رسالة أو خطأ في ملف laravel.log لتتبعه
Log::info('New Order Created Successfully', ['order_id' => $order->id]);
Log::error('Payment Gateway Failed', ['error' => $e->getMessage()]);`,
    codeFile: 'storage/logs/laravel.log & File Uploads',
    proTips: 'عند رفع التطبيق على السيرفر، نفذ فوراً أمر <code>php artisan storage:link</code> لربط مجلد الملفات، وتأكد من فحص ملف <code>storage/logs/laravel.log</code> عند حدوث أي خطأ 500.'
  }
};

// Folder Explorer Controller
function initFolderExplorer() {
  const container = document.getElementById('folderDetailsContainer');
  const tabs = document.querySelectorAll('.role-tab[data-folder]');

  if (!container || tabs.length === 0) return;

  function renderFolder(folderKey) {
    const data = FOLDERS_DATA[folderKey];
    if (!data) return;

    container.innerHTML = `
      <div class="arch-card" style="border-top: 4px solid \${data.accentColor}; animation: fadeIn 0.3s ease;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div class="role-avatar" style="background: rgba(255,255,255,0.05); color: \${data.accentColor}; font-size: 1.6rem;">
              <i class="fa-solid \${data.icon}"></i>
            </div>
            <div>
              <h2 style="font-size: 1.6rem; font-weight: 800; color: #fff; margin: 0;">\${data.name}</h2>
              <span style="color: var(--text-muted); font-size: 0.9rem;">المسار: <code>\${data.folder}</code></span>
            </div>
          </div>
          <span class="badge-tech" style="font-size: 0.9rem; padding: 0.4rem 0.9rem; background: rgba(255,255,255,0.08); color: \${data.accentColor};">
            \${data.badge}
          </span>
        </div>

        <!-- Role & Workflow Description -->
        <div style="margin-bottom: 1.5rem; background: rgba(0,0,0,0.25); padding: 1.25rem; border-radius: 12px; border-right: 4px solid \${data.accentColor};">
          <h4 style="color: #fff; font-size: 1.1rem; margin-bottom: 0.5rem;"><i class="fa-solid fa-briefcase"></i> دورك كمطور في هذا المجلد (شغلك اليومي)</h4>
          <p style="color: var(--text-secondary); line-height: 1.8; margin: 0; font-size: 1rem;">\${data.roleText}</p>
        </div>

        <!-- Two Columns: Internal Tree vs Code Sample -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;">
          
          <!-- Tree Structure -->
          <div style="background: rgba(10, 15, 29, 0.7); border: 1px solid var(--border-glass); border-radius: 12px; padding: 1.25rem;">
            <div style="color: var(--accent-secondary); font-weight: bold; margin-bottom: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
              <i class="fa-solid fa-folder-tree"></i> شكله إيه من جوة؟ (الهيكل الداخلي)
            </div>
            <pre style="margin: 0; font-family: var(--font-mono); font-size: 0.88rem; color: #cbd5e1; line-height: 1.6; overflow-x: auto; background: transparent; padding: 0;">\${data.tree}</pre>
          </div>

          <!-- Code Snippet -->
          <div style="background: rgba(10, 15, 29, 0.7); border: 1px solid var(--border-glass); border-radius: 12px; padding: 1.25rem; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
              <div style="color: var(--accent-emerald); font-weight: bold; font-family: var(--font-mono); font-size: 0.88rem;">
                <i class="fa-solid fa-file-code"></i> \${data.codeFile}
              </div>
              <span class="badge-tech" style="font-size: 0.75rem;">PHP / Blade</span>
            </div>
            <pre style="margin: 0; font-family: var(--font-mono); font-size: 0.85rem; color: #a5f3fc; line-height: 1.55; overflow-x: auto; flex-grow: 1; background: transparent; padding: 0;">\${data.codeSample}</pre>
          </div>
        </div>

        <!-- Pro Tips Box -->
        <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 10px; padding: 1rem 1.25rem; display: flex; align-items: flex-start; gap: 0.8rem;">
          <i class="fa-solid fa-lightbulb" style="color: var(--accent-amber); font-size: 1.2rem; margin-top: 2px;"></i>
          <div style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.7;">
            <strong style="color: var(--accent-amber);">نصيحة عملية للمطور:</strong> \${data.proTips}
          </div>
        </div>
      </div>
    `;
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      playUiSound('click');
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderFolder(tab.dataset.folder);
    });
  });

  // Render initial folder (app)
  renderFolder('app');
}
