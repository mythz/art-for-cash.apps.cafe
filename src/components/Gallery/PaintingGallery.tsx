import { useState } from 'react';
import { Modal } from '../UI/Modal';
import { PaintingCard } from './PaintingCard';
import { PaintingModal } from './PaintingModal';
import { Painting } from '../../types';
import { useGame } from '../../context/GameContext';

interface PaintingGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitToAI?: (painting: Painting) => void;
}

type FilterType = 'all' | 'sold' | 'unsold';
type SortType = 'newest' | 'oldest' | 'price';

export function PaintingGallery({
  isOpen,
  onClose,
  onSubmitToAI,
}: PaintingGalleryProps) {
  const { paintings, deletePainting } = useGame();
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('newest');
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(
    null
  );

  const filteredPaintings = paintings.filter((p) => {
    if (filter === 'sold') return p.soldFor !== null;
    if (filter === 'unsold') return p.soldFor === null;
    return true;
  });

  const sortedPaintings = [...filteredPaintings].sort((a, b) => {
    if (sort === 'newest') return b.createdAt - a.createdAt;
    if (sort === 'oldest') return a.createdAt - b.createdAt;
    if (sort === 'price') {
      const aPrice = a.soldFor || 0;
      const bPrice = b.soldFor || 0;
      return bPrice - aPrice;
    }
    return 0;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this painting?')) {
      await deletePainting(id);
      setSelectedPainting(null);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="🖼️ Your Gallery" maxWidth="xl">
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-100 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-700">
                {paintings.length}
              </div>
              <div className="text-sm text-blue-600">Total Paintings</div>
            </div>
            <div className="bg-green-100 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-700">
                {paintings.filter((p) => p.soldFor !== null).length}
              </div>
              <div className="text-sm text-green-600">Sold</div>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-700">
                {paintings.filter((p) => p.soldFor === null).length}
              </div>
              <div className="text-sm text-purple-600">Unsold</div>
            </div>
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('sold')}
                className={`px-3 py-1 rounded ${
                  filter === 'sold'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Sold
              </button>
              <button
                onClick={() => setFilter('unsold')}
                className={`px-3 py-1 rounded ${
                  filter === 'unsold'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Unsold
              </button>
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortType)}
              className="px-3 py-1 border border-gray-300 rounded"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price">Highest Price</option>
            </select>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {sortedPaintings.map((painting) => (
              <PaintingCard
                key={painting.id}
                painting={painting}
                onClick={() => setSelectedPainting(painting)}
              />
            ))}
          </div>

          {sortedPaintings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {filter === 'all'
                ? 'No paintings yet. Create your first masterpiece!'
                : `No ${filter} paintings`}
            </div>
          )}
        </div>
      </Modal>

      {/* Painting Detail Modal */}
      {selectedPainting && (
        <PaintingModal
          painting={selectedPainting}
          isOpen={!!selectedPainting}
          onClose={() => setSelectedPainting(null)}
          onDelete={handleDelete}
          onSubmitToAI={onSubmitToAI}
        />
      )}
    </>
  );
}
