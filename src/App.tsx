import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Foundation from './pages/Foundation'
import Pier from './pages/Pier'

function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Foundation />} />
          <Route path='/foundation' element={<Foundation />} />
          <Route path='/pier' element={<Pier />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
