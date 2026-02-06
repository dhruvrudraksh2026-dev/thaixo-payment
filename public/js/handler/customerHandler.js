import { getNonWhiteListedThaiCustomers, getThaiCustomers, getWhiteListedThaiCustomers } from "../api/customerApi.js";
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

// For White Listed And Non White Listed Customers
// --------------------------
// For Non White Listed
// --------------------------
const fetchAndRenderNonWhiteListedThaiCustomers = () => 
{
    getNonWhiteListedThaiCustomers().then(response => checkAndExecute(response, () => 
    {
        renderCustomers(response.data, $("#customer-table-body"));
        dataTable = $("#customer-table").DataTable();
    })
    );
};

export const setupNonWhiteListedThaiCustomersHandlers = () => 
{
    fetchAndRenderNonWhiteListedThaiCustomers();

    // document.addEventListener("visibilitychange", () =>
    // {
    //     if (!document.hidden)
    //     {
    //         fetchAndRenderNonWhiteListedThaiCustomers();
    //     }
    // });
};

// --------------------------
// For White Listed
// --------------------------
const fetchAndRenderWhiteListedThaiCustomers = () => 
{
    getWhiteListedThaiCustomers().then(response => checkAndExecute(response, () => 
    {
        renderCustomers(response.data, $("#customer-table-body"));
        dataTable = $("#customer-table").DataTable();
    })
    );
};

export const setupWhiteListedThaiCustomersHandlers = () => 
{
    fetchAndRenderWhiteListedThaiCustomers();

    // document.addEventListener("visibilitychange", () =>
    // {
    //     if (!document.hidden)
    //     {
    //         fetchAndRenderWhiteListedThaiCustomers();
    //     }
    // });
};