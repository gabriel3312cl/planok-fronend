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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircle';
import DeleteOutlineIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';
import type { Task, TaskCategory, TaskStatus, SubTask, CreateTaskDto, UpdateTaskDto } from '../types/task.types';
import { useAI } from '../hooks/useAI';
import { env } from '../config/env';

const CATEGORIES: { value: TaskCategory; label: string }[] = [
  { value: 'personal', label: 'Personal' },
  { value: 'trabajo', label: 'Trabajo' },
  { value: 'urgente', label: 'Urgente' },
  { value: 'estudio', label: 'Estudio' },
  { value: 'salud', label: 'Salud' },
  { value: 'finanzas', label: 'Finanzas' },
  { value: 'otro', label: 'Otro' },
];

const STATUSES: { value: TaskStatus; label: string }[] = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en_progreso', label: 'En progreso' },
  { value: 'completada', label: 'Completada' },
];

interface TaskFormDialogProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSubmit: (data: CreateTaskDto | { id: string; data: UpdateTaskDto }) => void;
  isSubmitting: boolean;
}

export function TaskFormDialog({ open, task, onClose, onSubmit, isSubmitting }: TaskFormDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { suggestSubtasks, isSuggesting, classifyTask, isClassifying } = useAI();

  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [category, setCategory] = useState<TaskCategory>(task?.category ?? 'otro');
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'pendiente');
  const [subTasks, setSubTasks] = useState<SubTask[]>(task?.subTasks ?? []);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const isEditing = task !== null;
  const aiEnabled = env.aiEnabled;

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = 'El título es obligatorio';
    if (!description.trim()) newErrors.description = 'La descripción es obligatoria';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (isEditing && task) {
      onSubmit({ id: task.id, data: { title, description, category, status, subTasks } });
    } else {
      onSubmit({ title, description, category, status } as CreateTaskDto);
    }
  };

  const handleSuggestSubtasks = useCallback(async () => {
    if (!description.trim()) return;
    const suggestions = await suggestSubtasks(description);
    const newSubTasks: SubTask[] = suggestions.map((s) => ({
      id: uuidv4(),
      title: s,
      completed: false,
    }));
    setSubTasks((prev) => [...prev, ...newSubTasks]);
  }, [description, suggestSubtasks]);

  const handleClassify = useCallback(async () => {
    if (!title.trim() && !description.trim()) return;
    const result = await classifyTask({ title, description });
    setCategory(result);
  }, [title, description, classifyTask]);

  const removeSubtask = (id: string) => {
    setSubTasks((prev) => prev.filter((st) => st.id !== id));
  };

  const toggleSubtask = (id: string) => {
    setSubTasks((prev) =>
      prev.map((st) => (st.id === id ? { ...st, completed: !st.completed } : st)),
    );
  };

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
            rows={3}
          />

          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              select
              label="Categoría"
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
              fullWidth
            >
              {CATEGORIES.map((c) => (
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
                  {isClassifying ? 'Clasificando...' : 'Auto-clasificar'}
                </Button>
              </Box>

              {!description.trim() && (
                <Alert severity="info" sx={{ mt: 1 }} variant="outlined">
                  Escribe una descripción para habilitar las sugerencias de IA
                </Alert>
              )}
            </Box>
          )}

          {/* Subtareas */}
          {subTasks.length > 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Subtareas ({subTasks.filter((s) => s.completed).length}/{subTasks.length})
              </Typography>
              <List dense disablePadding>
                {subTasks.map((st) => (
                  <ListItem
                    key={st.id}
                    disableGutters
                    secondaryAction={
                      <IconButton edge="end" size="small" onClick={() => removeSubtask(st.id)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemIcon sx={{ minWidth: 32, cursor: 'pointer' }} onClick={() => toggleSubtask(st.id)}>
                      <CheckCircleOutlineIcon
                        fontSize="small"
                        color={st.completed ? 'success' : 'disabled'}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={st.title}
                      primaryTypographyProps={{
                        variant: 'body2',
                        sx: { textDecoration: st.completed ? 'line-through' : 'none' },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
              <Chip
                label="Generadas por IA"
                size="small"
                icon={<AutoAwesomeIcon />}
                variant="outlined"
                color="primary"
                sx={{ mt: 0.5 }}
              />
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
