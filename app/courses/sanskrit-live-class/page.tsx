'use client'

import { useState, useEffect } from 'react'

export default function SanskritLiveClassPage() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  const [flipCards, setFlipCards] = useState({
    card1: false,
    card2: false,
    card3: false,
    card4: false
  })

  const [quizStarted, setQuizStarted] = useState(false)
  const [quizTime, setQuizTime] = useState(15 * 60) // 15 minutes in seconds
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Set target date to end of offer
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 1) // 1 day from now

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      if (distance > 0) {
        setTimeLeft({ hours, minutes, seconds })
      } else {
        clearInterval(timer)
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    let quizTimer: NodeJS.Timeout
    if (quizStarted && quizTime > 0) {
      quizTimer = setInterval(() => {
        setQuizTime(prev => prev - 1)
      }, 1000)
    }
    return () => clearInterval(quizTimer)
  }, [quizStarted, quizTime])

  const flipCard = (cardId: string) => {
    setFlipCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId as keyof typeof prev]
    }))
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Hero Section */
        .hero {
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
          color: white;
          padding: 60px 0;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 30px 30px;
          animation: float 20s infinite linear;
        }

        @keyframes float {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .hero-content {
          position: relative;
          z-index: 2;
        }

        .special-offer {
          background: rgba(255, 255, 255, 0.2);
          padding: 15px 30px;
          border-radius: 50px;
          display: inline-block;
          margin-bottom: 30px;
          backdrop-filter: blur(10px);
        }

        .countdown-inline {
          display: inline-flex;
          gap: 10px;
          align-items: center;
        }

        .time-box {
          background: rgba(0, 0, 0, 0.3);
          padding: 8px 12px;
          border-radius: 8px;
          font-weight: bold;
          min-width: 40px;
        }

        .learning-badges {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin: 30px 0;
          flex-wrap: wrap;
        }

        .badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 10px 20px;
          border-radius: 25px;
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hero h1 {
          font-size: 3.5rem;
          font-weight: 800;
          margin: 30px 0;
          line-height: 1.2;
        }

        .hero .subtitle {
          font-size: 1.3rem;
          margin-bottom: 20px;
          opacity: 0.95;
        }

        .teacher-highlight {
          color: #fff200;
          font-weight: 700;
        }

        .cta-button {
          display: inline-block;
          background: #fff;
          color: #ff6b35;
          padding: 18px 40px;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 700;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          margin: 20px 0;
        }

        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
        }

        .batch-info {
          margin-top: 20px;
          font-size: 1.1rem;
          opacity: 0.9;
        }

        /* Language Selection */
        .language-section {
          background: #f8f9fa;
          padding: 80px 0;
          text-align: center;
        }

        .language-preview {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px;
          border-radius: 20px;
          margin: 40px auto;
          max-width: 500px;
          position: relative;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .language-preview:hover {
          transform: scale(1.05);
        }

        .language-preview h3 {
          font-size: 2rem;
          margin-bottom: 10px;
        }

        .tap-preview {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.2);
          padding: 8px 15px;
          border-radius: 20px;
          font-size: 0.9rem;
        }

        /* Interactive Flashcards */
        .flashcards {
          padding: 80px 0;
          background: white;
        }

        .flashcards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
          margin-top: 50px;
        }

        .flashcard {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          border-radius: 15px;
          padding: 30px;
          text-align: center;
          color: white;
          cursor: pointer;
          transition: all 0.5s ease;
          position: relative;
          height: 200px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          transform-style: preserve-3d;
        }

        .flashcard:hover {
          transform: rotateY(10deg) scale(1.05);
        }

        .flashcard.flipped {
          transform: rotateY(180deg);
        }

        .card-front, .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
          border-radius: 15px;
        }

        .card-back {
          transform: rotateY(180deg);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .sanskrit-text {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .tap-hint {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        /* Course Info */
        .course-info {
          background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
          padding: 80px 0;
          text-align: center;
          color: #333;
        }

        .course-stats {
          display: flex;
          justify-content: center;
          gap: 60px;
          margin: 50px 0;
          flex-wrap: wrap;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 4rem;
          font-weight: 800;
          color: #ff6b35;
          display: block;
        }

        .stat-label {
          font-size: 1.1rem;
          color: #666;
          margin-top: 10px;
        }

        /* Quiz Section */
        .quiz-section {
          padding: 80px 0;
          background: #f8f9fa;
        }

        .quiz-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .quiz-instructions {
          background: #e3f2fd;
          padding: 30px;
          border-radius: 15px;
          margin-bottom: 30px;
        }

        .quiz-timer {
          background: #ff6b35;
          color: white;
          padding: 15px 25px;
          border-radius: 50px;
          display: inline-block;
          font-weight: 700;
          font-size: 1.2rem;
        }

        .quiz-button {
          background: #4caf50;
          color: white;
          padding: 15px 40px;
          border: none;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .quiz-button:hover {
          background: #45a049;
          transform: translateY(-2px);
        }

        /* Teachers Section */
        .teachers-section {
          padding: 80px 0;
          background: white;
        }

        .teacher-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px;
          border-radius: 20px;
          text-align: center;
          margin: 30px auto;
          max-width: 600px;
        }

        .teacher-image {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
        }

        .achievements {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin: 20px 0;
          flex-wrap: wrap;
        }

        .achievement {
          background: rgba(255, 255, 255, 0.2);
          padding: 10px 20px;
          border-radius: 25px;
          font-size: 0.9rem;
        }

        /* Bonus Features */
        .bonus-section {
          padding: 80px 0;
          background: #f8f9fa;
        }

        .bonus-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin-top: 50px;
        }

        .bonus-card {
          background: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          position: relative;
        }

        .bonus-ribbon {
          position: absolute;
          top: -10px;
          left: 20px;
          background: #ff6b35;
          color: white;
          padding: 5px 20px;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        /* Pricing */
        .pricing-section {
          padding: 80px 0;
          background: white;
          text-align: center;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 30px;
          margin-top: 50px;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .pricing-card {
          background: white;
          border: 3px solid #e0e0e0;
          border-radius: 20px;
          padding: 40px;
          position: relative;
          transition: transform 0.3s ease;
        }

        .pricing-card:hover {
          transform: translateY(-10px);
        }

        .pricing-card.best-value {
          border-color: #ff6b35;
          transform: scale(1.05);
        }

        .plan-type {
          background: #f8f9fa;
          padding: 10px 20px;
          border-radius: 25px;
          display: inline-block;
          margin-bottom: 20px;
          font-weight: 600;
        }

        .best-value .plan-type {
          background: #ff6b35;
          color: white;
        }

        .price-display {
          margin: 20px 0;
        }

        .current-price {
          font-size: 3rem;
          font-weight: 800;
          color: #ff6b35;
        }

        .original-price {
          text-decoration: line-through;
          color: #999;
          font-size: 1.2rem;
          margin-left: 10px;
        }

        .savings {
          background: #4caf50;
          color: white;
          padding: 5px 15px;
          border-radius: 15px;
          font-size: 0.9rem;
          margin-top: 10px;
          display: inline-block;
        }

        .features-list {
          list-style: none;
          margin: 30px 0;
          text-align: left;
        }

        .features-list li {
          padding: 8px 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .features-list li::before {
          content: '✓';
          color: #4caf50;
          font-weight: bold;
        }

        /* Shloka Section */
        .shloka-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 60px 0;
          text-align: center;
        }

        .shloka {
          font-size: 1.5rem;
          font-style: italic;
          margin-bottom: 20px;
          font-family: 'Devanagari', serif;
        }

        .shloka-translation {
          font-size: 1.1rem;
          opacity: 0.9;
        }

        /* Footer */
        .footer {
          background: #2c3e50;
          color: white;
          padding: 50px 0 30px;
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
        }

        .footer-section h3 {
          margin-bottom: 20px;
          color: #3498db;
        }

        .footer-section ul {
          list-style: none;
        }

        .footer-section ul li {
          padding: 5px 0;
        }

        .footer-section ul li a {
          color: #bdc3c7;
          text-decoration: none;
          transition: color 0.3s;
        }

        .footer-section ul li a:hover {
          color: white;
        }

        .footer-bottom {
          border-top: 1px solid #34495e;
          margin-top: 30px;
          padding-top: 20px;
          text-align: center;
          color: #bdc3c7;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero h1 {
            font-size: 2.5rem;
          }
          
          .learning-badges {
            flex-direction: column;
            align-items: center;
          }
          
          .course-stats {
            flex-direction: column;
            gap: 30px;
          }
          
          .achievements {
            flex-direction: column;
            gap: 15px;
          }
          
          .flashcards-grid {
            grid-template-columns: 1fr;
          }
          
          .pricing-card.best-value {
            transform: none;
          }
        }
      `}</style>

      <div>
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <div className="special-offer">
                <span>Special Offer Ends In</span>
                <div className="countdown-inline">
                  <div className="time-box">{timeLeft.hours.toString().padStart(2, '0')}</div>
                  <span>HRS</span>
                  <span>:</span>
                  <div className="time-box">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                  <span>MIN</span>
                  <span>:</span>
                  <div className="time-box">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                  <span>SEC</span>
                </div>
              </div>

              <div className="learning-badges">
                <div className="badge">
                  <span>📖</span>
                  <span>Learn in Sanskrit Medium</span>
                </div>
                <div className="badge">
                  <span>💬</span>
                  <span>Speak From Day One</span>
                </div>
                <div className="badge">
                  <span>📝</span>
                  <span>Selection-Based Entry</span>
                </div>
              </div>

              <div style={{ fontSize: '4rem', margin: '20px 0' }}>क</div>

              <h1>
                Need a Sanskrit Environment?<br />
                Learn & Speak with a<br />
                Sanskrit Teacher – Live!
              </h1>

              <p className="subtitle">
                Practice Sanskrit in a private circle of handpicked learners & Dharmic creators — alongside{' '}
                <span className="teacher-highlight">Vishal Chaurasia</span>, live every weekend!
              </p>

              <a href="#pricing" className="cta-button">🚀 Start Your Transformation</a>

              <div className="batch-info">
                First Batch Starts August 23rd, 2025. Class Timings 07:30- 08:30 PM IST
              </div>
            </div>
          </div>
        </section>

        {/* Language Preview Section */}
        <section className="language-section">
          <div className="container">
            <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#333' }}>Language of Wisdom</h2>
            
            <div className="language-preview">
              <div className="tap-preview">Tap to Preview</div>
              <h3>Mastering Sanskrit</h3>
              <p>Start Today</p>
            </div>
          </div>
        </section>

        {/* Interactive Flashcards */}
        <section className="flashcards">
          <div className="container">
            <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '20px' }}>Learn Through Interaction</h2>
            <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
              Engage with the Sanskrit language in a fun and memorable way. Click on any card to reveal its meaning and deepen your understanding.
            </p>

            <div className="flashcards-grid">
              <div 
                className={`flashcard ${flipCards.card1 ? 'flipped' : ''}`}
                onClick={() => flipCard('card1')}
              >
                <div className="card-front">
                  <div className="sanskrit-text">कथम् अस्ति?</div>
                  <div className="tap-hint">Tap for meaning</div>
                </div>
                <div className="card-back">
                  <div><strong>Hindi:</strong> आप कैसी हैं?</div>
                  <div><strong>English:</strong> How are you?</div>
                </div>
              </div>

              <div 
                className={`flashcard ${flipCards.card2 ? 'flipped' : ''}`}
                onClick={() => flipCard('card2')}
              >
                <div className="card-front">
                  <div className="sanskrit-text">तव नाम किम्?</div>
                  <div className="tap-hint">Tap for meaning</div>
                </div>
                <div className="card-back">
                  <div><strong>Hindi:</strong> आपका नाम क्या है?</div>
                  <div><strong>English:</strong> What is your name?</div>
                </div>
              </div>

              <div 
                className={`flashcard ${flipCards.card3 ? 'flipped' : ''}`}
                onClick={() => flipCard('card3')}
              >
                <div className="card-front">
                  <div className="sanskrit-text">अहं कुशली अस्मि।</div>
                  <div className="tap-hint">Tap for meaning</div>
                </div>
                <div className="card-back">
                  <div><strong>Hindi:</strong> मैं ठीक हूँ।</div>
                  <div><strong>English:</strong> I am fine.</div>
                </div>
              </div>

              <div 
                className={`flashcard ${flipCards.card4 ? 'flipped' : ''}`}
                onClick={() => flipCard('card4')}
              >
                <div className="card-front">
                  <div className="sanskrit-text">धन्यवादः।</div>
                  <div className="tap-hint">Tap for meaning</div>
                </div>
                <div className="card-back">
                  <div><strong>Hindi:</strong> धन्यवाद।</div>
                  <div><strong>English:</strong> Thank you.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Info */}
        <section className="course-info">
          <div className="container">
            <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Speak Sanskrit Fluently with Easy Gurukul Tricks!</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
              24 Live Classes • Gurukul Speaking Tricks • 3-Month Live Course Access+ 1yr Recordings Access • Private Sanskrit Group
            </p>

            <div className="course-stats">
              <div className="stat-item">
                <span className="stat-number">108</span>
                <div className="stat-label">Seats Only</div>
              </div>
              <div className="stat-item">
                <span className="stat-number">24</span>
                <div className="stat-label">Live Sessions</div>
              </div>
              <div className="stat-item">
                <span className="stat-number">3</span>
                <div className="stat-label">Month Course + 1yr Recordings</div>
              </div>
            </div>
          </div>
        </section>

        {/* Quiz Section */}
        <section className="quiz-section">
          <div className="container">
            <div className="quiz-container">
              <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Sanskrit Quiz App</h2>
              
              {!quizStarted ? (
                <div>
                  <div className="quiz-instructions">
                    <h3 style={{ marginBottom: '20px' }}>Instructions / निर्देश:</h3>
                    <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
                      <li>20 Questions / 20 प्रश्न</li>
                      <li>Time: 15 minutes. / समय: 15 मिनट</li>
                      <li>Only one attempt allowed / केवल एक ही अवसर</li>
                      <li>The faster you finish the quiz, the higher your chances of getting a seat. / जितनी जल्दी क्विज़ को पूर्ण करेंगे उतने ही आपके अवसर बढ जाएंगे सीट पाने के।</li>
                      <li>Seats are limited based on your performance / सीटों की संख्या सीमित है और यह आपके प्रदर्शन पर निर्भर करेगी।</li>
                    </ul>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <button 
                      className="quiz-button"
                      onClick={() => setQuizStarted(true)}
                    >
                      Start Quiz
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <div className="quiz-timer" style={{ marginBottom: '30px' }}>
                    {formatTime(quizTime)}
                  </div>
                  <h3>Question {currentQuestion + 1} of 20</h3>
                  <p style={{ margin: '20px 0', fontSize: '1.1rem' }}>
                    Sample Question: What is the Sanskrit word for "water"?
                  </p>
                  <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
                    <button className="quiz-button" style={{ background: '#2196f3' }}>Previous</button>
                    <button className="quiz-button" style={{ background: '#ff9800' }}>Next</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Master Teachers */}
        <section className="teachers-section">
          <div className="container">
            <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '20px' }}>Meet Your Master</h2>
            <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#666', marginBottom: '50px' }}>
              Get a preview of the profound teachings that await you in this transformative course
            </p>

            <div className="teacher-card">
              <div className="teacher-image">👨‍🏫</div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Walushka Bahuguna</h3>
              <p style={{ opacity: '0.9', marginBottom: '20px' }}>Central Sanskrit University, Shringeri, Karnataka</p>
              <h4 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>Mastery in Spoken Sanskrit</h4>
              <p style={{ marginBottom: '20px' }}>
                Experience the beauty of Sanskrit through immersive, fluent conversation and unlock the wisdom of ancient texts.
              </p>
              
              <div className="achievements">
                <div className="achievement">Acharya in Nyaya Shastra</div>
                <div className="achievement">7 Years Shastra Learning Experience</div>
                <div className="achievement">Gold Medalist</div>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <h3 style={{ marginBottom: '30px' }}>Special classmates</h3>
              <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '30px' }}>
                Every weekend, join exclusive sessions with leading creators and learners from the Dharmic community.
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <h4>Vishal Chaurasia</h4>
                  <p style={{ color: '#666' }}>A renowned creator making ancient wisdom accessible for modern audiences.</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <h4>More Dharmic Learners</h4>
                  <p style={{ color: '#666' }}>Engage with scholars, artists, and practitioners dedicated to exploring Dharmic knowledge.</p>
                </div>
              </div>
              
              <button className="cta-button" style={{ marginTop: '30px' }}>Start Your Journey</button>
            </div>
          </div>
        </section>

        {/* Bonus Features */}
        <section className="bonus-section">
          <div className="container">
            <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '20px' }}>
              Exclusive Sanskrit Learning Bonuses! 📜✨
            </h2>
            <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#666', marginBottom: '50px' }}>
              Extra benefits to help you master conversational Sanskrit in 3 months
            </p>

            <div className="bonus-grid">
              <div className="bonus-card">
                <div className="bonus-ribbon">BONUS</div>
                <h3 style={{ marginTop: '10px', marginBottom: '15px' }}>Sanskrit Learning Material</h3>
                <p>Access curated PDFs and notes to support your learning.</p>
              </div>
              
              <div className="bonus-card">
                <div className="bonus-ribbon">BONUS</div>
                <h3 style={{ marginTop: '10px', marginBottom: '15px' }}>Weekly Practice Activities</h3>
                <p>Reinforce your lessons with exercises.</p>
              </div>
              
              <div className="bonus-card">
                <div className="bonus-ribbon">BONUS</div>
                <h3 style={{ marginTop: '10px', marginBottom: '15px' }}>Private WhatsApp Group</h3>
                <p>Connect with fellow learners, share practice clips & get ongoing support</p>
              </div>
              
              <div className="bonus-card">
                <div className="bonus-ribbon">BONUS</div>
                <h3 style={{ marginTop: '10px', marginBottom: '15px' }}>3-Month Live Course Access+ 1yr Recordings Access</h3>
                <p>Access live classes for 3 months and revisit recordings for a full year.</p>
              </div>
              
              <div className="bonus-card">
                <div className="bonus-ribbon">BONUS</div>
                <h3 style={{ marginTop: '10px', marginBottom: '15px' }}>Certificate of Completion</h3>
                <p>Recognition for successfully completing all 24 classes</p>
              </div>
              
              <div className="bonus-card">
                <div className="bonus-ribbon">BONUS</div>
                <h3 style={{ marginTop: '10px', marginBottom: '15px' }}>Priority Access to Future Courses</h3>
                <p>Be the first to enroll in advanced Sanskrit programs.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="pricing-section">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span style={{ background: '#fff200', color: '#333', padding: '5px 15px', borderRadius: '15px', fontSize: '0.9rem' }}>
                ✨ Limited Time Offer
              </span>
            </div>
            
            <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Master Conversational Sanskrit in 3 Months</h2>
            <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '30px' }}>
              A practical, live-class approach to mastering spoken Sanskrit.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '40px', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff6b35' }}>108</div>
                <div>Limited Seats</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff6b35' }}>4.9★</div>
                <div>Average Rating</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff6b35' }}>95%</div>
                <div>Completion Rate</div>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h3>Offer Ends In:</h3>
              <div style={{ display: 'inline-flex', gap: '20px', marginTop: '10px' }}>
                <div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{timeLeft.hours.toString().padStart(2, '0')}</div>
                  <div>Hours</div>
                </div>
                <div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{timeLeft.minutes.toString().padStart(2, '0')}</div>
                  <div>Minutes</div>
                </div>
                <div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{timeLeft.seconds.toString().padStart(2, '0')}</div>
                  <div>Seconds</div>
                </div>
              </div>
            </div>

            <div className="pricing-grid">
              <div className="pricing-card">
                <div className="plan-type">FLEXIBLE PLAN</div>
                <h3>Installment Plan</h3>
                <p style={{ color: '#666', margin: '10px 0' }}>Pay in easy monthly installments to get started.</p>
                
                <div className="price-display">
                  <span className="current-price">₹4,499</span>
                  <span className="original-price">₹8,499</span>
                  <div className="savings">Save 47%</div>
                  <div style={{ fontSize: '1.1rem', marginTop: '10px' }}>Only ₹1,499 per month</div>
                </div>

                <ul className="features-list">
                  <li>24 Live Classes</li>
                  <li>Sanskrit Learning Material</li>
                  <li>Seats are limited, based on performance</li>
                  <li>Private community access</li>
                </ul>

                <button className="cta-button" style={{ width: '100%' }}>Choose Installment Plan</button>
              </div>

              <div className="pricing-card best-value">
                <div className="plan-type">BEST VALUE</div>
                <h3>One-Time Payment</h3>
                <p style={{ color: '#666', margin: '10px 0' }}>Pay once and get full access to the core program.</p>
                
                <div className="price-display">
                  <span className="current-price">₹3,999</span>
                  <span className="original-price">₹8,499</span>
                  <div className="savings">Save 53%</div>
                </div>

                <ul className="features-list">
                  <li>24 Live Classes</li>
                  <li>Sanskrit Learning Material</li>
                  <li>Seats are limited, based on performance</li>
                  <li>Private community access</li>
                  <li>Classes completion certificate</li>
                  <li>1 year access</li>
                </ul>

                <button className="cta-button" style={{ width: '100%' }}>Enroll Now</button>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                <span>Certified classes</span>
                <span style={{ color: '#ffd700' }}>⭐ 4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </section>

        {/* Shloka Section */}
        <section className="shloka-section">
          <div className="container">
            <div className="shloka">भाषासु मुख्या मधुरा दिव्या गीर्वाणभारती ॥</div>
            <div className="shloka-translation">
              Among all languages, sweet and divine is the speech of the gods — Sanskrit.
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-section">
                <h3>Welcome to Shikshanam!</h3>
                <p>Explore ancient Indian wisdom and philosophies with us. Join our courses to uncover timeless teachings, now tailored for modern seekers.</p>
              </div>
              
              <div className="footer-section">
                <h3>Popular Courses</h3>
                <ul>
                  <li><a href="#">Sanskrit Bhasha Pragya</a></li>
                  <li><a href="#">Yoga Darshan</a></li>
                  <li><a href="#">Isha Upanishad</a></li>
                  <li><a href="#">Prashna Upanishad</a></li>
                </ul>
              </div>
              
              <div className="footer-section">
                <h3>Contact Info</h3>
                <p><strong>Headquarters</strong><br />Delhi</p>
                <p><strong>Phone</strong><br />+91-9910032165</p>
                <p><strong>Email</strong><br />support@shikshanam.in</p>
              </div>
            </div>
            
            <div className="footer-bottom">
              <p>Copyright © 2025 Shikshanam | Learn Sanskrit Online</p>
              <p>Powered by Hyperfinity Creations Private Limited</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}