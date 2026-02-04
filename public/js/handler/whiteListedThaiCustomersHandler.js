import { getWhiteListedThaiCustomers } from "../api/whiteListedThaiCustomersApi.js";
import { renderWhiteListedThaiCustomers } from "../dom/whiteListedThaiCustomersDom.js";
import { checkAndExecute } from "../utils/helper.js";
let dataTable;

const fetchAndRenderWhiteListedThaiCustomers = () => 
{
    getWhiteListedThaiCustomers().then(response => checkAndExecute(response, () => 
    {
        renderWhiteListedThaiCustomers(response.data, $("#customer-table-body"));
        dataTable = $("#customer-table").DataTable();
    })
    );
};

export const setupWhiteListedThaiCustomersHandlers = () => 
{
    fetchAndRenderWhiteListedThaiCustomers();
};