import { Star } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  tutorName: string;
  rating: number;
  setRating: (rating: number) => void;
  comment: string;
  setComment: (comment: string) => void;
  isSubmitting?: boolean;
}

export default function ReviewModal({
  isOpen,
  onClose,
  onSubmit,
  tutorName,
  rating,
  setRating,
  comment,
  setComment,
  isSubmitting = false
}: ReviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-6 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
        <h3 className="text-2xl font-black text-gray-900 mb-2">Rate your session</h3>
        <p className="text-gray-500 mb-6">How was your session with {tutorName}?</p>
        
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button 
              key={star}
              onClick={() => setRating(star)}
              className={`p-2 transition hover:scale-110 ${rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-200'}`}
              type="button"
            >
              <Star className={`w-8 h-8 ${rating >= star ? 'fill-current' : ''}`} />
            </button>
          ))}
        </div>

        <textarea 
          className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl mb-6 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-medium resize-none"
          placeholder="Share your experience..."
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-4 font-bold text-gray-500 hover:bg-gray-50 rounded-2xl transition"
            type="button"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSubmit(rating, comment)}
            disabled={isSubmitting}
            className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition shadow-xl hover:shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
            type="button"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
}
