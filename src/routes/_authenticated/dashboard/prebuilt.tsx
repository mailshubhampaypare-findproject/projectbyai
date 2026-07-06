import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/prebuilt")({
  component: () => <Outlet />,
});
