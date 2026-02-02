import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FlowTAView from './views/FlowTAView';

function App() {
    return (
        <Router>
            <div className="bg-[#0f1115] min-h-screen text-white font-sans">
                <Routes>
                    {/* Default to FlowTAView */}
                    <Route path="/" element={<Navigate to="/flow" replace />} />
                    <Route path="/flow" element={<FlowTAView />} />
                    <Route path="*" element={<Navigate to="/flow" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
