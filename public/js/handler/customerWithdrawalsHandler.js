import { editCustomerWithdrawal, getAllCustomerWithdrawalsByDateRange, getAllCustomerWithdrawalsTotalAmountByDateRange, getAllPendingCustomerWithdrawals, getCustomerWithdrawalsById, getTotalPendingWithdrawalsAmount, updateSelectedCustomerWithdrawalStatus } from "../api/customerWithdrawalsApi.js";
import { createKVRow, editDataTableRow, editDataTableRowStatus, removeDataTableRow, renderCustomerWithdrawals, renderCustomerWithdrawalsFilter, renderTotalAllWithdrawalsAmount, renderTotalPendingWithdrawalsAmount, resetForm } from "../dom/customerWithdrawalsDom.js";
import { checkAndExecute, formatExportData, MONTHS } from "../utils/helper.js";

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
            autoWidth: true,
            columnDefs: [{ orderable: false, targets: 0 }],
            buttons: [
                {
                    extend: 'excel',
                    title: 'Pending Customers Withdrawal Report - ' + new Date().toLocaleString("en-CA", { month: 'long', year: 'numeric' }),
                    filename: `Pending_Customers_Withdrawal_Report_${new Date().toLocaleDateString('en-CA')}`,
                    footer: true,
                    messageTop: `Generated on: ${new Date().toLocaleString()}`,
                    exportOptions: {
                        columns: [1, 2, 3, 4, 5, 6, 7],
                        format: {
                            header: function (data)
                            {
                                return data.replace(/<[^>]*>/g, '').trim();
                            },
                            body: function (data, row, column)
                            {
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
                                return $temp.text().trim();
                            }
                        }
                    },
                    customize: function (xlsx)
                    {

                        var sheet = xlsx.xl.worksheets['sheet1.xml'];

                        var rows = $('row', sheet);

                        /* -------------------------
                           COLUMN WIDTH
                        -------------------------- */
                        var cols = $('col', sheet);
                        cols.eq(0).attr('width', 20);
                        cols.eq(1).attr('width', 25);
                        cols.eq(2).attr('width', 20);
                        cols.eq(3).attr('width', 60); // payout json column bigger
                        cols.eq(4).attr('width', 18);
                        cols.eq(5).attr('width', 18);
                        cols.eq(6).attr('width', 20);
                        /* -------------------------
                           WRAP TEXT + AUTO HEIGHT
                        -------------------------- */
                        rows.each(function ()
                        {
                            $(this).attr('ht', 'auto');
                            $(this).attr('customHeight', '0');
                        });
                        /* -------------------------
                           HEADER STYLE
                        -------------------------- */
                        var header = rows.first();
                        header.find('c').attr('s', '42');
                        // bold + bigger font
                        /* -------------------------
                           TABLE BORDER
                        -------------------------- */
                        rows.each(function ()
                        {
                            $(this).find('c').attr('s', '25');
                        });
                        /* -------------------------
                           FOOTER STYLE
                        -------------------------- */
                        var footer = rows.last();
                        footer.find('c').attr('s', '47');
                        // bold + bigger + top border
                    }
                },
                {
                    extend: 'pdf',
                    title: 'Pending Customers Withdrawal Report - ' + new Date().toLocaleString("en-CA", { month: 'long', year: 'numeric' }),
                    filename: `Pending_Customers_Withdrawal_Report_${new Date().toLocaleDateString('en-CA')}`,
                    footer: true,
                    orientation: 'landscape',
                    pageSize: 'A4',
                    exportOptions: {
                        columns: [1, 2, 3, 4, 5, 6, 7],
                        stripHtml: false, // Prevents DataTables from stripping our manual \n
                        format: {
                            body: function (data, row, column)
                            {
                                // Use the helper function with \n for PDF
                                return formatExportData(data, "\n");
                            }
                        }
                    },
                    customize: function (doc)
                    {
                        // 1. Set Table Widths (Adjust the 3rd index if your JSON is in a different column)
                        // 'auto' lets the text dictate height, '*' distributes remaining space
                        doc.content[1].table.widths = ['auto', 'auto', '30%', 'auto', 'auto', 'auto', 'auto'];

                        // 2. Force Alignment and Wrapping
                        var rowCount = doc.content[1].table.body.length;
                        for (var i = 1; i < rowCount; i++)
                        {
                            // This forces the "Details" cell to allow wrapping
                            doc.content[1].table.body[i][2].alignment = 'left';
                        }

                        // 3. Define Table Borders
                        doc.content[1].layout = {
                            hLineWidth: function (i, node) { return 0.5; },
                            vLineWidth: function (i, node) { return 0.5; },
                            hLineColor: function (i, node) { return '#aaaaaa'; },
                            vLineColor: function (i, node) { return '#aaaaaa'; },
                            paddingLeft: function (i, node) { return 4; },
                            paddingRight: function (i, node) { return 4; },
                            paddingTop: function (i, node) { return 2; },
                            paddingBottom: function (i, node) { return 2; }
                        };

                        // 4. Style the Footer to stand out
                        doc.styles.tableFooter = {
                            fillColor: '#f3f3f3',
                            bold: true,
                            alignment: 'right',
                            margin: [0, 5, 0, 5]
                        };
                    }
                }
            ],
            footerCallback: function (row, data, start, end, display)
            {
                var api = this.api();
                var intVal = (i) => typeof i === 'string' ? i.replace(/[\$,]/g, '') * 1 : typeof i === 'number' ? i : 0;

                var total = api.column(4, { search: 'applied' }).data().reduce((a, b) => intVal(a) + intVal(b), 0);

                // Highlight Footer in Browser UI
                var footerCell = $(api.column(4).footer());
                footerCell.html(total.toLocaleString('en-US', { minimumFractionDigits: 2 }));
                footerCell.css({
                    'background-color': '#f1f2f6',
                    'font-weight': 'bold',
                    'border': '2px solid #2f3542'
                });
            }
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
                    extend: 'excel',
                    title: 'All Customers Withdrawal Report - ' + new Date().toLocaleString("en-CA", { month: 'long', year: 'numeric' }),
                    filename: `All_Customers_Withdrawal_Report_${new Date().toLocaleDateString('en-CA')}`,
                    footer: true,
                    messageTop: `Generated on: ${new Date().toLocaleString()}`,
                    exportOptions: {
                        columns: [1, 2, 3, 4, 5, 6, 7],
                        format: {
                            header: function (data, columnIdx)
                            {
                                return data.split('All Methods')[0].replace(/<[^>]*>/g, '').trim();
                            },
                            body: function (data, row, column)
                            {
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
                                return $temp.text().trim();
                            }
                        }
                    },
                    customize: function (xlsx)
                    {

                        var sheet = xlsx.xl.worksheets['sheet1.xml'];

                        var rows = $('row', sheet);

                        /* -------------------------
                           COLUMN WIDTH
                        -------------------------- */
                        var cols = $('col', sheet);
                        cols.eq(0).attr('width', 20);
                        cols.eq(1).attr('width', 25);
                        cols.eq(2).attr('width', 20);
                        cols.eq(3).attr('width', 60); // payout json column bigger
                        cols.eq(4).attr('width', 18);
                        cols.eq(5).attr('width', 18);
                        cols.eq(6).attr('width', 20);
                        /* -------------------------
                           WRAP TEXT + AUTO HEIGHT
                        -------------------------- */
                        rows.each(function ()
                        {
                            $(this).attr('ht', 'auto');
                            $(this).attr('customHeight', '0');
                        });
                        /* -------------------------
                           HEADER STYLE
                        -------------------------- */
                        var header = rows.first();
                        header.find('c').attr('s', '42');
                        // bold + bigger font
                        /* -------------------------
                           TABLE BORDER
                        -------------------------- */
                        rows.each(function ()
                        {
                            $(this).find('c').attr('s', '25');
                        });
                        /* -------------------------
                           FOOTER STYLE
                        -------------------------- */
                        var footer = rows.last();
                        footer.find('c').attr('s', '47');
                        // bold + bigger + top border
                    }
                },
                {
                    extend: 'pdf',
                    title: 'All Customers Withdrawal Report - ' + new Date().toLocaleString("en-CA", { month: 'long', year: 'numeric' }),
                    filename: `All_Customers_Withdrawal_Report_${new Date().toLocaleDateString('en-CA')}`,
                    footer: true,
                    orientation: 'landscape',
                    pageSize: 'A4',
                    exportOptions: {
                        columns: [1, 2, 3, 4, 5, 6, 7],
                        stripHtml: false, // Prevents DataTables from stripping our manual \n
                        format: {
                            header: function (data)
                            {
                                return data.split('All Methods')[0].replace(/<[^>]*>/g, '').trim();
                            },
                            body: function (data, row, column)
                            {
                                // Use the helper function with \n for PDF
                                return formatExportData(data, "\n");
                            }
                        }
                    },
                    customize: function (doc)
                    {
                        // 1. Set Table Widths (Adjust the 3rd index if your JSON is in a different column)
                        // 'auto' lets the text dictate height, '*' distributes remaining space
                        doc.content[1].table.widths = ['auto', 'auto', '30%', 'auto', 'auto', 'auto', 'auto'];

                        // 2. Force Alignment and Wrapping
                        var rowCount = doc.content[1].table.body.length;
                        for (var i = 1; i < rowCount; i++)
                        {
                            // This forces the "Details" cell to allow wrapping
                            doc.content[1].table.body[i][2].alignment = 'left';
                        }

                        // 3. Define Table Borders
                        doc.content[1].layout = {
                            hLineWidth: function (i, node) { return 0.5; },
                            vLineWidth: function (i, node) { return 0.5; },
                            hLineColor: function (i, node) { return '#aaaaaa'; },
                            vLineColor: function (i, node) { return '#aaaaaa'; },
                            paddingLeft: function (i, node) { return 4; },
                            paddingRight: function (i, node) { return 4; },
                            paddingTop: function (i, node) { return 2; },
                            paddingBottom: function (i, node) { return 2; }
                        };

                        // 4. Style the Footer to stand out
                        doc.styles.tableFooter = {
                            fillColor: '#f3f3f3',
                            bold: true,
                            alignment: 'right',
                            margin: [0, 5, 0, 5]
                        };
                    }
                }
            ],
            footerCallback: function (row, data, start, end, display)
            {
                var api = this.api();
                var intVal = (i) => typeof i === 'string' ? i.replace(/[\$,]/g, '') * 1 : typeof i === 'number' ? i : 0;

                var total = api.column(4, { search: 'applied' }).data().reduce((a, b) => intVal(a) + intVal(b), 0);

                // Highlight Footer in Browser UI
                var footerCell = $(api.column(4).footer());
                footerCell.html(total.toLocaleString('en-US', { minimumFractionDigits: 2 }));
                footerCell.css({
                    'background-color': '#f1f2f6',
                    'font-weight': 'bold',
                    'border': '2px solid #2f3542'
                });
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