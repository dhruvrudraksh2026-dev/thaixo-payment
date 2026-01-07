import { getCustomerById, updateGeneratedOtpById } from "../api/customerApi.js";
import { getCustomerTransactionMinutesById } from "../api/customerTransactionsApi.js";
import { renderCustomerInfo } from "../dom/customerDom.js";
import { renderCustomerOtp, renderCustomerOtpSection, renderCustomerTransactions } from "../dom/customerTransactionsDom.js";
import { checkAndExecute } from "../utils/helper.js";

let dataTable;

export const setupTransactionsViewHandler = () =>
{
    fetchAndViewCustomersTransactions();
    $(document).on("click", "#generate-secure-otp-btn", handleGenerateOtp);
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
        renderCustomerOtpSection(data.customer, $("#generate-secure-otp"));
        dataTable = $("#customer-transactions-table").DataTable();
    })
}

const handleGenerateOtp = async (e) =>
{
    const btn = $(e.currentTarget);
    btn.blur();
    const id = $(e.currentTarget).data("id");
    updateGeneratedOtpById(id).then(response => checkAndExecute(response, () =>
    {
        console.log(response);
        renderCustomerOtp(response.data, $("#secure-otp"));
    }));
}