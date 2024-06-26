import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CostumerCreatedEvent from "../customer-created.event";

export default class GenerateSecondLogWhenCustumerIsCreatedHandler
  implements EventHandlerInterface<CostumerCreatedEvent> {
  handle(event: CostumerCreatedEvent): void {    
    console.log(`Esse é o segundo console.log do evento: CustomerCreated .....`);
  }
}