import { useAuth } from '@clerk/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { apiFetch } from '../lib/api'
import { body } from 'framer-motion/client'
import { Product } from 'stream-chat'


export function useAdminProductsPage() {
    const { getToken, isSignedIn } = useAuth()
    const queryClient = useQueryClient()
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing ] = useState(null)


    const { data: meData } = useQuery ({
        queryKey: ["me"],
        queryFn: () => apiFetch("/api/me", {getToken}),
        enabled: isSignedIn,
    })

    const isAdmin = meData?.user?.role === "admin"

    const { data, isLoading } = useQuery({
        queryKey: ["admin", "products"],
        queryFn: () => apiFetch("/api/admin/products", { getToken }),
        enabled: isSignedIn && isAdmin,
    })

    const saveMutation = useMutation ({
        mutationFn: async ({ body, id}) => {
            if (id) {
                return apiFetch(`/api/admin/products/${id}`, {
                    getToken,
                    method: "PATCH",
                    body,
                })
            }
            return apiFetch("/api/admin/products", { getToken, method: "POST", body})
        },


        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "products"]})
            queryClient.invalidateQueries({ queryKey: ["products"] })
            queryClient.invalidateQueries({ queryKey: ["product-categories"] })
            setModalOpen(false)
            setEditing(null)
        },
        
    })

    const deleteMutation = useMutation ({
        mutationFn: (ProductId) =>
            apiFetch(`/api/admin/products/${ProductId}`, { getToken, method: "DELETE"}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "products"] })
            queryClient.invalidateQueries({ queryKey: ["products"] })
            queryClient.invalidateQueries({ queryKey: ["product-categories"] })
        },
        onError: (err) => {
            window.alert(err instanceof Error ? err.message : "Delete failed")
        },
    })


    return {
        getToken,
        isSignedIn,
        meData,
        modalOpen,
        setModalOpen,
        editing,
        setEditing,
        products: data?.products ?? [],
        isLoading,
        saveMutation,
        deleteMutation,
    }
}

export default useAdminProductsPage