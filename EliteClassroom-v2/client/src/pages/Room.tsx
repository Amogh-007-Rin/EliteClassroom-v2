
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
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full h-full max-w-6xl bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
            <iframe 
                src={`https://meet.jit.si/EliteClassroom-${id}`} 
                className="w-full h-full min-h-[600px]" 
                allow="camera; microphone; fullscreen; display-capture; autoplay"
            ></iframe>
        </div>
      </main>
    </div>
  );
}
