/** Password required when creating or deleting a task (API validates). */
export const SNIFFER_PASSWORD =
  process.env.SNIFFER_PASSWORD ?? "zaid@impiclabs.com"

export function validateSnifferPassword(password: unknown): boolean {
  return typeof password === "string" && password === SNIFFER_PASSWORD
}
