import { getAllAgency, addAgency, getAgencyById, updateAgencyById } from "../api/agencyApi.js";
import { getAgencyCustomers } from "../api/customerAgencyApi.js";
import { getAllPendingAgencyCustomerWithdrawals, getCustomerWithdrawalsById, editCustomerWithdrawal, updateSelectedCustomerWithdrawalStatus } from "../api/customerWithdrawalsApi.js";
import { renderAgencies, addAgencyTableRow, editDataTableRow, renderAgencyInfo, renderAgencyCustomers } from "../dom/agencyDom.js";
import { renderCustomerWithdrawals, createKVRow, resetForm, editDataTableRowStatus, editDataTableRow as editWithdrawalDataTableRow } from "../dom/customerWithdrawalsDom.js";
import { checkAndExecute } from "../utils/helper.js";

let dataTable;
let agencyCustomersDataTable;
let withdrawalDataTable;
let customerLightbox = null;

export function initCustomerLightbox()
{
    if (customerLightbox)
    {
        customerLightbox.destroy();
    }

    customerLightbox = GLightbox({
        selector: '.glightbox-customer',
        touchNavigation: true,
        // loop: true,
        zoomable: true,
        draggable: true,
        closeButton: true
    });
}

export const setupAgencyHandlers = () => 
{
    fetchAndRenderAgencies();

    // Bind event listeners
    $("#addAgencyForm").on("submit", handleAddAgencySubmit);
    $("#editAgencyForm").on("submit", handleEditAgencySubmit);
    $(document).on("click", ".editBtn", handleEditAgencyBtnClick);
};

const fetchAndRenderAgencies = () => 
{
    getAllAgency().then(response => checkAndExecute(response, () => 
    {
        renderAgencies(response.data, $("#agency-table-body"));
        dataTable = $("#agency-table").DataTable(
            {
                order: [[0, 'desc']],
                responsive: true
            });
    })
    );
};

const handleAddAgencySubmit = (e) =>
{
    e.preventDefault();
    const formData = new FormData(e.target);

    // Status handles from checkbox
    formData.set("status", $("#addStatus").is(":checked") ? 1 : 0);

    addAgency(formData).then(response => checkAndExecute(response, () =>
    {
        $("#addModal").modal("hide");
        e.target.reset();
        addAgencyTableRow(dataTable, response.data);
    }));
}

const handleEditAgencyBtnClick = (e) =>
{
    const id = $(e.currentTarget).data("id");

    getAgencyById(id).then(response => checkAndExecute(response, () =>
    {
        const data = response.data;

        $("#editAgencyId").val(data.id);
        $("#editName").val(data.name);
        $("#editOwnerName").val(data.owner_name);
        $("#editAgencyPhotoPreview").attr("src", data.photo_id);
        $("#editBankName").val(data.bank_name);
        $("#editBankAccountNumber").val(data.bank_account_number);
        $("#editStatus").prop("checked", data.status == 1);

        $("#editModal").modal("show");
    }));
}

const handleEditAgencySubmit = (e) =>
{
    e.preventDefault();
    const formData = new FormData(e.target);

    formData.set("status", $("#editStatus").is(":checked") ? 1 : 0);

    updateAgencyById(formData).then(response => checkAndExecute(response, () =>
    {
        $("#editModal").modal("hide");
        editDataTableRow(dataTable, response.data);
    }));
}

// ==================================================================================================
// For Agency Info
// ==================================================================================================
export const setupAgencyInfoHandlers = () =>
{
    fetchAndViewAgencies();
    fetchAndRenderAgencyCustomers();
    fetchAndViewAgencyCustomerWithdrawals();

    // Checkbox Logic
    $(document).on("change", "#select-all", handleSelectAllCheckboxChange);
    $(document).on("change", ".row-checkbox", handleSelectIndividualCheckboxChange);

    // Bulk Edit Withdrawals Button
    $(document).on("click", "#edit-withdrawals", handleEditWithdrawalsBtnClick);
    $(document).on("submit", "#updateStatusForm", handleUpdateStatusSubmit);

    // For Edit Withdrawal Modal
    $(document).on("click", ".editBtn", handleEditCustomerWithdrawalBtnClick);
    $("#editModal").on("submit", handleEditCustomerWithdrawalSubmit);
    $(document).on("click", "#addEditRow", handleAddRow);
    $(document).on("click", ".remove-row", handleRemoveRow);

    // Cancel Note Logic
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

    $(document).on("change", "#editWithdrawalsStatus", function ()
    {
        if ($(this).val() === "CANCELLED")
        {
            $("#editBulkCancelNoteContainer").removeClass("d-none");
            $("#editBulkCancelNote").prop("required", true);
        } else
        {
            $("#editBulkCancelNoteContainer").addClass("d-none");
            $("#editBulkCancelNote").prop("required", false);
        }
    });

    $("#editModal, #editWithdrawalsStatusModal").on("hidden.bs.modal", function ()
    {
        $("#editCancelNoteContainer, #editBulkCancelNoteContainer").addClass("d-none");
        $("#editCancelNote, #editBulkCancelNote").prop("required", false);
    });
}

export const fetchAndViewAgencies = async () =>
{
    const pathParts = window.location.pathname.split("/");
    const id = pathParts[pathParts.length - 1];

    const response = await getAgencyById(id);
    checkAndExecute(response, () =>
    {
        const tableBody = $(".agency-detail");
        renderAgencyInfo(response.data, tableBody);
        initCustomerLightbox();
    });
}

export const fetchAndRenderAgencyCustomers = async () =>
{
    const pathParts = window.location.pathname.split("/");
    const id = pathParts[pathParts.length - 1];

    const response = await getAgencyCustomers(id);
    checkAndExecute(response, () =>
    {
        const tableBody = $("#agency-customer-table-body");
        renderAgencyCustomers(response.data, tableBody);
        agencyCustomersDataTable = $("#agency-customer-table").DataTable(
            {
                order: [[0, 'desc']],
                responsive: true
            });
    });
}
// ==================================================================================================

// For Agency Related Customer Withdrawals
export const fetchAndViewAgencyCustomerWithdrawals = async () =>
{
    const pathParts = window.location.pathname.split("/");
    const id = pathParts[pathParts.length - 1];

    const response = await getAllPendingAgencyCustomerWithdrawals(id);
    const agencyInfo = await getAgencyById(id);

    checkAndExecute(response, () =>
    {
        renderCustomerWithdrawals(response.data, $("#customer-withdrawals-table-body"));
        withdrawalDataTable = $("#customer-withdrawals-table").DataTable({
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
                    footer: true,
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
                    footer: true,
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
            ],
            footerCallback: function (row, data, start, end, display)
            {
                var api = this.api();
                var intVal = function (i)
                {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '') * 1 :
                        typeof i === 'number' ? i : 0;
                };

                // Total over all pages
                var total = api
                    .column(4)
                    .data()
                    .reduce(function (a, b)
                    {
                        return intVal(a) + intVal(b);
                    }, 0);

                $(api.column(4).footer()).html(
                    total.toLocaleString('en-US', { minimumFractionDigits: 2 })
                );
            }
        });
    });
}

// ==================================================================================================
// For Individual Edit Withdrawals
// ==================================================================================================
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
        else if (typeof data.payout_details === "object" && data.payout_details !== null)
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

    formData.append("payoutDetails", JSON.stringify(payoutDetails));

    const response = await editCustomerWithdrawal(formData);

    checkAndExecute(response, () =>
    {
        const data = response.data;

        editWithdrawalDataTableRow(withdrawalDataTable, data);

        resetForm("#editCustomerWithdrawalForm");
        $("#editModal").modal("hide");
    });
}

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

// ==================================================================================================
// For Bulk Updating Withdrawals Statuses
// ==================================================================================================
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

    if (status === "CANCELLED")
    {
        formData.append("note", $("#editBulkCancelNote").val());
    } else if (status === "DONE")
    {
        formData.append("note", "Customer Withdrawal Done");
    } else
    {
        formData.append("note", "Customer Withdrawal Pending");
    }

    const response = await updateSelectedCustomerWithdrawalStatus(formData);

    checkAndExecute(response, () =>
    {
        editDataTableRowStatus(withdrawalDataTable, ids, status);
        
        $("#editWithdrawalsStatusModal").modal("hide");
        resetForm("#updateStatusForm");
        $(".row-checkbox").prop("checked", false);
        $("#select-all").prop("checked", false);
    });

    toggleEditWithdrawalsBtn();
}