import { getAllAgency, addAgency, getAgencyById, updateAgencyById } from "../api/agencyApi.js";
import { getAgencyCustomers } from "../api/customerAgencyApi.js";
import { renderAgencies, addAgencyTableRow, editDataTableRow, renderAgencyInfo, renderAgencyCustomers } from "../dom/agencyDom.js";
import { checkAndExecute } from "../utils/helper.js";

let dataTable;
let agencyCustomersDataTable;
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