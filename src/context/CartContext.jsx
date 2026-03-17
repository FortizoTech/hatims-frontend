import { createContext, useState, useEffect, useContext } from "react"
import API from "../api/api"
import { AuthContext } from "./AuthContext"

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([])
    const { user } = useContext(AuthContext)

    // Fetch cart from database when user logs in
    useEffect(() => {
        if (user) {
            fetchCart()
        } else {
            setCart([]) // Clear cart if logged out
        }
    }, [user])

    const fetchCart = async () => {
        try {
            const res = await API.get("/cart")
            setCart(res.data || [])
        } catch (error) {
            console.error("Error fetching cart from DB:", error)
        }
    }

    const addToCart = async (product) => {
        // If not logged in, alert or redirect
        if (!user) {
            alert("Please log in to add items to your cart.")
            return
        }

        try {
            await API.post("/cart/add", {
                product_id: product.id,
                quantity: product.quantity || 1
            })
            // Refetch cart to get updated exact quantities and prices from DB
            fetchCart()
        } catch (error) {
            console.error("Error adding to cart API:", error)
            alert("Could not add to cart. Please try again.")
        }
    }

    const removeFromCart = async (cartItemId) => {
        try {
            await API.delete("/cart/remove", {
                data: { cart_item_id: cartItemId }
            })
            // Fetch updated cart to ensure accuracy
            fetchCart()
        } catch (error) {
            console.error("Error removing from cart API:", error)
            alert("Could not remove item. Please try again.")
        }
    }
    
    // Note: To properly update quantity, the backend needs an update route.
    const updateQuantity = async (cartItemId, newQuantity) => {
        // Optimistic UI update for snappier feel
        setCart(prev => prev.map(item => 
            item.cart_item_id === cartItemId ? { ...item, quantity: newQuantity } : item
        ))
        
        try {
            await API.put("/cart/update", {
                cart_item_id: cartItemId,
                quantity: newQuantity
            })
            // Fetch the official state from DB
            fetchCart()
        } catch (error) {
            console.error("Error updating cart quantity:", error)
            // Revert optimistic update by refetching
            fetchCart()
        }
    }

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    )
}