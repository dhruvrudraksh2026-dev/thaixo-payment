import { getNonCreatorThaiCustomers, getThaiCustomers, getCreatorThaiCustomers } from "../api/customerApi.js";
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

// For Creator And Non Creator Customers
// --------------------------
// For Non Creator
// --------------------------
const fetchAndRenderNonCreatorThaiCustomers = () => 
{
    getNonCreatorThaiCustomers().then(response => checkAndExecute(response, () => 
    {
        renderCustomers(response.data, $("#customer-table-body"));
        dataTable = $("#customer-table").DataTable();
    })
    );
};

export const setupNonCreatorThaiCustomersHandlers = () => 
{
    fetchAndRenderNonCreatorThaiCustomers();

    $(window).on("pageshow", function (event)
    {
        if (event.originalEvent.persisted)
        {
            window.location.reload();
        }
    });
};

// --------------------------
// For Creator
// --------------------------
const fetchAndRenderCreatorThaiCustomers = () => 
{
    getCreatorThaiCustomers().then(response => checkAndExecute(response, () => 
    {
        renderCustomers(response.data, $("#customer-table-body"));
        dataTable = $("#customer-table").DataTable();
    })
    );
};

export const setupCreatorThaiCustomersHandlers = () => 
{
    fetchAndRenderCreatorThaiCustomers();

    $(window).on("pageshow", function (event)
    {
        if (event.originalEvent.persisted)
        {
            window.location.reload();
        }
    });
};