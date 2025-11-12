import { Painting } from '../../types';

interface PaintingCardProps {
  painting: Painting;
  onClick: () => void;
}

export function PaintingCard({ painting, onClick }: PaintingCardProps) {
  const isSold = painting.soldFor !== null;

  return (
    <div
      onClick={onClick}
      className="border-2 border-gray-300 rounded-lg overflow-hidden cursor-pointer hover:border-blue-500 transition"
    >
      <div className="relative">
        <img
          src={painting.thumbnail}
          alt="Painting thumbnail"
          className="w-full h-32 object-cover"
        />
        {isSold && (
          <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
            SOLD
          </div>
        )}
      </div>

      <div className="p-2 bg-gray-50">
        <div className="text-xs text-gray-600">
          {new Date(painting.createdAt).toLocaleDateString()}
        </div>
        {isSold && (
          <div className="text-sm font-bold text-green-700">
            💰 {painting.soldFor} coins
          </div>
        )}
        {!isSold && (
          <div className="text-sm text-gray-500">Not sold yet</div>
        )}
      </div>
    </div>
  );
}
