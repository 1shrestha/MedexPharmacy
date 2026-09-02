import { STORE } from "@/lib/constants";

export function WhatsAppButton() {
  const url = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(
    `Hi ${STORE.name}, I'd like some help with...`
  )}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg hover:scale-105 transition-transform"
    >
      <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white">
        <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.29.64 4.44 1.75 6.27L4 29l7.9-1.7A11.9 11.9 0 0 0 16 27c6.628 0 12-5.373 12-12S22.629 3 16.001 3zm0 21.6c-1.94 0-3.76-.53-5.32-1.46l-.38-.22-4.44.96.95-4.34-.25-.4A9.55 9.55 0 0 1 5.4 15c0-5.85 4.75-10.6 10.6-10.6S26.6 9.15 26.6 15 21.85 24.6 16 24.6zm5.79-7.94c-.31-.16-1.85-.91-2.14-1.02-.29-.1-.5-.16-.71.16-.21.31-.81 1.02-1 1.23-.18.21-.37.23-.68.08-.31-.16-1.32-.49-2.51-1.55-.93-.83-1.56-1.85-1.74-2.16-.18-.31-.02-.48.14-.63.14-.14.31-.37.47-.55.16-.19.21-.31.31-.52.1-.21.05-.39-.02-.55-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.53-.71-.54-.18-.01-.39-.01-.6-.01s-.55.08-.84.39c-.29.31-1.1 1.08-1.1 2.63s1.13 3.05 1.29 3.26c.16.21 2.22 3.39 5.38 4.75.75.32 1.34.51 1.8.66.76.24 1.44.21 1.99.13.61-.09 1.85-.76 2.11-1.49.26-.73.26-1.36.18-1.49-.08-.13-.29-.21-.6-.37z" />
      </svg>
    </a>
  );
}
