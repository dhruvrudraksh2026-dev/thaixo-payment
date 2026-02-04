import { getCustomerById, toggleWhiteListedById, updateGeneratedOtpById } from "../api/customerApi.js";
import { getCustomerEarningsPaidAmountById, getCustomerEarningsTotalAmountByDateRange, getCustomerEarningsTotalAmountById, getCustomerTransactionMinutesById, getCustomerTransactionsByIdAndDateRange } from "../api/customerTransactionsApi.js";
import { getCustomerWithdrawalsByCustomerId, getCustomerWithdrawalsByDateRangeByCustomerId, getCustomerWithdrawalsTotalAmountByDateRangeByCustomerId } from "../api/customerWithdrawalsApi.js";
import { renderCustomerInfo } from "../dom/customerDom.js";
import { renderCustomerOtp, renderCustomerOtpSection, renderCustomerTransactions, renderToggleWhiteListedSection, renderWhiteListedBadge, renderCoinsValue, renderTotalEarningAmount, renderTotalPaidAmount, renderTotalDateRangeEarnings, renderCustomerTransactionsFilter } from "../dom/customerTransactionsDom.js";
import { renderCustomerWithdrawals, renderCustomerWithdrawalsFilter, renderTotalDateRangeWithdrawals } from "../dom/customerWithdrawalsDom.js";
import { checkAndExecute } from "../utils/helper.js";
import { handleEditCustomerWithdrawalBtnClick, handleEditCustomerWithdrawalSubmit } from "./customerWithdrawalsHandler.js";

let dataTable;
let withdrawalDataTable;

export const setupTransactionsViewHandler = () =>
{
    fetchAndViewCustomersTransactions();
    fetchAndViewCustomersWithdrawals();

    $(document).on("click", "#generate-secure-otp-btn", handleGenerateOtp);
    $(document).on("click", "#toggle-white-listed-btn", handleToggleWhiteListedBtnClick);

    $("#dateRangeForm").on("submit", handleDateRangeSubmit);
    $("#dateRangeForm").on("reset", handleDateRangeReset);

    // =======================================================
    // For Customer Withdrawals
    // =======================================================
    $(document).on("click", ".editBtn", handleEditCustomerWithdrawalBtnClick);
    $("#editModal").on("submit", (e) => handleEditCustomerWithdrawalSubmit(e, withdrawalDataTable));
    // =======================================================

    fetchCustomerEarningsTotalAmount();
    // fetchCustomerEarningsPaidAmount();
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
        // ===========================================================
        // Rendering Customer Info From Customer Dom For Both White Listed And Non White Listed Customer
        // ===========================================================
        renderCustomerInfo(data.customer, $(".customer-details"));
        // ===========================================================
        renderCustomerOtpSection(data.customer, $("#generate-secure-otp"));
        renderToggleWhiteListedSection(data.customer, $("#toggle-white-listed"));
        dataTable = $("#customer-transactions-table").DataTable();
    });
}

export const fetchCustomerEarningsTotalAmount = async () =>
{
    const pathParts = window.location.pathname.split("/");
    const id = pathParts[pathParts.length - 1];

    const response = await getCustomerEarningsTotalAmountById(id);

    checkAndExecute(response, () =>
    {
        renderTotalEarningAmount(response.data, $("#totalEarningsAmount"));
    });
}

export const fetchCustomerEarningsPaidAmount = async () =>
{
    const pathParts = window.location.pathname.split("/");
    const id = pathParts[pathParts.length - 1];

    const response = await getCustomerEarningsPaidAmountById(id);

    checkAndExecute(response, () =>
    {
        renderTotalPaidAmount(response.data, $("#totalPaidAmount"));
    });
}

const handleDateRangeSubmit = async (e) =>
{
    e.preventDefault();

    const spinner = $("#dateRangeEarningsSpinner");
    spinner.removeClass("d-none");

    const formData = new FormData(e.target);
    const params = new URLSearchParams(formData);

    const startDate = new Date(formData.get("startDate"));
    const endDate = new Date(formData.get("endDate"));
    if (new Date(startDate) > new Date(endDate))
    {
        alert("Start Date Can't Be Greater Than End Date");
        $("#dateRangeEarningsValue").addClass("text-danger").text("₹ 0.00");
        spinner.addClass("d-none");
        return;
    }

    const pathParts = window.location.pathname.split("/");
    const id = pathParts[pathParts.length - 1];

    // =======================================================
    // For Customer Transactions
    // =======================================================
    let response = await getCustomerTransactionsByIdAndDateRange({ id, params });

    checkAndExecute(response, () =>
    {
        renderCustomerTransactionsFilter(response.data, dataTable);
    });

    response = await getCustomerEarningsTotalAmountByDateRange({ id, params });

    checkAndExecute(response, () =>
    {
        renderTotalDateRangeEarnings(response.data, $("#dateRangeEarningsResult"));
    });
    // =======================================================

    // =======================================================
    // For Customer Withdrawals
    // =======================================================
    response = await getCustomerWithdrawalsByDateRangeByCustomerId({ id, params });

    checkAndExecute(response, () =>
    {
        renderCustomerWithdrawalsFilter(response.data, withdrawalDataTable);
    });

    response = await getCustomerWithdrawalsTotalAmountByDateRangeByCustomerId({ id, params });

    checkAndExecute(response, () =>
    {
        renderTotalDateRangeWithdrawals(response.data, $("#dateRangeWithdrawalResult"));
    });
    // =======================================================

    spinner.addClass("d-none");
}

const handleDateRangeReset = () =>
{
    // Jugaad For Right Now
    location.reload();
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
        renderCoinsValue(response.data, $("#coinsText"));
        btn.removeAttr("disabled");
    }));
}

export const fetchAndViewCustomersWithdrawals = async () =>
{
    const pathParts = window.location.pathname.split("/");
    const id = pathParts[pathParts.length - 1];

    const response = await getCustomerWithdrawalsByCustomerId(id);

    checkAndExecute(response, () =>
    {
        renderCustomerWithdrawals(response.data, $("#customer-withdrawals-table-body"));
        withdrawalDataTable = $("#customer-withdrawals-table").DataTable();
    });
}