import CloseIcon from '@mui/icons-material/Close';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {
  Box,
  Card, CardActionArea, CardContent, CardMedia,
  Grid,
  IconButton,
  LinearProgress,
  Modal,
  Typography
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 600,
  bgcolor: 'rgba(0, 0, 0, 0.8)',
  boxShadow: 24,
  borderRadius: 2,
  p: 3,
  backdropFilter: 'blur(10px)',
  color: 'white',
};

const Gallery = () => {
  const username = sessionStorage.getItem('username');
  const [images, setImages] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    axios.get(`http://52.66.146.144:5000/api/v1/gallery/getGalleryById/${username}`)
      .then(response => setImages(response.data))
      .catch(error => console.log(error));
  }, []);

  const handleOpenModal = (image: any) => {
    setSelectedImage(image);
    setOpenModal(true);
    if (image.song) {
      const newAudio = new Audio(image.song);
      newAudio.addEventListener('timeupdate', () => {
        setProgress((newAudio.currentTime / newAudio.duration) * 100);
      });
      newAudio.play();
      setAudio(newAudio);
      setIsPlaying(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImage(null);
    if (audio) {
      audio.pause();
      setAudio(null);
      setIsPlaying(false);
      setProgress(0);
    }
  };

  const togglePlayPause = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 3, }}>
        Your Memories, {username}
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {images.map((image, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: 3,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(5px)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 20px rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              <CardActionArea onClick={() => handleOpenModal(image)}>
                <CardMedia component="img" height="180" image={image.image} alt={image.title} />
                <CardContent>
                  <Typography variant="h6" noWrap color="white">{image.title}</Typography>
                  <Typography variant="body2" color="gray">
                    {image.description.length > 60 ? `${image.description.substring(0, 60)}...` : image.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          {/* Close Button (Fixed Position & Higher Z-Index) */}
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 10,
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
            }}
          >
            <CloseIcon />
          </IconButton>

          {selectedImage && (
            <>
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={togglePlayPause}
              >
                <CardMedia
                  component="img"
                  image={selectedImage.image}
                  sx={{ maxHeight: 300, objectFit: 'cover', mb: 2, width: '100%' }}
                />

                {/* Play Button Overlay on Hover */}
                {selectedImage.song && hovered && (
                  <IconButton
                    sx={{
                      position: 'absolute',
                      color: 'white',
                      background: 'rgba(0, 0, 0, 0.5)',
                      padding: 2,
                      borderRadius: '50%',
                      transition: 'opacity 0.3s ease',
                      '&:hover': { background: 'rgba(0, 0, 0, 0.7)' },
                    }}
                  >
                    {isPlaying ? <PauseIcon sx={{ fontSize: 50 }} /> : <PlayArrowIcon sx={{ fontSize: 50 }} />}
                  </IconButton>
                )}
              </Box>

              <Typography variant="h5">{selectedImage.title}</Typography>
              <Typography variant="body1" sx={{ my: 2 }}>{selectedImage.description}</Typography>

              {selectedImage.song && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{ flexGrow: 1, height: 5, backgroundColor: 'gray' }}
                  />
                </Box>
              )}
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Gallery;
