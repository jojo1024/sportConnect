export const TAB_CONFIG = [
    { key: 'pending', title: 'En attente' },
    { key: 'confirmed', title: 'Confirmé' },
    { key: 'cancelled', title: 'Annulé' },
];

export const RESERVATION_STATUSES = {
    pending: 'en_attente',
    confirmed: 'confirme',
    cancelled: 'annule',
} as const;

export const RESERVATION_STATUSES_REVERSE = {
    en_attente: 'pending',
    confirme: 'confirmed',
    annule: 'cancelled',
} as const; 