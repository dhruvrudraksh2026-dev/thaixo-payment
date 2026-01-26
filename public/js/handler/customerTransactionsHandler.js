import { getCustomerById, toggleWhiteListedById, updateGeneratedOtpById } from "../api/customerApi.js";
import { getCustomerTransactionMinutesById, getCustomerTransactionsTotalAmountById } from "../api/customerTransactionsApi.js";
import { renderCustomerInfo, renderTotalAmount } from "../dom/customerDom.js";
import { renderCustomerOtp, renderCustomerOtpSection, renderCustomerTransactions, renderToggleWhiteListedSection, renderWhiteListedBadge } from "../dom/customerTransactionsDom.js";
import { checkAndExecute } from "../utils/helper.js";

let dataTable;

export const setupTransactionsViewHandler = () =>
{
    fetchAndViewCustomersTransactions();
    $(document).on("click", "#generate-secure-otp-btn", handleGenerateOtp);
    $(document).on("click", "#toggle-white-listed-btn", handleToggleWhiteListedBtnClick);

    fetchTotalTransactionAmount();
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
        renderToggleWhiteListedSection(data.customer, $("#toggle-white-listed"));
        dataTable = $("#customer-transactions-table").DataTable();
    });
}

export const fetchTotalTransactionAmount = async () =>
{
    const pathParts = window.location.pathname.split("/");
    const id = pathParts[pathParts.length - 1];

    const response = await getCustomerTransactionsTotalAmountById(id);

    checkAndExecute(response, () =>
    {
        renderTotalAmount(response.data, $("#totalEarningsAmount"));
    });
}

const handleGenerateOtp = async (e) =>
{
    const btn = $(e.currentTarget);
    btn.blur();
    const id = $(e.currentTarget).data("id");
    updateGeneratedOtpById(id).then(response => checkAndExecute(response, () =>
    {
        renderCustomerOtp(response.data, $("#secure-otp"));
    }));
}

const handleToggleWhiteListedBtnClick = async (e) =>
{
    const btn = $(e.currentTarget);
    btn.attr("disabled", true);
    btn.blur();
    const id = $(e.currentTarget).data("id");

    const isListed = (btn.text().replace(/\s+/g, ' ').trim()) === "List" ? false : true;

    if (!confirm(`Are you sure you want to ${isListed ? "Unlist" : "List"} this Customer?`))
    {
        btn.removeAttr("disabled");
        return;
    }

    toggleWhiteListedById(id).then(response => checkAndExecute(response, () =>
    {
        renderWhiteListedBadge(response.data, $("#white-listed-badge"));
        renderToggleWhiteListedSection(response.data, $("#toggle-white-listed"));
        btn.removeAttr("disabled");
    }));
}