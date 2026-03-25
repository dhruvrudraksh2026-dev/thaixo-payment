import { getAllAgency, addAgency, getAgencyById, updateAgencyById } from "../api/agencyApi.js";
import { getAgencyCustomers } from "../api/customerAgencyApi.js";
import { getAllPendingAgencyCustomerWithdrawals } from "../api/customerWithdrawalsApi.js";
import { renderAgencies, addAgencyTableRow, editDataTableRow, renderAgencyInfo, renderAgencyCustomers } from "../dom/agencyDom.js";
import { renderCustomerWithdrawals } from "../dom/customerWithdrawalsDom.js";
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