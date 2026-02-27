import { createContext, useContext, useState, ReactNode } from "react";

export type DrawerType = "faq" | "newsletter" | "about" | "contact" | null;

interface UIContextProps {
    activeDrawer: DrawerType;
    openDrawer: (drawer: DrawerType) => void;
    closeDrawer: () => void;
    isSensoryOverloadActive: boolean;
    setSensoryOverloadActive: (active: boolean) => void;
}

const UIContext = createContext<UIContextProps | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
    const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);
    const [isSensoryOverloadActive, setSensoryOverloadActive] = useState<boolean>(false);

    const openDrawer = (drawer: DrawerType) => setActiveDrawer(drawer);
    const closeDrawer = () => setActiveDrawer(null);

    return (
        <UIContext.Provider value={{ activeDrawer, openDrawer, closeDrawer, isSensoryOverloadActive, setSensoryOverloadActive }}>
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
