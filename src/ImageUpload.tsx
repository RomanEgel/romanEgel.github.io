import React, { useRef } from 'react';
import { styled } from '@mui/material/styles';
import { Typography, IconButton } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import { createTranslationFunction } from './utils';
import WebApp from '@twa-dev/sdk';

const StyledUploadArea = styled('div')({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
});

const StyledImageGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
  gap: '16px',
  width: '100%',
});

const StyledImageContainer = styled('div')({
  position: 'relative',
  aspectRatio: '1',
  borderRadius: '8px',
  overflow: 'hidden',
});

const StyledImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const StyledDeleteButton = styled(IconButton)({
  position: 'absolute',
  top: '4px',
  right: '4px',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: 'white',
  padding: '4px',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
});

const StyledUploadButton = styled('label')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  aspectRatio: '1',
  border: '2px dashed var(--hint-color)',
  borderRadius: '8px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'var(--secondary-bg-color)',
  },
});

interface ImageUploadProps {
  images: File[];
  onChange: (images: File[]) => void;
  maxImages: number;
  language: 'en' | 'ru';
}

const ImageUpload: React.FC<ImageUploadProps> = ({ images, onChange, maxImages, language }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = createTranslationFunction(language);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + images.length > maxImages) {
      WebApp.showAlert(
        t('maxImagesError').replace('{{max}}', maxImages.toString())
      );
      return;
    }
    onChange([...images, ...files]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <StyledUploadArea>
      <StyledImageGrid>
        {images.map((image, index) => (
          <StyledImageContainer key={index}>
            <StyledImage 
              src={URL.createObjectURL(image)} 
              alt={t('uploadImageAlt').replace('{{num}}', (index + 1).toString())} 
            />
            <StyledDeleteButton 
              onClick={() => handleDelete(index)} 
              size="small"
              aria-label={t('deleteImage')}
            >
              <DeleteIcon fontSize="small" />
            </StyledDeleteButton>
          </StyledImageContainer>
        ))}
        {images.length < maxImages && (
          <StyledUploadButton>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              multiple
            />
            <AddPhotoAlternateIcon sx={{ fontSize: 40, color: 'var(--hint-color)' }} />
            <Typography variant="caption" sx={{ color: 'var(--hint-color)' }}>
              {t('addImage')}
            </Typography>
          </StyledUploadButton>
        )}
      </StyledImageGrid>
    </StyledUploadArea>
  );
};

export default ImageUpload; 