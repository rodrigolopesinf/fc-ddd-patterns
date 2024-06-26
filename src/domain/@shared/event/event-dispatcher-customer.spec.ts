import Customer from "../../customer/entity/customer";
import CostumerChangeAdressEvent from "../../customer/event/customer-change-adress.events";
import CostumerCreatedEvent from "../../customer/event/customer-created.event";
import GenerateFirstLogWhenCustumerIsCreatedHandler from "../../customer/event/handler/generate-first-log-when-customer-created";
import GenerateLogWhenAdressIsChangeHandler from "../../customer/event/handler/generate-log-when-adress-changed-created";
import GenerateSecondLogWhenCustumerIsCreatedHandler from "../../customer/event/handler/generate-second-log-when-customer-created";
import Address from "../../customer/value-object/address";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new GenerateFirstLogWhenCustumerIsCreatedHandler();
    const eventHandler2 = new GenerateSecondLogWhenCustumerIsCreatedHandler();

    eventDispatcher.register("CostumerCreatedEvent", eventHandler1);
    eventDispatcher.register("CostumerCreatedEvent", eventHandler2);

    expect(
      eventDispatcher.getEventHandlers["CostumerCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CostumerCreatedEvent"].length).toBe(
      2
    );
    expect(
      eventDispatcher.getEventHandlers["CostumerCreatedEvent"][0]
    ).toMatchObject(eventHandler1);
    expect(
      eventDispatcher.getEventHandlers["CostumerCreatedEvent"][1]
    ).toMatchObject(eventHandler2);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new GenerateFirstLogWhenCustumerIsCreatedHandler();
    const eventHandler2 = new GenerateSecondLogWhenCustumerIsCreatedHandler();

    eventDispatcher.register("CostumerCreatedEvent", eventHandler1);
    eventDispatcher.register("CostumerCreatedEvent", eventHandler2);

    expect(
      eventDispatcher.getEventHandlers["CostumerCreatedEvent"][0]
    ).toMatchObject(eventHandler1);

    expect(
      eventDispatcher.getEventHandlers["CostumerCreatedEvent"][0]
    ).toMatchObject(eventHandler2);

    eventDispatcher.unregister("CostumerCreatedEvent", eventHandler1);
    eventDispatcher.unregister("CostumerCreatedEvent", eventHandler2);

    expect(
      eventDispatcher.getEventHandlers["CostumerCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CostumerCreatedEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new GenerateFirstLogWhenCustumerIsCreatedHandler();
    const eventHandler2 = new GenerateSecondLogWhenCustumerIsCreatedHandler();

    eventDispatcher.register("CostumerCreatedEvent", eventHandler1);
    eventDispatcher.register("CostumerCreatedEvent", eventHandler2);

    expect(
      eventDispatcher.getEventHandlers["CostumerCreatedEvent"][0]
    ).toMatchObject(eventHandler1);

    expect(
      eventDispatcher.getEventHandlers["CostumerCreatedEvent"][1]
    ).toMatchObject(eventHandler2);


    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["CostumerCreatedEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new GenerateFirstLogWhenCustumerIsCreatedHandler();
    const eventHandler2 = new GenerateSecondLogWhenCustumerIsCreatedHandler();
    const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

    eventDispatcher.register("CostumerCreatedEvent", eventHandler1);
    eventDispatcher.register("CostumerCreatedEvent", eventHandler2);

    expect(
      eventDispatcher.getEventHandlers["CostumerCreatedEvent"][0]
    ).toMatchObject(eventHandler1);

    expect(
      eventDispatcher.getEventHandlers["CostumerCreatedEvent"][1]
    ).toMatchObject(eventHandler2);


    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 123, "13330-250", "São Paulo");
    customer.Address = address;
    customer.activate();

    const customerCreatedEvent = new CostumerCreatedEvent({
      customer
    });

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
  });


  it("should notify custumer change adress handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new GenerateFirstLogWhenCustumerIsCreatedHandler();
    const eventHandler2 = new GenerateSecondLogWhenCustumerIsCreatedHandler();
    const eventHandler3 = new GenerateLogWhenAdressIsChangeHandler();
    const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");
    const spyEventHandler3 = jest.spyOn(eventHandler3, "handle");

    eventDispatcher.register("CostumerCreatedEvent", eventHandler1);
    eventDispatcher.register("CostumerCreatedEvent", eventHandler2);
    eventDispatcher.register("CostumerChangeAdressEvent", eventHandler3);

    expect(
      eventDispatcher.getEventHandlers["CostumerCreatedEvent"][0]
    ).toMatchObject(eventHandler1);

    expect(
      eventDispatcher.getEventHandlers["CostumerCreatedEvent"][1]
    ).toMatchObject(eventHandler2);

    expect(
      eventDispatcher.getEventHandlers["CostumerChangeAdressEvent"][0]
    ).toMatchObject(eventHandler3);

    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 123, "13330-250", "São Paulo");
    customer.Address = address;
    customer.activate();

    const customerCreatedEvent = new CostumerCreatedEvent({
      customer
    });

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();

    const addressChange = new Address("Street 2", 456, "13330-250", "São Paulo");

    customer.changeAddress(addressChange);

    const ostumerChangeAdressEvent = new CostumerChangeAdressEvent({
      customer
    });

    eventDispatcher.notify(ostumerChangeAdressEvent);
    expect(spyEventHandler3).toHaveBeenCalled();
  });
});
