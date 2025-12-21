import { Button, Box } from '@mui/material';

export const ToggleFeedButton = ({ id, label, onClick, state }) => {
  return <Button
    className="w-full! block! text-left! pl-8! py-2! mb-2! normal-case! text-base! text-black! transition-all!"
    onClick={onClick}
    sx={{
      backgroundColor: id == state ? '#D6D6D6' : '#ECECEE',
      // Hover styles
      '&:hover': {
        backgroundColor: '#D6D6D6',
        boxShadow: '0 4px 4px 0 rgba(0,0,0,0.12)',
      },
    }}
  >{label}</Button>
}

export const ToggleCategoryButton = ({ id, label, qty, onClick, state }) => {
  return <Button
    variant='contained'
    className='bg-white! text-black! normal-case!'
    onClick={onClick}
    sx={{
      opacity: id == state ? 1 : 0.5,
      transition: 'opacity 0.1s ease-in-out',
      '&:hover': {
        opacity: 1
      },
    }}
  >
    <Box display="flex" gap={1}>
      <p>{label}</p>
      <p className='bg-red-500 text-white pl-2 pr-2 rounded-sm'>{qty}</p>
    </Box>
  </Button>
}