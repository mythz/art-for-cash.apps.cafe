import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import { Painting } from '../../types';

interface PaintingModalProps {
  painting: Painting;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  onSubmitToAI?: (painting: Painting) => void;
}

export function PaintingModal({
  painting,
  isOpen,
  onClose,
  onDelete,
  onSubmitToAI,
}: PaintingModalProps) {
  const isSold = painting.soldFor !== null;

  const handleSubmitToAI = () => {
    if (onSubmitToAI && !isSold) {
      onSubmitToAI(painting);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Painting Details" maxWidth="lg">
      <div className="space-y-4">
        {/* Painting Image */}
        <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
          <img
            src={painting.imageData}
            alt="Painting"
            className="w-full h-auto"
          />
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-100 p-3 rounded">
            <div className="text-sm text-gray-600">Created</div>
            <div className="font-semibold">
              {new Date(painting.createdAt).toLocaleString()}
            </div>
          </div>

          <div className="bg-gray-100 p-3 rounded">
            <div className="text-sm text-gray-600">Canvas Size</div>
            <div className="font-semibold">{painting.canvasSize.name}</div>
          </div>

          {isSold && (
            <>
              <div className="bg-green-100 p-3 rounded">
                <div className="text-sm text-green-600">Sold For</div>
                <div className="font-semibold text-green-700">
                  💰 {painting.soldFor} coins
                </div>
              </div>

              <div className="bg-green-100 p-3 rounded">
                <div className="text-sm text-green-600">Sold On</div>
                <div className="font-semibold text-green-700">
                  {painting.soldAt &&
                    new Date(painting.soldAt).toLocaleDateString()}
                </div>
              </div>
            </>
          )}
        </div>

        {/* AI Review if available */}
        {painting.aiReview && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">
              🤖 AI Review
            </h4>
            <p className="text-gray-700 italic mb-3">
              "{painting.aiReview.feedback}"
            </p>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Composition:</span>{' '}
                <span className="font-semibold">
                  {painting.aiReview.analysisPoints.composition}/10
                </span>
              </div>
              <div>
                <span className="text-gray-600">Color Use:</span>{' '}
                <span className="font-semibold">
                  {painting.aiReview.analysisPoints.colorUse}/10
                </span>
              </div>
              <div>
                <span className="text-gray-600">Creativity:</span>{' '}
                <span className="font-semibold">
                  {painting.aiReview.analysisPoints.creativity}/10
                </span>
              </div>
              <div>
                <span className="text-gray-600">Technical Skill:</span>{' '}
                <span className="font-semibold">
                  {painting.aiReview.analysisPoints.technicalSkill}/10
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3 pt-4">
          {!isSold && onSubmitToAI && (
            <Button
              onClick={handleSubmitToAI}
              variant="success"
              size="lg"
              className="flex-1"
            >
              🤖 Submit to AI
            </Button>
          )}
          <Button
            onClick={() => onDelete(painting.id)}
            variant="danger"
            size="lg"
            className={!isSold && onSubmitToAI ? '' : 'flex-1'}
          >
            🗑️ Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
