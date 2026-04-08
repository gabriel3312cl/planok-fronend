import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useState } from 'react';
import type { Task } from '../types/task.types';
import { CategoryChip } from './CategoryChip';
import { StatusChip } from './StatusChip';

interface TaskCardProps {
  task: Task;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const hasSubtasks = task.subTasks.length > 0;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.2s, transform 0.2s',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="h6" component="h3" sx={{ fontSize: '1rem', fontWeight: 600, flex: 1, minWidth: 0 }}>
            {task.title}
          </Typography>
          <StatusChip status={task.status} />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {task.description}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <CategoryChip category={task.category} />
          {hasSubtasks && (
            <Typography variant="caption" color="text.disabled">
              {task.subTasks.filter((s) => s.completed).length}/{task.subTasks.length} subtareas
            </Typography>
          )}
        </Box>

        {hasSubtasks && (
          <>
            <Box
              sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mt: 1 }}
              onClick={() => setExpanded(!expanded)}
            >
              <Typography variant="caption" color="primary" sx={{ fontWeight: 500 }}>
                {expanded ? 'Ocultar subtareas' : 'Ver subtareas'}
              </Typography>
              {expanded ? <ExpandLessIcon fontSize="small" color="primary" /> : <ExpandMoreIcon fontSize="small" color="primary" />}
            </Box>
            <Collapse in={expanded}>
              <List dense disablePadding>
                {task.subTasks.map((st) => (
                  <ListItem key={st.id} disableGutters sx={{ py: 0 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      {st.completed ? (
                        <CheckCircleIcon fontSize="small" color="success" />
                      ) : (
                        <RadioButtonUncheckedIcon fontSize="small" color="disabled" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={st.title}
                      primaryTypographyProps={{
                        variant: 'body2',
                        sx: { textDecoration: st.completed ? 'line-through' : 'none', color: st.completed ? 'text.disabled' : 'text.primary' },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
        <Tooltip title="Editar">
          <IconButton size="small" color="primary" onClick={() => onEdit(task.id)}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar">
          <IconButton size="small" color="error" onClick={() => onDelete(task.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}
