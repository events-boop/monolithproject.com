import { createContext, useContext, useState, ReactNode } from "react";

export type InquiryType = "sponsor" | "venue" | "artist" | "press" | "general" | "booking";

interface InquiryContextType {
  isOpen: boolean;
  type: InquiryType;
  openInquiry: (type: InquiryType) => void;
  closeInquiry: () => void;
}

const InquiryContext = createContext<InquiryContextType | undefined>(undefined);

export function InquiryProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<InquiryType>("general");

  const openInquiry = (newType: InquiryType) => {
    setType(newType);
    setIsOpen(true);
  };

  const closeInquiry = () => {
    setIsOpen(false);
  };

  return (
    <InquiryContext.Provider value={{ isOpen, type, openInquiry, closeInquiry }}>
      {children}
    </InquiryContext.Provider>
  );
}

export function useInquiry() {
  const context = useContext(InquiryContext);
  if (context === undefined) {
    throw new Error("useInquiry must be used within an InquiryProvider");
  }
  return context;
}
