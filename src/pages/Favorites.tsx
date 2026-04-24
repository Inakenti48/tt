import { motion } from 'framer-motion';
import { Heart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Favorites() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      {/* Back button */}
      <div className="w-full mb-4 text-left">
        <button
          onClick={() => navigate(-1)}
          className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-sm hover:shadow-md transition-shadow"
        >
          <ArrowLeft size={20} />
        </button>
      </div>
      <div className="bg-primary/5 p-8 pill mb-8">
        <Heart size={48} className="text-primary opacity-20" />
      </div>
      <h2 className="text-3xl font-bold mb-4">Ваша коллекция</h2>
      <p className="opacity-50  max-w-xs">
        Сохраняйте предметы, которые вам нравятся. ваше спокойное пространство начинается здесь.
      </p>
    </div>
  );
}
