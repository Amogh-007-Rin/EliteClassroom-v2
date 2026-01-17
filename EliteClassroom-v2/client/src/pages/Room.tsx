
import { useParams, Link } from 'react-router-dom';
import { Video, Mic, PhoneOff, Settings } from 'lucide-react';

export default function Room() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="p-4 flex justify-between items-center bg-gray-800 border-b border-gray-700">
        <h1 className="text-white font-semibold">Virtual Classroom: {id}</h1>
        <Link to="/dashboard" className="text-gray-400 hover:text-white px-4 py-2 rounded-md bg-gray-700">
          Leave Room
        </Link>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-4xl aspect-video bg-gray-800 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden shadow-2xl border border-gray-700">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="text-gray-500 w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Video Room Placeholder</h2>
            <p className="text-gray-400">MVP Constraint: Live video feature is not implemented yet.</p>
          </div>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-4 bg-gray-900/80 p-4 rounded-2xl backdrop-blur-md border border-gray-700">
            <button className="p-3 bg-gray-700 rounded-full text-white hover:bg-gray-600">
              <Mic className="w-6 h-6" />
            </button>
            <button className="p-3 bg-gray-700 rounded-full text-white hover:bg-gray-600">
              <Video className="w-6 h-6" />
            </button>
            <button className="p-3 bg-gray-700 rounded-full text-white hover:bg-gray-600">
              <Settings className="w-6 h-6" />
            </button>
            <button className="p-3 bg-red-600 rounded-full text-white hover:bg-red-700">
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
