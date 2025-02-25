import { Link, Outlet, createRootRoute } from "@tanstack/solid-router";
import { Suspense } from "solid-js";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Suspense>
        <Outlet />
      </Suspense>
    </>
  );
}
