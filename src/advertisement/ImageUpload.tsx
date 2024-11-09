import React, { useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Typography, IconButton } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import { createTranslationFunction } from '../utils';
import WebApp from '@twa-dev/sdk';

const StyledUploadArea = styled('div')({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
  maxWidth: '100%',
});

const StyledImageGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '8px',
  width: '100%',
  maxWidth: '100%',
});

const StyledImageContainer = styled('div')({
  position: 'relative',
  aspectRatio: '1',
  borderRadius: '8px',
  overflow: 'hidden',
  width: '100%',
  height: 'auto',
  cursor: 'move',
  '&.dragging': {
    opacity: 0.5,
  },
  '&.primary': {
    border: '2px solid var(--button-color)',
  },
});

const StyledImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
  top: 0,
  left: 0,
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
  width: '100%',
  height: 'auto',
  '&:hover': {
    backgroundColor: 'var(--secondary-bg-color)',
  },
});

const StyledDropIndicator = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'var(--button-color)',
  opacity: 0,
  transition: 'opacity 0.2s',
  pointerEvents: 'none',
  '&.show': {
    opacity: 0.3,
  },
});

const StyledBadge = styled('div')({
  position: 'absolute',
  top: '4px',
  left: '4px',
  backgroundColor: 'var(--button-color)',
  color: 'white',
  padding: '2px 8px',
  borderRadius: '4px',
  fontSize: '12px',
  zIndex: 1,
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
  const [dragTarget, setDragTarget] = useState<number | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;

    const files = Array.from(fileList);

    if (files.length + images.length > maxImages) {
      WebApp.showAlert(
        t('maxImagesError').replace('{{max}}', maxImages.toString())
      );
      return;
    }

    // Validate and process each file
    const processedFiles = await Promise.all(
      files.map(async (file) => {
        // Verify it's an image
        if (!file.type.startsWith('image/')) {
          WebApp.showAlert(t('invalidImageFormat'));
          return null;
        }

        return file;
      })
    );

    // Filter out null values and add valid files
    const validFiles = processedFiles.filter((file): file is File => file !== null);
    
    if (validFiles.length > 0) {
      onChange([...images, ...validFiles]);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getImageUrl = (image: File) => {
    try {
      return URL.createObjectURL(image);
    } catch (error) {
      console.error('Error creating object URL:', error);
      WebApp.showAlert(t('imageLoadError'));
      return '';
    }
  };

  const handleDelete = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    setDragTarget(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragTarget(index);
  };

  const handleDragLeave = () => {
    setDragTarget(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    setDragTarget(null);
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (dragIndex === dropIndex) return;

    const newImages = [...images];
    const draggedImage = newImages[dragIndex];
    newImages.splice(dragIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);
    onChange(newImages);
  };

  return (
    <StyledUploadArea>
      <StyledImageGrid>
        {images.map((image, index) => {
          const imageUrl = getImageUrl(image);
          if (!imageUrl) return null;

          return (
            <StyledImageContainer 
              key={`${index}-${image.name}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              className={index === 0 ? 'primary' : ''}
            >
              {index === 0 && (
                <StyledBadge>{t('primary')}</StyledBadge>
              )}
              <StyledImage 
                src={imageUrl}
                alt={t('uploadImageAlt').replace('{{num}}', (index + 1).toString())} 
                onError={(e) => {
                  console.error('Error loading image:', e);
                  WebApp.showAlert(t('imageLoadError'));
                }}
              />
              <StyledDropIndicator className={dragTarget === index ? 'show' : ''} />
              <StyledDeleteButton 
                onClick={() => handleDelete(index)} 
                size="small"
                aria-label={t('deleteImage')}
              >
                <DeleteIcon fontSize="small" />
              </StyledDeleteButton>
            </StyledImageContainer>
          );
        })}
        {images.length < maxImages && (
          <StyledUploadButton>
            <input
              ref={fileInputRef}
              type="file"
            //accept="image/*" -- for IOS OK, for android doesn't seem to work
              onChange={(event) => {
                handleFileSelect(event)
              }}
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