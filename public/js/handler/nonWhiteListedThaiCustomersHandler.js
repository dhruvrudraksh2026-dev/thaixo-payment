import { getNonWhiteListedThaiCustomers } from "../api/nonWhiteListedThaiCustomersApi.js";
import { renderNonWhiteListedThaiCustomers } from "../dom/nonWhiteListedThaiCustomersDom.js";
import { checkAndExecute } from "../utils/helper.js";
let dataTable;

const fetchAndRenderNonWhiteListedThaiCustomers = () => 
{
    getNonWhiteListedThaiCustomers().then(response => checkAndExecute(response, () => 
    {
        renderNonWhiteListedThaiCustomers(response.data, $("#customer-table-body"));
        dataTable = $("#customer-table").DataTable();
    })
    );
};

export const setupNonWhiteListedThaiCustomersHandlers = () => 
{
    fetchAndRenderNonWhiteListedThaiCustomers();
};