import { createFileRoute } from "@tanstack/react-router";
import { CustomComboBuilderPage } from "../../../pages/custom-combo-builder/page";

export const Route = createFileRoute("/_app/$gameId/builder")({
  component: CustomComboBuilderPage,
});
