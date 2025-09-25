import { BASE_URL_IMAGES, BASE_URL_AVATARS } from '../services/api';
import { Match } from '../services/matchService';

export const formatDate = (date: Date | string | null) => {
    if (!date) return '';
    try {
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            return 'Date invalide';
        }
        return dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (error) {
        console.error('Erreur lors du formatage de la date:', error);
        return 'Date invalide';
    }
};


export const formatTime = (dateString: Date | string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

export const today = new Date().toISOString().split('T')[0];
export const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];


export const getDateSectionLabel = (date: string) => {
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

// Fonction pour vérifier si un match est passé (en tenant compte de l'heure)
export const isMatchPast = (matchDateDebut: string): boolean => {
    const now = new Date();
    const matchDate = new Date(matchDateDebut);
    return matchDate < now;
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
      return "À l'instant";
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
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  

export  const getStatusText = (status: "confirme" | "en_attente" | "annule") => {
    switch (status) {
        case "en_attente":
            return 'En attente';
        case "confirme":
            return 'Confirmée';
        case 'annule':
            return 'Annulée';
        default:
            return 'Inconnu';
    }
};

export const getStatusColor = (status: "confirme" | "en_attente" | "annule") => {
    switch (status) {
        case "en_attente":
            return '#FFA500'; // Orange pour en attente
        case "confirme":
            return '#4CAF50'; // Vert pour validé
        case 'annule':
            return '#F44336';
        default:
            return '#999';
    }
};

export const getTerrainImage = (images: string[] | null, index: number = 0) => {
    if (images && images.length > index) {
        return images[index];
    }
    return 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0';
};

export const formatHoraires = (horaires: string | { ouverture: string, fermeture: string }) => {
    if (!horaires) return 'Horaires non définis';

    try {
        const parsed = typeof horaires === 'string' ? JSON.parse(horaires) : horaires;
        if (parsed.ouverture && parsed.fermeture) {
            return `${parsed.ouverture} - ${parsed.fermeture}`;
        }
    } catch (e) {
        console.error('Erreur parsing horaires:', e);
    }

    return 'Horaires non définis';
};

export const formatDateLong = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

    // Formater les dates au format attendu par MySQL (YYYY-MM-DD HH:MM:SS)
export    const formatDateForMySQL = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

        // Fonction pour calculer l'âge à partir d'une date de naissance
        export const calculateAge = (birthDate: Date): number => {
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
    
            // Ajuster l'âge si l'anniversaire n'est pas encore passé cette année
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
    
            return age;
        };
    
        // Fonction pour générer le texte d'affichage de l'âge
        export const getAgeDisplay = (dateString: string): string => {
            if (!dateString) return '';
    
            try {
                const birthDate = new Date(dateString);
                if (!isNaN(birthDate.getTime())) {
                    const age = calculateAge(birthDate);
                    return `Âge: ${age} ans`;
                }
            } catch (error) {
                // Ignorer les erreurs de calcul d'âge
            }
            return 'Date valide';
        };

// Fonction pour obtenir l'URL de l'avatar utilisateur
export const getUserAvatar = (avatarPath: string | null | undefined): string => {
    if (!avatarPath) {
        // Avatar par défaut si aucun avatar n'est défini
        return 'https://tse4.mm.bing.net/th/id/OIP.GeEEvvh1bNc8fdvZsq4gQwHaHa?pid=Api&P=0&h=180';
    }

    // Si c'est déjà une URL complète (http/https), on la retourne telle quelle
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
        return avatarPath;
    }

    // Sinon, on construit l'URL avec le serveur
    return `${BASE_URL_AVATARS}/${avatarPath}`;
};

export type ModalType = 'confirm' | 'cancel' | null;

export const getModalConfig = (modalType: ModalType, item: Match) => {
    switch (modalType) {
        case 'confirm':
            return {
                title: "Confirmer la réservation",
                message: `Êtes-vous sûr de vouloir confirmer cette réservation pour le terrain "${item.terrainNom}" ?\n\nCette action ne peut pas être annulée.`,
                confirmText: "Confirmer",
                cancelText: "Annuler",
                type: "success"
            };
        case 'cancel':
            return {
                title: "Annuler la réservation",
                message: `Êtes-vous sûr de vouloir annuler cette réservation pour le terrain "${item.terrainNom}" ?\n\nCette action ne peut pas être annulée.`,
                confirmText: "Annuler",
                cancelText: "Retour",
                type: "error"
            };
        default:
            return {
                title: "",
                message: "",
                confirmText: "",
                cancelText: ""
            };
    }
};

// Fonction pour calculer les dates de début et fin de la semaine courante
export const getWeekDates = (): { dateDebut: string; dateFin: string } => {
    const today = new Date();

    // Calcul du lundi
    const day = today.getDay() || 7; // Dimanche (0) devient 7
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - day + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    // Calcul du dimanche
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return {
        dateDebut: startOfWeek.toISOString().split('T')[0],
        dateFin: endOfWeek.toISOString().split('T')[0]
    };
};

// Fonction pour formater les montants courts (pour les graphiques)
export const formatShortCurrency = (amount: number): string => {
    if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
        return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toString();
};

// Fonctions utilitaires pour calculer les statistiques
export const calculateRevenue = (reservations: Match[]): number => {
    return reservations.reduce((total, reservation) => {
        return total + (reservation.terrainPrixParHeure * reservation.matchDuree);
    }, 0);
};

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};