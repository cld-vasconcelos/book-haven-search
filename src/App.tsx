import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { BookPage } from './pages/BookPage';
import { AuthorPage } from './pages/AuthorPage';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
  return (
    <Router>
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/book/:id" element={<BookPage />} />
        <Route path="/author/:name" element={<AuthorPage />} />
      </Routes>
    </Router>
  );
}

export default App;