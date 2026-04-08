import { Grid, Skeleton, Box } from '@mui/material';
import type { Task } from '../types/task.types';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function LoadingSkeleton() {
  return (
    <Grid container spacing={2}>
      {[1, 2, 3].map((i) => (
        <Grid {...({ item: true, xs: 12, sm: 6, md: 4 } as any)} key={i}>
          <Box sx={{ p: 2 }}>
            <Skeleton variant="text" width="60%" height={32} />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="rectangular" width={80} height={24} sx={{ mt: 1, borderRadius: 2 }} />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}

export function TaskList({ tasks, isLoading, onEdit, onDelete }: TaskListProps) {
  if (isLoading) return <LoadingSkeleton />;

  return (
    <Grid container spacing={2}>
      {tasks.map((task) => (
        <Grid {...({ item: true, xs: 12, sm: 6, md: 4 } as any)} key={task.id}>
          <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} />
        </Grid>
      ))}
    </Grid>
  );
}
