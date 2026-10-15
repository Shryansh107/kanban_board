import React from 'react';

export const TodoHeaderIcon = () => (
  <svg className="column-icon-todo" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="none" stroke="#2da44e" strokeWidth="2">
    <circle cx="8" cy="8" r="6" />
  </svg>
);

export const DoneHeaderIcon = () => (
  <svg className="column-icon-done" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="none" stroke="#a371f7" strokeWidth="2">
    <circle cx="8" cy="8" r="6" />
  </svg>
);

export const TodoCardIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="none" stroke="#2da44e" strokeWidth="2">
    <circle cx="8" cy="8" r="6" />
    <circle cx="8" cy="8" r="2" fill="#2da44e" />
  </svg>
);

export const DoneCardIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="none" stroke="#a371f7" strokeWidth="2">
    <circle cx="8" cy="8" r="6" />
    <path d="M5.5 8l1.5 1.5 3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Trash = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675a.75.75 0 1 0-1.492.15l.66 6.6A1.75 1.75 0 0 0 5.405 15h5.19c.9 0 1.652-.681 1.741-1.576l.66-6.6a.75.75 0 0 0-1.492-.149l-.66 6.6a.25.25 0 0 1-.249.225h-5.19a.25.25 0 0 1-.249-.225l-.66-6.6Z" />
  </svg>
);

export const Logo = () => (
  <svg viewBox="0 0 16 16" width="20" height="20" aria-hidden="true">
    <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
  </svg>
);

export const Sun = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-1.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm0-8a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 8 2.5Zm0 8a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 8 10.5Zm-5-3a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 3 7.5Zm8 0a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM4.22 4.22a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 0 1-1.06 1.06L4.22 5.28a.75.75 0 0 1 0-1.06Zm6.36 6.36a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06Zm-6.36 6.36a.75.75 0 0 1 0-1.06l1.06-1.06a.75.75 0 1 1 1.06 1.06l-1.06 1.06a.75.75 0 0 1-1.06 0Zm6.36-12.72a.75.75 0 0 1 0-1.06l1.06-1.06a.75.75 0 1 1 1.06 1.06l-1.06 1.06a.75.75 0 0 1-1.06 0Z" />
  </svg>
);

export const Moon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M9.598 1.591a.75.75 0 0 1 .785-.175 7 7 0 1 1-8.967 8.967.75.75 0 0 1 .961-.96 5.5 5.5 0 0 0 7.046-7.046.75.75 0 0 1 .175-.786Z" />
  </svg>
);

export const ErrorIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
    <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16ZM8 4a.905.905 0 0 0-.9.9v4a.9.9 0 0 0 1.8 0v-4A.905.905 0 0 0 8 4Zm0 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
  </svg>
);

export const EmptyStateIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true">
    <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2Zm0 16H5V5h14v14ZM17 12H7v-2h10v2Zm-4 4H7v-2h6v2Zm4-8H7V6h10v2Z" />
  </svg>
);

export const Kebab = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
    <path d="M8 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM1.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm13 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
  </svg>
);

export const Plus = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
    <path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z" />
  </svg>
);

export const ArrowLeft = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M7.78 12.53a.75.75 0 0 1-1.06 0L2.47 8.28a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 1.06L4.06 7.5h10.75a.75.75 0 0 1 0 1.5H4.06l3.72 3.72a.75.75 0 0 1 0 1.06Z" />
  </svg>
);

export const ArrowRight = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M8.22 2.97a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 8 8.22 4.28a.75.75 0 0 1 0-1.06Z" />
    <path d="M12.5 8H1.75a.75.75 0 0 1 0-1.5h10.75a.75.75 0 0 1 0 1.5Z" />
  </svg>
);

export const Grabber = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M10 13a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0-4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0-4a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM6 13a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0-4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0-4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
  </svg>
);
