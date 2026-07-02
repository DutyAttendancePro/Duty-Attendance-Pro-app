'use strict';
/* =====================================================================
   DUTY ATTENDANCE PRO — app.js
   Offline-first attendance / shift / salary / leave tracker.
   No backend. IndexedDB primary store, localStorage mirror + settings.
===================================================================== */

/* ---------------------------- i18n ---------------------------------- */
const I18N = {
  en:{ dashboard:"Dashboard", attendance:"Attendance", calendar:"Calendar", salary:"Salary", leave:"Leave",
    reports:"Reports", analytics:"Analytics", settings:"Settings", search:"Search",
    checkIn:"Check In", checkOut:"Check Out", breakStart:"Start Break", breakEnd:"End Break",
    today:"Today's Status", workingHours:"Working Hours", overtime:"Overtime", attendancePct:"Attendance %",
    monthlyEarn:"Monthly Estimate", todayEarn:"Today's Earnings", notCheckedIn:"Not checked in",
    checkedIn:"Checked in", onBreak:"On break", checkedOut:"Checked out", save:"Save", cancel:"Cancel",
    delete:"Delete", add:"Add", export:"Export", import:"Import", backup:"Backup", restore:"Restore",
    resetData:"Reset Data", darkMode:"Dark Mode", language:"Language", currency:"Currency",
    timeFormat:"Time Format", dateFormat:"Date Format", notes:"Notes", shift:"Shift", halfDay:"Half Day",
    fullDay:"Full Day", nightShift:"Night Shift", present:"Present", absent:"Absent", holiday:"Holiday",
    weeklyOff:"Weekly Off", casualLeave:"Casual Leave", sickLeave:"Sick Leave", paidLeave:"Paid Leave",
    unpaidLeave:"Unpaid Leave", customLeave:"Custom Leave" },
  hi:{ dashboard:"डैशबोर्ड", attendance:"उपस्थिति", calendar:"कैलेंडर", salary:"वेतन", leave:"छुट्टी",
    reports:"रिपोर्ट", analytics:"विश्लेषण", settings:"सेटिंग्स", search:"खोजें",
    checkIn:"चेक इन", checkOut:"चेक आउट", breakStart:"ब्रेक शुरू", breakEnd:"ब्रेक समाप्त",
    today:"आज की स्थिति", workingHours:"कार्य घंटे", overtime:"ओवरटाइम", attendancePct:"उपस्थिति %",
    monthlyEarn:"मासिक अनुमान", todayEarn:"आज की कमाई", notCheckedIn:"चेक इन नहीं हुआ",
    checkedIn:"चेक इन हो गया", onBreak:"ब्रेक पर", checkedOut:"चेक आउट हो गया", save:"सहेजें",
    cancel:"रद्द करें", delete:"हटाएं", add:"जोड़ें", export:"निर्यात", import:"आयात", backup:"बैकअप",
    restore:"पुनर्स्थापित", resetData:"डेटा रीसेट", darkMode:"डार्क मोड", language:"भाषा", currency:"मुद्रा",
    timeFormat:"समय प्रारूप", dateFormat:"दिनांक प्रारूप", notes:"टिप्पणियाँ", shift:"शिफ्ट", halfDay:"आधा दिन",
    fullDay:"पूरा दिन", nightShift:"रात की शिफ्ट", present:"उपस्थित", absent:"अनुपस्थित", holiday:"छुट्टी का दिन",
    weeklyOff:"साप्ताहिक अवकाश", casualLeave:"आकस्मिक अवकाश", sickLeave:"बीमारी अवकाश", paidLeave:"सवेतन अवकाश",
    unpaidLeave:"अवैतनिक अवकाश", customLeave:"अन्य अवकाश" },
  bn:{ dashboard:"ড্যাশবোর্ড", attendance:"উপস্থিতি", calendar:"ক্যালেন্ডার", salary:"বেতন", leave:"ছুটি",
    reports:"রিপোর্ট", analytics:"বিশ্লেষণ", settings:"সেটিংস", search:"অনুসন্ধান",
    checkIn:"চেক ইন", checkOut:"চেক আউট", breakStart:"বিরতি শুরু", breakEnd:"বিরতি শেষ",
    today:"আজকের অবস্থা", workingHours:"কর্মঘণ্টা", overtime:"ওভারটাইম", attendancePct:"উপস্থিতি %",
    monthlyEarn:"মাসিক আনুমানিক", todayEarn:"আজকের আয়", notCheckedIn:"চেক ইন করা হয়নি",
    checkedIn:"চেক ইন হয়েছে", onBreak:"বিরতিতে", checkedOut:"চেক আউট হয়েছে", save:"সংরক্ষণ",
    cancel:"বাতিল", delete:"মুছুন", add:"যোগ করুন", export:"রপ্তানি", import:"আমদানি", backup:"ব্যাকআপ",
    restore:"পুনরুদ্ধার", resetData:"ডেটা রিসেট", darkMode:"ডার্ক মোড", language:"ভাষা", currency:"মুদ্রা",
    timeFormat:"সময় বিন্যাস", dateFormat:"তারিখ বিন্যাস", notes:"নোট", shift:"শিফট", halfDay:"অর্ধেক দিন",
    fullDay:"পূর্ণ দিন", nightShift:"নাইট শিফট", present:"উপস্থিত", absent:"অনুপস্থিত", holiday:"ছুটির দিন",
    weeklyOff:"সাপ্তাহিক ছুটি", casualLeave:"নৈমিত্তিক ছুটি", sickLeave:"অসুস্থতা ছুটি", paidLeave:"বেতনসহ ছুটি",
    unpaidLeave:"বেতনহীন ছুটি", customLeave:"অন্যান্য ছুটি" },
  ta:{ dashboard:"டாஷ்போர்டு", attendance:"வருகை", calendar:"நாள்காட்டி", salary:"சம்பளம்", leave:"விடுப்பு",
    reports:"அறிக்கைகள்", analytics:"பகுப்பாய்வு", settings:"அமைப்புகள்", search:"தேடல்",
    checkIn:"செக் இன்", checkOut:"செக் அவுட்", breakStart:"இடைவேளை தொடக்கம்", breakEnd:"இடைவேளை முடிவு",
    today:"இன்றைய நிலை", workingHours:"வேலை நேரம்", overtime:"கூடுதல் நேரம்", attendancePct:"வருகை %",
    monthlyEarn:"மாத மதிப்பீடு", todayEarn:"இன்றைய வருமானம்", notCheckedIn:"செக் இன் இல்லை",
    checkedIn:"செக் இன் ஆனது", onBreak:"இடைவேளையில்", checkedOut:"செக் அவுட் ஆனது", save:"சேமி",
    cancel:"ரத்து", delete:"நீக்கு", add:"சேர்", export:"ஏற்றுமதி", import:"இறக்குமதி", backup:"காப்பு",
    restore:"மீட்டமை", resetData:"தரவு மீட்டமை", darkMode:"இருண்ட பயன்முறை", language:"மொழி", currency:"நாணயம்",
    timeFormat:"நேர வடிவம்", dateFormat:"தேதி வடிவம்", notes:"குறிப்புகள்", shift:"ஷிப்ட்", halfDay:"அரை நாள்",
    fullDay:"முழு நாள்", nightShift:"இரவு ஷிப்ட்", present:"வருகை", absent:"வராதவர்", holiday:"விடுமுறை நாள்",
    weeklyOff:"வாராந்திர விடுப்பு", casualLeave:"சாதாரண விடுப்பு", sickLeave:"நோய் விடுப்பு", paidLeave:"ஊதிய விடுப்பு",
    unpaidLeave:"ஊதியமற்ற விடுப்பு", customLeave:"பிற விடுப்பு" },
  te:{ dashboard:"డాష్‌బోర్డ్", attendance:"హాజరు", calendar:"క్యాలెండర్", salary:"జీతం", leave:"సెలవు",
    reports:"నివేదికలు", analytics:"విశ్లేషణ", settings:"సెట్టింగ్‌లు", search:"శోధన",
    checkIn:"చెక్ ఇన్", checkOut:"చెక్ అవుట్", breakStart:"విరామం ప్రారంభం", breakEnd:"విరామం ముగింపు",
    today:"నేటి స్థితి", workingHours:"పని గంటలు", overtime:"ఓవర్‌టైమ్", attendancePct:"హాజరు %",
    monthlyEarn:"నెలవారీ అంచనా", todayEarn:"నేటి సంపాదన", notCheckedIn:"చెక్ ఇన్ కాలేదు",
    checkedIn:"చెక్ ఇన్ అయింది", onBreak:"విరామంలో", checkedOut:"చెక్ అవుట్ అయింది", save:"సేవ్",
    cancel:"రద్దు", delete:"తొలగించు", add:"జోడించు", export:"ఎగుమతి", import:"దిగుమతి", backup:"బ్యాకప్",
    restore:"పునరుద్ధరించు", resetData:"డేటా రీసెట్", darkMode:"డార్క్ మోడ్", language:"భాష", currency:"కరెన్సీ",
    timeFormat:"సమయ ఆకృతి", dateFormat:"తేదీ ఆకృతి", notes:"గమనికలు", shift:"షిఫ్ట్", halfDay:"అర్ధ రోజు",
    fullDay:"పూర్తి రోజు", nightShift:"రాత్రి షిఫ్ట్", present:"హాజరు", absent:"గైర్హాజరు", holiday:"సెలవు దినం",
    weeklyOff:"వారాంతపు సెలవు", casualLeave:"క్యాజువల్ లీవ్", sickLeave:"సిక్ లీవ్", paidLeave:"పెయిడ్ లీవ్",
    unpaidLeave:"అన్‌పెయిడ్ లీవ్", customLeave:"ఇతర సెలవు" },
  ml:{ dashboard:"ഡാഷ്ബോർഡ്", attendance:"ഹാജർ", calendar:"കലണ്ടർ", salary:"ശമ്പളം", leave:"അവധി",
    reports:"റിപ്പോർട്ടുകൾ", analytics:"അനലിറ്റിക്സ്", settings:"ക്രമീകരണങ്ങൾ", search:"തിരയൽ",
    checkIn:"ചെക്ക് ഇൻ", checkOut:"ചെക്ക് ഔട്ട്", breakStart:"ഇടവേള തുടക്കം", breakEnd:"ഇടവേള അവസാനം",
    today:"ഇന്നത്തെ നില", workingHours:"ജോലി സമയം", overtime:"ഓവർടൈം", attendancePct:"ഹാജർ %",
    monthlyEarn:"പ്രതിമാസ കണക്ക്", todayEarn:"ഇന്നത്തെ വരുമാനം", notCheckedIn:"ചെക്ക് ഇൻ ചെയ്തിട്ടില്ല",
    checkedIn:"ചെക്ക് ഇൻ ചെയ്തു", onBreak:"ഇടവേളയിൽ", checkedOut:"ചെക്ക് ഔട്ട് ചെയ്തു", save:"സേവ്",
    cancel:"റദ്ദാക്കുക", delete:"ഇല്ലാതാക്കുക", add:"ചേർക്കുക", export:"എക്സ്പോർട്ട്", import:"ഇംപോർട്ട്",
    backup:"ബാക്കപ്പ്", restore:"പുനഃസ്ഥാപിക്കുക", resetData:"ഡാറ്റ റീസെറ്റ്", darkMode:"ഡാർക്ക് മോഡ്",
    language:"ഭാഷ", currency:"കറൻസി", timeFormat:"സമയ ഫോർമാറ്റ്", dateFormat:"തീയതി ഫോർമാറ്റ്",
    notes:"കുറിപ്പുകൾ", shift:"ഷിഫ്റ്റ്", halfDay:"അര ദിവസം", fullDay:"മുഴു ദിവസം", nightShift:"നൈറ്റ് ഷിഫ്റ്റ്",
    present:"ഹാജർ", absent:"അഹാജർ", holiday:"അവധി ദിനം", weeklyOff:"പ്രതിവാര അവധി", casualLeave:"കാഷ്വൽ ലീവ്",
    sickLeave:"സിക്ക് ലീവ്", paidLeave:"പെയ്ഡ് ലീവ്", unpaidLeave:"അൺപെയ്ഡ് ലീവ്", customLeave:"മറ്റ് അവധി" },
  kn:{ dashboard:"ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", attendance:"ಹಾಜರಾತಿ", calendar:"ಕ್ಯಾಲೆಂಡರ್", salary:"ಸಂಬಳ", leave:"ರಜೆ",
    reports:"ವರದಿಗಳು", analytics:"ವಿಶ್ಲೇಷಣೆ", settings:"ಸಂಯೋಜನೆಗಳು", search:"ಹುಡುಕಿ",
    checkIn:"ಚೆಕ್ ಇನ್", checkOut:"ಚೆಕ್ ಔಟ್", breakStart:"ವಿರಾಮ ಆರಂಭ", breakEnd:"ವಿರಾಮ ಅಂತ್ಯ",
    today:"ಇಂದಿನ ಸ್ಥಿತಿ", workingHours:"ಕೆಲಸದ ಸಮಯ", overtime:"ಓವರ್‌ಟೈಮ್", attendancePct:"ಹಾಜರಾತಿ %",
    monthlyEarn:"ಮಾಸಿಕ ಅಂದಾಜು", todayEarn:"ಇಂದಿನ ಗಳಿಕೆ", notCheckedIn:"ಚೆಕ್ ಇನ್ ಆಗಿಲ್ಲ",
    checkedIn:"ಚೆಕ್ ಇನ್ ಆಗಿದೆ", onBreak:"ವಿರಾಮದಲ್ಲಿ", checkedOut:"ಚೆಕ್ ಔಟ್ ಆಗಿದೆ", save:"ಉಳಿಸಿ",
    cancel:"ರದ್ದುಮಾಡಿ", delete:"ಅಳಿಸಿ", add:"ಸೇರಿಸಿ", export:"ರಫ್ತು", import:"ಆಮದು", backup:"ಬ್ಯಾಕಪ್",
    restore:"ಮರುಸ್ಥಾಪಿಸಿ", resetData:"ಡೇಟಾ ಮರುಹೊಂದಿಸಿ", darkMode:"ಡಾರ್ಕ್ ಮೋಡ್", language:"ಭಾಷೆ", currency:"ಕರೆನ್ಸಿ",
    timeFormat:"ಸಮಯ ಸ್ವರೂಪ", dateFormat:"ದಿನಾಂಕ ಸ್ವರೂಪ", notes:"ಟಿಪ್ಪಣಿಗಳು", shift:"ಶಿಫ್ಟ್", halfDay:"ಅರ್ಧ ದಿನ",
    fullDay:"ಪೂರ್ಣ ದಿನ", nightShift:"ರಾತ್ರಿ ಶಿಫ್ಟ್", present:"ಹಾಜರು", absent:"ಗೈರುಹಾಜರು", holiday:"ರಜಾ ದಿನ",
    weeklyOff:"ವಾರದ ರಜೆ", casualLeave:"ಕ್ಯಾಶುಯಲ್ ರಜೆ", sickLeave:"ಅನಾರೋಗ್ಯ ರಜೆ", paidLeave:"ಪಾವತಿ ರಜೆ",
    unpaidLeave:"ಅಪಾವತಿ ರಜೆ", customLeave:"ಇತರ ರಜೆ" },
  mr:{ dashboard:"डॅशबोर्ड", attendance:"उपस्थिती", calendar:"दिनदर्शिका", salary:"पगार", leave:"रजा",
    reports:"अहवाल", analytics:"विश्लेषण", settings:"सेटिंग्ज", search:"शोधा",
    checkIn:"चेक इन", checkOut:"चेक आउट", breakStart:"विश्रांती सुरू", breakEnd:"विश्रांती समाप्त",
    today:"आजची स्थिती", workingHours:"कामाचे तास", overtime:"ओव्हरटाईम", attendancePct:"उपस्थिती %",
    monthlyEarn:"मासिक अंदाज", todayEarn:"आजची कमाई", notCheckedIn:"चेक इन नाही",
    checkedIn:"चेक इन झाले", onBreak:"विश्रांतीवर", checkedOut:"चेक आउट झाले", save:"जतन करा",
    cancel:"रद्द करा", delete:"हटवा", add:"जोडा", export:"निर्यात", import:"आयात", backup:"बॅकअप",
    restore:"पुनर्संचयित करा", resetData:"डेटा रीसेट", darkMode:"डार्क मोड", language:"भाषा", currency:"चलन",
    timeFormat:"वेळ स्वरूप", dateFormat:"तारीख स्वरूप", notes:"नोंदी", shift:"शिफ्ट", halfDay:"अर्धा दिवस",
    fullDay:"पूर्ण दिवस", nightShift:"रात्र शिफ्ट", present:"उपस्थित", absent:"अनुपस्थित", holiday:"सुट्टीचा दिवस",
    weeklyOff:"साप्ताहिक सुट्टी", casualLeave:"प्रासंगिक रजा", sickLeave:"आजारी रजा", paidLeave:"सशुल्क रजा",
    unpaidLeave:"विनावेतन रजा", customLeave:"इतर रजा" },
  gu:{ dashboard:"ડેશબોર્ડ", attendance:"હાજરી", calendar:"કેલેન્ડર", salary:"પગાર", leave:"રજા",
    reports:"અહેવાલો", analytics:"વિશ્લેષણ", settings:"સેટિંગ્સ", search:"શોધો",
    checkIn:"ચેક ઇન", checkOut:"ચેક આઉટ", breakStart:"વિરામ શરૂ", breakEnd:"વિરામ સમાપ્ત",
    today:"આજની સ્થિતિ", workingHours:"કામના કલાકો", overtime:"ઓવરટાઇમ", attendancePct:"હાજરી %",
    monthlyEarn:"માસિક અંદાજ", todayEarn:"આજની કમાણી", notCheckedIn:"ચેક ઇન નથી",
    checkedIn:"ચેક ઇન થયું", onBreak:"વિરામ પર", checkedOut:"ચેક આઉટ થયું", save:"સાચવો",
    cancel:"રદ કરો", delete:"કાઢી નાખો", add:"ઉમેરો", export:"નિકાસ", import:"આયાત", backup:"બેકઅપ",
    restore:"પુનઃસ્થાપિત કરો", resetData:"ડેટા રીસેટ", darkMode:"ડાર્ક મોડ", language:"ભાષા", currency:"ચલણ",
    timeFormat:"સમય ફોર્મેટ", dateFormat:"તારીખ ફોર્મેટ", notes:"નોંધો", shift:"શિફ્ટ", halfDay:"અડધો દિવસ",
    fullDay:"પૂરો દિવસ", nightShift:"નાઇટ શિફ્ટ", present:"હાજર", absent:"ગેરહાજર", holiday:"રજાનો દિવસ",
    weeklyOff:"સાપ્તાહિક રજા", casualLeave:"કેઝ્યુઅલ રજા", sickLeave:"સિક રજા", paidLeave:"પેઇડ રજા",
    unpaidLeave:"અનપેઇડ રજા", customLeave:"અન્ય રજા" },
  pa:{ dashboard:"ਡੈਸ਼ਬੋਰਡ", attendance:"ਹਾਜ਼ਰੀ", calendar:"ਕੈਲੰਡਰ", salary:"ਤਨਖਾਹ", leave:"ਛੁੱਟੀ",
    reports:"ਰਿਪੋਰਟਾਂ", analytics:"ਵਿਸ਼ਲੇਸ਼ਣ", settings:"ਸੈਟਿੰਗਾਂ", search:"ਖੋਜ",
    checkIn:"ਚੈੱਕ ਇਨ", checkOut:"ਚੈੱਕ ਆਉਟ", breakStart:"ਬਰੇਕ ਸ਼ੁਰੂ", breakEnd:"ਬਰੇਕ ਖਤਮ",
    today:"ਅੱਜ ਦੀ ਸਥਿਤੀ", workingHours:"ਕੰਮ ਦੇ ਘੰਟੇ", overtime:"ਓਵਰਟਾਈਮ", attendancePct:"ਹਾਜ਼ਰੀ %",
    monthlyEarn:"ਮਹੀਨਾਵਾਰ ਅਨੁਮਾਨ", todayEarn:"ਅੱਜ ਦੀ ਕਮਾਈ", notCheckedIn:"ਚੈੱਕ ਇਨ ਨਹੀਂ",
    checkedIn:"ਚੈੱਕ ਇਨ ਹੋ ਗਿਆ", onBreak:"ਬਰੇਕ ਤੇ", checkedOut:"ਚੈੱਕ ਆਉਟ ਹੋ ਗਿਆ", save:"ਸੰਭਾਲੋ",
    cancel:"ਰੱਦ ਕਰੋ", delete:"ਮਿਟਾਓ", add:"ਜੋੜੋ", export:"ਨਿਰਯਾਤ", import:"ਆਯਾਤ", backup:"ਬੈਕਅੱਪ",
    restore:"ਮੁੜ ਬਹਾਲ ਕਰੋ", resetData:"ਡਾਟਾ ਰੀਸੈੱਟ", darkMode:"ਡਾਰਕ ਮੋਡ", language:"ਭਾਸ਼ਾ", currency:"ਮੁਦਰਾ",
    timeFormat:"ਸਮਾਂ ਫਾਰਮੈਟ", dateFormat:"ਮਿਤੀ ਫਾਰਮੈਟ", notes:"ਨੋਟਸ", shift:"ਸ਼ਿਫਟ", halfDay:"ਅੱਧਾ ਦਿਨ",
    fullDay:"ਪੂਰਾ ਦਿਨ", nightShift:"ਰਾਤ ਦੀ ਸ਼ਿਫਟ", present:"ਹਾਜ਼ਰ", absent:"ਗੈਰਹਾਜ਼ਰ", holiday:"ਛੁੱਟੀ ਵਾਲਾ ਦਿਨ",
    weeklyOff:"ਹਫਤਾਵਾਰੀ ਛੁੱਟੀ", casualLeave:"ਆਮ ਛੁੱਟੀ", sickLeave:"ਬਿਮਾਰੀ ਛੁੱਟੀ", paidLeave:"ਤਨਖਾਹ ਸਮੇਤ ਛੁੱਟੀ",
    unpaidLeave:"ਬਿਨਾਂ ਤਨਖਾਹ ਛੁੱਟੀ", customLeave:"ਹੋਰ ਛੁੱਟੀ" }
};
function t(key){
  const lang = State.settings.language || 'en';
  return (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
}

/* ---------------------------- DB layer ------------------------------- */
const DB_NAME = 'duty_attendance_pro';
const DB_VERSION = 1;
const STORES = ['records','leaves','settings','notes','salaryConfig'];
let dbInstance = null;

function openDB(){
  return new Promise((resolve)=>{
    // Timeout: if IndexedDB hangs for >3s just continue without it
    const timeout = setTimeout(()=>{ console.warn('IndexedDB timeout, using localStorage'); resolve(null); }, 3000);
    try {
      if (!('indexedDB' in window)){ clearTimeout(timeout); resolve(null); return; }
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e)=>{
        try {
          const db = e.target.result;
          if (!db.objectStoreNames.contains('records')) db.createObjectStore('records', { keyPath:'date' });
          if (!db.objectStoreNames.contains('leaves')) db.createObjectStore('leaves', { keyPath:'id' });
          if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings', { keyPath:'key' });
          if (!db.objectStoreNames.contains('notes')) db.createObjectStore('notes', { keyPath:'id' });
          if (!db.objectStoreNames.contains('salaryConfig')) db.createObjectStore('salaryConfig', { keyPath:'key' });
        } catch(e){ console.warn('IDB upgrade error:', e); }
      };
      req.onsuccess = (e)=>{ clearTimeout(timeout); dbInstance = e.target.result; resolve(dbInstance); };
      req.onerror = ()=>{ clearTimeout(timeout); resolve(null); };
      req.onblocked = ()=>{ clearTimeout(timeout); resolve(null); };
    } catch(e){ clearTimeout(timeout); resolve(null); }
  });
}
function idbPut(store, value){
  return new Promise((resolve)=>{
    if (!dbInstance) return resolve(false);
    try{
      const tx = dbInstance.transaction(store, 'readwrite');
      tx.objectStore(store).put(value);
      tx.oncomplete = ()=> resolve(true);
      tx.onerror = ()=> resolve(false);
    }catch(e){ resolve(false); }
  });
}
function idbDelete(store, key){
  return new Promise((resolve)=>{
    if (!dbInstance) return resolve(false);
    try{
      const tx = dbInstance.transaction(store, 'readwrite');
      tx.objectStore(store).delete(key);
      tx.oncomplete = ()=> resolve(true);
      tx.onerror = ()=> resolve(false);
    }catch(e){ resolve(false); }
  });
}
function idbGetAll(store){
  return new Promise((resolve)=>{
    if (!dbInstance) return resolve([]);
    try{
      const tx = dbInstance.transaction(store, 'readonly');
      const req = tx.objectStore(store).getAll();
      req.onsuccess = ()=> resolve(req.result || []);
      req.onerror = ()=> resolve([]);
    }catch(e){ resolve([]); }
  });
}
function idbClear(store){
  return new Promise((resolve)=>{
    if (!dbInstance) return resolve(false);
    try{
      const tx = dbInstance.transaction(store, 'readwrite');
      tx.objectStore(store).clear();
      tx.oncomplete = ()=> resolve(true);
      tx.onerror = ()=> resolve(false);
    }catch(e){ resolve(false); }
  });
}

const LS_KEY = 'dap_backup_v1';
function mirrorToLocalStorage(){
  try{
    localStorage.setItem(LS_KEY, JSON.stringify({
      records: State.records, leaves: State.leaves, notes: State.notes,
      settings: State.settings, salaryConfig: State.salaryConfig, savedAt: Date.now()
    }));
  }catch(e){ /* quota or unavailable - ignore, IndexedDB remains source of truth */ }
}
function loadFromLocalStorage(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  }catch(e){ return null; }
}

/* ---------------------------- State ----------------------------------- */
const DEFAULT_SETTINGS = {
  theme:'dark', language:'en', currency:'₹', timeFormat:'12', dateFormat:'DD/MM/YYYY',
  pin:null, pinEnabled:false, autoLogin:true, biometric:false,
  notifCheckIn:'09:00', notifCheckOut:'18:00', notifEnabled:false
};
const DEFAULT_SALARY = {
  type:'monthly', monthlyBase:25000, dailyBase:900, hourlyBase:120, standardHours:8,
  overtimeRate:1.5, bonus:0, deduction:0, taxPct:0, advance:0
};
const State = {
  records:{},            // date(YYYY-MM-DD) -> record object
  leaves:[],             // {id,date,type,note}
  notes:[],              // {id,date,text}
  settings: { ...DEFAULT_SETTINGS },
  salaryConfig: { ...DEFAULT_SALARY },
  view:'dashboard',
  calMonth: new Date().getMonth(),
  calYear: new Date().getFullYear(),
  locked:true,
  pinBuffer:'',
  deferredInstallPrompt:null
};

async function persistRecord(rec){
  State.records[rec.date] = rec;
  await idbPut('records', rec);
  mirrorToLocalStorage();
}
async function persistLeave(lv){
  const idx = State.leaves.findIndex(l=>l.id===lv.id);
  if (idx>=0) State.leaves[idx]=lv; else State.leaves.push(lv);
  await idbPut('leaves', lv);
  mirrorToLocalStorage();
}
async function removeLeave(id){
  State.leaves = State.leaves.filter(l=>l.id!==id);
  await idbDelete('leaves', id);
  mirrorToLocalStorage();
}
async function persistNote(n){
  const idx = State.notes.findIndex(x=>x.id===n.id);
  if (idx>=0) State.notes[idx]=n; else State.notes.push(n);
  await idbPut('notes', n);
  mirrorToLocalStorage();
}
async function persistSettings(){
  await idbPut('settings', { key:'main', value: State.settings });
  mirrorToLocalStorage();
}
async function persistSalaryConfig(){
  await idbPut('salaryConfig', { key:'main', value: State.salaryConfig });
  mirrorToLocalStorage();
}

async function loadAllData(){
  await openDB();
  const [records, leaves, notes, settingsRows, salaryRows] = await Promise.all([
    idbGetAll('records'), idbGetAll('leaves'), idbGetAll('notes'), idbGetAll('settings'), idbGetAll('salaryConfig')
  ]);
  if (records.length || leaves.length || notes.length || settingsRows.length){
    records.forEach(r=> State.records[r.date]=r);
    State.leaves = leaves;
    State.notes = notes;
    const s = settingsRows.find(r=>r.key==='main');
    if (s) State.settings = { ...DEFAULT_SETTINGS, ...s.value };
    const sc = salaryRows.find(r=>r.key==='main');
    if (sc) State.salaryConfig = { ...DEFAULT_SALARY, ...sc.value };
  } else {
    // fall back to localStorage mirror (e.g. private browsing without IndexedDB)
    const backup = loadFromLocalStorage();
    if (backup){
      State.records = backup.records || {};
      State.leaves = backup.leaves || [];
      State.notes = backup.notes || [];
      State.settings = { ...DEFAULT_SETTINGS, ...(backup.settings||{}) };
      State.salaryConfig = { ...DEFAULT_SALARY, ...(backup.salaryConfig||{}) };
    }
  }
}

/* ---------------------------- Utils ------------------------------------ */
function pad2(n){ return String(n).padStart(2,'0'); }
function dkey(d){ return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`; }
function todayKey(){ return dkey(new Date()); }
function parseKey(key){ const [y,m,d]=key.split('-').map(Number); return new Date(y,m-1,d); }
function fmtDate(key){
  const d = parseKey(key);
  const fmt = State.settings.dateFormat;
  const D=pad2(d.getDate()), M=pad2(d.getMonth()+1), Y=d.getFullYear();
  if (fmt==='MM/DD/YYYY') return `${M}/${D}/${Y}`;
  if (fmt==='YYYY-MM-DD') return `${Y}-${M}-${D}`;
  return `${D}/${M}/${Y}`;
}
function fmtTime(date){
  if (!date) return '--:--';
  const d = (date instanceof Date) ? date : new Date(date);
  let h = d.getHours(), m = pad2(d.getMinutes());
  if (State.settings.timeFormat==='12'){
    const ap = h>=12 ? 'PM':'AM';
    h = h % 12; if (h===0) h=12;
    return `${h}:${m} ${ap}`;
  }
  return `${pad2(h)}:${m}`;
}
function fmtHrs(hours){
  if (!isFinite(hours) || hours<=0) return '0h 0m';
  const h = Math.floor(hours); const m = Math.round((hours-h)*60);
  return `${h}h ${m}m`;
}
function money(n){
  const v = Number(n)||0;
  return `${State.settings.currency}${v.toLocaleString('en-IN',{maximumFractionDigits:0})}`;
}
function uid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,8); }
function monthLabel(y,m){ return new Date(y,m,1).toLocaleDateString(undefined,{month:'long', year:'numeric'}); }
function daysInMonth(y,m){ return new Date(y,m+1,0).getDate(); }
function clamp(n,min,max){ return Math.max(min, Math.min(max,n)); }

function toast(msg, icon){
  const wrap = document.getElementById('toastWrap');
  const el = document.createElement('div');
  el.className='toast';
  el.innerHTML = `<span>${icon||'✅'}</span><span>${msg}</span>`;
  wrap.appendChild(el);
  setTimeout(()=>{ el.style.opacity='0'; el.style.transform='translateY(-8px)'; el.style.transition='all .25s'; }, 2200);
  setTimeout(()=> el.remove(), 2500);
}
function vibrate(pattern){ if (navigator.vibrate) try{ navigator.vibrate(pattern); }catch(e){} }

/* ---------------------------- Salary Calc ----------------------------- */
function calcDailyRate(){
  const cfg = State.salaryConfig;
  if (cfg.type==='daily') return cfg.dailyBase;
  if (cfg.type==='hourly') return cfg.hourlyBase * cfg.standardHours;
  // monthly -> daily (working days = 26)
  return cfg.monthlyBase / 26;
}
function calcHourlyRate(){
  const cfg = State.salaryConfig;
  if (cfg.type==='hourly') return cfg.hourlyBase;
  return calcDailyRate() / (cfg.standardHours || 8);
}
function calcTodayEarnings(rec){
  if (!rec || !rec.checkIn) return 0;
  const hrs = calcNetHours(rec);
  return hrs * calcHourlyRate();
}
function calcNetHours(rec){
  if (!rec || !rec.checkIn) return 0;
  const end = rec.checkOut ? new Date(rec.checkOut) : new Date();
  const gross = (end - new Date(rec.checkIn)) / 3600000;
  const breakHrs = (rec.breakDuration || 0) / 3600000;
  return Math.max(0, gross - breakHrs);
}
function calcOvertimeHours(rec){
  const net = calcNetHours(rec);
  const std = State.salaryConfig.standardHours || 8;
  return Math.max(0, net - std);
}
function calcMonthlyEstimate(year, month){
  const cfg = State.salaryConfig;
  let totalDays = 0, totalOTHrs = 0;
  const days = daysInMonth(year, month);
  for (let d=1; d<=days; d++){
    const key = `${year}-${pad2(month+1)}-${pad2(d)}`;
    const rec = State.records[key];
    if (rec && rec.status==='present' && rec.checkIn){
      totalDays += rec.halfDay ? 0.5 : 1;
      totalOTHrs += calcOvertimeHours(rec);
    }
  }
  let base = totalDays * calcDailyRate();
  const otPay = totalOTHrs * calcHourlyRate() * (cfg.overtimeRate||1.5);
  const gross = base + otPay + (cfg.bonus||0) - (cfg.deduction||0) - (cfg.advance||0);
  const tax = gross * ((cfg.taxPct||0)/100);
  return Math.max(0, gross - tax);
}
function attendancePct(year, month){
  const days = daysInMonth(year, month);
  let workable=0, attended=0;
  for (let d=1; d<=days; d++){
    const key = `${year}-${pad2(month+1)}-${pad2(d)}`;
    const dow = new Date(year, month, d).getDay();
    const lv = State.leaves.find(l=>l.date===key);
    if (lv && (lv.type==='weeklyOff'||lv.type==='holiday')) continue;
    workable++;
    const rec = State.records[key];
    if (rec && (rec.status==='present' || rec.status==='halfDay')) attended += rec.halfDay ? 0.5 : 1;
  }
  if (workable===0) return 0;
  return Math.round((attended/workable)*100);
}

/* ---------------------------- PIN Lock -------------------------------- */
function setupPinUI(){
  const pinDots = document.getElementById('pinDots');
  const pinPad = document.getElementById('pinPad');
  const settings = State.settings;
  const digits = '123456789 0⌫'.split(' ');
  pinDots.innerHTML = [0,1,2,3].map(i=>`<div class="pin-dot" id="pd${i}"></div>`).join('');
  pinPad.innerHTML = '';
  '1 2 3 4 5 6 7 8 9  0 ⌫'.split(' ').forEach((d,i)=>{
    const btn = document.createElement('button');
    btn.className = 'pin-key' + (d===''?' ghost':'');
    btn.textContent = d || '';
    if (d==='') btn.disabled=true;
    btn.addEventListener('click', ()=> onPinKey(d));
    pinPad.appendChild(btn);
  });
  if (!settings.pin){
    document.getElementById('lockTitle').textContent = 'Create a 4-digit PIN';
    document.getElementById('lockSub').textContent = 'Used to protect your attendance data';
  }
  if (settings.biometric && settings.pin) document.getElementById('bioBtn').classList.remove('hidden');
}
let creatingPin = null;
function onPinKey(k){
  if (k==='⌫'){
    State.pinBuffer = State.pinBuffer.slice(0,-1);
  } else if (State.pinBuffer.length<4 && k!==''){
    State.pinBuffer += k;
    vibrate(20);
  }
  updatePinDots();
  if (State.pinBuffer.length===4) setTimeout(()=>checkPin(), 120);
}
function updatePinDots(){
  for(let i=0;i<4;i++){
    const d = document.getElementById('pd'+i);
    if(d) d.classList.toggle('filled', i<State.pinBuffer.length);
  }
}
function checkPin(){
  const settings = State.settings;
  if (!settings.pin){
    if (!creatingPin){ creatingPin = State.pinBuffer; State.pinBuffer=''; updatePinDots();
      document.getElementById('lockTitle').textContent='Confirm your PIN'; return; }
    if (creatingPin===State.pinBuffer){
      settings.pin = State.pinBuffer; settings.pinEnabled=true; creatingPin=null;
      persistSettings(); unlock();
    } else {
      document.getElementById('lockError').textContent='PINs do not match. Try again.';
      creatingPin=null; State.pinBuffer=''; updatePinDots();
      document.getElementById('lockTitle').textContent='Create a 4-digit PIN';
    }
    return;
  }
  if (State.pinBuffer===settings.pin){ unlock(); }
  else {
    document.getElementById('lockError').textContent='Incorrect PIN';
    vibrate([80,40,80]); State.pinBuffer=''; updatePinDots();
    setTimeout(()=>{ document.getElementById('lockError').textContent=''; },1800);
  }
}
function unlock(){
  State.locked=false; State.pinBuffer='';
  document.getElementById('lock').classList.remove('show');
  if (State.settings.autoLogin) sessionStorage.setItem('dap_unlocked','1');
  document.getElementById('app').classList.add('ready');
  renderView(State.view);
}
function showLock(){
  setupPinUI();
  document.getElementById('lock').classList.add('show');
}
document.getElementById('bioBtn').addEventListener('click', async ()=>{
  try{
    if (!window.PublicKeyCredential) throw new Error('unavailable');
    unlock(); // in a real deployment you'd call navigator.credentials.get() here
  }catch(e){ toast('Biometric not available on this device','⚠️'); }
});

/* ---------------------------- Navigation ------------------------------- */
const NAV_ITEMS = [
  { id:'dashboard', icon:'🏠', label:'dashboard' },
  { id:'attendance', icon:'⏱️', label:'attendance' },
  { id:'calendar', icon:'📅', label:'calendar' },
  { id:'salary', icon:'💰', label:'salary' },
  { id:'leave', icon:'🌴', label:'leave' },
  { id:'reports', icon:'📊', label:'reports' },
  { id:'analytics', icon:'📈', label:'analytics' },
  { id:'settings', icon:'⚙️', label:'settings' }
];
function buildNav(){
  const bottom = document.getElementById('bottomNav');
  const side = document.getElementById('sideNav');
  // show 5 items in bottom nav (dashboard, attendance, calendar, reports, more->settings)
  const bottomItems = ['dashboard','attendance','calendar','reports','settings'];
  bottom.innerHTML = bottomItems.map(id=>{
    const item = NAV_ITEMS.find(n=>n.id===id);
    return `<button class="nav-item${State.view===id?' active':''}" data-view="${id}">
      <span class="ic">${item.icon}</span><span>${t(item.label)}</span></button>`;
  }).join('');
  bottom.querySelectorAll('.nav-item').forEach(btn=>{
    btn.addEventListener('click',()=>{ navigateTo(btn.dataset.view); });
  });
  side.innerHTML = NAV_ITEMS.map(item=>`
    <button class="side-link${State.view===item.id?' active':''}" data-view="${item.id}">
      <span class="ic">${item.icon}</span>${t(item.label)}</button>`).join('');
  side.querySelectorAll('.side-link').forEach(btn=>{
    btn.addEventListener('click',()=>{ navigateTo(btn.dataset.view); });
  });
}
function navigateTo(view){
  State.view = view;
  document.getElementById('pageTitle').textContent = t(NAV_ITEMS.find(n=>n.id===view)?.label||view);
  buildNav();
  renderView(view);
  document.querySelector('.main')?.scrollTo({top:0, behavior:'smooth'});
}
function renderView(view){
  const container = document.getElementById('view');
  container.innerHTML='';
  switch(view){
    case 'dashboard': renderDashboard(container); break;
    case 'attendance': renderAttendance(container); break;
    case 'calendar': renderCalendar(container); break;
    case 'salary': renderSalary(container); break;
    case 'leave': renderLeave(container); break;
    case 'reports': renderReports(container); break;
    case 'analytics': renderAnalytics(container); break;
    case 'settings': renderSettings(container); break;
    default: container.textContent='Coming soon';
  }
}

/* =====================================================================
   VIEWS
===================================================================== */

/* ---- DASHBOARD ---- */
function renderDashboard(el){
  const today = todayKey();
  const rec = State.records[today];
  const now = new Date();
  const y=now.getFullYear(), m=now.getMonth();
  const pct = attendancePct(y,m);
  const netHrs = calcNetHours(rec);
  const otHrs = calcOvertimeHours(rec);
  const todayEarn = calcTodayEarnings(rec);
  const monthEst = calcMonthlyEstimate(y,m);
  const status = !rec?.checkIn ? t('notCheckedIn')
    : rec?.onBreak ? t('onBreak')
    : !rec?.checkOut ? t('checkedIn')
    : t('checkedOut');
  const statusPill = !rec?.checkIn ? 'gray' : rec?.onBreak ? 'brass' : !rec?.checkOut ? 'green' : 'blue';

  // build punch percentage
  const stdHrs = State.salaryConfig.standardHours || 8;
  const punchPct = Math.min(100, (netHrs/stdHrs)*100);

  el.innerHTML = `
  <h2 class="view-title">${t('dashboard')}</h2>

  <!-- Punch dial -->
  <div class="card" style="text-align:center">
    <div class="punch-wrap">
      <div class="punch" style="--pct:${punchPct.toFixed(1)}">
        <div class="punch-inner">
          <div class="t mono">${fmtHrs(netHrs)}</div>
          <div class="l">${t('workingHours')}</div>
        </div>
      </div>
      <div class="flex gap-8 items-center wrap" style="justify-content:center">
        <span class="pill ${statusPill}">${status}</span>
        ${rec?.shift ? `<span class="pill gray">${rec.shift}</span>` : ''}
      </div>
      <div class="punch-actions" id="punchActions"></div>
    </div>
  </div>

  <!-- today stats -->
  <div class="grid grid-2 mt-14">
    <div class="card stat">
      <div class="label">Check In</div>
      <div class="value mono">${rec?.checkIn ? fmtTime(rec.checkIn) : '--:--'}</div>
    </div>
    <div class="card stat">
      <div class="label">Check Out</div>
      <div class="value mono">${rec?.checkOut ? fmtTime(rec.checkOut) : '--:--'}</div>
    </div>
    <div class="card stat">
      <div class="label">${t('overtime')}</div>
      <div class="value mono">${fmtHrs(otHrs)}</div>
    </div>
    <div class="card stat">
      <div class="label">${t('attendancePct')}</div>
      <div class="value">${pct}%</div>
    </div>
    <div class="card stat">
      <div class="label">${t('todayEarn')}</div>
      <div class="value">${money(todayEarn)}</div>
    </div>
    <div class="card stat">
      <div class="label">${t('monthlyEarn')}</div>
      <div class="value">${money(monthEst)}</div>
    </div>
  </div>

  <!-- mini calendar -->
  <div class="card mt-14" id="miniCalSection"></div>

  <!-- week summary -->
  <div class="card mt-14" id="weekSummary"></div>`;

  renderPunchActions(document.getElementById('punchActions'), rec, today);
  renderMiniCal(document.getElementById('miniCalSection'), y, m);
  renderWeekSummary(document.getElementById('weekSummary'));
}

function renderPunchActions(el, rec, today){
  el.innerHTML='';
  if (!rec?.checkIn){
    btn('⏱️ '+t('checkIn'), 'primary', ()=>doCheckIn(today));
  } else if (rec?.onBreak){
    btn('☕ '+t('breakEnd'), 'outline', ()=>doBreakEnd(today));
  } else if (!rec?.checkOut){
    btn('☕ '+t('breakStart'), 'outline', ()=>doBreakStart(today));
    btn('🔚 '+t('checkOut'), 'primary', ()=>doCheckOut(today));
  } else {
    const el2 = document.createElement('p');
    el2.className='muted'; el2.style.fontSize='.82rem';
    el2.textContent='Shift complete for today.'; el.appendChild(el2); return;
  }
  function btn(label, style, handler){
    const b = document.createElement('button');
    b.className=`btn btn-${style}`; b.style.flex='1'; b.innerHTML=label;
    b.addEventListener('click', handler); el.appendChild(b);
  }
}

function renderMiniCal(el, y, m){
  el.innerHTML=`<div class="flex between items-center" style="margin-bottom:12px">
    <b style="font-size:.9rem">${monthLabel(y,m)}</b>
    <a href="#" style="font-size:.78rem; color:var(--accent); text-decoration:none" id="viewFullCal">View all →</a></div>
  <div class="cal-grid" id="miniGrid"></div>`;
  el.querySelector('#viewFullCal').addEventListener('click',(e)=>{ e.preventDefault(); navigateTo('calendar'); });
  const grid = el.querySelector('#miniGrid');
  ['S','M','T','W','T','F','S'].forEach(d=>{ const c=document.createElement('div'); c.className='cal-dow'; c.textContent=d; grid.appendChild(c); });
  const firstDow = new Date(y,m,1).getDay();
  for(let i=0;i<firstDow;i++){ const c=document.createElement('div'); c.className='cal-cell empty'; grid.appendChild(c); }
  const days = daysInMonth(y,m), todayK = todayKey();
  for(let d=1;d<=days;d++){
    const key=`${y}-${pad2(m+1)}-${pad2(d)}`;
    const rec=State.records[key];
    const lv=State.leaves.find(l=>l.date===key);
    let cls='cal-cell'; let dotColor='';
    if(key===todayK) cls+=' today';
    if(lv?.type==='holiday') cls+=' holiday';
    else if(lv?.type==='weeklyOff') cls+=' holiday';
    else if(lv && lv.type!=='holiday') cls+=' leave';
    else if(rec?.status==='present') cls+=' present';
    else if(new Date(y,m,d)<new Date() && !lv) cls+=' absent';
    const c=document.createElement('div'); c.className=cls; c.textContent=d;
    grid.appendChild(c);
  }
}

function renderWeekSummary(el){
  const now=new Date();
  const dow=now.getDay();
  const weekStart=new Date(now); weekStart.setDate(now.getDate()-dow);
  let totalHrs=0, presentDays=0;
  const rows=[];
  for(let i=0;i<7;i++){
    const d=new Date(weekStart); d.setDate(weekStart.getDate()+i);
    const key=dkey(d);
    const rec=State.records[key];
    const hrs=calcNetHours(rec);
    if(rec?.status==='present') presentDays++;
    totalHrs+=hrs;
    rows.push({ day:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][i], hrs, key, rec });
  }
  el.innerHTML=`<div class="flex between items-center" style="margin-bottom:12px">
    <b style="font-size:.9rem">This Week</b>
    <span class="pill green">${presentDays}/7 days</span></div>
  <div style="display:flex;gap:6px;align-items:flex-end;height:60px" id="weekBars"></div>
  <div class="flex between muted mt-8" style="font-size:.7rem"><span>Total: ${fmtHrs(totalHrs)}</span><span>Avg: ${fmtHrs(totalHrs/7)}/day</span></div>`;
  const bars=el.querySelector('#weekBars');
  const maxHrs=Math.max(...rows.map(r=>r.hrs),1);
  rows.forEach(r=>{
    const pct=Math.max(4,(r.hrs/maxHrs)*100);
    const today=r.key===todayKey();
    bars.innerHTML+=`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px">
      <div style="width:100%;height:${pct}%;background:${today?'var(--accent)':'var(--surface-2)'};border-radius:4px 4px 0 0;min-height:4px"></div>
      <span style="font-size:.6rem;color:var(--fg-dim)">${r.day}</span></div>`;
  });
}

/* ---- ATTENDANCE ---- */
function renderAttendance(el){
  const today = todayKey();
  const rec = State.records[today] || {};
  const recentKeys = Object.keys(State.records).sort().reverse().slice(0,30);

  el.innerHTML=`<h2 class="view-title">${t('attendance')}</h2>
  <div class="card">
    <div class="flex between items-center" style="margin-bottom:14px">
      <b>${fmtDate(today)} (Today)</b>
      <button class="btn btn-outline" id="addManualBtn" style="padding:8px 14px;font-size:.78rem">+ Manual Entry</button>
    </div>
    <div id="todayPane"></div>
  </div>
  <div class="card mt-14">
    <div class="search-box"><span class="ic">🔎</span>
      <input type="text" placeholder="Search records…" id="recSearch" /></div>
    <div id="recList"></div>
  </div>`;

  renderTodayPane(document.getElementById('todayPane'), today, rec);
  document.getElementById('addManualBtn').addEventListener('click', ()=> openManualEntry());
  const searchEl = document.getElementById('recSearch');
  const listEl = document.getElementById('recList');
  renderRecList(listEl, recentKeys, '');
  searchEl.addEventListener('input',()=> renderRecList(listEl, recentKeys, searchEl.value));
}
function renderTodayPane(el, today, rec){
  const net=calcNetHours(rec), ot=calcOvertimeHours(rec);
  el.innerHTML=`
  <div class="grid grid-2" style="gap:10px">
    <div class="stat"><div class="label">Check In</div><div class="value mono">${rec.checkIn?fmtTime(rec.checkIn):'--:--'}</div></div>
    <div class="stat"><div class="label">Check Out</div><div class="value mono">${rec.checkOut?fmtTime(rec.checkOut):'--:--'}</div></div>
    <div class="stat"><div class="label">Net Hours</div><div class="value mono">${fmtHrs(net)}</div></div>
    <div class="stat"><div class="label">${t('overtime')}</div><div class="value mono">${fmtHrs(ot)}</div></div>
  </div>
  ${rec.notes?`<p style="font-size:.8rem;color:var(--fg-dim);margin-top:10px">📝 ${rec.notes}</p>`:''}
  <div class="flex gap-8 mt-14 wrap" id="atBtns"></div>`;
  const btns=el.querySelector('#atBtns');
  function ab(label,handler,style='outline'){
    const b=document.createElement('button');
    b.className=`btn btn-${style}`; b.innerHTML=label;
    b.addEventListener('click',handler); btns.appendChild(b);
  }
  if(!rec.checkIn) ab('⏱️ '+t('checkIn'), ()=>doCheckIn(today), 'primary');
  if(rec.checkIn && !rec.checkOut && !rec.onBreak) ab('☕ '+t('breakStart'), ()=>doBreakStart(today));
  if(rec.onBreak) ab('▶️ '+t('breakEnd'), ()=>doBreakEnd(today));
  if(rec.checkIn && !rec.checkOut && !rec.onBreak) ab('🔚 '+t('checkOut'), ()=>doCheckOut(today), 'primary');
  if(rec.checkIn) ab('🗑️ Reset Today', ()=>resetToday(today), 'ghost');
}
function renderRecList(el, keys, query){
  const q=query.toLowerCase();
  const filtered=keys.filter(k=>{
    if(!q) return true;
    const rec=State.records[k];
    return k.includes(q) || (rec?.notes||'').toLowerCase().includes(q) || (rec?.shift||'').toLowerCase().includes(q);
  });
  if(!filtered.length){ el.innerHTML=`<div class="empty"><div class="ic">📋</div><div class="t">No records found</div><div class="s">Your attendance log will appear here</div></div>`; return; }
  el.innerHTML=filtered.slice(0,60).map(k=>{
    const rec=State.records[k];
    const net=calcNetHours(rec);
    const statusCls=rec?.status==='present'?'green':'rust';
    return `<div class="list-row" data-key="${k}">
      <div class="ic-box">${rec?.status==='present'?'✅':'❌'}</div>
      <div class="body"><div class="ttl">${fmtDate(k)}</div>
        <div class="sub">${rec?.checkIn?fmtTime(rec.checkIn)+' – '+(rec?.checkOut?fmtTime(rec.checkOut):'ongoing'):'Not recorded'}${rec?.notes?' · '+rec.notes:''}</div>
      </div>
      <div class="meta"><span class="pill ${statusCls}" style="margin-bottom:4px">${rec?.status||'—'}</span><br><span style="font-size:.72rem;color:var(--fg-dim)">${fmtHrs(net)}</span></div>
    </div>`;
  }).join('');
  el.querySelectorAll('.list-row').forEach(row=>{
    row.addEventListener('click',()=> openEditRecord(row.dataset.key));
  });
}

/* ---- ATTENDANCE ACTIONS ---- */
async function doCheckIn(date){
  const rec = State.records[date] || { date };
  if(rec.checkIn){ toast('Already checked in','⚠️'); return; }
  rec.checkIn = new Date().toISOString();
  rec.status = 'present';
  rec.shift = rec.shift || 'Day Shift';
  await persistRecord(rec);
  vibrate([60,30,60]); toast(t('checkedIn'),'⏱️');
  renderView(State.view);
}
async function doCheckOut(date){
  const rec = State.records[date];
  if(!rec?.checkIn){ toast('Check in first','⚠️'); return; }
  if(rec.checkOut){ toast('Already checked out','⚠️'); return; }
  rec.checkOut = new Date().toISOString();
  await persistRecord(rec);
  vibrate([80,40,80]); toast(t('checkedOut'),'🔚');
  renderView(State.view);
}
async function doBreakStart(date){
  const rec = State.records[date];
  if(!rec?.checkIn){ toast('Check in first','⚠️'); return; }
  rec.onBreak=true; rec.breakStart=new Date().toISOString();
  await persistRecord(rec);
  toast(t('onBreak'),'☕');
  renderView(State.view);
}
async function doBreakEnd(date){
  const rec = State.records[date];
  if(!rec?.breakStart){ return; }
  const dur=(new Date()-new Date(rec.breakStart));
  rec.breakDuration=(rec.breakDuration||0)+dur;
  rec.onBreak=false; delete rec.breakStart;
  await persistRecord(rec);
  toast(t('breakEnd')+' (+'+Math.round(dur/60000)+'m)','▶️');
  renderView(State.view);
}
async function resetToday(date){
  if(!confirm('Reset today\'s attendance?')) return;
  delete State.records[date];
  await idbDelete('records', date);
  mirrorToLocalStorage();
  toast('Today reset','🔄'); renderView(State.view);
}
function openManualEntry(key){
  const today=todayKey();
  const date=key||today;
  const rec=State.records[date]||{date};
  const shifts=['Day Shift','Evening Shift','Night Shift','General Shift','Split Shift'];
  openModal(`<div class="modal-head"><h3>${key?'Edit Record':'Manual Entry'}</h3><button class="icon-btn" id="mclose">✕</button></div>
  <div class="field"><label>Date</label><input type="date" id="mDate" value="${date}"></div>
  <div class="field-row">
    <div class="field"><label>Check In</label><input type="time" id="mCI" value="${rec.checkIn?toTimeInput(rec.checkIn):''}"></div>
    <div class="field"><label>Check Out</label><input type="time" id="mCO" value="${rec.checkOut?toTimeInput(rec.checkOut):''}"></div>
  </div>
  <div class="field"><label>Shift</label><select id="mShift">${shifts.map(s=>`<option ${rec.shift===s?'selected':''}>${s}</option>`).join('')}</select></div>
  <div class="field"><label>Status</label><select id="mStatus">
    <option value="present" ${rec.status==='present'?'selected':''}>Present</option>
    <option value="absent" ${rec.status==='absent'?'selected':''}>Absent</option>
    <option value="halfDay" ${rec.status==='halfDay'?'selected':''}>Half Day</option>
    <option value="leave" ${rec.status==='leave'?'selected':''}>On Leave</option>
  </select></div>
  <div class="field"><label>${t('notes')}</label><textarea id="mNotes">${rec.notes||''}</textarea></div>
  <button class="btn btn-primary btn-block btn-lg" id="mSave">${t('save')}</button>`,
  ()=>{
    document.getElementById('mclose').onclick=closeModal;
    document.getElementById('mSave').addEventListener('click', async()=>{
      const d=document.getElementById('mDate').value;
      const ci=document.getElementById('mCI').value;
      const co=document.getElementById('mCO').value;
      const newRec={ date:d, shift:document.getElementById('mShift').value,
        status:document.getElementById('mStatus').value, notes:document.getElementById('mNotes').value,
        checkIn: ci?dateFromDateAndTime(d,ci):rec.checkIn||null,
        checkOut: co?dateFromDateAndTime(d,co):rec.checkOut||null };
      await persistRecord(newRec); closeModal();
      toast('Record saved','✅'); renderView(State.view);
    });
  });
}
function toTimeInput(iso){ const d=new Date(iso); return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`; }
function dateFromDateAndTime(dateStr, timeStr){
  const [h,m]=timeStr.split(':'); const d=new Date(dateStr);
  d.setHours(Number(h),Number(m),0,0); return d.toISOString();
}
function openEditRecord(key){ openManualEntry(key); }

/* ---- CALENDAR ---- */
function renderCalendar(el){
  const y=State.calYear, m=State.calMonth;
  el.innerHTML=`<h2 class="view-title">${t('calendar')}</h2>
  <div class="card">
    <div class="flex between items-center" style="margin-bottom:14px">
      <button class="icon-btn" id="calPrev">‹</button>
      <b style="font-size:.95rem">${monthLabel(y,m)}</b>
      <button class="icon-btn" id="calNext">›</button>
    </div>
    <div class="cal-grid" id="mainCalGrid"></div>
    <div class="cal-legend">
      <span><i style="background:color-mix(in srgb,var(--green) 50%,var(--surface-2))"></i>Present</span>
      <span><i style="background:color-mix(in srgb,var(--rust) 45%,var(--surface-2))"></i>Absent</span>
      <span><i style="background:color-mix(in srgb,var(--blue) 45%,var(--surface-2))"></i>Leave</span>
      <span><i style="background:color-mix(in srgb,var(--brass) 40%,var(--surface-2))"></i>Holiday</span>
    </div>
  </div>
  <div class="card mt-14" id="calDetailPane">
    <div class="empty"><div class="ic">📅</div><div class="t">Tap any day to view details</div></div>
  </div>`;

  document.getElementById('calPrev').addEventListener('click',()=>{
    if(State.calMonth===0){ State.calMonth=11; State.calYear--; } else State.calMonth--;
    renderCalendar(el);
  });
  document.getElementById('calNext').addEventListener('click',()=>{
    if(State.calMonth===11){ State.calMonth=0; State.calYear++; } else State.calMonth++;
    renderCalendar(el);
  });
  buildCalGrid(document.getElementById('mainCalGrid'), y, m);
}
function buildCalGrid(grid, y, m){
  grid.innerHTML='';
  ['S','M','T','W','T','F','S'].forEach(d=>{ const c=document.createElement('div'); c.className='cal-dow'; c.textContent=d; grid.appendChild(c); });
  const firstDow=new Date(y,m,1).getDay();
  for(let i=0;i<firstDow;i++){ const c=document.createElement('div'); c.className='cal-cell empty'; grid.appendChild(c); }
  const days=daysInMonth(y,m), todayK=todayKey();
  for(let d=1;d<=days;d++){
    const key=`${y}-${pad2(m+1)}-${pad2(d)}`;
    const rec=State.records[key];
    const lv=State.leaves.find(l=>l.date===key);
    let cls='cal-cell'; const isFuture=new Date(y,m,d)>new Date();
    if(key===todayK) cls+=' today';
    if(lv?.type==='holiday'||lv?.type==='weeklyOff') cls+=' holiday';
    else if(lv) cls+=' leave';
    else if(rec?.status==='present'||rec?.status==='halfDay') cls+=' present';
    else if(!isFuture) cls+=' absent';
    const c=document.createElement('div'); c.className=cls; c.textContent=d;
    c.addEventListener('click',()=> showCalDetail(key));
    grid.appendChild(c);
  }
}
function showCalDetail(key){
  const rec=State.records[key];
  const lv=State.leaves.find(l=>l.date===key);
  const pane=document.getElementById('calDetailPane');
  const net=calcNetHours(rec);
  pane.innerHTML=`<div class="flex between items-center" style="margin-bottom:12px">
    <b>${fmtDate(key)}</b>
    <button class="btn btn-outline" style="padding:7px 12px;font-size:.75rem" id="cdEdit">Edit</button>
  </div>
  ${lv?`<div class="list-row"><div class="ic-box">🌴</div><div class="body"><div class="ttl">${lv.type.replace(/([A-Z])/g,' $1')}</div><div class="sub">${lv.note||''}</div></div></div>`:
  rec?`<div class="grid grid-2" style="gap:10px">
    <div class="stat"><div class="label">Check In</div><div class="value mono">${fmtTime(rec.checkIn)}</div></div>
    <div class="stat"><div class="label">Check Out</div><div class="value mono">${rec.checkOut?fmtTime(rec.checkOut):'—'}</div></div>
    <div class="stat"><div class="label">Net Hours</div><div class="value mono">${fmtHrs(net)}</div></div>
    <div class="stat"><div class="label">OT</div><div class="value mono">${fmtHrs(calcOvertimeHours(rec))}</div></div>
  </div>${rec.notes?`<p style="font-size:.8rem;color:var(--fg-dim);margin-top:10px">📝 ${rec.notes}</p>`:''}`:
  `<div class="empty" style="padding:20px 0"><div class="ic">📋</div><div class="t">No record</div></div>`}`;
  pane.querySelector('#cdEdit')?.addEventListener('click', ()=>openManualEntry(key));
}

/* ---- SALARY ---- */
function renderSalary(el){
  const cfg=State.salaryConfig;
  const now=new Date(); const y=now.getFullYear(), m=now.getMonth();
  const monthly=calcMonthlyEstimate(y,m);
  const daily=calcDailyRate(); const hourly=calcHourlyRate();

  el.innerHTML=`<h2 class="view-title">${t('salary')}</h2>
  <div class="grid grid-2">
    <div class="card stat"><div class="label">Monthly Estimate</div><div class="value">${money(monthly)}</div></div>
    <div class="card stat"><div class="label">Daily Rate</div><div class="value">${money(daily)}</div></div>
    <div class="card stat"><div class="label">Hourly Rate</div><div class="value">${money(hourly)}</div></div>
    <div class="card stat"><div class="label">OT Rate</div><div class="value">${money(hourly*(cfg.overtimeRate||1.5))}/h</div></div>
  </div>
  <div class="card mt-14">
    <b style="display:block;margin-bottom:14px">Salary Configuration</b>
    <div class="field"><label>Salary Type</label><select id="sType">
      <option value="monthly" ${cfg.type==='monthly'?'selected':''}>Monthly</option>
      <option value="daily" ${cfg.type==='daily'?'selected':''}>Daily</option>
      <option value="hourly" ${cfg.type==='hourly'?'selected':''}>Hourly</option>
    </select></div>
    <div class="field-row">
      <div class="field"><label>Monthly Base (${State.settings.currency})</label><input type="number" id="sMonthly" value="${cfg.monthlyBase}"></div>
      <div class="field"><label>Daily Base (${State.settings.currency})</label><input type="number" id="sDaily" value="${cfg.dailyBase}"></div>
    </div>
    <div class="field-row">
      <div class="field"><label>Hourly Base (${State.settings.currency})</label><input type="number" id="sHourly" value="${cfg.hourlyBase}"></div>
      <div class="field"><label>Std Hours/Day</label><input type="number" id="sStdHrs" value="${cfg.standardHours}" min="1" max="24"></div>
    </div>
    <div class="field-row">
      <div class="field"><label>OT Multiplier</label><input type="number" id="sOT" value="${cfg.overtimeRate}" step="0.1" min="1"></div>
      <div class="field"><label>Bonus (${State.settings.currency})</label><input type="number" id="sBonus" value="${cfg.bonus}"></div>
    </div>
    <div class="field-row">
      <div class="field"><label>Deductions (${State.settings.currency})</label><input type="number" id="sDed" value="${cfg.deduction}"></div>
      <div class="field"><label>Advance (${State.settings.currency})</label><input type="number" id="sAdv" value="${cfg.advance}"></div>
    </div>
    <div class="field-row">
      <div class="field"><label>Tax %</label><input type="number" id="sTax" value="${cfg.taxPct}" min="0" max="50"></div>
    </div>
    <button class="btn btn-primary btn-block btn-lg" id="saveSalary">${t('save')} Configuration</button>
  </div>
  <div class="card mt-14" id="salaryBreakdown"></div>`;

  document.getElementById('saveSalary').addEventListener('click', async()=>{
    State.salaryConfig={
      type: document.getElementById('sType').value,
      monthlyBase: +document.getElementById('sMonthly').value||0,
      dailyBase: +document.getElementById('sDaily').value||0,
      hourlyBase: +document.getElementById('sHourly').value||0,
      standardHours: +document.getElementById('sStdHrs').value||8,
      overtimeRate: +document.getElementById('sOT').value||1.5,
      bonus: +document.getElementById('sBonus').value||0,
      deduction: +document.getElementById('sDed').value||0,
      advance: +document.getElementById('sAdv').value||0,
      taxPct: +document.getElementById('sTax').value||0
    };
    await persistSalaryConfig(); toast('Salary config saved','💰'); renderSalary(el);
  });
  renderSalaryBreakdown(document.getElementById('salaryBreakdown'), y, m);
}
function renderSalaryBreakdown(el, y, m){
  const cfg=State.salaryConfig;
  let days=0, otHrs=0;
  for(let d=1;d<=daysInMonth(y,m);d++){
    const key=`${y}-${pad2(m+1)}-${pad2(d)}`;
    const rec=State.records[key];
    if(rec?.status==='present'&&rec.checkIn){ days+=rec.halfDay?0.5:1; otHrs+=calcOvertimeHours(rec); }
  }
  const base=days*calcDailyRate();
  const ot=otHrs*calcHourlyRate()*(cfg.overtimeRate||1.5);
  const gross=base+ot+(cfg.bonus||0);
  const ded=(cfg.deduction||0)+(cfg.advance||0);
  const tax=Math.max(0,gross-ded)*((cfg.taxPct||0)/100);
  const net=Math.max(0,gross-ded-tax);
  el.innerHTML=`<b style="display:block;margin-bottom:14px">Salary Breakdown — ${monthLabel(y,m)}</b>
  <div class="list-row"><div class="body"><div class="ttl">Base Pay (${days} days)</div></div><div class="meta">${money(base)}</div></div>
  <div class="list-row"><div class="body"><div class="ttl">Overtime (${fmtHrs(otHrs)})</div></div><div class="meta">${money(ot)}</div></div>
  <div class="list-row"><div class="body"><div class="ttl">Bonus / Incentive</div></div><div class="meta">${money(cfg.bonus||0)}</div></div>
  <div class="list-row"><div class="body"><div class="ttl">Deductions</div></div><div class="meta" style="color:var(--rust)">- ${money(ded)}</div></div>
  <div class="list-row"><div class="body"><div class="ttl">Tax (${cfg.taxPct||0}%)</div></div><div class="meta" style="color:var(--rust)">- ${money(tax)}</div></div>
  <div class="list-row" style="font-weight:700;font-size:1rem"><div class="body"><div class="ttl">Net Salary</div></div><div class="meta" style="color:var(--accent)">${money(net)}</div></div>`;
}

/* ---- LEAVE ---- */
function renderLeave(el){
  el.innerHTML=`<h2 class="view-title">${t('leave')}</h2>
  <div class="card">
    <div class="flex between items-center" style="margin-bottom:14px">
      <b>Leave Records</b>
      <button class="btn btn-primary" id="addLeave" style="padding:9px 14px;font-size:.8rem">+ Add Leave</button>
    </div>
    <div id="leaveList"></div>
  </div>
  <div class="grid grid-2 mt-14" id="leaveSummary"></div>`;

  document.getElementById('addLeave').addEventListener('click', ()=>openLeaveModal());
  renderLeaveList(document.getElementById('leaveList'));
  renderLeaveSummary(document.getElementById('leaveSummary'));
}
function renderLeaveList(el){
  if(!State.leaves.length){
    el.innerHTML=`<div class="empty"><div class="ic">🌴</div><div class="t">No leaves recorded</div><div class="s">Add your leave and holidays here</div></div>`; return; }
  const sorted=[...State.leaves].sort((a,b)=>b.date.localeCompare(a.date));
  el.innerHTML=sorted.map(lv=>`<div class="list-row">
    <div class="ic-box">${leaveIcon(lv.type)}</div>
    <div class="body"><div class="ttl">${lv.type.replace(/([A-Z])/g,' $1')}</div>
      <div class="sub">${fmtDate(lv.date)}${lv.note?' · '+lv.note:''}</div></div>
    <div class="meta"><button class="btn btn-ghost" style="padding:6px 10px;font-size:.72rem" data-id="${lv.id}">Delete</button></div>
  </div>`).join('');
  el.querySelectorAll('[data-id]').forEach(btn=>{
    btn.addEventListener('click', async()=>{ await removeLeave(btn.dataset.id); renderView('leave'); });
  });
}
function renderLeaveSummary(el){
  const types=['casualLeave','sickLeave','paidLeave','unpaidLeave','holiday','weeklyOff'];
  el.innerHTML=types.map(type=>{
    const count=State.leaves.filter(l=>l.type===type).length;
    return `<div class="card stat"><div class="label">${t(type)}</div><div class="value">${count}</div></div>`;
  }).join('');
}
function leaveIcon(type){
  const m={casualLeave:'🌿',sickLeave:'🤒',paidLeave:'💰',unpaidLeave:'📋',holiday:'🎉',weeklyOff:'🔵',customLeave:'📌'};
  return m[type]||'📋';
}
function openLeaveModal(){
  openModal(`<div class="modal-head"><h3>Add Leave</h3><button class="icon-btn" id="lmClose">✕</button></div>
  <div class="field"><label>Date</label><input type="date" id="lvDate" value="${todayKey()}"></div>
  <div class="field"><label>Leave Type</label><select id="lvType">
    ${['casualLeave','sickLeave','paidLeave','unpaidLeave','holiday','weeklyOff','customLeave'].map(k=>`<option value="${k}">${t(k)}</option>`).join('')}
  </select></div>
  <div class="field"><label>${t('notes')} (optional)</label><textarea id="lvNote" style="min-height:52px"></textarea></div>
  <button class="btn btn-primary btn-block btn-lg" id="lvSave">${t('save')}</button>`,
  ()=>{
    document.getElementById('lmClose').onclick=closeModal;
    document.getElementById('lvSave').addEventListener('click', async()=>{
      const lv={id:uid(), date:document.getElementById('lvDate').value, type:document.getElementById('lvType').value, note:document.getElementById('lvNote').value};
      await persistLeave(lv); closeModal(); toast('Leave added','🌴'); renderView('leave');
    });
  });
}

/* ---- REPORTS ---- */
function renderReports(el){
  const now=new Date(); const y=now.getFullYear(), m=now.getMonth();
  el.innerHTML=`<h2 class="view-title">${t('reports')}</h2>
  <div class="card">
    <div class="flex gap-8 items-center wrap" style="margin-bottom:14px">
      <div class="seg" id="reportSeg">
        <button class="active" data-range="month">Monthly</button>
        <button data-range="week">Weekly</button>
        <button data-range="custom">Custom</button>
      </div>
    </div>
    <div id="reportCustomRange" class="hidden field-row">
      <div class="field"><label>From</label><input type="date" id="rFrom"></div>
      <div class="field"><label>To</label><input type="date" id="rTo"></div>
      <button class="btn btn-primary" id="rApply" style="align-self:flex-end;padding:11px 14px">Apply</button>
    </div>
  </div>
  <div class="card mt-14" id="reportContent"></div>
  <div class="card mt-14">
    <b style="display:block;margin-bottom:12px">Export</b>
    <div class="flex gap-8 wrap">
      <button class="btn btn-outline" id="expCSV">📄 CSV</button>
      <button class="btn btn-outline" id="expPrint">🖨️ Print</button>
      <button class="btn btn-outline" id="expJSON">💾 JSON Backup</button>
    </div>
  </div>`;

  let currentRange='month';
  let fromDate=new Date(y,m,1), toDate=new Date(y,m+1,0);

  function buildReport(){
    const keys=[];
    let d=new Date(fromDate);
    while(d<=toDate){ keys.push(dkey(d)); d.setDate(d.getDate()+1); }
    renderReportTable(document.getElementById('reportContent'), keys);
  }

  document.getElementById('reportSeg').querySelectorAll('button').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('#reportSeg button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active'); currentRange=btn.dataset.range;
      const custEl=document.getElementById('reportCustomRange');
      if(currentRange==='custom'){ custEl.classList.remove('hidden'); return; }
      custEl.classList.add('hidden');
      if(currentRange==='week'){
        const today=new Date(); fromDate=new Date(today); fromDate.setDate(today.getDate()-today.getDay());
        toDate=new Date(fromDate); toDate.setDate(fromDate.getDate()+6);
      } else {
        fromDate=new Date(y,m,1); toDate=new Date(y,m+1,0);
      }
      buildReport();
    });
  });
  document.getElementById('rApply')?.addEventListener('click',()=>{
    fromDate=new Date(document.getElementById('rFrom').value);
    toDate=new Date(document.getElementById('rTo').value);
    buildReport();
  });
  document.getElementById('expCSV').addEventListener('click', ()=>exportCSV(fromDate,toDate));
  document.getElementById('expPrint').addEventListener('click', ()=>printReport(fromDate,toDate));
  document.getElementById('expJSON').addEventListener('click', ()=>exportJSON());
  buildReport();
}
function renderReportTable(el, keys){
  const rows=keys.map(key=>({key, rec:State.records[key], lv:State.leaves.find(l=>l.date===key)}));
  const present=rows.filter(r=>r.rec?.status==='present').length;
  const absent=rows.filter(r=>!r.rec?.checkIn && !r.lv).length;
  const leaves=rows.filter(r=>r.lv).length;
  const totalHrs=rows.reduce((s,r)=>s+calcNetHours(r.rec),0);
  el.innerHTML=`<div class="grid grid-2" style="gap:10px;margin-bottom:16px">
    <div class="stat"><div class="label">Present</div><div class="value">${present}</div></div>
    <div class="stat"><div class="label">Absent</div><div class="value">${absent}</div></div>
    <div class="stat"><div class="label">Leave Days</div><div class="value">${leaves}</div></div>
    <div class="stat"><div class="label">Total Hours</div><div class="value mono">${fmtHrs(totalHrs)}</div></div>
  </div>
  <div class="table-scroll"><table class="report-table">
    <thead><tr><th>Date</th><th>Status</th><th>In</th><th>Out</th><th>Hours</th><th>OT</th><th>Note</th></tr></thead>
    <tbody>${rows.map(({key,rec,lv})=>{
      const net=calcNetHours(rec), ot=calcOvertimeHours(rec);
      const statusLabel=lv?lv.type.replace(/([A-Z])/g,' $1'):rec?.status||'—';
      const cls=lv?'leave':rec?.status==='present'?'present':rec?'absent':'';
      return `<tr><td>${fmtDate(key)}</td><td><span class="pill ${cls==='present'?'green':cls==='absent'?'rust':cls==='leave'?'blue':'gray'}">${statusLabel}</span></td>
        <td class="mono">${rec?.checkIn?fmtTime(rec.checkIn):'—'}</td>
        <td class="mono">${rec?.checkOut?fmtTime(rec.checkOut):'—'}</td>
        <td class="mono">${net>0?fmtHrs(net):'—'}</td>
        <td class="mono">${ot>0?fmtHrs(ot):'—'}</td>
        <td style="max-width:120px;overflow:hidden;text-overflow:ellipsis">${rec?.notes||lv?.note||''}</td></tr>`;
    }).join('')}</tbody>
  </table></div>`;
}
function exportCSV(from,to){
  const rows=[['Date','Status','CheckIn','CheckOut','WorkingHours','Overtime','Notes']];
  let d=new Date(from);
  while(d<=to){
    const key=dkey(d);
    const rec=State.records[key]; const lv=State.leaves.find(l=>l.date===key);
    const net=calcNetHours(rec); const ot=calcOvertimeHours(rec);
    rows.push([fmtDate(key), lv?lv.type:rec?.status||'absent',
      rec?.checkIn?fmtTime(rec.checkIn):'', rec?.checkOut?fmtTime(rec.checkOut):'',
      net?fmtHrs(net):'', ot?fmtHrs(ot):'', (rec?.notes||lv?.note||'').replace(/,/g,' ')]);
    d.setDate(d.getDate()+1);
  }
  const csv=rows.map(r=>r.join(',')).join('\n');
  downloadBlob(csv, 'text/csv', `attendance_${dkey(from)}_${dkey(to)}.csv`);
  toast('CSV exported','📄');
}
function printReport(from,to){
  const w=window.open('','_blank');
  let rows=''; let d=new Date(from);
  while(d<=to){
    const key=dkey(d); const rec=State.records[key]; const lv=State.leaves.find(l=>l.date===key);
    const net=calcNetHours(rec);
    rows+=`<tr><td>${fmtDate(key)}</td><td>${lv?lv.type:rec?.status||'—'}</td>
      <td>${rec?.checkIn?fmtTime(rec.checkIn):'—'}</td><td>${rec?.checkOut?fmtTime(rec.checkOut):'—'}</td>
      <td>${net>0?fmtHrs(net):'—'}</td><td>${(rec?.notes||lv?.note||'')}</td></tr>`;
    d.setDate(d.getDate()+1);
  }
  w.document.write(`<!DOCTYPE html><html><head><title>Attendance Report</title>
  <style>body{font-family:sans-serif;font-size:12px;padding:20px}table{width:100%;border-collapse:collapse}
  th,td{border:1px solid #ddd;padding:6px 8px;text-align:left}th{background:#f5f5f5;font-weight:600}
  h2{margin-bottom:4px}p{color:#666;font-size:11px;margin:0 0 16px}</style></head><body>
  <h2>Duty Attendance Pro – Report</h2><p>${fmtDate(dkey(from))} to ${fmtDate(dkey(to))}</p>
  <table><thead><tr><th>Date</th><th>Status</th><th>In</th><th>Out</th><th>Hours</th><th>Notes</th></tr></thead>
  <tbody>${rows}</tbody></table></body></html>`);
  w.print();
}
function exportJSON(){
  const data={records:State.records,leaves:State.leaves,notes:State.notes,salaryConfig:State.salaryConfig,exportedAt:new Date().toISOString()};
  downloadBlob(JSON.stringify(data,null,2), 'application/json', `dap_backup_${todayKey()}.json`);
  toast('Backup exported','💾');
}
function downloadBlob(content, type, filename){
  const blob=new Blob([content],{type});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download=filename; a.click();
  URL.revokeObjectURL(url);
}

/* ---- ANALYTICS ---- */
function renderAnalytics(el){
  const now=new Date(); const y=now.getFullYear(), m=now.getMonth();
  el.innerHTML=`<h2 class="view-title">${t('analytics')}</h2>
  <div class="card"><b style="display:block;margin-bottom:14px">Monthly Attendance – ${now.getFullYear()}</b>
    <canvas id="monthChart" class="chart"></canvas></div>
  <div class="card mt-14"><b style="display:block;margin-bottom:14px">Daily Hours – This Month</b>
    <canvas id="hoursChart" class="chart"></canvas></div>
  <div class="card mt-14"><b style="display:block;margin-bottom:14px">Performance Score</b>
    <div id="perfScore"></div></div>`;

  // Monthly attendance bar chart (12 months)
  drawBarChart('monthChart', Array.from({length:12},(_,i)=>new Date(y,i).toLocaleString(undefined,{month:'short'})),
    Array.from({length:12},(_,i)=>attendancePct(y,i)), '%');

  // Daily hours for current month
  const dayLabels=[], dayVals=[];
  for(let d=1;d<=daysInMonth(y,m);d++){
    const key=`${y}-${pad2(m+1)}-${pad2(d)}`;
    dayLabels.push(String(d)); dayVals.push(+calcNetHours(State.records[key]).toFixed(2));
  }
  drawBarChart('hoursChart', dayLabels, dayVals, 'h');
  renderPerfScore(document.getElementById('perfScore'), y, m);
}
function drawBarChart(id, labels, values, unit){
  const canvas=document.getElementById(id); if(!canvas) return;
  const ctx=canvas.getContext('2d');
  const W=canvas.offsetWidth||320; const H=160;
  canvas.width=W*devicePixelRatio; canvas.height=H*devicePixelRatio;
  canvas.style.height=H+'px'; ctx.scale(devicePixelRatio,devicePixelRatio);
  const maxV=Math.max(...values,1);
  const padL=40, padB=28, padT=10, padR=10;
  const plotW=W-padL-padR; const plotH=H-padT-padB;
  const barW=Math.max(3,(plotW/labels.length)*0.6);
  const gap=(plotW/labels.length);
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--brass').trim()||'#C9A24B';
  const dim=getComputedStyle(document.documentElement).getPropertyValue('--fg-dim').trim()||'#9FAAB6';
  ctx.clearRect(0,0,W,H);
  // grid lines
  [0,25,50,75,100].forEach(pct=>{
    const yp=padT+plotH-(plotH*(pct/100));
    ctx.beginPath(); ctx.moveTo(padL,yp); ctx.lineTo(W-padR,yp);
    ctx.strokeStyle='rgba(159,170,182,0.12)'; ctx.lineWidth=1; ctx.stroke();
    ctx.fillStyle=dim; ctx.font=`${10*devicePixelRatio/devicePixelRatio}px Inter,sans-serif`; ctx.textAlign='right';
    ctx.fillText(Math.round(maxV*pct/100)+unit, padL-4, yp+4);
  });
  values.forEach((v,i)=>{
    const x=padL+i*gap+(gap-barW)/2;
    const barH=(v/maxV)*plotH;
    const y=padT+plotH-barH;
    const g=ctx.createLinearGradient(0,y,0,y+barH);
    g.addColorStop(0,accent); g.addColorStop(1,'rgba(201,162,75,0.35)');
    ctx.fillStyle=g;
    ctx.beginPath(); ctx.roundRect(x,y,barW,barH,3); ctx.fill();
    if(labels.length<=14){
      ctx.fillStyle=dim; ctx.textAlign='center'; ctx.font='9px Inter,sans-serif';
      ctx.fillText(labels[i], x+barW/2, H-padB+13);
    } else if(i%5===0){
      ctx.fillStyle=dim; ctx.textAlign='center'; ctx.font='9px Inter,sans-serif';
      ctx.fillText(labels[i], x+barW/2, H-padB+13);
    }
  });
}
function renderPerfScore(el, y, m){
  const pct=attendancePct(y,m);
  const score=Math.min(100, pct);
  const grade=score>=95?'Excellent':score>=85?'Good':score>=70?'Fair':'Needs Improvement';
  const color=score>=95?'var(--green)':score>=85?'var(--accent)':score>=70?'var(--blue)':'var(--rust)';
  el.innerHTML=`<div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap">
    <div style="position:relative;width:80px;height:80px;flex-shrink:0">
      <svg viewBox="0 0 80 80" style="transform:rotate(-90deg)">
        <circle cx="40" cy="40" r="32" fill="none" stroke="var(--surface-2)" stroke-width="10"/>
        <circle cx="40" cy="40" r="32" fill="none" stroke="${color}" stroke-width="10"
          stroke-dasharray="${2*Math.PI*32}" stroke-dashoffset="${2*Math.PI*32*(1-score/100)}"
          stroke-linecap="round" style="transition:stroke-dashoffset 1s ease"/>
      </svg>
      <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);font-size:1.1rem;font-weight:700">${score}%</div>
    </div>
    <div><div style="font-size:1.2rem;font-weight:700;font-family:var(--font-display);color:${color}">${grade}</div>
      <div style="color:var(--fg-dim);font-size:.8rem;margin-top:4px">Attendance rate for ${monthLabel(y,m)}</div>
      <div style="margin-top:8px;font-size:.78rem;color:var(--fg-dim)">
        ${score>=95?'Outstanding commitment. Keep it up!':score>=85?'Good attendance. Aim for 95%+ for full pay.':score>=70?'Moderate attendance. Try to reduce leaves.':'Attendance needs improvement. Please check in regularly.'}</div>
    </div>
  </div>`;
}

/* ---- SETTINGS ---- */
function renderSettings(el){
  const s=State.settings;
  const langs=[['en','English'],['hi','हिन्दी'],['bn','বাংলা'],['ta','தமிழ்'],['te','తెలుగు'],
    ['ml','മലയാളം'],['kn','ಕನ್ನಡ'],['mr','मराठी'],['gu','ગુજરાતી'],['pa','ਪੰਜਾਬੀ']];
  const currencies=['₹','$','€','£','¥','₩','AED','SGD','MYR'];

  el.innerHTML=`<h2 class="view-title">${t('settings')}</h2>

  <div class="card">
    <b style="display:block;margin-bottom:12px">Appearance</b>
    <div class="switch-row">
      <div><div class="lbl">${t('darkMode')}</div><div class="sub">Toggle dark / light theme</div></div>
      <label class="switch"><input type="checkbox" id="swDark" ${s.theme==='dark'?'checked':''}><span class="track"><span class="thumb"></span></span></label>
    </div>
  </div>

  <div class="card mt-14">
    <b style="display:block;margin-bottom:12px">Localisation</b>
    <div class="field"><label>${t('language')}</label>
      <select id="setLang">${langs.map(([v,n])=>`<option value="${v}" ${s.language===v?'selected':''}>${n}</option>`).join('')}</select></div>
    <div class="field"><label>${t('currency')}</label>
      <select id="setCur">${currencies.map(c=>`<option ${s.currency===c?'selected':''}>${c}</option>`).join('')}</select></div>
    <div class="field-row">
      <div class="field"><label>${t('timeFormat')}</label>
        <select id="setTime"><option value="12" ${s.timeFormat==='12'?'selected':''}>12-hour</option><option value="24" ${s.timeFormat==='24'?'selected':''}>24-hour</option></select></div>
      <div class="field"><label>${t('dateFormat')}</label>
        <select id="setDate">
          <option value="DD/MM/YYYY" ${s.dateFormat==='DD/MM/YYYY'?'selected':''}>DD/MM/YYYY</option>
          <option value="MM/DD/YYYY" ${s.dateFormat==='MM/DD/YYYY'?'selected':''}>MM/DD/YYYY</option>
          <option value="YYYY-MM-DD" ${s.dateFormat==='YYYY-MM-DD'?'selected':''}>YYYY-MM-DD</option>
        </select></div>
    </div>
    <button class="btn btn-primary btn-block" id="saveLocale">${t('save')} Preferences</button>
  </div>

  <div class="card mt-14">
    <b style="display:block;margin-bottom:12px">Security</b>
    <div class="switch-row">
      <div><div class="lbl">PIN Lock</div><div class="sub">Require PIN to open app</div></div>
      <label class="switch"><input type="checkbox" id="swPin" ${s.pinEnabled?'checked':''}><span class="track"><span class="thumb"></span></span></label>
    </div>
    <div class="switch-row">
      <div><div class="lbl">Auto Login</div><div class="sub">Stay logged in this session</div></div>
      <label class="switch"><input type="checkbox" id="swAuto" ${s.autoLogin?'checked':''}><span class="track"><span class="thumb"></span></span></label>
    </div>
    <div class="switch-row">
      <div><div class="lbl">Biometric</div><div class="sub">Use fingerprint / face unlock</div></div>
      <label class="switch"><input type="checkbox" id="swBio" ${s.biometric?'checked':''}><span class="track"><span class="thumb"></span></span></label>
    </div>
    <button class="btn btn-outline btn-block mt-8" id="changePinBtn">Change PIN</button>
  </div>

  <div class="card mt-14">
    <b style="display:block;margin-bottom:12px">Data</b>
    <div class="flex gap-8 wrap">
      <button class="btn btn-outline" id="setExport">💾 Export Backup</button>
      <button class="btn btn-outline" id="setImport">📂 Import Backup</button>
      <button class="btn btn-danger" id="setReset">⚠️ ${t('resetData')}</button>
    </div>
    <input type="file" id="importFile" accept=".json" class="hidden">
  </div>

  <div class="card mt-14">
    <b style="display:block;margin-bottom:8px">About</b>
    <p style="font-size:.8rem;color:var(--fg-dim);margin:0;line-height:1.6">
      Duty Attendance Pro · v1.0.0<br>
      Built by Samsad Ansari<br>
      Offline-first PWA · Data stored on this device only
    </p>
  </div>`;

  document.getElementById('swDark').addEventListener('change',async(e)=>{
    State.settings.theme=e.target.checked?'dark':'light';
    applyTheme(); await persistSettings();
  });
  document.getElementById('saveLocale').addEventListener('click', async()=>{
    State.settings.language=document.getElementById('setLang').value;
    State.settings.currency=document.getElementById('setCur').value;
    State.settings.timeFormat=document.getElementById('setTime').value;
    State.settings.dateFormat=document.getElementById('setDate').value;
    await persistSettings(); toast('Preferences saved','✅'); renderView('settings');
  });
  ['swPin','swAuto','swBio'].forEach((id,i)=>{
    const keys=['pinEnabled','autoLogin','biometric'];
    document.getElementById(id).addEventListener('change', async(e)=>{
      State.settings[keys[i]]=e.target.checked;
      await persistSettings();
    });
  });
  document.getElementById('changePinBtn').addEventListener('click', ()=>{
    State.settings.pin=null; State.settings.pinEnabled=true; persistSettings(); showLock();
  });
  document.getElementById('setExport').addEventListener('click', ()=>exportJSON());
  document.getElementById('setImport').addEventListener('click', ()=>document.getElementById('importFile').click());
  document.getElementById('importFile').addEventListener('change', async(e)=>{
    const file=e.target.files[0]; if(!file) return;
    try{
      const text=await file.text();
      const data=JSON.parse(text);
      if(data.records) Object.assign(State.records, data.records);
      if(data.leaves) State.leaves=[...State.leaves,...data.leaves.filter(l=>!State.leaves.find(x=>x.id===l.id))];
      if(data.salaryConfig) Object.assign(State.salaryConfig, data.salaryConfig);
      await persistSalaryConfig(); mirrorToLocalStorage();
      toast('Backup imported','📂'); renderView('settings');
    }catch(err){ toast('Import failed: invalid file','⚠️'); }
  });
  document.getElementById('setReset').addEventListener('click', async()=>{
    if(!confirm('Reset ALL data? This cannot be undone.')) return;
    await Promise.all(STORES.map(s=>idbClear(s)));
    State.records={}; State.leaves=[]; State.notes=[];
    State.settings={...DEFAULT_SETTINGS}; State.salaryConfig={...DEFAULT_SALARY};
    try{ localStorage.removeItem(LS_KEY); }catch(e){}
    toast('All data reset','🔄'); renderView('settings');
  });
}

/* ---- SEARCH ---- */
function openSearch(){
  openModal(`<div class="modal-head"><h3>🔎 Global Search</h3><button class="icon-btn" id="srClose">✕</button></div>
  <div class="search-box" style="margin-bottom:0"><span class="ic">🔎</span><input type="text" placeholder="Date, note, shift, leave type…" id="srQ" autofocus></div>
  <div id="srResults" style="margin-top:14px"></div>`,
  ()=>{
    document.getElementById('srClose').onclick=closeModal;
    const q=document.getElementById('srQ'), res=document.getElementById('srResults');
    q.addEventListener('input',()=>{ const v=q.value.toLowerCase(); if(!v){res.innerHTML='';return;} doSearch(v,res); });
  });
}
function doSearch(q, el){
  const hits=[];
  Object.entries(State.records).forEach(([k,r])=>{
    if(k.includes(q)||(r.notes||'').toLowerCase().includes(q)||(r.shift||'').toLowerCase().includes(q)||(r.status||'').includes(q))
      hits.push({type:'record', key:k, label:fmtDate(k), sub:`${r.status||''} ${r.notes||''}`.trim(), icon:'📋'});
  });
  State.leaves.forEach(lv=>{
    if(lv.date.includes(q)||lv.type.toLowerCase().includes(q)||(lv.note||'').toLowerCase().includes(q))
      hits.push({type:'leave', key:lv.date, label:fmtDate(lv.date), sub:lv.type, icon:'🌴'});
  });
  if(!hits.length){ el.innerHTML=`<div class="empty" style="padding:16px 0"><div class="ic">🔎</div><div class="t">No results</div></div>`; return; }
  el.innerHTML=hits.slice(0,20).map(h=>`<div class="list-row" style="cursor:pointer" data-key="${h.key}" data-type="${h.type}">
    <div class="ic-box">${h.icon}</div>
    <div class="body"><div class="ttl">${h.label}</div><div class="sub">${h.sub}</div></div>
  </div>`).join('');
  el.querySelectorAll('.list-row').forEach(row=>{
    row.addEventListener('click', ()=>{
      closeModal();
      if(row.dataset.type==='record') openEditRecord(row.dataset.key);
      else { navigateTo('leave'); }
    });
  });
}

/* ---- MODAL ---- */
function openModal(html, setup){
  const body=document.getElementById('modalBody');
  body.innerHTML=html;
  document.getElementById('modalBg').classList.add('show');
  if(setup) setTimeout(setup, 0);
  document.getElementById('modalBg').addEventListener('click', function handler(e){ if(e.target===this){ closeModal(); this.removeEventListener('click',handler); }});
}
function closeModal(){ document.getElementById('modalBg').classList.remove('show'); }

/* ---- THEME ---- */
function applyTheme(){
  document.documentElement.setAttribute('data-theme', State.settings.theme);
  const btn=document.getElementById('themeBtn');
  if(btn) btn.textContent=State.settings.theme==='dark'?'🌙':'☀️';
}
document.getElementById('themeBtn').addEventListener('click', async()=>{
  State.settings.theme=State.settings.theme==='dark'?'light':'dark';
  applyTheme(); await persistSettings();
});

/* ---- FAB / INSTALL ---- */
document.getElementById('fab').addEventListener('click', ()=>{
  if(State.view==='attendance'||State.view==='dashboard') openManualEntry(); else navigateTo('attendance');
});

window.addEventListener('beforeinstallprompt', (e)=>{
  e.preventDefault(); State.deferredInstallPrompt=e;
  document.getElementById('installBtn').classList.remove('hidden');
});
document.getElementById('installBtn').addEventListener('click', async()=>{
  if(!State.deferredInstallPrompt) return;
  State.deferredInstallPrompt.prompt();
  const result=await State.deferredInstallPrompt.userChoice;
  if(result.outcome==='accepted') document.getElementById('installBtn').classList.add('hidden');
  State.deferredInstallPrompt=null;
});
window.addEventListener('appinstalled', ()=>{ document.getElementById('installBtn').classList.add('hidden'); toast('App installed!','📱'); });

document.getElementById('searchBtn').addEventListener('click', ()=>openSearch());

/* ---- SERVICE WORKER ---- */
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('./service-worker.js').then(reg=>{
    reg.addEventListener('updatefound', ()=>{
      const nw=reg.installing;
      nw.addEventListener('statechange', ()=>{
        if(nw.state==='installed'&&navigator.serviceWorker.controller){
          toast('Update ready – reload to apply','⬆️');
          nw.postMessage('SKIP_WAITING');
        }
      });
    });
  }).catch(()=>{});
}

/* ---- KEYBOARD SHORTCUTS ---- */
window.addEventListener('keydown',(e)=>{
  if(State.locked) return;
  if(e.key==='/' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){ e.preventDefault(); openSearch(); }
  if(e.key==='Escape') closeModal();
  if(e.altKey){
    const map={d:'dashboard',a:'attendance',c:'calendar',s:'salary',l:'leave',r:'reports',n:'analytics',x:'settings'};
    if(map[e.key]) navigateTo(map[e.key]);
  }
});

/* ---- URL PARAMS (shortcuts / share target) ---- */
function handleUrlParams(){
  const params=new URLSearchParams(location.search);
  const view=params.get('view'); const action=params.get('action');
  if(view && NAV_ITEMS.find(n=>n.id===view)) State.view=view;
  if(action==='checkin') setTimeout(()=>doCheckIn(todayKey()),400);
  if(action==='checkout') setTimeout(()=>doCheckOut(todayKey()),400);
}

/* ---- BOOT ---- */
// ---------- Splash dismiss (always runs, even on error) ----------
function dismissSplash(){
  const splash = document.getElementById('splash');
  if(!splash || splash.classList.contains('hide')) return;
  splash.classList.add('hide');
  setTimeout(()=>{
    splash.classList.add('gone');
    document.getElementById('app').classList.add('ready');
  }, 650);
}

// Safety net: ALWAYS dismiss after 4s no matter what
const SPLASH_SAFETY = setTimeout(dismissSplash, 4000);

async function boot(){
  // Set up 2.5s normal dismiss timer immediately (before any async work)
  const splashTimer = setTimeout(dismissSplash, 2500);

  try {
    await loadAllData();
  } catch(e) {
    console.warn('loadAllData error (continuing):', e);
  }

  applyTheme();
  handleUrlParams();

  const alreadyUnlocked = sessionStorage.getItem('dap_unlocked')==='1';
  const needsPin = State.settings.pinEnabled && State.settings.pin;

  try {
    buildNav();
    renderView(State.view);
  } catch(e) {
    console.warn('renderView error:', e);
    document.getElementById('view').innerHTML = '<div class="empty"><div class="ic">⚠️</div><div class="t">Something went wrong</div><div class="s">'+e.message+'</div></div>';
  }

  // Override splash timer to also handle PIN after dismiss
  clearTimeout(splashTimer);
  clearTimeout(SPLASH_SAFETY);

  function dismissAndUnlock(){
    const splash = document.getElementById('splash');
    if(!splash || splash.classList.contains('hide')){ afterSplash(); return; }
    splash.classList.add('hide');
    setTimeout(()=>{
      splash.classList.add('gone');
      document.getElementById('app').classList.add('ready');
      afterSplash();
    }, 650);
  }

  function afterSplash(){
    if(needsPin && !alreadyUnlocked){
      showLock();
    } else {
      State.locked = false;
    }
  }

  setTimeout(dismissAndUnlock, 2500);
}

boot().catch((e)=>{
  console.error('Boot failed:', e);
  dismissSplash(); // always show app even on fatal error
});
