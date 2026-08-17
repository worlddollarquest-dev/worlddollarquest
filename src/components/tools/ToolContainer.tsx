import React from 'react';
import { AIPromptGenerator } from './AIPromptGenerator';
import { BusinessNameGenerator } from './BusinessNameGenerator';
import { CaptionGenerator } from './CaptionGenerator';
import { UsernameGenerator } from './UsernameGenerator';
import { QRCodeGenerator } from './QRCodeGenerator';
import { WordCounter } from './WordCounter';
import { FreelanceRateCalculator } from './FreelanceRateCalculator';

interface ToolContainerProps {
  componentId: string;
}

export const ToolContainer: React.FC<ToolContainerProps> = ({ componentId }) => {
  switch (componentId) {
    case 'prompt-gen':
      return <AIPromptGenerator />;
    case 'biz-name-gen':
      return <BusinessNameGenerator />;
    case 'caption-gen':
      return <CaptionGenerator />;
    case 'username-gen':
      return <UsernameGenerator />;
    case 'qr-gen':
      return <QRCodeGenerator />;
    case 'word-counter':
      return <WordCounter />;
    case 'rate-calc':
      return <FreelanceRateCalculator />;
    default:
      return <AIPromptGenerator />;
  }
};
