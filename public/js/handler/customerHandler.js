import { getThaiCustomers } from "../api/customerApi.js";
import { renderCustomers } from "../dom/customerDom.js";
import { checkAndExecute } from "../utils/helper.js";
let dataTable;

const fetchAndRenderThaiCustomers = () => 
{
    getThaiCustomers().then(response => checkAndExecute(response, () => 
    {
        renderCustomers(response.data, $("#customer-table-body"));
        dataTable = $("#customer-table").DataTable();
    })
    );
};

export const setupThaiHandlers = () => 
{
    fetchAndRenderThaiCustomers();
};