

// Adds Items to cart from category products Page
export const addGuestCartItem = (product) => {


    const cart = JSON.parse(localStorage.getItem("guest_cart")) || [];
    console.log("length: " + cart.length);

    // create new guest cart and add new item
    if (cart.length === 0) {
        const item = [
            {
                product_variant_id: product.product_variant[0].id,
                quantity: 1
            }
        ];
        localStorage.setItem("guest_cart", JSON.stringify(item));
        return true;
    }

    // dont add variant if there's multiple variants
    if (product.product_variant.length > 1) {
        window.location.href = `/product/${product.slug}`;
        console.log("select variant");
        return false;
    }


    // add to the quantity of an existing item or add a new item
    const existingItems = cart.find(
        item => item.product_variant_id === product.product_variant[0].id
    )

    if (existingItems) {
        existingItems.quantity += 1;
    } else {
        cart.push(
            {
                product_variant_id: product.product_variant[0].id,
                quantity: 1
            }
        );
    }
    localStorage.setItem("guest_cart", JSON.stringify(cart));
    return true;
}


export const updateGuestQuantity = (product, quantity) => {
    // adjust the quanity of an existing cart item

    const cart = JSON.parse(localStorage.getItem("guest_cart")) || [];
    
    const existingItems = cart.find(
        item => item.product_variant_id === product
    )

    if (existingItems) {
        existingItems.quantity = quantity;
    } else {
        return;
    }

    localStorage.setItem("guest_cart", JSON.stringify(cart));
}

// Adds Items to cart from productDetails Page
export const addToCart = (variant, quantity) => {

    const cart = JSON.parse(localStorage.getItem("guest_cart")) || [];
    console.log("length: " + cart.length);

    // create new guest cart and add new item
    if (cart.length === 0) {
        const item = [
            {
                product_variant_id: variant,
                quantity: quantity
            }
        ];
        localStorage.setItem("guest_cart", JSON.stringify(item));
        return;
    }


    // add to the quantity of an existing item or add a new item
    const existingItems = cart.find(
        item => item.product_variant_id === variant
    )

    if (existingItems) {
        existingItems.quantity += quantity;
    } else {
        cart.push(
            {
                product_variant_id: variant,
                quantity: quantity
            }
        );
    }
    localStorage.setItem("guest_cart", JSON.stringify(cart));

};



export const deleteGuestCartItem = (product) => {
    let cart = JSON.parse(localStorage.getItem("guest_cart")) || [];

    cart = cart.filter(
        item => item.product_variant_id !== product
    );

    localStorage.setItem("guest_cart", JSON.stringify(cart));
}


export const getGuestCart = () => {
    const cart = JSON.parse(localStorage.getItem("guest_cart")) || [];
    // console.log(cart)
    return cart;
}