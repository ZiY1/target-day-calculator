import React from 'react'
import TargetDateCalculator from './components/TargetDateCalculator'

const App: React.FC = () => {
    return (
        <div style={{ maxWidth: 760, margin: '2rem auto', padding: '1rem' }}>
            <h1>Calculate Target Dates Between a Range</h1>
            <TargetDateCalculator />
        </div>
    )
}

export default App
