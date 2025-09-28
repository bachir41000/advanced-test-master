import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { useQuery } from "./useQuery";

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (v: T) => void;
  reject: (e: unknown) => void;
};
function deferred<T>(): Deferred<T> {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function Probe<T>({ queue }: { queue: Array<Deferred<T>> }) {
  const fn = React.useCallback(() => {
    const d = queue.shift();
    if (!d) throw new Error("no deferred");
    return d.promise;
  }, [queue]);

  const { data, loading, error, refetch } = useQuery<T>("k", fn, [fn]);

  return (
    <div>
      <div aria-label="state">
        {loading ? "loading" : error ? "error" : "success"}
      </div>
      {data !== undefined && <div aria-label="data">{String(data as any)}</div>}
      {error && <div aria-label="error">{error.message}</div>}
      <button onClick={refetch}>refetch</button>
    </div>
  );
}

afterEach(() => cleanup());

it("goes loading → success", async () => {
  const d1 = deferred<number>();
  const q = [d1];
  render(<Probe<number> queue={q} />);
  expect(screen.getByLabelText("state").textContent).toBe("loading");
  d1.resolve(41);
  expect(await screen.findByLabelText("data")).toHaveTextContent("41");
  expect(screen.getByLabelText("state").textContent).toBe("success");
});

it("reports error on rejection", async () => {
  const d1 = deferred<number>();
  const q = [d1];
  render(<Probe<number> queue={q} />);
  d1.reject(new Error("boom"));
  expect(await screen.findByLabelText("state")).toHaveTextContent("error");
  expect(screen.getByLabelText("error")).toHaveTextContent("boom");
});

it("supports refetch() and updates data", async () => {
  const d1 = deferred<number>();
  const d2 = deferred<number>();
  const q = [d1, d2];
  render(<Probe<number> queue={q} />);
  d1.resolve(1);
  expect(await screen.findByLabelText("data")).toHaveTextContent("1");

  fireEvent.click(screen.getByText("refetch"));
  expect(screen.getByLabelText("state").textContent).toBe("loading");

  d2.resolve(2);
  expect(await screen.findByLabelText("data")).toHaveTextContent("2");
  expect(screen.getByLabelText("state").textContent).toBe("success");
});

it("does not set state after unmount", async () => {
  const d1 = deferred<number>();
  const q = [d1];
  const spy = vi.spyOn(console, "error").mockImplementation(() => {});
  const { unmount } = render(<Probe<number> queue={q} />);
  unmount();
  d1.resolve(7);
  await Promise.resolve();
  expect(spy).not.toHaveBeenCalledWith(
    expect.stringContaining("unmounted component")
  );
  spy.mockRestore();
});
