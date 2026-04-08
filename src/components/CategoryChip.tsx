import { Chip } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import SchoolIcon from '@mui/icons-material/School';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LabelIcon from '@mui/icons-material/Label';
import type { TaskCategory } from '../types/task.types';

const categoryConfig: Record<TaskCategory, { label: string; color: string; icon: React.ReactElement }> = {
  trabajo: { label: 'Trabajo', color: '#1976d2', icon: <WorkIcon fontSize="small" /> },
  personal: { label: 'Personal', color: '#9c27b0', icon: <PersonIcon fontSize="small" /> },
  urgente: { label: 'Urgente', color: '#d32f2f', icon: <PriorityHighIcon fontSize="small" /> },
  estudio: { label: 'Estudio', color: '#ed6c02', icon: <SchoolIcon fontSize="small" /> },
  salud: { label: 'Salud', color: '#2e7d32', icon: <FavoriteIcon fontSize="small" /> },
  finanzas: { label: 'Finanzas', color: '#0288d1', icon: <AccountBalanceIcon fontSize="small" /> },
  otro: { label: 'Otro', color: '#757575', icon: <LabelIcon fontSize="small" /> },
};

interface CategoryChipProps {
  category: TaskCategory;
}

export function CategoryChip({ category }: CategoryChipProps) {
  const config = categoryConfig[category];
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
