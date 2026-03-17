import { getCustomerById } from "../api/customerApi.js";
import { renderCustomerInfo } from "../dom/customerDom.js";

import { toggleCreatorById, updateGeneratedOtpById, getCustomerEarningsTotalAmountByDateRange, getCustomerEarningsTotalAmountById, getCustomerTransactionMinutesById, getCustomerTransactionsByIdAndDateRange } from "../api/customerTransactionsInfoAPI.js";
import { renderCustomerOtp, renderCustomerOtpSection, renderCustomerTransactions, renderToggleCreatorSection, renderCreatorBadge, renderCoinsValue, renderTotalEarningAmount, renderTotalDateRangeEarnings, renderCustomerTransactionsFilter, renderTotalPaidWithdrawals, renderTotalPendingWithdrawals, renderCustomerBreadcrumbs, renderCustomerWithdrawalsTableHeader, resetForm, createKVRow } from "../dom/customerTransactionsInfoDom.js";

import { addCustomerWithdrawal, editCustomerWithdrawal, getCustomerWithdrawalsByCustomerId, getCustomerWithdrawalsByDateRangeByCustomerId, getCustomerWithdrawalsById, getCustomerWithdrawalsTotalAmountByDateRangeByCustomerId, getTotalPaidCustomerWithdrawalsByCustomerId, getTotalPendingCustomerWithdrawalsByCustomerId } from "../api/customerWithdrawalsApi.js";
import { addDataTableRow, editDataTableRow, renderCustomerWithdrawals, renderCustomerWithdrawalsFilter, renderTotalDateRangeWithdrawals } from "../dom/customerWithdrawalsDom.js";

import { checkAndExecute } from "../utils/helper.js";

// ==========================================================================================
// Customer Transactions Info
// ==========================================================================================

let dataTable; // Transactions Table
let withdrawalDataTable; // Withdrawals Table

export const setupTransactionsViewHandler = () =>
{
    // (1.) Fetching and Rendering Customers Transactions & Withdrawals
    fetchAndViewCustomersTransactions();
    fetchAndViewCustomersWithdrawals();

    // (2.) OTP Generationg And Toggling Creator
    $(document).on("click", "#generate-secure-otp-btn", handleGenerateOtp);
    $(document).on("click", "#toggle-creator-btn", handleToggleCreatorBtnClick);

    // (3.) For Date Range
    $("#dateRangeForm").on("submit", handleDateRangeSubmit);
    $("#dateRangeForm").on("reset", handleDateRangeReset);

    // (4.) For Customer Withdrawals
    $(document).on("click", ".editBtn", handleEditCustomerWithdrawalBtnClick);
    $(document).on("click", ".addBtn", handleAddCustomerWithdrawalBtnClick);
    $("#editModal").on("submit", handleEditCustomerWithdrawalSubmit);
    $("#addModal").on("submit", handleAddCustomerWithdrawalSubmit);

    // ADD row (works for add & edit)
    $(document).on("click", "#addRow, #addEditRow", handleAddRow);

    // REMOVE row (works everywhere)
    $(document).on("click", ".remove-row", handleRemoveRow);

    // (5.) For Stats
    fetchCustomerEarningsTotalAmount();
    fetchCustomerWithdrawalsTotalPaidAmount();
    fetchCustomerWithdrawalsTotalPendingAmount();

    // Cancel Note Logic
    $(document).on("change", "#addWithdrawalStatus", function ()
    {
        if ($(this).val() === "CANCELLED")
        {
            $("#addCancelNoteContainer").removeClass("d-none");
            $("#addCancelNote").prop("required", true);
        } else
        {
            $("#addCancelNoteContainer").addClass("d-none");
            $("#addCancelNote").prop("required", false);
        }
    });

    $(document).on("change", "#editWithdrawalStatus", function ()
    {
        if ($(this).val() === "CANCELLED")
        {
            $("#editCancelNoteContainer").removeClass("d-none");
            $("#editCancelNote").prop("required", true);
        } else
        {
            $("#editCancelNoteContainer").addClass("d-none");
            $("#editCancelNote").prop("required", false);
        }
    });

    $("#addModal, #editModal").on("hidden.bs.modal", function ()
    {
        $("#addCancelNoteContainer, #editCancelNoteContainer").addClass("d-none");
        $("#addCancelNote, #editCancelNote").prop("required", false);
    });
}

// (1.) For Customer Transactions And Withdrawals
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
        // Rendering Customer Info From Customer Dom For Both Creator And Non Creator Customer
        // ===========================================================
        renderCustomerInfo(data.customer, $(".customer-details"));
        // ===========================================================
        renderCustomerOtpSection(data.customer, $("#generate-secure-otp"));
        renderToggleCreatorSection(data.customer, $("#toggle-creator"));
        renderCustomerBreadcrumbs(data.customer.is_creator, $("#breadcrumbs-section")); // For Breadcrumbs
        dataTable = $("#customer-transactions-table").DataTable();
    });
}

export const fetchAndViewCustomersWithdrawals = async () =>
{
    const pathParts = window.location.pathname.split("/");
    const id = pathParts[pathParts.length - 1];

    const response = await getCustomerWithdrawalsByCustomerId(id);
    const customerInfo = await getCustomerById(id);

    checkAndExecute(response, () =>
    {
        console.log(response.data);
        renderCustomerWithdrawals(response.data, $("#customer-withdrawals-table-body"));
        renderCustomerWithdrawalsTableHeader(customerInfo.data.is_creator, $("#customer-withdrawals-table-header"));
        withdrawalDataTable = $("#customer-withdrawals-table").DataTable({ "order": [[0, "desc"]] });
    });
}

// (5.) For Stats
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

export const fetchCustomerWithdrawalsTotalPaidAmount = async () =>
{
    const pathParts = window.location.pathname.split("/");
    const id = pathParts[pathParts.length - 1];

    const response = await getTotalPaidCustomerWithdrawalsByCustomerId(id);

    checkAndExecute(response, () =>
    {
        renderTotalPaidWithdrawals(response.data, $("#totalPaidAmount"));
    });
}

export const fetchCustomerWithdrawalsTotalPendingAmount = async () =>
{
    const pathParts = window.location.pathname.split("/");
    const id = pathParts[pathParts.length - 1];

    const response = await getTotalPendingCustomerWithdrawalsByCustomerId(id);

    checkAndExecute(response, () =>
    {
        renderTotalPendingWithdrawals(response.data, $("#totalPendingAmount"));
    });
}

// (3.) For Date Range
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
        $("#dateRangeEarningsValue").addClass("text-danger").text("฿ 0.00");
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

// (2.) For OTP Generation And Toggling Creator
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

const handleToggleCreatorBtnClick = async (e) =>
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

    toggleCreatorById(id).then(response => checkAndExecute(response, () =>
    {
        renderCreatorBadge(response.data, $("#creator-badge"));
        renderToggleCreatorSection(response.data, $("#toggle-creator"));
        renderCoinsValue(response.data, $("#coinsText"));
        btn.removeAttr("disabled");
    }));
}

// (4.) For Withdrawals
// For Adding Withdrawals
const handleAddCustomerWithdrawalBtnClick = () =>
{
    const pathParts = window.location.pathname.split("/");
    const id = pathParts[pathParts.length - 1];

    $("#addCustomerId").val(id);
}

const handleAddCustomerWithdrawalSubmit = async (e) =>
{
    e.preventDefault();
    const formData = new FormData(e.target);

    let withdrawalDetails = {};

    const keys = formData.getAll("keys[]");
    const values = formData.getAll("values[]");

    keys.forEach((key, index) =>
    {
        if (key && key.trim() !== "")
        {
            withdrawalDetails[key.trim()] = values[index];
        }
    });

    formData.append("payoutDetails", JSON.stringify([withdrawalDetails]));

    const response = await addCustomerWithdrawal(formData);

    checkAndExecute(response, () =>
    {
        const data = response.data;
        addDataTableRow(withdrawalDataTable, data);

        resetForm("#addCustomerWithdrawalForm");
        $("#addModal").modal("hide");

        // Fetching The Total Pending Withdrawals Amount Again For Updating The UI
        //====================================================
        fetchCustomerWithdrawalsTotalPendingAmount();
        fetchCustomerWithdrawalsTotalPaidAmount();
        //====================================================
    });
}

// For Editing Withdrawals
const handleEditCustomerWithdrawalBtnClick = async (e) =>
{
    e.preventDefault();

    const id = $(e.target).data("id");
    const response = await getCustomerWithdrawalsById(id);

    checkAndExecute(response, () =>
    {
        const data = response.data;

        // Filling normal fields
        $("#editWithdrawalId").val(data.id);
        $("#editWithdrawalCustomerId").val(data.customer_id);
        $("#editMethod").val(data.method);
        $("#editWithdrawalAmount").val(data.withdrawal_amount);
        $("#editWithdrawalStatus").val(data.status).trigger("change");
        $("#editCancelNote").val(data.note || "");

        // Clearing old KV rows
        const $container = $("#kv-edit-container");
        $container.empty();

        // Populating payout_details
        if (Array.isArray(data.payout_details))
        {
            data.payout_details.forEach(obj =>
            {
                Object.entries(obj).forEach(([key, value]) =>
                {
                    $container.append(createKVRow(key, value));
                });
            });
        }
        else if (typeof data.payout_details === "object")
        {
            Object.entries(data.payout_details).forEach(([key, value]) =>
            {
                $container.append(createKVRow(key, value));
            });
        }

        // Showing modal
        $("#editModal").modal("show");
    });
};

const handleEditCustomerWithdrawalSubmit = async (e) =>
{
    e.preventDefault();

    const formData = new FormData(e.target);
    const payoutDetails = {};

    // Merging dynamic key-value pairs
    const keys = formData.getAll("keys[]");
    const values = formData.getAll("values[]");

    keys.forEach((key, i) =>
    {
        if (key && key.trim())
        {
            payoutDetails[key.trim()] = values[i];
        }
    });

    formData.append("payoutDetails", JSON.stringify([payoutDetails]));

    const response = await editCustomerWithdrawal(formData);

    checkAndExecute(response, () =>
    {
        const data = response.data;

        editDataTableRow(withdrawalDataTable, data);

        resetForm("#editCustomerWithdrawalForm");
        $("#editModal").modal("hide");

        fetchCustomerWithdrawalsTotalPendingAmount();
        fetchCustomerWithdrawalsTotalPaidAmount();
    });
};

// For Adding And Removing Key-Value Pair Rows
const handleAddRow = (e) =>
{
    const btn = $(e.currentTarget);
    const target = btn.data("target");
    $(target).append(createKVRow("", ""));
}

const handleRemoveRow = (e) =>
{
    const btn = $(e.currentTarget);
    btn.closest(".kv-row").remove();
}
// ==========================================================================================