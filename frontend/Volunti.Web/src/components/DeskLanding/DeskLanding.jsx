import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './DeskLanding.css';

// Importera alla bilder från assets-mappen
import churchLogo from './assets/church-logo.png';
import phoneScreenshot from './assets/phone-screenshot.png';
import uiProfile from './assets/ui-profile.png';
import uiList from './assets/ui-list.png';
import uiCalendar from './assets/ui-calendar.png';


const DeskLanding = () => {
  const navigate = useNavigate(); 

  // Data för sektionerna
  const whyCards = [
    { title: "På dina villkor", text: "Du bestämmer när du är tillgänglig. Ange ditt schema och få uppdrag som passar din vardag." },
    { title: "Helt kostnadsfritt", text: "Volunti är gratis. Vår mission är att göra volontärarbete tillgänglighet för alla." },
    { title: "Enkel administration", text: "Hantera alla uppdrag och volontärer på ett ställe. Tydlig översikt och enkel kommunikation." },
    { title: "Rätt matchning", text: "Systemet matchar era uppdrag med volontärer utifrån intressen, kompetens och tillgänglighet." },
    { title: "Statistik och Uppföljning", text: "Se nedlagda timmar, vilka uppdrag som engagerar mest och hur ert volontärnätverk växer." }
  ];

  const stories = [
    { name: "Sara L.", role: "Volontär", text: "Jag var lite nervös innan men det var helt fantastiskt. Insatsen gjorde verkligen skillnad!", likes: 34, comments: 7, color: "#7B61FF" },
    { name: "Marcus T.", role: "Volontär", text: "Roligt och lärorikt! Volunti gjorde det så enkelt att hitta något som passade min vardag.", likes: 18, comments: 3, color: "#22C55E" },
    { name: "Annika K.", role: "Organisation", text: "Tack vare alla fantastiska volontärer kunde vi genomföra vårt event och hjälpa fler än någonsin.", likes: 52, comments: 11, color: "#F59E0B" }
  ];

  const valueCards = [
    { title: "På dina villkor", text: "Du bestämmer när du är tillgänglig. Ange ditt schema och få uppdrag som passar din vardag." },
    { title: "Dina intressen", text: "Volunti matchar dig med uppdrag som speglar det du brinner för, till exempel miljö, barn eller djur." },
    { title: "Byggt av community", text: "Volunti är skapat tillsammans med volontärer. Uppdrag läggs upp av riktiga människor." }
  ];

  const missionsData = [
    {
      id: 1,
      title: "Strandstädning i Stockholm",
      org: "Svenska Kyrkan",
      logo: churchLogo,
      contact: "Karl Svensson",
      location: "Långholmen",
      date: "15 Maj",
      time: "10:00-15:00",
      description: "Vi söker volontärer som vill hjälpa till att städa stranden från skräp och plast. Uppdraget innebär att samla in avfall och sortera det."
    },
    {
      id: 2,
      title: "Hjälp till i caféet",
      org: "Svenska Kyrkan",
      logo: churchLogo,
      contact: "Anna Larsson",
      location: "Södermalm",
      date: "17 Maj",
      time: "12:00-16:00",
      description: "Vi behöver förstärkning i vårt community-café. Arbetsuppgifterna inkluderar servering, kassa och att prata med gästerna."
    },
    {
      id: 3,
      title: "Trädgårdsarbete",
      org: "Svenska Kyrkan",
      logo: churchLogo,
      contact: "Johan Ek",
      location: "Vasastan",
      date: "20 Maj",
      time: "09:00-13:00",
      description: "Hjälp oss att göra fint i vår kyrkoträdgård inför sommaren. Vi ska plantera blommor, rensa ogräs och klippa häckar."
    }
  ];

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="landing-container nav-wrapper">
          <div className="logo-text">VOLUNTI</div>
          <nav>
            <ul className="nav-links">
              <li><a href="#hem">Hem</a></li>
              <li><a href="#hur-det-fungerar">Hur det fungerar</a></li>
              <li><a href="#om-oss">Om oss</a></li>
              <li><a href="#hur-de-gar-till">Hur de går till</a></li>
            </ul>
          </nav>
          <button className="btn btn-white-solid" onClick={() => navigate('/login')}>Logga in</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero" id="hem">
        <div className="landing-container hero-content">
          <div className="hero-text">
            <h1>Gör skillnad<br/>nära dig</h1>
            <p>Volunti kopplar samman volontärer med organisationer som behöver hjälp. Hitta uppdrag, engagera dig och gör avtryck i ditt lokalsamhälle.</p>
            <div className="hero-btns">
              <button className="btn btn-white-solid" onClick={() => navigate('/register')}>Kom igång gratis</button>
              <button className="btn btn-outline" onClick={() => navigate('/login')}>Logga in</button>
            </div>
          </div>
          
          <div className="hero-graphics">
            <div className="placeholder-phone">
              <div className="dynamic-island">
                <div className="camera-dot"></div>
              </div>
              <div className="phone-inner">
                {/* Screenshot inuti mobilen */}
                <img src={phoneScreenshot} alt="Volunti App" className="phone-screenshot-img" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hur det fungerar */}
      <section className="how-it-works" id="hur-det-fungerar">
        <div className="landing-container">
          <div className="section-title">
            <h2>Hur det fungerar</h2>
            <p>Tre enkla steg för att komma igång.</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <span className="step-num">01</span>
              <h3>Skapa konto</h3>
              <p>Registrera dig på 5 minuter och berätta vad du vill bidra med.</p>
            </div>
            <div className="step-card">
              <span className="step-num">02</span>
              <h3>Hitta uppdrag</h3>
              <p>Bläddra bland uppdrag eller låt oss rekommendera baserat på dina intressen.</p>
            </div>
            <div className="step-card">
              <span className="step-num">03</span>
              <h3>Bidra</h3>
              <p>Anmäl dig, genomför uppdraget och gör skillnad i ditt lokalsamhälle.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Allt du behöver */}
      <section className="features-section" id="om-oss">
        <div className="landing-container features-wrapper">
          <div className="features-text">
            <h2>Allt du behöver-<br/>i en och samma app</h2>
            <p>Volunti gör det enkelt att engagera sig och samarbeta för ett bättre samhälle.</p>
            <ul className="feature-list">
              <li><span className="check">✓</span> Personliga uppdrag</li>
              <li><span className="check">✓</span> Schema & tillgänglighet</li>
              <li><span className="check">✓</span> Notiser på dina villkor</li>
              <li><span className="check">✓</span> Trygga profiler och omdömen</li>
            </ul>
          </div>
          
          {/* Sektionen uppdaterad med de tre riktiga bilderna */}
          <div className="features-ui">
             <img src={uiProfile} alt="Profil UI" className="ui-image" />
             <img src={uiList} alt="Lista UI" className="ui-image" />
             <img src={uiCalendar} alt="Kalender UI" className="ui-image" />
          </div>
        </div>
      </section>

      {/* Varför Volunti? */}
      <section className="why-volunti">
        <div className="landing-container">
          <div className="section-title">
            <h2>Varför Volunti?</h2>
            <p>Allt ni behöver för att hitta och engagera rätt volontärer.</p>
          </div>
          <div className="why-grid">
            {whyCards.map((card, index) => (
              <div className="why-card" key={index}>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Redo att göra skillnad (Blue Banner) */}
      <section className="cta-banner">
        <div className="landing-container cta-content">
          <div>
            <h2>Redo att göra skillnad?</h2>
            <p>Hitta uppdrag nära dig eller skapa egna uppdrag för din organisation</p>
          </div>
          <div className="cta-btns">
            <button className="btn btn-white-solid" onClick={() => navigate('/register')}>Kom igång gratis</button>
            <button className="btn btn-outline" onClick={() => navigate('/login')}>Logga in</button>
          </div>
        </div>
      </section>

      {/* Berättelser från Communityt */}
      <section className="community-stories">
        <div className="landing-container stories-wrapper">
          <div className="stories-text">
            <h2>Berättelser från<br/>Communityt</h2>
            <p>Volontärer delar sina upplevelser, med egna ord.</p>
          </div>
          <div className="stories-grid">
            {stories.map((story, i) => (
              <div className="story-card" key={i}>
                <div className="story-author">
                  <div className="author-avatar" style={{ backgroundColor: story.color }}>{story.name.charAt(0)}</div>
                  <div>
                    <h4>{story.name}</h4>
                    <span>{story.role}</span>
                  </div>
                </div>
                <p>"{story.text}"</p>
                <div className="story-stats">
                  <span>♡ {story.likes}</span>
                  <span>💬 {story.comments}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volontärarbete på riktigt */}
      <section className="real-volunteering">
        <div className="landing-container">
          <h2 className="text-center">Volontärarbete på riktigt</h2>
          <div className="value-grid">
            {valueCards.map((card, i) => (
              <div className="value-card" key={i}>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hitta nästa uppdrag */}
      <section className="find-missions">
        <div className="landing-container">
          <div className="section-title text-center">
            <h2>Hitta nästa uppdrag</h2>
            <p>Bläddra bland uppdrag nära dig. Skapa ett konto för att anmäla dig.</p>
          </div>
          
          <div className="filter-tags">
            <button className="tag active">Alla</button>
            <button className="tag">Miljö</button>
            <button className="tag">Barn och Ungdom</button>
            <button className="tag">Äldreomsorg</button>
            <button className="tag">Matutdelning</button>
            <button className="tag">Djur</button>
          </div>

          <div className="mission-cards-grid">
            {missionsData.map((mission) => (
              <div className="mission-card" key={mission.id}>
                <div className="mission-header">
                  <div 
                    className="org-logo-circle" 
                    style={{ backgroundImage: `url(${mission.logo})` }}
                  ></div>
                  <div>
                    <h4>{mission.title}</h4>
                    <span className="org-name">{mission.org}</span>
                  </div>
                </div>
                <div className="mission-info">
                  <span>👤 {mission.contact}</span>
                  <span>📍 {mission.location}</span>
                  <span>📅 {mission.date}</span>
                  <span>⏰ {mission.time}</span>
                </div>
                <div className="mission-tags">
                  <span className="m-tag">🚗 Bil</span>
                  <span className="m-tag">👥 1 person</span>
                </div>
                <p className="mission-desc">{mission.description}</p>
                <div className="mission-card-btns">
                  <button className="btn-granska">Granska</button>
                  <button className="btn-redigera">Redigera</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-container footer-wrapper">
          <div className="footer-top">
            <h2 className="footer-logo">VOLUNTI</h2>
            <ul className="footer-links">
              <li><a href="#hem">Hem</a></li>
              <li><a href="#hur-det-fungerar">Hur det fungerar</a></li>
              <li><a href="#om-oss">Om oss</a></li>
              <li><a href="#hur-de-gar-till">Hur de går till</a></li>
            </ul>
          </div>
          <div className="footer-middle">
            <p>Små insatser. Stor skillnad.</p>
            <div className="footer-btns">
              <button className="btn btn-white-solid" onClick={() => navigate('/register')}>Kom igång gratis</button>
              <button className="btn btn-outline" onClick={() => navigate('/login')}>Logga in</button>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Volunti. Alla rättigheter förbehållna.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DeskLanding;