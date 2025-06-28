import api from "./api";

export interface CreditUtilisateur {
    creditId: number;
    utilisateurId: number;
    creditUtilisateurMontant: number;
    typeCredit: 'remboursement' | 'ajout_manuel' | 'bonus';
    sourceTransactionId?: number;
    dateCreation: string;
    dateExpiration?: string;
    statutCredit: 'actif' | 'utilise' | 'expire';
    description?: string;
}

export interface CreditResponse {
    success: boolean;
    message: string;
    data: CreditUtilisateur[];
}

export interface SoldeResponse {
    success: boolean;
    message: string;
    data: {
        solde: number;
    };
}

export const creditService = {
    // Récupérer le solde des crédits de l'utilisateur
    getUserSolde: async (): Promise<number> => {
        try {
            const response = await api.get<SoldeResponse>('/credits/solde');
            return response.data.data.solde;
        } catch (error) {
            console.error('Erreur lors de la récupération du solde:', error);
            throw error;
        }
    },

    // Récupérer tous les crédits de l'utilisateur
    getUserCredits: async (): Promise<CreditUtilisateur[]> => {
        try {
            const response = await api.get<CreditResponse>('/credits/user');
            return response.data.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des crédits:', error);
            throw error;
        }
    },
}; 