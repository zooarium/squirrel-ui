// ─────────────────────────────────────────────────────────────────────────────
// useThing — SCAFFOLD TEMPLATE. Copy → rename → adapt. Do not import directly.
//
// Steps:
//   1. Copy this file to useFoo.js
//   2. Replace every "Thing" / "thing" / "things" with your resource name
//   3. Point API imports to src/api/foo.js
//   4. Add mock handlers to src/mocks/handlers.js
//   5. Delete this comment block
// ─────────────────────────────────────────────────────────────────────────────

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotification } from '@/context/NotificationContext';

// Step 2: import real API functions from @/api/thing
// import { fetchThings, createThing, updateThing, deleteThing } from '@/api/thing';

// ── Query key ─────────────────────────────────────────────────────────────────
// Export so other hooks can invalidate this resource's cache.
// Usage: queryClient.invalidateQueries({ queryKey: [THING_KEY] })
export const THING_KEY = 'things';

// ── Hook ──────────────────────────────────────────────────────────────────────
// filters: pass any URL query params as an object.
// They become part of the queryKey — different filter combos = separate cache entries.
export function useThing(filters = {}) {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  // ── READ ──────────────────────────────────────────────────────────────────
  const { data, isLoading, error } = useQuery({
    queryKey: [THING_KEY, filters],
    queryFn: () => fetchThings(filters),       // Step 2: swap fetchThings
    select: (res) => res.data?.things ?? [],   // Step 2: adapt response shape
  });

  const things = data ?? [];

  // Shared: invalidate all thing queries after any mutation
  const invalidate = () => queryClient.invalidateQueries({ queryKey: [THING_KEY] });

  // ── CREATE ────────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (payload) => createThing(payload),  // Step 2: swap createThing
    onSuccess: () => {
      invalidate();
      showNotification('Created successfully!', 'success');
    },
    onError: (err) => showNotification(err.message, 'error'),
  });

  // ── UPDATE ────────────────────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateThing(id, payload), // Step 2: swap updateThing
    onSuccess: () => {
      invalidate();
      showNotification('Updated successfully!', 'success');
    },
    onError: (err) => showNotification(err.message, 'error'),
  });

  // ── DELETE ────────────────────────────────────────────────────────────────
  const removeMutation = useMutation({
    mutationFn: (id) => deleteThing(id),  // Step 2: swap deleteThing
    onSuccess: () => {
      invalidate();
      showNotification('Deleted successfully!', 'success');
    },
    onError: (err) => showNotification(err.message, 'error'),
  });

  // ── Public interface ──────────────────────────────────────────────────────
  // Keep signature stable — pages depend on these names.
  return {
    things,                                                    // Step 2: rename
    isLoading,
    error: error?.message ?? null,
    create: (payload) => createMutation.mutateAsync(payload),
    update: (id, payload) => updateMutation.mutateAsync({ id, payload }),
    remove: (id) => removeMutation.mutateAsync(id),
  };
}
