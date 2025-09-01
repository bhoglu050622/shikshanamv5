import { I18nContent } from '@/types/guna-profiler'

export const gunaQuestions = [
  {
    id: 'q1',
    question: {
      en: "How do you typically wake up?",
      hi: "आप आमतौर पर कैसे जागते हैं?"
    },
    options: [
      { text: { en: "Calm and refreshed", hi: "शांत और तरोताज़ा" }, guna: 'sattva' as const },
      { text: { en: "Anxious, ready to go", hi: "चिन्तित, जाने के लिए तैयार" }, guna: 'rajas' as const },
      { text: { en: "Sluggish, want more sleep", hi: "सुस्त, और सोना चाहता हूँ" }, guna: 'tamas' as const }
    ]
  },
  {
    id: 'q2',
    question: {
      en: "What motivates your actions?",
      hi: "आपके कार्यों को क्या प्रेरित करता है?"
    },
    options: [
      { text: { en: "Clarity and purpose", hi: "स्पष्टता और उद्देश्य" }, guna: 'sattva' as const },
      { text: { en: "Goals and ambitions", hi: "लक्ष्य और महत्वाकांक्षाएं" }, guna: 'rajas' as const },
      { text: { en: "Habit or comfort", hi: "आदत या आराम" }, guna: 'tamas' as const }
    ]
  },
  {
    id: 'q3',
    question: {
      en: "How do you handle stress?",
      hi: "आप तनाव को कैसे संभालते हैं?"
    },
    options: [
      { text: { en: "Detach and reflect", hi: "अलग होकर चिंतन करें" }, guna: 'sattva' as const },
      { text: { en: "Push through harder", hi: "और जोर से धक्का दें" }, guna: 'rajas' as const },
      { text: { en: "Avoid or numb it", hi: "इससे बचें या सुन्न करें" }, guna: 'tamas' as const }
    ]
  },
  {
    id: 'q4',
    question: {
      en: "Your reaction to conflict is to...",
      hi: "संघर्ष के प्रति आपकी प्रतिक्रिया है..."
    },
    options: [
      { text: { en: "Seek peace and understanding", hi: "शांति और समझ की तलाश करें" }, guna: 'sattva' as const },
      { text: { en: "Argue or defend assertively", hi: "दृढ़ता से बहस करें या बचाव करें" }, guna: 'rajas' as const },
      { text: { en: "Withdraw or shut down", hi: "पीछे हटें या चुप हो जाएं" }, guna: 'tamas' as const }
    ]
  },
  {
    id: 'q5',
    question: {
      en: "When you are alone, you usually...",
      hi: "जब आप अकेले होते हैं, तो आप आमतौर पर..."
    },
    options: [
      { text: { en: "Meditate, read, or contemplate", hi: "ध्यान, पढ़ें, या चिंतन करें" }, guna: 'sattva' as const },
      { text: { en: "Plan, scroll, or multitask", hi: "योजना बनाएं, स्क्रॉल करें, या मल्टीटास्क करें" }, guna: 'rajas' as const },
      { text: { en: "Sleep or binge-watch", hi: "सोएं या बिंज-वॉच करें" }, guna: 'tamas' as const }
    ]
  },
  {
    id: 'q6',
    question: {
      en: "How do you relate to food?",
      hi: "आप भोजन से कैसे संबंधित हैं?"
    },
    options: [
      { text: { en: "Choose light, pure foods", hi: "हल्के, शुद्ध भोजन चुनें" }, guna: 'sattva' as const },
      { text: { en: "Crave stimulating or spicy foods", hi: "उत्तेजक या मसालेदार भोजन की लालसा करें" }, guna: 'rajas' as const },
      { text: { en: "Prefer heavy or comfort foods", hi: "भारी या आरामदायक भोजन पसंद करें" }, guna: 'tamas' as const }
    ]
  },
  {
    id: 'q7',
    question: {
      en: "How do you learn best?",
      hi: "आप सबसे अच्छा कैसे सीखते हैं?"
    },
    options: [
      { text: { en: "Through insight and reflection", hi: "अंतर्दृष्टि और प्रतिबिंब के माध्यम से" }, guna: 'sattva' as const },
      { text: { en: "Through challenge and debate", hi: "चुनौती और बहस के माध्यम से" }, guna: 'rajas' as const },
      { text: { en: "With repetition", hi: "दोहराव के साथ" }, guna: 'tamas' as const }
    ]
  },
  {
    id: 'q8',
    question: {
      en: "You are drawn to people who are...",
      hi: "आप उन लोगों के प्रति आकर्षित होते हैं जो..."
    },
    options: [
      { text: { en: "Calm and wise", hi: "शांत और बुद्धिमान" }, guna: 'sattva' as const },
      { text: { en: "Energetic and driven", hi: "ऊर्जावान और प्रेरित" }, guna: 'rajas' as const },
      { text: { en: "Quiet and dependable", hi: "शांत और निर्भर" }, guna: 'tamas' as const }
    ]
  },
  {
    id: 'q9',
    question: {
      en: "Your daily energy is...",
      hi: "आपकी दैनिक ऊर्जा है..."
    },
    options: [
      { text: { en: "Even and consistent", hi: "समान और निरंतर" }, guna: 'sattva' as const },
      { text: { en: "Spiky—highs and lows", hi: "नुकीला—ऊँच और चढ़ाव" }, guna: 'rajas' as const },
      { text: { en: "Low and sluggish", hi: "कम और सुस्त" }, guna: 'tamas' as const }
    ]
  },
  {
    id: 'q10',
    question: {
      en: "How do you typically speak?",
      hi: "आप आमतौर पर कैसे बोलते हैं?"
    },
    options: [
      { text: { en: "Clearly, gently, and meaningfully", hi: "स्पष्ट, कोमल और सार्थक" }, guna: 'sattva' as const },
      { text: { en: "Fast, persuasively, and effectively", hi: "तेज, प्रेरक और प्रभावी" }, guna: 'rajas' as const },
      { text: { en: "Minimally, vaguely, or confused", hi: "न्यूनतम, अस्पष्ट, या भ्रमित" }, guna: 'tamas' as const }
    ]
  },
  {
    id: 'q11',
    question: {
      en: "How do you feel about change?",
      hi: "आप बदलाव के बारे में कैसा महसूस करते हैं?"
    },
    options: [
      { text: { en: "Embrace it with awareness", hi: "जागरूकता के साथ इसे अपनाएं" }, guna: 'sattva' as const },
      { text: { en: "Chase it to avoid boredom", hi: "ऊब से बचने के लिए इसका पीछा करें" }, guna: 'rajas' as const },
      { text: { en: "Resist it unless forced", hi: "जब तक मजबूर न हों तब तक इसका विरोध करें" }, guna: 'tamas' as const }
    ]
  },
  {
    id: 'q12',
    question: {
      en: "When complimented, you...",
      hi: "जब प्रशंसा की जाती है, तो आप..."
    },
    options: [
      { text: { en: "Acknowledge and let go", hi: "स्वीकार करें और जाने दें" }, guna: 'sattva' as const },
      { text: { en: "Feel motivated to do more", hi: "और अधिक करने के लिए प्रेरित महसूस करें" }, guna: 'rajas' as const },
      { text: { en: "Feel suspicious or indifferent", hi: "संदिग्ध या उदासीन महसूस करें" }, guna: 'tamas' as const }
    ]
  },
  {
    id: 'q13',
    question: {
      en: "How do you make decisions?",
      hi: "आप निर्णय कैसे लेते हैं?"
    },
    options: [
      { text: { en: "After balanced reflection", hi: "संतुलित प्रतिबिंब के बाद" }, guna: 'sattva' as const },
      { text: { en: "Quickly, on impulse", hi: "जल्दी, आवेग पर" }, guna: 'rajas' as const },
      { text: { en: "Delay or avoid deciding", hi: "निर्णय में देरी या टालना" }, guna: 'tamas' as const }
    ]
  },
  {
    id: 'q14',
    question: {
      en: "Your ideal environment is...",
      hi: "आपका आदर्श वातावरण है..."
    },
    options: [
      { text: { en: "Natural and well-ordered", hi: "प्राकृतिक और सुव्यवस्थित" }, guna: 'sattva' as const },
      { text: { en: "Busy and full of action", hi: "व्यस्त और कार्रवाई से भरपूर" }, guna: 'rajas' as const },
      { text: { en: "Dim, cozy, and isolated", hi: "मंद, आरामदायक और अलग-थलग" }, guna: 'tamas' as const }
    ]
  },
  {
    id: 'q15',
    question: {
      en: "At night, how does your mind feel?",
      hi: "रात में, आपका मन कैसा महसूस करता है?"
    },
    options: [
      { text: { en: "Settled and content", hi: "स्थिर और संतुष्ट" }, guna: 'sattva' as const },
      { text: { en: "Racing with thoughts", hi: "विचारों से दौड़ रहा है" }, guna: 'rajas' as const },
      { text: { en: "Foggy or restless", hi: "धुंधला या बेचैन" }, guna: 'tamas' as const }
    ]
  },
  {
    id: 'q16',
    question: {
      en: "How do you approach your work or daily tasks?",
      hi: "आप अपने काम या दैनिक कार्यों को कैसे करते हैं?"
    },
    options: [
      { text: { en: "With mindfulness and a sense of higher purpose", hi: "सचेतनता और उच्च उद्देश्य की भावना के साथ" }, guna: 'sattva' as const },
      { text: { en: "With a focus on efficiency and achieving results", hi: "दक्षता और परिणाम प्राप्त करने पर ध्यान देने के साथ" }, guna: 'rajas' as const },
      { text: { en: "I do what's necessary to get by", hi: "मैं बस काम पूरा करने के लिए जो आवश्यक है वह करता हूँ" }, guna: 'tamas' as const }
    ]
  },
  {
    id: 'q17',
    question: {
      en: "What kind of music do you prefer?",
      hi: "आप किस तरह का संगीत पसंद करते हैं?"
    },
    options: [
      { text: { en: "Calm, meditative, or classical music", hi: "शांत, ध्यानपूर्ण, या शास्त्रीय संगीत" }, guna: 'sattva' as const },
      { text: { en: "Upbeat, energetic, and powerful music", hi: "ऊर्जावान, जोशीला और शक्तिशाली संगीत" }, guna: 'rajas' as const },
      { text: { en: "Familiar, comforting, or melancholic tunes", hi: "परिचित, आरामदायक, या उदास धुनें" }, guna: 'tamas' as const }
    ]
  },
  {
    id: 'q18',
    question: {
      en: "When faced with a new opportunity, you feel...",
      hi: "जब एक नया अवसर आता है, तो आप महसूस करते हैं..."
    },
    options: [
      { text: { en: "Open and curious about its potential for growth", hi: "विकास की क्षमता के बारे में खुला और जिज्ञासु" }, guna: 'sattva' as const },
      { text: { en: "Excited by the challenge and possibility of reward", hi: "चुनौती और पुरस्कार की संभावना से उत्साहित" }, guna: 'rajas' as const },
      { text: { en: "Hesitant and prefer to stick with what you know", hi: "झिझक और जो आप जानते हैं उस पर टिके रहना पसंद करते हैं" }, guna: 'tamas' as const }
    ]
  },
  {
    id: 'q19',
    question: {
      en: "Your living space tends to be...",
      hi: "आपका रहने का स्थान कैसा होता है..."
    },
    options: [
      { text: { en: "Clean, organized, and filled with natural light", hi: "साफ, व्यवस्थित और प्राकृतिक प्रकाश से भरा" }, guna: 'sattva' as const },
      { text: { en: "Vibrant, full of personal projects, sometimes a bit messy", hi: "जीवंत, व्यक्तिगत परियोजनाओं से भरा, कभी-कभी थोड़ा गन्दा" }, guna: 'rajas' as const },
      { text: { en: "Cozy and comfortable, but can become cluttered", hi: "आरामदायक और सुखद, लेकिन अव्यवस्थित हो सकता है" }, guna: 'tamas' as const }
    ]
  },
  {
    id: 'q20',
    question: {
      en: "How do you view wealth and possessions?",
      hi: "आप धन और संपत्ति को कैसे देखते हैं?"
    },
    options: [
      { text: { en: "As tools for good, to be used with detachment", hi: "अच्छे के लिए उपकरण के रूप में, अनासक्ति के साथ उपयोग किया जाना है" }, guna: 'sattva' as const },
      { text: { en: "As symbols of success and a means to enjoy life", hi: "सफलता के प्रतीक और जीवन का आनंद लेने के साधन के रूप में" }, guna: 'rajas' as const },
      { text: { en: "As a source of security and comfort", hi: "सुरक्षा और आराम के स्रोत के रूप में" }, guna: 'tamas' as const }
    ]
  }
]

export const gunaArchetypes = {
  // 3-Guna Primary Archetypes (full codes)
  SRT: {
    en: { archetype: "The Balanced Leader", description: "You have a powerful mix of clear vision (Sattva), passionate energy (Rajas), and grounded stability (Tamas). This makes you a natural and effective leader who can inspire people, drive action, and ensure things get done right." },
    hi: { archetype: "संतुलित नेता", description: "आपमें स्पष्ट दृष्टि (सत्व), जोशीली ऊर्जा (रजस) और ठोस स्थिरता (तमस) का एक शक्तिशाली मिश्रण है। यह आपको एक स्वाभाविक और प्रभावी नेता बनाता है जो लोगों को प्रेरित कर सकता है, कार्रवाई कर सकता है और यह सुनिश्चित कर सकता है कि चीजें सही तरीके से हों।" }
  },
  STR: {
    en: { archetype: "The Wise Strategist", description: "Your greatest strength is your clear, calm mind (Sattva). You ground your ideas in practical reality (Tamas) before taking action (Rajas). This makes you a master planner who builds things that last." },
    hi: { archetype: "बुद्धिमान रणनीतिकार", description: "आपकी सबसे बड़ी ताकत आपका स्पष्ट, शांत मन (सत्व) है। आप कार्रवाई (रजस) करने से पहले अपने विचारों को व्यावहारिक वास्तविकता (तमस) में आधार बनाते हैं। यह आपको एक मास्टर प्लानर बनाता है जो स्थायी चीजें बनाता है।" }
  },
  RST: {
    en: { archetype: "The Passionate Teacher", description: "You are fueled by a powerful energy (Rajas) and guided by a clear wisdom (Sattva). This combination makes you a natural teacher and motivator, able to make complex ideas exciting and easy to understand for everyone." },
    hi: { archetype: "उत्साही शिक्षक", description: "आप एक शक्तिशाली ऊर्जा (रजस) से प्रेरित हैं और एक स्पष्ट ज्ञान (सत्व) द्वारा निर्देशित हैं। यह संयोजन आपको एक स्वाभाविक शिक्षक और प्रेरक बनाता है, जो जटिल विचारों को सभी के लिए रोमांचक और समझने में आसान बनाने में सक्षम है।" }
  },
  RTS: {
    en: { archetype: "The Driven Pragmatist", description: "You are a powerhouse of action (Rajas) who is also incredibly practical and grounded (Tamas). You have a rare ability to get things done in the real world, using your wisdom (Sattva) to make your efforts even more effective." },
    hi: { archetype: "प्रेरित यथार्थवादी", description: "आप कार्रवाई (रजस) का एक पावरहाउस हैं जो अविश्वसनीय रूप से व्यावहारिक और आधारित (तमस) भी है। आपके पास वास्तविक दुनिया में चीजों को करने की एक दुर्लभ क्षमता है, अपने प्रयासों को और भी प्रभावी बनाने के लिए अपने ज्ञान (सत्व) का उपयोग करते हुए।" }
  },
  TSR: {
    en: { archetype: "The Grounded Innovator", description: "Your foundation is your stability (Tamas), but it's lit up by bright ideas (Sattva) and a surprising amount of energy (Rajas). You don't just resist change; you create meaningful, lasting improvements from a solid base." },
    hi: { archetype: "आधारित प्रर्वतक", description: "आपकी नींव आपकी स्थिरता (तमस) है, लेकिन यह उज्ज्वल विचारों (सत्व) और आश्चर्यजनक मात्रा में ऊर्जा (रजस) से रोशन है। आप केवल परिवर्तन का विरोध नहीं करते; आप एक ठोस आधार से सार्थक, स्थायी सुधार करते हैं।" }
  },
  TRS: {
    en: { archetype: "The Resilient Caretaker", description: "You are the rock for your family and community. Your stability (Tamas) is fueled by a strong inner drive (Rajas) and a deep sense of compassion (Sattva). You provide the safety and support that helps others thrive." },
    hi: { archetype: "लचीला देखभाल करने वाला", description: "आप अपने परिवार और समुदाय के लिए चट्टान हैं। आपकी स्थिरता (तमस) एक मजबूत आंतरिक प्रेरणा (रजस) और करुणा (सत्व) की गहरी भावना से प्रेरित है। आप वह सुरक्षा और समर्थन प्रदान करते हैं जो दूसरों को फलने-फूलने में मदद करता है।" }
  },
  // 2-Guna Primary Archetypes (two highest gunas)
  SR: {
    en: { archetype: "The Pure Achiever", description: "You are a potent mix of clear vision (Sattva) and powerful action (Rajas). You can turn ideas into reality with amazing speed because you have very little holding you back. You're an idealist who gets things done." },
    hi: { archetype: "शुद्ध उपलब्धकर्ता", description: "आप स्पष्ट दृष्टि (सत्व) और शक्तिशाली क्रिया (रजस) का एक शक्तिशाली मिश्रण हैं। आप विचारों को आश्चर्यजनक गति से वास्तविकता में बदल सकते हैं क्योंकि आपके पास बहुत कम बाधा है। आप एक आदर्शवादी हैं जो काम पूरा करते हैं।" }
  },
  ST: {
    en: { archetype: "The Peaceful Anchor", description: "You combine clear wisdom (Sattva) with deep stability (Tamas). This makes you a profoundly calming presence in a chaotic world. People come to you for your steady and peaceful perspective." },
    hi: { archetype: "शांतिपूर्ण लंगर", description: "आप स्पष्ट ज्ञान (सत्व) को गहरी स्थिरता (तमस) के साथ जोड़ते हैं। यह आपको एक अराजक दुनिया में एक गहन शांत उपस्थिति बनाता है। लोग आपके स्थिर और शांतिपूर्ण दृष्टिकोण के लिए आपके पास आते हैं।" }
  },
  RS: {
    en: { archetype: "The Dynamic Creator", description: "You are a whirlwind of creative energy (Rajas) guided by clear insight (Sattva). You are a charismatic and innovative force, constantly coming up with new ideas and inspiring others to join you." },
    hi: { archetype: "गतिशील निर्माता", description: "आप रचनात्मक ऊर्जा (रजस) का एक बवंडर हैं जो स्पष्ट अंतर्दृष्टि (सत्व) द्वारा निर्देशित है। आप एक करिश्माई और अभिनव शक्ति हैं, जो लगातार नए विचार उत्पन्न करते हैं और दूसरों को अपने साथ जुड़ने के लिए प्रेरित करते हैं।" }
  },
  RT: {
    en: { archetype: "The Powerful Executor", description: "You have the unstoppable drive of Rajas and the grounding endurance of Tamas. This makes you a master of getting things done. You have the energy to start and the stability to finish, no matter the obstacle." },
    hi: { archetype: "शक्तिशाली निष्पादक", description: "आपके पास रजस की अजेय प्रेरणा और तमस की आधारित सहनशक्ति है। यह आपको चीजों को पूरा करने का स्वामी बनाता है। आपके पास शुरू करने की ऊर्जा और खत्म करने की स्थिरता है, चाहे कोई भी बाधा हो।" }
  },
  TS: {
    en: { archetype: "The Steady Guide", description: "Your deep stability (Tamas) is illuminated by a clear, guiding wisdom (Sattva). This makes you a patient, trustworthy, and compassionate guide. You move deliberately, and your actions are always filled with purpose." },
    hi: { archetype: "स्थिर मार्गदर्शक", description: "आपकी गहरी स्थिरता (तमस) एक स्पष्ट, मार्गदर्शक ज्ञान (सत्व) से रोशन है। यह आपको एक धैर्यवान, भरोसेमंद और दयालु मार्गदर्शक बनाता है। आप जानबूझकर चलते हैं, और आपके कार्य हमेशा उद्देश्य से भरे होते हैं।" }
  },
  TR: {
    en: { archetype: "The Determined Builder", description: "You have a powerful combination of endurance (Tamas) and drive (Rajas). You are a master builder, able to take on long, difficult projects and see them through with unwavering determination." },
    hi: { archetype: "दृढ़ निर्माता", description: "आपके पास सहनशक्ति (तमस) और प्रेरणा (रजस) का एक शक्तिशाली संयोजन है। आप एक मास्टर बिल्डर हैं, जो लंबी, कठिन परियोजनाओं को करने और उन्हें अटूट दृढ़ संकल्प के साथ पूरा करने में सक्षम हैं।" }
  }
}

export const UPSELL_COURSE_URL = "https://shikshanam.in/emotional-intelligence-with-samkhya-darshan/"
export const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwpYvh8j96v5gaUr44s29Rxo1xD8yxpPLdSAA-CFGdwf_EwVhMDQz8_4HhwnOD3ohDUYw/exec"
