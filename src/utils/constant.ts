
export const COMMUNES_ABIDJAN = [
    'Abobo',
    'Adjamé',
    'Attécoubé',
    'Cocody',
    'Koumassi',
    'Marcory',
    'Plateau',
    'Port-Bouët',
    'Treichville',
    'Yopougon',
];

export const DURATION_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 24, 72];

export const PARTICIPANTS_LIMITS = {
    MIN: 2,
    MAX: 50,
    DEFAULT: 10,
} as const;

export const SPORTS = [
    {
      "sportId": 1,
      "sportNom": "Football",
      "sportIcone": "football-outline",
      "sportStatus": 1,
      "createdAt": "2025-07-03T04:36:39.000Z",
      "updatedAt": "2025-07-03T04:36:39.000Z"
    },
    {
      "sportId": 2,
      "sportNom": "Basketball",
      "sportIcone": "basketball-outline",
      "sportStatus": 1,
      "createdAt": "2025-07-03T04:36:39.000Z",
      "updatedAt": "2025-07-03T04:36:39.000Z"
    },
    {
      "sportId": 3,
      "sportNom": "Tennis",
      "sportIcone": "tennisball-outline",
      "sportStatus": 1,
      "createdAt": "2025-07-03T04:36:39.000Z",
      "updatedAt": "2025-07-03T04:36:39.000Z"
    },
    {
      "sportId": 4,
      "sportNom": "Handball",
      "sportIcone": "handball-outline",
      "sportStatus": 1,
      "createdAt": "2025-07-03T04:36:39.000Z",
      "updatedAt": "2025-07-03T04:36:39.000Z"
    },
    {
      "sportId": 5,
      "sportNom": "Paddle",
      "sportIcone": "paddle-outline",
      "sportStatus": 1,
      "createdAt": "2025-07-03T04:36:39.000Z",
      "updatedAt": "2025-07-03T04:36:39.000Z"
    },
    {
      "sportId": 6,
      "sportNom": "Golf",
      "sportIcone": "golf-outline",
      "sportStatus": 1,
      "createdAt": "2025-07-03T04:36:39.000Z",
      "updatedAt": "2025-07-03T04:36:39.000Z"
    },
    {
      "sportId": 7,
      "sportNom": "Volleyball",
      "sportIcone": "volleyball-outline",
      "sportStatus": 1,
      "createdAt": "2025-07-03T04:36:39.000Z",
      "updatedAt": "2025-07-03T04:36:39.000Z"
    },
    {
      "sportId": 8,
      "sportNom": "Badminton",
      "sportIcone": "badminton-outline",
      "sportStatus": 1,
      "createdAt": "2025-07-03T04:36:39.000Z",
      "updatedAt": "2025-07-03T04:36:39.000Z"
    }
  ]
  
    // Fonction pour mapper les icônes avec les bonnes bibliothèques
  export   const getSportIcon = (iconName: string): { name: string; library: 'Ionicons' | 'MaterialCommunityIcons' } => {
      const iconMapping: { [key: string]: { name: string; library: 'Ionicons' | 'MaterialCommunityIcons' } } = {
          'football-outline': { name: 'football-outline', library: 'Ionicons' },
          'basketball-outline': { name: 'basketball-outline', library: 'Ionicons' },
          'tennisball-outline': { name: 'tennisball-outline', library: 'Ionicons' },
          'handball-outline': { name: 'basketball', library: 'MaterialCommunityIcons' },
          'paddle-outline': { name: 'table-tennis', library: 'MaterialCommunityIcons' },
          'golf-outline': { name: 'golf', library: 'MaterialCommunityIcons' },
          'volleyball-outline': { name: 'volleyball', library: 'MaterialCommunityIcons' },
          'badminton-outline': { name: 'badminton', library: 'MaterialCommunityIcons' },
      };

      return iconMapping[iconName] || { name: 'football-outline', library: 'Ionicons' };
  };

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