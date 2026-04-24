import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export function Favorites() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <div className="bg-primary/5 p-8 pill mb-8">
        <Heart size={48} className="text-primary opacity-20" />
      </div>
      <h2 className="text-3xl font-bold mb-4">ваша коллекция</h2>
      <p className="opacity-50 lowercase max-w-xs">
        сохраняйте предметы, которые вам нравятся. ваше спокойное пространство начинается здесь.
      </p>
    </div>
  );
}
