import ProductUpload from "../modules/ProductUpload";
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
        path: "/product_upload",
        component: ProductUpload,
        name: "productUpload",
        authRequired: true,
        customProps: {
            name: "productUpload",
        }
    },
]