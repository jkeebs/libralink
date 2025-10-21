import { useState } from 'react'
import HomePage from './pages/HomePage'
import StudentPage from './pages/StudentPage'

function App() {
  const [role, setRole] = useState('teacher');

  return (
    <div>
      <header className="p-4 border-b mb-4 flex items-center justify-between">
        <div className="font-bold">libralink</div>
        <div className="flex items-center gap-2">
          <button className={`btn btn-rounded-small ${role === 'teacher' ? 'btn-primary' : ''}`} onClick={() => setRole('teacher')}>Teacher</button>
          <button className={`btn btn-rounded-small ${role === 'student' ? 'btn-primary' : ''}`} onClick={() => setRole('student')}>Student</button>
        </div>
      </header>
      <main>
        {role === 'teacher' ? <HomePage /> : <StudentPage />}
      </main>
    </div>
  )
}

export default App;
