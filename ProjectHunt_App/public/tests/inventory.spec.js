const itemsService = new ItemsService();
const item = new Inventory(itemsService);

describe("Project Hunt App", () => {
  it("should initialize some HTML", () => {
    spyOn(item, "init");
    item.init();

    expect(item.init).toHaveBeenCalled();
  });

  it("should add an item", async () => {
    const newItem = {
      item_id: 0,
      item_name: "item name test",
      item_model: "item model test",
      created_date: "2020-04-20 22:50:32",
    };
    const addItemServiceSpy = spyOn(itemsService, "addItem");

    expect(item.items.length).toBe(0);

    await todo.addItem(newItem);

    expect(addItemServiceSpy).toHaveBeenCalled();
    expect(inventory.items.length).toBe(1);
  });

  it("should delete an item", async () => {
    const existingItem = {
      item_id: 0,
      item_name: "item name test",
      item_model: "item model test",
      created_date: "2020-04-20 22:50:32",
    };
    const deleteItemServiceSpy = spyOn(itemsService, "deleteItem");

    expect(inventory.items.length).toBe(1);

    await inventory.deleteItem(existingItem.item_id);

    expect(deleteItemServiceSpy).toHaveBeenCalled();
    expect(inventory.items.length).toBe(0);
  });
});
