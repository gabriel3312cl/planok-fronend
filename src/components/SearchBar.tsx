import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useUIStore } from '../store/ui.store';

export function SearchBar() {
  const searchQuery = useUIStore((s) => s.searchQuery);
  const setSearchQuery = useUIStore((s) => s.setSearchQuery);

  return (
    <TextField
      placeholder="Buscar tareas..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      size="small"
      fullWidth
      sx={{ maxWidth: { sm: 350 } }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
      }}
    />
  );
}
