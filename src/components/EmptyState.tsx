import { Box, Typography, Button } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import AddIcon from '@mui/icons-material/Add';

interface EmptyStateProps {
  onCreateTask: () => void;
}

export function EmptyState({ onCreateTask }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
        textAlign: 'center',
      }}
    >
      <InboxIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
      <Typography variant="h5" color="text.secondary" gutterBottom>
        No hay tareas todavía
      </Typography>
      <Typography variant="body1" color="text.disabled" sx={{ mb: 3, maxWidth: 400 }}>
        Comienza creando tu primera tarea. Organiza tu día y deja que la IA te
        ayude a ser más productivo.
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onCreateTask}
        size="large"
      >
        Crear primera tarea
      </Button>
    </Box>
  );
}
