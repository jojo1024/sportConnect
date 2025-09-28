import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    selectRoleRequests, 
    selectPendingRoleRequests, 
    selectHasPendingCapoRequest, 
    selectHasPendingGerantRequest,
    setRoleRequests,
    addRoleRequest,
    updateRoleRequest,
    removeRoleRequest,
    clearRoleRequests
} from '../store/slices/userSlice';
import { roleRequestService, RoleRequest } from '../services/roleRequestService';
import { selectUser } from '../store/slices/userSlice';

export const useRoleRequests = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const roleRequests = useSelector(selectRoleRequests);
    const pendingRoleRequests = useSelector(selectPendingRoleRequests);
    const hasPendingCapoRequest = useSelector(selectHasPendingCapoRequest);
    const hasPendingGerantRequest = useSelector(selectHasPendingGerantRequest);

    // Charger les demandes de rôle au montage du composant
    useEffect(() => {
        if (user?.utilisateurId) {
            loadRoleRequests();
        }
    }, [user?.utilisateurId]);

    const loadRoleRequests = async () => {
        if (!user?.utilisateurId) return;

        console.log("🚀 ~ loadRoleRequests ~ user?.utilisateurId:", user?.utilisateurId)
        try {
            const requests = await roleRequestService.getRoleRequestsByUserId(user.utilisateurId);
            dispatch(setRoleRequests(requests));
        } catch (error) {
            console.error('Erreur lors du chargement des demandes de rôle:', error);
        }
    };

    const addNewRoleRequest = (request: RoleRequest) => {
        dispatch(addRoleRequest(request));
    };

    const updateExistingRoleRequest = (request: RoleRequest) => {
        dispatch(updateRoleRequest(request));
    };

    const removeExistingRoleRequest = (requestId: number) => {
        dispatch(removeRoleRequest(requestId));
    };

    const clearAllRoleRequests = () => {
        dispatch(clearRoleRequests());
    };

    return {
        roleRequests: roleRequests || [],
        pendingRoleRequests: pendingRoleRequests || [],
        hasPendingCapoRequest: hasPendingCapoRequest || false,
        hasPendingGerantRequest: hasPendingGerantRequest || false,
        loadRoleRequests,
        addNewRoleRequest,
        updateExistingRoleRequest,
        removeExistingRoleRequest,
        clearAllRoleRequests
    };
};
