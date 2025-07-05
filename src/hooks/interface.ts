import { FormData, ValidationErrors } from "./useTerrainForm";

/**
 * Interface définissant le type de retour du hook useAddTerrain
 * Contient toutes les propriétés et méthodes exposées par le hook pour la gestion
 * de l'ajout de terrains
 */
export interface UseAddTerrainReturn {
    // État du formulaire
    formData: FormData;                    // Données du formulaire
    errors: ValidationErrors;              // Erreurs de validation
    isSubmitting: boolean;                 // État de soumission
    isFormReady: boolean;                  // Indique si le formulaire est prêt
    
    // États des pickers
    showStartTimePicker: boolean;          // Affichage du picker d'heure d'ouverture
    showEndTimePicker: boolean;            // Affichage du picker d'heure de fermeture
    
    // Messages
    successMessage: string | null;         // Message de succès
    errorMessage: string | null;           // Message d'erreur
    
    // Handlers de formulaire
    setTerrainNom: (value: string) => void;                    // Met à jour le nom du terrain
    setTerrainLocalisation: (value: string) => void;           // Met à jour la localisation
    setTerrainDescription: (value: string) => void;            // Met à jour la description
    setTerrainContact: (value: string) => void;                // Met à jour le contact
    setTerrainPrixParHeure: (value: string) => void;           // Met à jour le prix par heure
    
    // Handlers de temps
    setShowStartTimePicker: (show: boolean) => void;           // Affiche/masque le picker d'ouverture
    setShowEndTimePicker: (show: boolean) => void;             // Affiche/masque le picker de fermeture
    handleStartTimeChange: (event: any, selectedDate?: Date) => void;  // Gère le changement d'heure d'ouverture
    handleEndTimeChange: (event: any, selectedDate?: Date) => void;    // Gère le changement d'heure de fermeture
    
    // Handlers d'images
    pickImage: () => Promise<void>;        // Sélectionne une image
    removeImage: (index: number) => void;  // Supprime une image
    
    // Handlers de soumission
    handleSubmit: () => Promise<void>;     // Soumet le formulaire
    
    // Utilitaires
    validateForm: () => boolean;           // Valide le formulaire
    clearSuccessMessage: () => void;       // Efface le message de succès
    clearErrorMessage: () => void;         // Efface le message d'erreur
}