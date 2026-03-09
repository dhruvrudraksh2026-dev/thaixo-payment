import { addCustomerWithdrawal, editCustomerWithdrawal, getAllPendingCustomerWithdrawals, getCustomerWithdrawalsById, getTotalPendingWithdrawalsAmount, updateSelectedCustomerWithdrawalStatus } from "../api/customerWithdrawalsApi.js";
import { addDataTableRow, createKVRow, editDataTableRow, removeDataTableRow, renderCustomerWithdrawals, renderTotalPendingWithdrawalsAmount, resetForm } from "../dom/customerWithdrawalsDom.js";
import { checkAndExecute } from "../utils/helper.js";

let dataTable;

export const setUpCustomerWithdrawalsHandler = async () =>
{
    fetchAndViewCustomersWithdrawals();
    fetchCustomerWithdrawalsTotalPendingAmount();

    // For Edit Withdrawal Modal
    $(document).on("click", ".editBtn", handleEditCustomerWithdrawalBtnClick);
    $("#editModal").on("submit", handleEditCustomerWithdrawalSubmit);
    $(document).on("click", "#addEditRow", handleAddRow);
    $(document).on("click", ".remove-row", handleRemoveRow);

    // Checkbox Logic
    $(document).on("change", "#select-all", handleSelectAllCheckboxChange);
    $(document).on("change", ".row-checkbox", handleSelectIndividualCheckboxChange);

    // Edit Withdrawals Button
    $(document).on("click", "#edit-withdrawals", handleEditWithdrawalsBtnClick);
    $(document).on("submit", "#updateStatusForm", handleUpdateStatusSubmit);

}

export const fetchAndViewCustomersWithdrawals = async () =>
{
    const response = await getAllPendingCustomerWithdrawals();

    checkAndExecute(response, () =>
    {
        const data = response.data;
        renderCustomerWithdrawals(data, $("#customer-withdrawals-table-body"));

        if ($.fn.DataTable.isDataTable('#customer-withdrawals-table'))
        {
            $('#customer-withdrawals-table').DataTable().destroy();
        }

        dataTable = $("#customer-withdrawals-table").DataTable({
            order: [[1, "desc"]],
            dom: '<"top"Blf>rt<"bottom"ip><"clear">',
            pageLength: 10,
            paging: true,
            columnDefs: [
                { orderable: false, targets: 0 }
            ],
            buttons: [
                {
                    extend: 'csv',
                    exportOptions: {
                        columns: [1, 2, 3, 4, 5, 6, 7],
                        format: {
                            body: function (data, row, column)
                            {
                                // Parse the HTML string
                                var $temp = $('<div>').html(data);

                                if ($temp.find('div.mt-1').length > 0)
                                {
                                    var lines = [];
                                    $temp.find('div.mt-1').each(function ()
                                    {
                                        var label = $(this).find('span.fw-semibold').text().trim();
                                        var value = $(this).find('span:not(.fw-semibold)').text().trim();
                                        if (label || value)
                                        {
                                            lines.push(label + " " + value);
                                        }
                                    });
                                    return lines.join("\n");
                                }

                                return $temp.text().trim() || data.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
                            }
                        }
                    }
                },
                {
                    extend: 'excel',
                    exportOptions: {
                        columns: [1, 2, 3, 4, 5, 6, 7],
                        format: {
                            body: function (data, row, column)
                            {
                                // Parse the HTML string
                                var $temp = $('<div>').html(data);

                                if ($temp.find('div.mt-1').length > 0)
                                {
                                    var lines = [];
                                    $temp.find('div.mt-1').each(function ()
                                    {
                                        var label = $(this).find('span.fw-semibold').text().trim();
                                        var value = $(this).find('span:not(.fw-semibold)').text().trim();
                                        if (label || value)
                                        {
                                            lines.push(label + " " + value);
                                        }
                                    });
                                    return lines.join("\r\n");
                                }

                                return $temp.text().trim() || data.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
                            }
                        }
                    },
                }
            ]
        });
    });
}

export const fetchCustomerWithdrawalsTotalPendingAmount = async () =>
{
    const response = await getTotalPendingWithdrawalsAmount();

    checkAndExecute(response, () =>
    {
        renderTotalPendingWithdrawalsAmount(response.data, $("#totalPendingWithdrawalsAmount"));
    });
}

// For Edit Withdrawal Modal
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
        $("#editWithdrawalMethod").val(data.withdrawal_method);
        $("#editWithdrawalAmount").val(data.withdrawal_amount);
        $("#editWithdrawalStatus").val(data.status);

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
}

// For Edit Withdrawal Modal
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

        editDataTableRow(dataTable, data);

        resetForm("#editCustomerWithdrawalForm");
        $("#editModal").modal("hide");

        fetchCustomerWithdrawalsTotalPendingAmount();
    });
}

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

// For Checkboxes
const toggleEditWithdrawalsBtn = () =>
{
    const anyChecked = $(".row-checkbox:checked").length > 0;
    $("#edit-withdrawals").prop("disabled", !anyChecked);
}

const handleSelectAllCheckboxChange = (e) =>
{
    $(".row-checkbox").prop("checked", $(e.currentTarget).prop("checked"));
    toggleEditWithdrawalsBtn();
}

const handleSelectIndividualCheckboxChange = (e) =>
{
    const allChecked = $(".row-checkbox").length === $(".row-checkbox:checked").length;
    $("#select-all").prop("checked", allChecked);
    toggleEditWithdrawalsBtn();
}

const handleEditWithdrawalsBtnClick = (e) =>
{
    e.preventDefault();
    const selectedRows = $(".row-checkbox:checked");

    if (selectedRows.length === 0)
    {
        alert("Please select at least one row");
        $("#editWithdrawalsStatusModal").modal("hide");
        return;
    }
}

const handleUpdateStatusSubmit = async (e) =>
{
    e.preventDefault();
    const selectedRows = $(".row-checkbox:checked");

    if (selectedRows.length === 0)
    {
        alert("Please select at least one row");
        $("#editWithdrawalsStatusModal").modal("hide");
        return;
    }

    const ids = selectedRows.map(function ()
    {
        return $(this).val();
    }).get();

    const status = $("#editWithdrawalsStatus").val();

    const formData = new FormData();
    formData.append("ids", JSON.stringify(ids));
    formData.append("status", status);

    const response = await updateSelectedCustomerWithdrawalStatus(formData);

    checkAndExecute(response, () =>
    {
        if (status !== "PENDING")
        {
            removeDataTableRow(dataTable, ids);
        }
        $("#editWithdrawalsStatusModal").modal("hide");
        resetForm("#updateStatusForm");

        fetchCustomerWithdrawalsTotalPendingAmount();
    });

    toggleEditWithdrawalsBtn();
}
