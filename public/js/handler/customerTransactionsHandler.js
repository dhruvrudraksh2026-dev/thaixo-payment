import { getCustomerById, toggleWhiteListedById, updateGeneratedOtpById } from "../api/customerApi.js";
import { addCustomerTransaction, editCustomerTransaction, getCustomerEarningsPaidAmountById, getCustomerEarningsTotalAmountByDateRange, getCustomerEarningsTotalAmountById, getCustomerTransactionMinutesById } from "../api/customerTransactionsApi.js";
import { renderCustomerInfo } from "../dom/customerDom.js";
import { renderCustomerOtp, renderCustomerOtpSection, renderCustomerTransactions, renderToggleWhiteListedSection, renderWhiteListedBadge, renderCoinsValue, addDataTableRow, editDataTableRow, renderTotalEarningAmount, renderTotalPaidAmount, renderTotalDateRangeEarnings } from "../dom/customerTransactionsDom.js";
import { checkAndExecute } from "../utils/helper.js";

let dataTable;

export const setupTransactionsViewHandler = () =>
{
    fetchAndViewCustomersTransactions();
    $(document).on("click", "#generate-secure-otp-btn", handleGenerateOtp);
    $(document).on("click", "#toggle-white-listed-btn", handleToggleWhiteListedBtnClick);

    $(document).on("click", "#addTransactionBtn", handleAddTransactionClick);
    $(document).on("click", ".editBtn", handleEditTransactionClick);

    $("#addForm").on("submit", handleAddTransactionSubmit);
    $("#editForm").on("submit", handleEditTransactionSubmit);
    $("#dateRangeForm").on("submit", handleDateRangeSubmit);

    // fetchTotalTransactionAmount();
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
        renderCustomerInfo(data.customer, $(".customer-details"));
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

    const response = await getCustomerEarningsTotalAmountByDateRange({ id, params });

    checkAndExecute(response, () =>
    {
        renderTotalDateRangeEarnings(response.data, $("#dateRangeEarningsResult"));
    })
    spinner.addClass("d-none");
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

const handleAddTransactionClick = async (e) =>
{
    const pathParts = window.location.pathname.split("/");
    const id = pathParts[pathParts.length - 1];
    const response = await getCustomerById(id);
    const data = response.data;

    checkAndExecute(response, () =>
    {
        $("#addCustomerId").val(`${data.id}`);
        $("#addPackageId").val(`${data.earning_package_id}`);
    });
}

const handleEditTransactionClick = async (e) =>
{
    const pathParts = window.location.pathname.split("/");
    const id = pathParts[pathParts.length - 1];
    const $row = $(e.target).closest('tr');

    const response = await getCustomerById(id);
    const index = $row.find('td').eq(0).text().trim();
    const timestampValue = $row.find('td').eq(6).text().trim();
    const minutes = $row.find('td').eq(2).text().trim();
    const rate = $row.find('td').eq(3).text().trim();
    const amount = $row.find('td').eq(4).text().trim();
    const status = $row.find('td').eq(5).text().trim();
    const data = response.data;

    checkAndExecute(response, () =>
    {
        $("#editIndex").val(`${index}`);
        $("#editCustomerId").val(`${id}`);
        $("#editPackageId").val(`${data.earning_package_id}`);
        $("#editCreatedAt").val(`${timestampValue}`);
        $("#editRate").val(`${rate}`);
        $("#editMinutes").val(`${minutes}`);
        $("#editAmount").val(`${amount}`);
        $("#editStatus").val(`${status.toUpperCase()}`);
    });
}

const handleAddTransactionSubmit = async (e) =>
{
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("rate", 0);
    formData.append("minutes", 0);

    const response = await addCustomerTransaction(formData);

    checkAndExecute(response, () =>
    {
        addDataTableRow(dataTable, response.data);
        $("#addModal").modal("hide");
    });
}

const handleEditTransactionSubmit = async (e) =>
{
    e.preventDefault();
    const formData = new FormData(e.target);

    const index = formData.get("index");

    const response = await editCustomerTransaction(formData);

    checkAndExecute(response, () =>
    {
        $("#editModal").modal("hide");
        response.data.index = index;
        editDataTableRow(dataTable, response.data);
    });
}