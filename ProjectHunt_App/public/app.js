const itemsService = new ItemsService();
const inventory = new Inventory(itemsService);

inventory.init();
