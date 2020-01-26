import AddProduct from "../modules/AddProduct";
import UpdateProduct from "../modules/UpdateProduct";
import Login from "../modules/Login";

export const routes = [
    {
        path: "/",
        component: Login,
        name: "mainPage",
        authRequired: false,
        customProps: {
            name: "mainPage",
        }
    },
    {
        path: "/login",
        component: Login,
        name: "login",
        authRequired: false,
        customProps: {
            name: "login",
        }
    },
    {
        path: "/add_product",
        component: AddProduct,
        name: "addProduct",
        authRequired: true,
        customProps: {
            name: "addProduct",
        }
    },
    {
        path: "/update_product",
        component: UpdateProduct,
        name: "updateProduct",
        authRequired: true,
        customProps: {
            name: "updateProduct",
        }
    },
]