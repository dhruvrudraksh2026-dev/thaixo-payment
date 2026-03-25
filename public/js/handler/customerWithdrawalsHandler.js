import { editCustomerWithdrawal, getAllCustomerWithdrawalsByDateRange, getAllCustomerWithdrawalsTotalAmountByDateRange, getAllPendingCustomerWithdrawals, getCustomerWithdrawalsById, getTotalPendingWithdrawalsAmount, updateSelectedCustomerWithdrawalStatus } from "../api/customerWithdrawalsApi.js";
import { createKVRow, editDataTableRow, editDataTableRowStatus, removeDataTableRow, renderCustomerWithdrawals, renderCustomerWithdrawalsFilter, renderTotalAllWithdrawalsAmount, renderTotalPendingWithdrawalsAmount, resetForm } from "../dom/customerWithdrawalsDom.js";
import { checkAndExecute } from "../utils/helper.js";

let dataTable;

export const setUpPendingCustomerWithdrawalsHandler = async () =>
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

export const fetchAndViewCustomersWithdrawals = async () =>
{
    const response = await getAllPendingCustomerWithdrawals();

    checkAndExecute(response, () =>
    {
        const data = response.data;
        // console.log(data);
        renderCustomerWithdrawals(data, $("#customer-withdrawals-table-body"));

        if ($.fn.DataTable.isDataTable('#customer-withdrawals-table'))
        {
            $('#customer-withdrawals-table').DataTable().destroy();
        }

        dataTable = $("#customer-withdrawals-table").DataTable({
            order: [[1, "desc"]],
            dom: '<"top"Blf>rt<"bottom"ip><"clear">',
            pageLength: 10,
            paging: false,
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

                // Total over all pages (Filtered)
                var total = api
                    .column(4, { search: 'applied' })
                    .data()
                    .reduce(function (a, b)
                    {
                        return intVal(a) + intVal(b);
                    }, 0);

                $(api.column(4).footer()).html(
                    total.toLocaleString('en-US', { minimumFractionDigits: 2 })
                );
            },
            // initComplete: function ()
            // {
            //     this.api().columns().every(function ()
            //     {
            //         var column = this;
            //         if (column.index() === 3)
            //         {
            //             var $container = $('<div class="filter-wrapper mt-1"></div>').appendTo($(column.header()));

            //             var select = $('<select class="form-select form-select-sm"><option value="">All Methods</option></select>')
            //                 .appendTo($container)
            //                 .on('click', function (e)
            //                 {
            //                     e.stopPropagation();
            //                 })
            //                 .on('change', function ()
            //                 {
            //                     var val = $.fn.dataTable.util.escapeRegex($(this).val());
            //                     column.search(val ? '^' + val + '$' : '', true, false).draw();
            //                 });

            //             column.data().unique().sort().each(function (d, j)
            //             {
            //                 var cleanText = d.replace(/<[^>]*>/g, "").trim();
            //                 if (cleanText)
            //                 {
            //                     select.append('<option value="' + cleanText + '">' + cleanText + '</option>');
            //                 }
            //             });
            //         }
            //     });
            // }
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

// For Edit Withdrawal Modal
const handleEditCustomerWithdrawalSubmit = async (e) =>
{
    e.preventDefault();
    const path = window.location.pathname;

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

        // if (path !== "/customer-withdrawals")
        // {
        editDataTableRow(dataTable, data);
        // }

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
    const path = window.location.pathname;
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
        if (status !== "PENDING" && path === "/pending-customer-withdrawals")
        {
            removeDataTableRow(dataTable, ids);
        } else
        {
            editDataTableRowStatus(dataTable, ids, status);
        }
        $("#editWithdrawalsStatusModal").modal("hide");
        resetForm("#updateStatusForm");
        $(".row-checkbox").prop("checked", false);
        $("#select-all").prop("checked", false);
        fetchCustomerWithdrawalsTotalPendingAmount();
    });

    toggleEditWithdrawalsBtn();
}

// =========================================================================================
// For All Customer Withdrawals Page
// =========================================================================================
// Setup Handler
export const setUpAllCustomerWithdrawalsHandler = async () =>
{
    fetchAndViewLastMonthAllCustomersWithdrawals();
    fetchAllCustomerWithdrawalsTotalAmount();

    // Date Range Logic
    $("#dateRangeForm").on("submit", handleDateRangeSubmit);
    $("#dateRangeForm").on("reset", handleDateRangeReset);

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

// Initially Showing Last Months All Withdrawals
export const fetchAndViewLastMonthAllCustomersWithdrawals = async () =>
{
    // Fetching Last Months Start Date and End Date From current date
    const formData = new FormData();

    const currentDate = new Date();
    const lastMonthEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    const lastMonthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    formData.append("startDate", lastMonthStartDate.toISOString().split("T")[0]);
    formData.append("endDate", lastMonthEndDate.toISOString().split("T")[0]);

    const params = new URLSearchParams(formData);

    const response = await getAllCustomerWithdrawalsByDateRange({ params });

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
            paging: false, // Removes Pagination
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

                // Total over all pages (Filtered)
                var total = api
                    .column(4, { search: 'applied' })
                    .data()
                    .reduce(function (a, b)
                    {
                        return intVal(a) + intVal(b);
                    }, 0);

                $(api.column(4).footer()).html(
                    total.toLocaleString('en-US', { minimumFractionDigits: 2 })
                );
            },
            initComplete: function ()
            {
                this.api().columns().every(function ()
                {
                    var column = this;
                    if (column.index() === 3)
                    {
                        var $container = $('<div class="filter-wrapper mt-1"></div>').appendTo($(column.header()));

                        var select = $('<select class="form-select form-select-sm"><option value="">All Methods</option></select>')
                            .appendTo($container)
                            .on('click', function (e)
                            {
                                e.stopPropagation();
                            })
                            .on('change', function ()
                            {
                                var val = $.fn.dataTable.util.escapeRegex($(this).val());
                                column.search(val ? '^' + val + '$' : '', true, false).draw();
                            });

                        column.data().unique().sort().each(function (d, j)
                        {
                            var cleanText = d.replace(/<[^>]*>/g, "").trim();
                            if (cleanText)
                            {
                                select.append('<option value="' + cleanText + '">' + cleanText + '</option>');
                            }
                        });
                    }
                });
            }
        });
    });
}

// Initially Showing Last Months All Withdrawals Total
export const fetchAllCustomerWithdrawalsTotalAmount = async () =>
{
    // Fetching Last Months Start Date and End Date From current date
    const formData = new FormData();

    const currentDate = new Date();
    const lastMonthEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    const lastMonthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    formData.append("startDate", lastMonthStartDate.toISOString().split("T")[0]);
    formData.append("endDate", lastMonthEndDate.toISOString().split("T")[0]);

    const params = new URLSearchParams(formData);
    const response = await getAllCustomerWithdrawalsTotalAmountByDateRange({ params });

    checkAndExecute(response, () =>
    {
        renderTotalAllWithdrawalsAmount(response.data, $("#totalAllWithdrawalsAmount"));
    });
}

// Handling Date Range Filter
const handleDateRangeSubmit = async (e) =>
{
    e.preventDefault();

    const spinner = $("#dateRangeWithdrawalSpinner");
    spinner.removeClass("d-none");

    const formData = new FormData(e.target);

    const startDate = new Date(formData.get("startDate"));
    const endDate = new Date(formData.get("endDate"));
    if (new Date(startDate) > new Date(endDate))
    {
        alert("Start Date Can't Be Greater Than End Date");
        $("#dateRangeEarningsValue").addClass("text-danger").text("฿ 0.00");
        spinner.addClass("d-none");
        return;
    }

    const params = new URLSearchParams(formData);
    // =======================================================
    // For Customer Withdrawals
    // =======================================================
    let response = await getAllCustomerWithdrawalsByDateRange({ params });

    checkAndExecute(response, () =>
    {
        renderCustomerWithdrawalsFilter(response.data, dataTable);
    });

    response = await getAllCustomerWithdrawalsTotalAmountByDateRange({ params });

    checkAndExecute(response, () =>
    {
        renderTotalAllWithdrawalsAmount(response.data, $("#totalAllWithdrawalsAmount"));
    });
    // =======================================================

    spinner.addClass("d-none");
}

const handleDateRangeReset = () =>
{
    location.reload();
}