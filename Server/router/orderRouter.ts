import { Router } from "express";
import { 
    createOrderBeforePayment, 
    DeleteOrder, 
    getMyOrders, 
    getOrder, 
    getOrders, 
    PayForOrder, 
    updateOrderToDelivered
} from "../controller/orderController";
import { authenticate_token } from "../middleware/Authentication/userAuthentication";
import { isAdmin } from "../middleware/Authentication/adminAuth";

const OrderRoute = Router();

OrderRoute.route("/order").post(createOrderBeforePayment);
OrderRoute.route("/payment/:orderId").post(PayForOrder);
OrderRoute.route("/getOrder").get(authenticate_token,isAdmin,getOrders);
OrderRoute.route("/getOrder/:id").get(getOrder);
OrderRoute.route("/updateToDelivered/:id").patch(updateOrderToDelivered);
OrderRoute.route("/updateToDelivered/:id").patch(updateOrderToDelivered);
OrderRoute.route("/getMyOrder/:user").get(getMyOrders);
OrderRoute.route("/deleteOrder/:orderId").delete(DeleteOrder);

export default OrderRoute;

