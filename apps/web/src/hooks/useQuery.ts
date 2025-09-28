import * as React from "react";

export type QueryState<T> = { data?: T; loading: boolean; error?: Error };
export type QueryApi<T> = QueryState<T> & {
  refetch: () => void;
  invalidate: () => void;
};

export function useQuery<T>(
  key: string,
  fn: () => Promise<T>,
  deps: unknown[] = []
): QueryApi<T> {
  const [version, setVersion] = React.useState(0);
  const [state, setState] = React.useState<QueryState<T>>({ loading: true });

  React.useEffect(() => {
    let active = true;
    const ctrl = new AbortController();

    setState((s) => ({ ...s, loading: true, error: undefined }));
    fn()
      .then((data) => {
        if (!active || ctrl.signal.aborted) return;
        setState({ data, loading: false });
      })
      .catch((err: unknown) => {
        if (!active || ctrl.signal.aborted) return;
        setState({
          loading: false,
          error: err instanceof Error ? err : new Error(String(err)),
        });
      });

    return () => {
      active = false;
      ctrl.abort();
    };
  }, [key, version, ...deps]);

  const refetch = () => setVersion((v) => v + 1);
  const invalidate = refetch;

  return { ...state, refetch, invalidate };
}
