export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const LOADING_MESSAGES = [
  "CONNECTING TO REMOTE CLOUD DATABASE...",
  "STATUS: SPINNING UP STORAGE DISKS...",
  "DATALINK: WAKING UP DORMANT COMPUTE HANDLERS...",
  "AUTHENTICATING SYSTEM CREDENTIALS...",
  "RESOLVING ENVIRONMENT CONFIG...",
  "FETCHING INTEGRITY SCHEMAS...",
  "RETRIEVING KANBAN TASK BACKLOG LEDGER...",
  "INITIAL HANDSHAKE READY — DEPLOYING BOARD VIEW..."
];

export const COLUMNS = [
  {
    status: 'todo',
    title: 'Todo',
    description: "This item hasn't been started",
    skeletonCount: 3,
  },
  {
    status: 'inProgress',
    title: 'In Progress',
    description: " description",
    skeletonCount: 4
  },
  {
    status: 'done',
    title: 'Done',
    description: 'This has been completed',
    skeletonCount: 2,
  }
];
