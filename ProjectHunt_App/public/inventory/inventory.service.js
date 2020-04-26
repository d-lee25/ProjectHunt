/**
 * @class Inventory
 *
 * Creates a list of items and updates a list
 */

class Inventory {
  items = [];
  itemsService;

  constructor(itemsService) {
    this.itemsService = itemsService;
  }

  init() {
    this.render();
  }

  /**
   * DOM renderer for building the list row item.
   * Uses bootstrap classes with some custom overrides.
   *
   * {@link https://getbootstrap.com/docs/4.4/components/list-group/}
   * @example
   * <li class="list-group-item">
   *   <button class="btn btn-secondary" onclick="deleteItem(e, index)">X</button>
   *   <span>Item name</span>
   *   <span>pending</span>
   *   <span>date create</span>
   * </li>
   */
  _renderListRowItem = (item) => {
    const listGroupItem = document.createElement("li");
    listGroupItem.id = `item-${item.item_id}`;
    listGroupItem.className = "list-group-item";

    const deleteBtn = document.createElement("button");
    const deleteBtnTxt = document.createTextNode("X");
    deleteBtn.id = "delete-btn";
    deleteBtn.className = "btn btn-secondary";
    deleteBtn.addEventListener("click", this._deleteEventHandler(item.item_id));
    deleteBtn.appendChild(deleteBtnTxt);

    /* 
   ADD UPDATE OPTION
   const updateBtn = document.createElement("button");
    const updateBtnTxt = document.createTextNode("Edit");
    updateBtn.id = "update-btn";
    updateBtn.className = "btn btn-tri";
    updateBtn.addEventListener("click", this._updateEventHandler(item.item_id));
    updateBtn.appendChild(updateBtnTxt); */

    const itemNameSpan = document.createElement("span");
    const itemName = document.createTextNode(item.item_name);
    itemNameSpan.appendChild(itemName);

    const itemModelSpan = document.createElement("span");
    const itemModel = document.createTextNode(item.item_model);
    itemModelSpan.appendChild(itemModel);

    const itemDateSpan = document.createElement("span");
    const itemDate = document.createTextNode(item.created_date);
    itemDateSpan.append(itemDate);

    // add list item's details
    listGroupItem.append(deleteBtn);
    listGroupItem.append(itemNameSpan);
    listGroupItem.append(itemModelSpan);
    listGroupItem.append(itemDateSpan);

    return listGroupItem;
  };

  /**
   * DOM renderer for assembling the list items then mounting them to a parent node.
   */
  _renderList = () => {
    // get the "Loading..." text node from parent element
    const itemsDiv = document.getElementById("items");
    const loadingDiv = itemsDiv.childNodes[0];
    const fragment = document.createDocumentFragment();
    const ul = document.createElement("ul");
    ul.id = "items-list";
    ul.className = "list-group list-group-flush checked-list-box";

    this.items.map((item) => {
      const listGroupRowItem = this._renderListRowItem(item);

      // add entire list item
      ul.appendChild(listGroupRowItem);
    });

    fragment.appendChild(ul);
    itemsDiv.replaceChild(fragment, loadingDiv);
  };

  /**
   * DOM renderer for displaying a default message when a user has an empty list.
   */
  _renderMsg = () => {
    const itemsDiv = document.getElementById("items");
    const loadingDiv = itemsDiv.childNodes[0];
    const listParent = document.getElementById("items-list");
    const msgDiv = this._createMsgElement("Create some new items!");

    if (itemsDiv) {
      itemsDiv.replaceChild(msgDiv, loadingDiv);
    } else {
      itemsDiv.replaceChild(msgDiv, listParent);
    }
  };

  /**
   * Pure function for adding a item.
   *
   * @param {Object} newItem - form's values as an object
   */
  addItem = async (newItem) => {
    try {
      const { item_name, item_model } = newItem;
      await this.itemsService.addItem({ item_name, item_model });
      this.items.push(newItem); // push item with all it parts
    } catch (err) {
      console.log(err);
      alert("Unable to add Item. Please try again later.");
    }
  };

  /**
   * DOM Event handler helper for adding a item to the DOM.
   *
   * @param {number} itemId - id of the item to delete
   */
  _addItemEventHandler = () => {
    const itemInput = document.getElementById("formInputItemName");
    const item_name = itemInput.value;

    const modelInput = document.getElementById("formInputItemModel");
    const item_model = modelInput.value;

    // validation checks
    if (!item_name) {
      alert("Please enter a item name.");
      return;
    }

    const item = { item_name, item_model }; // assemble the new item parts
    const { newItem, newItemEl } = this._createNewItemEl(item); // add item to list

    this.addItem(newItem);

    const listParent = document.getElementById("items-list");

    if (listParent) {
      listParent.appendChild(newItemEl);
    } else {
      this._renderList();
    }
    itemInput.value = ""; // clear form text input
    modelInput.value = "";
  };

  /**
   * Create the DOM element for the new item with all its parts.
   *
   * @param {Object} item - { item_name, model_name }
   */
  _createNewItemEl = (item) => {
    const item_id = this.items.length;
    const created_date = new Date().toISOString();
    const newItem = { ...item, item_id, created_date };
    const newItemEl = this._renderListRowItem(newItem);

    return { newItem, newItemEl };
  };

  /**
   * Pure function for deleting a item.
   *
   * @param {number} itemId - id for the item to be deleted
   */
  deleteItem = async (itemId) => {
    try {
      const res = await this.itemsService.deleteItem(itemId);
      this.items = this.items.filter((item) => item.item_id !== itemId);

      if (res !== null) {
        alert("Item deleted successfully!");
      }
      return res;
    } catch (err) {
      alert("Unable to delete item. Please try again later.");
    }
  };

  /**
   * DOM Event handler helper for deleting a item from the DOM.
   * This relies on a pre-existing in the list of items.
   *
   * @param {number} itemId - id of the item to delete
   */
  _deleteEventHandler = (itemId) => () => {
    const item = document.getElementById(`item-${itemId}`);
    item.remove();

    this.deleteItem(itemId).then(() => {
      if (!this.items.length) {
        this._renderMsg();
      }
    });
  };

  /**
   * Pure function for updating a item.
   *
   * @param {number} itemId - id for the item to be deleted
   */
  /*  updateItem = async (itemId) => {
    try {
      const res = await this.itemsService.updateItem(itemId);
      this.items = this.items.filter((item) => item.item_id !== itemId);

      if (res !== null) {
        alert("Item deleted successfully!");
      }
      return res;
    } catch (err) {
      alert("Unable to delete item. Please try again later.");
    }
  }; */

  /**
   * DOM Event handler helper for deleting a item from the DOM.
   * This relies on a pre-existing in the list of items.
   *
   * @param {number} itemId - id of the item to delete
   */
  _updateEventHandler = (itemId) => () => {
    const item = document.getElementById(`item-${itemId}`);
    item.updateItem();

    this.updateItem(itemId).then(() => {
      if (!this.items.length) {
        this._renderMsg();
      }
    });
  };

  /**
   * Creates a message div block.
   *
   * @param {string} msg - custom message to display
   */
  _createMsgElement = (msg) => {
    const msgDiv = document.createElement("div");
    const text = document.createTextNode(msg);
    msgDiv.id = "user-message";
    msgDiv.className = "center";
    msgDiv.appendChild(text);

    return msgDiv;
  };

  render = async () => {
    const items = await this.itemsService.getItems();

    try {
      if (items.length) {
        this.items = items;
        this._renderList();
      } else {
        this._renderMsg();
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };
}
