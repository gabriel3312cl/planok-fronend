import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Task } from '../types/task.types';
import { PriorityChip } from './PriorityChip';
import { StatusChip } from './StatusChip';

interface TaskCardProps {
  task: Task;
  onEdit: (id: number | string) => void;
  onDelete: (id: number | string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
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

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', whiteSpace: 'pre-wrap' }}>
          {task.description}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <PriorityChip priority={task.priority} />
        </Box>
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
