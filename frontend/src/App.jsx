import React from 'react'
import { AuthProvider } from './context/AuthContext'
import StudentList from './components/StudentList'

const App = () => {
    return (
        <AuthProvider>
            <StudentList />
        </AuthProvider>
    )
}

export default App