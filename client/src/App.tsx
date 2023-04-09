import './App.css';
import { Footer, Navbar, Services, Transactions, Welcome } from "./components";

function App() {
  // Title of the app
  document.title = "Krypto";

  return (
    <div className="min-h-screen">
      <div className='gradient-bg-welcome'>
        <Navbar />
        <Welcome />
      </div>
      <Services />
      <Transactions />
      <Footer />
    </div>

  )
}

export default App
