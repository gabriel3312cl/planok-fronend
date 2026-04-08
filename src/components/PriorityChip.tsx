import { Chip } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import type { TaskPriority } from '../types/task.types';

const priorityConfig: Record<TaskPriority, { label: string; color: string; icon: React.ReactElement }> = {
  low: { label: 'Baja', color: '#2e7d32', icon: <ArrowDownwardIcon fontSize="small" /> },
  medium: { label: 'Media', color: '#1976d2', icon: <ArrowRightAltIcon fontSize="small" /> },
  high: { label: 'Alta', color: '#ed6c02', icon: <ArrowUpwardIcon fontSize="small" /> },
  urgent: { label: 'Urgente', color: '#d32f2f', icon: <PriorityHighIcon fontSize="small" /> },
};

interface PriorityChipProps {
  priority: TaskPriority;
}

export function PriorityChip({ priority }: PriorityChipProps) {
  const config = priorityConfig[priority];
  return (
    <Chip
      icon={config.icon}
      label={config.label}
      size="small"
      sx={{
        backgroundColor: `${config.color}15`,
        color: config.color,
        fontWeight: 600,
        '& .MuiChip-icon': { color: config.color },
      }}
    />
  );
}
