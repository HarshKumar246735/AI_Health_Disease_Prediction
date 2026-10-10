import Navbar from '../components/Navbar.jsx';
import Button from '../components/Button.jsx';
import Footer from '../components/Footer.jsx';

export default function ComingSoon({ title, notFound = false }) {
  return (
    <>
      <Navbar />
      <main className="container stub">
        <h1>{title}</h1>
        <p>{notFound ? "This page doesn't exist. Check the address or head back home." : 'This section is built in a later phase of the project.'}</p>
        <Button to="/">Back to home</Button>
      </main>
      <Footer />
    </>
  );
}
