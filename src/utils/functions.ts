import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

export const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const today = new Date().toISOString().split('T')[0];
export const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];


export const getSectionLabel = (date: string) => {
    if (date === today) return "Aujourd'hui";
    if (date === tomorrow) return 'Demain';

    // Calculer le nombre de jours de différence
    const todayDate = new Date(today);
    const targetDate = new Date(date);
    const diffTime = targetDate.getTime() - todayDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 2) return 'Après-demain';
    if (diffDays === 3) return 'Dans 3 jours';
    if (diffDays === 4) return 'Dans 4 jours';
    if (diffDays === 5) return 'Dans 5 jours';
    if (diffDays === 6) return 'Dans 6 jours';
    if (diffDays === 7) return 'Dans 1 semaine';
    if (diffDays > 7) return `Dans ${diffDays} jours`;

    // Affiche la date au format français pour les dates plus éloignées
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
}

// Fonction pour calculer la durée du match
export const calculateMatchDuration = (startDate: string, endDate: string): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationMs = end.getTime() - start.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);

    if (durationHours === 1) return '1h';
    if (durationHours === 1.5) return '1h30';
    if (durationHours === 2) return '2h';
    return `${durationHours}h`;
}

// Fonction pour extraire l'heure du match
export const extractHour = (dateTime: string): string => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

// Fonction pour extraire la date du match
export const extractDate = (dateTime: string): string => {
    const date = new Date(dateTime);
    return date.toISOString().split('T')[0];
}

// Fonction pour obtenir les images du terrain
export const getTerrainImages = (terrainImages: string[] | null): string[] => {
    if (!terrainImages || terrainImages.length === 0) {
        // Images par défaut si aucune image n'est disponible
        return ['https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500'];
    }

    // Si terrainImages est une chaîne JSON, on la parse
    if (typeof terrainImages === 'string') {
        try {
            return JSON.parse(terrainImages);
        } catch {
            return [terrainImages];
        }
    }

    return terrainImages;
}

// Fonction pour trier les dates avec priorité pour aujourd'hui et demain
export const sortDatesWithPriority = (dates: string[]): string[] => {
    return dates.sort((a, b) => {
        // Priorité 1: Aujourd'hui
        if (a === today) return -1;
        if (b === today) return 1;

        // Priorité 2: Demain
        if (a === tomorrow) return -1;
        if (b === tomorrow) return 1;

        // Priorité 3: Tri chronologique pour les autres dates
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA.getTime() - dateB.getTime();
    });
}

export const formatNotificationDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
  
    const diffInMs = now.getTime() - date.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
  
    if (diffInSeconds < 0) {
      return "Dans le futur";
    }
  
    if (diffInSeconds < 10) {
      return "À l’instant";
    }
  
    if (diffInSeconds < 60) {
      return `Il y a ${diffInSeconds} seconde${diffInSeconds > 1 ? 's' : ''}`;
    }
  
    if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
    }
  
    if (diffInHours < 24) {
      return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    }
  
    if (diffInDays === 1) {
      return "Hier";
    }
  
    if (diffInDays < 7) {
      return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    }
  
    // Date formatée pour les événements plus anciens
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  