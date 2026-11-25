"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Copy, Trash2 } from "lucide-react";

export type PageTextsMap = Record<string, string>;

type CmsPageContextValue = {
  cmsMode: boolean;
  pageTexts?: PageTextsMap;
  onTextChange?: (id: string, value: string) => void;
  activeBoxId: string | null;
  setActiveBoxId: (id: string | null) => void;
};

const CmsPageContext = createContext<CmsPageContextValue>({
  cmsMode: false,
  activeBoxId: null,
  setActiveBoxId: () => {},
});

type CmsScopeContextValue = {
  scopePrefix: string;
  legacyPrefix?: string;
  allowLegacy?: boolean;
};

const CmsScopeContext = createContext<CmsScopeContextValue | null>(null);

export function CmsPageProvider({
  cmsMode = false,
  pageTexts,
  onTextChange,
  children,
}: {
  cmsMode?: boolean;
  pageTexts?: PageTextsMap;
  onTextChange?: (id: string, value: string) => void;
  children: ReactNode;
}) {
  const [activeBoxId, setActiveBoxId] = useState<string | null>(null);

  useEffect(() => {
    if (!cmsMode) setActiveBoxId(null);
  }, [cmsMode]);

  const value = useMemo(
    () => ({ cmsMode, pageTexts, onTextChange, activeBoxId, setActiveBoxId }),
    [cmsMode, pageTexts, onTextChange, activeBoxId],
  );
  return <CmsPageContext.Provider value={value}>{children}</CmsPageContext.Provider>;
}

export function CmsScope({
  scopePrefix,
  legacyPrefix,
  allowLegacy = false,
  children,
}: {
  scopePrefix: string;
  legacyPrefix?: string;
  allowLegacy?: boolean;
  children: ReactNode;
}) {
  const value = useMemo(
    () => ({ scopePrefix, legacyPrefix, allowLegacy }),
    [scopePrefix, legacyPrefix, allowLegacy],
  );
  return <CmsScopeContext.Provider value={value}>{children}</CmsScopeContext.Provider>;
}

export function useCmsTextValue(id: string, defaultText: string): string {
  const { pageTexts } = useContext(CmsPageContext);
  const scope = useContext(CmsScopeContext);
  if (scope) {
    const scopedKey = `${scope.scopePrefix}.${id}`;
    if (pageTexts && scopedKey in pageTexts) {
      return pageTexts[scopedKey] ?? defaultText;
    }
    if (scope.allowLegacy && scope.legacyPrefix) {
      const legacyKey = `${scope.legacyPrefix}.${id}`;
      if (pageTexts && legacyKey in pageTexts) {
        return pageTexts[legacyKey] ?? defaultText;
      }
    }
  }
  return pageTexts?.[id] ?? defaultText;
}

export type CmsTextProps = {
  id: string;
  defaultText: string;
  cmsMode?: boolean;
  pageTexts?: PageTextsMap;
  onTextChange?: (id: string, value: string) => void;
  className?: string;
};

/**
 * Renders editable text inline when cmsMode is active without cursor jumps,
 * and plain text (or minimal styled span) on the live public page.
 */
export function CmsText({
  id,
  defaultText,
  cmsMode: propCmsMode,
  pageTexts: propPageTexts,
  onTextChange: propOnTextChange,
  className,
}: CmsTextProps) {
  const ctx = useContext(CmsPageContext);
  const scope = useContext(CmsScopeContext);
  const cmsMode = propCmsMode ?? ctx.cmsMode;
  const pageTexts = propPageTexts ?? ctx.pageTexts;
  const onTextChange = propOnTextChange ?? ctx.onTextChange;

  const targetKey = scope ? `${scope.scopePrefix}.${id}` : id;

  let value = defaultText;
  if (pageTexts) {
    if (targetKey in pageTexts) {
      value = pageTexts[targetKey] ?? defaultText;
    } else if (scope?.allowLegacy && scope.legacyPrefix) {
      const legacyKey = `${scope.legacyPrefix}.${id}`;
      value = pageTexts[legacyKey] ?? defaultText;
    }
  }

  const ref = useRef<HTMLSpanElement | null>(null);
  const focusedRef = useRef(false);

  useEffect(() => {
    if (!cmsMode || !ref.current || focusedRef.current) return;
    if (ref.current.textContent !== value) {
      ref.current.textContent = value;
    }
  }, [cmsMode, value]);

  if (!cmsMode) {
    return className ? <span className={className}>{value}</span> : <>{value}</>;
  }

  return (
    <span
      ref={(node) => {
        ref.current = node;
        if (node && !focusedRef.current && node.textContent !== value) {
          node.textContent = value;
        }
      }}
      contentEditable={true}
      suppressContentEditableWarning={true}
      onFocus={() => {
        focusedRef.current = true;
      }}
      onBlur={(e) => {
        focusedRef.current = false;
        onTextChange?.(targetKey, e.currentTarget.textContent ?? "");
      }}
      onInput={(e) => {
        onTextChange?.(targetKey, e.currentTarget.textContent ?? "");
      }}
      onPointerDown={(e) => e.stopPropagation()}
      className={`outline-none focus:ring-2 focus:ring-blue-400/70 focus:rounded px-0.5 cursor-text ${className ?? ""}`}
    />
  );
}

export type CmsBoxTemplate = {
  id?: string;
  defaults?: Record<string, string | undefined>;
  legacyPrefix?: string;
  spanClassName?: string;
};

type GroupInstance = {
  id: string;
  tplIdx: number;
};

function parseGroupInstances(
  raw: string | undefined,
  templateCount: number,
): GroupInstance[] {
  const fallback = Array.from({ length: templateCount }, (_, i) => ({
    id: String(i),
    tplIdx: i,
  }));
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return fallback;
    const valid = parsed.filter(
      (item): item is GroupInstance =>
        Boolean(item) &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.tplIdx === "number" &&
        item.tplIdx >= 0 &&
        item.tplIdx < templateCount,
    );
    return valid.length > 0 ? valid : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Wraps any grid or list of marketing cards/boxes so admins can Move, Delete,
 * and Duplicate any box inline in CMS mode, with changes rendered identically live.
 */
export function CmsBoxGroup<T extends CmsBoxTemplate>({
  groupId,
  templates,
  gridClassName,
  itemTag = "div",
  renderItem,
}: {
  groupId: string;
  templates: T[];
  gridClassName?: string;
  itemTag?: "div" | "li";
  renderItem: (
    template: T,
    meta: { index: number; instanceId: string; isOriginal: boolean },
  ) => ReactNode;
}) {
  const { cmsMode, pageTexts, onTextChange, activeBoxId, setActiveBoxId } =
    useContext(CmsPageContext);

  const groupStorageKey = `__group.${groupId}`;
  const instances = useMemo(
    () => parseGroupInstances(pageTexts?.[groupStorageKey], templates.length),
    [pageTexts, groupStorageKey, templates.length],
  );

  const saveInstances = useCallback(
    (next: GroupInstance[]) => {
      onTextChange?.(groupStorageKey, JSON.stringify(next));
    },
    [groupStorageKey, onTextChange],
  );

  const handleMove = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= instances.length) return;
    const copy = [...instances];
    const [removed] = copy.splice(fromIdx, 1);
    if (!removed) return;
    copy.splice(toIdx, 0, removed);
    saveInstances(copy);
  };

  const handleDelete = (idx: number) => {
    if (instances.length <= 1) return;
    const copy = instances.filter((_, i) => i !== idx);
    setActiveBoxId(null);
    saveInstances(copy);
  };

  const handleDuplicate = (idx: number) => {
    const source = instances[idx];
    if (!source) return;
    const tpl = templates[source.tplIdx];
    if (!tpl) return;

    const newId = `${source.tplIdx}_${Date.now().toString(36)}_${Math.random()
      .toString(36)
      .slice(2, 5)}`;
    const sourceScope = `${groupId}.item_${source.id}`;
    const newScope = `${groupId}.item_${newId}`;
    const isSourceOriginal = source.id === String(source.tplIdx);

    // Clone known default fields (resolving any prior edits or legacy keys)
    if (tpl.defaults && onTextChange) {
      for (const [field, defVal] of Object.entries(tpl.defaults)) {
        if (typeof defVal !== "string") continue;
        const currentVal =
          pageTexts?.[`${sourceScope}.${field}`] ??
          (isSourceOriginal && tpl.legacyPrefix
            ? pageTexts?.[`${tpl.legacyPrefix}.${field}`]
            : undefined) ??
          defVal;
        const clonedVal =
          field === "title" && !currentVal.endsWith("(Copy)")
            ? `${currentVal} (Copy)`
            : currentVal;
        onTextChange(`${newScope}.${field}`, clonedVal);
      }
    }

    // Clone any additional edited keys scoped to the source instance
    if (pageTexts && onTextChange) {
      const prefix = `${sourceScope}.`;
      for (const [k, v] of Object.entries(pageTexts)) {
        if (k.startsWith(prefix)) {
          const field = k.slice(prefix.length);
          if (!(tpl.defaults && field in tpl.defaults)) {
            onTextChange(`${newScope}.${field}`, v);
          }
        }
      }
    }

    const next = [...instances];
    next.splice(idx + 1, 0, { id: newId, tplIdx: source.tplIdx });
    saveInstances(next);
    setActiveBoxId(`${groupId}:${newId}`);
  };

  const ItemWrapper = itemTag;

  const content = instances.map((inst, idx) => {
    const tpl = templates[inst.tplIdx];
    if (!tpl) return null;
    const isOriginal = inst.id === String(inst.tplIdx);
    const fullBoxId = `${groupId}:${inst.id}`;
    const isSelected = cmsMode && activeBoxId === fullBoxId;

    return (
      <CmsScope
        key={inst.id}
        scopePrefix={`${groupId}.item_${inst.id}`}
        legacyPrefix={tpl.legacyPrefix}
        allowLegacy={isOriginal}
      >
        <ItemWrapper
          onClick={
            cmsMode
              ? (e) => {
                  e.stopPropagation();
                  setActiveBoxId(fullBoxId);
                }
              : undefined
          }
          className={`relative flex [&>*:not([data-cms-toolbar])]:w-full ${
            tpl.spanClassName ?? ""
          } ${
            cmsMode
              ? `rounded-2xl cursor-pointer transition ${
                  isSelected
                    ? "ring-2 ring-blue-600 ring-offset-2 ring-offset-white"
                    : "hover:ring-2 hover:ring-blue-300/80"
                }`
              : ""
          }`}
        >
          {renderItem(tpl, { index: idx, instanceId: inst.id, isOriginal })}

          {isSelected && (
            <div
              data-cms-toolbar="true"
              className="absolute -top-3 right-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs shadow-lg z-30"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              {idx > 0 && (
                <button
                  type="button"
                  onClick={() => handleMove(idx, idx - 1)}
                  className="text-blue-600 font-bold hover:underline cursor-pointer"
                  title="Move box earlier"
                >
                  &larr; Move
                </button>
              )}
              {idx < instances.length - 1 && (
                <button
                  type="button"
                  onClick={() => handleMove(idx, idx + 1)}
                  className="text-blue-600 font-bold hover:underline cursor-pointer"
                  title="Move box later"
                >
                  Move &rarr;
                </button>
              )}
              <button
                type="button"
                onClick={() => handleDuplicate(idx)}
                className="inline-flex items-center gap-1 text-blue-600 font-bold hover:underline cursor-pointer"
                title="Duplicate box"
              >
                <Copy className="h-3 w-3" /> Duplicate
              </button>
              {instances.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDelete(idx)}
                  className="inline-flex items-center gap-1 text-red-600 font-bold hover:underline cursor-pointer"
                  title="Delete box"
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              )}
            </div>
          )}
        </ItemWrapper>
      </CmsScope>
    );
  });

  if (gridClassName) {
    return itemTag === "li" ? (
      <ol className={gridClassName}>{content}</ol>
    ) : (
      <div className={gridClassName}>{content}</div>
    );
  }

  return <>{content}</>;
}
