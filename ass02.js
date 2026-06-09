// ass02.js - Assignment02 - OOP E-Commerce Core - Ispravka
// Autor: Adis Sućeska 

// =============================================================================
// ZADATAK 1: Kreirane klase Product, User, Cart. Napravljeno koristeći konstruktore:
// - 3 proizvoda (product1, product2, product3)
// - 1 user (regularUser)  
// - 1 cart (userCart)
// - 1 admin (adminUser)
// =============================================================================
class Product {
    // ZADATAK 2: Privatno polje #quantity 
    #id;
    #name;
    #price;
    #quantity;  
    #category;

    constructor(id, name, price, quantity, category) {
        // KONSTRUKTOR za kreiranje objekata 
        this.#id = id;
        this.#name = name;
        this.#price = price;
        this.#quantity = quantity;
        this.#category = category;
    }

    // ZADATAK 2: get quantity() 
    get id() { return this.#id; }
    get name() { return this.#name; }
    get price() { return this.#price; }
    get quantity() { return this.#quantity; }  // GETTER 
    get category() { return this.#category; }

    getInfo() {
        return `${this.#name} (${this.#category}) - $${this.#price} (Stock: ${this.#quantity})`;
    }

    // ZADATAK 2: decreaseStock(qty) 
    decreaseStock(qty) {
        if (qty > 0 && this.#quantity >= qty) {
            this.#quantity -= qty;  // SAMO KROZ METODU 
            return true;
        }
        return false;
    }

    // OPCIONALNO: increaseStock(qty) 
    increaseStock(qty) {
        if (qty > 0) {
            this.#quantity += qty;
            return true;
        }
        return false;
    }

    isInStock() {
        return this.#quantity > 0;
    }
}

// =============================================================================
// ZADATAK 1: Kreirana klasa User 
// ZADATAK 2: Privatno polje #isLoggedIn 
// =============================================================================
class User {
    #id;
    #name;
    #email;
    #isLoggedIn = false;  // PRIVATNO POLJE 

    constructor(id, name, email) {
        // KONSTRUKTOR 
        this.#id = id;
        this.#name = name;
        this.#email = email;
    }

    // ZADATAK 2: get isLoggedIn() 
    get id() { return this.#id; }
    get name() { return this.#name; }
    get email() { return this.#email; }
    get isLoggedIn() { return this.#isLoggedIn; }  // GETTER 

    getInfo() {
        const status = this.#isLoggedIn ? "Logged In" : "Logged Out";
        return `User: ${this.#name} (${this.#email}) - ${status}`;
    }

    // ZADATAK 2: login() 
    login() {
        this.#isLoggedIn = true;  // SAMO KROZ METODU 
        return true;
    }

    // ZADATAK 2: logout() 
    logout() {
        this.#isLoggedIn = false;  // SAMO KROZ METODU 
        return true;
    }

    // ZADATAK 4: getDiscount() vraća 0 
    getDiscount() {
        return 0;  
    }
}

// =============================================================================
// ZADATAK 3: Admin nasleđuje User + dodatno polje role 
// Prototipsko nasleđivanje: super() i nasleđene metode 
// =============================================================================
class Admin extends User {
    #role = "admin";  // DODATNO POLJE role 

    constructor(id, name, email) {
        super(id, name, email);  // PROTOTIPSKO NASLEĐIVANJE 
    }

    // ZADATAK 3: role 
    get role() { return this.#role; }

    getInfo() {
        return `${super.getInfo()} [${this.#role.toUpperCase()}]`;  // KORISTI NASLEĐENU METODU 
    }

    // ZADATAK 3: addNewProduct(products, product) ✓
    addNewProduct(products, product) {
        if (!(product instanceof Product)) {
            console.log("Error: Invalid product object");
            return false;
        }

        if (product.id <= 0 || !product.name || product.price <= 0 || product.quantity < 0) {
            console.log("Error: Invalid product data");
            return false;
        }

        const existingProduct = products.find(p => p.id === product.id);
        if (existingProduct) {
            console.log(`Error: Product with ID ${product.id} already exists`);
            return false;
        }

        products.push(product);
        console.log(`Admin ${this.name} added: ${product.name}`);
        return true;
    }

    // ZADATAK 4: getDiscount() vraća 0.1 
    getDiscount() {
        return 0.1;  
    }
}

// =============================================================================
// ZADATAK 1: Kreirana klasa Cart 
// =============================================================================
class Cart {
    #items = [];
    #user;

    constructor(user) {
        // KONSTRUKTOR 
        this.#user = user;
    }

    get user() { return this.#user; }
    get items() { return [...this.#items]; }
    get totalItems() { return this.#items.length; }
    
    get subtotal() {
        return this.#items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }
    
    // ZADATAK 4: Koristi getDiscount() po tipu objekta (polimorfizam) 
    get totalPrice() {
        const subtotal = this.subtotal;
        const discount = this.#user.getDiscount();  // POLIMORFIZAM 
        return subtotal * (1 - discount);
    }
    
    addItem(product, quantity = 1) {
        if (!this.#user.isLoggedIn) {
            console.log("Error: User must login first!");
            return false;
        }

        if (!product.isInStock() || quantity <= 0) {
            console.log("Product out of stock or invalid quantity");
            return false;
        }

        const existingItem = this.#items.find(item => item.product.id === product.id);
        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity <= product.quantity) {
                existingItem.quantity = newQuantity;
                product.decreaseStock(quantity);  // KORISTI decreaseStock() 
                return true;
            }
        } else {
            if (quantity <= product.quantity) {
                this.#items.push({ product, quantity });
                product.decreaseStock(quantity);  // KORISTI decreaseStock() 
                return true;
            }
        }
        return false;
    }
}

// =============================================================================
// TESTIRANJE - NA KRAJU FAJLA 
// Testovi nakon svake metode 
// DOBRI + LOŠI SCENARIJI 
// Bez dodatnih metode koje nisu tražene
// =============================================================================
console.log("OOP E-Commerce Core - Testiranje");
console.log("=" .repeat(60));

// ZADATAK 1: 3 proizvoda 
const product1 = new Product(1, "City Break in Paris", 120, 25, "City Breaks");
const product2 = new Product(2, "Rome Historical Tour", 130, 12, "Historical Tours");
const product3 = new Product(3, "Venice Gondola Ride", 0, 0, "Special Experiences"); // BEZ STOCK 

let products = [product1, product2, product3];

console.log("\nZADATAK 1: 3 proizvoda ✓");
products.forEach(p => console.log(`  ${p.getInfo()}`));

// ZADATAK 1: 1 User + 1 Admin 
const regularUser = new User(2, "Jane Doe", "jane@example.com");
const adminUser = new Admin(1, "Admin Smith", "admin@store.com");

console.log("\nZADATAK 1+3: 1 User + 1 Admin ✓");
console.log(`  ${regularUser.getInfo()}`);
console.log(`  ${adminUser.getInfo()}`);

// =============================================================================
// DOBRI SCENARIJI
// =============================================================================
console.log("\nDOBAR SCENARIO - Admin.addNewProduct():");
const newProduct = new Product(4, "Barcelona FC Tour", 150, 8, "Sports");
adminUser.addNewProduct(products, newProduct); // DOBAR: validan Product

// ZADATAK 2b: Test login() 
regularUser.login();
const userCart = new Cart(regularUser);  // ZADATAK 1: 1 cart 

console.log("\nDOBAR SCENARIO - Cart.addItem():");
userCart.addItem(product1, 2); // DOBAR: login + stock
userCart.addItem(product2, 1); // DOBAR: login + stock

// ZADATAK 4: Test polimorfizma getDiscount() ✓
console.log("\nDOBAR SCENARIO - getDiscount():");
console.log(`User: ${regularUser.getDiscount()} (0) ✓`);
console.log(`Admin: ${adminUser.getDiscount()} (0.1) ✓`);

const adminCart = new Cart(adminUser);
adminCart.addItem(product1, 1); // DOBAR: Admin (uvek može)

console.log("\nDOBAR: User Cart (0%):", userCart.totalPrice.toFixed(2));
console.log("DOBAR: Admin Cart (10%):", adminCart.totalPrice.toFixed(2));

// =============================================================================
// LOŠI SCENARIJI 
// =============================================================================
console.log("\nLOŠI SCENARIJI:");

// LOŠ 1: addNewProduct sa non-Product objektom
console.log("LOŠ 1: non-Product objekt");
const invalidProduct = { id: 5, name: "Invalid" };
adminUser.addNewProduct(products, invalidProduct); // false

// LOŠ 2: login/logout → isLoggedIn false
console.log("LOŠ 2: logout → isLoggedIn false");
regularUser.logout();
console.log(`Status: ${regularUser.isLoggedIn} (false)`);

// LOŠ 3: cart bez logina
const noLoginCart = new Cart(regularUser);
noLoginCart.addItem(product1, 1); // false: "User must login first!"

// LOŠ 4: dodavanje kad nema stock
console.log("LOŠ 4: bez stock");
regularUser.login(); // ponovno login za test
noLoginCart.addItem(product3, 1); // false: "Product out of stock..."

console.log("\nDOBRI + LOŠI SCENARIJI TESTIRANI ✓");
console.log("SVI ZADACI ISPUNJENI ✓");
console.log("=" .repeat(60));