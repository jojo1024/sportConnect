import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProps } from '../navigation/types';
import { startLoading, setError, clearError } from '../store/slices/userSlice';
import { authService } from '../services/authService';
import { RootState } from '../store';
import { useAuthLogin } from '../store/hooks/hooks';
import { Keyboard } from 'react-native';

/**
 * Interface définissant la structure de l'état du formulaire d'inscription
 */
interface RegisterFormState {
    nom: string;
    telephone: string;
    commune: string;
    dateNaiss: string;
    sexe: 'Homme' | 'Femme';
    motDePasse: string;
    confirmerMotDePasse: string;
}

/**
 * Interface définissant les fonctions de gestion du formulaire d'inscription
 */
interface RegisterFormHandlers {
    handleNomChange: (text: string) => void;
    handleTelephoneChange: (text: string) => void;
    handleCommuneChange: (text: string) => void;
    handleDateNaissChange: (text: string) => void;
    handleSexeChange: (sexe: 'Homme' | 'Femme') => void;
    handleMotDePasseChange: (text: string) => void;
    handleConfirmerMotDePasseChange: (text: string) => void;
    handleRegister: () => Promise<void>;
    isFormValid: boolean;
    errors: Record<string, string>;
    validateField: (field: keyof RegisterFormState) => string;
}

/**
 * Hook personnalisé pour gérer le formulaire d'inscription utilisateur.
 * 
 * Ce hook gère :
 * - L'état du formulaire d'inscription
 * - La validation des champs en temps réel
 * - La gestion des erreurs
 * - La soumission du formulaire
 * - La connexion automatique après inscription
 * 
 * @returns {[RegisterFormState, RegisterFormHandlers]} Tuple contenant l'état du formulaire et les handlers
 */
export const useRegisterForm = (): [RegisterFormState, RegisterFormHandlers] => {
    const dispatch = useDispatch();
    const navigation = useNavigation<ScreenNavigationProps>();
    
    // Récupération des états du store Redux
    const isLoading = useSelector((state: RootState) => state.user.isLoading);
    const error = useSelector((state: RootState) => state.user.error);
    const { login } = useAuthLogin();
    
    // État local du formulaire d'inscription
    const [formState, setFormState] = useState<RegisterFormState>({
        nom: '',
        telephone: '',
        commune: '',
        dateNaiss: '',
        sexe: 'Homme',
        motDePasse: '',
        confirmerMotDePasse: '',
    });

    // État local pour les erreurs de validation
    const [errors, setErrors] = useState<Record<string, string>>({});

    /**
     * Valide un champ spécifique du formulaire
     * 
     * @param {keyof RegisterFormState} field - Le champ à valider
     * @returns {string} Message d'erreur (vide si valide)
     */
    const validateField = (field: keyof RegisterFormState): string => {
        const value = formState[field];
        let errorMessage = '';
        
        switch (field) {
            case 'nom':
                // Validation du nom utilisateur
                if (!value.trim()) {
                    errorMessage = 'Le nom est requis';
                } else if (value.trim().length < 2) {
                    errorMessage = 'Le nom doit contenir au moins 2 caractères';
                } else if (value.trim().length > 30) {
                    errorMessage = 'Le nom ne peut pas dépasser 50 caractères';
                } else if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(value.trim())) {
                    errorMessage = 'Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes';
                }
                break;
                
            case 'telephone':
                // Validation du numéro de téléphone
                if (!value.trim()) {
                    errorMessage = 'Le numéro de téléphone est requis';
                } else {
                    // Nettoyer le numéro de téléphone (supprimer espaces, tirets, parenthèses)
                    const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
                    
                    // Vérifier le format (exactement 10 chiffres)
                    if (!/^[0-9]{10}$/.test(cleanPhone)) {
                        errorMessage = 'Le numéro de téléphone doit contenir exactement 10 chiffres';
                    }
                }
                break;
                
            case 'commune':
                // Validation de la commune
                if (!value.trim()) {
                    errorMessage = 'La commune est requise';
                }
                break;
                
            case 'dateNaiss':
                // Validation de la date de naissance
                if (!value) {
                    errorMessage = 'La date de naissance est requise';
                } else {
                    try {
                        const birth = new Date(value);
                        
                        // Vérifier que la date est valide et qu'elle n'est pas dans le futur
                        if (isNaN(birth.getTime())) {
                            errorMessage = 'Date de naissance invalide';
                        } else if (birth > new Date()) {
                            errorMessage = 'La date de naissance ne peut pas être dans le futur';
                        }
                    } catch (error) {
                        errorMessage = 'Date de naissance invalide';
                    }
                }
                break;
                
            case 'motDePasse':
                // Validation du mot de passe
                if (!value) {
                    errorMessage = 'Le mot de passe est requis';
                } else if (value.length < 4) {
                    errorMessage = 'Le mot de passe doit contenir au moins 4 caractères';
                } else if (value.length > 50) {
                    errorMessage = 'Le mot de passe ne peut pas dépasser 50 caractères';
                }
                break;
                
            case 'confirmerMotDePasse':
                // Validation de la confirmation du mot de passe
                if (!value) {
                    errorMessage = 'La confirmation du mot de passe est requise';
                } else if (formState.motDePasse !== value) {
                    errorMessage = 'Les mots de passe ne correspondent pas';
                }
                break;
        }
        
        // Mettre à jour l'erreur dans l'état local
        setErrors(prev => ({
            ...prev,
            [field]: errorMessage
        }));
        
        return errorMessage;
    };

    /**
     * Valide l'ensemble du formulaire
     * 
     * @returns {Record<string, string>} Objet contenant toutes les erreurs de validation
     */
    const validateForm = (): Record<string, string> => {
        const newErrors: Record<string, string> = {};
        
        // Liste des champs obligatoires à valider
        const fields: (keyof RegisterFormState)[] = ['nom', 'telephone', 'commune', 'dateNaiss', 'motDePasse', 'confirmerMotDePasse'];
        
        // Valider chaque champ
        fields.forEach(field => {
            const error = validateField(field);
            if (error) {
                newErrors[field] = error;
            }
        });
        
        setErrors(newErrors);
        return newErrors;
    };

    /**
     * Gère le changement de valeur du champ nom
     * 
     * @param {string} text - Nouvelle valeur du nom
     */
    const handleNomChange = (text: string) => {
        setFormState(prev => ({ ...prev, nom: text }));
        // Effacer l'erreur locale si elle existe
        if (errors.nom) {
            setErrors(prev => ({ ...prev, nom: '' }));
        }
        // Effacer l'erreur globale du store
        if (error) {
            dispatch(clearError());
        }
    };

    /**
     * Gère le changement de valeur du champ téléphone
     * 
     * @param {string} text - Nouvelle valeur du téléphone
     */
    const handleTelephoneChange = (text: string) => {
        setFormState(prev => ({ ...prev, telephone: text }));
        // Effacer l'erreur locale si elle existe
        if (errors.telephone) {
            setErrors(prev => ({ ...prev, telephone: '' }));
        }
        // Effacer l'erreur globale du store
        if (error) {
            dispatch(clearError());
        }
    };

    /**
     * Gère le changement de valeur du champ commune
     * 
     * @param {string} text - Nouvelle valeur de la commune
     */
    const handleCommuneChange = (text: string) => {
        setFormState(prev => ({ ...prev, commune: text }));
        // Effacer l'erreur locale si elle existe
        if (errors.commune) {
            setErrors(prev => ({ ...prev, commune: '' }));
        }
        // Effacer l'erreur globale du store
        if (error) {
            dispatch(clearError());
        }
    };

    /**
     * Gère le changement de valeur du champ date de naissance
     * 
     * @param {string} text - Nouvelle valeur de la date de naissance
     */
    const handleDateNaissChange = (text: string) => {
        setFormState(prev => ({ ...prev, dateNaiss: text }));
        // Effacer l'erreur immédiatement quand une date est sélectionnée
        setErrors(prev => ({ ...prev, dateNaiss: '' }));
        // Effacer l'erreur globale du store
        if (error) {
            dispatch(clearError());
        }
    };

    /**
     * Gère le changement de valeur du champ sexe
     * 
     * @param {('Homme' | 'Femme')} sexe - Nouvelle valeur du sexe
     */
    const handleSexeChange = (sexe: 'Homme' | 'Femme') => {
        setFormState(prev => ({ ...prev, sexe }));
        // Effacer l'erreur globale du store
        if (error) {
            dispatch(clearError());
        }
    };

    /**
     * Gère le changement de valeur du champ mot de passe
     * 
     * @param {string} text - Nouvelle valeur du mot de passe
     */
    const handleMotDePasseChange = (text: string) => {
        setFormState(prev => ({ ...prev, motDePasse: text }));
        // Effacer l'erreur locale si elle existe
        if (errors.motDePasse) {
            setErrors(prev => ({ ...prev, motDePasse: '' }));
        }
        // Re-valider la confirmation du mot de passe si elle a déjà été saisie
        if (errors.confirmerMotDePasse && formState.confirmerMotDePasse) {
            const confirmError = validateField('confirmerMotDePasse');
            setErrors(prev => ({ ...prev, confirmerMotDePasse: confirmError }));
        }
        // Effacer l'erreur globale du store
        if (error) {
            dispatch(clearError());
        }
    };

    /**
     * Gère le changement de valeur du champ confirmation du mot de passe
     * 
     * @param {string} text - Nouvelle valeur de la confirmation du mot de passe
     */
    const handleConfirmerMotDePasseChange = (text: string) => {
        setFormState(prev => ({ ...prev, confirmerMotDePasse: text }));
        // Effacer l'erreur locale si elle existe
        if (errors.confirmerMotDePasse) {
            setErrors(prev => ({ ...prev, confirmerMotDePasse: '' }));
        }
        // Effacer l'erreur globale du store
        if (error) {
            dispatch(clearError());
        }
    };

    /**
     * Gère la soumission du formulaire d'inscription
     * 
     * Processus :
     * 1. Masquer le clavier
     * 2. Vérifier si un chargement est en cours
     * 3. Valider le formulaire
     * 4. Envoyer la requête d'inscription
     * 5. Connecter automatiquement l'utilisateur
     * 6. Naviguer vers l'écran principal
     * 
     * @throws {Error} En cas d'erreur de validation ou d'inscription
     */
    const handleRegister = async () => {
        // Masquer le clavier
        Keyboard.dismiss();

        // Éviter les soumissions multiples
        if (isLoading) return;

        // Valider le formulaire avant soumission
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            // Afficher les erreurs de validation
            const errorMessages = Object.values(validationErrors).filter(msg => msg).join('\n');
            if (errorMessages) {
                throw new Error(errorMessages);
            }
            return;
        }

        try {
            // Démarrer le chargement
            dispatch(startLoading());

            // Envoyer la requête d'inscription
            const response = await authService.register({
                utilisateurNom: formState.nom,
                utilisateurTelephone: formState.telephone.replaceAll(' ', ''), // Nettoyer le téléphone
                utilisateurCommune: formState.commune,
                utilisateurDateNaiss: formState.dateNaiss,
                utilisateurSexe: formState.sexe,
                utilisateurRole: 'lambda',
                utilisateurMotDePasse: formState.motDePasse
            });

            // Connecter automatiquement l'utilisateur après inscription
            await login(response.user, {
                accessToken: response.accessToken,
                refreshToken: response.refreshToken
            });

            // Navigation vers l'écran principal en réinitialisant la pile de navigation
            navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
            });
        } catch (error: any) {
            console.log("🚀 ~ handleRegister ~ error:", error);
            
            // Gestion des différents types d'erreurs
            let errorMessage = 'Erreur d\'inscription. Veuillez réessayer.';
            
            if (error.message) {
                errorMessage = error.message;
            } else if (error.response?.status === 400) {
                errorMessage = 'Données invalides';
            } else if (error.response?.status === 409) {
                errorMessage = 'Ce numéro de téléphone est déjà utilisé';
            }
            
            // Mettre à jour l'erreur dans le store
            dispatch(setError(errorMessage));
            throw new Error(errorMessage);
        }
    };

    // Calculer la validité du formulaire en temps réel
    // Le formulaire est valide si tous les champs requis sont correctement remplis
    const isFormValid = 
        formState.nom.trim().length >= 2 && // Nom d'au moins 2 caractères
        /^[0-9]{10}$/.test(formState.telephone.replace(/\s/g, '')) && // Téléphone de 10 chiffres
        formState.commune.trim().length > 0 && // Commune non vide
        formState.dateNaiss.length > 0 && // Date de naissance renseignée
        formState.motDePasse.length >= 4 && // Mot de passe d'au moins 4 caractères
        formState.confirmerMotDePasse.length > 0 && // Confirmation non vide
        formState.motDePasse === formState.confirmerMotDePasse && // Mots de passe identiques
        !isLoading; // Pas de chargement en cours

    // Retourner l'état du formulaire et les handlers
    return [
        formState,
        {
            handleNomChange,
            handleTelephoneChange,
            handleCommuneChange,
            handleDateNaissChange,
            handleSexeChange,
            handleMotDePasseChange,
            handleConfirmerMotDePasseChange,
            handleRegister,
            isFormValid,
            errors,
            validateField,
        },
    ];
}; 