import React, { useState, useEffect, useRef } from 'react';
// Main App component
const App = () => {
  // State to store chat messages
  const [messages, setMessages] = useState([]);
  // State to store the current input message
  const [inputMessage, setInputMessage] = useState('');
  // Ref for scrolling to the bottom of the chat
  const messagesEndRef = useRef(null);
  // State for loading indicator
  const [isLoading, setIsLoading] = useState(false);

  // Gemini API configuration (NOTE: Replace with a secure method in production)
  const apiKey = "AIzaSyCwhlmzybYT27DEfw0H76TlJhdMNTwHQDI"; // User provided API Key
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  // Expanded Dummy data for the e-commerce store with brands, colors, sizes
  // NOTE: You need to add 'greetings' and 'faqs' to your dummyData object
const dummyData = {
  products: [
    // Beauty
    { id: 'a1', name: 'أحمر شفاه ماك مات', brand: 'MAC', category: 'تجميل', price: 120, description: 'أحمر شفاه بتركيبة غير لامعة وثبات طويل من ماركة MAC، مثالي لإطلالة جريئة تدوم طويلاً.', imageUrl: 'https://placehold.co/150x150/db7093/ffffff?text=MAC+Lipstick' },
    { id: 'a2', name: 'كريم أساس فاونديشن لوريال إنفاليبل', brand: 'L\'Oreal', category: 'تجميل', price: 95, description: 'كريم أساس بتغطية متوسطة إلى كاملة يدوم حتى 24 ساعة، يمنح بشرتك مظهراً طبيعياً وخالياً من العيوب.', imageUrl: 'https://placehold.co/150x150/f4c2c2/000000?text=L\'Oreal+Foundation' },
    { id: 'a3', name: 'ماسكارا إيسنس فوليوم هيرو', brand: 'Essence', category: 'تجميل', price: 45, description: 'ماسكارا تمنح رموشك حجماً وكثافة فائقة بلون أسود فاحم، مثالية للاستخدام اليومي.', imageUrl: 'https://placehold.co/150x150/8a2be2/ffffff?text=Essence+Mascara' },
    // Toys
    { id: 'b1', name: 'لعبة تركيب مكعبات ليغو مدينة', brand: 'LEGO', category: 'ألعاب', price: 150, description: 'مجموعة مكعبات ليغو كبيرة لتنمية مهارات الطفل الإبداعية والتركيز، مناسبة للأعمار من 6 سنوات فما فوق.', imageUrl: 'https://placehold.co/150x150/ffcc00/000000?text=ليغو+مدينة' },
    { id: 'b2', name: 'دمية باربي الأميرة', brand: 'Barbie', category: 'ألعاب', price: 130, description: 'دمية باربي بإطلالة أميرة أنيقة وفستان لامع، مناسبة للأطفال +3 سنوات وتأتي مع إكسسوارات.', imageUrl: 'https://placehold.co/150x150/ff69b4/ffffff?text=باربي' },
    { id: 'b3', name: 'سيارة سباق بجهاز تحكم عن بعد', brand: 'Hot Wheels', category: 'ألعاب', price: 220, description: 'سيارة سباق سريعة تعمل بجهاز تحكم عن بعد، مثالية للمغامرات الخارجية والداخلية.', imageUrl: 'https://placehold.co/150x150/00ced1/ffffff?text=سيارة+تحكم' },
    // Office Electronics
    { id: 'c1', name: 'كمبيوتر مكتبي HP Pavilion', brand: 'HP', category: 'أجهزة مكتبية', price: 3200, description: 'جهاز مكتبي قوي للأعمال المكتبية والمنزلية مع معالج i5 الجيل العاشر و8 جيجا رام، أداء موثوق.', imageUrl: 'https://placehold.co/150x150/343a40/ffffff?text=HP+Desktop' },
    { id: 'c2', name: 'شاشة ديل 24 بوصة UltraSharp', brand: 'Dell', category: 'أجهزة مكتبية', price: 600, description: 'شاشة عالية الدقة (Full HD) ومريحة للعين بحجم 24 بوصة، مثالية للعمل ومشاهدة المحتوى.', imageUrl: 'https://placehold.co/150x150/007bff/ffffff?text=Dell+Screen' },
    { id: 'c3', name: 'طابعة ليزر كانون بيكسما', brand: 'Canon', category: 'أجهزة مكتبية', price: 850, description: 'طابعة ليزر سريعة ومتعددة الوظائف (طباعة، مسح، نسخ) مناسبة للمكاتب الصغيرة.', imageUrl: 'https://placehold.co/150x150/ff8c00/ffffff?text=طابعة+كانون' },
    // Phones
    { id: 'd1', name: 'هاتف سامسونج جالاكسي A52', brand: 'Samsung', category: 'هواتف', price: 2500, description: 'هاتف ذكي بذاكرة 128 جيجابايت وكاميرا 48 ميجابكسل، شاشة AMOLED، بطارية 4500 مللي أمبير، مقاوم للماء والغبار.', imageUrl: 'https://placehold.co/150x150/007bff/ffffff?text=سامسونج+A52' },
    { id: 'd2', name: 'هاتف آيفون 13 برو', brand: 'Apple', category: 'هواتف', price: 4000, description: 'أحدث هواتف آيفون بذاكرة 256 جيجابايت، شريحة A15 Bionic فائقة السرعة، نظام كاميرا ثلاثي احترافي.', imageUrl: 'https://placehold.co/150x150/6c757d/ffffff?text=آيفون+13+برو' },
    { id: 'd3', name: 'هاتف شاومي ريدمي نوت 10 برو', brand: 'Xiaomi', category: 'هواتف', price: 1500, description: 'هاتف اقتصادي بأداء ممتاز، كاميرا 108 ميجابكسل، شحن سريع 33W، شاشة 120Hz.', imageUrl: 'https://placehold.co/150x150/17a2b8/ffffff?text=شاومي+نوت10+برو' },
    // Headphones
    { id: 'e1', name: 'سماعات سوني WH-1000XM4', brand: 'Sony', category: 'سماعات', price: 1200, description: 'سماعات لاسلكية بخاصية إلغاء الضوضاء الرائدة في العالم، جودة صوت استثنائية وعمر بطارية طويل يصل إلى 30 ساعة.', imageUrl: 'https://placehold.co/150x150/28a745/ffffff?text=سماعات+سوني' },
    { id: 'e2', name: 'سماعات أبل إيربودز برو 2', brand: 'Apple', category: 'سماعات', price: 900, description: 'سماعات أذن لاسلكية مع خاصية إلغاء الضوضاء النشط المحسنة ووضع الشفافية التكيفي، صوت غامر.', imageUrl: 'https://placehold.co/150x150/fd7e14/ffffff?text=إيربودز+برو+2' },
    // Smartwatches
    { id: 'f1', name: 'ساعة سامسونج جالاكسي ووتش 4 كلاسيك', brand: 'Samsung', category: 'ساعات ذكية', price: 800, description: 'ساعة ذكية بتصميم كلاسيكي، لتتبع اللياقة البدنية والإشعارات، مقاومة للماء، قياس تكوين الجسم بدقة.', imageUrl: 'https://placehold.co/150x150/ffc107/000000?text=جالاكسي+ووتش+كلاسيك' },
    { id: 'f2', name: 'ساعة أبل ووتش SE الجيل الثاني', brand: 'Apple', category: 'ساعات ذكية', price: 1000, description: 'ساعة ذكية بتصميم أنيق وميزات أساسية لتتبع النشاط والصحة، قيمة ممتازة مقابل السعر.', imageUrl: 'https://placehold.co/150x150/6f42c1/ffffff?text=أبل+ووتش+SE' },
    // Laptops
    { id: 'g1', name: 'لابتوب ديل XPS 15', brand: 'Dell', category: 'لابتوبات', price: 5000, description: 'لابتوب قوي للألعاب والعمل الاحترافي، بمعالج Intel Core i7 وذاكرة وصول عشوائي 16 جيجابايت، شاشة 4K مذهلة.', imageUrl: 'https://placehold.co/150x150/dc3545/ffffff?text=لابتوب+ديل' },
    { id: 'g2', name: 'لابتوب لينوفو يوجا 7', brand: 'Lenovo', category: 'لابتوبات', price: 3500, description: 'لابتوب 2 في 1 متعدد الاستخدامات، شاشة لمس قابلة للتحويل، معالج Ryzen 7، مثالي للإبداع والإنتاجية.', imageUrl: 'https://placehold.co/150x150/20c997/ffffff?text=لينوفو+يوجا' },
    // Clothing
    { id: 'h1', name: 'تي شيرت قطني رجالي أساسي', brand: 'H&M', category: 'ملابس', price: 99, description: 'تي شيرت مريح من القطن 100%، متوفر بألوان متعددة ومقاسات مختلفة.', colors: ['أبيض', 'أسود', 'رمادي'], sizes: ['S', 'M', 'L', 'XL'], imageUrl: 'https://placehold.co/150x150/007bff/ffffff?text=تي+شيرت' },
    { id: 'h2', name: 'فستان نسائي صيفي مشجر', brand: 'Zara', category: 'ملابس', price: 250, description: 'فستان صيفي خفيف وأنيق، بتصميم مشجر جذاب، مثالي للخروجات اليومية والمناسبات الخفيفة.', colors: ['أحمر', 'أزرق', 'أخضر'], sizes: ['XS', 'S', 'M', 'L'], imageUrl: 'https://placehold.co/150x150/ff69b4/ffffff?text=فستان' },
    { id: 'h3', name: 'بنطلون جينز رجالي كلاسيك', brand: 'Levi\'s', category: 'ملابس', price: 180, description: 'بنطلون جينز كلاسيكي بقصة مريحة، متين وعصري، مناسب لجميع الأوقات.', colors: ['أزرق فاتح', 'أزرق داكن', 'أسود'], sizes: ['28', '30', '32', '34', '36'], imageUrl: 'https://placehold.co/150x150/6a0dad/ffffff?text=جينز' },
    { id: 'h4', name: 'عباية سوداء كلاسيكية مطرزة', brand: 'Al Haramain', category: 'ملابس', price: 300, description: 'عباية أنيقة بتصميم خليجي، خفيفة ومطرزة يدوياً، مناسبة للمناسبات الخاصة والارتداء اليومي الفاخر.', colors: ['أسود'], sizes: ['52', '54', '56', '58', '60'], imageUrl: 'https://placehold.co/150x150/000000/ffffff?text=عباية' },
    { id: 'h5', name: 'بدلة رسمية رجالي كحلي', brand: 'Hugo Boss', category: 'ملابس', price: 550, description: 'بدلة أنيقة للعمل أو المناسبات الرسمية، تشمل الجاكيت والبنطال، بلون كحلي جذاب.', colors: ['كحلي', 'أسود', 'رمادي'], sizes: ['48', '50', '52', '54'], imageUrl: 'https://placehold.co/150x150/2c3e50/ffffff?text=بدلة' },
    { id: 'h6', name: 'قميص رجالي أكسفورد أبيض', brand: 'Ralph Lauren', category: 'ملابس', price: 220, description: 'قميص أكسفورد كلاسيكي مصنوع من القطن الفاخر، مثالي للإطلالات الرسمية وشبه الرسمية.', colors: ['أبيض', 'أزرق فاتح'], sizes: ['S', 'M', 'L', 'XL'], imageUrl: 'https://placehold.co/150x150/e0e0e0/000000?text=قميص+أبيض' },
    { id: 'h7', name: 'جاكيت جينز نسائي', brand: 'Zara', category: 'ملابس', price: 280, description: 'جاكيت جينز عصري بقصة واسعة، مثالي لإكمال إطلالتك اليومية.', colors: ['أزرق', 'أسود'], sizes: ['S', 'M', 'L'], imageUrl: 'https://placehold.co/150x150/6a0dad/ffffff?text=جاكيت+جينز' },
    { id: 'h8', name: 'حذاء رياضي رجالي', brand: 'Nike', category: 'ملابس', price: 450, description: 'حذاء رياضي خفيف ومريح بتصميم عصري، مثالي للجري والاستخدام اليومي.', colors: ['أسود', 'أبيض'], sizes: ['40', '41', '42', '43', '44'], imageUrl: 'https://placehold.co/150x150/000000/ffffff?text=حذاء+نايكي' },
    { id: 'h9', name: 'حقيبة يد نسائية جلدية', brand: 'Gucci', category: 'ملابس', price: 1500, description: 'حقيبة يد فاخرة من الجلد الطبيعي بتصميم أنيق ومساحة داخلية واسعة، مناسبة لجميع المناسبات.', colors: ['بني', 'أسود'], sizes: ['مقاس واحد'], imageUrl: 'https://placehold.co/150x150/8b4513/ffffff?text=حقيبة+يد' },
    { id: 'h10', name: 'تنورة ميدي نسائية بليسيه', brand: 'Mango', category: 'ملابس', price: 190, description: 'تنورة أنيقة بليسيه بتصميم عصري، مثالية للإطلالات الكاجوال والرسمية الخفيفة.', colors: ['بيج', 'أسود', 'أخضر داكن'], sizes: ['S', 'M', 'L'], imageUrl: 'https://placehold.co/150x150/d2b48c/000000?text=تنورة+بليسيه' },
    { id: 'h11', name: 'شورت رياضي رجالي', brand: 'Adidas', category: 'ملابس', price: 120, description: 'شورت رياضي مريح وخفيف الوزن، مثالي للتمارين الرياضية أو الارتداء اليومي في الصيف.', colors: ['أسود', 'أزرق', 'رمادي'], sizes: ['S', 'M', 'L', 'XL'], imageUrl: 'https://placehold.co/150x150/a0a0a0/ffffff?text=شورت+رياضي' },
    { id: 'h12', name: 'بلوزة حرير نسائية أنيقة', brand: 'Massimo Dutti', category: 'ملابس', price: 350, description: 'بلوزة حريرية ناعمة وفاخرة، بتصميم أنيق ومريح، مناسبة للمناسبات الرسمية.', colors: ['أوف وايت', 'كحلي'], sizes: ['XS', 'S', 'M', 'L'], imageUrl: 'https://placehold.co/150x150/fffafa/000000?text=بلوزة+حرير' },
    { id: 'h13', name: 'معطف شتوي رجالي صوف', brand: 'Tommy Hilfiger', category: 'ملابس', price: 800, description: 'معطف شتوي دافئ وعصري من الصوف عالي الجودة، يوفر الدفء والأناقة في الأيام الباردة.', colors: ['رمادي داكن', 'جملي'], sizes: ['M', 'L', 'XL', 'XXL'], imageUrl: 'https://placehold.co/150x150/505050/ffffff?text=معطف+رجالي' },
    { id: 'h14', name: 'بيجامة نسائية قطنية', brand: 'Oysho', category: 'ملابس', price: 160, description: 'بيجامة قطنية ناعمة ومريحة للنوم، بتصميمات لطيفة وألوان هادئة.', colors: ['وردي فاتح', 'أزرق سماوي'], sizes: ['S', 'M', 'L'], imageUrl: 'https://placehold.co/150x150/ffb6c1/000000?text=بيجامة' },
    { id: 'h15', name: 'حذاء كعب نسائي رسمي', brand: 'Aldo', category: 'ملابس', price: 320, description: 'حذاء كعب أنيق بتصميم عصري وخفيف، مثالي للسهرات والمناسبات الرسمية.', colors: ['أسود', 'بيج', 'أحمر'], sizes: ['36', '37', '38', '39', '40'], imageUrl: 'https://placehold.co/150x150/dc143c/ffffff?text=كعب' },
    { id: 'h16', name: 'تي شيرت بولو رجالي', brand: 'Lacoste', category: 'ملابس', price: 270, description: 'تي شيرت بولو أنيق بخامة قطنية عالية الجودة، يمنحك إطلالة رياضية أنيقة.', colors: ['أبيض', 'أزرق', 'رمادي'], sizes: ['S', 'M', 'L', 'XL'], imageUrl: 'https://placehold.co/150x150/1e90ff/ffffff?text=بولو' },
    { id: 'h17', name: 'فستان سهرة طويل', brand: 'Mango', category: 'ملابس', price: 680, description: 'فستان طويل راقٍ مصمم للسهرات والمناسبات الخاصة، بلمسة أنثوية مميزة.', colors: ['أسود', 'عنابي'], sizes: ['S', 'M', 'L'], imageUrl: 'https://placehold.co/150x150/800000/ffffff?text=فستان+سهرة' },
    { id: 'h18', name: 'جاكيت شتوي مبطن رجالي', brand: 'North Face', category: 'ملابس', price: 600, description: 'جاكيت شتوي مقاوم للبرد والمطر، مثالي للشتاء والسفر.', colors: ['أسود', 'زيتي', 'رمادي'], sizes: ['M', 'L', 'XL', 'XXL'], imageUrl: 'https://placehold.co/150x150/2f4f4f/ffffff?text=جاكيت' },
    { id: 'h19', name: 'عباية مغربية مزخرفة', brand: 'Niswa', category: 'ملابس', price: 350, description: 'عباية مغربية أنيقة بتفاصيل يدوية وزخارف فنية، مثالية للمناسبات الخاصة.', colors: ['أسود', 'ذهبي', 'عنابي'], sizes: ['54', '56', '58', '60'], imageUrl: 'https://placehold.co/150x150/daa520/ffffff?text=عباية+مغربية' },
    { id: 'h20', name: 'شورت رياضي نسائي', brand: 'Adidas', category: 'ملابس', price: 130, description: 'شورت رياضي خفيف مناسب للتمارين أو الإطلالات اليومية الصيفية.', colors: ['رمادي', 'أسود', 'زهري'], sizes: ['XS', 'S', 'M', 'L'], imageUrl: 'https://placehold.co/150x150/f08080/ffffff?text=شورت' },
    { id: 'h21', name: 'بنطلون جينز سكيني نسائي', brand: 'Zara', category: 'ملابس', price: 820, description: 'بنطلون جينز بقصة سكيني مريح، خصر متوسط ومرونة عالية للحركة اليومية.', colors: ['أزرق فاتح', 'أسود'], sizes: ['S', 'M', 'L', 'XL'], imageUrl: 'https://example.com/images/h21.jpg' },
    { id: 'h22', name: 'تيشيرت رجالي قطن برسمة', brand: 'Bershka', category: 'ملابس', price: 450, description: 'تيشيرت قطن 100% برسمة عصرية على الصدر، مناسب للارتداء اليومي.', colors: ['أبيض', 'أسود', 'رمادي'], sizes: ['M', 'L', 'XL'], imageUrl: 'https://example.com/images/h22.jpg' },
    { id: 'h23', name: 'فستان شيفون طويل', brand: 'H&M', category: 'ملابس', price: 1150, description: 'فستان أنيق من الشيفون بقصة واسعة وأكمام طويلة، مثالي للمناسبات.', colors: ['كحلي', 'روز', 'أخضر زمردي'], sizes: ['S', 'M', 'L'], imageUrl: 'https://example.com/images/h23.jpg' },
    { id: 'h24', name: 'هودي رجالي شتوي مبطن', brand: 'Pull&Bear', category: 'ملابس', price: 990, description: 'هودي دافئ مبطن بفرو داخلي لراحة مثالية في الشتاء، تصميم بغطاء رأس.', colors: ['رمادي', 'زيتي', 'أسود'], sizes: ['M', 'L', 'XL', 'XXL'], imageUrl: 'https://example.com/images/h24.jpg' },
    { id: 'h25', name: 'طقم أطفال شتوي بناتي', brand: 'LC Waikiki', category: 'ملابس', price: 720, description: 'طقم مكوّن من سويت شيرت وبنطلون قطني برسومات كرتونية.', colors: ['وردي', 'أبيض'], sizes: ['2Y', '4Y', '6Y'], imageUrl: 'https://example.com/images/h25.jpg' },
    { id: 'h26', name: 'قميص رسمي رجالي كلاسيك', brand: 'Massimo Dutti', category: 'ملابس', price: 1300, description: 'قميص كلاسيك بأكمام طويلة وخامة فاخرة مناسب للبدلات الرسمية.', colors: ['أبيض', 'أزرق فاتح', 'رمادي'], sizes: ['M', 'L', 'XL', 'XXL'], imageUrl: 'https://example.com/images/h26.jpg' },
    { id: 'h27', name: 'بلوزة نسائية دانتيل', brand: 'Stradivarius', category: 'ملابس', price: 880, description: 'بلوزة دانتيل أنثوية بأكمام شفافة، مثالية للخروج الليلي أو المناسبات.', colors: ['أسود', 'كريمي'], sizes: ['S', 'M', 'L'], imageUrl: 'https://example.com/images/h27.jpg' },
    { id: 'h28', name: 'بنطلون رياضي رجالي', brand: 'Nike', category: 'ملابس', price: 1150, description: 'بنطلون رياضي مريح بخامة مقاومة للعرق وشريط مطاطي على الخصر.', colors: ['رمادي', 'أسود'], sizes: ['M', 'L', 'XL'], imageUrl: 'https://example.com/images/h28.jpg' },
    { id: 'h29', name: 'كارديجان شتوي نسائي', brand: 'Reserved', category: 'ملابس', price: 1020, description: 'كارديجان طويل بأزرار وأكمام واسعة، خامة ناعمة ودافئة.', colors: ['بيج', 'رمادي', 'أحمر'], sizes: ['S', 'M', 'L', 'XL'], imageUrl: 'https://example.com/images/h29.jpg' },
    { id: 'h30', name: 'جاكيت أطفال مبطن', brand: 'Defacto', category: 'ملابس', price: 950, description: 'جاكيت مبطن مقاوم للماء، خفيف الوزن ودافئ، مزود بغطاء رأس.', colors: ['أزرق', 'أحمر'], sizes: ['2Y', '4Y', '6Y', '8Y'], imageUrl: 'https://example.com/images/h30.jpg' },
    { id: 'h31', name: 'تنورة قصيرة جينز نسائي', brand: 'Zara', category: 'ملابس', price: 730, description: 'تنورة جينز قصيرة بكسرات أمامية، تصميم شبابي وعصري.', colors: ['أزرق', 'أسود'], sizes: ['S', 'M', 'L'], imageUrl: 'https://example.com/images/h31.jpg' },
    { id: 'h32', name: 'تيشيرت أطفال برسمة ميكي', brand: 'LC Waikiki', category: 'ملابس', price: 350, description: 'تيشيرت قطني برسمة ميكي ماوس، مناسب للصيف ومريح للبشرة الحساسة.', colors: ['أبيض', 'أصفر', 'أحمر'], sizes: ['2Y', '4Y', '6Y'], imageUrl: 'https://example.com/images/h32.jpg' },
    { id: 'h33', name: 'جاكيت بليزر رسمي نسائي', brand: 'H&M', category: 'ملابس', price: 1400, description: 'جاكيت بليزر أنيق بلون سادة، تصميم مناسب للعمل والمقابلات.', colors: ['أسود', 'كحلي'], sizes: ['S', 'M', 'L'], imageUrl: 'https://example.com/images/h33.jpg' },
    { id: 'h34', name: 'بيجامة رجالي قطن صيفي', brand: 'Max', category: 'ملابس', price: 680, description: 'طقم بيجامة قطني خفيف للرجال، تيشيرت + شورت بألوان محايدة.', colors: ['أزرق', 'رمادي'], sizes: ['M', 'L', 'XL', 'XXL'], imageUrl: 'https://example.com/images/h34.jpg' },
    { id: 'h35', name: 'فستان قصير بأزرار أمامية', brand: 'Stradivarius', category: 'ملابس', price: 970, description: 'فستان صيفي قصير بأزرار أمامية، تصميم بسيط وجذاب.', colors: ['أصفر', 'أبيض', 'أخضر'], sizes: ['S', 'M', 'L'], imageUrl: 'https://example.com/images/h35.jpg' },
    { id: 'h36', name: 'سويت شيرت مطبوع رجالي', brand: 'Bershka', category: 'ملابس', price: 790, description: 'سويت شيرت ببرنت جرافيكي شبابي، مناسب للخريف والشتاء.', colors: ['أسود', 'زيتي'], sizes: ['M', 'L', 'XL'], imageUrl: 'https://example.com/images/h36.jpg' },
    { id: 'h37', name: 'بنطلون واسع نسائي', brand: 'Mango', category: 'ملابس', price: 890, description: 'بنطلون بقصة واسعة من خامة خفيفة، مثالي للمظهر الرسمي أو الكاجوال.', colors: ['بيج', 'أسود', 'رمادي'], sizes: ['S', 'M', 'L', 'XL'], imageUrl: 'https://example.com/images/h37.jpg' },
    { id: 'h38', name: 'قميص كاجوال بكم قصير رجالي', brand: 'Zara Man', category: 'ملابس', price: 670, description: 'قميص بأزرار وكم قصير برسمة مربعات، خامة خفيفة ومناسبة للصيف.', colors: ['أبيض × أزرق', 'أبيض × أحمر'], sizes: ['M', 'L', 'XL'], imageUrl: 'https://example.com/images/h38.jpg' },
    { id: 'h39', name: 'جاكيت دنيم نسائي', brand: 'Pull&Bear', category: 'ملابس', price: 1100, description: 'جاكيت جينز بتصميم كاجوال وأزرار أمامية، أساسي في كل خزانة.', colors: ['أزرق', 'أسود'], sizes: ['S', 'M', 'L'], imageUrl: 'https://example.com/images/h39.jpg' },
    { id: 'h40', name: 'طقم بيجامة أطفال قطني', brand: 'Carter\'s', category: 'ملابس', price: 590, description: 'بيجامة ناعمة للأطفال تحتوي على تيشيرت وبنطلون برسمة نجوم.', colors: ['وردي', 'لبني', 'رمادي'], sizes: ['2Y', '4Y', '6Y', '8Y'], imageUrl: 'https://example.com/images/h40.jpg' },
    { id: 'h41', name: 'جاكيت رجالي جلد كلاسيك', brand: 'Zara', category: 'ملابس', price: 1100, description: 'جاكيت رجالي من الجلد الطبيعي بتصميم كلاسيكي أنيق، مثالي لفصل الشتاء والمناسبات.', colors: ['أسود', 'بني'], sizes: ['M', 'L', 'XL'], imageUrl: 'https://example.com/images/h41.jpg' },
    { id: 'h42', name: 'فستان حريمي دانتيل سواريه', brand: 'H&M', category: 'ملابس', price: 1250, description: 'فستان سواريه من الدانتيل الفاخر بتصميم أنيق، مناسب للحفلات والسهرات.', colors: ['كحلي', 'أحمر', 'ذهبي'], sizes: ['S', 'M', 'L'], imageUrl: 'https://example.com/images/h42.jpg' },
    { id: 'h43', name: 'قميص رجالي كتان صيفي', brand: 'Pull&Bear', category: 'ملابس', price: 440, description: 'قميص خفيف من الكتان مثالي للأيام الحارة، بتصميم أنيق وسهل التنسيق.', colors: ['أبيض', 'أزرق فاتح'], sizes: ['M', 'L', 'XL'], imageUrl: 'https://example.com/images/h43.jpg' },
    { id: 'h44', name: 'بلوزة حريمي كم طويل شيفون', brand: 'Stradivarius', category: 'ملابس', price: 360, description: 'بلوزة أنيقة من الشيفون بكم طويل، مناسبة للعمل والخروج اليومي.', colors: ['أسود', 'روز', 'بيج'], sizes: ['S', 'M', 'L'], imageUrl: 'https://example.com/images/h44.jpg' },
    { id: 'h45', name: 'سويت شيرت رجالي كاجوال', brand: 'Nike', category: 'ملابس', price: 780, description: 'سويت شيرت رياضي عملي ومريح مصنوع من خامة قطنية ناعمة.', colors: ['رمادي', 'أزرق', 'زيتي'], sizes: ['M', 'L', 'XL'], imageUrl: 'https://example.com/images/h45.jpg' },
    { id: 'h46', name: 'تنورة (جيب) حريمي قصيرة جينز', brand: 'Bershka', category: 'ملابس', price: 340, description: 'تنورة جينز قصيرة بتصميم عصري، تناسب الإطلالات الشبابية.', colors: ['أزرق جينز', 'أسود'], sizes: ['S', 'M', 'L'], imageUrl: 'https://example.com/images/h46.jpg' },
    { id: 'h47', name: 'بيجامة رجالي قطن صيفي', brand: 'LC Waikiki', category: 'ملابس', price: 410, description: 'طقم بيجامة قطنية خفيفة تتكون من تيشرت وشورت، مثالي للنوم في الصيف.', colors: ['أبيض × كحلي', 'رمادي × أسود'], sizes: ['M', 'L', 'XL'], imageUrl: 'https://example.com/images/h47.jpg' },
    { id: 'h48', name: 'جاكيت جينز حريمي', brand: 'Stradivarius', category: 'ملابس', price: 650, description: 'جاكيت جينز أنيق بقصة قصيرة، يناسب جميع الإطلالات اليومية.', colors: ['جينز فاتح', 'جينز غامق'], sizes: ['S', 'M', 'L'], imageUrl: 'https://example.com/images/h48.jpg' },
    { id: 'h49', name: 'تيشرت رجالي بطبعة جرافيك', brand: 'Defacto', category: 'ملابس', price: 240, description: 'تيشرت قطن برسمة جرافيك مميزة، مناسب للستايل الشبابي العصري.', colors: ['أسود', 'أبيض', 'زيتي'], sizes: ['M', 'L', 'XL'], imageUrl: 'https://example.com/images/h49.jpg' },
    { id: 'h50', name: 'عباية حريمي كاجوال', brand: 'Al Rashed', category: 'ملابس', price: 720, description: 'عباية قماش كريب ناعم تصميم عصري وخفيف، مناسبة للزي اليومي.', colors: ['أسود', 'رمادي', 'نيلي'], sizes: ['Free Size'], imageUrl: 'https://example.com/images/h50.jpg' },
    { id: 'h51', name: 'كارديجان شتوي رجالي', brand: 'Zara Man', category: 'ملابس', price: 830, description: 'كارديجان من الصوف السميك بستايل مفتوح، مثالي لأجواء الشتاء الباردة.', colors: ['رمادي غامق', 'بيج', 'أسود'], sizes: ['M', 'L', 'XL'], imageUrl: 'https://example.com/images/h51.jpg' },
    { id: 'h52', name: 'قميص حريمي مشجر شيفون', brand: 'New Look', category: 'ملابس', price: 385, description: 'قميص شيفون مشجر بألوان هادئة، تصميم خفيف ومناسب للصيف.', colors: ['وردي × أبيض', 'كحلي × بيج'], sizes: ['S', 'M', 'L'], imageUrl: 'https://example.com/images/h52.jpg' },
    { id: 'h53', name: 'بنطلون رجالي رسمي', brand: 'Massimo Dutti', category: 'ملابس', price: 690, description: 'بنطلون رسمي بقصة مستقيمة، خامة ناعمة وقابلة للكي بسهولة.', colors: ['أسود', 'رمادي', 'كحلي'], sizes: ['M', 'L', 'XL'], imageUrl: 'https://example.com/images/h53.jpg' },
    { id: 'h54', name: 'بلوزة حريمي قطن سادة', brand: 'Mango', category: 'ملابس', price: 295, description: 'بلوزة قطنية سادة مناسبة للعمل والخروجات اليومية بتصميم بسيط وراقي.', colors: ['أبيض', 'أزرق سماوي', 'روز'], sizes: ['S', 'M', 'L'], imageUrl: 'https://example.com/images/h54.jpg' },
    { id: 'h55', name: 'تيشرت بولو رجالي', brand: 'Lacoste', category: 'ملابس', price: 870, description: 'تيشرت بولو كلاسيكي أنيق، يناسب الطابع الرياضي والرسمي.', colors: ['أبيض', 'أخضر', 'كحلي'], sizes: ['M', 'L', 'XL'], imageUrl: 'https://example.com/images/h55.jpg' },
    { id: 'h56', name: 'بيجامة حريمي ستان شتوي', brand: 'Oysho', category: 'ملابس', price: 580, description: 'طقم بيجامة من قماش ستان ناعم بتصميم أنيق ودافئ.', colors: ['خمري', 'أزرق داكن'], sizes: ['S', 'M', 'L'], imageUrl: 'https://example.com/images/h56.jpg' },
    { id: 'h57', name: 'هودي رجالي بغطاء رأس', brand: 'Adidas', category: 'ملابس', price: 760, description: 'هودي قطن مريح عملي للرياضة أو الخروج بتصميم حديث.', colors: ['أسود', 'رمادي', 'أزرق'], sizes: ['M', 'L', 'XL'], imageUrl: 'https://example.com/images/h57.jpg' },
    { id: 'h58', name: 'جيبة طويلة حريمي بليسيه', brand: 'H&M', category: 'ملابس', price: 410, description: 'تنورة طويلة بليسيه مناسبة للإطلالات الكاجوال والعملية.', colors: ['أسود', 'زيتي', 'بيج'], sizes: ['S', 'M', 'L'], imageUrl: 'https://example.com/images/h58.jpg' },
    { id: 'h59', name: 'قميص رجالي بخطوط طولية', brand: 'Springfield', category: 'ملابس', price: 430, description: 'قميص بألوان متداخلة بخطوط طولية يعطيك مظهرًا عصريًا أنيقًا.', colors: ['كحلي × أبيض', 'رمادي × أسود'], sizes: ['M', 'L', 'XL'], imageUrl: 'https://example.com/images/h59.jpg' },
    { id: 'h60', name: 'كارديجان طويل حريمي', brand: 'Zara Woman', category: 'ملابس', price: 740, description: 'كارديجان طويل دافئ بتصميم مريح وأنيق يناسب الشتاء.', colors: ['رمادي', 'بيج', 'أسود'], sizes: ['S', 'M', 'L'], imageUrl: 'https://example.com/images/h60.jpg' },
    // Home Appliances
    { id: 'g1_appliance', name: 'مكنسة كهربائية دايسون V11', brand: 'Dyson', category: 'أجهزة منزلية', price: 1800, description: 'مكنسة لاسلكية قوية بشفط عالي، مناسبة لجميع أنواع الأرضيات والسجاد، سهلة الاستخدام والتخزين.', imageUrl: 'https://placehold.co/150x150/ff4500/ffffff?text=مكنسة' },
    { id: 'g2_appliance', name: 'ميكروويف سامسونج 30 لتر', brand: 'Samsung', category: 'أجهزة منزلية', price: 600, description: 'ميكروويف متعدد الوظائف بتقنية الشواء وسعة كبيرة 30 لتر، مثالي لتسخين وطهي الوجبات بسرعة.', imageUrl: 'https://placehold.co/150x150/808080/ffffff?text=ميكروويف' },
    { id: 'g3_appliance', name: 'تلفاز سامسونج 55 بوصة 4K', brand: 'Samsung', category: 'إلكترونيات', price: 2500, description: 'تلفاز ذكي بدقة 4K UHD، يدعم HDR10+، مع نظام تشغيل Tizen، مثالي لمشاهدة الأفلام والبرامج.', imageUrl: 'https://placehold.co/150x150/000000/ffffff?text=تلفاز+سامسونج' },
    { id: 'g4_appliance', name: 'غسالة ملابس ال جي 8 كجم', brand: 'LG', category: 'أجهزة منزلية', price: 1900, description: 'غسالة ملابس أوتوماتيكية بسعة 8 كجم، تقنية الغسيل بالبخار للحصول على ملابس نظيفة ومعقمة.', imageUrl: 'https://placehold.co/150x150/4682b4/ffffff?text=غسالة+ملابس' },
  ],
    greetings: ['مرحباً', 'كيف يمكنني مساعدتك اليوم؟', 'أهلاً وسهلاً', 'مرحباً بك في متجرنا! كيف يمكنني خدمتك؟',  'مرحباً بك في متجرنا الإلكتروني',
  'أهلاً وسهلاً، كيف يمكنني خدمتك اليوم؟',
  'يسعدنا تواصلك معنا! كيف يمكنني المساعدة؟',
  'مرحباً، هل تبحث عن منتج معين؟',
  'أهلاً بك! أنا هنا لمساعدتك في أي استفسار.'],
    faqs: [
      { question: 'هل توفرون خدمة تغليف الهدايا؟', keywords: ['تغليف', 'تزيين', 'تغليف هدايا'], answer: 'نعم، نوفر خدمة تغليف الهدايا بتكلفة إضافية بسيطة. يمكنك اختيار ذلك عند إتمام الشراء.' },
      { question: 'هل يوجد فرع لكم؟', keywords: ['فرع', 'فروع', 'موقع المتجر'], answer: 'حالياً نعمل كمتجر إلكتروني فقط ولا نملك فروعًا فعلية، ولكن الشحن متاح لجميع مناطق المملكة.' },
      { question: 'هل يمكن الدفع بالتقسيط؟', keywords: ['الدفع بالتقسيط','تقسيط', 'أقساط', 'أدفع بالتقسيط'], answer: 'نقدم خدمة الدفع بالتقسيط عبر تمارا وتابي، مما يتيح لك تقسيم المبلغ على دفعات مريحة بدون فوائد. يمكنك معرفة المزيد عند صفحة الدفع '},
      { question: 'ما هي طرق الدفع المتاحة؟', keywords: ['دفع', 'طرق دفع', 'كيف ادفع'], answer: 'نقبل الدفع ببطاقات الائتمان (فيزا، ماستركارد)، مدى، والدفع عند الاستلام.' },
      { question: 'كم يستغرق الشحن؟', keywords: ['شحن', 'توصيل', 'مدة الشحن', 'متى يصل'], answer: 'يستغرق الشحن عادة من 3 إلى 7 أيام عمل داخل المملكة، وقد يختلف حسب المنطقة. سيصلك رقم تتبع بمجرد شحن طلبك.' },
      { question: 'هل يمكنني إرجاع المنتج؟', keywords: ['إرجاع', 'استرجاع', 'سياسة الإرجاع', 'ارجع منتج'], answer: 'نعم، يمكنك إرجاع المنتج خلال 14 يومًا من تاريخ الاستلام بشرط أن يكون بحالته الأصلية وفي عبوته الأصلية. يرجى مراجعة صفحة سياسة الإرجاع لمزيد من التفاصيل.' },
      { question: 'كيف أتتبع طلبي؟', keywords: ['تتبع', 'تتبع طلب', 'رقم تتبع', 'طلبي فين'], answer: 'يمكنك تتبع طلبك من خلال رقم التتبع الذي سيصلك عبر البريد الإلكتروني أو الرسائل النصية بعد الشحن. أدخل الرقم في صفحة تتبع الطلبات على موقعنا.' },
      { question: 'كيف أتواصل مع خدمة العملاء؟', keywords: ['خدمة عملاء', 'تواصل', 'دعم', 'شكوى'], answer: 'يمكنك التواصل مع خدمة العملاء عبر الهاتف على الرقم 920000000 أو عبر البريد الإلكتروني support@ecommerce.com. نحن متاحون من الأحد إلى الخميس من 9 صباحًا حتى 5 مساءً.' },
      { question: 'هل توجد ضمانات على المنتجات؟', keywords: ['ضمان', 'ضمانات', 'كفالة'], answer: 'نعم، جميع منتجاتنا الإلكترونية تأتي مع ضمان المصنع لمدة سنتين. يرجى الاحتفاظ بفاتورة الشراء.' },
      {
        keywords: ['عروض', 'خصومات', 'تخفيضات'],
        answer: 'العروض شيء أحبه كثيراً! يمكنك زيارة قسم "العروض الخاصة" على موقعنا لتجد كل الخصومات المتاحة حالياً.'
      },
      {
        keywords: ['متى تفتحون', 'مواعيد العمل'],
        answer: 'متجرنا الإلكتروني يعمل 24 ساعة، سبعة أيام في الأسبوع! أما فريق خدمة العملاء فيعمل من الأحد إلى الخميس، من الساعة 9 صباحًا حتى 5 مساءً.'
      },    
    ],};

  // Function to get bot response, now with smarter logic
  const getBotResponse = async (message) => {
    const lowerCaseMessage = message.toLowerCase();

    // 1. Initial Checks (Fast & Direct Responses)
    // Greetings
    if (dummyData.greetings && (lowerCaseMessage.includes('مرحبا') || lowerCaseMessage.includes('سلام') || lowerCaseMessage.includes('أهلاً') || lowerCaseMessage === 'hi' || lowerCaseMessage === 'hello')) {
      return { type: 'text', text: dummyData.greetings[Math.floor(Math.random() * dummyData.greetings.length)] };
    }

    // Help/Commands
    if (lowerCaseMessage.includes('مساعدة') || lowerCaseMessage.includes('خيارات') || lowerCaseMessage.includes('ماذا يمكنني أن أسأل') || lowerCaseMessage.includes('كيف أستخدمك')) {
      return {
        type: 'text',
        text: 'يسعدني جداً مساعدتك! أنا هنا لأخدمك. يمكنك سؤالي عن:\n- **المنتجات:** "أريد هاتف ذكي" أو "ما هو سعر فستان نسائي؟"\n- **الفئات:** "منتجات المكياج" أو "ألعاب الأطفال".\n- **الميزانية:** "منتجات تحت 500 ريال" أو "منتجات فوق 1000 ريال".\n- **اقتراح هدية:** "أريد اقتراح هدية" (سأسألك عن المزيد من التفاصيل).\n- **الأسئلة الشائعة:** "طرق الدفع"، "مدة الشحن"، "سياسة الإرجاع"، "كيف أتتبع طلبي؟".\n- **معلومات عامة:** "كيف أتواصل مع خدمة العملاء؟".\n\nما هو سؤالك الأول لي اليوم؟'
      };
    }

    // FAQs
    if (dummyData.faqs) {
      for (const faq of dummyData.faqs) {
        for (const keyword of faq.keywords) {
          if (lowerCaseMessage.includes(keyword)) {
            return { type: 'text', text: faq.answer };
          }
        }
      }
    }

    // 2. Enhanced Logic for Products and Categories
    // Price-based search (under/over)
    const priceMatchUnder = lowerCaseMessage.match(/(?:تحت|أقل من|بحدود|بحد أقصى)\s*(\d+)\s*(?:ريال)?/);
    const priceMatchOver = lowerCaseMessage.match(/(?:فوق|أكثر من|أغلى من|بحد أدنى)\s*(\d+)\s*(?:ريال)?/);

    let filteredByPrice = [];
    let priceCriteriaMet = false;

    if (priceMatchUnder) {
      const maxPrice = parseInt(priceMatchUnder[1], 10);
      filteredByPrice = dummyData.products.filter(product => product.price <= maxPrice);
      priceCriteriaMet = true;
      if (filteredByPrice.length > 0) {
        const productDetails = filteredByPrice.map(p => `${p.name} (${p.price} ريال)`).join('، ');
        return { type: 'text', text: `يا له من اختيار ذكي! إليك بعض المنتجات الرائعة التي تناسب ميزانيتك (تحت ${maxPrice} ريال):\n${productDetails}. هل ترغب في معرفة المزيد عن أي من هذه المنتجات؟` };
      } else {
        return { type: 'text', text: `عذرًا، بحثت كثيراً لكن لم أجد أي منتجات تحت ${maxPrice} ريال حاليًا. ربما يمكنك رفع الميزانية قليلاً أو البحث في فئة أخرى؟` };
      }
    } else if (priceMatchOver) {
      const minPrice = parseInt(priceMatchOver[1], 10);
      filteredByPrice = dummyData.products.filter(product => product.price >= minPrice);
      priceCriteriaMet = true;
      if (filteredByPrice.length > 0) {
        const productDetails = filteredByPrice.map(p => `${p.name} (${p.price} ريال)`).join('، ');
        return { type: 'text', text: `أهلاً بك في عالم المنتجات الفاخرة! إليك بعض المنتجات المميزة التي تزيد عن ${minPrice} ريال:\n${productDetails}. هل ترغب في معرفة المزيد عن أي من هذه المنتجات؟` };
      } else {
        return { type: 'text', text: `للأسف، لم أجد أي منتجات تزيد عن ${minPrice} ريال حاليًا. ربما يمكنك تجربة سعر أقل أو تصفح فئات أخرى؟` };
      }
    }


    // Enhanced Product Search (more robust keywords)
    let productFoundInDummyData = null;
    let isPriceInquiry = lowerCaseMessage.includes('سعر') || lowerCaseMessage.includes('كم سعر') || lowerCaseMessage.includes('بكم');

    // More comprehensive search terms, including single Arabic letters
    const searchTerms = lowerCaseMessage.split(/\s+/).filter(word => word.length > 1 || (word.length === 1 && /[ا-ي]/.test(word)));
    const ignoredWords = new Set(['سعر', 'كم', 'بكم', 'عرض', 'ابحث', 'عن', 'منتج', 'منتجات', 'في', 'لون', 'مقاس', 'براند', 'أبغى', 'للبيع', 'اريد', 'أريد']);

    for (const product of dummyData.products) {
      const productNameLower = product.name.toLowerCase();
      const productBrandLower = product.brand ? product.brand.toLowerCase() : '';
      const productColorsLower = product.colors ? product.colors.map(c => c.toLowerCase()) : [];
      const productSizesLower = product.sizes ? product.sizes.map(s => s.toLowerCase()) : [];
      const productCategoryLower = product.category.toLowerCase();
      const productDescriptionLower = product.description.toLowerCase();


      const matches = searchTerms.some(term => {
        if (ignoredWords.has(term)) return false; // Ignore common words
        const regex = new RegExp(term, 'i'); // Case-insensitive regex match
        return (
          regex.test(productNameLower) ||
          regex.test(productBrandLower) ||
          productColorsLower.some(color => regex.test(color)) ||
          productSizesLower.some(size => regex.test(size)) ||
          regex.test(product.id.toLowerCase()) ||
          regex.test(productCategoryLower) ||
          regex.test(productDescriptionLower)
        );
      });


      if (matches) {
        productFoundInDummyData = product;
        break;
      }
    }

    if (productFoundInDummyData) {
      let responseText = '';
      if (isPriceInquiry) {
        responseText = `يا سلام! سعر ${productFoundInDummyData.name} هو ${productFoundInDummyData.price} ريال.`;
      } else if (lowerCaseMessage.includes('مواصفات') || lowerCaseMessage.includes('وصف') || lowerCaseMessage.includes('تفاصيل')) {
        responseText = `بالتأكيد! مواصفات ${productFoundInDummyData.name} هي: ${productFoundInDummyData.description}.`;
      } else if (lowerCaseMessage.includes('لون') && productFoundInDummyData.colors && productFoundInDummyData.colors.length > 0) {
        responseText = `${productFoundInDummyData.name} متوفر بالألوان: ${productFoundInDummyData.colors.join('، ')}.`;
      } else if (lowerCaseMessage.includes('مقاس') && productFoundInDummyData.sizes && productFoundInDummyData.sizes.length > 0) {
        responseText = `${productFoundInDummyData.name} متوفر بالمقاسات: ${productFoundInDummyData.sizes.join('، ')}.`;
      } else if (lowerCaseMessage.includes('براند') && productFoundInDummyData.brand) {
        responseText = `البراند الرائع لهذا المنتج هو ${productFoundInDummyData.brand}.`;
      } else {
        // If no specific inquiry, return the product card
        return { type: 'product', data: productFoundInDummyData };
      }
      responseText += ` إنه منتج رائع يستحق الاقتناء! هل يمكنني مساعدتك في شيء آخر بخصوص هذا المنتج؟`;
      return { type: 'text', text: responseText };
    }

    // Category Inquiries (more robust matching)
    const categories = Array.from(new Set(dummyData.products.map(p => p.category)));
    for (const category of categories) {
      const categoryKeywords = [
        category.toLowerCase(),
        category.slice(0, -1).toLowerCase(), // Handle singular forms like "ملابس" -> "ملبس" (might not be perfect for all, but improves)
        `${category} رجالي`, `${category} نسائي`, `${category} أطفال` // Common modifiers
      ];

      if (categoryKeywords.some(kw => lowerCaseMessage.includes(kw))) {
        const productsInCategory = dummyData.products.filter(p => p.category === category);
        if (productsInCategory.length > 0) {
          const productNames = productsInCategory.map(p => p.name).join('، ');
          return { type: 'text', text: `بالتأكيد! لدينا في قسم **${category}** مجموعة رائعة تشمل: ${productNames}. هل تبحث عن منتج معين ضمن هذه الفئة؟` };
        } else {
          return { type: 'text', text: `عذرًا، لا توجد منتجات حاليًا في قسم **${category}**. هل يمكنني مساعدتك في فئة أخرى؟` };
        }
      }
    }


    // General product list
    if (lowerCaseMessage.includes('منتجات') || lowerCaseMessage.includes('ماذا تبيعون') || lowerCaseMessage.includes('قائمة المنتجات') || lowerCaseMessage.includes('كل المنتجات')) {
      const productList = dummyData.products.map(p => p.name).join('، ');
      return { type: 'text', text: `يا له من سؤال جميل! لدينا تشكيلة واسعة من المنتجات الرائعة! تشمل: ${productList}. يمكنك سؤالي عن أي منتج أو فئة معينة.` };
    }

    // "Suggest a gift" flow - Initial prompt
    if (lowerCaseMessage.includes('اقترحلي هدية') || (lowerCaseMessage.includes('هدية') && !priceCriteriaMet)) { // Ensure not confused with price inquiries
      return { type: 'text', text: 'فكرة رائعة! أنا متحمس لمساعدتك في اختيار الهدية المثالية. لكي أستطيع المساعدة بشكل أفضل، من فضلك أخبرني:\n1. لمن هذه الهدية؟ (مثال: لأمي، لأبي، لصديق، لطفل)\n2. ما هي المناسبة؟\n3. ما هي الميزانية التقريبية التي وضعتها في بالك؟\n4. ما هي اهتمامات الشخص؟ (مثال: يحب التقنية، يحب الموضة، يهوى الرياضة)' };
    }


    // Enhanced gift suggestion logic (after initial gift inquiry and context is active)
    const lastBotMessage = messages.length > 0 ? messages[messages.length - 1].text: '';
    if (lastBotMessage && lastBotMessage.includes('لمساعدتي في اختيار الهدية المثالية')) {
      let recipient = '';
      let occasion = '';
      let budget = Infinity;
      let interests = [];

      // Improved parsing for gift details
      const recipientMatch = lowerCaseMessage.match(/(?:لمن|لـ|الى)\s*(امي|أمي|ابي|أبي|صديق|صديقة|طفل|أطفال)/);
      if (recipientMatch) recipient = recipientMatch[1].replace(/اء$/, ''); // Remove ء for broader match

      const occasionMatch = lowerCaseMessage.match(/(عيد ميلاد|تخرج|زفاف|زواج|عيد الأم|ذكرى|بمناسبة)/);
      if (occasionMatch) occasion = occasionMatch[1];

      const budgetMatch = lowerCaseMessage.match(/(?:ميزانية|بحدود|حوالي|بمبلغ)\s*(\d+)\s*(?:ريال|ريالاً)?/);
      if (budgetMatch) budget = parseInt(budgetMatch[1], 10);

      const interestMatch = lowerCaseMessage.match(/(تقنية|موضة|رياضة|جمال|ألعاب|قراءة|موسيقى|فنون)/g);
      if (interestMatch) interests = Array.from(new Set(interestMatch)); // Remove duplicates

      // Fallback for direct recipient/interest words without explicit prepositions
      if (lowerCaseMessage.includes('امي') || lowerCaseMessage.includes('أمي')) recipient = 'الأم';
      if (lowerCaseMessage.includes('ابي') || lowerCaseMessage.includes('أبي')) recipient = 'الأب';
      if (lowerCaseMessage.includes('صديق') || lowerCaseMessage.includes('صديقة')) recipient = 'صديق/صديقة';
      if (lowerCaseMessage.includes('طفل') || lowerCaseMessage.includes('أطفال')) recipient = 'طفل';

      // Advanced interest mapping based on common categories
      if (lowerCaseMessage.includes('تقنية') || lowerCaseMessage.includes('الكترونيات')) interests.push('تقنية');
      if (lowerCaseMessage.includes('موضة') || lowerCaseMessage.includes('ملابس') || lowerCaseMessage.includes('أزياء')) interests.push('موضة');
      if (lowerCaseMessage.includes('رياضة') || lowerCaseMessage.includes('رياضي')) interests.push('رياضة');
      if (lowerCaseMessage.includes('جمال') || lowerCaseMessage.includes('مكياج') || lowerCaseMessage.includes('عطور')) interests.push('جمال');
      if (lowerCaseMessage.includes('ألعاب') || lowerCaseMessage.includes('لعب')) interests.push('ألعاب');

      interests = Array.from(new Set(interests)); // Ensure uniqueness

      let potentialGifts = dummyData.products.filter(product => {
        let isProductMatch = true;

        if (budget !== Infinity && product.price > budget) {
          isProductMatch = false;
        }

        // Refine by recipient type (more flexible)
        if (recipient.includes('أم') || recipient.includes('صديقة')) {
          if (!(['ملابس', 'تجميل'].includes(product.category) || product.name.includes('نسائي') || product.name.includes('حقيبة يد') || product.name.includes('فستان') || product.name.includes('بلوزة'))) {
            isProductMatch = false;
          }
        } else if (recipient.includes('أب') || recipient.includes('صديق')) {
          if (!(['هواتف', 'لابتوبات', 'سماعات', 'ساعات ذكية', 'أجهزة مكتبية', 'ملابس'].includes(product.category) || product.name.includes('رجالي') || product.name.includes('بدلة') || product.name.includes('قميص') || product.name.includes('تي شيرت'))) {
            isProductMatch = false;
          }
        } else if (recipient.includes('طفل')) {
          if (!(['ألعاب'].includes(product.category) || product.name.includes('أطفال') || product.name.includes('دمية') || product.name.includes('ليغو'))) {
            isProductMatch = false;
          }
        }

        // Refine by interests
        if (interests.length > 0) {
          const productDescriptionLower = product.description.toLowerCase();
          const productCategoryLower = product.category.toLowerCase();
          const productNameLower = product.name.toLowerCase();
          const productBrandLower = product.brand?.toLowerCase() || '';

          const interestMatch = interests.some(interest => {
            const regex = new RegExp(interest, 'i');
            return (
              regex.test(productDescriptionLower) ||
              regex.test(productCategoryLower) ||
              regex.test(productNameLower) ||
              regex.test(productBrandLower) ||
              (interest === 'موضة' && product.category === 'ملابس') ||
              (interest === 'جمال' && product.category === 'تجميل') ||
              (interest === 'تقنية' && ['هواتف', 'لابتوبات', 'سماعات', 'ساعات ذكية', 'أجهزة مكتبية'].includes(product.category)) ||
              (interest === 'رياضة' && (product.description.includes('رياضي') || product.category.includes('رياضية') || product.name.includes('رياضي'))) ||
              (interest === 'ألعاب' && product.category === 'ألعاب')
            );
          });
          if (!interestMatch) {
            isProductMatch = false;
          }
        }
        return isProductMatch;
      });

      if (potentialGifts.length > 0) {
        potentialGifts.sort((a, b) => a.price - b.price);
        const topGifts = potentialGifts.slice(0, 3);
        let giftResponse = `يا له من سؤال جميل! بناءً على معلوماتك (لمن: ${recipient || 'غير محدد'}، المناسبة: ${occasion || 'غير محدد'}، ميزانية حوالي ${budget === Infinity ? 'أي سعر' : `${budget} ريال`}، اهتمامات: ${interests.join(', ') || 'غير محددة'}):\n\nإليك بعض الاقتراحات الرائعة:\n`;
        topGifts.forEach((p, index) => {
          giftResponse += `${index + 1}. **${p.name}** (${p.brand || 'غير محدد'}) من فئة **${p.category}** بسعر ${p.price} ريال. ${p.description}\n`;
        });
        giftResponse += '\nأتمنى أن تكون هذه الاقتراحات مفيدة! هل ترغب في المزيد من الخيارات أو تفاصيل عن منتج معين؟';
        return { type: 'text', text: giftResponse };
      } else {
        return { type: 'text', text: 'للأسف، لم أتمكن من العثور على هدية تطابق كل المعايير بالضبط. هل يمكنك إعطائي تفاصيل أكثر أو ميزانية مختلفة؟' };
      }
    }


    // 3. General Gemini Fallback for complex queries
    try {
      setIsLoading(true);

      const chatHistoryForGemini = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user': 'model',
        parts: [{ text: msg.text }]
      }));

      // Add the current user message as the last entry for context in the prompt
      chatHistoryForGemini.push({ role: 'user', parts: [{ text: message }] });

      const allProductsInfo = dummyData.products.map(p =>
        `الاسم: ${p.name}, الفئة: ${p.category}, السعر: ${p.price} ريال, الوصف: ${p.description}, البراند: ${p.brand || 'غير محدد'}${p.colors && p.colors.length > 0 ? ', الألوان: ' + p.colors.join('، ') : ''}${p.sizes && p.sizes.length > 0 ? ', المقاسات: ' + p.sizes.join('، ') : ''}`
      ).join('\n---\n');

      const geminiPrompt = `أنت روبوت دردشة ودود، متعاون، وذكي للغاية لمتجر إلكتروني. مهمتك هي مساعدة العملاء كما لو كنت ممثل خدمة عملاء بشري. اجعل ردودك إبداعية، شخصية، وداعمة وودودة. استخدم لغة طبيعية وواضحة، وتجنب المصطلحات التقنية المعقدة.

      **قائمة المنتجات المتاحة في المتجر:**
      ${allProductsInfo}

      **تعليمات خاصة لاقتراح الهدايا:**
      إذا طلب المستخدم "اقتراح هدية" أو أي شيء يتعلق بالهدايا، فلا تقدم اقتراحات فورية. بدلاً من ذلك، ابدأ حوارًا لطيفًا ومفيدًا لجمع المعلومات. اسأل عن:
      1.  **لمن الهدية؟** (مثال: لأمي، لأبي، لصديق، لطفل)
      2.  **ما هي المناسبة؟** (مثال: عيد ميلاد، تخرج، زفاف، عيد الأم)
      3.  **ما هي الميزانية التقريبية؟** (مثال: تحت 200 ريال، حوالي 500 ريال)
      4.  **ما هي اهتمامات الشخص الذي سيتلقى الهدية؟** (مثال: يحب القراءة، يهتم بالتقنية، يحب الموضة، يهوى الرياضة)
      بعد جمع هذه المعلومات، قم بترشيح 2-3 منتجات من قائمة "قائمة المنتجات المتاحة في المتجر" التي تتناسب مع المعايير المذكورة. اذكر اسم المنتج، فئته، وسعره، ووصفه بإيجاز. إذا لم تجد تطابقًا دقيقًا، اقترح منتجات قريبة أو اطلب مزيدًا من التفاصيل.

      **تعليمات عامة ومهمة جداً للحفاظ على سياق المحادثة:**
      -   **دائماً خذ في الاعتبار جميع الرسائل السابقة في سجل الدردشة.** هذا ضروري لفهم السياق والإجابة على الأسئلة المتابعة أو الردود القصيرة مثل "نعم" أو "أجل" أو "لا" أو "تمام".
      -   إذا طرحت سؤالاً على المستخدم، وتلقيت رداً قصيراً (مثل "نعم" أو "أجل" أو "لا" أو "تمام")، **افهم هذا الرد في سياق سؤالك الأخير** وواصل المحادثة بناءً عليه.
      -   حاول دائمًا تقديم معلومات دقيقة من سياق المتجر أولاً.
      -   إذا لم تكن متأكدًا من الإجابة، يمكنك طلب المزيد من التفاصيل من العميل بأسلوب مهذب.
      -   في نهاية ردك، حاول دائمًا اقتراح خطوة تالية أو سؤال متابعة لمواصلة المحادثة ومساعدة العميل بشكل أكبر.

      سؤال المستخدم الحالي: "${message}"`;

      const payload = {
        contents: [{
          role: 'user',
          parts: [{ text: geminiPrompt }]
        }]
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      setIsLoading(false);

      if (result.candidates && result. candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        return { type: 'text', text: text };
      } else {
        console.error('Gemini API returned an unexpected structure or no content:', result);
        return { type: 'text', text: 'عذرًا، واجهت مشكلة في فهم طلبك حاليًا. يرجى المحاولة مرة أخرى.' };
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error calling Gemini API:', error);
      return { type: 'text', text: 'عذرًا، حدث خطأ أثناء الاتصال بالروبوت. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.' };
    }
  };

  // Handle sending a message
  const handleSendMessage = async (messageToSend = inputMessage) => {
    if (messageToSend.trim() === '') return;

    const newUserMessage = { text: messageToSend, sender: 'user', type: 'text' };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    if (messageToSend === inputMessage) {
      setInputMessage('');
    }

    // Pass the entire message history to getBotResponse for context awareness
    const botResponse = await getBotResponse(messageToSend);
    const newBotMessage = { ...botResponse, sender: 'bot' };
    setMessages((prevMessages) => [...prevMessages, newBotMessage]);
  };

  // Scroll to the bottom of the messages div whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Suggestions for quick user input
  const suggestions = [
    'اقترحلي هدية',
    'منتجات تحت 500 ريال',
    'تتبع طلبي',
    'طرق الدفع',
    'الشحن',
    'استرجاع منتج',
    'مساعدة',
    'تغليف الهدايا',
    'الدفع بالتقسيط'
  ];

  // Component to render different message types
  const Message = ({ msg }) => {
    const isUser = msg.sender === 'user';
    const messageClass = isUser
      ? 'bg-blue-500 text-white rounded-br-none'
      : 'bg-gray-200 text-gray-800 rounded-bl-none';

    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[75%] p-3 rounded-lg shadow-md ${messageClass}`}>
          {msg.type === 'text' && <span>{msg.text}</span>}
          {msg.type === 'product' && msg.data && (
            <div className="flex flex-col items-center p-2">
              <img src={msg.data.imageUrl} alt={msg.data.name} className="w-24 h-24 rounded-lg mb-2 object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/150x150/cccccc/000000?text=لا+صورة'; }} />
              <h3 className="font-bold text-lg text-blue-700">{msg.data.name}</h3>
              <p className="text-gray-600">السعر: {msg.data.price} ريال</p>
              {msg.data.brand && <p className="text-sm text-gray-500">البراند: {msg.data.brand}</p>}
              {msg.data.colors && msg.data.colors.length > 0 && <p className="text-sm text-gray-500">الألوان: {msg.data.colors.join('، ')}</p>}
              {msg.data.sizes && msg.data.sizes.length > 0 && <p className="text-sm text-gray-500">المقاسات: {msg.data.sizes.join('، ')}</p>}
              <p className="text-sm text-gray-500 mt-1">{msg.data.description}</p>
            </div>
          )}
          {msg.type === 'image' && msg.imageUrl && (
            <div className="flex flex-col items-center">
              <span>{msg.text}</span>
              <img src={msg.imageUrl} alt="Bot provided image" className="w-full max-w-[200px] h-auto rounded-lg mt-2" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x200/cccccc/000000?text=خطأ+في+تحميل+الصورة'; }} />
            </div>
          )}
          {msg.type === 'link' && msg.linkUrl && (
            <div className="flex flex-col items-center">
              <span>{msg.text}</span>
              <a href={msg.linkUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline mt-2 hover:text-blue-800 transition duration-200">
                {msg.linkText || 'الرابط'}
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };
 
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-2 font-inter">
      <div className="w-full max-w-full bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-[90vh]">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 text-center text-xl font-semibold rounded-t-xl">
          مساعد متجر الكتروني
        </div>

        {/* Messages Display Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
              مرحباً بك! أنا هنا لمساعدتك في متجرنا. كيف يمكنني خدمتك اليوم؟
            </div>
          )}
          {messages.map((msg, index) => (
            <Message key={index} msg={msg} />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[75%] p-3 rounded-lg shadow-md bg-gray-200 text-gray-800 rounded-bl-none">
                يكتب...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} /> {/* Empty div for scrolling */}
        </div>

        {/* Suggestions */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 flex flex-wrap gap-2 justify-center">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSendMessage(suggestion)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 transition duration-200 shadow-sm"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Message Input Area */}
        <div className="p-4 border-t border-gray-200 flex items-center bg-gray-50 rounded-b-xl">
          <input
            type="text"
            className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            placeholder="اكتب رسالتك هنا..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage()}
            className="ml-3 px-5 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
            disabled={isLoading}
          >
            إرسال
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
