import { knownControllerCommandIds } from "@mk-combos/controller-bridge/command/value";
import {
  type CharacterPickerIntent,
  characterPickerActions,
} from "@mk-combos/ui/components/character-picker";
import {
  type ComboListConfigModuleProps,
  comboListConfigPickerKinds,
  comboListConfigSelectionSteps,
} from "@mk-combos/ui/components/combo-list-config-module";
import { type KameoPickerIntent, kameoPickerActions } from "@mk-combos/ui/components/kameo-picker";
import {
  type VariationPickerIntent,
  variationPickerActions,
} from "@mk-combos/ui/components/variation-picker";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useControllerCommandScope } from "../../../app/controller-session/provider";
import {
  controllerCommandRibbonShellPolicies,
  controllerCommandScopeLayers,
} from "../../../app/controller-session/value";
import { useLocalStateObservableState } from "../../../app/local-state/provider";
import { formatCountCopy, getAppCopy } from "../../../app/localization/runtime";
import { useAppResponsiveMode } from "../../../app/providers/provider";
import { useActiveGameBusiness } from "../../../game-business/active-game/provider";
import { installedCatalogSelectionStatuses } from "../../../game-business/installed-games/catalog-adapter/type";
import { resolveInstalledGameCatalogAdapter } from "../../../game-business/installed-games/runtime";
import { resolveCatalogSnapshot } from "../catalog-state/runtime";
import { resolvePickerFocusSlotId } from "../controller/runtime";

const catalogSurface = "catalog-context-selection";
const navigationCommandIds = [
  knownControllerCommandIds.navUp,
  knownControllerCommandIds.navDown,
  knownControllerCommandIds.navLeft,
  knownControllerCommandIds.navRight,
] as const;

export const catalogSelectorSteps = {
  character: "character",
  specification: "specification",
} as const;

type CatalogSelectorStep = (typeof catalogSelectorSteps)[keyof typeof catalogSelectorSteps];

type UseCatalogSelectorStateInput = Readonly<{
  characterSlug?: string;
  step: CatalogSelectorStep;
}>;

export function useCatalogSelectorState(input: UseCatalogSelectorStateInput) {
  const business = useActiveGameBusiness();
  const adapter = resolveInstalledGameCatalogAdapter(business.id);

  if (!adapter) {
    throw new Error(`Missing catalog adapter for installed game ${business.id}.`);
  }

  const localState = useLocalStateObservableState();
  const responsiveMode = useAppResponsiveMode();
  const navigate = useNavigate();
  const [pending, beginNavigation] = useTransition();
  const language = localState.appliedSettings.language;
  const copy = getAppCopy(language).catalog;
  const slice = localState.games[business.id];
  const snapshot = useMemo(
    () =>
      resolveCatalogSnapshot({
        adapter,
        characterSlug: input.characterSlug,
        copy,
        language,
        search: {},
      }),
    [adapter, copy, input.characterSlug, language],
  );
  const restored = useMemo(() => adapter.restoreLastCatalog(slice), [adapter, slice]);

  const navigateToRoot = useCallback(
    (replace = false) => {
      beginNavigation(async () => {
        await navigate({
          params: { gameId: business.id },
          replace,
          search: {},
          to: "/$gameId/catalog",
        });
      });
    },
    [business.id, navigate],
  );

  const restoredSelection = restored.ok ? restored.selection : undefined;
  const restoredCharacterId = restoredSelection?.characterId;
  const selectedCharacterId =
    input.step === catalogSelectorSteps.character
      ? snapshot.characterOptions.some(
          (option) => option.id === restoredCharacterId && !option.disabledReason,
        )
        ? restoredCharacterId
        : undefined
      : snapshot.characterId;
  const restoredSpecificationId =
    restoredSelection?.characterId === snapshot.characterId
      ? restoredSelection?.specificationId
      : undefined;
  const selectedSpecificationId = snapshot.contextOptions.some(
    (option) => option.id === restoredSpecificationId && !option.disabledReason,
  )
    ? restoredSpecificationId
    : undefined;
  const initialCharacterSlotId =
    snapshot.characterSlots.find((slot) => slot.optionId === selectedCharacterId)?.slotId ??
    snapshot.characterSlots.find(
      (slot) =>
        slot.optionId &&
        !snapshot.characterOptions.find((option) => option.id === slot.optionId)?.disabledReason,
    )?.slotId;
  const initialSpecificationSlotId =
    snapshot.contextSlots.find((slot) => slot.optionId === selectedSpecificationId)?.slotId ??
    snapshot.contextSlots.find(
      (slot) =>
        slot.optionId &&
        !snapshot.contextOptions.find((option) => option.id === slot.optionId)?.disabledReason,
    )?.slotId;
  const [focusedCharacterSlotId, setFocusedCharacterSlotId] = useState(initialCharacterSlotId);
  const [focusedSpecificationSlotId, setFocusedSpecificationSlotId] = useState(
    initialSpecificationSlotId,
  );

  useEffect(() => setFocusedCharacterSlotId(initialCharacterSlotId), [initialCharacterSlotId]);
  useEffect(
    () => setFocusedSpecificationSlotId(initialSpecificationSlotId),
    [initialSpecificationSlotId],
  );

  const selectCharacter = useCallback(
    (characterId: string) => {
      const option = adapter
        .characterOptions()
        .find((candidate) => candidate.id === characterId && candidate.available);

      if (!option) {
        return;
      }

      beginNavigation(async () => {
        await navigate({
          params: { character: option.routeSlug, gameId: business.id },
          search: {},
          to: "/$gameId/catalog/$character",
        });
      });
    },
    [adapter, business.id, navigate],
  );

  const handleCharacterAction = useCallback(
    (intent: CharacterPickerIntent) => {
      switch (intent.action) {
        case characterPickerActions.selectCharacter:
        case characterPickerActions.moveToGameSpecificPicker:
          if (intent.characterId) {
            selectCharacter(intent.characterId);
          }
          return;
        case characterPickerActions.focusCharacterSlot:
          if (intent.slotId) {
            setFocusedCharacterSlotId(intent.slotId);
          }
          return;
        case characterPickerActions.clearCharacter:
          return;
      }
    },
    [selectCharacter],
  );

  const selectSpecification = useCallback(
    (specificationId: string) => {
      const characterId = snapshot.characterId;
      const characterSlug = snapshot.characterSlug;

      if (!characterId || !characterSlug) {
        return;
      }

      const option = adapter
        .specificationOptions(characterId)
        .find((candidate) => candidate.id === specificationId && candidate.available);

      if (!option) {
        return;
      }

      beginNavigation(async () => {
        await navigate({
          params: {
            character: characterSlug,
            gameId: business.id,
            specification: option.routeSlug,
          },
          replace: true,
          search: {},
          to: "/$gameId/catalog/$character/$specification",
        });
      });
    },
    [adapter, business.id, navigate, snapshot.characterId, snapshot.characterSlug],
  );

  const handleVariationAction = useCallback(
    (intent: VariationPickerIntent) => {
      switch (intent.action) {
        case variationPickerActions.selectVariation:
          if (intent.variationId) {
            selectSpecification(intent.variationId);
          }
          return;
        case variationPickerActions.focusVariationSlot:
          if (intent.slotId) {
            setFocusedSpecificationSlotId(intent.slotId);
          }
          return;
        case variationPickerActions.returnToCharacterPicker:
          navigateToRoot();
          return;
        case variationPickerActions.clearVariation:
          return;
      }
    },
    [navigateToRoot, selectSpecification],
  );

  const handleKameoAction = useCallback(
    (intent: KameoPickerIntent) => {
      switch (intent.action) {
        case kameoPickerActions.selectKameo:
          if (intent.kameoId) {
            selectSpecification(intent.kameoId);
          }
          return;
        case kameoPickerActions.focusKameoSlot:
          if (intent.slotId) {
            setFocusedSpecificationSlotId(intent.slotId);
          }
          return;
        case kameoPickerActions.returnToCharacterPicker:
          navigateToRoot();
          return;
        case kameoPickerActions.clearKameo:
          return;
      }
    },
    [navigateToRoot, selectSpecification],
  );

  const characterStep = input.step === catalogSelectorSteps.character;
  const invalidCharacter =
    !characterStep &&
    snapshot.selectionStatus === installedCatalogSelectionStatuses.invalidCharacter;
  const focusedSlot = (characterStep ? snapshot.characterSlots : snapshot.contextSlots).find(
    (slot) => slot.slotId === (characterStep ? focusedCharacterSlotId : focusedSpecificationSlotId),
  );
  const focusedOption = (characterStep ? snapshot.characterOptions : snapshot.contextOptions).find(
    (option) => option.id === focusedSlot?.optionId,
  );

  useControllerCommandScope({
    commandIds: invalidCharacter
      ? [knownControllerCommandIds.confirm]
      : [
          ...navigationCommandIds,
          knownControllerCommandIds.confirm,
          ...(characterStep ? [] : [knownControllerCommandIds.back]),
        ],
    enabled: !pending,
    handleCommand: (event) => {
      if (invalidCharacter) {
        if (event.commandId === knownControllerCommandIds.confirm) {
          navigateToRoot(true);
          return true;
        }
        return false;
      }

      switch (event.commandId) {
        case knownControllerCommandIds.navDown:
        case knownControllerCommandIds.navLeft:
        case knownControllerCommandIds.navRight:
        case knownControllerCommandIds.navUp: {
          const nextSlotId = resolvePickerFocusSlotId({
            commandId: event.commandId,
            currentSlotId: characterStep ? focusedCharacterSlotId : focusedSpecificationSlotId,
            options: characterStep ? snapshot.characterOptions : snapshot.contextOptions,
            slots: characterStep ? snapshot.characterSlots : snapshot.contextSlots,
          });

          if (characterStep) {
            setFocusedCharacterSlotId(nextSlotId);
          } else {
            setFocusedSpecificationSlotId(nextSlotId);
          }
          return true;
        }
        case knownControllerCommandIds.confirm: {
          if (!focusedSlot?.optionId) {
            return false;
          }

          if (characterStep) {
            selectCharacter(focusedSlot.optionId);
          } else {
            selectSpecification(focusedSlot.optionId);
          }
          return true;
        }
        case knownControllerCommandIds.back:
          if (input.step === catalogSelectorSteps.specification) {
            navigateToRoot();
            return true;
          }
          return false;
        case knownControllerCommandIds.addToList:
        case knownControllerCommandIds.builderCancel:
        case knownControllerCommandIds.builderFinish:
        case knownControllerCommandIds.builderNextGroup:
        case knownControllerCommandIds.builderPreviousGroup:
        case knownControllerCommandIds.builderSelectMove:
        case knownControllerCommandIds.builderUndoMove:
        case knownControllerCommandIds.closeDetail:
        case knownControllerCommandIds.closePanel:
        case knownControllerCommandIds.nextTab:
        case knownControllerCommandIds.openActions:
        case knownControllerCommandIds.openControllerHelp:
        case knownControllerCommandIds.openDetail:
        case knownControllerCommandIds.openFilters:
        case knownControllerCommandIds.openGlobalMenu:
        case knownControllerCommandIds.previousTab:
        case knownControllerCommandIds.removeFromList:
          return false;
      }

      return false;
    },
    id: `catalog-${business.id}-${input.step}-selector`,
    layer: controllerCommandScopeLayers.page,
    ribbon: {
      accessibleLabel: characterStep ? copy.chooseCharacterTitle : copy.chooseContextTitle,
      commands: invalidCharacter
        ? [
            {
              commandIds: [knownControllerCommandIds.confirm],
              id: "catalog-selector-recover",
              label: copy.backToCharacter,
            },
          ]
        : [
            {
              commandIds: navigationCommandIds,
              id: "catalog-selector-navigation",
              label: copy.navigateCommand,
            },
            ...(focusedOption
              ? [
                  {
                    commandIds: [knownControllerCommandIds.confirm],
                    id: "catalog-selector-confirm",
                    label: focusedOption.label,
                  },
                ]
              : []),
            ...(!characterStep
              ? [
                  {
                    commandIds: [knownControllerCommandIds.back],
                    id: "catalog-selector-back",
                    label: copy.backToCharacter,
                  },
                ]
              : []),
          ],
      shellPolicy: controllerCommandRibbonShellPolicies.append,
    },
  });

  const availableCharacterCount = snapshot.characterOptions.filter(
    (option) => !option.disabledReason,
  ).length;
  const availableSpecificationCount = snapshot.contextOptions.filter(
    (option) => !option.disabledReason,
  ).length;
  const selectedCharacter = snapshot.characterOptions.find(
    (option) => option.id === snapshot.characterId,
  );
  const characterConfig: ComboListConfigModuleProps = {
    contextSelection: {
      characterPicker: {
        busy: pending,
        focusedSlotId: focusedCharacterSlotId,
        label: copy.chooseCharacterTitle,
        layoutId: `${business.id}-catalog-characters`,
        onRequestAction: handleCharacterAction,
        options: snapshot.characterOptions,
        selectedCharacterId,
        slots: snapshot.characterSlots,
        sourceSurface: catalogSurface,
      },
      header: {
        description: copy.chooseCharacterDescription,
        gameLabel: business.label,
        headingId: "catalog-character-selector-title",
        optionCountLabel: formatCountCopy(copy.availableOptions, availableCharacterCount),
        stepLabel: `01 / ${copy.fighterRosterLabel}`,
        title: copy.chooseCharacterTitle,
      },
      step: comboListConfigSelectionSteps.character,
    },
    responsiveMode,
  };
  const gameContextPicker =
    adapter.contextKind === "variation"
      ? {
          kind: comboListConfigPickerKinds.variation,
          props: {
            busy: pending,
            focusedSlotId: focusedSpecificationSlotId,
            label: copy.gameContextByKind.variation,
            layoutId: `${business.id}-catalog-variations`,
            onRequestAction: handleVariationAction,
            options: snapshot.contextOptions,
            parentContextLabel: selectedCharacter
              ? copy.selectContextForCharacter.replaceAll("{character}", selectedCharacter.label)
              : undefined,
            selectedVariationId: selectedSpecificationId,
            slots: snapshot.contextSlots,
            sourceSurface: catalogSurface,
          },
        }
      : {
          kind: comboListConfigPickerKinds.kameo,
          props: {
            busy: pending,
            focusedSlotId: focusedSpecificationSlotId,
            label: copy.gameContextByKind.kameo,
            layoutId: `${business.id}-catalog-kameos`,
            onRequestAction: handleKameoAction,
            options: snapshot.contextOptions,
            parentContextLabel: selectedCharacter
              ? copy.selectContextForCharacter.replaceAll("{character}", selectedCharacter.label)
              : undefined,
            selectedKameoId: selectedSpecificationId,
            slots: snapshot.contextSlots,
            sourceSurface: catalogSurface,
          },
        };
  const specificationConfig: ComboListConfigModuleProps | undefined = selectedCharacter
    ? {
        contextSelection: {
          gameContextPicker,
          header: {
            description: copy.chooseContextDescription,
            gameLabel: business.label,
            headingId: "catalog-specification-selector-title",
            optionCountLabel: formatCountCopy(copy.availableOptions, availableSpecificationCount),
            stepLabel: `02 / ${copy.gameContextByKind[adapter.contextKind]}`,
            title: copy.chooseContextTitle,
          },
          lockedCharacter: {
            gameLabel: business.label,
            id: selectedCharacter.id,
            imageAlt: selectedCharacter.imageAlt,
            imageSrc: selectedCharacter.imageSrc,
            label: selectedCharacter.label,
            progressLabel: "02 / 02",
          },
          step: comboListConfigSelectionSteps.specification,
        },
        responsiveMode,
      }
    : undefined;

  return {
    adapter,
    characterConfig,
    copy,
    invalidCharacter,
    navigateToRoot,
    restoreFailed: !restored.ok,
    specificationConfig,
  };
}
