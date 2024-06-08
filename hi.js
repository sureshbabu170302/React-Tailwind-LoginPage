import interceptorInstance from "../../../../../actions/interceptors";

export const getAllRecords = async (projectId, page, search, columName, sortOrder, limit) => {
    let baseQueryString = `/projects/1/deposite-schedule`;
    if (page > 0) baseQueryString += `?page=${page}`;
    if (sortOrder) baseQueryString += `&sortOrder=${sortOrder}`
    if (columName) baseQueryString += `&sortBy=${columName}`;
    if (limit) baseQueryString += `&limit=${limit}`;
    if (search?.length > 0) baseQueryString += `&search=${search}`;
    
    try {
        const response = await interceptorInstance.get(baseQueryString);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getAllItemsRecords = async (projectId, page, search, columName, sortOrder, limit) => {
    let baseQueryString = `/projects/1/deposit-schedule-items`;
    if (page > 0) baseQueryString += `?page=${page}`;
    if (sortOrder) baseQueryString += `&sortOrder=${sortOrder}`
    if (columName) baseQueryString += `&sortBy=${columName}`;
    if (limit) baseQueryString += `&limit=${limit}`;
    if (search?.length > 0) baseQueryString += `&search=${search}`;
    
    try {
        const response = await interceptorInstance.get(baseQueryString);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getDepositScheduleById = async (project_id, deposit_schedule_id) => {
    const endpoint = `/projects/1/deposite-schedule/${deposit_schedule_id}`;  
    try {
        const response = await interceptorInstance.get(endpoint);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateDepositSchedule = async (project_id, deposit_schedule_id, deposit_number, amount, percentage, deposit_to, substract_first_deposit_amount, prevent_changes, duration_in_days, duration_in_months) => {
    let payloadBody = {
        deposit_number: deposit_number,
        amount: amount,
        percentage: percentage,
        deposit_to: deposit_to,
        substract_first_deposit_amount: substract_first_deposit_amount,
        prevent_changes: prevent_changes,
        duration_in_days: duration_in_days,
        duration_in_months: duration_in_months
    };

    try {
        const response = await interceptorInstance.put(`/projects/${project_id}/deposit-schedules/${deposit_schedule_id}`, payloadBody);
        return response;
    } catch (error) {
        return error;
    }
};

export const addNewRecord = async (formData) => {
  try {
    const response = await interceptorInstance.post(`/projects/1/deposite-schedule`, formData);
    return response.data;
  } catch (error) {
    console.error('Error submitting the form:', error.response?.data || error.message);
    throw error;
  }
};

export const getRecordDetails = async (id, limit) => {
    try {
        const response = await interceptorInstance.get(`/events/?project_id=${id}&limit=${limit}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateRecord = async (template_name,template_description,aps_document, subject, body ,project_id,to_address, cc_address, bcc_address, additional_emails) => {
    let payloadBody = {
        template_name: template_name,
        template_description: template_description,
        template_type: "email",
        aps_document: aps_document,
        project_id: parseInt(project_id),
        subject: subject,
        body: body,
        attachments: [],
        recipients: {
            "to_address": to_address ? to_address:[],
            "cc_address": cc_address ? cc_address:[],
            "bcc_address": bcc_address ? bcc_address: [],
            "additional_emails": additional_emails ? additional_emails : []
        }
    }

    try {
        const response = await interceptorInstance.put(`/email/templates`, payloadBody);
       return response;

    } catch (error) {
        return error;
    }
}


export const deleteRecord = async (template_name,template_description,aps_document, subject, body ,project_id,to_address, cc_address, bcc_address, additional_emails) => {

    let payloadBody = {
        template_name: template_name,
        template_description: template_description,
        template_type: "email",
        aps_document: aps_document,
        project_id: parseInt(project_id),
        subject: subject,
        body: body,
        attachments: [],
        recipients: {
            "to_address": to_address ? to_address:[],
            "cc_address": cc_address ? cc_address:[],
            "bcc_address": bcc_address ? bcc_address: [],
            "additional_emails": additional_emails ? additional_emails : []
        }
    }
   
    try {
        const response = await interceptorInstance.delete(`/email/templates`, payloadBody);
       return response;

    } catch (error) {
        return error;
    }
}
