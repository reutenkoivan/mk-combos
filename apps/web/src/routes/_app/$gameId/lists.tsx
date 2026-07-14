import { createFileRoute } from "@tanstack/react-router";
import { NamedListsPage } from "../../../pages/named-lists/page";

export const Route = createFileRoute("/_app/$gameId/lists")({
  component: NamedListsPage,
});
