import { useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTasks } from '../hooks/useTasks';
import { useTaskFilters } from '../hooks/useTaskFilters';
import { useUIStore } from '../store/ui.store';
import type { CreateTaskDto, UpdateTaskDto } from '../types/task.types';
import { TaskList } from '../components/TaskList';
import { TaskFormDialog } from '../components/TaskFormDialog';
import { DeleteConfirmDialog } from '../components/DeleteConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { SearchBar } from '../components/SearchBar';
import { env } from '../config/env';

export function TasksPage() {
  const { tasks, isEmpty, isLoading, isError, error, createTask, updateTask, deleteTask, isCreating, isUpdating, isDeleting } = useTasks();
  const { filteredTasks } = useTaskFilters(tasks);
  const { isFormOpen, editingTaskId, openForm, closeForm } = useUIStore();

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const editingTask = editingTaskId ? tasks.find((t) => t.id === editingTaskId) ?? null : null;

  const showMessage = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleFormSubmit = useCallback(
    async (data: CreateTaskDto | { id: string; data: UpdateTaskDto }) => {
      try {
        if ('id' in data) {
          await updateTask(data);
          showMessage('Tarea actualizada correctamente');
        } else {
          await createTask(data);
          showMessage('Tarea creada correctamente');
        }
        closeForm();
      } catch {
        showMessage('Error al guardar la tarea', 'error');
      }
    },
    [createTask, updateTask, closeForm],
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deleteTask(deleteTarget.id);
      showMessage('Tarea eliminada correctamente');
      setDeleteTarget(null);
    } catch {
      showMessage('Error al eliminar la tarea', 'error');
    }
  }, [deleteTarget, deleteTask]);

  const handleEditClick = useCallback(
    (id: string) => openForm(id),
    [openForm],
  );

  const handleDeleteClick = useCallback(
    (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (task) setDeleteTarget({ id: task.id, title: task.title });
    },
    [tasks],
  );

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }} gutterBottom>
          {env.appTitle}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestiona tus tareas con asistencia de inteligencia artificial
        </Typography>
      </Box>

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al cargar las tareas: {error?.message}
        </Alert>
      )}

      {!isEmpty && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <SearchBar />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => openForm()}
            sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            Nueva tarea
          </Button>
        </Box>
      )}

      {isEmpty ? (
        <EmptyState onCreateTask={() => openForm()} />
      ) : (
        <TaskList
          tasks={filteredTasks}
          isLoading={isLoading}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}

      <TaskFormDialog
        open={isFormOpen}
        task={editingTask}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
        isSubmitting={isCreating || isUpdating}
      />

      <DeleteConfirmDialog
        open={deleteTarget !== null}
        taskTitle={deleteTarget?.title ?? ''}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
