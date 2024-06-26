import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import Customer from "../../entity/customer";
import CostumerChangeAdressEvent from "../customer-change-adress.events";

export default class GenerateLogWhenAdressIsChangeHandler
    implements EventHandlerInterface<CostumerChangeAdressEvent> {
    handle(event: CostumerChangeAdressEvent): void {
        var data = event.eventData;
        let id = data.customer.id;
        let nome = data.customer.name;
        let endereco = data.customer.Address;

        console.log(`Endereço do cliente: ${id}, ${nome} alterado para: ${endereco}`);
    }
}