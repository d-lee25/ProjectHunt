const ITEMS_API = `${BASE_API_URL}/items`; // http://localhost:3000/api/inventory

class ItemsService {
  getItems = () => _get(ITEMS_API, OPTIONS_WITH_AUTH);

  addItem = (formData) => _post(ITEMS_API, formData, DEFAULT_OPTIONS_WITH_AUTH);

  deleteItem = (itemId) => _delete(`${ITEMS_API}/${itemId}`, OPTIONS_WITH_AUTH);
}
