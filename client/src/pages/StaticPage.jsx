import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { DISCLAIMER } from '../utils/diseases.js';

const PAGES = {
  privacy: {
    title: 'Privacy',
    body: [
      'HealthPredict stores your account details (name, email and a hashed password) and the assessments you choose to run, so you can review them later.',
      'Assessment inputs and results are linked to your account and visible only to you and to platform administrators who manage the service.',
      'You can delete any assessment from your history at any time. Contact the site owner to have your account removed.',
      'Replace this text with your own privacy policy before publishing the project publicly.',
    ],
  },
  terms: {
    title: 'Terms of use',
    body: [
      'HealthPredict is an educational project. By using it you agree that results are estimates and not medical advice.',
      'Do not enter information about other people without their permission.',
      'Replace this text with your own terms before publishing the project publicly.',
    ],
  },
  disclaimer: {
    title: 'Medical disclaimer',
    body: [
      DISCLAIMER,
      'The platform does not diagnose conditions, prescribe medication or recommend treatment. Never delay or stop seeking medical advice because of a result shown here.',
      'Models are simple statistical models trained on public research datasets. Their performance on those datasets does not represent real-world clinical accuracy.',
      'If you have symptoms or concerns, contact a qualified healthcare professional.',
    ],
  },
  contact: {
    title: 'Contact',
    body: ['Add your contact details here (email, GitHub or LinkedIn) before sharing the project.'],
  },
};

export default function StaticPage({ page }) {
  const { title, body } = PAGES[page];
  return (
    <>
      <Navbar />
      <main className="container static-page">
        <h1>{title}</h1>
        {body.map((p) => <p key={p}>{p}</p>)}
      </main>
      <Footer />
    </>
  );
}
