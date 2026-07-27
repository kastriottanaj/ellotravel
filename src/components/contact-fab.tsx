import { whatsappHref } from "@/data/site";

/**
 * Floating WhatsApp button. A good share of this agency's enquiries arrive as
 * DMs, so it stays reachable on every page. Calling has its own button in the
 * sticky bar on mobile and in the header strip on desktop, so it isn't
 * repeated here — this sits above that bar on small screens.
 */
export function ContactFab({
  whatsappLabel,
  message,
}: {
  whatsappLabel: string;
  message: string;
}) {
  return (
    <div className="fixed bottom-[5.5rem] right-4 z-40 flex flex-col gap-2.5 lg:bottom-4 print:hidden">
      <a
        href={whatsappHref(message)}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={whatsappLabel}
        title={whatsappLabel}
        className="flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] p-3.5 text-white shadow-lift transition hover:scale-105 active:scale-95"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-full fill-current">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 5.83 2.42 8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.17c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.22.25-.85.83-.85 2.03s.87 2.35.99 2.51c.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
        </svg>
      </a>
    </div>
  );
}
