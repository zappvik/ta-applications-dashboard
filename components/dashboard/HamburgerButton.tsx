'use client'

export default function HamburgerButton({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: (state: boolean) => void
}) {
  return (
    <button
      type="button"
      className="lg:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
      onClick={() => setIsOpen(!isOpen)}
      aria-label="Toggle menu"
    >
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {isOpen ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        )}
      </svg>
    </button>
  )
}

