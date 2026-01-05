import { getCustomerById } from "../api/customerApi.js";
import { getCustomerTransactionMinutesById } from "../api/customerTransactionsApi.js";
import { renderCustomerInfo } from "../dom/customerDom.js";
import { renderCustomerTransactions } from "../dom/customerTransactionsDom.js";
import { checkAndExecute } from "../utils/helper.js";

let dataTable;

export const setupTransactionsViewHandler = () =>
{
    fetchAndViewCustomersTransactions();
}

export const fetchAndViewCustomersTransactions = async () =>
{
    const pathParts = window.location.pathname.split("/");
    const id = pathParts[pathParts.length - 1];

    const customerInfo = await getCustomerById(id);
    const transactionInfo = await getCustomerTransactionMinutesById(id);

    const data = {
        success: customerInfo.success,
        customer: customerInfo.data,
        transactions: transactionInfo.data
    }

    checkAndExecute(data, () =>
    {
        renderCustomerTransactions(data.transactions, $("#customer-transactions-table-body"));
        renderCustomerInfo(data.customer, $(".customer-details"));
        dataTable = $("#customer-transactions-table").DataTable();
    })
}