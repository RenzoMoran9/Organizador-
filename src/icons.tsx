import type { ReactNode } from 'react'

interface IconProps {
  className?: string
}

const makeIcon = (children: ReactNode) =>
  function Icon({ className = 'w-5 h-5' }: IconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        {children}
      </svg>
    )
  }

export const IconSun = makeIcon(
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </>
)

export const IconInbox = makeIcon(
  <>
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </>
)

export const IconTasks = makeIcon(
  <>
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <path d="m8 12 3 3 5-6" />
  </>
)

export const IconCalendar = makeIcon(
  <>
    <rect x="3" y="4" width="18" height="18" rx="3" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </>
)

export const IconFlame = makeIcon(
  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3 2.5.5 5 2.62 5 6a5 5 0 0 1-10 0c0-1.57.92-2.75 1.5-3.5.28 1.35 1 3 2 3zM12 2s3 2.5 3 6c0 1-.5 2-1 2.5C15.5 9 17 7.5 17 6c1.5 1.5 3 4.24 3 7a8 8 0 0 1-16 0c0-3 1.5-5.5 3-7 0 2 1 3.5 2.5 4C9 8.5 9 7 9 6c0-2 1.5-3.5 3-4z" />
)

export const IconTarget = makeIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1" />
  </>
)

export const IconChart = makeIcon(
  <>
    <path d="M3 3v16a2 2 0 0 0 2 2h16" />
    <path d="M7 15v-4m5 4V7m5 8v-6" />
  </>
)

export const IconSettings = makeIcon(
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </>
)

export const IconPlus = makeIcon(<path d="M12 5v14M5 12h14" />)

export const IconX = makeIcon(<path d="M18 6 6 18M6 6l12 12" />)

export const IconCheck = makeIcon(<path d="m4 12 6 6L20 6" />)

export const IconChevronLeft = makeIcon(<path d="m15 18-6-6 6-6" />)

export const IconChevronRight = makeIcon(<path d="m9 18 6-6-6-6" />)

export const IconTrash = makeIcon(
  <>
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M10 11v6m4-6v6" />
  </>
)

export const IconPencil = makeIcon(
  <>
    <path d="M17 3a2.83 2.83 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </>
)

export const IconClock = makeIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </>
)

export const IconPlay = makeIcon(<path d="m6 4 14 8-14 8Z" />)

export const IconPause = makeIcon(<path d="M9 4v16M15 4v16" />)

export const IconRotate = makeIcon(
  <>
    <path d="M3 12a9 9 0 1 0 2.64-6.36L3 8" />
    <path d="M3 3v5h5" />
  </>
)

export const IconStar = makeIcon(
  <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
)

export const IconSparkles = makeIcon(
  <>
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z" />
    <path d="M19 15l.95 2.55L22.5 18.5l-2.55.95L19 22l-.95-2.55L15.5 18.5l2.55-.95Z" />
  </>
)

export const IconArrowRight = makeIcon(<path d="M5 12h14m-6-6 6 6-6 6" />)

export const IconDownload = makeIcon(
  <>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="m7 10 5 5 5-5M12 15V3" />
  </>
)

export const IconCompass = makeIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2 5-5 2 2-5 5-2z" />
  </>
)

export const IconMore = makeIcon(
  <>
    <circle cx="5" cy="12" r="1.2" />
    <circle cx="12" cy="12" r="1.2" />
    <circle cx="19" cy="12" r="1.2" />
  </>
)
