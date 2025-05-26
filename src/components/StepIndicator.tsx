import React from "react";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
  onStepClick?: (step: number) => void;
}

const StepIndicator = ({
  currentStep = 1,
  steps = [
    "Personal Information",
    "Contact Information",
    "Additional Details",
    "Avatar Upload",
    "Preview",
  ],
  onStepClick,
}: StepIndicatorProps) => {
  return (
    <div className="w-full bg-background py-4">
      <div className="flex justify-between items-center mb-2">
        {steps.map((step, index) => {
          const isActive = index + 1 === currentStep;
          const isCompleted = index + 1 < currentStep;

          return (
            <div
              key={index}
              className="flex flex-col items-center"
              onClick={() =>
                onStepClick && isCompleted && onStepClick(index + 1)
              }
            >
              <div
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full 
                  ${isActive ? "bg-primary text-primary-foreground" : ""}
                  ${isCompleted ? "bg-primary/80 text-primary-foreground" : ""}
                  ${!isActive && !isCompleted ? "bg-muted text-muted-foreground" : ""}
                  ${onStepClick && isCompleted ? "cursor-pointer hover:opacity-80" : ""}
                  transition-all duration-200
                `}
              >
                {isCompleted ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-check"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`
                  text-xs mt-1 hidden sm:block
                  ${isActive ? "text-foreground font-medium" : "text-muted-foreground"}
                `}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-in-out"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};

export default StepIndicator;
