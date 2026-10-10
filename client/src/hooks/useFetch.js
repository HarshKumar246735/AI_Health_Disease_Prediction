import { useCallback, useEffect, useState } from 'react';
import { friendlyError } from '../utils/errors.js';

// Runs `fetcher` on mount and whenever `deps` change. Exposes loading, a friendly error and reload().
export default function useFetch(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: '' });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true, error: '' }));
    fetcher()
      .then((data) => active && setState({ data, loading: false, error: '' }))
      .catch((err) => active && setState({ data: null, loading: false, error: friendlyError(err) }));
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { ...state, reload };
}
