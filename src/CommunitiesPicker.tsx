import React from 'react';
import { styled, Typography, Button } from '@mui/material';
import { createTranslationFunction } from './utils';
import { LocalsCommunity } from './types';

interface CommunitiesPickerProps {
  communities: LocalsCommunity[];
  onCommunitySelect: (communityId: string) => void; // Adjust type if necessary
}

// Styled components for consistent styling
const StyledContainer = styled('div')({
    padding: '0 16px', // Add horizontal padding
    width: '100%',
    margin: '0 auto', // Center the container
  });
const CommunityButton = styled(Button)({
  margin: '8px 0',
  backgroundColor: 'var(--button-color)',
  color: 'var(--button-text-color)',
  width: '100%',
  textAlign: 'left',
  '&:hover': {
    backgroundColor: 'var(--button-color)',
    opacity: 0.8,
  },
});

const CommunitiesPicker: React.FC<CommunitiesPickerProps> = ({ communities, onCommunitySelect }) => {
  const language = communities.length > 0 ? communities[0].language : 'en';
  const t = createTranslationFunction(language);
  return (
    <div className="min-h-screen flex flex-col app-body">
      <StyledContainer className="flex-grow flex flex-col items-center justify-center app-container">
        <Typography variant="h6" gutterBottom align="center">
          {t("selectCommunity")}
        </Typography>
        {communities && communities.length > 0 ? (
          communities.map((community) => (
            <CommunityButton 
              key={community.id} 
              onClick={() => onCommunitySelect(community.id)}
            >
              {community.name}
            </CommunityButton>
          ))
        ) : (
          <Typography>{t("noCommunitiesAvailable")}</Typography>
        )}
      </StyledContainer>
    </div>
  );
};

export default CommunitiesPicker;
