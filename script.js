document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // 1. VIEW SWITCHING LOGIC
    // ============================================
    const viewLanding = document.getElementById('view-landing');
    const viewLogin = document.getElementById('view-login');
    const getStartedBtns = document.querySelectorAll('#get-started-btn, #get-started-hero-btn');
    const backToLandingBtn = document.getElementById('back-to-landing-btn');

    function showLogin() {
        if(viewLanding) viewLanding.style.opacity = '0';
        setTimeout(() => {
            if(viewLanding) viewLanding.style.display = 'none';
            if(viewLogin) viewLogin.style.display = 'block';
            window.dispatchEvent(new Event('resize'));
        }, 300);
    }

    function showLanding() {
        if(viewLogin) viewLogin.style.display = 'none';
        if(viewLanding) viewLanding.style.display = 'block';
        setTimeout(() => {
            if(viewLanding) viewLanding.style.opacity = '1';
        }, 50);
    }

    getStartedBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showLogin();
        });
    });

    if(backToLandingBtn) backToLandingBtn.addEventListener('click', showLanding);


    // ============================================
    // 2. TRANSLATION DATA
    // ============================================
    const translations = {
        en: {
            heading: "Your Spine, Your Gut, Now Connected.",
            tagline: "The Integrated Smart Belt: Real-time monitoring for posture and digestive health.",
            projectTitle: "GUTANGLE: The Integrated Health Companion",
            descHeading: "Project Overview",
            description: [
                { title: "Integrated Health Solution", content: "GutAngle is a smart belt designed as an integrated health companion for people who spend long hours sitting or standing." },
                { title: "Hardware Implementation", content: "Combines an IMU module for posture with flexible surface electrodes that record Electrogastrography (EGG) signals." },
                { title: "Innovative Integration", content: "Unique integration of posture correction and real-time gut health assessment within a single comfortable wearable belt." }
            ],
            readAloud: "Read Aloud",
            readMore: "Read More",
            readLess: "Read Less",
            login: {
                backBtn: "Back",
                heroBadge: "CONTINUOUS EGG & LUMBAR MONITORING",
                heroTitleSub: "REAL‑TIME EGG & LUMBAR",
                heroCopy: "Simultaneously capture electrogastrography (EGG) signals and lumbar posture metrics. Visualize gastric slow waves alongside spinal alignment in real time, tracking the link between digestive motility and back health.",
                metric1: "0.05–0.15 Hz gastric rhythm",
                metric2: "Multi‑channel abdominal leads",
                metric3: "Hypo/Hyper‑ motility flags",
                recordingStatus: "Recording status",
                tabSignup: "Sign up",
                tabSignin: "Sign in",
                authTitleSignUp: "Create GUTANGLE workspace",
                authTitleSignIn: "Welcome Back",
                authCaptionSignUp: "Start by creating an account for your GI lab or research team.",
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
                placeName: "Ms. Sweety",
                placeMobile: "+91 8940423363",
                placeEmail: "biomedical@gmail.com",
                placePass: "Password",
                placePassEnter: "Enter your password",
                placeCaptcha: "Type the code above"
            }
        },
        ta: {
            heading: "உங்கள் முதுகுத்தண்டு, உங்கள் குடல், இப்போது இணைக்கப்பட்டுள்ளது.",
            tagline: "ஒருங்கிணைந்த ஸ்மார்ட் பெல்ட்: தோரணை மற்றும் செரிமான ஆரோக்கியத்திற்கான நிகழ்நேர கண்காணிப்பு.",
            projectTitle: "குட்டேங்கிள் (GutAngle): ஒருங்கிணைந்த சுகாதார துணை",
            descHeading: "திட்ட கண்ணோட்டம்",
            description: [
                { title: "ஒருங்கிணைந்த சுகாதார தீர்வு", content: "நீண்ட நேரம் உட்கார்ந்திருப்பவர்கள் அல்லது நின்றிருப்பவர்களுக்கான ஒருங்கிணைந்த சுகாதார துணையாக வடிவமைக்கப்பட்ட ஒரு ஸ்மார்ட் பெல்ட்." },
                { title: "வன்பொருள் செயலாக்கம்", content: "உடல் தோரணை கண்காணிப்பிற்கான IMU மற்றும் வயிற்றுப் பகுதியிலிருந்து EGG சிக்னல்களை பதிவு செய்யும் மின்முனைகளை (electrodes) இணைக்கிறது." },
                { title: "புதுமையான ஒருங்கிணைப்பு", content: "தோரணை திருத்தம் மற்றும் நிகழ்நேர குடல் ஆரோக்கிய மதிப்பீட்டின் தனித்துவமான ஒருங்கிணைப்பு." }
            ],
            readAloud: "உரக்கப் படிக்கவும்",
            readMore: "மேலும் படிக்கவும்",
            readLess: "குறைவாக படிக்கவும்",
            login: {
                backBtn: "பின்செல்",
                heroBadge: "தொடர்ச்சியான EGG மற்றும் இடுப்பு கண்காணிப்பு",
                heroTitleSub: "நிகழ்நேர EGG மற்றும் இடுப்பு",
                heroCopy: "எலக்ட்ரோகாஸ்ட்ரோகிராபி (EGG) மற்றும் இடுப்பு தோரணைத் தரவை ஒரே நேரத்தில் பதிவு செய்யவும். இரைப்பை அலைகள் மற்றும் முதுகுத்தண்டு சீரமைப்பை நிகழ்நேரத்தில் கண்காணித்து, செரிமானத்திற்கும் முதுகு ஆரோக்கியத்திற்கும் உள்ள தொடர்பை அறியவும்.",
                metric1: "0.05–0.15 Hz இரைப்பை ரிதம்",
                metric2: "பல சேனல் வயிற்று லீட்ஸ்",
                metric3: "ஹைப்போ/ஹைப்பர்- இயக்கம்",
                recordingStatus: "பதிவு நிலை",
                tabSignup: "பதிவு செய்க",
                tabSignin: "உள்நுழைக",
                authTitleSignUp: "GUTANGLE பணியிடத்தை உருவாக்கவும்",
                authTitleSignIn: "மீண்டும் வருக",
                authCaptionSignUp: "உங்கள் ஆய்வகத்திற்கு கணக்கை உருவாக்குவதன் மூலம் தொடங்கவும்.",
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
                placeName: "திருமதி. ஸ்வீட்டி",
                placeMobile: "+91 8940423363",
                placeEmail: "biomedical@gmail.com",
                placePass: "கடவுச்சொல்",
                placePassEnter: "உங்கள் கடவுச்சொல்லை உள்ளிடவும்",
                placeCaptcha: "மேலே உள்ள குறியீட்டை உள்ளிடவும்"
            }
        },
        hi: {
            heading: "आपकी रीढ़ और आपका पेट, अब एक साथ।",
            tagline: "एकीकृत स्मार्ट बेल्ट: आसन (Posture) और पाचन स्वास्थ्य की रीयल-टाइम निगरानी।",
            projectTitle: "GutAngle: एक संपूर्ण स्वास्थ्य साथी",
            descHeading: "परियोजना अवलोकन",
            description: [
                { title: "एकीकृत स्वास्थ्य समाधान", content: "GutAngle एक स्मार्ट बेल्ट है जिसे उन लोगों के लिए डिज़ाइन किया गया है जो लंबे समय तक बैठते या खड़े रहते हैं।" },
                { title: "हार्डवेयर कार्यान्वयन", content: "इसमें आसन के लिए IMU मॉड्यूल और लचीले इलेक्ट्रोड शामिल हैं जो इलेक्ट्रोगैस्ट्रोग्राफी (EGG) संकेतों को रिकॉर्ड करते हैं।" },
                { title: "अभिनव एकीकरण", content: "एक ही आरामदायक पहनने योग्य बेल्ट में आसन सुधार और रीयल-टाइम पेट के स्वास्थ्य मूल्यांकन का अनूठा संगम।" }
            ],
            readAloud: "जोर से पढ़ें",
            readMore: "और पढ़ें",
            readLess: "कम पढ़ें",
            login: {
                backBtn: "वापस",
                heroBadge: "निरंतर EGG और लम्बर मॉनिटरिंग",
                heroTitleSub: "रीयल-टाइम EGG और लम्बर",
                heroCopy: "इलेक्ट्रोगैस्ट्रोग्राफी (EGG) संकेतों और लम्बर (कमर) के आसन को एक साथ ट्रैक करें। रीयल-टाइम में गैस्ट्रिक तरंगों और रीढ़ की हड्डी के संरेखण (spinal alignment) की कल्पना करें, और पाचन व पीठ के स्वास्थ्य के बीच संबंध देखें।",
                metric1: "0.05–0.15 Hz गैस्ट्रिक लय",
                metric2: "मल्टी-चैनल पेट लीड्स",
                metric3: "हाइपो/हाइपर- गतिशीलता",
                recordingStatus: "रिकॉर्डिंग स्थिति",
                tabSignup: "साइन अप",
                tabSignin: "साइन इन",
                authTitleSignUp: "GUTANGLE वर्कस्पेस बनाएं",
                authTitleSignIn: "वापस स्वागत है",
                authCaptionSignUp: "अपनी लैब या टीम के लिए खाता बनाकर शुरुआत करें।",
                authCaptionSignIn: "डैशबोर्ड तक पहुंचने के लिए अपना विवरण दर्ज करें।",
                authFree: "साइन अप निःशुल्क है।",
                labelName: "पूरा नाम",
                labelMobile: "मोबाइल नंबर",
                labelEmail: "ईमेल आईडी",
                labelAge: "आयु",
                labelPass: "पासवर्ड",
                labelSecurity: "सुरक्षा जांच",
                btnRefresh: "रीफ्रेश",
                btnCreateAccount: "मॉनिटरिंग खाता बनाएं",
                btnSigninDashboard: "GUTANGLE डैशबोर्ड में साइन इन करें",
                footerAlready: "क्या आपके पास पहले से एक खाता है?",
                linkSignin: "साइन इन",
                linkSignup: "साइन अप",
                dividerOr: "या इसके साथ जारी रखें",
                errorCaptcha: "कैप्चा मेल नहीं खाता।",
                placeName: "सुश्री स्वीटी",
                placeMobile: "+91 8940423363",
                placeEmail: "biomedical@gmail.com",
                placePass: "पासवर्ड",
                placePassEnter: "अपना पासवर्ड डालें",
                placeCaptcha: "ऊपर दिया गया कोड टाइप करें"
            }
        },
        ml: {
            heading: "നിങ്ങളുടെ നട്ടെല്ലും വയറും, ഇപ്പോൾ ബന്ധിപ്പിച്ചിരിക്കുന്നു.",
            tagline: "ഇന്റഗ്രേറ്റഡ് സ്മാർട്ട് ബെൽറ്റ്: ഇരിക്കുമ്പോഴുള്ള രീതിയും ദഹന ആരോഗ്യവും തത്സമയം നിരീക്ഷിക്കുന്നു.",
            projectTitle: "GutAngle: സംയോജിത ആരോഗ്യ കൂട്ടാളി",
            descHeading: "പ്രോജക്റ്റ് അവലോകനം",
            description: [
                { title: "സംയോജിത ആരോഗ്യ പരിഹാരം", content: "ദീർഘനേരം ഇരിക്കുകയോ നിൽക്കുകയോ ചെയ്യുന്ന ആളുകൾക്ക് വേണ്ടി രൂപകൽപ്പന ചെയ്ത ഒരു സ്മാർട്ട് ബെൽറ്റാണ് GutAngle." },
                { title: "ഹാർഡ്‌വെയർ നടപ്പിലാക്കൽ", content: "ശരീര നിലയ്ക്കായി IMU മൊഡ്യൂളും ഇലക്‌ട്രോഗാസ്ട്രോഗ്രഫി (EGG) സിഗ്നലുകൾ റെക്കോർഡുചെയ്യുന്ന ഇലക്ട്രോഡുകളും ഇത് സംയോജിപ്പിക്കുന്നു." },
                { title: "നൂതനമായ ഏകീകരണം", content: "ശരീര നില മെച്ചപ്പെടുത്തുന്നതും വയറിന്റെ ആരോഗ്യം തത്സമയം വിലയിരുത്തുന്നതും ഒരൊറ്റ ബെൽറ്റിലൂടെ സാധ്യമാക്കുന്നു." }
            ],
            readAloud: "ഉറക്കെ വായിക്കുക",
            readMore: "കൂടുതൽ വായിക്കുക",
            readLess: "കുറച്ച് വായിക്കുക",
            login: {
                backBtn: "തിരികെ",
                heroBadge: "തുടർച്ചയായ EGG & നട്ടെല്ല് നിരീക്ഷണം",
                heroTitleSub: "തത്സമയ EGG & നട്ടെല്ല്",
                heroCopy: "ഇലക്‌ട്രോഗാസ്‌ട്രോഗ്രാഫി (EGG) സിഗ്നലുകളും നട്ടെല്ലിന്റെ വിന്യാസവും ഒരേസമയം നിരീക്ഷിക്കുക. ദഹനവ്യവസ്ഥയും നടുവിന്റെ ആരോഗ്യവും തമ്മിലുള്ള ബന്ധം മനസ്സിലാക്കാൻ ഗാസ്ട്രിക് തരംഗങ്ങളെ തത്സമയം കാണുക.",
                metric1: "0.05–0.15 Hz ഗാസ്ട്രിക് റിഥം",
                metric2: "മൾട്ടി-ചാനൽ ലീഡുകൾ",
                metric3: "ഹൈപ്പോ/ഹൈപ്പർ ഫ്ലാഗുകൾ",
                recordingStatus: "റെക്കോർഡിംഗ് നില",
                tabSignup: "സൈൻ അപ്പ്",
                tabSignin: "സൈൻ ഇൻ",
                authTitleSignUp: "GUTANGLE വർക്ക്‌സ്‌പേസ് സൃഷ്‌ടിക്കുക",
                authTitleSignIn: "സ്വാഗതം",
                authCaptionSignUp: "നിങ്ങളുടെ ലാബിനായി ഒരു അക്കൗണ്ട് സൃഷ്ടിച്ചുകൊണ്ട് ആരംഭിക്കുക.",
                authCaptionSignIn: "ഡാഷ്‌ബോർഡ് ആക്‌സസ് ചെയ്യാൻ ലോഗിൻ ചെയ്യുക.",
                authFree: "സൈൻ അപ്പ് സൗജന്യമാണ്.",
                labelName: "പൂർണ്ണമായ പേര്",
                labelMobile: "മൊബൈൽ നമ്പർ",
                labelEmail: "ഇമെയിൽ ഐഡി",
                labelAge: "വയസ്സ്",
                labelPass: "പാസ്‌വേഡ്",
                labelSecurity: "സുരക്ഷാ പരിശോധന",
                btnRefresh: "പുതുക്കുക",
                btnCreateAccount: "അക്കൗണ്ട് സൃഷ്ടിക്കുക",
                btnSigninDashboard: "GUTANGLE-ലേക്ക് സൈൻ ഇൻ ചെയ്യുക",
                footerAlready: "അക്കൗണ്ട് ഉണ്ടോ?",
                linkSignin: "സൈൻ ഇൻ",
                linkSignup: "സൈൻ അപ്പ്",
                dividerOr: "അല്ലെങ്കിൽ തുടരുക",
                errorCaptcha: "ക്യാപ്‌ച പൊരുത്തപ്പെടുന്നില്ല.",
                placeName: "മിസ്. സ്വീറ്റി",
                placeMobile: "+91 8940423363",
                placeEmail: "biomedical@gmail.com",
                placePass: "പാസ്‌വേഡ്",
                placePassEnter: "നിങ്ങളുടെ പാസ്‌വേഡ് നൽകുക",
                placeCaptcha: "മുകളിലെ കോഡ് ടൈപ്പ് ചെയ്യുക"
            }
        },
        kn: {
            heading: "ನಿಮ್ಮ ಬೆನ್ನುಮೂಳೆ, ನಿಮ್ಮ ಕರುಳು, ಈಗ ಸಂಪರ್ಕಗೊಂಡಿದೆ.",
            tagline: "ಸಂಯೋಜಿತ ಸ್ಮಾರ್ಟ್ ಬೆಲ್ಟ್: ಭಂಗಿ ಮತ್ತು ಜೀರ್ಣಕಾರಿ ಆರೋಗ್ಯಕ್ಕಾಗಿ ನೈಜ-ಸಮಯದ (Real-time) ಮೇಲ್ವಿಚಾರಣೆ.",
            projectTitle: "GutAngle: ಸಮಗ್ರ ಆರೋಗ್ಯ ಸಂಗಾತಿ",
            descHeading: "ಯೋಜನೆಯ ಅವಲೋಕನ",
            description: [
                { title: "ಸಮಗ್ರ ಆರೋಗ್ಯ ಪರಿಹಾರ", content: "GutAngle ಎನ್ನುವುದು ದೀರ್ಘಕಾಲ ಕುಳಿತುಕೊಳ್ಳುವ ಅಥವಾ ನಿಲ್ಲುವ ಜನರಿಗಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ ಸ್ಮಾರ್ಟ್ ಬೆಲ್ಟ್ ಆಗಿದೆ." },
                { title: "ಹಾರ್ಡ್‌ವೇರ್ ಅಳವಡಿಕೆ", content: "ಇದು ಭಂಗಿಗಾಗಿ IMU ಮಾಡ್ಯೂಲ್ ಮತ್ತು ಎಲೆಕ್ಟ್ರೋಗ್ಯಾಸ್ಟ್ರೋಗ್ರಫಿ (EGG) ಸಿಗ್ನಲ್‌ಗಳನ್ನು ದಾಖಲಿಸುವ ಹೊಂದಿಕೊಳ್ಳುವ ಎಲೆಕ್ಟ್ರೋಡ್‌ಗಳನ್ನು ಸಂಯೋಜಿಸುತ್ತದೆ." },
                { title: "ನವೀನ ಏಕೀಕರಣ", content: "ಒಂದೇ ಆರಾಮದಾಯಕವಾದ ಬೆಲ್ಟ್‌ನಲ್ಲಿ ಭಂಗಿ ತಿದ್ದುಪಡಿ ಮತ್ತು ನೈಜ-ಸಮಯದ ಕರುಳಿನ ಆರೋಗ್ಯ ಮೌಲ್ಯಮಾಪನದ ವಿಶಿಷ್ಟ ಸಂಯೋಜನೆ." }
            ],
            readAloud: "ಗಟ್ಟಿಯಾಗಿ ಓದಿ",
            readMore: "ಮತ್ತಷ್ಟು ಓದಿ",
            readLess: "ಕಡಿಮೆ ಓದಿ",
            login: {
                backBtn: "ಹಿಂದಕ್ಕೆ",
                heroBadge: "ನಿರಂತರ EGG ಮತ್ತು ಸೊಂಟದ ಮಾನಿಟರಿಂಗ್",
                heroTitleSub: "ರಿಯಲ್-ಟೈಮ್ EGG ಮತ್ತು ಸೊಂಟ",
                heroCopy: "ಎಲೆಕ್ಟ್ರೋಗ್ಯಾಸ್ಟ್ರೋಗ್ರಫಿ (EGG) ಸಿಗ್ನಲ್‌ಗಳು ಮತ್ತು ಸೊಂಟದ ಭಂಗಿಯನ್ನು ಏಕಕಾಲದಲ್ಲಿ ಸೆರೆಹಿಡಿಯಿರಿ. ಜೀರ್ಣಕ್ರಿಯೆ ಮತ್ತು ಬೆನ್ನಿನ ಆರೋಗ್ಯದ ನಡುವಿನ ಸಂಬಂಧವನ್ನು ಪತ್ತೆಹಚ್ಚಲು ರಿಯಲ್-ಟೈಮ್ ನಲ್ಲಿ ಗ್ಯಾಸ್ಟ್ರಿಕ್ ಅಲೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ.",
                metric1: "0.05–0.15 Hz ಗ್ಯಾಸ್ಟ್ರಿಕ್ ರಿದಮ್",
                metric2: "ಮಲ್ಟಿ-ಚಾನೆಲ್ ಲೀಡ್ಸ್",
                metric3: "ಹೈಪೋ/ಹೈಪರ್ ಫ್ಲಾಗ್‌ಗಳು",
                recordingStatus: "ರೆಕಾರ್ಡಿಂಗ್ ಸ್ಥಿತಿ",
                tabSignup: "ಸೈನ್ ಅಪ್",
                tabSignin: "ಸೈನ್ ಇನ್",
                authTitleSignUp: "GUTANGLE ಖಾತೆಯನ್ನು ರಚಿಸಿ",
                authTitleSignIn: "ಮತ್ತೆ ಸ್ವಾಗತ",
                authCaptionSignUp: "ನಿಮ್ಮ ಲ್ಯಾಬ್‌ಗಾಗಿ ಖಾತೆಯನ್ನು ರಚಿಸುವ ಮೂಲಕ ಪ್ರಾರಂಭಿಸಿ.",
                authCaptionSignIn: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಪ್ರವೇಶಿಸಲು ನಿಮ್ಮ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ.",
                authFree: "ಸೈನ್ ಅಪ್ ಉಚಿತವಾಗಿದೆ.",
                labelName: "ಪೂರ್ಣ ಹೆಸರು",
                labelMobile: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
                labelEmail: "ಇಮೇಲ್ ಐಡಿ",
                labelAge: "ವಯಸ್ಸು",
                labelPass: "ಪಾಸ್‌ವರ್ಡ್",
                labelSecurity: "ಭದ್ರತಾ ಪರಿಶೀಲನೆ",
                btnRefresh: "ರಿಫ್ರೆಶ್",
                btnCreateAccount: "ಮಾನಿಟರಿಂಗ್ ಖಾತೆಯನ್ನು ರಚಿಸಿ",
                btnSigninDashboard: "GUTANGLE ಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ",
                footerAlready: "ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?",
                linkSignin: "ಸೈನ್ ಇನ್",
                linkSignup: "ಸೈನ್ ಅಪ್",
                dividerOr: "ಅಥವಾ ಇದರೊಂದಿಗೆ ಮುಂದುವರಿಯಿರಿ",
                errorCaptcha: "ಕ್ಯಾಪ್ಚಾ ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ.",
                placeName: "ಶ್ರೀಮತಿ ಸ್ವೀಟಿ",
                placeMobile: "+91 8940423363",
                placeEmail: "biomedical@gmail.com",
                placePass: "ಪಾಸ್‌ವರ್ಡ್",
                placePassEnter: "ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ",
                placeCaptcha: "ಮೇಲಿನ ಕೋಡ್ ಟೈಪ್ ಮಾಡಿ"
            }
        },
        te: {
            heading: "మీ వెన్నెముక, మీ గట్, ఇప్పుడు అనుసంధానించబడ్డాయి.",
            tagline: "ఇంటిగ్రేటెడ్ స్మార్ట్ బెల్ట్: భంగిమ మరియు జీర్ణ ఆరోగ్యం కోసం రియల్ టైమ్ పర్యవేక్షణ.",
            projectTitle: "GutAngle: మీ ఆరోగ్య సహచరుడు",
            descHeading: "ప్రాజెక్ట్ అవలోకనం",
            description: [
                { title: "సమగ్ర ఆరోగ్య పరిష్కారం", content: "GutAngle అనేది ఎక్కువ గంటలు కూర్చుని లేదా నిలబడి గడిపే వ్యక్తుల కోసం రూపొందించబడిన స్మార్ట్ బెల్ట్." },
                { title: "హార్డ్‌వేర్ అమలు", content: "భంగిమ కోసం IMU మాడ్యూల్ మరియు ఎలక్ట్రోగ్యాస్ట్రోగ్రఫీ (EGG) సిగ్నల్‌లను రికార్డ్ చేసే సౌకర్యవంతమైన ఎలక్ట్రోడ్‌లను ఇది మిళితం చేస్తుంది." },
                { title: "వినూత్న ఏకీకరణ", content: "ఒకే సౌకర్యవంతమైన బెల్ట్‌లో భంగిమ సవరణ మరియు రియల్ టైమ్ గట్ హెల్త్ అసెస్‌మెంట్ యొక్క ప్రత్యేక కలయిక." }
            ],
            readAloud: "బిగ్గరగా చదవండి",
            readMore: "మరింత చదవండి",
            readLess: "తక్కువ చదవండి",
            login: {
                backBtn: "వెనుకకు",
                heroBadge: "నిరంతర EGG & నడుము పర్యవేక్షణ",
                heroTitleSub: "రియల్ టైమ్ EGG & నడుము",
                heroCopy: "ఎలక్ట్రోగ్యాస్ట్రోగ్రఫీ (EGG) సిగ్నల్స్ మరియు నడుము భంగిమను ఏకకాలంలో రికార్డ్ చేయండి. జీర్ణశక్తి మరియు వెన్నెముక ఆరోగ్యం మధ్య సంబంధాన్ని అర్థం చేసుకోవడానికి గ్యాస్ట్రిక్ తరంగాలను రియల్ టైమ్ లో చూడండి.",
                metric1: "0.05–0.15 Hz గ్యాస్ట్రిక్ రిథమ్",
                metric2: "మల్టీ-ఛానల్ లీడ్స్",
                metric3: "హైపో/హైపర్ ఫ్లాగ్స్",
                recordingStatus: "రికార్డింగ్ స్థితి",
                tabSignup: "సైన్ అప్",
                tabSignin: "సైన్ ఇన్",
                authTitleSignUp: "GUTANGLE ఖాతాను సృష్టించండి",
                authTitleSignIn: "తిరిగి స్వాగతం",
                authCaptionSignUp: "మీ ల్యాబ్ కోసం ఖాతాను సృష్టించడం ద్వారా ప్రారంభించండి.",
                authCaptionSignIn: "డాష్‌బోర్డ్ యాక్సెస్ చేయడానికి వివరాలను నమోదు చేయండి.",
                authFree: "సైన్ అప్ ఉచితం.",
                labelName: "పూర్తి పేరు",
                labelMobile: "మొబైల్ నంబర్",
                labelEmail: "ఇమెయిల్ ID",
                labelAge: "వయస్సు",
                labelPass: "పాస్‌వర్డ్",
                labelSecurity: "భద్రతా తనిఖీ",
                btnRefresh: "రీఫ్రెష్",
                btnCreateAccount: "పర్యవేక్షణ ఖాతాను సృష్టించండి",
                btnSigninDashboard: "GUTANGLEకి సైన్ ఇన్ చేయండి",
                footerAlready: "ఖాతా ఉందా?",
                linkSignin: "సైన్ ఇన్",
                linkSignup: "సైన్ అప్",
                dividerOr: "లేదా కొనసాగించండి",
                errorCaptcha: "కాప్చా సరిపోలలేదు.",
                placeName: "శ్రీమతి స్వీటీ",
                placeMobile: "+91 8940423363",
                placeEmail: "biomedical@gmail.com",
                placePass: "పాస్‌వర్డ్",
                placePassEnter: "మీ పాస్‌వర్డ్‌ను నమోదు చేయండి",
                placeCaptcha: "పై కోడ్‌ను టైప్ చేయండి"
            }
        },
        ur: {
            heading: "آپ کی ریڑھ کی ہڈی، آپ کی آنت، اب جڑ گئی ہیں۔",
            tagline: "انٹیگریٹڈ اسمارٹ بیلٹ: جسمانی انداز (Posture) اور ہاضمے کی صحت کی اصل وقت میں نگرانی۔",
            projectTitle: "GutAngle: صحت کا مربوط ساتھی",
            descHeading: "پروجیکٹ کا جائزہ",
            description: [
                { title: "صحت کا مربوط حل", content: "GutAngle ایک اسمارٹ بیلٹ ہے جو ان لوگوں کے لیے ڈیزائن کیا گیا ہے جو طویل وقت تک بیٹھتے یا کھڑے رہتے ہیں۔" },
                { title: "ہارڈ ویئر کا نفاذ", content: "یہ جسمانی انداز کے لیے IMU ماڈیول اور الیکٹرو گیسٹرو گرافی (EGG) سگنل ریکارڈ کرنے والے الیکٹروڈز کو یکجا کرتا ہے۔" },
                { title: "جدید انضمام", content: "ایک ہی آرام دہ بیلٹ میں جسمانی انداز کی اصلاح اور اصل وقت میں آنتوں کی صحت کا جائزہ۔" }
            ],
            readAloud: "زور سے پڑھیں",
            readMore: "مزید پڑھیں",
            readLess: "کم پڑھیں",
            login: {
                backBtn: "واپس",
                heroBadge: "مسلسل EGG اور لمبر مانیٹرنگ",
                heroTitleSub: "ریئل ٹائم EGG اور لمبر",
                heroCopy: "الیکٹروگیسٹروگرافی (EGG) سگنلز اور لمبر (کمر) کے انداز کو بیک وقت ریکارڈ کریں۔ ہاضمے اور کمر کی صحت کے درمیان تعلق کو ٹریک کرنے کے لیے ریئل ٹائم میں گیسٹرک لہروں کا مشاہدہ کریں۔",
                metric1: "0.05–0.15 Hz گیسٹرک تال",
                metric2: "ملٹی چینل لیڈز",
                metric3: "ہائپو/ہائپر فلیگز",
                recordingStatus: "ریکارڈنگ کی حیثیت",
                tabSignup: "سائن اپ",
                tabSignin: "سائن ان",
                authTitleSignUp: "GUTANGLE اکاؤنٹ بنائیں",
                authTitleSignIn: "خوش آمدید",
                authCaptionSignUp: "اپنی لیب کے لیے اکاؤنٹ بنا کر شروعات کریں۔",
                authCaptionSignIn: "ڈیش بورڈ تک رسائی کے لیے لاگ ان کریں۔",
                authFree: "سائن اپ مفت ہے۔",
                labelName: "پورا نام",
                labelMobile: "موبائل نمبر",
                labelEmail: "ای میل ID",
                labelAge: "عمر",
                labelPass: "پاس ورڈ",
                labelSecurity: "سیکیورٹی چیک",
                btnRefresh: "ری فریس",
                btnCreateAccount: "مانیٹرنگ اکاؤنٹ بنائیں",
                btnSigninDashboard: "GUTANGLE میں سائن ان کریں",
                footerAlready: "پہلے سے اکاؤنٹ ہے؟",
                linkSignin: "سائن ان",
                linkSignup: "سائن اپ",
                dividerOr: "یا اس کے ساتھ جاری رکھیں",
                errorCaptcha: "کیپچا مماثل نہیں ہے۔",
                placeName: "محترمہ سویٹی",
                placeMobile: "+91 8940423363",
                placeEmail: "biomedical@gmail.com",
                placePass: "پاس ورڈ",
                placePassEnter: "اپنا پاس ورڈ درج کریں",
                placeCaptcha: "اوپر والا کوڈ ٹائپ کریں"
            }
        },
        mr: {
            heading: "तुमचा पाठीचा कणा आणि पचनसंस्था, आता जोडलेले आहेत.",
            tagline: "इंटिग्रेटेड स्मार्ट बेल्ट: बसण्याची पद्धत (Posture) आणि पचन आरोग्याचे रिअल-टाइम निरीक्षण.",
            projectTitle: "GutAngle: एक संपूर्ण आरोग्य सोबती",
            descHeading: "प्रकल्प विहंगावलोकन",
            description: [
                { title: "एकात्मिक आरोग्य उपाय", content: "GutAngle हा एक स्मार्ट बेल्ट आहे जो जास्त वेळ बसून किंवा उभे राहणाऱ्या लोकांसाठी डिझाइन केला आहे." },
                { title: "हार्डवेअर अंमलबजावणी", content: "यामध्ये पोश्चरसाठी IMU मॉड्युल आणि इलेक्ट्रोगॅस्ट्रोग्राफी (EGG) सिग्नल्स रेकॉर्ड करणारे लवचिक इलेक्ट्रोड्स आहेत." },
                { title: "नाविन्यपूर्ण एकत्रीकरण", content: "एकाच आरामदायी बेल्टमध्ये पोश्चर सुधारणा आणि रिअल-टाइम पचन आरोग्याचे निरीक्षण." }
            ],
            readAloud: "मोठ्याने वाचा",
            readMore: "अधिक वाचा",
            readLess: "कमी वाचा",
            login: {
                backBtn: "मागे",
                heroBadge: "सतत EGG आणि लंबर मॉनिटरिंग",
                heroTitleSub: "रिअल-टाइम EGG आणि लंबर",
                heroCopy: "इलेक्ट्रोगॅस्ट्रोग्राफी (EGG) सिग्नल आणि लम्बर (कंबर) पोश्चर एकाच वेळी ट्रॅक करा. रिअल-टाइममध्ये गॅस्ट्रिक लहरी आणि पाठीचा कणा यांच्या हालचाली पहा आणि पचन व पाठीच्या आरोग्यामधील संबंध तपासा.",
                metric1: "0.05–0.15 Hz गॅस्ट्रिक लय",
                metric2: "मल्टी-चॅनेल लीड्स",
                metric3: "हायपो/हायपर फ्लॅग्ज",
                recordingStatus: "रेकॉर्डिंग स्थिती",
                tabSignup: "साइन अप",
                tabSignin: "साइन इन",
                authTitleSignUp: "GUTANGLE खाते तयार करा",
                authTitleSignIn: "स्वागत आहे",
                authCaptionSignUp: "तुमच्या लॅबसाठी खाते तयार करून सुरुवात करा.",
                authCaptionSignIn: "डॅशबोर्डवर जाण्यासाठी तुमचे तपशील प्रविष्ट करा.",
                authFree: "साइन अप विनामूल्य आहे.",
                labelName: "पूर्ण नाव",
                labelMobile: "मोबाईल नंबर",
                labelEmail: "ईमेल आयडी",
                labelAge: "वय",
                labelPass: "पासवर्ड",
                labelSecurity: "सुरक्षा तपासणी",
                btnRefresh: "रीफ्रेश",
                btnCreateAccount: "मॉनिटरिंग खाते तयार करा",
                btnSigninDashboard: "GUTANGLE मध्ये साइन इन करा",
                footerAlready: "आधीच खाते आहे का?",
                linkSignin: "साइन इन",
                linkSignup: "साइन अप",
                dividerOr: "किंवा यासह सुरू ठेवा",
                errorCaptcha: "कॅप्चा जुळत नाही.",
                placeName: "सुश्री स्वीटी",
                placeMobile: "+91 8940423363",
                placeEmail: "biomedical@gmail.com",
                placePass: "पासवर्ड",
                placePassEnter: "तुमचा पासवर्ड टाका",
                placeCaptcha: "वरील कोड टाइप करा"
            }
        },
        or: {
            heading: "ଆପଣଙ୍କର ମେରুদଣ୍ଡ, ଆପଣଙ୍କର ଗଟ୍, ବର୍ତ୍ତମାନ ସଂଯୁକ୍ତ |",
            tagline: "ଇଣ୍ଟିଗ୍ରେଟେଡ୍ ସ୍ମାର୍ଟ ବେଲ୍ଟ: ଆସନ (Posture) ଏବଂ ହଜମ ସ୍ୱାସ୍ଥ୍ୟ ପାଇଁ ରିଅଲ୍ ଟାଇମ୍ ମନିଟରିଂ |",
            projectTitle: "GutAngle: ସମନ୍ୱିତ ସ୍ୱାସ୍ଥ୍ୟ ସାଥୀ",
            descHeading: "ପ୍ରକଳ୍ପ ସମୀକ୍ଷା",
            description: [
                { title: "ସମନ୍ୱିତ ସ୍ୱାସ୍ଥ୍ୟ ସମାଧାନ", content: "GutAngle ହେଉଛି ଏକ ସ୍ମାର୍ଟ ବେଲ୍ଟ ଯାହାକି ଦୀର୍ଘ ସମୟ ଧରି ବସିଥିବା କିମ୍ବା ଛିଡା ହୋଇଥିବା ଲୋକଙ୍କ ପାଇଁ ଡିଜାଇନ୍ କରାଯାଇଛି |" },
                { title: "ହାର୍ଡୱେର୍ କାର୍ଯ୍ୟକାରିତା", content: "ଏହା ଆସନ ପାଇଁ IMU ମଡ୍ୟୁଲ୍ ଏବଂ ଇଲେକ୍ଟ୍ରୋଗାଷ୍ଟ୍ରୋଗ୍ରାଫି (EGG) ସିଗନାଲ୍ ରେକର୍ଡ କରୁଥିବା ଇଲେକ୍ଟ୍ରୋଡ୍ ଗୁଡିକୁ ଏକତ୍ର କରେ |" },
                { title: "ଅଭିନବ ଏକୀକରଣ", content: "ଗୋଟିଏ ଆରାମଦାୟକ ବେଲ୍ଟ ମଧ୍ୟରେ ଆସନ ସଂଶୋଧନ ଏବଂ ରିଅଲ୍-ଟାଇମ୍ ଗଟ୍ ସ୍ୱାସ୍ଥ୍ୟ ମୂଲ୍ୟାଙ୍କନର ଅନନ୍ୟ ମିଶ୍ରଣ |" }
            ],
            readAloud: "ଜୋରରେ ପଢନ୍ତୁ",
            readMore: "ଅଧିକ ପଢନ୍ତୁ",
            readLess: "କମ ପଢନ୍ତୁ",
            login: {
                backBtn: "ପଛକୁ",
                heroBadge: "ନିରନ୍ତର EGG ଏବଂ ଲମ୍ବର ମନିଟରିଂ",
                heroTitleSub: "ରିଅଲ୍ ଟାଇମ୍ EGG ଏବଂ ଲମ୍ବର",
                heroCopy: "ଇଲେକ୍ଟ୍ରୋଗାଷ୍ଟ୍ରୋଗ୍ରାଫି (EGG) ସିଗନାଲ୍ ଏବଂ ଲମ୍ବର (କମର) ସ୍ଥିତିକୁ ଏକାସାଙ୍ଗରେ ରେକର୍ଡ କରନ୍ତୁ | ହଜମ ପ୍ରକ୍ରିୟା ଏବଂ ପିଠି ସ୍ୱାସ୍ଥ୍ୟ ମଧ୍ୟରେ ଥିବା ସମ୍ପର୍କକୁ ଜାଣିବା ପାଇଁ ରିଅଲ୍-ଟାଇମ୍ ରେ ଗ୍ୟାଷ୍ଟ୍ରିକ୍ ତରଙ୍ଗ ଦେଖନ୍ତୁ |",
                metric1: "0.05–0.15 Hz ଗ୍ୟାଷ୍ଟ୍ରିକ୍ ରିଦମ୍",
                metric2: "ମଲ୍ଟି-ଚ୍ୟାନେଲ୍ ଲିଡ୍",
                metric3: "ହାଇପୋ / ହାଇପର ଫ୍ଲାଗ୍",
                recordingStatus: "ରେକର୍ଡିଂ ସ୍ଥିତି",
                tabSignup: "ସାଇନ୍ ଅପ୍",
                tabSignin: "ସାଇନ୍ ଇନ୍",
                authTitleSignUp: "GUTANGLE ୱାର୍କସ୍ପେସ୍ ତିଆରି କରନ୍ତୁ",
                authTitleSignIn: "ସ୍ୱାଗତମ୍",
                authCaptionSignUp: "ଆପଣଙ୍କର ଲ୍ୟାବ ପାଇଁ ଏକ ଆକାଉଣ୍ଟ୍ ସୃଷ୍ଟି କରି ଆରମ୍ଭ କରନ୍ତୁ |",
                authCaptionSignIn: "ଡ୍ୟାସବୋର୍ଡ ପ୍ରବେଶ କରିବାକୁ ଆପଣଙ୍କର ବିବରଣୀ ପ୍ରବେଶ କରନ୍ତୁ |",
                authFree: "ସାଇନ୍ ଅପ୍ ମାଗଣା ଅଟେ |",
                labelName: "ପୁରା ନାମ",
                labelMobile: "ମୋବାଇଲ୍ ନମ୍ବର",
                labelEmail: "ଇମେଲ୍ ଆଇଡି",
                labelAge: "ବୟସ",
                labelPass: "ପାସୱାର୍ଡ",
                labelSecurity: "ସୁରକ୍ଷା ଯାଞ୍ଚ",
                btnRefresh: "ରିଫ୍ରେସ",
                btnCreateAccount: "ମନିଟରିଂ ଆକାଉଣ୍ଟ୍ ତିଆରି କରନ୍ତୁ",
                btnSigninDashboard: "GUTANGLE ରେ ସାଇନ୍ ଇନ୍ କରନ୍ତୁ",
                footerAlready: "ପୂର୍ବରୁ ଏକ ଆକାଉଣ୍ଟ୍ ଅଛି କି?",
                linkSignin: "ସାଇନ୍ ଇନ୍",
                linkSignup: "ସାଇନ୍ ଅପ୍",
                dividerOr: "କିମ୍ବା ସହିତ ଜାରି ରଖନ୍ତୁ",
                errorCaptcha: "କ୍ୟାପଚା ମେଳ ଖାଉ ନାହିଁ |",
                placeName: "ଶ୍ରୀମତୀ ସ୍ୱିଟି",
                placeMobile: "+91 8940423363",
                placeEmail: "biomedical@gmail.com",
                placePass: "ପାସୱାର୍ଡ",
                placePassEnter: "ଆପଣଙ୍କର ପାସୱାର୍ଡ ପ୍ରବେଶ କରନ୍ତୁ",
                placeCaptcha: "ଉପର କୋଡ୍ ଟାଇପ୍ କରନ୍ତୁ"
            }
        }
    };


    // ============================================
    // 3. LANGUAGE SWITCHING LOGIC
    // ============================================
    const descriptionContent = document.getElementById('description-content');
    const toggleBtn = document.getElementById('toggle-desc-btn');
    const languageSelect = document.getElementById('language-select');
    let isExpanded = false;
    let currentLanguage = 'en';

    function updateDescriptionContent() {
        const langData = translations[currentLanguage] || translations['en'];
        if(descriptionContent) {
            descriptionContent.innerHTML = '';
            langData.description.forEach((section) => {
                const div = document.createElement('div');
                div.className = 'desc-paragraph';
                div.innerHTML = `<h4>${section.title}</h4><p>${section.content}</p>`;
                descriptionContent.appendChild(div);
            });
        }
    }

    function updateLanguage(lang) {
        currentLanguage = lang;
        const t = translations[lang] || translations['en'];

        // Update Landing Page
        if(document.getElementById('main-heading')) document.getElementById('main-heading').textContent = t.heading;
        if(document.getElementById('tagline')) document.getElementById('tagline').textContent = t.tagline;
        if(document.getElementById('project-title')) document.getElementById('project-title').textContent = t.projectTitle;
        if(document.getElementById('desc-heading')) document.getElementById('desc-heading').textContent = t.descHeading;
        if(document.getElementById('read-aloud-btn')) document.getElementById('read-aloud-btn').innerHTML = `<i class="fas fa-volume-up"></i> ${t.readAloud}`;
        updateDescriptionContent();
        
        // Update Toggle Button Text
        if(toggleBtn) {
             if (isExpanded) {
                toggleBtn.innerHTML = `${t.readLess} <i class="fas fa-chevron-up"></i>`;
            } else {
                toggleBtn.innerHTML = `${t.readMore} <i class="fas fa-chevron-down"></i>`;
            }
        }

        // Update Login Page
        const loginT = t.login;
        if(loginT) {
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

    if(languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            updateLanguage(e.target.value);
        });
    }

    if(toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            isExpanded = !isExpanded;
            const t = translations[currentLanguage] || translations['en'];
            if (isExpanded) {
                descriptionContent.classList.add('expanded');
                toggleBtn.innerHTML = `${t.readLess} <i class="fas fa-chevron-up"></i>`;
            } else {
                descriptionContent.classList.remove('expanded');
                toggleBtn.innerHTML = `${t.readMore} <i class="fas fa-chevron-down"></i>`;
            }
        });
    }

    // Initialize Language & Content
    updateDescriptionContent();
    updateLanguage('en');


    // ============================================
    // 4. VISUAL EFFECTS (LIGHT RAYS & FUZZY)
    // ============================================
    const canvas = document.getElementById('lightRaysCanvas');
    if(canvas) {
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

     // ... inside Section 4 ...

    function loop() {
        const viewLogin = document.getElementById('view-login'); // Ensure we have the element reference
        
        if(viewLogin && viewLogin.style.display !== 'none') {
            ctx.clearRect(0, 0, width, height);
            
            // 1. BACKGROUND GRADIENT (Changed to Green Tint)
            const grad = ctx.createRadialGradient(width/2, 0, 0, width/2, height, height);
            // Dark Greenish tint (R=0, G=40, B=20)
            grad.addColorStop(0, 'rgba(0, 40, 20, 0.3)'); 
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.fillRect(0,0,width,height);

            ctx.globalCompositeOperation = 'screen';
            const time = Date.now() * 0.001;

            rays.forEach(ray => {
                const x = width/2 + Math.sin(time * ray.speed + ray.length) * 200;
                ctx.beginPath();
                
                // 2. RAYS COLOR (Changed to Neon Green)
                // R=0, G=255, B=120
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
    if(fuzzyCanvas) {
        const ctxF = fuzzyCanvas.getContext('2d');
        fuzzyCanvas.width = 150; 
        fuzzyCanvas.height = 40;
        
        function fuzzyLoop() {
            if(viewLogin.style.display !== 'none') {
                ctxF.clearRect(0,0,150,40);
                ctxF.font = "bold 20px sans-serif";
                ctxF.fillStyle = "#ef4444"; // Red text
                const dx = (Math.random()-0.5) * 1;
                ctxF.fillText("LIVE EGG", 10 + dx, 25);
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
    
    function setAuthMode(mode) {
        // Must grab latest translation to set title correctly
        const t = translations[currentLanguage] || translations['en'];
        const loginT = t.login;

        if(mode === 'signup') {
            tabPill.setAttribute('data-mode', 'signup');
            tabSignup.setAttribute('data-active', 'true');
            tabSignin.setAttribute('data-active', 'false');
            signupForm.setAttribute('data-active', 'true');
            signinForm.setAttribute('data-active', 'false');
            
            if(loginT) {
                authTitle.textContent = loginT.authTitleSignUp;
                authCaption.innerHTML = `<span data-i18n="authCaptionSignUp">${loginT.authCaptionSignUp}</span> <span style="display:block; font-weight:bold; color:#fff;" data-i18n="authFree">${loginT.authFree}</span>`;
            }
        } else {
            tabPill.setAttribute('data-mode', 'signin');
            tabSignup.setAttribute('data-active', 'false');
            tabSignin.setAttribute('data-active', 'true');
            signupForm.setAttribute('data-active', 'false');
            signinForm.setAttribute('data-active', 'true');
            
            if(loginT) {
                 authTitle.textContent = loginT.authTitleSignIn;
                 authCaption.innerHTML = `<span data-i18n="authCaptionSignIn">${loginT.authCaptionSignIn}</span>`;
            }
        }
    }

    if(tabSignup && tabSignin) {
        tabSignup.addEventListener('click', () => setAuthMode('signup'));
        tabSignin.addEventListener('click', () => setAuthMode('signin'));
        const toSigninLink = document.getElementById('toSigninLink');
        if(toSigninLink) toSigninLink.addEventListener('click', () => setAuthMode('signin'));
    }


    // ============================================
    // 6. CAPTCHA LOGIC (MODULAR)
    // ============================================
    function setupCaptcha(type) {
        const textEl = document.getElementById(`captchaText${type}`);
        const refreshBtn = document.getElementById(`captchaRefresh${type}`);
        const inputEl = document.getElementById(`captchaInput${type}`);
        const errorEl = document.getElementById(`signinError${type}`);
        const formEl = document.getElementById(`${type.toLowerCase()}Form`);

        // Debugging to help you see if elements are found
        if(!textEl) console.warn(`Captcha text element not found for ${type}`);
        if(!formEl) console.warn(`Form element not found for ${type}`);

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
                    alert(`${type} Successful! (Mock)`);
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

});


// ============================================
    // 4. VISUAL EFFECTS (LIGHT RAYS & FUZZY)
    // ============================================
    const canvas = document.getElementById('lightRaysCanvas');
    if(canvas) {
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
            if(document.getElementById('view-login').style.display !== 'none') {
                ctx.clearRect(0, 0, width, height);
                
                // 1. GREEN BACKGROUND GRADIENT
                const grad = ctx.createRadialGradient(width/2, 0, 0, width/2, height, height);
                // Dark Greenish/Teal center tint
                grad.addColorStop(0, 'rgba(0, 40, 20, 0.3)'); 
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.fillRect(0,0,width,height);

                ctx.globalCompositeOperation = 'screen';
                const time = Date.now() * 0.001;

                rays.forEach(ray => {
                    const x = width/2 + Math.sin(time * ray.speed + ray.length) * 200;
                    ctx.beginPath();
                    
                    // 2. GREEN RAYS COLOR
                    // R=0, G=255, B=120 (Neon Green)
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



    