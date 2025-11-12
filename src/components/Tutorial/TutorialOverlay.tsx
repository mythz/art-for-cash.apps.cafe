import { useState, useEffect } from 'react';
import { Button } from '../UI/Button';
import { STORAGE_KEYS } from '../../utils/constants';

interface TutorialStep {
  title: string;
  message: string;
  position?: 'center' | 'top' | 'bottom';
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: 'Welcome to AI Art Shop!',
    message:
      'Create paintings and sell them to an AI art critic to earn coins. Use your earnings to unlock new colors, brushes, and larger canvases!',
    position: 'center',
  },
  {
    title: 'Your Canvas',
    message:
      'This is your canvas. Click and drag to paint! Use the tools on the right to select colors and brush sizes.',
    position: 'center',
  },
  {
    title: 'Choose Your Colors',
    message:
      'Start with 5 basic colors. You can unlock more colors from the shop as you earn coins!',
    position: 'center',
  },
  {
    title: 'Brush Sizes',
    message:
      'Select different brush sizes for fine details or broad strokes. Unlock larger brushes in the shop!',
    position: 'center',
  },
  {
    title: 'Create Something!',
    message:
      'Try painting something - anything you create has value! Let your creativity flow.',
    position: 'center',
  },
  {
    title: 'Submit to AI',
    message:
      'When you\'re done, click "Submit to AI" to have your painting evaluated. The AI will make you an offer!',
    position: 'center',
  },
  {
    title: 'Visit the Shop',
    message:
      'Use your coins in the Shop to unlock new colors, brushes, and larger canvases. Keep creating to progress!',
    position: 'center',
  },
];

interface TutorialOverlayProps {
  onComplete: () => void;
}

export function TutorialOverlay({ onComplete }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if tutorial has been completed
    const tutorialCompleted = localStorage.getItem(STORAGE_KEYS.TUTORIAL_STEP);
    if (!tutorialCompleted) {
      setIsVisible(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      localStorage.setItem(
        STORAGE_KEYS.TUTORIAL_STEP,
        (currentStep + 1).toString()
      );
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    if (
      confirm('Are you sure you want to skip the tutorial? You can always refer to the help section later.')
    ) {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem(
      STORAGE_KEYS.TUTORIAL_STEP,
      TUTORIAL_STEPS.length.toString()
    );
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  const step = TUTORIAL_STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 space-y-4">
        {/* Progress */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            Step {currentStep + 1} of {TUTORIAL_STEPS.length}
          </div>
          <button
            onClick={handleSkip}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Skip Tutorial
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentStep + 1) / TUTORIAL_STEPS.length) * 100}%`,
            }}
          />
        </div>

        {/* Content */}
        <div className="text-center py-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {step.title}
          </h2>
          <p className="text-gray-700 leading-relaxed">{step.message}</p>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          {currentStep > 0 && (
            <Button
              onClick={() => setCurrentStep(currentStep - 1)}
              variant="secondary"
              className="flex-1"
            >
              Back
            </Button>
          )}
          <Button onClick={handleNext} variant="primary" className="flex-1">
            {currentStep < TUTORIAL_STEPS.length - 1
              ? 'Next'
              : 'Start Creating!'}
          </Button>
        </div>
      </div>
    </div>
  );
}
