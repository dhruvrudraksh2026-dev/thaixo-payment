import { getAllCustomerPayments, getAllCustomerPaymentsTotalAmount } from "../api/customerPaymentsApi.js";
import { renderCustomerPayments, renderCustomerPaymentsTotalAmount } from "../dom/customerPaymentsDom.js";
import { checkAndExecute } from "../utils/helper.js";
let dataTable;

const fetchAndRenderCustomerPayments = () => 
{
    getAllCustomerPayments().then(response => checkAndExecute(response, () => 
    {
        renderCustomerPayments(response.data, $("#customer-payments-table-body"));
        dataTable = $("#customer-payments-table").DataTable({ order: [[0, "desc"]] });
    })
    );
};

const fetchAndRenderCustomerPaymentsTotalAmount = () => 
{
    getAllCustomerPaymentsTotalAmount().then(response => checkAndExecute(response, () => 
    {
        renderCustomerPaymentsTotalAmount(response.data, $("#customer-payments-total-amount"));
    })
    );
};

export const setupHandlers = () => 
{
    fetchAndRenderCustomerPaymentsTotalAmount();
    fetchAndRenderCustomerPayments();
};
