import { useState, useEffect } from 'react';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import { AIReview } from '../../types';
import { aiService } from '../../services/aiService';
import { useGame } from '../../context/GameContext';

interface AISaleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageData: string;
  onAccept: (review: AIReview) => void;
}

export function AISaleDialog({
  isOpen,
  onClose,
  imageData,
  onAccept,
}: AISaleDialogProps) {
  const { gameState } = useGame();
  const [review, setReview] = useState<AIReview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && imageData) {
      evaluatePainting();
    }
  }, [isOpen, imageData]);

  const evaluatePainting = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const averageSalePrice =
        gameState.paintingCount > 0
          ? gameState.totalEarnings / gameState.paintingCount
          : 0;

      const aiReview = await aiService.evaluatePainting(imageData, {
        paintingCount: gameState.paintingCount,
        averageSalePrice,
        canvasSize: gameState.currentCanvasSize,
      });

      setReview(aiReview);
    } catch (err) {
      console.error('Failed to evaluate painting:', err);
      setError('Failed to evaluate painting. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = () => {
    if (review) {
      onAccept(review);
      onClose();
    }
  };

  const handleReject = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Art Critic Review" maxWidth="lg">
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
          <p className="text-lg text-gray-600">
            The AI critic is reviewing your painting...
          </p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={evaluatePainting}>Retry</Button>
        </div>
      )}

      {review && !isLoading && (
        <div className="space-y-6">
          {/* Price Offer */}
          <div className="text-center bg-gradient-to-r from-yellow-100 to-yellow-200 p-6 rounded-lg">
            <p className="text-gray-700 text-lg mb-2">I'll pay you</p>
            <p className="text-5xl font-bold text-yellow-700">
              💰 {review.price}
            </p>
            <p className="text-gray-600 mt-1">coins for this painting</p>
          </div>

          {/* Feedback */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">
              💬 Critic's Feedback
            </h4>
            <p className="text-gray-700 italic">"{review.feedback}"</p>
          </div>

          {/* Analysis Points */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800">📊 Analysis</h4>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Composition</span>
                <span className="font-semibold">
                  {review.analysisPoints.composition}/10
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${(review.analysisPoints.composition / 10) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Color Use</span>
                <span className="font-semibold">
                  {review.analysisPoints.colorUse}/10
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{
                    width: `${(review.analysisPoints.colorUse / 10) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Creativity</span>
                <span className="font-semibold">
                  {review.analysisPoints.creativity}/10
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{
                    width: `${(review.analysisPoints.creativity / 10) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Technical Skill</span>
                <span className="font-semibold">
                  {review.analysisPoints.technicalSkill}/10
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-600 h-2 rounded-full"
                  style={{
                    width: `${(review.analysisPoints.technicalSkill / 10) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              onClick={handleAccept}
              variant="success"
              size="lg"
              className="flex-1"
            >
              ✓ Accept Offer
            </Button>
            <Button
              onClick={handleReject}
              variant="secondary"
              size="lg"
              className="flex-1"
            >
              ✗ Decline
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
