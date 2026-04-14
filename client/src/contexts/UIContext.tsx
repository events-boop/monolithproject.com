import { createContext, useContext, useState, ReactNode } from "react";

export type DrawerType = "faq" | "newsletter" | "contact" | "guide" | "about" | null;

const drawerRouteMap = {
    "/faq": "faq",
    "/newsletter": "newsletter",
    "/contact": "contact",
    "/guide": "guide",
    "/inner-circle": "newsletter",
    "/about": "about",
    "/togetherness": "about",
} as const;

export type ExpressionId = "sunsets" | "untold" | "radio" | null;

interface UIContextProps {
    activeDrawer: DrawerType;
    openDrawer: (drawer: DrawerType) => void;
    closeDrawer: () => void;
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
    const [isSensoryOverloadActive, setSensoryOverloadActive] = useState<boolean>(false);
    const [hoveredExpression, setHoveredExpression] = useState<ExpressionId>(null);

    const openDrawer = (drawer: DrawerType) => setActiveDrawer(drawer);
    const closeDrawer = () => setActiveDrawer(null);

    return (
        <UIContext.Provider value={{ 
            activeDrawer, 
            openDrawer, 
            closeDrawer, 
            isSensoryOverloadActive, 
            setSensoryOverloadActive,
            hoveredExpression,
            setHoveredExpression
        }}>
            {children}
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error("useUI must be used within a UIProvider");
    }
    return context;
}

export function getDrawerTypeForHref(href: string): DrawerType {
    return drawerRouteMap[normalizePathname(href) as keyof typeof drawerRouteMap] ?? null;
}
