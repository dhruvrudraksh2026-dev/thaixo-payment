import { getCustomerById, toggleWhiteListedById, updateGeneratedOtpById } from "../api/customerApi.js";
import { getCustomerEarningsTotalAmountByDateRange, getCustomerEarningsTotalAmountById, getCustomerTransactionMinutesById, getCustomerTransactionsByIdAndDateRange } from "../api/customerTransactionsApi.js";
import { addCustomerWithdrawal, editCustomerWithdrawal, getCustomerWithdrawalsByCustomerId, getCustomerWithdrawalsByDateRangeByCustomerId, getCustomerWithdrawalsById, getCustomerWithdrawalsTotalAmountByDateRangeByCustomerId, getTotalPaidCustomerWithdrawalsByCustomerId, getTotalPendingCustomerWithdrawalsByCustomerId } from "../api/customerWithdrawalsApi.js";
import { renderCustomerBreadcrumbs, renderCustomerInfo } from "../dom/customerDom.js";
import { renderCustomerOtp, renderCustomerOtpSection, renderCustomerTransactions, renderToggleWhiteListedSection, renderWhiteListedBadge, renderCoinsValue, renderTotalEarningAmount, renderTotalDateRangeEarnings, renderCustomerTransactionsFilter, renderTotalPaidWithdrawals, renderTotalPendingWithdrawals } from "../dom/customerTransactionsDom.js";
import { addDataTableRow, editDataTableRow, renderCustomerWithdrawals, renderCustomerWithdrawalsFilter, renderTotalDateRangeWithdrawals, resetForm } from "../dom/customerWithdrawalsDom.js";
import { checkAndExecute } from "../utils/helper.js";

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
    $(document).on("click", ".addBtn", handleAddCustomerWithdrawalBtnClick);
    $("#editModal").on("submit", handleEditCustomerWithdrawalSubmit);
    $("#addModal").on("submit", handleAddCustomerWithdrawalSubmit);
    // =======================================================

    fetchCustomerEarningsTotalAmount();
    fetchCustomerWithdrawalsTotalPaidAmount();
    fetchCustomerWithdrawalsTotalPendingAmount();
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
        renderCustomerBreadcrumbs(data.customer.white_listed, $("#breadcrumbs-section")); // For Breadcrumbs
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


// ======================================================
// For Withdrawals
// ======================================================
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

    formData.append("payoutDetails", JSON.stringify(withdrawalDetails));

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

        // 1️⃣ Fill normal fields
        $("#editId").val(data.id);
        $("#editCustomerId").val(data.customer_id);
        $("#editWithdrawalMethod").val(data.withdrawal_method);
        $("#editWithdrawalAmount").val(data.withdrawal_amount);
        $("#editStatus").val(data.status);

        // 2️⃣ Clear old KV rows
        const $container = $("#kv-edit-container");
        $container.empty();

        // 3️⃣ Populate payout_details
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

        // 4️⃣ If empty, add one blank row
        if ($container.children().length === 0)
        {
            $container.append(createKVRow());
        }

        // 5️⃣ Show modal
        $("#editModal").modal("show");
    });
};

function createKVRow(key = "", value = "")
{
    return `
      <div class="row g-2 align-items-center kv-row mb-2">
        <div class="col-md-5">
          <input type="text" name="keys[]" class="form-control" value="${key}" required>
        </div>
        <div class="col-md-5">
          <input type="text" name="values[]" class="form-control" value="${value}" required>
        </div>
        <div class="col-md-2 text-end">
          <button type="button" class="btn btn-danger btn-sm remove-row">✖</button>
        </div>
      </div>
    `;
}

const handleEditCustomerWithdrawalSubmit = async (e) =>
{
    e.preventDefault();

    const formData = new FormData(e.target);
    const payoutDetails = {};

    // 2️⃣ Merge dynamic key–value pairs
    const keys = formData.getAll("keys[]");
    const values = formData.getAll("values[]");

    keys.forEach((key, i) =>
    {
        if (key && key.trim())
        {
            payoutDetails[key.trim()] = values[i];
        }
    });

    formData.append("payoutDetails", JSON.stringify(payoutDetails));

    // 3️⃣ Send JSON to API
    const response = await editCustomerWithdrawal(formData);

    checkAndExecute(response, () =>
    {
        const data = response.data;

        editDataTableRow(withdrawalDataTable, data);

        resetForm("#editCustomerWithdrawalForm");
        $("#editModal").modal("hide");

        fetchCustomerWithdrawalsTotalPendingAmount();
    });
};