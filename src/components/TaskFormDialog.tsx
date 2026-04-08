import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import type { Task, TaskPriority, TaskStatus, CreateTaskDto, UpdateTaskDto } from '../types/task.types';
import { useAI } from '../hooks/useAI';
import { env } from '../config/env';

const PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' },
  { value: 'urgent', label: 'Urgente' },
];

const STATUSES: { value: TaskStatus; label: string }[] = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'completed', label: 'Completada' },
];

interface TaskFormDialogProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSubmit: (data: CreateTaskDto | { id: number | string; data: UpdateTaskDto }) => void;
  isSubmitting: boolean;
}

export function TaskFormDialog({ open, task, onClose, onSubmit, isSubmitting }: TaskFormDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { suggestSubtasks, isSuggesting, classifyTask, isClassifying } = useAI();

  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? 'medium');
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'pending');
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const isEditing = task !== null;
  const aiEnabled = env.aiEnabled;

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = 'El título es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (isEditing && task) {
      onSubmit({ id: task.id, data: { title, description, priority, status } });
    } else {
      onSubmit({ title, description, priority, status } as CreateTaskDto);
    }
  };

  const handleSuggestSubtasks = useCallback(async () => {
    if (!description.trim()) return;
    const suggestions = await suggestSubtasks(description);
    if (suggestions.length > 0) {
      const formatted = suggestions.map(s => `- [ ] ${s}`).join('\n');
      setDescription(prev => `${prev}\n\nSubtareas sugeridas:\n${formatted}`);
    }
  }, [description, suggestSubtasks]);

  const handleClassify = useCallback(async () => {
    if (!title.trim() && !description.trim()) return;
    const result = await classifyTask({ title, description });
    // Assuming backend returns one of the valid priorities or we map it implicitly
    if (['low', 'medium', 'high', 'urgent'].includes(result as any)) {
      setPriority(result as TaskPriority);
    } else {
      setPriority('medium');
    }
  }, [title, description, classifyTask]);

  return (
    <Dialog open={open} onClose={onClose} fullScreen={fullScreen} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? 'Editar tarea' : 'Nueva tarea'}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
            autoFocus
          />

          <TextField
            label="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
            fullWidth
            multiline
            rows={5}
          />

          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              select
              label="Prioridad"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              fullWidth
            >
              {PRIORITIES.map((c) => (
                <MenuItem key={c.value} value={c.value}>
                  {c.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Estado"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              fullWidth
            >
              {STATUSES.map((s) => (
                <MenuItem key={s.value} value={s.value}>
                  {s.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Propuestas de IA */}
          {aiEnabled && (
            <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 2, p: 2 }}>
              <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                <SmartToyIcon fontSize="small" color="primary" />
                Asistente IA
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={isSuggesting ? <CircularProgress size={16} /> : <AutoAwesomeIcon />}
                  onClick={handleSuggestSubtasks}
                  disabled={isSuggesting || !description.trim()}
                >
                  {isSuggesting ? 'Analizando...' : 'Sugerir subtareas'}
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  startIcon={isClassifying ? <CircularProgress size={16} /> : <SmartToyIcon />}
                  onClick={handleClassify}
                  disabled={isClassifying || (!title.trim() && !description.trim())}
                >
                  {isClassifying ? 'Clasificando...' : 'Auto-asignar prioridad'}
                </Button>
              </Box>

              {!description.trim() && (
                <Alert severity="info" sx={{ mt: 1 }} variant="outlined">
                  Escribe una descripción para habilitar las sugerencias de IA
                </Alert>
              )}
            </Box>
          )}

        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={16} /> : undefined}
        >
          {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
