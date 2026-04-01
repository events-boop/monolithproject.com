export function logEvent(event: string, payload: Record<string, unknown>) {
  console.log(
    JSON.stringify({
      level: "info",
      ts: new Date().toISOString(),
      event,
      ...payload,
    })
  );
}
