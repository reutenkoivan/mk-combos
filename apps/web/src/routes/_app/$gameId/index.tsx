import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/$gameId/")({
  beforeLoad: ({ params }) => {
    throw redirect({
      params: { gameId: params.gameId },
      replace: true,
      to: "/$gameId/catalog",
    });
  },
});
