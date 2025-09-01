'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Inter, Cinzel, Noto_Serif } from 'next/font/google'
import Image from 'next/image'
import { storage } from '@/lib/utils'

// --- FONT SETUP (using next/font) ---
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-cinzel' });
const notoSerif = Noto_Serif({ subsets: ['latin'], style: ['normal', 'italic'], weight: ['400', '700'], variable: '--font-noto-serif' });

// --- DATA & CONTENT ---
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwwGYsycRPBoVL4xCyXKPENmFJhc9F-ISuCNhxPn-5kJD6LZLDFo3vqSeQEzF94Sxgb/exec';

const textContent = {
    en: {
        intro_title: "How Aligned Are You?",
        intro_subtitle: "A spiritual mirror reflecting your inner state",
        start_button: "Begin the Journey 🔱",
        continue_button: "Continue Journey ➡️",
        q1: "Think about last night's dream. What's your clearest memory of it?",
        q1_a1: "I remember the entire 'story' of the dream, the colors, the feelings—like I just watched a movie.",
        q1_a2: "I only remember the one intense moment, like a single scene that was either really scary or exciting.",
        q1_a3: "It's like trying to grab smoke. I know I dreamed, but the details vanished the moment I opened my eyes.",
        q1_a4: "I feel a vague 'mood' from the dream, like a lingering sadness or happiness, but no specific images.",
        q1_a5: "Complete blank. It feels like my head was empty all night, or I just don't dream anymore.",
        q2: "Your alarm goes off. What is the very first, unfiltered thought or feeling you have?",
        q2_a1: "A heavy feeling in my chest and the thought, 'Oh no, I have to face that difficult conversation/task today.'",
        q2_a2: "An immediate mental checklist of the day's tasks, and a rush of anxiety about getting it all done.",
        q2_a3: "My mind is still half in the dream world, trying to make sense of the strange story that was just playing out.",
        q2_a4: "A moment of quiet gratitude for the rest, followed by a calm planning of my morning coffee.",
        q2_a5: "A sense of pure awareness, of just being 'here' in my bed, before any thoughts about 'me' or my day begin.",
        q3: "How would you describe your physical and mental state when you wake up most mornings?",
        q3_a1: "I wake up already tired, like I've been running a marathon in my sleep. My mind is buzzing with worries.",
        q3_a2: "My body feels stiff and it takes a while to 'boot up.' I often wake up with a solution to a problem I was stressing about.",
        q3_a3: "I feel okay, but my mind is foggy for a while. I need coffee before I can really think straight.",
        q3_a4: "I wake up feeling genuinely rested and clear-headed, like my system had a complete reset.",
        q3_a5: "I feel a profound sense of peace, as if no time has passed. My body feels light and my mind is silent.",
        q4: "You receive unexpected criticism at work. How does the concept of 'ego' play out in your reaction?",
        q4_a1: "My ego flares up. I feel personally attacked and spend the rest of the day defending myself in my head.",
        q4_a2: "My ego is bruised. I try to act professional, but inside, I'm replaying their words and feeling insecure.",
        q4_a3: "I feel a sting, but I try to separate the 'me' from the work and look for any truth in the feedback.",
        q4_a4: "I observe the feeling of defensiveness arise, but I don't let it drive my response. I can listen openly.",
        q4_a5: "The concept feels distant. I hear the feedback as information, without a strong emotional charge attached to 'me.'",
        q5: "A memory of someone who betrayed you surfaces. What is the immediate, raw feeling in your body?",
        q5_a1: "A hot flush of anger or a cold knot of sadness in my stomach. The feeling is sharp and intense.",
        q5_a2: "My shoulders tense up, and I get an urge to distract myself by grabbing my phone or turning on the TV.",
        q5_a3: "A sigh of resignation. The sharp pain is gone, but a dull ache of the memory remains.",
        q5_a4: "A neutral sensation. I can see the memory, but it doesn't create a strong physical reaction anymore.",
        q5_a5: "A feeling of spaciousness. The memory is like a cloud passing in a vast sky; it doesn't touch me.",
        q6: "A worry about the future gets stuck in your head. How do you handle this mental loop?",
        q6_a1: "I fuel the loop, imagining every worst-case scenario until I feel physically sick with anxiety.",
        q6_a2: "I try to forcibly push the thought away, telling myself 'don't think about it,' which only makes it stronger.",
        q6_a3: "I analyze the worry, trying to 'solve' it with my mind, which just leads to more thinking and little relief.",
        q6_a4: "I notice the thought and label it 'worrying.' I acknowledge it without getting on the train with it.",
        q6_a5: "The loop rarely starts, but if it does, it dissolves quickly. My mind naturally returns to a state of quiet.",
        q7: "You see a photo of an ex-partner who you once loved deeply. What is your most honest reaction?",
        q7_a1: "A pang of regret or a wave of unresolved sadness. I wonder 'what if' things had been different.",
        q7_a2: "An immediate urge to close the photo and pretend I didn't see it. It's a no-go zone.",
        q7_a3: "A mix of nostalgia and curiosity. I might linger on the photo, thinking about the good and bad times.",
        q7_a4: "A gentle smile and a quiet wish for their well-being. The story is complete and I've made peace with it.",
        q7_a5: "It feels like looking at a character from a book I once read. I recognize them, but the emotional connection is gone.",
        q8: "Do old embarrassing moments or failures still have the power to make you cringe?",
        q8_a1: "Yes, a memory can pop up and make me physically cringe or groan out loud, as if it just happened.",
        q8_a2: "It still stings, and I quickly try to bury the memory and think of something else.",
        q8_a3: "It’s milder now, more like an awkward chuckle at my past self, but the discomfort is still there.",
        q8_a4: "Not really. I see those moments as part of my journey, necessary steps to becoming who I am now.",
        q8_a5: "The emotional sting has completely vanished. I can recall the event with the same neutrality as reading a grocery list.",
        q9: "You find a $100 bill on the street. What is your very first, gut-level impulse?",
        q9_a1: "A jolt of excitement followed by the thought, 'I can finally buy that thing I've been wanting!'",
        q9_a2: "To quickly pocket it and start mentally planning how to spend it on a fun experience.",
        q9_a3: "A feeling of gratitude, followed by a thought to save it for something I truly need.",
        q9_a4: "A desire to share the good fortune, perhaps by using it to treat a friend or donating a portion.",
        q9_a5: "A simple, calm acknowledgement of the find, with no immediate urge to do anything with it.",
        q10: "Your favorite gadget breaks. Beyond the inconvenience, what is the deeper emotional impact?",
        q10_a1: "A sense of panic and a feeling of 'I can't live without this.' My desire for a replacement is immediate and strong.",
        q10_a2: "Frustration and a feeling of being 'deprived.' I feel a constant, nagging desire for a new one.",
        q10_a3: "I'm annoyed, but I'm also aware of my attachment to it and try to use it as a moment for reflection.",
        q10_a4: "I see it as an opportunity to have less. I might even feel a subtle sense of relief.",
        q10_a5: "I feel a sense of freedom. One less thing to manage, charge, or worry about.",
        q11: "You're forced into a digital detox for a day (no phone, no internet). How does your nervous system react?",
        q11_a1: "I feel a phantom buzzing in my pocket. I'm restless, antsy, and feel a strong sense of FOMO (Fear Of Missing Out).",
        q11_a2: "The silence is deafening at first. I feel bored, and the urge to 'just check' something is almost constant.",
        q11_a3: "I resist for a while, but eventually I cave and find a way to get a quick hit of information.",
        q11_a4: "After an initial restlessness, a deep sense of calm sets in. The world seems to slow down.",
        q11_a5: "I feel my senses come alive. My thoughts become clearer, I'm more creative, and I feel deeply present in my own life.",
        q12: "You're sitting in a waiting room with no distractions—no phone, no magazines. What is your inner experience?",
        q12_a1: "My mind races, jumping from one worry to the next. I start fidgeting and feel an urgent need to escape the silence.",
        q12_a2: "I'm okay for a minute, but then I start people-watching or eavesdropping to have some mental stimulation.",
        q12_a3: "I try to practice mindfulness, but my mind keeps wandering off. I find moments of peace, but they are fleeting.",
        q12_a4: "I feel a quiet contentment. I can simply sit and observe the room without needing to be entertained.",
        q12_a5: "The external silence merges with my inner silence. It's a blissful, restorative experience.",
        q13: "Someone cuts you off in traffic and you almost have an accident. After the initial shock, what is your lasting reaction?",
        q13_a1: "I'm filled with rage. I might honk, yell, and spend the next ten minutes replaying the event and fuming.",
        q13_a2: "My heart is pounding. I feel hurt and shaken, and I drive extra cautiously for the rest of the day.",
        q13_a3: "I feel a flash of anger, but I try to let it go quickly to avoid ruining my day.",
        q13_a4: "I feel gratitude that everyone is safe, and I send a silent wish for the other driver to be safe too.",
        q13_a5: "I observe the adrenaline rush in my body, but my mind remains calm. The event passes through me without leaving a residue.",
        q14: "How do you internally react when a loved one is being irrational and emotional?",
        q14_a1: "I feel an intense urge to correct their logic and show them why they are 'wrong.' It's frustrating for me.",
        q14_a2: "I get emotionally triggered myself. I either absorb their anxiety or get irritated by their drama.",
        q14_a3: "I try to stay logical and detached, which can sometimes make them feel like I'm being cold or uncaring.",
        q14_a4: "I listen to their feelings without judgment, recognizing that their emotional reality is true for them in that moment.",
        q14_a5: "I can feel the pain or fear that is underneath their irrationality and I respond to that, holding a space of compassion for them.",
        q15: "You're in a discussion about a topic you're passionate about, and someone completely disagrees with you. What is your primary goal?",
        q15_a1: "My goal is to win the argument and prove that my perspective is the correct one.",
        q15_a2: "I get frustrated that they don't 'get it,' but I'll probably drop the conversation to avoid a real fight.",
        q15_a3: "My goal is to 'agree to disagree' and maintain a peaceful, friendly atmosphere.",
        q15_a4: "My goal is to genuinely understand *why* they hold their perspective, even if I don't agree with it.",
        q15_a5: "I see both our viewpoints as different facets of a larger truth, shaped by our unique life experiences.",
        q16: "You see something on the street that deeply disturbs you (e.g., poverty, cruelty). How does that image live inside you afterwards?",
        q16_a1: "It triggers a strong judgment or anger towards the people or system I believe is responsible.",
        q16_a2: "It reinforces a feeling of hopelessness about the state of the world, leaving me feeling sad and powerless.",
        q16_a3: "It creates a personal fear: 'I hope that never happens to me or my family.'",
        q16_a4: "It sparks a deep sense of compassion and a question: 'What can I do to help?'",
        q16_a5: "I experience it as a painful, but integral, part of life's complex dance, and I hold it in my awareness without being consumed by it.",
        q17: "You're listening to a friend talk about their problems. How deeply do you connect with their emotional state?",
        q17_a1: "I'm mostly in my head, thinking about what advice I should give them to solve their problem.",
        q17_a2: "I feel sympathy for them, but from a distance. I understand their problem logically.",
        q17_a3: "I can sense their sadness or happiness, but I'm careful not to get too drawn into it.",
        q17_a4: "I can feel a shadow of their emotion in my own body. If they are anxious, I might feel a tightness in my chest.",
        q17_a5: "I feel a direct, unfiltered transmission of their emotional state. It's like an invisible current flowing between us.",
        q18: "If you decide to post something on social media, what is the truest motivation behind clicking 'share'?",
        q18_a1: "A desire for validation—the likes, comments, and shares make me feel seen and important.",
        q18_a2: "A need to document my life and share my experiences, partly to prove to myself and others that I'm living a good life.",
        q18_a3: "A genuine desire to share something I find beautiful or inspiring, but I still feel a bit disappointed if it doesn't get much of a reaction.",
        q18_a4: "A spontaneous overflow of joy or creativity. The act of sharing is the reward itself, regardless of the response.",
        q18_a5: "The urge rarely arises. My experiences feel complete and fulfilling without the need for an external audience.",
        q19: "You cooked a beautiful meal for your family, and everyone eats it without a single comment. How do you feel?",
        q19_a1: "I feel resentful and unappreciated. A voice in my head says, 'Why do I even bother?'",
        q19_a2: "I feel a pang of disappointment and might make a passive-aggressive comment later on.",
        q19_a3: "I feel a little let down, but I remind myself that they enjoyed it, even if they didn't say so.",
        q19_a4: "My primary joy came from the process of cooking and the act of giving, so their silence doesn't diminish it.",
        q19_a5: "I feel a deep sense of contentment just watching them eat. Their nourishment is my fulfillment.",
        q20: "How important is praise or external validation for you to feel fulfilled in your work or hobbies?",
        q20_a1: "It's the fuel in my engine. Without it, I lose motivation and question if I'm any good.",
        q20_a2: "It's a huge motivator. Positive feedback makes me work harder and feel more confident.",
        q20_a3: "I try not to rely on it, but I admit it's a powerful boost when it comes.",
        q20_a4: "I've learned to find validation from within. Praise is a nice bonus, not a necessity.",
        q20_a5: "My fulfillment comes from the act of creation itself and my own inner sense of a job well done.",
        result_header_title: "Your Sacred Alignment Report for <span class='user-name'></span>",
        result_header_subtitle: "The divine mirror reveals your truth",
        data_collection_heading: "One Final Step...",
        data_collection_subtitle: "Enter your name to personalize your report and unveil your sacred path.",
        label_name: "Your First Name:",
        label_email: "Email ID:",
        label_mobile: "Mobile Number (10 digits):",
        submit_data_button: "Reveal My Personalised Report",

        // --- ENHANCED RESULT CONTENT ---
        res_unbound_title: "The Unbound Spirit",
        res_unbound_sanskrit: "(Paramukta Ātman)",
        res_unbound_archetype: "Deeply Aligned",
        res_unbound_path: `<h5><span class="user-name"></span>, This is Your Path</h5><p>You see life with remarkable clarity and peace. You're like the deep ocean—calm and steady within, even when there are waves on the surface. For you, spirituality isn't just a practice; it's your natural way of being. The ego, that sense of a separate 'me,' is no longer in the driver's seat. It's a tool you can use, but you are not defined by it.</p><p><strong>Key Qualities:</strong> Inner Silence, Equanimity, Spontaneity, Non-attachment.<br><strong>Guiding Principle:</strong> "I am the silent witness to life's divine play."</p><p>Your default state is a profound inner quiet that isn't easily disturbed by the world's chaos. People likely feel a sense of calm just by being around you. You've become a source of silent strength, showing others what's possible when you live from a place of true inner freedom.</p>`,
        res_unbound_challenges: `<h5>How This Shows Up in Daily Life</h5><p>Even with this deep alignment, subtle challenges arise:</p><ul><li><strong>The Comfort of Calm:</strong> You might find yourself preferring your own peaceful bubble, subtly avoiding messy or "low-vibe" people and situations. You might tell yourself it's to protect your energy, when it's actually a subtle attachment to your state of peace.</li><li><strong>The Empathy Gap:</strong> Because you see the bigger picture, the intense day-to-day struggles of others can feel distant. You might offer profound wisdom when they just need a hug, leading to a feeling of loving detachment that can be perceived as coldness.</li><li><strong>The Plateau of Arrival:</strong> It's easy to feel like you've 'made it' and the journey is done. This can unintentionally halt the impulse for even deeper, more subtle unfoldings of consciousness. The ocean is endless; there are always new depths to explore.</li></ul><p><strong>The Way Forward:</strong> Your path is no longer about seeking freedom, but about skillfully expressing it. It's about moving from being a static lighthouse to a flowing river of grace, nourishing everything you touch without losing your source.</p>`,
        res_unbound_recommendations: `<h4>Recommendations for <span class="user-name"></span></h4><div class="recommendation-point"><strong>1. Practice "Compassionate Engagement."</strong><p>This week, consciously choose to engage with a situation or person you might normally avoid. It could be listening to a complaining family member without trying to fix them, or volunteering for a task that feels chaotic. <strong>Why this helps:</strong> This challenges the subtle ego that clings to its own peace, teaching you to be the calm *in* the storm, not just away from it. It transforms your inner state into an active, healing presence.</p></div><div class="recommendation-point"><strong>2. Mentor Without a Title.</strong><p>You don't need a certificate to share your presence. Identify one person in your life who seems to be struggling and simply decide to be a stable, loving presence for them. Check in on them. Listen more than you speak. Offer your calm, not your solutions. <strong>Why this helps:</strong> This grounds your universal wisdom in practical, human connection. It's the practice of embodying Shiva's compassion, one relationship at a time.</p></div><div class="recommendation-point"><strong>3. Create from Silence.</strong><p>Engage in a creative act with no goal of producing something "good." Paint, write, dance, or garden purely for the joy of the movement and expression. The goal is to let the silence and peace you feel take a form. <strong>Why this helps:</strong> This allows the formless to become form through you, a direct expression of the divine play (Lila). It moves your realization from a passive state to a dynamic, creative force.</p></div>`,
        res_harmonious_title: "The Harmonious Seeker",
        res_harmonious_sanskrit: "(Samatā-Sādhaka)",
        res_harmonious_archetype: "Consciously Balancing",
        res_harmonious_path: `<h5><span class="user-name"></span>, This is Your Path</h5><p>You are on a beautiful and sincere spiritual path, a true alchemist turning daily life into spiritual gold. You've had those 'aha!' moments—flashes of deep peace or connection that you know are real. This inner knowing is your guide as you navigate the busy-ness of the modern world. You're not trying to escape life; you're bravely trying to find your peaceful center right in the middle of it.</p><p><strong>Key Qualities:</strong> Sincerity, Dedication, Awareness, Integration.<br><strong>Guiding Principle:</strong> "How can I bring my inner peace into this moment?"</p><p>Your journey is the noble art of balance. You juggle work deadlines, family needs, and personal relationships while also trying to stay connected to your true self. This balancing act itself has become your sacred practice.</p>`,
        res_harmonious_challenges: `<h5>How This Shows Up in Daily Life</h5><p>Your main challenge is the frustrating gap between what you *know* spiritually and how you *react* in the heat of the moment. You have the wisdom, but old habits die hard.</p><ul><li>You have a wonderful meditation in the morning, feeling spacious and calm, only to find your entire nervous system hijacked by a single critical email or a difficult conversation an hour later.</li><li>You know intellectually that getting angry at traffic is pointless, but you still find yourself gripping the steering wheel, tense and irritated, feeling guilty about it afterwards.</li><li>Your spiritual practice can sometimes feel like another chore on your to-do list, a subtle pressure to be a "good spiritual person," which ironically creates more tension.</li><li>You are often your own harshest critic, judging yourself for not being more "present" or "zen," which creates a painful cycle of spiritual striving and feeling like you're failing.</li></ul><p><strong>The Way Forward:</strong> Your path isn't about gaining more knowledge, but about embodiment. It's about installing peace as your consciousness's default operating system, so it runs automatically in the background of your life.</p>`,
        res_harmonious_recommendations: `<h4>Recommendations for <span class="user-name"></span></h4><div class="recommendation-point"><strong>1. Practice the "Sacred Pause."</strong><p>The next time you feel triggered (by a comment, an email, a situation), your only job is to create a 3-second pause before you react. In those 3 seconds, take one conscious breath. That's it. Don't try to be calm or spiritual. Just pause. <strong>Why this helps:</strong> This single act breaks the hypnotic spell of reactivity. It creates a tiny space between the stimulus and your response, and in that space, a new, more conscious choice becomes possible.</p></div><div class="recommendation-point"><strong>2. Master the "Mindful Transition."</strong><p>Pay attention to the moments *between* your daily activities. As you close your laptop after work, take three deep breaths before you stand up. As you get out of your car, feel your feet on the ground for a moment before walking into your house. <strong>Why this helps:</strong> We don't get stressed from one big event, but from the accumulation of hundreds of tiny, un-processed moments. This practice prevents stress from piling up and helps you start each new activity from a cleaner slate.</p></div><div class="recommendation-point"><strong>3. Redefine Your Practice as "Good Enough."</strong><p>For one week, commit to just 5 minutes of your spiritual practice (meditation, chanting, etc.) each day. If you do more, great, but 5 minutes is a complete success. Let go of the need for the "perfect" hour-long session. <strong>Why this helps:</strong> This removes the pressure and judgment that often surround spiritual practice. Consistency is far more powerful than intensity. You are building a new habit, and celebrating small, consistent wins makes it sustainable and joyful.</p></div>`,
        res_reflective_title: "The Reflective Soul",
        res_reflective_sanskrit: "(Vicāra-Jīvā)",
        res_reflective_archetype: "Introspective Journey",
        res_reflective_path: `<h5><span class="user-name"></span>, This is Your Path</h5><p>You have a brilliant and curious mind, a master cartographer of the inner world. It has led you to ask life's big questions and seek profound truths. You've likely read many books and thought deeply about the nature of reality. You understand spiritual concepts with a clarity that few possess. Your mind has been your greatest tool for seeking truth.</p><p><strong>Key Qualities:</strong> Intellect, Curiosity, Analysis, Truth-seeking.<br><strong>Guiding Principle:</strong> "If I can just understand it completely, I will be free."</p><p>However, this great strength has become your biggest hurdle. You may find yourself 'thinking' about spirituality more than you 'feel' it. It's like knowing the chemical composition of water (H₂O) but still feeling thirsty. There's a frustrating gap between your intellectual 'aha!' moments and lasting peace in your emotional life.</p>`,
        res_reflective_challenges: `<h5>How This Shows Up in Daily Life</h5><p>You might be living in a beautiful prison of your own concepts, trying to think your way to a feeling of peace.</p><ul><li>You experience 'analysis paralysis' over simple decisions, like what to eat for dinner, because you're weighing every possible pro and con, leaving you feeling stuck.</li><li>When meditating, you have a relentless inner commentator that's judging the experience: "Am I doing this right? Was that a moment of peace? Oh, now I'm thinking about thinking."</li><li>When a wave of old sadness arises, your mind immediately jumps in to analyze its origin ("Oh, this is my inner child wound..."), but the intellectual understanding does nothing to soothe the painful feeling itself.</li><li>You often feel a subtle sense of being disconnected from life, like you're watching your own experiences through a screen rather than being the one living them.</li></ul><p><strong>The Way Forward:</strong> Your path to freedom lies in bravely stepping off the map (your mind) and into the territory (your direct experience). It's a journey from the head to the heart, from knowing to *being*.</p>`,
        res_reflective_recommendations: `<h4>Recommendations for <span class="user-name"></span></h4><div class="recommendation-point"><strong>1. Practice "Name It and Feel It."</strong><p>The next time you feel a strong emotion, resist the urge to analyze *why*. Instead, do two things: 1) Give it a simple name ("This is anxiety," "This is sadness"). 2) Ask "Where do I feel this in my body?" Then, just bring your gentle, curious attention to that physical sensation (e.g., tightness in your chest, a knot in your stomach). <strong>Why this helps:</strong> This pulls you out of the mental story and grounds you in the raw, physical reality of the emotion. You cannot think your way out of a feeling, but you can feel your way through it. This is how energy gets released instead of recycled.</p></div><div class="recommendation-point"><strong>2. Take a "Sensory Walk."</strong><p>Go for a 10-minute walk with a specific mission: to find five things you can see, four things you can feel (the air on your skin, your feet in your shoes), three things you can hear, two things you can smell, and one thing you can taste (even if it's just the air). <strong>Why this helps:</strong> This is a powerful mindfulness technique that forcibly pulls your attention out of your racing mind and into the present moment through your senses. It's a mini-vacation from the tyranny of thought.</p></div><div class="recommendation-point"><strong>3. Schedule "Heart Time."</strong><p>For 5 minutes a day, put your hand over your heart, close your eyes, and think of one person, pet, or place that you genuinely love or appreciate. Try to feel the *sensation* of gratitude or warmth in your chest. Don't just think about it; feel it. <strong>Why this helps:</strong> Your mind is a well-worn neural pathway. This practice begins to build a new, "heart-centered" neural pathway. It's like going to the gym for your heart, strengthening your ability to feel instead of just think.</p></div>`,
        res_awakener_title: "The Awakener",
        res_awakener_sanskrit: "(Bodha-Praṇetā)",
        res_awakener_archetype: "Guarding the Self",
        res_awakener_path: `<h5><span class="user-name"></span>, This is Your Path</h5><p>You are a person of immense strength, willpower, and resilience. You are the ruler of your own kingdom, a fortress built on your ability to be in control, get things done, and protect yourself. This inner strength has been your greatest asset, helping you succeed and feel safe in a chaotic world. You are strong, capable, and not easily defeated.</p><p><strong>Key Qualities:</strong> Willpower, Determination, Control, Resilience.<br><strong>Guiding Principle:</strong> "If I can manage everything perfectly, I will be safe."</p><p>However, you may be realizing that the cost of this constant control is exhaustion. A part of you is longing for a different kind of freedom—the freedom of release. This creates a deep conflict. The idea of 'surrender' can feel like weakness or failure, a threat to the very identity you've worked so hard to build.</p>`,
        res_awakener_challenges: `<h5>How This Shows Up in Daily Life</h5><p>Your life can feel like a high-stress, full-time job of managing everything and everyone. This constant vigilance is the primary source of your tension.</p><ul><li>You have a deep-seated fear of uncertainty. You over-plan vacations down to the hour, create elaborate to-do lists, and mentally rehearse conversations to control every possible outcome.</li><li>You find it almost impossible to truly relax. Even on a beach, a part of your mind is 'on duty,' scanning for problems or thinking about what needs to be done next. You call it "being responsible."</li><li>In relationships, you struggle with vulnerability. You're much more comfortable being the one giving support than receiving it, as it keeps you in a position of strength and control.</li><li>You might even apply this to spirituality, accumulating practices and knowledge to build a 'bulletproof' spiritual ego, rather than genuinely letting go into the mystery.</li></ul><p><strong>The Way Forward:</strong> Your path is to discover that true, unshakable power lies not in holding on tighter, but in having the courage to open your hands. It's about redefining surrender not as giving up, but as the ultimate act of intelligence—aligning with the flow of life itself.</p>`,
        res_awakener_recommendations: `<h4>Recommendations for <span class="user-name"></span></h4><div class="recommendation-point"><strong>1. Practice "Intentional Imperfection."</strong><p>Choose one low-stakes task this week and decide to do it to only 80% of your usual standard. It could be sending an email that is "good enough" instead of perfect, or leaving one part of a room messy. <strong>Why this helps:</strong> This is like an allergy shot for your perfectionism. It teaches your nervous system, in a safe and controlled way, that the world doesn't fall apart when you're not in 100% control. It loosens the grip of the "must be perfect" mind.</p></div><div class="recommendation-point"><strong>2. Ask for Help with Something Small.</strong><p>This week, find one small thing you can ask for help with that you would normally do yourself. It could be asking a colleague to review a document, asking your partner to make a decision about dinner, or asking a friend for advice and actually listening to it. <strong>Why this helps:</strong> This directly challenges the part of you that believes "I have to do it all myself." It builds the muscle of interdependence and shows you that receiving can be an act of strength, not weakness.</p></div><div class="recommendation-point"><strong>3. Schedule "Unstructured Time."</strong><p>Block out 20 minutes in your calendar with the title "No Plan." In this time, your only job is to *not* have a plan. You can sit, walk, or stare out a window, but you cannot do a task from your to-do list. Resist the urge to be productive. <strong>Why this helps:</strong> Your mind is addicted to control and structure. This practice starves the addiction. It creates a space for spontaneity and allows you to discover what wants to happen, rather than what you think *should* happen.</p></div>`,
        res_emerging_title: "The Emerging Consciousness",
        res_emerging_sanskrit: "(Prabuddha-Cetanā)",
        res_emerging_archetype: "Seeking Wholeness",
        res_emerging_path: `<h5><span class="user-name"></span>, This is Your Path</h5><p>Please read this with great kindness for yourself. This result does not mean you are broken; it means you are incredibly resilient. You've likely weathered intense storms—prolonged stress, deep loss, or overwhelming confusion. To protect you, your wise inner system has entered a state of 'low power mode'—like a precious seed waiting safely under the snow for the warmth of spring.</p><p><strong>Key Qualities:</strong> Resilience, Stillness, Introspection, Latent Potential.<br><strong>Guiding Principle:</strong> "I must conserve my energy to survive."</p><p>Your daily life might feel heavy, foggy, or disconnected. Just getting through the day can be a monumental effort. Please know this with certainty: your inner light has not gone out. It is simply gathered deep inside, waiting for a feeling of safety to emerge once more.</p>`,
        res_emerging_challenges: `<h5>How This Shows Up in Daily Life</h5><p>Living in this protective 'freeze' state is exhausting. It's not apathy; it's an active, unconscious process of holding back a flood of unprocessed pain and energy.</p><ul><li>You often feel disconnected from your body, like you are observing your own life from a distance or through a thick pane of glass. Emotions and physical sensations can feel dull.</li><li>There is a persistent, low-grade hum of anxiety or a sense of inexplicable dread that you can't seem to shake, no matter how good things might look on the outside.</li><li>You find yourself 'numbing out' with activities like endless social media scrolling, binge-watching TV, or overeating—not for pleasure, but for a momentary reprieve from the inner static.</li><li>Well-meaning advice like "just be positive" or "choose happiness" feels hollow and impossible, and can even make you feel more broken and misunderstood.</li></ul><p><strong>The Way Forward:</strong> Your journey is not about forcing yourself to feel better. It is about gently creating a sense of safety within your own body and nervous system. It's about signaling to every cell that the storm has passed and it is now safe to emerge.</p>`,
        res_emerging_recommendations: `<h4>Recommendations for <span class="user-name"></span></h4><div class="recommendation-point"><strong>1. Practice "Soothing Touch."</strong><p>Several times a day, gently place one hand on your heart and the other on your belly. You don't need to do anything else. Just feel the warmth and gentle pressure of your own hands on your body for 2-3 minutes. <strong>Why this helps:</strong> This is a powerful, non-verbal signal of safety to your nervous system. It activates the calming part of your autonomic nervous system (the parasympathetic branch) and directly counteracts the 'freeze' response. It says, "I am here. You are safe."</p></div><div class="recommendation-point"><strong>2. Find Your "Anchor Point."</strong><p>When you feel overwhelmed or dissociated, find an "anchor point" in the present moment. Feel the sensation of your feet planted firmly on the floor. Notice the weight of your body in your chair. Grip a cup of warm tea and feel the heat in your hands. <strong>Why this helps:</strong> The freeze response pulls your consciousness out of your body. These simple, physical sensations act as a gentle anchor, pulling your awareness back into the safety of the present moment and the physical reality of your body.</p></div><div class="recommendation-point"><strong>3. Notice One "Micro-Pleasure."</strong><p>Your only goal for the day is to find and acknowledge one tiny, pleasant sensory experience. It could be the taste of your morning coffee for three seconds, the feeling of a soft blanket, the sound of a bird outside your window. No need to force it or make it a big deal. Just notice it. "That's nice." <strong>Why this helps:</strong> Your nervous system is currently wired to scan for threats. This practice gently and slowly begins to retrain it to also look for moments of goodness, safety, and pleasure, no matter how small. It's the beginning of the thaw.</p></div>`,
        // --- Dynamic Course CTA Content (NEW) ---
        course_cta_button_text: "Explore the Path 🔱",
        course_cta_title: "Your Next Step in Awakening",
        res_unbound_course_cta: "As an Unbound Spirit, you've experienced deep states of peace. Our Kashmir Shaivism course offers the advanced teachings to help you beautifully express this profound realization and integrate it into every facet of your life.",
        res_harmonious_course_cta: "As a Harmonious Seeker, you're bridging the spiritual and material. Our Kashmir Shaivism course provides the essential map and tools to close the gap between knowing peace and *living* peace, even amidst life's chaos.",
        res_reflective_course_cta: "As a Reflective Soul, your powerful mind seeks truth. Our Kashmir Shaivism course guides you on the crucial journey from the head to the heart, helping you directly experience the profound truths you've only intellectually understood.",
        res_awakener_course_cta: "As The Awakener, your strength is control. Our Kashmir Shaivism course reveals the sublime power in surrender, teaching you to align with life's flow and find the unshakeable safety you seek without the exhaustion of control.",
        res_emerging_course_cta: "As an Emerging Consciousness, your path is one of gentle thawing. Our Kashmir Shaivism course provides a safe, foundational container to understand your experience and gently cultivate the inner safety needed for your light to shine brightly again.",
        retake_button: "Retake the Journey",
        feedback_title: "Did you find this insightful?",
        feedback_thanks: "Thank you for your feedback!",
        feedback_submitted_thanks: "Thank you! Your feedback has been received.",
        testimonials_title: "Voices of Awakening",
        testimonial_1_quote: "This quiz was a profound mirror! The insights were surprisingly accurate and resonated deeply with my inner journey. It truly felt like Shiva was speaking through it.",
        testimonial_1_author: "Priya S.",
        testimonial_2_quote: "I've explored many spiritual paths, but this quiz cut straight to the core of my current state. The 'Daily Life' tab described my inner world with shocking accuracy. It's given me a clear direction.",
        testimonial_2_author: "Rahul M.",
        testimonial_3_quote: "The cinematic experience, the questions... this wasn't just a quiz, it was a meditation. The result inspired me to finally commit to a deeper practice.",
        testimonial_3_author: "Ananya D.",
        whatsapp_cta_text: "Join our vibrant community for daily insights and support!",
        whatsapp_button_text: "Join Community"
    }
};

const questions = [
    { qKey: "q1", answers: [
        { aKey: "q1_a1", scores: { unbound: 4, harmonious: 3, reflective: 2, awakener: 1, emerging: 0 }, tag: 'awareness' },
        { aKey: "q1_a2", scores: { unbound: 3, harmonious: 4, reflective: 3, awakener: 2, emerging: 1 }, tag: 'awareness' },
        { aKey: "q1_a3", scores: { unbound: 1, harmonious: 2, reflective: 4, awakener: 3, emerging: 2 }, tag: 'mind' },
        { aKey: "q1_a4", scores: { unbound: 0, harmonious: 1, reflective: 2, awakener: 4, emerging: 3 }, tag: 'past' },
        { aKey: "q1_a5", scores: { unbound: 0, harmonious: 0, reflective: 1, awakener: 2, emerging: 4 }, tag: 'disconnection' }
    ]},
    { qKey: "q2", answers: [
        { aKey: "q2_a1", scores: { unbound: 0, harmonious: 0, reflective: 1, awakener: 2, emerging: 4 }, tag: 'disconnection' },
        { aKey: "q2_a2", scores: { unbound: 1, harmonious: 1, reflective: 2, awakener: 4, emerging: 3 }, tag: 'control' },
        { aKey: "q2_a3", scores: { unbound: 2, harmonious: 3, reflective: 4, awakener: 2, emerging: 1 }, tag: 'awareness' },
        { aKey: "q2_a4", scores: { unbound: 3, harmonious: 4, reflective: 3, awakener: 1, emerging: 0 }, tag: 'harmony' },
        { aKey: "q2_a5", scores: { unbound: 4, harmonious: 3, reflective: 2, awakener: 0, emerging: 0 }, tag: 'awareness' }
    ]},
    { qKey: "q3", answers: [
        { aKey: "q3_a1", scores: { unbound: 0, harmonious: 0, reflective: 1, awakener: 2, emerging: 4 }, tag: 'disconnection' },
        { aKey: "q3_a2", scores: { unbound: 1, harmonious: 1, reflective: 2, awakener: 3, emerging: 3 }, tag: 'mind' },
        { aKey: "q3_a3", scores: { unbound: 2, harmonious: 2, reflective: 4, awakener: 2, emerging: 1 }, tag: 'awareness' },
        { aKey: "q3_a4", scores: { unbound: 3, harmonious: 4, reflective: 3, awakener: 1, emerging: 0 }, tag: 'harmony' },
        { aKey: "q3_a5", scores: { unbound: 4, harmonious: 3, reflective: 2, awakener: 0, emerging: 0 }, tag: 'harmony' }
    ]},
    { qKey: "q4", answers: [
        { aKey: "q4_a1", scores: { unbound: 0, harmonious: 0, reflective: 1, awakener: 3, emerging: 4 }, tag: 'validation' },
        { aKey: "q4_a2", scores: { unbound: 1, harmonious: 2, reflective: 3, awakener: 4, emerging: 2 }, tag: 'control' },
        { aKey: "q4_a3", scores: { unbound: 2, harmonious: 3, reflective: 4, awakener: 2, emerging: 1 }, tag: 'awareness' },
        { aKey: "q4_a4", scores: { unbound: 3, harmonious: 4, reflective: 2, awakener: 1, emerging: 0 }, tag: 'harmony' },
        { aKey: "q4_a5", scores: { unbound: 4, harmonious: 3, reflective: 1, awakener: 0, emerging: 0 }, tag: 'awareness' }
    ]},
    { qKey: "q5", answers: [
        { aKey: "q5_a1", scores: { unbound: 0, harmonious: 0, reflective: 1, awakener: 3, emerging: 4 }, tag: 'past' },
        { aKey: "q5_a2", scores: { unbound: 0, harmonious: 1, reflective: 2, awakener: 4, emerging: 3 }, tag: 'control' },
        { aKey: "q5_a3", scores: { unbound: 1, harmonious: 2, reflective: 4, awakener: 3, emerging: 1 }, tag: 'past' },
        { aKey: "q5_a4", scores: { unbound: 3, harmonious: 4, reflective: 3, awakener: 1, emerging: 0 }, tag: 'harmony' },
        { aKey: "q5_a5", scores: { unbound: 4, harmonious: 3, reflective: 2, awakener: 0, emerging: 0 }, tag: 'awareness' }
    ]},
    { qKey: "q6", answers: [
        { aKey: "q6_a1", scores: { unbound: 0, harmonious: 0, reflective: 1, awakener: 3, emerging: 4 }, tag: 'mind' },
        { aKey: "q6_a2", scores: { unbound: 0, harmonious: 1, reflective: 2, awakener: 4, emerging: 3 }, tag: 'control' },
        { aKey: "q6_a3", scores: { unbound: 1, harmonious: 2, reflective: 4, awakener: 3, emerging: 1 }, tag: 'mind' },
        { aKey: "q6_a4", scores: { unbound: 3, harmonious: 4, reflective: 3, awakener: 1, emerging: 0 }, tag: 'awareness' },
        { aKey: "q6_a5", scores: { unbound: 4, harmonious: 3, reflective: 2, awakener: 0, emerging: 0 }, tag: 'harmony' }
    ]},
    { qKey: "q7", answers: [
        { aKey: "q7_a1", scores: { unbound: 0, harmonious: 0, reflective: 1, awakener: 3, emerging: 4 }, tag: 'past' },
        { aKey: "q7_a2", scores: { unbound: 0, harmonious: 1, reflective: 2, awakener: 4, emerging: 3 }, tag: 'control' },
        { aKey: "q7_a3", scores: { unbound: 1, harmonious: 2, reflective: 4, awakener: 3, emerging: 1 }, tag: 'past' },
        { aKey: "q7_a4", scores: { unbound: 3, harmonious: 4, reflective: 3, awakener: 1, emerging: 0 }, tag: 'harmony' },
        { aKey: "q7_a5", scores: { unbound: 4, harmonious: 3, reflective: 2, awakener: 0, emerging: 0 }, tag: 'awareness' }
    ]},
    { qKey: "q8", answers: [
        { aKey: "q8_a1", scores: { unbound: 0, harmonious: 0, reflective: 1, awakener: 3, emerging: 4 }, tag: 'past' },
        { aKey: "q8_a2", scores: { unbound: 0, harmonious: 1, reflective: 2, awakener: 4, emerging: 3 }, tag: 'past' },
        { aKey: "q8_a3", scores: { unbound: 1, harmonious: 2, reflective: 4, awakener: 3, emerging: 1 }, tag: 'validation' },
        { aKey: "q8_a4", scores: { unbound: 3, harmonious: 4, reflective: 3, awakener: 1, emerging: 0 }, tag: 'harmony' },
        { aKey: "q8_a5", scores: { unbound: 4, harmonious: 3, reflective: 2, awakener: 0, emerging: 0 }, tag: 'awareness' }
    ]},
    { qKey: "q9", answers: [
        { aKey: "q9_a1", scores: { unbound: 0, harmonious: 1, reflective: 2, awakener: 3, emerging: 4 }, tag: 'mind' },
        { aKey: "q9_a2", scores: { unbound: 1, harmonious: 2, reflective: 3, awakener: 4, emerging: 2 }, tag: 'control' },
        { aKey: "q9_a3", scores: { unbound: 2, harmonious: 3, reflective: 4, awakener: 2, emerging: 1 }, tag: 'harmony' },
        { aKey: "q9_a4", scores: { unbound: 3, harmonious: 4, reflective: 2, awakener: 1, emerging: 0 }, tag: 'harmony' },
        { aKey: "q9_a5", scores: { unbound: 4, harmonious: 3, reflective: 1, awakener: 0, emerging: 0 }, tag: 'awareness' }
    ]},
    { qKey: "q10", answers: [
        { aKey: "q10_a1", scores: { unbound: 0, harmonious: 1, reflective: 2, awakener: 3, emerging: 4 }, tag: 'control' },
        { aKey: "q10_a2", scores: { unbound: 1, harmonious: 2, reflective: 3, awakener: 4, emerging: 2 }, tag: 'mind' },
        { aKey: "q10_a3", scores: { unbound: 2, harmonious: 3, reflective: 4, awakener: 2, emerging: 1 }, tag: 'awareness' },
        { aKey: "q10_a4", scores: { unbound: 3, harmonious: 4, reflective: 2, awakener: 1, emerging: 0 }, tag: 'harmony' },
        { aKey: "q10_a5", scores: { unbound: 4, harmonious: 3, reflective: 1, awakener: 0, emerging: 0 }, tag: 'harmony' }
    ]},
    { qKey: "q11", answers: [
        { aKey: "q11_a1", scores: { unbound: 0, harmonious: 1, reflective: 2, awakener: 3, emerging: 4 }, tag: 'disconnection' },
        { aKey: "q11_a2", scores: { unbound: 1, harmonious: 2, reflective: 3, awakener: 4, emerging: 2 }, tag: 'mind' },
        { aKey: "q11_a3", scores: { unbound: 2, harmonious: 3, reflective: 4, awakener: 2, emerging: 1 }, tag: 'control' },
        { aKey: "q11_a4", scores: { unbound: 3, harmonious: 4, reflective: 2, awakener: 1, emerging: 0 }, tag: 'harmony' },
        { aKey: "q11_a5", scores: { unbound: 4, harmonious: 3, reflective: 1, awakener: 0, emerging: 0 }, tag: 'awareness' }
    ]},
    { qKey: "q12", answers: [
        { aKey: "q12_a1", scores: { unbound: 0, harmonious: 1, reflective: 2, awakener: 3, emerging: 4 }, tag: 'disconnection' },
        { aKey: "q12_a2", scores: { unbound: 1, harmonious: 2, reflective: 3, awakener: 4, emerging: 2 }, tag: 'mind' },
        { aKey: "q12_a3", scores: { unbound: 2, harmonious: 3, reflective: 4, awakener: 2, emerging: 1 }, tag: 'awareness' },
        { aKey: "q12_a4", scores: { unbound: 3, harmonious: 4, reflective: 2, awakener: 1, emerging: 0 }, tag: 'harmony' },
        { aKey: "q12_a5", scores: { unbound: 4, harmonious: 3, reflective: 1, awakener: 0, emerging: 0 }, tag: 'harmony' }
    ]},
    { qKey: "q13", answers: [
        { aKey: "q13_a1", scores: { unbound: 0, harmonious: 1, reflective: 2, awakener: 4, emerging: 4 }, tag: 'validation' },
        { aKey: "q13_a2", scores: { unbound: 0, harmonious: 2, reflective: 3, awakener: 3, emerging: 2 }, tag: 'past' },
        { aKey: "q13_a3", scores: { unbound: 1, harmonious: 3, reflective: 4, awakener: 2, emerging: 1 }, tag: 'control' },
        { aKey: "q13_a4", scores: { unbound: 3, harmonious: 4, reflective: 2, awakener: 1, emerging: 0 }, tag: 'awareness' },
        { aKey: "q13_a5", scores: { unbound: 4, harmonious: 3, reflective: 1, awakener: 0, emerging: 0 }, tag: 'harmony' }
    ]},
    { qKey: "q14", answers: [
        { aKey: "q14_a1", scores: { unbound: 0, harmonious: 1, reflective: 2, awakener: 3, emerging: 4 }, tag: 'validation' },
        { aKey: "q14_a2", scores: { unbound: 1, harmonious: 2, reflective: 3, awakener: 4, emerging: 2 }, tag: 'control' },
        { aKey: "q14_a3", scores: { unbound: 2, harmonious: 3, reflective: 4, awakener: 2, emerging: 1 }, tag: 'mind' },
        { aKey: "q14_a4", scores: { unbound: 3, harmonious: 4, reflective: 2, awakener: 1, emerging: 0 }, tag: 'awareness' },
        { aKey: "q14_a5", scores: { unbound: 4, harmonious: 3, reflective: 1, awakener: 0, emerging: 0 }, tag: 'harmony' }
    ]},
    { qKey: "q15", answers: [
        { aKey: "q15_a1", scores: { unbound: 0, harmonious: 1, reflective: 2, awakener: 4, emerging: 4 }, tag: 'validation' },
        { aKey: "q15_a2", scores: { unbound: 0, harmonious: 2, reflective: 3, awakener: 3, emerging: 2 }, tag: 'control' },
        { aKey: "q15_a3", scores: { unbound: 1, harmonious: 3, reflective: 4, awakener: 2, emerging: 1 }, tag: 'harmony' },
        { aKey: "q15_a4", scores: { unbound: 3, harmonious: 4, reflective: 2, awakener: 1, emerging: 0 }, tag: 'awareness' },
        { aKey: "q15_a5", scores: { unbound: 4, harmonious: 3, reflective: 1, awakener: 0, emerging: 0 }, tag: 'harmony' }
    ]},
    { qKey: "q16", answers: [
        { aKey: "q16_a1", scores: { unbound: 0, harmonious: 1, reflective: 2, awakener: 3, emerging: 4 }, tag: 'validation' },
        { aKey: "q16_a2", scores: { unbound: 0, harmonious: 2, reflective: 3, awakener: 4, emerging: 2 }, tag: 'disconnection' },
        { aKey: "q16_a3", scores: { unbound: 1, harmonious: 3, reflective: 4, awakener: 2, emerging: 1 }, tag: 'control' },
        { aKey: "q16_a4", scores: { unbound: 3, harmonious: 4, reflective: 2, awakener: 1, emerging: 0 }, tag: 'harmony' },
        { aKey: "q16_a5", scores: { unbound: 4, harmonious: 3, reflective: 1, awakener: 0, emerging: 0 }, tag: 'awareness' }
    ]},
    { qKey: "q17", answers: [
        { aKey: "q17_a1", scores: { unbound: 0, harmonious: 0, reflective: 1, awakener: 2, emerging: 4 }, tag: 'mind' },
        { aKey: "q17_a2", scores: { unbound: 1, harmonious: 1, reflective: 2, awakener: 3, emerging: 3 }, tag: 'disconnection' },
        { aKey: "q17_a3", scores: { unbound: 2, harmonious: 2, reflective: 4, awakener: 2, emerging: 1 }, tag: 'control' },
        { aKey: "q17_a4", scores: { unbound: 3, harmonious: 4, reflective: 3, awakener: 1, emerging: 0 }, tag: 'awareness' },
        { aKey: "q17_a5", scores: { unbound: 4, harmonious: 3, reflective: 2, awakener: 0, emerging: 0 }, tag: 'harmony' }
    ]},
    { qKey: "q18", answers: [
        { aKey: "q18_a1", scores: { unbound: 0, harmonious: 1, reflective: 2, awakener: 4, emerging: 4 }, tag: 'validation' },
        { aKey: "q18_a2", scores: { unbound: 0, harmonious: 2, reflective: 3, awakener: 3, emerging: 2 }, tag: 'validation' },
        { aKey: "q18_a3", scores: { unbound: 1, harmonious: 3, reflective: 4, awakener: 2, emerging: 1 }, tag: 'validation' },
        { aKey: "q18_a4", scores: { unbound: 3, harmonious: 4, reflective: 2, awakener: 1, emerging: 0 }, tag: 'harmony' },
        { aKey: "q18_a5", scores: { unbound: 4, harmonious: 3, reflective: 1, awakener: 0, emerging: 0 }, tag: 'awareness' }
    ]},
    { qKey: "q19", answers: [
        { aKey: "q19_a1", scores: { unbound: 0, harmonious: 1, reflective: 2, awakener: 3, emerging: 4 }, tag: 'validation' },
        { aKey: "q19_a2", scores: { unbound: 1, harmonious: 2, reflective: 3, awakener: 4, emerging: 2 }, tag: 'validation' },
        { aKey: "q19_a3", scores: { unbound: 2, harmonious: 3, reflective: 4, awakener: 2, emerging: 1 }, tag: 'harmony' },
        { aKey: "q19_a4", scores: { unbound: 3, harmonious: 4, reflective: 2, awakener: 1, emerging: 0 }, tag: 'harmony' },
        { aKey: "q19_a5", scores: { unbound: 4, harmonious: 3, reflective: 1, awakener: 0, emerging: 0 }, tag: 'awareness' }
    ]},
    { qKey: "q20", answers: [
        { aKey: "q20_a1", scores: { unbound: 0, harmonious: 1, reflective: 2, awakener: 3, emerging: 4 }, tag: 'validation' },
        { aKey: "q20_a2", scores: { unbound: 1, harmonious: 2, reflective: 3, awakener: 4, emerging: 2 }, tag: 'validation' },
        { aKey: "q20_a3", scores: { unbound: 2, harmonious: 3, reflective: 4, awakener: 2, emerging: 1 }, tag: 'control' },
        { aKey: "q20_a4", scores: { unbound: 3, harmonious: 4, reflective: 2, awakener: 1, emerging: 0 }, tag: 'harmony' },
        { aKey: "q20_a5", scores: { unbound: 4, harmonious: 3, reflective: 1, awakener: 0, emerging: 0 }, tag: 'awareness' }
    ]}
];

// --- TYPE DEFINITIONS ---
type Archetype = 'unbound' | 'harmonious' | 'reflective' | 'awakener' | 'emerging';
type Scores = Record<Archetype, number>;
type Screen = 'intro' | 'quiz' | 'dataCollection' | 'result';

// --- HELPER COMPONENT for Global Styles ---
const GlobalStyles = () => (
    <style jsx global>{`
        /* --- CORE STYLES --- */
        :root {
            --background-start: hsl(234, 45%, 13%);
            --background-end: hsl(260, 50%, 8%);
            --foreground: hsl(50, 90%, 95%);
            --card: hsl(240, 30%, 8%);
            --primary: hsl(43, 45%, 58%);    /* Golden base */
            --secondary: hsl(24, 85%, 53%);   /* Deep orange */
            --muted: hsl(240, 20%, 20%);
            --muted-foreground: hsl(50, 30%, 70%);
            --border: hsl(240, 20%, 25%);
            --transition-mystical: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            --whatsapp-green: #25D366;
            --whatsapp-dark-green: #128C7E;
            --font-inter: ${inter.style.fontFamily};
            --font-cinzel: ${cinzel.style.fontFamily};
            --font-noto-serif: ${notoSerif.style.fontFamily};
        }
        
        /* Reset and Base Styles */
        html, body {
            padding: 0;
            margin: 0;
            box-sizing: border-box;
        }

        .shiva-quiz-wrapper {
            cursor: auto;
            font-family: var(--font-inter);
            background: linear-gradient(135deg, var(--background-start), var(--background-end));
            color: var(--foreground);
            min-height: 100vh;
            overflow-x: hidden;
            transition: background 2s ease-in-out;
            margin: 0;
        }

        .shiva-quiz-wrapper a, .shiva-quiz-wrapper button {
            cursor: pointer;
        }

        /* Archetype Backgrounds */
        .shiva-quiz-wrapper.unbound-bg { background: linear-gradient(135deg, hsl(210, 50%, 20%), hsl(230, 60%, 10%)) !important; }
        .shiva-quiz-wrapper.harmonious-bg { background: linear-gradient(135deg, hsl(140, 30%, 20%), hsl(160, 40%, 10%)) !important; }
        .shiva-quiz-wrapper.reflective-bg { background: linear-gradient(135deg, hsl(280, 20%, 20%), hsl(300, 30%, 10%)) !important; }
        .shiva-quiz-wrapper.awakener-bg { background: linear-gradient(135deg, hsl(0, 40%, 20%), hsl(20, 50%, 10%)) !important; }
        .shiva-quiz-wrapper.emerging-bg { background: linear-gradient(135deg, hsl(240, 10%, 15%), hsl(240, 5%, 5%)) !important; }

        /* Font Classes */
        .font-sacred { font-family: var(--font-cinzel); }
        .font-mystical { font-family: var(--font-noto-serif); }

        /* Golden Gradient Effect */
        .golden-stardust {
            display: inline-block;
            background: linear-gradient(45deg, hsl(43, 85%, 78%) 0%, hsl(50, 90%, 95%) 30%, hsl(43, 75%, 65%) 70%, hsl(35, 85%, 65%) 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-shadow: 0 0 15px hsla(43, 85%, 70%, 0.4), 0 0 5px hsla(50, 90%, 95%, 0.5), 0 0 30px hsla(35, 85%, 65%, 0.3);
            background-size: 200% auto;
            animation: shine 3s linear infinite;
        }

        @keyframes shine { to { background-position: 200% center; } }

        /* Special Text Treatments */
        #testimonials .font-sacred, #feedback-section .font-sacred, #questionText {
            color: white !important;
            text-shadow: none !important;
            background-clip: unset !important;
            -webkit-background-clip: unset !important;
        }
        #introTitle {
            color: var(--primary) !important;
            text-shadow: 0 0 15px hsla(43, 85%, 70%, 0.4), 0 0 5px hsla(50, 90%, 95%, 0.5);
        }
        #dataCollectionHeading {
            color: var(--primary) !important;
            text-shadow: 0 0 10px hsla(43, 85%, 70%, 0.3);
        }

        /* Background Canvas */
        #background-canvas { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -2; }

        /* Trishul Flash Effect */
        #trishul-flash { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.5); color: var(--primary); font-size: 20rem; opacity: 0; pointer-events: none; z-index: 5000; transition: opacity 0.5s, transform 0.5s; }
        #trishul-flash.flash { animation: trishul-flash-anim 1s ease-out; }
        @keyframes trishul-flash-anim { 0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); } 50% { opacity: 0.3; transform: translate(-50%, -50%) scale(1.2); } 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); } }

        /* Layout Containers */
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 0 2rem; 
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .container {
                padding: 0 1rem;
            }
            
            .main-title {
                font-size: 2rem !important;
            }
            
            .question-title {
                font-size: 1.2rem !important;
            }
            
            .answer-button {
                padding: 1rem !important;
                font-size: 0.9rem !important;
            }
            
            .start-button {
                padding: 0.8rem 1.5rem !important;
                font-size: 1rem !important;
            }
        }
        
        @media (max-width: 480px) {
            .container {
                padding: 0 0.5rem;
            }
            
            .main-title {
                font-size: 1.5rem !important;
            }
            
            .question-title {
                font-size: 1rem !important;
            }
            
            .answer-button {
                padding: 0.8rem !important;
                font-size: 0.8rem !important;
            }
        }

        /* Intro Screen */
        #introScreen, .main-content, .result-page, .data-collection-screen { position: relative; z-index: 1; }
        #introScreen { display: flex; min-height: 100vh; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; text-align: center; }
        .intro-main-content, .intro-footer-content { width: 100%; }
        #introScreen .start-button { padding: 1rem 2.5rem; background: linear-gradient(45deg, var(--primary), var(--secondary)); color: var(--background-end) !important; text-decoration: none; border-radius: 9999px; font-weight: 600; font-size: 1.2rem; transition: var(--transition-mystical); box-shadow: 0 10px 40px -12px hsla(43, 45%, 58%, 0.3); border: none; }
        #introScreen .start-button:hover { transform: scale(1.05); box-shadow: 0 0 30px hsla(43, 45%, 58%, 0.2); }

        /* Quiz Content */
        .main-content { min-height: 100vh; padding: 8rem 0 2rem 0; display: none; }
        .header { text-align: center; margin-bottom: 3rem; }
        .progress-container { position: relative; width: 100px; height: 100px; margin: 0 auto 2rem; }
        .progress-mandala { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
        .progress-mandala circle { fill: none; stroke-width: 4; }
        .progress-mandala .bg-circle { stroke: hsla(43, 45%, 58%, 0.1); }
        .progress-mandala .fill-circle { stroke: var(--primary); stroke-linecap: round; transform: rotate(-90deg); transform-origin: 50% 50%; transition: stroke-dashoffset 0.5s ease-out; }
        .progress-text-container { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; }
        #questionCard { background: hsla(240, 30%, 8%, 0.5); backdrop-filter: blur(12px); border: 1px solid hsla(43, 45%, 58%, 0.2); border-radius: 0.75rem; padding: 3rem 2rem; position: relative; overflow: hidden; transform-origin: top center; }
        .card-enter { animation: scroll-unfold 1s cubic-bezier(0.165, 0.84, 0.44, 1) forwards; }
        .card-exit { animation: scroll-fold 1s cubic-bezier(0.165, 0.84, 0.44, 1) forwards; }
        @keyframes scroll-unfold { from { transform: perspective(1000px) rotateX(-90deg) translateY(-50%); opacity: 0; } to { transform: perspective(1000px) rotateX(0deg) translateY(0); opacity: 1; } }
        @keyframes scroll-fold { from { transform: perspective(1000px) rotateX(0deg); opacity: 1; } to { transform: perspective(1000px) rotateX(90deg); opacity: 0; } }

        /* Answers Grid */
        .answers-grid { display: grid; gap: 1rem; }
        .answer-button { display: flex; align-items: center; padding: 1.5rem; min-height: 4rem; background: hsla(240, 30%, 8%, 0.5); border: 1px solid hsla(43, 45%, 58%, 0.3); border-radius: 8px; transition: var(--transition-mystical); text-align: left; font-size: 1rem; backdrop-filter: blur(8px); position: relative; overflow: hidden; color: var(--foreground) !important; line-height: 1.6; }
        .answer-button:hover { border-color: var(--primary); transform: translateY(-3px); box-shadow: 0 0 20px hsla(43, 45%, 58%, 0.2); }
        .answer-button:disabled { cursor: not-allowed; }
        .answer-text { color: var(--foreground) !important; text-shadow: none !important; }

        /* Data Collection Screen */
        .data-collection-screen { display: none; min-height: 100vh; padding: 8rem 0 2rem 0; align-items: center; justify-content: center; text-align: center; }
        .data-collection-screen.show { display: flex; animation: fade-in 1s ease-out forwards; }
        .data-form-card { background: hsla(240, 30%, 8%, 0.6); backdrop-filter: blur(12px); border: 1px solid hsla(43, 45%, 58%, 0.2); border-radius: 0.75rem; padding: 3rem 2rem; max-width: 500px; margin: 0 auto; box-shadow: 0 10px 30px hsla(0,0%,0%,0.3); }
        .data-form-card h2 { margin-bottom: 1rem; }
        .data-form-card p { margin-bottom: 2rem; color: var(--muted-foreground); }
        .form-group { margin-bottom: 1.5rem; text-align: left; }
        .form-group label { display: block; margin-bottom: 0.5rem; color: var(--foreground); font-size: 0.95rem; }
        .form-group input { width: 100%; box-sizing: border-box; padding: 0.75rem 12px; background: hsla(240, 20%, 15%, 0.8); border: 1px solid var(--border); border-radius: 5px; color: var(--foreground); font-size: 1rem; transition: all 0.3s ease; }
        .form-group input:focus { border-color: var(--primary); box-shadow: 0 0 0 2px hsla(43, 45%, 58%, 0.3); outline: none; }
        #submitDataBtn { margin-top: 2rem; width: 100%; padding: 1rem; font-size: 1.1rem; background: linear-gradient(45deg, var(--primary), var(--secondary)); color: var(--background-end) !important; border: none; border-radius: 5px; transition: all 0.3s ease; }
        #submitDataBtn:hover { transform: scale(1.02); box-shadow: 0 5px 15px hsla(43, 45%, 58%, 0.2); }

        /* Result Page */
        .result-page { display: none; min-height: 100vh; padding: 3rem 0; }
        .result-page.show { display: block; animation: fade-in 2s ease-out; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .result-header { text-align: center; margin-bottom: 1.5rem; }
        .result-card { background: hsla(240, 30%, 8%, 0.6); backdrop-filter: blur(12px); border: 1px solid hsla(43, 45%, 58%, 0.2); border-radius: 0.75rem; padding: 2.5rem; position: relative; overflow: hidden; animation: result-carve 2s ease-out forwards; opacity: 0; line-height: 1.8; }
        @keyframes result-carve { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
        .archetype-title { font-size: clamp(2.5rem, 4vw, 3.5rem); color: var(--primary) !important; margin-bottom: 0.5rem; text-align: center; }
        .sanskrit-text { font-size: 1.25rem; color: var(--secondary) !important; margin-bottom: 1rem; text-align: center; }
        .archetype-badge { display: block; width: fit-content; margin: 0 auto 2.5rem; padding: 0.5rem 1.5rem; background: hsla(43, 45%, 58%, 0.1); border: 1px solid hsla(43, 45%, 58%, 0.3); border-radius: 9999px; color: var(--primary) !important; font-weight: 500; text-align: center; }

        /* --- PERSONALIZATION & CTA SECTIONS --- */
        .personalization-section { margin: 2.5rem 0; padding: 2rem; background: hsla(240, 30%, 8%, 0.3); border: 1px solid hsla(240, 20%, 25%, 0.5); border-radius: 0.5rem; }
        .personalization-section h4 { color: var(--secondary) !important; font-family: 'Cinzel', serif; font-size: 1.5rem !important; margin-top: 0 !important; margin-bottom: 1rem !important; text-align: center; }
        .shiva-percentage-container { text-align: center; padding-top: 1rem; }
        .shiva-percentage-container h3 { color: var(--muted-foreground); margin: 0 0 1rem 0; font-size: 1.1rem; font-weight: 500; }
        .percentage-value { font-size: clamp(3rem, 8vw, 4.5rem); font-family: 'Cinzel', serif; font-weight: 700; background: linear-gradient(45deg, hsl(43, 85%, 78%), hsl(50, 90%, 95%)); -webkit-background-clip: text; background-clip: text; color: transparent; text-shadow: 0 0 15px hsla(43, 85%, 70%, 0.4); line-height: 1.1; }

        /* Course CTA Section */
        .course-cta { background: linear-gradient(135deg, hsla(43, 45%, 58%, 0.1), hsla(24, 85%, 53%, 0.1)); border: 1px solid var(--primary); text-align: center; padding: 2.5rem 2rem !important; margin-top: 3rem; }
        .course-cta h4 { font-size: 1.8rem !important; color: var(--primary) !important; }
        .course-cta p { color: var(--muted-foreground) !important; max-width: 700px; margin-left: auto; margin-right: auto; margin-bottom: 2rem !important; }
        .course-cta .start-button { text-decoration: none; display: inline-block; padding: 1rem 2.5rem; background: linear-gradient(45deg, var(--primary), var(--secondary)); color: var(--background-end) !important; border-radius: 9999px; font-weight: 600; font-size: 1.2rem; transition: var(--transition-mystical); box-shadow: 0 10px 40px -12px hsla(43, 45%, 58%, 0.3); border: none; }
        .course-cta .start-button:hover { transform: scale(1.05); box-shadow: 0 0 30px hsla(43, 45%, 58%, 0.2); }
        
        /* Result Tabs Styling */
        .result-tabs-nav { display: flex; justify-content: center; border-bottom: 1px solid var(--border); margin-bottom: 2rem; flex-wrap: wrap; }
        .tab-link { padding: 1rem 1.5rem; font-family: 'Cinzel', serif; font-size: 1.1rem; color: var(--muted-foreground); background: none; border: none; border-bottom: 3px solid transparent; transition: color 0.3s, border-color 0.3s; margin-bottom: -1px; }
        .tab-link:hover { color: var(--foreground); }
        .tab-link.active { color: var(--primary); border-bottom-color: var(--primary); }
        .tab-content { display: none; animation: fade-in 0.8s ease; }
        .tab-content.active { display: block; }
        .tab-content h4, .tab-content h5 { color: var(--primary) !important; text-shadow: none !important; font-weight: 700 !important; font-size: 1.3rem !important; margin-top: 2rem !important; margin-bottom: 1rem !important; }
        .tab-content p, .tab-content li { color: hsla(50, 90%, 95%, 0.9) !important; text-shadow: none !important; margin-bottom: 1rem; }
        .tab-content ul { list-style-type: '🔱 '; padding-left: 1.5rem; margin-bottom: 1rem; }
        .tab-content strong { color: hsla(50, 90%, 95%, 1) !important; font-weight: 600; }
        .recommendation-point { margin-bottom: 1.5rem; padding-left: 1rem; border-left: 2px solid var(--secondary); }
        .recommendation-point strong { color: var(--primary) !important; }
        .recommendation-point p { font-style: italic; color: var(--muted-foreground) !important; }

        /* WhatsApp CTA */
        .whatsapp-cta-section { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid hsla(240, 20%, 25%, 0.5); text-align: center; }
        #whatsappCtaText { color: var(--muted-foreground) !important; margin-bottom: 1rem; font-size: 1rem; }
        .whatsapp-button { display: inline-flex; align-items: center; justify-content: center; gap: 0.75rem; padding: 0.75rem 1.5rem; background-color: var(--whatsapp-green); color: white !important; text-decoration: none; border-radius: 9999px; font-weight: 600; font-size: 1.1rem; transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2); }
        .whatsapp-button:hover { background-color: var(--whatsapp-dark-green); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3); }
        .whatsapp-icon { width: 24px; height: 24px; vertical-align: middle; }

        /* General Buttons */
        .retake-button { display: inline-block; margin: 1rem 0.5rem; padding: 0.75rem 1.5rem; background: transparent; color: var(--muted-foreground) !important; text-decoration: none; border-radius: 9999px; border: 1px solid var(--border); font-weight: 500; font-size: 1rem; transition: var(--transition-mystical); }
        .retake-button:hover { background: var(--muted); color: var(--foreground) !important; border-color: var(--primary); }

        /* Testimonials */
        #testimonials { padding: 2rem; text-align: center; }
        .testimonial-container { position: relative; max-width: 800px; margin: 2rem auto; min-height: 120px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .testimonial-item { position: absolute; width: 100%; opacity: 0; transition: opacity 1s ease-in-out; font-style: italic; font-size: clamp(1rem, 2vw, 1.1rem); line-height: 1.8; color: hsla(50, 90%, 95%, 0.7) !important; }
        .testimonial-item.active { opacity: 1; }
        .testimonial-author { font-style: normal; font-weight: 500; color: var(--secondary) !important; margin-top: 1rem; display: block; }

        /* Feedback Section */
        #feedback-section { margin-top: 3rem; text-align: center; }
        .stars-container { display: flex; justify-content: center; gap: 0.5rem; margin-top: 1.5rem; }
        .star { font-size: 2.5rem; color: var(--muted-foreground); transition: color 0.2s, transform 0.2s; }
        .stars-container.rated .star { cursor: default; }
        .star:hover { transform: scale(1.2); color: var(--primary); }
        .star.selected { color: var(--primary) !important; }
        #feedback-thanks, #feedback-submitted-thanks { margin-top: 1rem; color: var(--primary) !important; opacity: 0; transition: opacity 0.5s; font-style: italic; height: 1em;}
        #feedback-form { display: none; margin-top: 1.5rem; max-width: 600px; margin-left: auto; margin-right: auto; }
        #feedback-form textarea { width: 100%; box-sizing: border-box; padding: 0.75rem 12px; background: hsla(240, 20%, 15%, 0.8); border: 1px solid var(--border); border-radius: 5px; color: var(--foreground); font-size: 1rem; transition: all 0.3s ease; min-height: 100px; margin-bottom: 1rem; }
        #feedback-form textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 2px hsla(43, 45%, 58%, 0.3); outline: none; }
        #feedback-form button { padding: 0.75rem 1.5rem; background: var(--primary); color: var(--background-end) !important; border: none; border-radius: 9999px; font-weight: 600; }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
            .container { padding: 0 1rem; }
            #questionCard, .data-form-card, .result-card { padding: 2rem 1.5rem; }
            .tab-link { padding: 0.8rem 1rem; font-size: 1rem; }
            .personalization-section { padding: 1.5rem; }
        }
    `}</style>
);

// --- THE MAIN QUIZ COMPONENT ---
const ShivaAlignmentQuizPage = () => {
    // --- STATE MANAGEMENT ---
    const [screen, setScreen] = useState<Screen>('intro');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [answerTags, setAnswerTags] = useState<string[]>([]);
    const [finalScores, setFinalScores] = useState<Scores>({ unbound: 0, harmonious: 0, reflective: 0, awakener: 0, emerging: 0 });
    const [userDetails, setUserDetails] = useState({ name: '', email: '', mobile: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Result-related state
    const [dominantResultType, setDominantResultType] = useState<Archetype | null>(null);
    const [secondaryResultType, setSecondaryResultType] = useState<Archetype | null>(null);
    const [dominantPainPoint, setDominantPainPoint] = useState<string | null>(null);
    const [shivaPercentage, setShivaPercentage] = useState(0);

    // UI State
    const [showContinueButton, setShowContinueButton] = useState(false);
    const [isAnswerSelected, setIsAnswerSelected] = useState(false);
    const [cardAnimation, setCardAnimation] = useState('card-enter');
    const [activeTab, setActiveTab] = useState('path');
    const [starRating, setStarRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [isRated, setIsRated] = useState(false);
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);
    const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

    // --- REFS for DOM elements that need direct manipulation ---
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const trishulRef = useRef<HTMLDivElement>(null);

    const langPack = textContent.en;

    // --- LIFECYCLE & SIDE EFFECTS ---

    // Load progress from localStorage on initial mount
    useEffect(() => {
        const savedProgress = storage.get('shivaQuizProgress');
        if (savedProgress && savedProgress.currentQuestionIndex > 0 && savedProgress.currentQuestionIndex < questions.length) {
            setCurrentQuestionIndex(savedProgress.currentQuestionIndex || 0);
            setFinalScores(savedProgress.finalScores || { unbound: 0, harmonious: 0, reflective: 0, awakener: 0, emerging: 0 });
            setUserAnswers(savedProgress.userAnswers || []);
            setAnswerTags(savedProgress.answerTags || []);
            setShowContinueButton(true);
        }
    }, []);
    
    // Background canvas starfield animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let stars: any[] = [];
        const numStars = 300;
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            stars = [];
            for (let i = 0; i < numStars; i++) {
                stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, baseRadius: Math.random() * 1.5, alpha: Math.random(), dAlpha: Math.random() * 0.02 - 0.01 });
            }
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        let animationFrameId: number;
        const drawStars = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'hsla(50, 90%, 95%, 0.8)';
            stars.forEach(star => {
                star.alpha += star.dAlpha;
                if (star.alpha <= 0 || star.alpha >= 1) { star.dAlpha *= -1; }
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.baseRadius, 0, Math.PI * 2);
                ctx.globalAlpha = star.alpha;
                ctx.fill();
            });
            animationFrameId = requestAnimationFrame(drawStars);
        };
        drawStars();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // Testimonial cycling
    useEffect(() => {
        if (screen !== 'intro') return;
        const interval = setInterval(() => {
            setCurrentTestimonialIndex(prevIndex => (prevIndex + 1) % 3);
        }, 7000);
        return () => clearInterval(interval);
    }, [screen]);
    
    // --- HELPER & EVENT HANDLER FUNCTIONS ---

    const clearQuizProgress = useCallback(() => {
        storage.remove('shivaQuizProgress');
        setCurrentQuestionIndex(0);
        setFinalScores({ unbound: 0, harmonious: 0, reflective: 0, awakener: 0, emerging: 0 });
        setUserAnswers([]);
        setAnswerTags([]);
        setShowContinueButton(false);
    }, []);

    const saveQuizProgress = useCallback((index: number, scores: Scores, answers: string[], tags: string[]) => {
        const progress = {
            currentQuestionIndex: index,
            finalScores: scores,
            userAnswers: answers,
            answerTags: tags,
            timestamp: Date.now()
        };
        storage.set('shivaQuizProgress', progress);
    }, []);

    const startQuiz = (startIndex: number) => {
        if (startIndex === 0) {
            clearQuizProgress();
        }
        setCurrentQuestionIndex(startIndex);
        setScreen('quiz');
    };

    const handleAnswer = (answer: any, buttonEl: HTMLButtonElement) => {
        if (isAnswerSelected) return;
        setIsAnswerSelected(true);
        
        buttonEl.classList.add('selected'); // Visual feedback
        
        const newScores = { ...finalScores };
        for (const archetype in answer.scores) {
            newScores[archetype as Archetype] += answer.scores[archetype];
        }
        
        const newAnswers = [...userAnswers, langPack[answer.aKey as keyof typeof langPack]];
        const newTags = answer.tag ? [...answerTags, answer.tag] : answerTags;

        setFinalScores(newScores);
        setUserAnswers(newAnswers);
        setAnswerTags(newTags);
        
        saveQuizProgress(currentQuestionIndex + 1, newScores, newAnswers, newTags);

        // Animation sequence
        setTimeout(() => {
            if (trishulRef.current) {
                trishulRef.current.classList.add('flash');
                setTimeout(() => trishulRef.current?.classList.remove('flash'), 1000);
            }
            setCardAnimation('card-exit');
        }, 800);

        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setIsAnswerSelected(false);
                setCardAnimation('card-enter');
            } else {
                calculateResult(newScores, newTags);
                setScreen('dataCollection');
            }
        }, 1600);
    };

    const calculateResult = (scores: Scores, tags: string[]) => {
        const sortedScores = Object.entries(scores).sort(([, a], [, b]) => b - a);
        const dominant = sortedScores[0][0] as Archetype;
        const secondary = sortedScores[1][0] as Archetype;

        const tagCounts = tags.reduce((acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const sortedTags = Object.entries(tagCounts).sort(([, a], [, b]) => b - a);
        const painPoint = sortedTags.length > 0 ? sortedTags[0][0] : null;
        
        const maxPossibleScore = 80; // 20 questions * max score of 4
        const userDominantScore = scores[dominant];
        const percentage = Math.round((userDominantScore / maxPossibleScore) * 100);

        setDominantResultType(dominant);
        setSecondaryResultType(secondary);
        setDominantPainPoint(painPoint);
        setShivaPercentage(percentage);

        // Save results to localStorage for Rishi Mode integration
        const rishiProfile = {
            archetype: dominant,
            darshana: dominant, // Map archetype to darshana
            guna: 'sattva', // Default mapping, could be enhanced
            characteristics: [painPoint || 'balanced'],
            percentage: percentage,
            secondaryArchetype: secondary,
            scores: scores,
            tags: tags
        };

        storage.set('rishiModeState', {
            rishiProfile,
            answers: userAnswers,
            completedAt: new Date().toISOString()
        });
    };
    
    const handleDataSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('action', 'submit_quiz');
        formData.append('name', userDetails.name);
        formData.append('email', userDetails.email);
        formData.append('mobile', userDetails.mobile);
        formData.append('archetype', dominantResultType || '');
        formData.append('secondary_archetype', secondaryResultType || '');
        formData.append('pain_point', dominantPainPoint || '');
        formData.append('percentage', String(shivaPercentage));
        formData.append('answers', JSON.stringify(userAnswers));
        
        try {
            await fetch(SCRIPT_URL, { method: 'POST', body: formData, mode: 'no-cors' });
        } catch (error) {
            console.error('Error submitting quiz data:', error);
        } finally {
            clearQuizProgress();
            setScreen('result');
            setIsSubmitting(false);
        }
    };
    
    const handleFeedbackSubmit = async () => {
        const writtenFeedback = (document.getElementById('feedbackText') as HTMLTextAreaElement).value;
        setIsFeedbackSubmitted(true);
        setShowFeedbackForm(false);
        
        const formData = new FormData();
        formData.append('action', 'submit_feedback');
        formData.append('name', userDetails.name);
        formData.append('email', userDetails.email);
        formData.append('archetype', dominantResultType || '');
        formData.append('star_rating', String(starRating));
        formData.append('written_feedback', writtenFeedback);
        
        try {
            await fetch(SCRIPT_URL, { method: 'POST', body: formData, mode: 'no-cors' });
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };
    
    const handleStarClick = (value: number) => {
        if (isRated) return;
        setStarRating(value);
        setIsRated(true);
        setShowFeedbackForm(true);
    };

    const getWrapperClass = () => {
        let classes = `shiva-quiz-wrapper ${inter.variable} ${cinzel.variable} ${notoSerif.variable}`;
        if (screen === 'result' && dominantResultType) {
            classes += ` ${dominantResultType}-bg`;
        }
        return classes;
    };
    
    // --- RENDER FUNCTIONS FOR SUB-COMPONENTS / SECTIONS ---

    const renderDeeperInsight = () => {
        let insightText = "";
        switch (dominantPainPoint) {
            case 'validation': insightText = "We noticed a strong theme in your answers related to external validation and praise. For you, feeling unappreciated isn't a small thing—it can derail your inner peace. Your path to freedom involves learning to source your self-worth from within, so that the praise of others becomes a delightful bonus, not a necessary fuel."; break;
            case 'control': insightText = "A recurring pattern in your answers points to a deep need for control. This may manifest as meticulous planning, a fear of uncertainty, or trying to manage the actions of others. Your journey to inner peace lies in learning to trust the flow of life, discovering that true power is found in surrender, not in a tighter grip."; break;
            case 'past': insightText = "Your answers suggest that the energy of the past holds a significant weight in your present. Unresolved situations or old hurts may be draining your life force. Your path to liberation involves gently processing these stored emotions, allowing you to reclaim your energy and live fully in the now."; break;
            case 'mind': insightText = "We see a strong tendency in your answers to analyze, intellectualize, and try to 'think' your way through life. While your mind is a powerful tool, it may be creating a barrier to direct experience. Your path forward is a journey from the head to the heart, learning to feel and trust your embodied wisdom."; break;
            case 'disconnection': insightText = "A theme of disconnection or 'numbing out' appeared in your answers. This is often a wise, protective strategy of the nervous system. Your journey back to wholeness is not about forcing yourself to feel, but about gently creating inner safety, allowing your vibrant self to emerge at its own pace."; break;
            default: insightText = "Your answers show a balanced and multifaceted approach to your inner world. Continue to cultivate this awareness, noticing the subtle play of different energies within you as you walk your path."
        }
        return (
            <div id="deeperInsightSection" className="personalization-section">
                <h4>A Deeper Look for <span className="user-name">{userDetails.name}</span></h4>
                <p>{insightText}</p>
            </div>
        );
    };

    const renderSecondaryArchetype = () => {
        if (!dominantResultType || !secondaryResultType) return null;
        const primaryTitle = langPack[`res_${dominantResultType}_title` as keyof typeof langPack];
        const secondaryTitle = langPack[`res_${secondaryResultType}_title` as keyof typeof langPack];
        return (
            <div id="secondaryArchetypeSection" className="personalization-section">
                <h4>Your Inner Ally: The {secondaryTitle}</h4>
                <p>Your primary energy is the <strong>{primaryTitle}</strong>, but your answers show a powerful secondary stream of the <strong>{secondaryTitle}</strong>. This means that while you lead with one style, this 'Inner Ally' is always influencing your journey, adding nuance and depth to your path. Understanding this interplay is key to your growth.</p>
            </div>
        );
    };

    const renderCourseCta = () => {
        if (!dominantResultType) return null;
        const ctaText = langPack[`res_${dominantResultType}_course_cta` as keyof typeof langPack];
        return (
            <div id="courseCtaSection" className="personalization-section course-cta">
                <h4 id="courseCtaTitle" className="font-sacred">{langPack.course_cta_title}</h4>
                <p id="courseCtaText" className="font-mystical">{ctaText}</p>
                <a id="courseCtaButton" href="https://shikshanam.in/kashmir-shaivism/" target="_blank" rel="noopener noreferrer" className="start-button">
                    {langPack.course_cta_button_text}
                </a>
            </div>
        );
    };

    const renderTestimonials = () => {
        const testimonialData = [
            { quoteKey: "testimonial_1_quote", authorKey: "testimonial_1_author" },
            { quoteKey: "testimonial_2_quote", authorKey: "testimonial_2_author" },
            { quoteKey: "testimonial_3_quote", authorKey: "testimonial_3_author" }
        ];
        const currentTestimonial = testimonialData[currentTestimonialIndex];
        return (
            <section id="testimonials">
                <div className="container">
                    <h2 className="font-sacred">{langPack.testimonials_title}</h2>
                    <div className="testimonial-container">
                        <div className="testimonial-item active">
                            &quot;{langPack[currentTestimonial.quoteKey as keyof typeof langPack]}&quot;
                            <span className="testimonial-author">— {langPack[currentTestimonial.authorKey as keyof typeof langPack]}</span>
                        </div>
                    </div>
                </div>
            </section>
        )
    };
    
    return (
        <>
        <GlobalStyles />
        <main className={getWrapperClass()}>
            <canvas id="background-canvas" ref={canvasRef}></canvas>
            <div id="trishul-flash" ref={trishulRef}>🔱</div>
            {/* Custom Cursor is handled by CSS, no JS needed for this simple version */}

            {screen === 'intro' && (
                <section id="introScreen">
                    <div className="intro-main-content">
                        <h1 id="introTitle" className="font-sacred">{langPack.intro_title}</h1>
                        <p id="introSubtitle" className="font-mystical">{langPack.intro_subtitle}</p>
                        <button onClick={() => startQuiz(0)} className="start-button">{langPack.start_button}</button>
                        {showContinueButton && (
                             <button onClick={() => startQuiz(currentQuestionIndex)} className="start-button" style={{ marginTop: '1rem' }}>{langPack.continue_button}</button>
                        )}
                    </div>
                    <div className="intro-footer-content">
                       {renderTestimonials()}
                    </div>
                </section>
            )}

            {screen === 'quiz' && (
                <div id="quizContent" className="main-content" style={{display: 'block'}}>
                    <div className="container">
                        <div className="header">
                            <h1 className="main-title font-sacred golden-stardust">{langPack.intro_title}</h1>
                            <p className="subtitle font-mystical">{langPack.intro_subtitle}</p>
                            <div className="progress-container">
                                <svg className="progress-mandala" viewBox="0 0 100 100">
                                    <circle className="bg-circle" cx="50" cy="50" r="45"></circle>
                                    <circle id="progressFill" className="fill-circle" cx="50" cy="50" r="45" strokeDasharray="283" style={{ strokeDashoffset: 283 * (1 - (currentQuestionIndex + 1) / questions.length) }}></circle>
                                </svg>
                                <div className="progress-text-container">
                                    <span>{currentQuestionIndex + 1}/{questions.length}</span>
                                </div>
                            </div>
                        </div>
                        <div id="questionCard" className={cardAnimation}>
                            <h2 id="questionText" className="question-title">{langPack[questions[currentQuestionIndex].qKey as keyof typeof langPack]}</h2>
                            <div id="answersContainer" className="answers-grid">
                                {questions[currentQuestionIndex].answers.map((answer, index) => (
                                    <button
                                        key={index}
                                        className="answer-button"
                                        onClick={(e) => handleAnswer(answer, e.currentTarget)}
                                        disabled={isAnswerSelected}
                                    >
                                        <span className="answer-text">{langPack[answer.aKey as keyof typeof langPack]}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {screen === 'dataCollection' && (
                 <div id="dataCollectionScreen" className="data-collection-screen show">
                     <div className="container">
                         <div className="data-form-card">
                             <h2 id="dataCollectionHeading" className="font-sacred">{langPack.data_collection_heading}</h2>
                             <p id="dataCollectionSubtitle" className="font-mystical">{langPack.data_collection_subtitle}</p>
                             <form id="dataCollectionForm" onSubmit={handleDataSubmit}>
                                 <div className="form-group">
                                     <label htmlFor="userName">{langPack.label_name}</label>
                                     <input type="text" id="userName" value={userDetails.name} onChange={e => setUserDetails({...userDetails, name: e.target.value})} required />
                                 </div>
                                 <div className="form-group">
                                     <label htmlFor="userEmail">{langPack.label_email}</label>
                                     <input type="email" id="userEmail" value={userDetails.email} onChange={e => setUserDetails({...userDetails, email: e.target.value})} required />
                                 </div>
                                 <div className="form-group">
                                     <label htmlFor="userMobile">{langPack.label_mobile}</label>
                                     <input type="tel" id="userMobile" value={userDetails.mobile} onChange={e => setUserDetails({...userDetails, mobile: e.target.value})} pattern="[0-9]{10}" required />
                                 </div>
                                 <button type="submit" id="submitDataBtn" className="start-button" disabled={isSubmitting}>
                                     {isSubmitting ? 'Generating Report...' : langPack.submit_data_button}
                                 </button>
                             </form>
                         </div>
                     </div>
                 </div>
            )}

            {screen === 'result' && dominantResultType && (
                <div id="resultPage" className="result-page show">
                    <div className="container">
                        <div className="result-header">
                            <h1 id="resultHeaderTitle" className="result-title font-sacred">Your Sacred Alignment Report for <span className="user-name">{userDetails.name}</span></h1>
                            <p id="resultHeaderSubtitle" className="subtitle font-mystical">{langPack.result_header_subtitle}</p>
                        </div>
                        <div className="result-content">
                            <div className="result-card">
                                <h2 className="archetype-title font-sacred">{langPack[`res_${dominantResultType}_title` as keyof typeof langPack]}</h2>
                                <p className="sanskrit-text font-mystical">{langPack[`res_${dominantResultType}_sanskrit` as keyof typeof langPack]}</p>
                                <div className="archetype-badge">{langPack[`res_${dominantResultType}_archetype` as keyof typeof langPack]}</div>
                                <div className="shiva-percentage-container">
                                    <h3 className="font-mystical">Your Alignment with <strong>{langPack[`res_${dominantResultType}_title` as keyof typeof langPack]}</strong></h3>
                                    <div className="percentage-value">{shivaPercentage}%</div>
                                </div>
                                
                                {renderDeeperInsight()}
                                {renderSecondaryArchetype()}
                                
                                <div>
                                    <div className="result-tabs-nav">
                                        <button className={`tab-link ${activeTab === 'path' ? 'active' : ''}`} onClick={() => setActiveTab('path')}>Your Path</button>
                                        <button className={`tab-link ${activeTab === 'challenges' ? 'active' : ''}`} onClick={() => setActiveTab('challenges')}>Your Daily Life</button>
                                        <button className={`tab-link ${activeTab === 'recommendations' ? 'active' : ''}`} onClick={() => setActiveTab('recommendations')}>Recommendations</button>
                                    </div>
                                    <div className="result-tabs-content">
                                        <div className={`tab-content ${activeTab === 'path' ? 'active' : ''}`} dangerouslySetInnerHTML={{ __html: langPack[`res_${dominantResultType}_path` as keyof typeof langPack].replace(/<span class='user-name'><\/span>/g, `<span class='user-name'>${userDetails.name}</span>`) }} />
                                        <div className={`tab-content ${activeTab === 'challenges' ? 'active' : ''}`} dangerouslySetInnerHTML={{ __html: langPack[`res_${dominantResultType}_challenges` as keyof typeof langPack] }} />
                                        <div className={`tab-content ${activeTab === 'recommendations' ? 'active' : ''}`} dangerouslySetInnerHTML={{ __html: langPack[`res_${dominantResultType}_recommendations` as keyof typeof langPack].replace(/<span class='user-name'><\/span>/g, `<span class='user-name'>${userDetails.name}</span>`) }} />
                                    </div>
                                </div>
                                
                                {renderCourseCta()}
                                
                                <div className="whatsapp-cta-section">
                                    <p id="whatsappCtaText" className="font-mystical">{langPack.whatsapp_cta_text}</p>
                                    <a href="https://whatsapp.com/channel/0029Vb6jtsD3gvWisWX1gU00" target="_blank" rel="noopener noreferrer" className="whatsapp-button">
                                         <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1024px-WhatsApp.svg.png" alt="WhatsApp Icon" width={24} height={24} className="whatsapp-icon" />
                                        <span>{langPack.whatsapp_button_text}</span>
                                    </a>
                                </div>
                                <div className="retake-button-container" style={{ textAlign: 'center', marginTop: '1rem' }}>
                                    <button onClick={() => window.location.reload()} className="retake-button">{langPack.retake_button}</button>
                                    <button 
                                        onClick={() => {
                                            // Navigate to Rishi Mode with Shiva Consciousness completion
                                            window.location.href = '/rishi-mode?from=shiva-consciousness'
                                        }} 
                                        className="retake-button" 
                                        style={{ marginLeft: '1rem', backgroundColor: '#8b5cf6', color: 'white' }}
                                    >
                                        Enter Rishi Mode for Analysis
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                     <section id="feedback-section">
                        <div className="container">
                            <h2 className="font-sacred">{langPack.feedback_title}</h2>
                            <div className={`stars-container ${isRated ? 'rated' : ''}`} onMouseLeave={() => setHoverRating(0)}>
                                {[1, 2, 3, 4, 5].map(value => (
                                    <span 
                                        key={value}
                                        className={`star ${(hoverRating || starRating) >= value ? 'selected' : ''}`}
                                        data-value={value}
                                        onMouseEnter={() => !isRated && setHoverRating(value)}
                                        onClick={() => handleStarClick(value)}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <p id="feedback-thanks" style={{ opacity: isRated && !isFeedbackSubmitted ? 1 : 0 }}>{langPack.feedback_thanks}</p>
                            {showFeedbackForm && (
                                <div id="feedback-form" style={{ display: 'block' }}>
                                    <textarea id="feedbackText" placeholder="Share your thoughts..."></textarea>
                                    <button id="submitFeedbackBtn" onClick={handleFeedbackSubmit}>Submit Feedback</button>
                                </div>
                            )}
                            <p id="feedback-submitted-thanks" style={{ opacity: isFeedbackSubmitted ? 1 : 0 }}>{langPack.feedback_submitted_thanks}</p>
                        </div>
                    </section>
                </div>
            )}
            
        </main>
        </>
    );
};

export default ShivaAlignmentQuizPage;
