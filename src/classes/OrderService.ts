import { OrderRepository } from "../interfaces/OrderRepository";
import { PaymentService } from "../interfaces/PaymentService";
import { Order } from "./Order";

export class OrderService {
  private orderRepository: OrderRepository;
  private paymentService: PaymentService;

  constructor(
    orderRepository: OrderRepository,
    paymentService: PaymentService
  ) {
    this.orderRepository = orderRepository;
    this.paymentService = paymentService;
  }

  async placeOrder(order: Order): Promise<boolean> {
    const paymentProcessed = await this.paymentService.processPayment(
      order.amount
    );
    if (paymentProcessed) {
      await this.orderRepository.save(order);
      return true;
    }
    return false;
  }

  async getOrderById(id: number): Promise<Order | null> {
    return await this.orderRepository.findById(id);
  }

  async cancelOrder(id: number): Promise<void> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }
    await this.orderRepository.delete(order);
  }

  async listAllOrders(): Promise<Order[]> {
    return await this.orderRepository.findAll();
  }
}
