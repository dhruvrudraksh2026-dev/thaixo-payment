import { addCustomerWithdrawal, editCustomerWithdrawal, getAllCustomerWithdrawals, getAllPendingCustomerWithdrawals, getCustomerWithdrawalsById } from "../api/customerWithdrawalsApi.js";
import { addDataTableRow, editDataTableRow, renderCustomerWithdrawals, resetForm } from "../dom/customerWithdrawalsDom.js";
import { checkAndExecute } from "../utils/helper.js";

let dataTable;

export const setUpCustomerWithdrawalsHandler = async () =>
{
    fetchAndViewCustomersWithdrawals();

    $(document).on("click", ".editBtn", handleEditCustomerWithdrawalBtnClick);

    $("#addModal").on("submit", handleAddCustomerWithdrawalSubmit);
    $("#editModal").on("submit", handleEditCustomerWithdrawalSubmit);
}

export const fetchAndViewCustomersWithdrawals = async () =>
{
    const response = await getAllPendingCustomerWithdrawals();

    checkAndExecute(response, () =>
    {
        const data = response.data;
        renderCustomerWithdrawals(data, $("#customer-withdrawals-table-body"));
        dataTable = $("#customer-withdrawals-table").DataTable({ "order": [[0, "desc"]] });
    });
}

export const handleEditCustomerWithdrawalBtnClick = async (e) =>
{
    e.preventDefault();
    const id = $(e.target).data("id");
    const response = await getCustomerWithdrawalsById(id);
    checkAndExecute(response, () =>
    {
        const data = response.data;
        $("#editId").val(data.id);
        $("#editCustomerId").val(data.customer_id);
        $("#editWithdrawalAmount").val(data.withdrawal_amount);
        $("#editWithdrawalMethod").val(data.withdrawal_method);
        $("#editPayoutDetails").val(JSON.stringify(data.payout_details, null, 4).replace(/ (\{|\[)$/gm, '\n$1'));
        $("#editStatus").val(data.status);
        $("#editModal").modal("show");
    });
}

const handleAddCustomerWithdrawalSubmit = async (e) =>
{
    e.preventDefault();
    const formData = new FormData(e.target);

    const response = await addCustomerWithdrawal(formData);

    checkAndExecute(response, () =>
    {
        const data = response.data;
        addDataTableRow(dataTable, data);

        resetForm("#addCustomerWithdrawalForm");
        $("#addModal").modal("hide");
    });
}

export const handleEditCustomerWithdrawalSubmit = async (e, withdrawDataTable = dataTable) =>
{
    e.preventDefault();
    const formData = new FormData(e.target);

    const response = await editCustomerWithdrawal(formData);

    checkAndExecute(response, () =>
    {
        const data = response.data;
        editDataTableRow(withdrawDataTable, data);

        resetForm("#editCustomerWithdrawalForm");
        $("#editModal").modal("hide");
    });
}