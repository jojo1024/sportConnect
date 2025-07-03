import { FormData, ValidationErrors } from "./useTerrainForm";

// Types
export interface UseAddTerrainReturn {
    // État du formulaire
    formData: FormData;
    errors: ValidationErrors;
    isSubmitting: boolean;
    isFormReady: boolean;
    
    // États des pickers
    showStartTimePicker: boolean;
    showEndTimePicker: boolean;
    
    // Messages
    successMessage: string | null;
    errorMessage: string | null;
    
    // Handlers de formulaire
    setTerrainNom: (value: string) => void;
    setTerrainLocalisation: (value: string) => void;
    setTerrainDescription: (value: string) => void;
    setTerrainContact: (value: string) => void;
    setTerrainPrixParHeure: (value: string) => void;
    
    // Handlers de temps
    setShowStartTimePicker: (show: boolean) => void;
    setShowEndTimePicker: (show: boolean) => void;
    handleStartTimeChange: (event: any, selectedDate?: Date) => void;
    handleEndTimeChange: (event: any, selectedDate?: Date) => void;
    
    // Handlers d'images
    pickImage: () => Promise<void>;
    removeImage: (index: number) => void;
    
    // Handlers de soumission
    handleSubmit: () => Promise<void>;
    
    // Utilitaires
    validateForm: () => boolean;
    clearSuccessMessage: () => void;
    clearErrorMessage: () => void;
}