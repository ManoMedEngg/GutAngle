// Main application script
document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // 1. VIEW SWITCHING LOGIC
    // ============================================
    const viewLanding = document.getElementById('view-landing');
    const viewLogin = document.getElementById('view-login');
    const viewDashboard = document.getElementById('view-dashboard');
    const getStartedBtns = document.querySelectorAll('#enter-dashboard, #view-demo');
    const backToLandingBtn = document.getElementById('back-to-landing-btn');

    // Function to show a specific view
    function showView(viewName) {
        // Hide all views
        [viewLanding, viewLogin, viewDashboard].forEach(view => {
            if (view) view.style.display = 'none';
        });
        
        // Show the requested view
        switch(viewName) {
            case 'landing':
                if (viewLanding) {
                    viewLanding.style.display = 'block';
                    viewLanding.style.opacity = '1';
                }
                break;
            case 'login':
                if (viewLogin) {
                    viewLogin.style.display = 'block';
                    // Initialize canvas effects
                    window.dispatchEvent(new Event('resize'));
                }
                break;
            case 'dashboard':
                if (viewDashboard) {
                    viewDashboard.style.display = 'block';
                    // Initialize dashboard
                    if (typeof initDashboard === 'function') {
                        setTimeout(initDashboard, 100);
                    }
                }
                break;
        }
    }

    // Event listeners for navigation
    if (getStartedBtns) {
        getStartedBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                showView('login');
            });
        });
    }

    if (backToLandingBtn) {
        backToLandingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showView('landing');
        });
    }

    // ============================================
    // 2. TRANSLATION DATA
    // ============================================
    const translations = {
        en: {
            heading: "Intelligent EEG/Lumbar Monitoring & Visualization Dashboard",
            tagline: "Clinical-grade neurophysiology platform for real-time monitoring and data analysis",
            projectTitle: "GUTANGLE: Neurophysiology Monitoring Platform",
            descHeading: "Project Overview",
            description: [
                { title: "Integrated Health Solution", content: "GutAngle is a smart monitoring system designed for comprehensive neurophysiological tracking." },
                { title: "Hardware Implementation", content: "Combines EEG sensors with lumbar position tracking for complete physiological assessment." },
                { title: "Innovative Integration", content: "Unique integration of brain activity and spinal alignment monitoring within a single platform." }
            ],
            readAloud: "Read Aloud",
            readMore: "Read More",
            readLess: "Read Less",
            login: {
                backBtn: "Back to Home",
                heroBadge: "CONTINUOUS EEG & LUMBAR MONITORING",
                heroTitleSub: "REAL‑TIME EEG & LUMBAR",
                heroCopy: "Simultaneously capture EEG signals and lumbar posture metrics. Visualize brain activity alongside spinal alignment in real time, tracking the link between neurological and musculoskeletal health.",
                metric1: "8-30 Hz EEG frequency bands",
                metric2: "Multi‑channel EEG leads",
                metric3: "Lumbar angle tracking",
                recordingStatus: "Recording status",
                tabSignup: "Sign up",
                tabSignin: "Sign in",
                authTitleSignUp: "Create GUTANGLE workspace",
                authTitleSignIn: "Welcome Back",
                authCaptionSignUp: "Start by creating an account for your neurophysiology lab or clinical team.",
                authCaptionSignIn: "Enter your credentials to access the dashboard.",
                authFree: "Sign up is free.",
                labelName: "Full name",
                labelMobile: "Mobile number",
                labelEmail: "Email ID",
                labelAge: "Age",
                labelPass: "Password",
                labelSecurity: "Security check",
                btnRefresh: "Refresh",
                btnCreateAccount: "Create monitoring account",
                btnSigninDashboard: "Sign in to GUTANGLE dashboard",
                footerAlready: "Already have an account?",
                linkSignin: "Sign in",
                linkSignup: "Sign up",
                dividerOr: "or continue with",
                errorCaptcha: "Captcha does not match.",
                placeName: "Dr. John Smith",
                placeMobile: "+91 9876543210",
                placeEmail: "clinical.research@gmail.com",
                placePass: "Password",
                placePassEnter: "Enter your password",
                placeCaptcha: "Type the code above"
            }
        },
        ta: {
            heading: "மூளை செயல்பாடு மற்றும் முதுகெலும்பு நிலை கண்காணிப்பு டாஷ்போர்டு",
            tagline: "நிகழ்நேர கண்காணிப்பு மற்றும் தரவு பகுப்பாய்வுக்கான மருத்துவ தர நரம்பியல் தளம்",
            login: {
                backBtn: "முகப்புக்குத் திரும்புக",
                heroBadge: "தொடர்ச்சியான EEG மற்றும் முதுகெலும்பு கண்காணிப்பு",
                heroTitleSub: "நிகழ்நேர EEG மற்றும் முதுகெலும்பு",
                heroCopy: "EEG சிக்னல்கள் மற்றும் முதுகெலும்பு நிலையை ஒரே நேரத்தில் பதிவு செய்யவும். மூளை செயல்பாடு மற்றும் முதுகெலும்பு சீரமைப்பை நிகழ்நேரத்தில் காண்க.",
                metric1: "8-30 Hz EEG அலைக்கற்றை",
                metric2: "பல சேனல் EEG லீட்ஸ்",
                metric3: "முதுகெலும்பு கோண கண்காணிப்பு",
                recordingStatus: "பதிவு நிலை",
                tabSignup: "பதிவு செய்க",
                tabSignin: "உள்நுழைக",
                authTitleSignUp: "GUTANGLE பணியிடத்தை உருவாக்கவும்",
                authTitleSignIn: "மீண்டும் வருக",
                authCaptionSignUp: "உங்கள் நரம்பியல் ஆய்வகத்திற்கு கணக்கை உருவாக்குவதன் மூலம் தொடங்கவும்.",
                authCaptionSignIn: "டாஷ்போர்டை அணுக உங்கள் விவரங்களை உள்ளிடவும்.",
                authFree: "பதிவு முற்றிலும் இலவசம்.",
                labelName: "முழு பெயர்",
                labelMobile: "மொபைல் எண்",
                labelEmail: "மின்னஞ்சல் ஐடி",
                labelAge: "வயது",
                labelPass: "கடவுச்சொல்",
                labelSecurity: "பாதுகாப்பு சோதனை",
                btnRefresh: "புதுப்பி",
                btnCreateAccount: "கண்காணிப்பு கணக்கை உருவாக்கவும்",
                btnSigninDashboard: "GUTANGLE டாஷ்போர்டில் உள்நுழைக",
                footerAlready: "ஏற்கனவே கணக்கு உள்ளதா?",
                linkSignin: "உள்நுழைக",
                linkSignup: "பதிவு செய்க",
                dividerOr: "அல்லது தொடரவும்",
                errorCaptcha: "கேப்ட்சா பொருந்தவில்லை.",
                placeName: "டாக்டர். ராமன்",
                placeMobile: "+91 9876543210",
                placeEmail: "clinical.research@gmail.com",
                placePass: "கடவுச்சொல்",
                placePassEnter: "உங்கள் கடவுச்சொல்லை உள்ளிடவும்",
                placeCaptcha: "மேலே உள்ள குறியீட்டை உள்ளிடவும்"
            }
        },
        ml: {
            heading: "മസ്തിഷ്ക പ്രവർത്തനവും നട്ടെല്ല് സ്ഥിതിയും നിരീക്ഷിക്കുന്ന ഡാഷ്ബോർഡ്",
            tagline: "റിയൽ-ടൈം നിരീക്ഷണത്തിനും ഡാറ്റ വിശകലനത്തിനുമുള്ള മെഡിക്കൽ ഗ്രേഡ് ന്യൂറോഫിസിയോളജി പ്ലാറ്റ്ഫോം",
            login: {
                backBtn: "ഹോമിലേക്ക് മടങ്ങുക",
                heroBadge: "തുടർച്ചയായ EEG & നട്ടെല്ല് നിരീക്ഷണം",
                heroTitleSub: "റിയൽ-ടൈം EEG & നട്ടെല്ല്",
                heroCopy: "EEG സിഗ്നലുകളും നട്ടെല്ല് സ്ഥിതിയും ഒരേസമയം റെക്കോർഡ് ചെയ്യുക. മസ്തിഷ്ക പ്രവർത്തനവും നട്ടെല്ല് ക്രമീകരണവും റിയൽ-ടൈമിൽ കാണുക.",
                metric1: "8-30 Hz EEG ഫ്രീക്വൻസി ബാൻഡുകൾ",
                metric2: "മൾട്ടി-ചാനൽ EEG ലീഡുകൾ",
                metric3: "നട്ടെല്ല് കോൺ നിരീക്ഷണം",
                recordingStatus: "റെക്കോർഡിംഗ് സ്ഥിതി",
                tabSignup: "രജിസ്റ്റർ ചെയ്യുക",
                tabSignin: "ലോഗിൻ ചെയ്യുക",
                authTitleSignUp: "GUTANGLE വർക്ക്‌സ്പേസ് സൃഷ്‌ടിക്കുക",
                authTitleSignIn: "സ്വാഗതം",
                authCaptionSignUp: "നിങ്ങളുടെ ന്യൂറോഫിസിയോളജി ലാബിനായി ഒരു അക്കൗണ്ട് സൃഷ്ടിച്ചുകൊണ്ട് ആരംഭിക്കുക.",
                authCaptionSignIn: "ഡാഷ്‌ബോർഡ് ആക്‌സസ് ചെയ്യാൻ നിങ്ങളുടെ ക്രെഡൻഷ്യലുകൾ നൽകുക.",
                authFree: "രജിസ്ട്രേഷൻ സൗജന്യമാണ്.",
                labelName: "പൂർണ്ണ നാമം",
                labelMobile: "മൊബൈൽ നമ്പർ",
                labelEmail: "ഇമെയിൽ ഐഡി",
                labelAge: "വയസ്സ്",
                labelPass: "പാസ്‌വേഡ്",
                labelSecurity: "സുരക്ഷാ പരിശോധന",
                btnRefresh: "പുതുക്കുക",
                btnCreateAccount: "നിരീക്ഷണ അക്കൗണ്ട് സൃഷ്ടിക്കുക",
                btnSigninDashboard: "GUTANGLE ഡാഷ്‌ബോർഡിലേക്ക് ലോഗിൻ ചെയ്യുക",
                footerAlready: "ഇതിനകം ഒരു അക്കൗണ്ട് ഉണ്ടോ?",
                linkSignin: "ലോഗിൻ ചെയ്യുക",
                linkSignup: "രജിസ്റ്റർ ചെയ്യുക",
                dividerOr: "അല്ലെങ്കിൽ തുടരുക",
                errorCaptcha: "കാപ്ച്ച പൊരുത്തപ്പെടുന്നില്ല.",
                placeName: "ഡോ. മോഹൻ",
                placeMobile: "+91 9876543210",
                placeEmail: "clinical.research@gmail.com",
                placePass: "പാസ്‌വേഡ്",
                placePassEnter: "നിങ്ങളുടെ പാസ്‌വേഡ് നൽകുക",
                placeCaptcha: "മുകളിലുള്ള കോഡ് ടൈപ്പ് ചെയ്യുക"
            }
        },
        ur: {
            heading: "دماغی سرگرمی اور ریڑھ کی ہڈی کی پوزیشن کی نگرانی کا ڈیش بورڈ",
            tagline: "ریئل ٹائم مانیٹرنگ اور ڈیٹا تجزیہ کے لیے طبی معیار کا نیورو فزیالوجی پلیٹ فارم",
            login: {
                backBtn: "ہوم پر واپس جائیں",
                heroBadge: "مسلسل EEG اور ریڑھ کی ہڈی کی نگرانی",
                heroTitleSub: "ریئل ٹائم EEG اور ریڑھ کی ہڈی",
                heroCopy: "EEG سگنلز اور ریڑھ کی ہڈی کی پوزیشن کو بیک وقت ریکارڈ کریں۔ دماغی سرگرمی اور ریڑھ کی ہڈی کی ترتیب کو ریئل ٹائم میں دیکھیں۔",
                metric1: "8-30 Hz EEG فریکوئنسی بینڈز",
                metric2: "ملٹی چینل EEG لیڈز",
                metric3: "ریڑھ کی ہڈی کے زاویے کی نگرانی",
                recordingStatus: "ریکارڈنگ کی حیثیت",
                tabSignup: "سائن اپ",
                tabSignin: "سائن ان",
                authTitleSignUp: "GUTANGLE کام کی جگہ بنائیں",
                authTitleSignIn: "خوش آمدید",
                authCaptionSignUp: "اپنی نیورو فزیالوجی لیب کے لیے اکاؤنٹ بنانا شروع کریں۔",
                authCaptionSignIn: "ڈیش بورڈ تک رسائی کے لیے اپنے اسناد درج کریں۔",
                authFree: "سائن اپ مفت ہے۔",
                labelName: "پورا نام",
                labelMobile: "موبائل نمبر",
                labelEmail: "ای میل ID",
                labelAge: "عمر",
                labelPass: "پاس ورڈ",
                labelSecurity: "سیکیورٹی چیک",
                btnRefresh: "تازہ کریں",
                btnCreateAccount: "مانیٹرنگ اکاؤنٹ بنائیں",
                btnSigninDashboard: "GUTANGLE ڈیش بورڈ میں سائن ان کریں",
                footerAlready: "پہلے سے اکاؤنٹ ہے؟",
                linkSignin: "سائن ان",
                linkSignup: "سائن اپ",
                dividerOr: "یا جاری رکھیں",
                errorCaptcha: "کیپچا مماثل نہیں ہے۔",
                placeName: "ڈاکٹر احمد",
                placeMobile: "+91 9876543210",
                placeEmail: "clinical.research@gmail.com",
                placePass: "پاس ورڈ",
                placePassEnter: "اپنا پاس ورڈ درج کریں",
                placeCaptcha: "اوپر والا کوڈ ٹائپ کریں"
            }
        },
        hi: {
            heading: "मस्तिष्क गतिविधि और रीढ़ की स्थिति निगरानी डैशबोर्ड",
            tagline: "रियल-टाइम निगरानी और डेटा विश्लेषण के लिए मेडिकल ग्रेड न्यूरोफिजियोलॉजी प्लेटफॉर्म",
            login: {
                backBtn: "होम पर वापस जाएं",
                heroBadge: "निरंतर EEG और रीढ़ की निगरानी",
                heroTitleSub: "रियल-टाइम EEG और रीढ़",
                heroCopy: "EEG संकेतों और रीढ़ की स्थिति को एक साथ रिकॉर्ड करें। मस्तिष्क गतिविधि और रीढ़ की संरेखण को रियल-टाइम में देखें।",
                metric1: "8-30 Hz EEG आवृत्ति बैंड",
                metric2: "मल्टी-चैनल EEG लीड",
                metric3: "रीढ़ के कोण की निगरानी",
                recordingStatus: "रिकॉर्डिंग स्थिति",
                tabSignup: "साइन अप",
                tabSignin: "साइन इन",
                authTitleSignUp: "GUTANGLE वर्कस्पेस बनाएं",
                authTitleSignIn: "वापसी पर स्वागत है",
                authCaptionSignUp: "अपनी न्यूरोफिजियोलॉजी लैब के लिए खाता बनाना शुरू करें।",
                authCaptionSignIn: "डैशबोर्ड एक्सेस करने के लिए अपनी क्रेडेंशियल दर्ज करें।",
                authFree: "साइन अप मुफ्त है।",
                labelName: "पूरा नाम",
                labelMobile: "मोबाइल नंबर",
                labelEmail: "ईमेल आईडी",
                labelAge: "आयु",
                labelPass: "पासवर्ड",
                labelSecurity: "सुरक्षा जांच",
                btnRefresh: "ताज़ा करें",
                btnCreateAccount: "निगरानी खाता बनाएं",
                btnSigninDashboard: "GUTANGLE डैशबोर्ड में साइन इन करें",
                footerAlready: "पहले से ही एक खाता है?",
                linkSignin: "साइन इन",
                linkSignup: "साइन अप",
                dividerOr: "या जारी रखें",
                errorCaptcha: "कैप्चा मेल नहीं खाता।",
                placeName: "डॉ. शर्मा",
                placeMobile: "+91 9876543210",
                placeEmail: "clinical.research@gmail.com",
                placePass: "पासवर्ड",
                placePassEnter: "अपना पासवर्ड दर्ज करें",
                placeCaptcha: "ऊपर दिया गया कोड टाइप करें"
            }
        }
    };

    // ============================================
    // 3. LANGUAGE SWITCHING LOGIC
    // ============================================
    const languageSelect = document.getElementById('language-select');
    let currentLanguage = 'en';

    function updateLanguage(lang) {
        currentLanguage = lang;
        const t = translations[lang] || translations['en'];

        // Update Landing Page
        if (document.getElementById('main-heading')) {
            document.getElementById('main-heading').textContent = t.heading;
        }
        if (document.getElementById('tagline')) {
            document.getElementById('tagline').textContent = t.tagline;
        }
        
        // Update Login Page
        const loginT = t.login;
        if (loginT) {
            document.querySelectorAll('#view-login [data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (loginT[key]) el.textContent = loginT[key];
            });
            document.querySelectorAll('#view-login [data-i18n-placeholder]').forEach(el => {
                const key = el.getAttribute('data-i18n-placeholder');
                if (loginT[key]) el.placeholder = loginT[key];
            });
        }
    }

    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            updateLanguage(e.target.value);
        });
    }

    // Initialize Language
    updateLanguage('en');

    // ============================================
    // 4. VISUAL EFFECTS (LIGHT RAYS & FUZZY)
    // ============================================
    const canvas = document.getElementById('lightRaysCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }
        window.addEventListener('resize', resize);
        resize();

        const rays = [];
        for (let i = 0; i < 80; i++) {
            rays.push({
                angle: (Math.PI / 2) + (Math.random() - 0.5),
                length: height * (1 + Math.random()),
                speed: 0.5 + Math.random(),
                width: 1 + Math.random() * 3,
                x: width / 2
            });
        }

        function loop() {
            const viewLogin = document.getElementById('view-login');
            
            if (viewLogin && viewLogin.style.display !== 'none') {
                ctx.clearRect(0, 0, width, height);
                
                // Background gradient
                const grad = ctx.createRadialGradient(width/2, 0, 0, width/2, height, height);
                grad.addColorStop(0, 'rgba(0, 40, 20, 0.3)');
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, width, height);

                ctx.globalCompositeOperation = 'screen';
                const time = Date.now() * 0.001;

                rays.forEach(ray => {
                    const x = width/2 + Math.sin(time * ray.speed + ray.length) * 200;
                    ctx.beginPath();
                    
                    // Green rays
                    ctx.strokeStyle = `rgba(0, 255, 120, ${Math.random() * 0.2})`;
                    
                    ctx.lineWidth = ray.width;
                    ctx.moveTo(width/2, -50);
                    ctx.lineTo(x + (Math.random()-0.5)*100, height);
                    ctx.stroke();
                });
                ctx.globalCompositeOperation = 'source-over';
            }
            requestAnimationFrame(loop);
        }
        loop();
    }

    const fuzzyCanvas = document.getElementById('fuzzyCanvas');
    if (fuzzyCanvas) {
        const ctxF = fuzzyCanvas.getContext('2d');
        fuzzyCanvas.width = 150;
        fuzzyCanvas.height = 40;
        
        function fuzzyLoop() {
            const viewLogin = document.getElementById('view-login');
            if (viewLogin && viewLogin.style.display !== 'none') {
                ctxF.clearRect(0, 0, 150, 40);
                ctxF.font = "bold 20px sans-serif";
                ctxF.fillStyle = "#ef4444";
                const dx = (Math.random()-0.5) * 1;
                ctxF.fillText("LIVE EEG", 10 + dx, 25);
            }
            requestAnimationFrame(fuzzyLoop);
        }
        fuzzyLoop();
    }

    // ============================================
    // 5. AUTH TAB SWITCHING
    // ============================================
    const tabSignup = document.getElementById('tabSignup');
    const tabSignin = document.getElementById('tabSignin');
    const tabPill = document.getElementById('tabPill');
    const signupForm = document.getElementById('signupForm');
    const signinForm = document.getElementById('signinForm');
    const authTitle = document.getElementById('authTitle');
    const authCaption = document.getElementById('authCaption');
    const toSigninLink = document.getElementById('toSigninLink');
    
    function setAuthMode(mode) {
        const t = translations[currentLanguage] || translations['en'];
        const loginT = t.login;

        if (mode === 'signup') {
            tabPill.setAttribute('data-mode', 'signup');
            tabSignup.setAttribute('data-active', 'true');
            tabSignin.setAttribute('data-active', 'false');
            signupForm.setAttribute('data-active', 'true');
            signinForm.setAttribute('data-active', 'false');
            
            if (loginT) {
                authTitle.textContent = loginT.authTitleSignUp;
                authCaption.innerHTML = `<span data-i18n="authCaptionSignUp">${loginT.authCaptionSignUp}</span> <span style="display:block; font-weight:bold; color:#fff;" data-i18n="authFree">${loginT.authFree}</span>`;
            }
        } else {
            tabPill.setAttribute('data-mode', 'signin');
            tabSignup.setAttribute('data-active', 'false');
            tabSignin.setAttribute('data-active', 'true');
            signupForm.setAttribute('data-active', 'false');
            signinForm.setAttribute('data-active', 'true');
            
            if (loginT) {
                authTitle.textContent = loginT.authTitleSignIn;
                authCaption.innerHTML = `<span data-i18n="authCaptionSignIn">${loginT.authCaptionSignIn}</span>`;
            }
        }
    }

    if (tabSignup && tabSignin) {
        tabSignup.addEventListener('click', () => setAuthMode('signup'));
        tabSignin.addEventListener('click', () => setAuthMode('signin'));
        if (toSigninLink) {
            toSigninLink.addEventListener('click', () => setAuthMode('signin'));
        }
    }

    // ============================================
    // 6. CAPTCHA LOGIC
    // ============================================
    function setupCaptcha(type) {
        const textEl = document.getElementById(`captchaText${type}`);
        const refreshBtn = document.getElementById(`captchaRefresh${type}`);
        const inputEl = document.getElementById(`captchaInput${type}`);
        const errorEl = document.getElementById(`signinError${type}`);
        const formEl = document.getElementById(`${type.toLowerCase()}Form`);

        let currentCaptcha = "";

        const generate = () => {
            const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
            let res = "";
            for (let i = 0; i < 5; i++) {
                res += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            currentCaptcha = res;
            if (textEl) textEl.textContent = res;
            if (inputEl) inputEl.value = "";
            if (errorEl) errorEl.style.display = 'none';
        };

        generate();

        if (refreshBtn) refreshBtn.addEventListener('click', generate);

        if (formEl) {
            formEl.addEventListener('submit', (e) => {
                e.preventDefault();
                if (inputEl.value.toUpperCase() === currentCaptcha) {
                    // Form validation passed
                    if (type === 'Signup') {
                        handleSignup();
                    } else {
                        handleSignin();
                    }
                } else {
                    if (errorEl) errorEl.style.display = 'block';
                    generate();
                }
            });
        }
    }

    // Initialize captcha for both forms
    setupCaptcha('Signup');
    setupCaptcha('Signin');

    // ============================================
    // 7. FORM HANDLING
    // ============================================
    async function handleSignup() {
        const name = document.getElementById('signup-name').value;
        const mobile = document.getElementById('signup-mobile').value;
        const email = document.getElementById('signup-email').value;
        const age = document.getElementById('signup-age').value;
        const password = document.getElementById('signup-password').value;

        try {
            // Store in localStorage (temporary solution)
            const userData = {
                name,
                mobile,
                email,
                age,
                password,
                created_at: new Date().toISOString(),
                preferences: {
                    language: 'en',
                    theme: 'dark',
                    alert_methods: ['sms', 'whatsapp', 'email'],
                    accessibility: {}
                }
            };
            
            localStorage.setItem('currentUser', JSON.stringify(userData));
            
            // Show success message
            alert('Account created successfully! You can now sign in.');
            setAuthMode('signin');
            
        } catch (error) {
            alert('Registration failed: ' + error.message);
        }
    }

    async function handleSignin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            // Check localStorage for user (temporary solution)
            const storedUser = localStorage.getItem('currentUser');
            
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                if (userData.email === email && userData.password === password) {
                    // Login successful
                    localStorage.setItem('isAuthenticated', 'true');
                    localStorage.setItem('userEmail', email);
                    
                    // Show dashboard
                    showView('dashboard');
                } else {
                    alert('Invalid credentials. Please try again.');
                }
            } else {
                // For demo purposes, allow any login
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userEmail', email);
                showView('dashboard');
            }
            
        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    }

    // ============================================
    // 8. SOCIAL LOGIN HANDLERS
    // ============================================
    const googleLoginBtn = document.getElementById('googleLogin');
    const githubLoginBtn = document.getElementById('githubLogin');

    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', () => {
            alert('Google login would be implemented in production. For demo, you can use the sign in form.');
        });
    }

    if (githubLoginBtn) {
        githubLoginBtn.addEventListener('click', () => {
            alert('GitHub login would be implemented in production. For demo, you can use the sign in form.');
        });
    }

    // ============================================
    // 9. INITIALIZE APP
    // ============================================
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
        showView('dashboard');
    } else {
        showView('landing');
    }
});

// Global showView function
function showView(viewName) {
    // Implementation handled in DOMContentLoaded
}
