import { useEffect } from 'react'
import './App.css'
import StarField from './components/StarField'
import Navbar from './components/Navbar'
import Hero from './components/Hero'

// Import fonts
import '@fontsource/inter'
import '@fontsource/poppins'

function App() {
  // Set dark theme on body
  useEffect(() => {
    document.body.classList.add('dark-theme');
    return () => {
      document.body.classList.remove('dark-theme');
    };
  }, []);

  return (
    <div className="app">
      <StarField />
      <div className="content">
        <Navbar />
        <main>
          <Hero />
        </main>
      </div>
    </div>
  )
}

export default App
