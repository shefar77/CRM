import { useState } from 'react';

export function usePage(initial = 'dashboard') {
  const [page, setPage] = useState(initial);
  return { page, setPage };
}