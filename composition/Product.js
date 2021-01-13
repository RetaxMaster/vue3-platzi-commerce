app.component("product", {

    template: /* vue-html */ `
        <section class="product">

            <div class="product__thumbnails">
                <div 
                v-for="(image, index) in product.images"
                :key="image.thumbnail"
                class="thumb" 
                :class="{ active: activeImage == index }" 
                :style="{ backgroundImage: 'url(' + product.images[index].thumbnail +')' }"
                @click="activeImage = index"
                ></div>
            </div>

            <div class="product__image">
                <img :src="product.images[activeImage].image" :alt="product.name">
            </div>

        </section>

        <section class="description">

            <h4>{{ product.name.toUpperCase() }} {{ product.stock == 0 ? "😭" : "😎" }}</h4>
            <badge :product="product"></badge>

            <p class="description__status" v-if="product.stock == 3">Quedan pocas unidades</p>
            <p class="description__status" v-else-if="product.stock == 2">El producto está por terminarse</p>
            <p class="description__status" v-else-if="product.stock == 1">Última unidad disponible</p>

            <p class="description__price">$ {{ new Intl.NumberFormat("es-MX").format(product.price) }}</p>
            <p class="description__content">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo, facere quis animi, amet sequi iste ipsam rerum, necessitatibus tempora obcaecati consequatur maxime sint eos laboriosam veniam maiores voluptatem eum! Eveniet!</p>

            <div class="discount">
                <span>Código de Descuento</span>
                <input type="text" placeholder="Ingresa tu código" 
                @keyup.enter="applyDiscount($event)">
            </div>

            <button :disabled="product.stock == 0" @click="addToCart">Agregar al carrito</button>

        </section>
    `,

    props: ["product"],

    setup(props) {

        const productState = reactive({
            activeImage: 0
        });

        const { product } = props;

        function addToCart() {

            const prodIndex = cartState.cart.findIndex(prod => prod.name == product.name);

            if (prodIndex >= 0)
                cartState.cart[prodIndex].quantity += 1;
            else 
                cartState.cart.push(product);

            product.stock -= 1;

        }

        const discountCodes = ref(["PLATZI20", "RETAXMASTER"]);
        function applyDiscount(event) {

            const discountCodeIndex = discountCodes.value.indexOf(event.target.value);

            if (discountCodeIndex >= 0) {
                product.price *= 50/100;
                discountCodes.value.splice(discountCodeIndex, 1)
            }

        }

        return {

            ...toRefs(productState),

            addToCart,
            applyDiscount

        }

    }

});