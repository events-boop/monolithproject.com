import * as React from "react";
import { render, toPlainText } from "@react-email/components";
import { COMMUNICATIONS } from "./communications";
import { MonolithMessage, type MonolithMessageProps } from "./MonolithMessage";

type RenderOptions = Omit<MonolithMessageProps, "preview"> & {
  mode: "preview" | "delivery";
};

/** Produces HTML/plain text, never sends or imports a provider/DB client. */
export async function renderMonolithMessage({ mode, ...props }: RenderOptions) {
  if (mode !== "preview" && mode !== "delivery")
    throw new Error("Choose preview or delivery rendering explicitly");
  const message = COMMUNICATIONS[props.messageId];
  if (!message) throw new Error("Unknown Monolith communication");
  if (mode === "delivery") {
    if (
      ["application-received", "contact-received", "signup-saved"].includes(
        props.messageId
      ) &&
      (!props.reference?.trim() || /preview/i.test(props.reference))
    ) {
      throw new Error("A real receipt reference is required for delivery");
    }
    if (message.category === "marketing") {
      let url: URL;
      try {
        url = new URL(props.unsubscribeUrl || "");
      } catch {
        throw new Error(
          "A working recipient-specific unsubscribe URL is required"
        );
      }
      if (url.protocol !== "https:")
        throw new Error("Unsubscribe links must use HTTPS");
      if (!props.postalAddress?.trim())
        throw new Error(
          "A real postal address is required for marketing delivery"
        );
    }
    if (
      props.assetOrigin &&
      props.assetOrigin !== "https://monolithproject.com"
    ) {
      throw new Error("Delivery assets must use the Monolith public origin");
    }
  }
  const html = await render(
    <MonolithMessage {...props} preview={mode === "preview"} />
  );
  return { subject: message.subject, html, text: toPlainText(html) };
}
