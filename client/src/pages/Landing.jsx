import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Button from '../components/Button.jsx';
import Icon from '../components/Icon.jsx';
import HeroVisual from '../components/HeroVisual.jsx';
import DiseaseCard from '../components/DiseaseCard.jsx';
import { DISEASES, DISCLAIMER } from '../utils/diseases.js';

const STATS = [
  { value: `${DISEASES.length}+`, label: 'Health conditions covered' },
  { value: 'JWT', label: 'Secured user accounts' },
  { value: '1 form', label: 'Per condition, built for its model' },
  { value: 'Saved', label: 'Prediction history and reports' },
];

const FEATURES = [
  { icon: 'gauge', title: 'Risk assessment', text: 'Enter measurements and get an estimated risk level with a probability score.' },
  { icon: 'layers', title: 'Multiple conditions', text: 'Each condition has its own form, so you only answer questions that matter for it.' },
  { icon: 'clock', title: 'Prediction history', text: 'Search, filter and revisit every assessment you have saved.' },
  { icon: 'chart', title: 'Health insights', text: 'General, educational guidance on lifestyle factors linked to each condition.' },
  { icon: 'file', title: 'PDF reports', text: 'Download a clean report of any assessment to keep or share with your doctor.' },
  { icon: 'lock', title: 'Secure accounts', text: 'Hashed passwords, token-based sessions and role-based access control.' },
];

const STEPS = [
  { title: 'Select a condition', text: 'Pick from the list of supported conditions.' },
  { title: 'Enter information', text: 'Fill in the measurements the model needs.' },
  { title: 'Analyze', text: 'Our service estimates a risk score from your inputs.' },
  { title: 'View the result', text: 'See your risk level, details and general guidance.' },
];

export default function Landing() {
  return (
    <>
      <Navbar />
      <main id="top">
        <section className="hero">
          <div className="container hero__grid">
            <div className="hero__copy">
              <h1>Understand your health risks with data-driven insights</h1>
              <p className="hero__lead">
                HealthPredict gives you educational health-risk estimates based on the information you enter. Use them to start better conversations with your doctor.
              </p>
              <div className="hero__cta">
                <Button to="/register" size="lg">Start assessment</Button>
                <Button href="#diseases" variant="secondary" size="lg">Explore diseases</Button>
              </div>
              <p className="hero__fine"><Icon name="info" size={16} /> Not a medical diagnosis. Always consult a qualified healthcare professional.</p>
            </div>
            <HeroVisual />
          </div>
        </section>

        <section className="stats" aria-label="Platform overview">
          <div className="container stats__grid">
            {STATS.map((s) => (
              <div key={s.label} className="stats__item">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="features">
          <div className="container">
            <header className="section__head">
              <h2>Everything you need to track and understand your results</h2>
              <p>A focused set of tools, from your first assessment to a report you can bring to an appointment.</p>
            </header>
            <div className="features">
              {FEATURES.map((f) => (
                <article key={f.title} className="feature">
                  <Icon name={f.icon} size={22} />
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--tint" id="how-it-works">
          <div className="container">
            <header className="section__head">
              <h2>How it works</h2>
              <p>Four steps from choosing a condition to reading your estimate.</p>
            </header>
            <ol className="steps">
              {STEPS.map((s, i) => (
                <li key={s.title} className="step">
                  <span className="step__num" aria-hidden="true">{i + 1}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section" id="diseases">
          <div className="container">
            <header className="section__head">
              <h2>Supported conditions</h2>
              <p>Each assessment uses inputs specific to that condition. More conditions can be added over time.</p>
            </header>
            <div className="disease-grid">
              {DISEASES.map((d) => (
                <DiseaseCard key={d.id} disease={d} to={`/assessment?disease=${d.id}`} />
              ))}
            </div>
          </div>
        </section>

        <section className="section section--tint" id="about">
          <div className="container about">
            <div>
              <h2>Built to inform, not to diagnose</h2>
              <p>
                HealthPredict uses simple, classical machine learning models trained on public research datasets. The goal is to help you understand which factors matter, not to replace clinical judgment.
              </p>
            </div>
            <aside className="disclaimer" role="note" aria-label="Medical disclaimer">
              <Icon name="shield" size={22} />
              <div>
                <h3>Medical disclaimer</h3>
                <p>{DISCLAIMER}</p>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
