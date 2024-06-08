import React, { useState, useCallback, useEffect } from "react";
import Select from "react-select";
import { handleAddNewRecord } from "../handlers/handler";
import { updateDepositSchedule } from "../services";
import { getAllRecords } from "../services";
import { getDepositScheduleById } from "../services";


// Common select styles as provided
const commonSelectStyles = {
  container: (base) => ({
    ...base,
    zIndex: 9,
  }),
  control: (base, state) => ({
    ...base,
    minHeight: "36px",
    letterSpacing: "0.5px",
    border: state.isFocused
      ? "var(--input-focused-border)"
      : state.isDisabled
      ? "var(--input-disabled-border)"
      : "var(--input-default-border)",
    borderRadius: "var(--input-border-radius)",
    outline: "none",
    fontSize: "var(--input-text-size)",
    fontWeight: "var(--input-text-fontWeight)",
    fontStyle: "normal",
    lineHeight: "var(--input-text-lineHeight)",
    "&:hover": {
      border: "var(--input-hover-border)",
    },
    boxShadow: state.isFocused ? "var(--input-focused-boxShadow)" : null,
  }),
  placeholder: (base) => ({
    ...base,
    color: "#959595",
    fontWeight: "500",
    fontSize: "14px",
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "3px 7px",
    gap: "7px",
  }),
  option: (base, state) => ({
    ...base,
    zIndex: 99999,
    color: "#000000",
    fontWeight: "400",
    fontSize: "14px",
    background: state.isFocused
      ? "#f8f4ed"
      : state.isSelected
      ? "#f8f4ed"
      : undefined,
    "&:hover": {
      backgroundColor: "#f8f4ed!important",
    },
    "&:active": {
      backgroundColor: "#f8f4ed!important",
    },
  }),
  input: (base) => ({
    ...base,
    outline: "none",
    color: "var(--input-text-color)",
    fontSize: "var(--input-text-size)",
    fontWeight: "var(--input-text-fontWeight)",
  }),
  singleValue: (base, state) => ({
    ...base,
    color: state.isDisabled
      ? "var(--input-disabled-color)"
      : "var(--input-text-color)",
    fontWeight: "var(--input-text-fontWeight)",
    fontSize: "var(--input-text-size)",
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    svg: {
      fill: state.isDisabled ? "var(--input-disabled-color)" : "#303389",
      width: "20px",
      height: "20px",
    },
  }),
  noOptionsMessage: (base) => ({
    ...base,
    color: "#000000",
    fontWeight: "400",
    fontSize: "14px",
    backgroundColor: "#fff",
  }),
};

const DepositeScheduleAddAndEdit = ({depositScheduleId, toggleAddAndEdit, isEditAble}) => {
  const [formData, setFormData] = useState({
    deposit_schedule_name: "",
    primary_usage_type: "",
    qualified_sale_deposit_threshold_perc: "",
    total_deposit_percentage: "",
    eligible_tax_rebates: false,
    calculate_on_asset_only: false,
    qualified_sale_deposit_threshold: false,
    available_for_phases: "1",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;

    if (
      name === "qualified_sale_deposit_threshold_perc" ||
      name === "total_deposit_percentage"
    ) {
      const numericValue = value.replace(/[^0-9.]+|(?<=\..*)\./g, "");
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: numericValue,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  }, []);

  const handleSelectChange = useCallback((selectedOption, { name }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption.value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const validationErrors = {};

      if (!formData.deposit_schedule_name) {
        validationErrors.deposit_schedule_name =
          "Deposit Schedule Name is required.";
      }
      if (!formData.qualified_sale_deposit_threshold_perc) {
        validationErrors.qualified_sale_deposit_threshold_perc =
          "Qualified Sale Deposit Threshold is required.";
      }
      if (!formData.total_deposit_percentage) {
        validationErrors.total_deposit_percentage =
          "Total Deposit Percentage is required.";
      } else if (isNaN(formData.total_deposit_percentage)) {
        validationErrors.total_deposit_percentage =
          "Total Deposit Percentage must be a number.";
      }

      setErrors(validationErrors);

      if (Object.keys(validationErrors).length === 0) {
        const requestData = {
          deposit_schedule_name: formData.deposit_schedule_name,
          total_deposit_percentage: parseFloat(
            formData.total_deposit_percentage
          ),
          primary_usage_type: formData.primary_usage_type,
          qualified_sale_deposit_threshold_perc: parseFloat(
            formData.qualified_sale_deposit_threshold_perc
          ),
          eligible_tax_rebates: formData.eligible_tax_rebates,
          calculate_on_asset_only: formData.calculate_on_asset_only,
          qualified_sale_deposit_threshold:
            formData.qualified_sale_deposit_threshold,
          available_for_phases: formData.available_for_phases,
        };
        if (!depositScheduleId) {
          try {
            const response = await handleAddNewRecord(requestData);
            setSuccessMessage("Form submitted successfully!");
            setErrorMessage("");
          } catch (error) {
            setErrorMessage(
              "There was an error submitting the form. Please try again."
            );
            console.error("Post Status error: ", error);
            setSuccessMessage("");
          }
        } else {
          try{
            const response = await updateDepositSchedule(project_id, deposit_schedule_id, deposit_number, amount, percentage, deposit_to, substract_first_deposit_amount, prevent_changes, duration_in_days, duration_in_months);
            response.status === "success" && closeAddAndEdit();
          } catch(error) {
            console.error("Update error: ", error);
          }
          // setIsLoading(false);
        }
      }
    },
    [formData]
  );

  const projectId = 1; // Default project ID

  useEffect(() => {
      const fetchDepositScheduleById = async () => {
          try {
              const response = await getDepositScheduleById(projectId, depositScheduleId);
              const data = response?.data || {};

              const formattedData = {
                  deposit_schedule_name: data.deposit_schedule_name || "NA",
                  total_deposit_percentage: data.total_deposit_percentage || "NA",
                  primary_usage_type: data.primary_usage_type || "NA",
                  qualified_sale_deposit_threshold_perc: data.qualified_sale_deposit_threshold_perc || "NA",
                  eligible_tax_rebates: data.eligible_tax_rebates || "NA",
                  calculate_on_asset_only: data.calculate_on_asset_only || "NA",
                  qualified_sale_deposit_threshold: data.qualified_sale_deposit_threshold || "NA",
                  project_id: data.project_id || "NA",
                  created_by: data.created_by || "NA",
                  created_at: convertUTCIntoViewDataFormat(data.created_at) || "NA",
                  last_modified_by: data.last_modified_by || "NA",
                  last_modified_at: convertUTCIntoViewDataFormat(data.last_modified_at) || "NA",
                  available_for_phases: data.available_for_phases || "NA",
              };

              setFormData(formattedData);
          } catch (error) {
              console.error("Error fetching deposit schedule by ID ---->", error);
              // setIsErrorToaster({
              //     errorMsg: error?.response?.data?.message,
              //     errorStatus: "toastError"
              // });
          } finally {
              // setIsLoading(false);
          }
      };

      // const fetchProjects = async () => {
      //     try {
      //         const response = await getAllRecords();
      //         const formattedProjects = response?.data?.map(project => ({
      //             value: project.project_id,
      //             label: project.project_name,
      //         }));
      //         setProjects(formattedProjects);
      //     } catch (error) {
      //         console.error("Error fetching projects ---->", error);
      //         // setIsErrorToaster({
      //         //     errorMsg: error?.response?.data?.message,
      //         //     errorStatus: "toastError"
      //         // });
      //     }
      // };

      if (depositScheduleId) {
          fetchDepositScheduleById();
      }

      // fetchProjects();
  }, []);

  const TypeOptions = [
    { value: "Primary Residence", label: "Primary Residence" },
    { value: "Canadian Investor", label: "Canadian Investor" },
    { value: "Foreign Investor", label: "Foreign Investor" },
  ];

  return (
    <form className="commonInputFields" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="deposit_schedule_name"
          className="control-label required"
        >
          Deposit Schedule Name
        </label>
        <input
          type="text"
          name="deposit_schedule_name"
          id="deposit_schedule_name"
          placeholder="Deposit Schedule Name"
          maxLength={250}
          value={formData.deposit_schedule_name}
          onChange={handleChange}
          onInput={(e) => {
            errors["deposit_schedule_name"] = "";
            let inputValue = e.target.value;

            // Remove leading spaces
            if (inputValue.startsWith(" ")) {
              inputValue = inputValue.trimStart();
            }

            // Replace multiple spaces with a single space
            inputValue = inputValue.replace(/\s+/g, " ");

            // Set the cleaned value back to the input field
            e.target.value = inputValue;
          }}
        />
        {errors.deposit_schedule_name && (
          <span className="error-inline">{errors.deposit_schedule_name}</span>
        )}
      </div>

      <div>
        <label htmlFor="primary_usage_type" className="control-label">
          Primary Usage Type
        </label>
        <Select
          id="primary_usage_type"
          name="primary_usage_type"
          options={TypeOptions}
          onChange={handleSelectChange}
          className={
            errors.primary_usage_type ? "input-validation-error" : null
          }
          placeholder="Choose Primary Usage Type"
          styles={commonSelectStyles}
        />
        {errors.primary_usage_type && (
          <span className="error-inline">{errors.primary_usage_type}</span>
        )}
      </div>

      <div>
        <label
          htmlFor="qualified_sale_deposit_threshold_perc"
          className="control-label required"
        >
          Qualified Sale Deposit Threshold %
        </label>
        <input
          type="text"
          name="qualified_sale_deposit_threshold_perc"
          id="qualified_sale_deposit_threshold_perc"
          placeholder="Qualified Sale Deposit Threshold %"
          maxLength={250}
          value={formData.qualified_sale_deposit_threshold_perc}
          onChange={handleChange}
        />
        {errors.qualified_sale_deposit_threshold_perc && (
          <span className="error-inline">
            {errors.qualified_sale_deposit_threshold_perc}
          </span>
        )}
      </div>

      <div>
        <label
          htmlFor="total_deposit_percentage"
          className="control-label required"
        >
          Total Deposit Percentage
        </label>
        <input
          type="text"
          name="total_deposit_percentage"
          id="total_deposit_percentage"
          placeholder="Total percentage"
          maxLength={250}
          value={formData.total_deposit_percentage}
          onChange={handleChange}
        />
        {errors.total_deposit_percentage && (
          <span className="error-inline">
            {errors.total_deposit_percentage}
          </span>
        )}
      </div>

      <div>
        <label className="switch">
          <input
            type="checkbox"
            name="eligible_tax_rebates"
            checked={formData.eligible_tax_rebates}
            onChange={handleChange}
          />
          <span className="slider round"></span>
        </label>
        <span className="prevent-changes-text">Eligible for Tax Rebates</span>
      </div>

      <div>
        <label className="switch">
          <input
            type="checkbox"
            name="calculate_on_asset_only"
            checked={formData.calculate_on_asset_only}
            onChange={handleChange}
          />
          <span className="slider round"></span>
        </label>
        <span className="prevent-changes-text">Calculate on Asset Only</span>
      </div>

      <div>
        <label className="switch">
          <input
            type="checkbox"
            name="qualified_sale_deposit_threshold"
            checked={formData.qualified_sale_deposit_threshold}
            onChange={handleChange}
          />
          <span className="slider round"></span>
        </label>
        <span className="prevent-changes-text">
          Qualified Sale Deposit Threshold
        </span>
      </div>

      <button type="submit">Submit</button>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </form>
  );
};

export default DepositeScheduleAddAndEdit;
