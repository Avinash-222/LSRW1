import React from 'react';
import { usePractice } from '../context/PracticeContext';
import Listening from './Listening';
import Speaking from './Speaking';
import Reading from './Reading';
import Writing from './Writing';

const PracticeSectionManager = () => {
  const { practiceState } = usePractice();
  
  if (!practiceState.isPracticing || !practiceState.practiceSectionId) {
    return null;
  }

  const renderSection = () => {
    switch (practiceState.practiceSectionId) {
      case 'listening':
        return <Listening isPractice={true} />;
      case 'speaking':
        return <Speaking isPractice={true} />;
      case 'reading':
        return <Reading isPractice={true} />;
      case 'writing':
        return <Writing isPractice={true} />;
      default:
        return <div>Practice section not found.</div>;
    }
  };

  return (
    <div style={{ padding: '1rem', height: '100%' }}>
      {renderSection()}
    </div>
  );
};

export default PracticeSectionManager;
