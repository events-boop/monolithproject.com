import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { ROUTES } from "@shared/routes";

export type DrawerType =
  | "faq"
  | "newsletter"
  | "contact"
  | "guide"
  | "about"
  | "archive"
  | "saved"
  | null;

const drawerRouteMap: Record<string, DrawerType> = {
  [ROUTES.faq]: "faq",
  [ROUTES.newsletter]: "newsletter",
  [ROUTES.contact]: "contact",
  [ROUTES.guide]: "guide",
  [ROUTES.innerCircle]: "newsletter",
  [ROUTES.about]: "about",
  [ROUTES.togetherness]: "about",
  [ROUTES.archive]: "archive",
};

export type ExpressionId = "sunsets" | "untold" | "radio" | null;

interface UIContextProps {
  activeDrawer: DrawerType;
  openDrawer: (drawer: DrawerType) => void;
  closeDrawer: () => void;
  isCommandPaletteOpen: boolean;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;
  isSensoryOverloadActive: boolean;
  setSensoryOverloadActive: (active: boolean) => void;
  hoveredExpression: ExpressionId;
  setHoveredExpression: (id: ExpressionId) => void;
}

const UIContext = createContext<UIContextProps | undefined>(undefined);

function normalizePathname(pathname: string) {
  const clean = pathname.split("?")[0]?.split("#")[0] || "/";
  if (clean.length > 1 && clean.endsWith("/")) return clean.slice(0, -1);
  return clean || "/";
}

export function UIProvider({ children }: { children: ReactNode }) {
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] =
    useState<boolean>(false);
  const [isSensoryOverloadActive, setSensoryOverloadActive] =
    useState<boolean>(false);
  const [hoveredExpression, setHoveredExpression] =
    useState<ExpressionId>(null);

  const openDrawer = useCallback(
    (drawer: DrawerType) => setActiveDrawer(drawer),
    []
  );
  const closeDrawer = useCallback(() => setActiveDrawer(null), []);
  const openCommandPalette = useCallback(
    () => setIsCommandPaletteOpen(true),
    []
  );
  const closeCommandPalette = useCallback(
    () => setIsCommandPaletteOpen(false),
    []
  );
  const toggleCommandPalette = useCallback(
    () => setIsCommandPaletteOpen(current => !current),
    []
  );

  const value = useMemo(
    () => ({
      activeDrawer,
      openDrawer,
      closeDrawer,
      isCommandPaletteOpen,
      openCommandPalette,
      closeCommandPalette,
      toggleCommandPalette,
      isSensoryOverloadActive,
      setSensoryOverloadActive,
      hoveredExpression,
      setHoveredExpression,
    }),
    [
      activeDrawer,
      openDrawer,
      closeDrawer,
      isCommandPaletteOpen,
      openCommandPalette,
      closeCommandPalette,
      toggleCommandPalette,
      isSensoryOverloadActive,
      hoveredExpression,
    ]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}

export function getDrawerTypeForHref(href: string): DrawerType {
  return drawerRouteMap[normalizePathname(href)] ?? null;
}
