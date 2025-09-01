import { I18nContent } from '@/types/guna-profiler'
import { gunaQuestions, gunaArchetypes } from '@/data/gunaProfilerData'

// Helper function to format questions for i18n
function formatQuestionsForI18n(language: 'en' | 'hi') {
  return gunaQuestions.map(q => ({
    id: q.id,
    question: q.question[language],
    options: q.options.map(opt => ({
      text: opt.text[language],
      guna: opt.guna
    }))
  }))
}

// Helper function to format archetypes for i18n
function formatArchetypesForI18n(language: 'en' | 'hi') {
  const formatted: Record<string, { archetype: string; description: string }> = {}
  for (const [key, value] of Object.entries(gunaArchetypes)) {
    formatted[key] = {
      archetype: value[language].archetype,
      description: value[language].description
    }
  }
  return formatted
}

export const i18nContent: Record<'en' | 'hi', I18nContent> = {
  en: {
    langLabel: "English",
    mainTitle: "Guṇa Profiler",
    mainSubtitle: "Discover your inner nature through ancient Vedic wisdom.",
    initialScreenSubtitle: "If you are on a quest for peace, balance, and spiritual insight, our Guṇa Profiler will simplify your journey.",
    discoverTitle: "What You'll Discover:",
    discoverPoint1: "🔹 Your Nature: Understand the unique mix of Sattva, Rajas, and Tamas in your personality.",
    discoverPoint2: "🔹 Personal Insights: See how this combination of the three Guṇas influences your thoughts, decisions, and emotions.",
    discoverPoint3: "🔹 Path to Balance: Receive simple, practical tips related to diet, colors, daily activities, etc., to support your self-development and balance.",
    startJourneyBtn: "🔸 Begin My Journey!",
    reportsGenerated: "Total Journeys Decoded",
    testimonials: [
      { text: "This helped me understand why I react the way I do - loved it!", author: "– Aman, Mumbai" },
      { text: "Incredibly accurate and insightful. A must-try for any seeker on a spiritual path.", author: "– Priya, Delhi" },
      { text: "The suggestions are so practical. I felt a shift in my energy within days.", author: "– Rajesh, Bengaluru" },
      { text: "A beautiful blend of ancient wisdom and modern psychology.", author: "– Sunita, Chennai" }
    ],
    instructionsTitle: "Instructions:",
    instruction1: "Answer each question based on your natural tendencies.",
    instruction2: "Choose the response that most authentically reflects you.",
    instruction3: "Be honest for accurate self-discovery.",
    questionCounter: (c, t) => `Question ${c} of ${t}`,
    answeredStatus: (a, t) => `${a}/${t} answered`,
    resultsTitle: "Your Guṇa Profile",
    resultsSubtitle: "Your personality analysis based on ancient Vedic wisdom.",
    overviewTab: "Overview",
    analysisTab: "In-Depth Analysis",
    recommendationsTab: "Suggestions",
    colorTherapyTab: "Color Therapy",
    retakeBtn: "Retake Assessment",
    shareBtn: "Share Results",
    rishiBtn: "Engage with Rishi",
    feedbackTitle: "Share Your Feedback",
    feedbackSubtitle: "How was your experience? Your feedback helps us improve.",
    feedbackPlaceholder: "Your comments...",
    submitFeedbackBtn: "Submit Feedback",
    dominant: "Dominant",
    sattva: "Sattva",
    rajas: "Rajas",
    tamas: "Tamas",
    regTitle: "Get Your Full Report",
    regSubtitle: "You're one step away! Provide your details to see your complete, personalized Guṇa profile.",
    regName: "Full Name",
    regEmail: "Email Address",
    regMobile: "Mobile Number (Optional)",
    regContinue: "Submit & See My Results",
    questions: formatQuestionsForI18n('en'),
    results: {
      archetypes: formatArchetypesForI18n('en'),
      analysis: {
        interplayTitle: "How Your Gunas Work Together",
        balanceTitle: "Your Path to Balance",
        shadowTitle: "Your Hidden Challenge",
        problemTitle: "Your Primary Challenge",
        solutionTitle: "A Path to Growth",
        interplay: {
          sattva: "Your dominant Sattva provides clarity and peace, which acts as a guiding light for your Rajasic energy and brings stability to your Tamasic nature. Your actions are thoughtful, and your rest is restorative because your inner wisdom is in charge.",
          rajas: "Your dominant Rajas is the engine of action in your life. It energizes your Sattvic ideas, turning them into reality, and overcomes Tamasic inertia. You are a doer, driven to create, achieve, and make an impact on the world around you.",
          tamas: "Your dominant Tamas provides a powerful foundation of stability and endurance. It grounds your Rajasic energy, preventing burnout, and gives substance to your Sattvic insights. You are the steady force that sees things through to the end."
        },
        balance: {
          sattva: "The key to balance for you is to ensure your peaceful nature doesn't lead to inaction. Gently channel your clarity into purposeful activities. Pair your contemplative practices with small, tangible actions to keep your energy flowing and grounded.",
          rajas: "Your path to balance lies in mindful rest. Your energy is a gift, but it needs to be recharged. Schedule moments of 'non-doing' into your day to calm your nervous system. This strategic stillness will make your actions even more powerful and focused.",
          tamas: "The path to balance for you is to invite gentle movement and fresh energy. Avoid getting stuck in routines by trying new things, engaging in light physical activity, and seeking out inspiring content. This helps to uplift your natural stability into positive action."
        },
        shadow: {
          sattva: "The shadow of Sattva is a tendency towards detachment that can become disconnected from the world. In excess, it can lead to a lack of empathy or a feeling of superiority. It's important to stay engaged with others and remember that true wisdom is compassionate and embodied.",
          rajas: "The shadow of Rajas is restlessness and a constant need for stimulation, which can lead to burnout, anxiety, and conflict. It's the 'more is better' mindset that can prevent you from enjoying the present moment and finding lasting peace.",
          tamas: "The shadow of Tamas is inertia, which can manifest as procrastination, stubbornness, or a resistance to healthy change. It's the comfort zone that becomes a cage, preventing you from reaching your full potential and experiencing the richness of life."
        },
        problems: {
          sattva: {
            problem: "Your gift of clarity can sometimes lead to getting lost in thought. You might have wonderful ideas but struggle to bring them into the real world, leading to a feeling of being stuck or unfulfilled.",
            solution: "The key is to ground your wisdom in action. Start by choosing one small, manageable idea and breaking it down into simple, practical steps. Taking that first step is your gateway to turning vision into reality."
          },
          rajas: {
            problem: "Your incredible drive is a superpower, but it can also lead to burnout. You might feel a constant need to be 'doing,' which can leave you feeling restless, scattered, and eventually exhausted.",
            solution: "The path to balance is learning to pause. Intentionally schedule short breaks for 'non-doing'—like a 10-minute walk without your phone. This isn't laziness; it's strategic rest that will make your actions more powerful."
          },
          tamas: {
            problem: "Your stability is a great strength, but it can sometimes turn into inertia or resistance to change. You might find yourself sticking to what's comfortable, even if it's no longer serving your growth.",
            solution: "Your path is to gently introduce new energy. Actively seek out inspiration—whether it's through uplifting music, a new hobby, or regular, gentle exercise. This helps move stagnant energy and invites fresh perspectives."
          }
        }
      }
    },
    recommendations: {
      dietaryTitle: "Food to Feel Your Best",
      activityTitle: "Activities for Harmony",
      colorTitle: "Colors for Your Energy",
      colorHowTo: "How to use:",
      challengeTitle: "A Challenge for Growth",
      solutionTitle: "An Actionable Step",
      challenges: {
        sattva: {
          challenge: "The risk for you is becoming too passive or detached, staying in the world of ideas without bringing them into reality.",
          solution: "This week, pick one small, practical task you've been putting off. Complete it from start to finish. Notice how good it feels to turn your clear thoughts into a finished action."
        },
        rajas: {
          challenge: "Your biggest risk is burnout. Your constant drive can leave you feeling exhausted and restless if you don't manage it wisely.",
          solution: "Schedule a 15-minute 'do nothing' break into your day. No phone, no planning—just sit or walk quietly. This intentional pause will recharge your energy for more effective action later."
        },
        tamas: {
          challenge: "Your greatest challenge is inertia or getting 'stuck' in a routine. Comfort can sometimes keep you from growing.",
          solution: "This week, do one thing that is slightly outside your comfort zone. Try a new type of exercise, cook a new recipe, or take a different route to work. The goal is to gently shake up your energy."
        }
      },
      dietary: {
        sattva: ["Fresh fruits and vegetables", "Whole grains like rice and oats", "Lightly cooked meals", "Herbal teas"],
        rajas: ["Spicy foods in moderation", "Sour and salty flavors", "Stimulants like coffee/tea (mindfully)", "A variety of tastes and textures"],
        tamas: ["Freshly cooked, light, and warm meals", "Foods that are easy to digest", "Mild spices like ginger and turmeric", "Avoiding leftovers and processed foods"]
      },
      activities: {
        sattva: ["Meditation and Yoga", "Spending quiet time in nature", "Reading spiritual texts", "Gentle morning walks"],
        rajas: ["Regular vigorous exercise", "Competitive sports", "Engaging in challenging projects", "Learning new skills"],
        tamas: ["Gentle stretching and Tai Chi", "Gardening or pottery", "Restorative yoga", "Maintaining a consistent sleep schedule"]
      },
      colorTherapy: {
        problemTitle: "Color Challenge",
        solutionTitle: "Color Solution",
        sattva: {
          colors: [
            { name: "White", hex: "#FFFFFF" },
            { name: "Light Blue", hex: "#ADD8E6" },
            { name: "Pale Yellow", hex: "#FFFFE0" },
            { name: "Pastels", hex: "#F1E4E8" }
          ],
          colorInfo: "These colors promote purity, tranquility, and clarity. They help calm the mind and elevate consciousness.",
          howToUse: [
            "Wear white or light-colored clothes during meditation or spiritual practice.",
            "Paint the walls of your meditation or study room with these colors.",
            "Use light-colored bed linens for peaceful sleep."
          ],
          problem: "An excess of light colors can sometimes make you feel 'spacey' or disconnected from reality. You might feel a lack of grounding energy needed for practical tasks.",
          solution: "Balance your Sattvic colors with small, grounding accents. A dark brown cushion, a small grey stone on your desk, or even dark green plants can provide the earthy stability you need."
        },
        rajas: {
          colors: [
            { name: "Red", hex: "#FF0000" },
            { name: "Orange", hex: "#FFA500" },
            { name: "Bright Pink", hex: "#FF69B4" },
            { name: "Gold", hex: "#FFD700" }
          ],
          colorInfo: "These vibrant colors stimulate energy, passion, and action. Use them to invigorate and energize your space.",
          howToUse: [
            "Use as accent colors (cushions, art) in your living room or home office to boost dynamism.",
            "Wear these colors when you need a boost of confidence or energy, like for a workout.",
            "Avoid overusing them in the bedroom as they can be over-stimulating."
          ],
          problem: "Too much Rajasic color can lead to overstimulation, restlessness, and even aggression. It can make it hard to relax and switch off your mind.",
          solution: "Use these powerful colors as accents, not as the main event. A single red cushion is better than a red wall. Balance them with calming, Sattvic colors like white or light blue to create a space that is both energetic and peaceful."
        },
        tamas: {
          colors: [
            { name: "Dark Blue", hex: "#00008B" },
            { name: "Brown", hex: "#A52A2A" },
            { name: "Grey", hex: "#808080" },
            { name: "Earthy Tones", hex: "#D2B48C" }
          ],
          colorInfo: "These colors provide stability, grounding, and a sense of security. They are ideal for creating a cozy and protected environment.",
          howToUse: [
            "Incorporate these colors in flooring, rugs, or heavy furniture to feel more grounded.",
            "Create a cozy reading nook with dark, earthy-toned blankets and cushions.",
            "Balance with lighter colors on the walls to prevent the space from feeling heavy or stagnant."
          ],
          problem: "An over-reliance on dark, Tamasic colors can create an environment that feels heavy, stagnant, or even depressing, reinforcing feelings of inertia.",
          solution: "The key is balance. Use these grounding colors for furniture or floors, but keep your walls light and bright (Sattvic white or pastels). Add pops of vibrant, Rajasic color like orange or gold to bring in energy and inspiration."
        }
      }
    },
    cta: {
      sattva: {
        icon: "fa-sun",
        title: "Turn Your Vision Into Reality",
        subtitle: "Your Sattvic clarity is a gift, but it can lead to inaction. Our Sāṅkhya EI journey will give you the practical tools to overcome this challenge and bring your beautiful insights into the world.",
        button: "Overcome Your Challenges"
      },
      rajas: {
        icon: "fa-fire",
        title: "Turn Your Fire Into Focus",
        subtitle: "Your Rajasic drive is a superpower, but it can lead to burnout. Our Sāṅkhya EI journey will teach you to channel that fire effectively, helping you achieve your goals without sacrificing your peace.",
        button: "Overcome Your Challenges"
      },
      tamas: {
        icon: "fa-mountain",
        title: "Turn Your Stability Into Strength",
        subtitle: "Your Tamasic stability is your foundation, but it can lead to feeling stuck. Our Sāṅkhya EI journey will give you the spark to overcome inertia and transform that powerful energy into lasting achievements.",
        button: "Overcome Your Challenges"
      }
    }
  },
  hi: {
    langLabel: "हिन्दी",
    mainTitle: "गुण प्रोफाइलर",
    mainSubtitle: "प्राचीन वैदिक ज्ञान के माध्यम से अपने आंतरिक स्वभाव की खोज करें।",
    initialScreenSubtitle: "यदि आप शांति, संतुलन और आध्यात्मिक अंतर्दृष्टि की तलाश में हैं, तो हमारा गुण प्रोफाइलर आपकी यात्रा को सरल बना देगा।",
    discoverTitle: "आप क्या खोजेंगे:",
    discoverPoint1: "🔹 आपका स्वभाव: अपने व्यक्तित्व में सत्व, रजस और तमस के अनूठे मिश्रण को समझें।",
    discoverPoint2: "🔹 व्यक्तिगत अंतर्दृष्टि: देखें कि तीन गुणों का यह संयोजन आपके विचारों, निर्णयों और भावनाओं को कैसे प्रभावित करता है।",
    discoverPoint3: "🔹 संतुलन का मार्ग: अपने आत्म-विकास और संतुलन का समर्थन करने के लिए आहार, रंग, दैनिक गतिविधियों आदि से संबंधित सरल, व्यावहारिक सुझाव प्राप्त करें।",
    startJourneyBtn: "🔸 मेरी यात्रा शुरू करें!",
    reportsGenerated: "कुल यात्राएं डिकोड की गईं",
    testimonials: [
      { text: "यह समझने में मेरी मदद की कि मैं इस तरह से प्रतिक्रिया क्यों करता हूँ - यह बहुत पसंद आया!", author: "– अमन, मुंबई" },
      { text: "अविश्वसनीय रूप से सटीक और ज्ञानवर्धक। आध्यात्मिक पथ पर चलने वाले हर साधक को इसे अवश्य आज़माना चाहिए।", author: "– प्रिया, दिल्ली" },
      { text: "सुझाव बहुत व्यावहारिक हैं। मैंने कुछ ही दिनों में अपनी ऊर्जा में बदलाव महसूस किया।", author: "– राजेश, बेंगलुरु" },
      { text: "प्राचीन ज्ञान और आधुनिक मनोविज्ञान का एक सुंदर मिश्रण।", author: "– सुनीता, चेन्नई" }
    ],
    instructionsTitle: "निर्देश:",
    instruction1: "प्रत्येक प्रश्न का उत्तर अपनी प्राकृतिक प्रवृत्तियों के आधार पर दें।",
    instruction2: "उस प्रतिक्रिया को चुनें जो आपको सबसे प्रामाणिक रूप से दर्शाती है।",
    instruction3: "सटीक आत्म-खोज के लिए ईमानदार रहें।",
    questionCounter: (c, t) => `प्रश्न ${c} / ${t}`,
    answeredStatus: (a, t) => `${a}/${t} उत्तर दिए गए`,
    resultsTitle: "आपकी गुण प्रोफ़ाइल",
    resultsSubtitle: "प्राचीन वैदिक ज्ञान पर आधारित आपका व्यक्तित्व विश्लेषण।",
    overviewTab: "अवलोकन",
    analysisTab: "गहराई से विश्लेषण",
    recommendationsTab: "सुझाव",
    colorTherapyTab: "रंग चिकित्सा",
    retakeBtn: "पुनः मूल्यांकन करें",
    shareBtn: "परिणाम साझा करें",
    rishiBtn: "ऋषि से जुड़ें",
    feedbackTitle: "अपनी प्रतिक्रिया साझा करें",
    feedbackSubtitle: "आपका अनुभव कैसा रहा? आपकी प्रतिक्रिया हमें बेहतर बनाने में मदद करती है।",
    feedbackPlaceholder: "आपकी टिप्पणियाँ...",
    submitFeedbackBtn: "प्रतिक्रिया जमा करें",
    dominant: "प्रमुख",
    sattva: "सत्व",
    rajas: "रजस",
    tamas: "तमस",
    regTitle: "अपनी पूरी रिपोर्ट प्राप्त करें",
    regSubtitle: "आप बस एक कदम दूर हैं! अपनी पूरी व्यक्तिगत गुण प्रोफ़ाइल देखने के लिए अपना विवरण प्रदान करें।",
    regName: "पूरा नाम",
    regEmail: "ईमेल पता",
    regMobile: "मोबाइल नंबर (वैकल्पिक)",
    regContinue: "सबमिट करें और मेरे परिणाम देखें",
    questions: formatQuestionsForI18n('hi'),
    results: {
      archetypes: formatArchetypesForI18n('hi'),
      analysis: {
        interplayTitle: "आपके गुण एक साथ कैसे काम करते हैं",
        balanceTitle: "संतुलन के लिए आपका मार्ग",
        shadowTitle: "आपकी छिपी हुई चुनौती",
        problemTitle: "आपकी प्राथमिक चुनौती",
        solutionTitle: "विकास का एक मार्ग",
        interplay: {
          sattva: "आपका प्रमुख सत्व स्पष्टता और शांति प्रदान करता है, जो आपकी राजसिक ऊर्जा के लिए एक मार्गदर्शक प्रकाश के रूप में कार्य करता है और आपके तामसिक स्वभाव में स्थिरता लाता है। आपके कार्य विचारशील हैं, और आपका आराम पुनर्स्थापनात्मक है क्योंकि आपका आंतरिक ज्ञान प्रभारी है।",
          rajas: "आपका प्रमुख रजस आपके जीवन में क्रिया का इंजन है। यह आपके सात्विक विचारों को सक्रिय करता है, उन्हें वास्तविकता में बदलता है, और तामसिक जड़ता पर काबू पाता है। आप एक कर्ता हैं, जो अपने आसपास की दुनिया पर प्रभाव डालने, प्राप्त करने और बनाने के लिए प्रेरित हैं।",
          tamas: "आपका प्रमुख तमस स्थिरता और सहनशक्ति का एक शक्तिशाली आधार प्रदान करता है। यह आपकी राजसिक ऊर्जा को आधार देता है, बर्नआउट को रोकता है, और आपकी सात्विक अंतर्दृष्टि को सार देता है। आप वह स्थिर शक्ति हैं जो चीजों को अंत तक देखती है।"
        },
        balance: {
          sattva: "आपके लिए संतुलन की कुंजी यह सुनिश्चित करना है कि आपका शांतिपूर्ण स्वभाव निष्क्रियता का कारण न बने। अपनी स्पष्टता को धीरे-धीरे उद्देश्यपूर्ण गतिविधियों में लगाएं। अपनी ऊर्जा को प्रवाहित और आधारित रखने के लिए अपनी चिंतनशील प्रथाओं को छोटी, ठोस क्रियाओं के साथ जोड़ें।",
          rajas: "आपके संतुलन का मार्ग सचेत आराम में निहित है। आपकी ऊर्जा एक उपहार है, लेकिन इसे रिचार्ज करने की आवश्यकता है। अपने तंत्रिका तंत्र को शांत करने के लिए अपने दिन में 'कुछ न करने' के क्षण निर्धारित करें। यह रणनीतिक शांति आपके कार्यों को और भी अधिक शक्तिशाली और केंद्रित बना देगी।",
          tamas: "आपके लिए संतुलन का मार्ग कोमल गति और ताजा ऊर्जा को आमंत्रित करना है। नई चीजों को आजमाकर, हल्की शारीरिक गतिविधि में संलग्न होकर, और प्रेरक सामग्री की तलाश करके दिनचर्या में फंसने से बचें। यह आपकी प्राकृतिक स्थिरता को सकारात्मक कार्रवाई में बदलने में मदद करता है।"
        },
        shadow: {
          sattva: "सत्व की छाया वैराग्य की ओर एक प्रवृत्ति है जो दुनिया से कट सकती है। अधिकता में, यह सहानुभूति की कमी या श्रेष्ठता की भावना का कारण बन सकती है। दूसरों के साथ जुड़े रहना और यह याद रखना महत्वपूर्ण है कि सच्चा ज्ञान दयालु और सन्निहित है।",
          rajas: "रजस की छाया बेचैनी और उत्तेजना की निरंतर आवश्यकता है, जो बर्नआउट, चिंता और संघर्ष का कारण बन सकती है। यह 'अधिक बेहतर है' मानसिकता है जो आपको वर्तमान क्षण का आनंद लेने और स्थायी शांति पाने से रोक सकती है।",
          tamas: "तमस की छाया जड़ता है, जो शिथिलता, हठ, या स्वस्थ परिवर्तन के प्रतिरोध के रूप में प्रकट हो सकती है। यह आराम क्षेत्र है जो एक पिंजरा बन जाता है, जो आपको अपनी पूरी क्षमता तक पहुंचने और जीवन की समृद्धि का अनुभव करने से रोकता है।"
        },
        problems: {
          sattva: {
            problem: "आपकी स्पष्टता का उपहार कभी-कभी विचारों में खो जाने का कारण बन सकता है। आपके पास अद्भुत विचार हो सकते हैं लेकिन उन्हें वास्तविक दुनिया में लाने के लिए संघर्ष करना पड़ सकता है, जिससे फंसा हुआ या अधूरा महसूस हो सकता है।",
            solution: "कुंजी अपने ज्ञान को क्रिया में आधार बनाना है। एक छोटे, प्रबंधनीय विचार को चुनकर शुरू करें और इसे सरल, व्यावहारिक चरणों में तोड़ दें। वह पहला कदम उठाना आपकी दृष्टि को वास्तविकता में बदलने का आपका प्रवेश द्वार है।"
          },
          rajas: {
            problem: "आपकी अविश्वसनीय प्रेरणा एक महाशक्ति है, लेकिन यह बर्नआउट का कारण भी बन सकती है। आपको लगातार 'कुछ करने' की आवश्यकता महसूस हो सकती है, जो आपको बेचैन, बिखरा हुआ और अंततः थका हुआ महसूस करा सकती है।",
            solution: "संतुलन का मार्ग रुकना सीखना है। 'कुछ न करने' के लिए जानबूझकर छोटे ब्रेक निर्धारित करें - जैसे कि अपने फोन के बिना 10 मिनट की सैर। यह आलस्य नहीं है; यह रणनीतिक आराम है जो आपके कार्यों को और अधिक शक्तिशाली बना देगा।"
          },
          tamas: {
            problem: "आपकी स्थिरता एक बड़ी ताकत है, लेकिन यह कभी-कभी जड़ता या परिवर्तन के प्रतिरोध में बदल सकती है। आप खुद को आरामदायक चीजों से चिपके हुए पा सकते हैं, भले ही यह अब आपके विकास की सेवा नहीं कर रहा हो।",
            solution: "आपका मार्ग धीरे-धीरे नई ऊर्जा का परिचय देना है। सक्रिय रूप से प्रेरणा की तलाश करें - चाहे वह उत्थानकारी संगीत, एक नया शौक, या नियमित, कोमल व्यायाम के माध्यम से हो। यह स्थिर ऊर्जा को स्थानांतरित करने और नए दृष्टिकोणों को आमंत्रित करने में मदद करता है।"
          }
        }
      }
    },
    recommendations: {
      dietaryTitle: "सबसे अच्छा महसूस करने के लिए भोजन",
      activityTitle: "सद्भाव के लिए गतिविधियाँ",
      colorTitle: "आपकी ऊर्जा के लिए रंग",
      colorHowTo: "कैसे उपयोग करें:",
      challengeTitle: "विकास के लिए एक चुनौती",
      solutionTitle: "एक कार्रवाई योग्य कदम",
      challenges: {
        sattva: {
          challenge: "आपके लिए जोखिम बहुत निष्क्रिय या अलग हो जाना है, विचारों की दुनिया में रहना और उन्हें वास्तविकता में नहीं लाना।",
          solution: "इस सप्ताह, एक छोटा, व्यावहारिक कार्य चुनें जिसे आप टाल रहे हैं। इसे शुरू से अंत तक पूरा करें। ध्यान दें कि अपने स्पष्ट विचारों को एक तैयार कार्रवाई में बदलना कितना अच्छा लगता है।"
        },
        rajas: {
          challenge: "आपका सबसे बड़ा जोखिम बर्नआउट है। यदि आप इसे बुद्धिमानी से प्रबंधित नहीं करते हैं तो आपकी निरंतर प्रेरणा आपको थका हुआ और बेचैन महसूस करा सकती है।",
          solution: "अपने दिन में 15 मिनट का 'कुछ न करें' ब्रेक निर्धारित करें। कोई फोन नहीं, कोई योजना नहीं - बस चुपचाप बैठें या चलें। यह जानबूझकर किया गया ठहराव बाद में अधिक प्रभावी कार्रवाई के लिए आपकी ऊर्जा को रिचार्ज करेगा।"
        },
        tamas: {
          challenge: "आपकी सबसे बड़ी चुनौती जड़ता या एक दिनचर्या में 'फंस' जाना है। आराम कभी-कभी आपको बढ़ने से रोक सकता है।",
          solution: "इस सप्ताह, एक ऐसा काम करें जो आपके आराम क्षेत्र से थोड़ा बाहर हो। एक नए प्रकार का व्यायाम आज़माएँ, एक नई रेसिपी बनाएँ, या काम पर एक अलग रास्ता अपनाएँ। लक्ष्य अपनी ऊर्जा को धीरे-धीरे हिलाना है।"
        }
      },
      dietary: {
        sattva: ["ताजे फल और सब्जियां", "चावल और जई जैसे साबुत अनाज", "हल्के पके हुए भोजन", "हर्बल चाय"],
        rajas: ["संयम में मसालेदार भोजन", "खट्टे और नमकीन स्वाद", "कॉफी/चाय जैसे उत्तेजक (ध्यान से)", "विभिन्न प्रकार के स्वाद और बनावट"],
        tamas: ["ताजा पका हुआ, हल्का और गर्म भोजन", "पचाने में आसान खाद्य पदार्थ", "अदरक और हल्दी जैसे हल्के मसाले", "बचे हुए और प्रसंस्कृत खाद्य पदार्थों से बचें"]
      },
      activities: {
        sattva: ["ध्यान और योग", "प्रकृति में शांत समय बिताना", "आध्यात्मिक ग्रंथों को पढ़ना", "सुबह की हल्की सैर"],
        rajas: ["नियमित जोरदार व्यायाम", "प्रतिस्पर्धी खेल", "चुनौतीपूर्ण परियोजनाओं में संलग्न होना", "नए कौशल सीखना"],
        tamas: ["कोमल स्ट्रेचिंग और ताई ची", "बागवानी या मिट्टी के बर्तन", "पुनर्स्थापनात्मक योग", "एक सुसंगत नींद अनुसूची बनाए रखना"]
      },
      colorTherapy: {
        problemTitle: "रंग चुनौती",
        solutionTitle: "रंग समाधान",
        sattva: {
          colors: [
            { name: "सफ़ेद", hex: "#FFFFFF" },
            { name: "हल्का नीला", hex: "#ADD8E6" },
            { name: "पीला", hex: "#FFFFE0" },
            { name: "पेस्टल", hex: "#F1E4E8" }
          ],
          colorInfo: "ये रंग पवित्रता, शांति और स्पष्टता को बढ़ावा देते हैं। वे मन को शांत करने और चेतना को ऊपर उठाने में मदद करते हैं।",
          howToUse: [
            "ध्यान या आध्यात्मिक अभ्यास के दौरान सफेद या हल्के रंग के कपड़े पहनें।",
            "अपने ध्यान या अध्ययन कक्ष की दीवारों को इन रंगों से पेंट करें।",
            "शांतिपूर्ण नींद के लिए हल्के रंग के बिस्तर लिनेन का उपयोग करें।"
          ],
          problem: "हल्के रंगों की अधिकता कभी-कभी आपको 'हवा में' या वास्तविकता से कटा हुआ महसूस करा सकती है। आपको व्यावहारिक कार्यों के लिए आवश्यक आधारित ऊर्जा की कमी महसूस हो सकती है।",
          solution: "अपने सात्विक रंगों को छोटे, आधारित लहजे के साथ संतुलित करें। एक गहरा भूरा कुशन, आपकी मेज पर एक छोटा ग्रे पत्थर, या यहां तक कि गहरे हरे पौधे भी आपको आवश्यक मिट्टी की स्थिरता प्रदान कर सकते हैं।"
        },
        rajas: {
          colors: [
            { name: "लाल", hex: "#FF0000" },
            { name: "नारंगी", hex: "#FFA500" },
            { name: "चमकीला गुलाबी", hex: "#FF69B4" },
            { name: "सुनहरा", hex: "#FFD700" }
          ],
          colorInfo: "ये जीवंत रंग ऊर्जा, जुनून और क्रिया को उत्तेजित करते हैं। अपनी जगह को प्रेरित और ऊर्जावान बनाने के लिए उनका उपयोग करें।",
          howToUse: [
            "गतिशीलता बढ़ाने के लिए अपने लिविंग रूम या होम ऑफिस में एक्सेंट रंगों (कुशन, कला) के रूप में उपयोग करें।",
            "जब आपको आत्मविश्वास या ऊर्जा की आवश्यकता हो, जैसे कि कसरत के लिए, तो ये रंग पहनें।",
            "बेडरूम में इनका अत्यधिक उपयोग करने से बचें क्योंकि वे अति-उत्तेजक हो सकते हैं।"
          ],
          problem: "बहुत अधिक राजसिक रंग अति-उत्तेजना, बेचैनी और यहां तक कि आक्रामकता का कारण बन सकता है। यह आराम करना और अपने दिमाग को बंद करना मुश्किल बना सकता है।",
          solution: "इन शक्तिशाली रंगों का उपयोग मुख्य घटना के रूप में नहीं, बल्कि लहजे के रूप में करें। एक लाल दीवार से बेहतर एक लाल कुशन है। उन्हें शांत, सात्विक रंगों जैसे सफेद या हल्के नीले रंग के साथ संतुलित करें ताकि एक ऐसा स्थान बनाया जा सके जो ऊर्जावान और शांतिपूर्ण दोनों हो।"
        },
        tamas: {
          colors: [
            { name: "गहरा नीला", hex: "#00008B" },
            { name: "भूरा", hex: "#A52A2A" },
            { name: "ग्रे", hex: "#808080" },
            { name: "मिट्टी के रंग", hex: "#D2B48C" }
          ],
          colorInfo: "ये रंग स्थिरता, और सुरक्षा की भावना प्रदान करते हैं। वे एक आरामदायक और सुरक्षित वातावरण बनाने के लिए आदर्श हैं।",
          howToUse: [
            "अधिक जमीनी महसूस करने के लिए इन रंगों को फर्श, कालीनों या भारी फर्नीचर में शामिल करें।",
            "गहरे, मिट्टी के रंग के कंबल और कुशन के साथ एक आरामदायक पढ़ने का कोना बनाएं।",
            "जगह को भारी या स्थिर महसूस होने से बचाने के लिए दीवारों पर हल्के रंगों से संतुलन बनाएं।"
          ],
          problem: "गहरे, तामसिक रंगों पर अत्यधिक निर्भरता एक ऐसा वातावरण बना सकती है जो भारी, स्थिर या यहां तक कि निराशाजनक महसूस हो, जो जड़ता की भावनाओं को मजबूत करता है।",
          solution: "कुंजी संतुलन है। इन आधारित रंगों का उपयोग फर्नीचर या फर्श के लिए करें, लेकिन अपनी दीवारों को हल्का और उज्ज्वल रखें (सात्विक सफेद या पेस्टल)। ऊर्जा और प्रेरणा लाने के लिए नारंगी या सोने जैसे जीवंत, राजसिक रंग के पॉप जोड़ें।"
        }
      }
    },
    cta: {
      sattva: {
        icon: "fa-sun",
        title: "अपनी दृष्टि को वास्तविकता में बदलें",
        subtitle: "आपकी सात्विक स्पष्टता एक उपहार है, लेकिन यह निष्क्रियता का कारण बन सकती है। हमारी सांख्य ईआई यात्रा आपको इस चुनौती को दूर करने और अपनी सुंदर अंतर्दृष्टि को दुनिया में लाने के लिए व्यावहारिक उपकरण देगी।",
        button: "अपनी चुनौतियों पर विजय प्राप्त करें"
      },
      rajas: {
        icon: "fa-fire",
        title: "अपनी आग को फोकस में बदलें",
        subtitle: "आपकी राजसिक प्रेरणा एक महाशक्ति है, लेकिन यह बर्नआउट का कारण बन सकती है। हमारी सांख्य ईआई यात्रा आपको उस आग को प्रभावी ढंग से प्रसारित करना सिखाएगी, जिससे आप अपनी शांति का त्याग किए बिना अपने महत्वाकांक्षी लक्ष्यों को प्राप्त कर सकें।",
        button: "अपनी चुनौतियों पर विजय प्राप्त करें"
      },
      tamas: {
        icon: "fa-mountain",
        title: "अपनी स्थिरता को ताकत में बदलें",
        subtitle: "आपकी तामसिक स्थिरता आपकी नींव है, लेकिन यह फंसा हुआ महसूस करने का कारण बन सकती है। हमारी सांख्य ईआई यात्रा आपको जड़ता को दूर करने और उस शक्तिशाली ऊर्जा को स्थायी उपलब्धियों में बदलने के लिए चिंगारी देगी।",
        button: "अपनी चुनौतियों पर विजय प्राप्त करें"
      }
    }
  }
}
