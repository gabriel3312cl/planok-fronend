import { Chip } from '@mui/material';
import type { TaskStatus } from '../types/task.types';

const statusConfig: Record<TaskStatus, { label: string; color: 'default' | 'warning' | 'success' }> = {
  pendiente: { label: 'Pendiente', color: 'default' },
  en_progreso: { label: 'En progreso', color: 'warning' },
  completada: { label: 'Completada', color: 'success' },
};

interface StatusChipProps {
  status: TaskStatus;
}

export function StatusChip({ status }: StatusChipProps) {
  const config = statusConfig[status];
  return <Chip label={config.label} color={config.color} size="small" variant="outlined" />;
}
