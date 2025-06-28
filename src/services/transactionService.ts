import api from "./api";

export interface Transaction {
    transactionId: number;
    utilisateurId: number;
    matchId?: number;
    transactionType: 'paiement' | 'remboursement' | 'credit_ajout' | 'credit_utilisation';
    transactionMontant: number;
    transactionDate: string;
    transactionDescription?: string;
    statutTransaction: 'en_attente' | 'confirme' | 'echoue' | 'annule';
    referencePaiement?: string;
}

export interface TransactionResponse {
    success: boolean;
    message: string;
    data: Transaction[];
}

export interface SingleTransactionResponse {
    success: boolean;
    message: string;
    data: Transaction;
}

export const transactionService = {
    // Récupérer les transactions d'un utilisateur
    getUserTransactions: async (): Promise<Transaction[]> => {
        try {
            const response = await api.get<TransactionResponse>('/transactions/user');
            return response.data.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des transactions:', error);
            throw error;
        }
    },

    // Récupérer une transaction par ID
    getTransactionById: async (transactionId: number): Promise<Transaction> => {
        try {
            const response = await api.get<SingleTransactionResponse>(`/transactions/${transactionId}`);
            return response.data.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de la transaction:', error);
            throw error;
        }
    },

    // Récupérer les transactions d'un match
    getMatchTransactions: async (matchId: number): Promise<Transaction[]> => {
        try {
            const response = await api.get<TransactionResponse>(`/transactions/match/${matchId}`);
            return response.data.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des transactions du match:', error);
            throw error;
        }
    },
}; 