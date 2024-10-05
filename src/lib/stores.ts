import { writable } from 'svelte/store';

// Stores to handle selected filters
export const selectedAircraft = writable('');
export const selectedPilot = writable('');
export const dateRange = writable({ start: null, end: null });
