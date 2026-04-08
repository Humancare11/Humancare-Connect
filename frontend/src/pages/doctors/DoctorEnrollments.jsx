import { useState, useEffect } from "react";
import PhoneInputLib from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { getNames } from "country-list";
import "./DoctorEnrollments.css";

const PhoneInput = PhoneInputLib.default ?? PhoneInputLib;

const DoctorEnrollments = ({ onComplete, initialData, doctorId }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [countries, setCountries] = useState([]);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(!!initialData);
  const [hasExistingProfilePhoto, setHasExistingProfilePhoto] = useState(false);
  const [hasExistingCertification, setHasExistingCertification] = useState(false);

  const [formData, setFormData] = useState({
    // Section 1 - Personal Details
    email: "",
    countryCode: "",
    phoneNumber: "",
    firstName: "",
    surname: "",
    gender: "",
    dob: "",
    qualification: "",
    specialization: "",
    subSpecialization: "",
    consultantFees: "",
    address: "",
    country: "",
    state: "",
    city: "",
    zip: "",
    profilePhoto: null,
    experience: "",
    aboutDoctor: "",
    consultationMode: "",
    languagesKnown: [],
    clinicName: "",
    clinicAddress: "",

    // Section 2 - Verification + Payout
    medicalRegistrationNumber: "",
    medicalLicense: "",
    medicalCertification: null,
    idProof: "",
    medicalCouncilName: "",
    registrationYear: "",
    idProofType: "",
    payoutEmail: "",
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const countryNames = getNames();
    const sortedCountries = countryNames.sort((a, b) => a.localeCompare(b));
    setCountries(sortedCountries);

    // Populate form if initialData exists
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        // Ensure files are null as they can't be easily restored from JSON
        profilePhoto: null,
        medicalCertification: null
      }));
      setHasExistingProfilePhoto(!!initialData.hasProfilePhoto || !!initialData.profilePhoto);
      setHasExistingCertification(!!initialData.hasCertification || !!initialData.medicalCertification);
    }
  }, [initialData]);

  const validators = {
    email: (value) => {
      if (!value) return "Email is required";
      if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format";
      return "";
    },

    phoneNumber: (value) => {
      if (!value) return "Phone number is required";
      if (value.length < 10) return "Phone number must be at least 10 digits";
      return "";
    },

    firstName: (value) => {
      if (!value) return "First name is required";
      if (value.length < 2) return "First name must be at least 2 characters";
      return "";
    },

    surname: (value) => {
      if (!value) return "Surname is required";
      if (value.length < 2) return "Surname must be at least 2 characters";
      return "";
    },

    gender: (value) => {
      if (!value) return "Please select gender";
      return "";
    },

    dob: (value) => {
      if (!value) return "Date of birth is required";
      const age = Math.floor((new Date() - new Date(value)) / 31557600000);
      if (age < 23) return "Doctor must be at least 23 years old";
      if (age > 80) return "Please enter a valid date of birth";
      return "";
    },

    qualification: (value) => {
      if (!value) return "Qualification is required";
      return "";
    },

    specialization: (value) => {
      if (!value) return "Please select a specialization";
      return "";
    },

    consultantFees: (value) => {
      if (!value) return "Consultation fee is required";
      if (value < 0) return "Fee cannot be negative";
      if (value < 100) return "Minimum fee should be ₹100";
      return "";
    },

    address: (value) => {
      if (!value) return "Address is required";
      if (value.length < 10) return "Please provide a complete address";
      return "";
    },

    country: (value) => {
      if (!value) return "Please select country";
      return "";
    },

    state: (value) => {
      if (!value) return "State is required";
      return "";
    },

    city: (value) => {
      if (!value) return "City is required";
      return "";
    },

    zip: (value) => {
      if (!value) return "ZIP code is required";
      if (!/^\d{5,6}$/.test(value)) return "Invalid ZIP code format";
      return "";
    },

    languagesKnown: (value) => {
      if (!value || value.length === 0) {
        return "Please select at least one language";
      }
      return "";
    },

    medicalRegistrationNumber: (value) => {
      if (!value) return "Medical registration number is required";
      return "";
    },

    medicalLicense: (value) => {
      if (!value) return "Medical license number is required";
      return "";
    },

    idProof: (value) => {
      if (!value) return "ID proof is required";
      return "";
    },

    payoutEmail: (value) => {
      if (value && !/\S+@\S+\.\S+/.test(value)) return "Invalid email format";
      return "";
    },

    experience: (value) => {
      if (!value) return "Experience is required";
      if (value < 1) return "Experience must be at least 1 year";
      if (value > 60) return "Please enter valid experience (max 60 years)";
      return "";
    },

    aboutDoctor: (value) => {
      if (!value) return "About Doctor is required";
      if (value.length < 150) return "Please provide at least 150 characters";
      if (value.length > 300) return "Maximum 300 characters allowed";
      return "";
    },

    consultationMode: (value) => {
      if (!value) return "Please select consultation mode";
      return "";
    },

    clinicName: (value) => {
      if (!value) return "Clinic name is required";
      if (value.length < 3) return "Clinic name must be at least 3 characters";
      return "";
    },

    clinicAddress: (value) => {
      if (!value) return "Clinic address is required";
      if (value.length < 10) return "Please provide a complete clinic address";
      return "";
    },

    medicalCouncilName: (value) => {
      if (!value) return "Medical council name is required";
      return "";
    },

    registrationYear: (value) => {
      if (!value) return "Registration year is required";
      const currentYear = new Date().getFullYear();
      if (value < 1950) return "Please enter a valid year";
      if (value > currentYear) return "Year cannot be in the future";
      return "";
    },

    idProofType: (value) => {
      if (!value) return "Please select ID proof type";
      return "";
    },

    accountHolderName: (value) => {
      if (!value) return "Account holder name is required";
      if (value.length < 3) return "Please enter a valid name";
      return "";
    },

    bankName: (value) => {
      if (!value) return "Bank name is required";
      return "";
    },

    accountNumber: (value) => {
      if (!value) return "Account number is required";
      if (!/^\d{9,18}$/.test(value)) {
        return "Please enter a valid account number (9-18 digits)";
      }
      return "";
    },

    ifscCode: (value) => {
      if (!value) return "IFSC code is required";
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value.toUpperCase())) {
        return "Please enter a valid IFSC code";
      }
      return "";
    },
  };

  const validateField = (name, value) => {
    const validator = validators[name];
    return validator ? validator(value) : "";
  };

  const validateFileSize = (file, maxSizeMB = 2) => {
    if (!file) return "File is required";
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) return `File size must be less than ${maxSizeMB}MB`;
    return "";
  };

  const validateFileType = (
    file,
    allowedTypes = ["pdf", "jpg", "jpeg", "png"]
  ) => {
    if (!file) return "File is required";
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      return `Only ${allowedTypes.join(", ").toUpperCase()} files are allowed`;
    }
    return "";
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      const fields = [
        "email",
        "phoneNumber",
        "firstName",
        "surname",
        "gender",
        "dob",
        "qualification",
        "specialization",
        "consultantFees",
        "address",
        "country",
        "state",
        "city",
        "zip",
        "experience",
        "aboutDoctor",
        "consultationMode",
        "clinicName",
        "clinicAddress",
        "languagesKnown",
      ];

      fields.forEach((field) => {
        const error = validateField(field, formData[field]);
        if (error) newErrors[field] = error;
      });

      if (formData.profilePhoto) {
        const sizeError = validateFileSize(formData.profilePhoto);
        const typeError = validateFileType(formData.profilePhoto, [
          "jpg",
          "jpeg",
          "png",
        ]);
        if (sizeError) newErrors.profilePhoto = sizeError;
        else if (typeError) newErrors.profilePhoto = typeError;
      } else if (!hasExistingProfilePhoto) {
        // Only require if no existing photo
        newErrors.profilePhoto = "Profile photo is required";
      }
    } else if (step === 2) {
      const fields = [
        "medicalRegistrationNumber",
        "medicalLicense",
        "idProof",
        "medicalCouncilName",
        "registrationYear",
        "idProofType",
        "accountHolderName",
        "bankName",
        "accountNumber",
        "ifscCode",
      ];

      fields.forEach((field) => {
        const error = validateField(field, formData[field]);
        if (error) newErrors[field] = error;
      });

      if (formData.medicalCertification) {
        const sizeError = validateFileSize(formData.medicalCertification);
        const typeError = validateFileType(formData.medicalCertification);
        if (sizeError) newErrors.medicalCertification = sizeError;
        else if (typeError) newErrors.medicalCertification = typeError;
      } else if (!hasExistingCertification) {
        newErrors.medicalCertification = "Medical certification file is required";
      }

      if (formData.payoutEmail) {
        const error = validateField("payoutEmail", formData.payoutEmail);
        if (error) newErrors.payoutEmail = error;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
      ...(name === "specialization" && { subSpecialization: "" }),
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (value) {
      const error = validateField(name, newValue);
      if (error) {
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    }
  };

  const handlePhoneChange = (phone) => {
    setFormData((prev) => ({ ...prev, phoneNumber: phone }));
    if (errors.phoneNumber) {
      setErrors((prev) => ({ ...prev, phoneNumber: "" }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    setFormData((prev) => ({
      ...prev,
      [name]: file,
    }));

    if (name === "profilePhoto" && file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);

      const sizeError = validateFileSize(file);
      const typeError = validateFileType(file, ["jpg", "jpeg", "png"]);
      if (sizeError || typeError) {
        setErrors((prev) => ({ ...prev, [name]: sizeError || typeError }));
      } else if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    } else if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleLanguageToggle = (language) => {
    setFormData((prev) => ({
      ...prev,
      languagesKnown: prev.languagesKnown.includes(language)
        ? prev.languagesKnown.filter((l) => l !== language)
        : [...prev.languagesKnown, language],
    }));

    if (errors.languagesKnown) {
      setErrors((prev) => ({ ...prev, languagesKnown: "" }));
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 2) setCurrentStep(currentStep + 1);
    } else {
      const firstErrorElement = document.querySelector(".error-message");
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

const handleSubmit = (e) => {
  e.preventDefault();

  if (validateStep(2)) {
    const enrolledDoctors =
      JSON.parse(localStorage.getItem("enrolledDoctors")) || [];

    const doctorData = {
      ...formData,
      id: doctorId || initialData?.id || Date.now(),
      name: `Dr. ${formData.firstName} ${formData.surname}`.trim(),
      degree: formData.qualification || "Doctor",
      rating: 4.5,
      experience: formData.experience ? `${formData.experience}+` : "1+",
      specialty: formData.specialization || "General Physician",
      languages:
        formData.languagesKnown?.length > 0
          ? formData.languagesKnown
          : ["English"],
      location: `${formData.city || ""}${formData.city && formData.state ? ", " : ""}${formData.state || ""}`.trim(),
      price: Number(formData.consultantFees) || 500,
      gender: formData.gender || "Any",
      initials: `${formData.firstName?.[0] || ""}${formData.surname?.[0] || ""}`.toUpperCase(),
      color: "#0C8B7A",
      aboutDoctor: formData.aboutDoctor || "",
      clinicName: formData.clinicName || "",
      clinicAddress: formData.clinicAddress || "",
      consultationMode: formData.consultationMode || "",
      verified: false,
      source: "enrollment",
      hasProfilePhoto: hasExistingProfilePhoto || !!formData.profilePhoto,
      hasCertification: hasExistingCertification || !!formData.medicalCertification,
    };

    const existingIndex = enrolledDoctors.findIndex(d => d.id === doctorData.id);
    if (existingIndex !== -1) {
      // Update existing
      enrolledDoctors[existingIndex] = doctorData;
    } else {
      // Add new
      enrolledDoctors.push(doctorData);
    }
    
    localStorage.setItem("enrolledDoctors", JSON.stringify(enrolledDoctors));

    console.log("Form submitted:", formData);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      setIsReadOnly(true);
      if (onComplete) onComplete(doctorData);
    }, 2000);
  }
};

  const languages = [
    "English",
    "Hindi",
    "Bengali",
    "Tamil",
    "Telugu",
    "Marathi",
    "Gujarati",
    "Kannada",
    "Malayalam",
    "Punjabi",
  ];

  const specialities = {
    Cardiologist: [
      "Interventional Cardiology",
      "Non-Invasive Cardiology",
      "Electrophysiology",
      "Heart Failure Specialist",
      "Preventive Cardiology",
    ],
    Dermatologist: [
      "Cosmetic Dermatology",
      "Dermatopathology",
      "Pediatric Dermatology",
      "Trichology (Hair Specialist)",
      "Laser Dermatology",
    ],
    "Orthopedic Surgeon / Orthopedist": [
      "Joint Replacement",
      "Spine Surgery",
      "Sports Injury",
      "Pediatric Orthopedics",
      "Trauma Surgery",
    ],
    "Orthopedic Surgery": [
      "Joint Replacement",
      "Spine Surgery",
      "Sports Injury",
      "Pediatric Orthopedics",
      "Trauma Surgery",
    ],
    Neurologist: [
      "Stroke Specialist",
      "Epilepsy Specialist",
      "Neurophysiology",
      "Movement Disorders",
      "Neurocritical Care",
    ],
    Oncologist: [
      "Medical Oncology",
      "Surgical Oncology",
      "Radiation Oncology",
      "Pediatric Oncology",
      "Gynecologic Oncology",
    ],
    Pediatrician: [
      "Neonatology",
      "Pediatric Cardiology",
      "Pediatric Neurology",
      "Pediatric Oncology",
      "Developmental Pediatrics",
    ],
    "Obstetrician and Gynecologist": [
      "Infertility Specialist",
      "Gynecologic Oncology",
      "Maternal-Fetal Medicine",
      "Reproductive Endocrinology",
      "Laparoscopic Surgery",
    ],
    Psychiatrist: [
      "Child Psychiatry",
      "Addiction Psychiatry",
      "Geriatric Psychiatry",
      "Forensic Psychiatry",
      "Psychotherapy",
    ],
    Radiologist: [
      "Interventional Radiology",
      "Neuroradiology",
      "Musculoskeletal Radiology",
      "Pediatric Radiology",
      "Breast Imaging",
    ],
    Urologist: [
      "Andrology",
      "Endourology",
      "Uro-Oncology",
      "Pediatric Urology",
      "Reconstructive Urology",
    ],
  };

  return (
    <div className="doctor-enrollment-container">
      {showSuccess && (
        <div className="success-message-overlay">
          <div className="success-message-card">
            <div className="success-icon">✓</div>
            <h3>Application Submitted Successfully!</h3>
            <p>
              Thank you for submitting your doctor enrollment form. We will
              review your application and get back to you within 2-3 business
              days.
            </p>
          </div>
        </div>
      )}

      <div className="enrollment-card">
        <div className="steps-sidebar">
          <h2 className="enrollment-title">Enroll as a Doctor</h2>
          <p className="enrollment-subtitle">
            Complete these 2 simple steps to join our platform.
          </p>

          <div className="steps-list">
            <div
              className={`step-item ${currentStep === 1 ? "active" : ""} ${currentStep > 1 ? "completed" : ""}`}
            >
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Personal Details</h4>
                <p>Basic professional information</p>
              </div>
            </div>

            <div className={`step-item ${currentStep === 2 ? "active" : ""}`}>
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Verification</h4>
                <p>Credentials and payout information</p>
              </div>
            </div>
          </div>
        </div>

        <div className="form-main">
          <div className="form-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="step-indicator">Step {currentStep}/2</span>
              <h2>
                {currentStep === 1 && "Personal Details"}
                {currentStep === 2 && "Doctor Verification"}
              </h2>
              {currentStep === 1 && (
                <p>Provide your professional and contact information.</p>
              )}
              {currentStep === 2 && (
                <p>Upload verification documents and payout details.</p>
              )}
            </div>
            {initialData && isReadOnly && (
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => setIsReadOnly(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="form-section">
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. doctor@example.com"
                    required
                    disabled={isReadOnly}
                  />
                  <span className="helper-text">
                    Your professional email address.
                  </span>
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <PhoneInput
                      country="in"
                      value={formData.phoneNumber}
                      onChange={handlePhoneChange}
                      disabled={isReadOnly}
                      inputStyle={{
                        width: "100%",
                        height: "48px",
                        fontSize: "15px",
                        backgroundColor: isReadOnly ? '#f8fafc' : 'white'
                      }}
                    />
                    {errors.phoneNumber && (
                      <span className="error-message">
                        {errors.phoneNumber}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Dr. John"
                      required
                      disabled={isReadOnly}
                    />
                    {errors.firstName && (
                      <span className="error-message">{errors.firstName}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Surname</label>
                    <input
                      type="text"
                      name="surname"
                      value={formData.surname}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      required
                      disabled={isReadOnly}
                    />
                    {errors.surname && (
                      <span className="error-message">{errors.surname}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                      disabled={isReadOnly}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && (
                      <span className="error-message">{errors.gender}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      required
                      disabled={isReadOnly}
                    />
                    {errors.dob && (
                      <span className="error-message">{errors.dob}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Qualification</label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    placeholder="e.g. MBBS, MD"
                    required
                    disabled={isReadOnly}
                  />
                  {errors.qualification && (
                    <span className="error-message">
                      {errors.qualification}
                    </span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Specialization</label>
                    <select
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      required
                      disabled={isReadOnly}
                    >
                      <option value="">Select Specialization</option>
                      {Object.keys(specialities).map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                    {errors.specialization && (
                      <span className="error-message">
                        {errors.specialization}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Sub-Specialization</label>
                    <select
                      name="subSpecialization"
                      value={formData.subSpecialization}
                      onChange={handleInputChange}
                      disabled={isReadOnly}
                    >
                      <option value="">Select Sub-Specialization</option>
                      {specialities[formData.specialization]?.map(
                        (sub, index) => (
                          <option key={index} value={sub}>
                            {sub}
                          </option>
                        )
                      )}
                    </select>
                    <span className="helper-text">
                      Select a specialization first to see sub-specializations
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Consultant Fees (₹)</label>
                  <input
                    type="number"
                    name="consultantFees"
                    value={formData.consultantFees}
                    onChange={handleInputChange}
                    placeholder="Enter consultation fee"
                    required
                    disabled={isReadOnly}
                  />
                  {errors.consultantFees && (
                    <span className="error-message">
                      {errors.consultantFees}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your clinic/practice address"
                    rows="3"
                    required
                    disabled={isReadOnly}
                  />
                  {errors.address && (
                    <span className="error-message">{errors.address}</span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Country</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      disabled={isReadOnly}
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                    {errors.country && (
                      <span className="error-message">{errors.country}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      required
                      disabled={isReadOnly}
                    />
                    {errors.state && (
                      <span className="error-message">{errors.state}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      required
                      disabled={isReadOnly}
                    />
                    {errors.city && (
                      <span className="error-message">{errors.city}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>ZIP Code</label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      placeholder="Postal Code"
                      required
                      disabled={isReadOnly}
                      className={errors.zip ? "input-error" : ""}
                    />
                    {errors.zip && (
                      <span className="error-message">{errors.zip}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Profile Photo</label>
                  {!isReadOnly && (
                    <input
                      type="file"
                      name="profilePhoto"
                      onChange={handleFileChange}
                      accept="image/jpeg,image/jpg,image/png"
                      className={errors.profilePhoto ? "input-error" : ""}
                    />
                  )}
                  {(profilePhotoPreview || hasExistingProfilePhoto) && (
                    <div className="profile-photo-preview">
                      {profilePhotoPreview ? (
                        <img src={profilePhotoPreview} alt="Profile Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }} />
                      ) : (
                        <div style={{ width: '100px', height: '100px', background: '#f1f5f9', borderRadius: '8px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#64748b', textAlign: 'center', padding: '0.5rem' }}>Photo Uploaded</div>
                      )}
                      {!isReadOnly && (
                        <button
                          type="button"
                          className="remove-photo-btn"
                          onClick={() => {
                            setProfilePhotoPreview(null);
                            setHasExistingProfilePhoto(false);
                            setFormData((prev) => ({
                              ...prev,
                              profilePhoto: null,
                            }));
                          }}
                        >
                          ✕ Remove
                        </button>
                      )}
                    </div>
                  )}
                  {!isReadOnly && (
                    <span className="helper-text">
                      Upload a professional photo (JPG, PNG - Max 2MB)
                    </span>
                  )}
                  {errors.profilePhoto && (
                    <span className="error-message">{errors.profilePhoto}</span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Experience (Years)</label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="e.g. 5"
                      required
                      min="1"
                      max="60"
                      disabled={isReadOnly}
                      className={errors.experience ? "input-error" : ""}
                    />
                    {errors.experience && (
                      <span className="error-message">{errors.experience}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Consultation Mode</label>
                    <select
                      name="consultationMode"
                      value={formData.consultationMode}
                      onChange={handleInputChange}
                      required
                      disabled={isReadOnly}
                      className={errors.consultationMode ? "input-error" : ""}
                    >
                      <option value="">Select Mode</option>
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                      <option value="Both">Both</option>
                    </select>
                    {errors.consultationMode && (
                      <span className="error-message">
                        {errors.consultationMode}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>About Doctor</label>
                  <textarea
                    name="aboutDoctor"
                    value={formData.aboutDoctor}
                    onChange={handleInputChange}
                    placeholder="Write a brief description about your expertise, experience, and practice..."
                    rows="4"
                    required
                    maxLength="300"
                    disabled={isReadOnly}
                    className={errors.aboutDoctor ? "input-error" : ""}
                  />
                  {!isReadOnly && (
                    <div className="character-counter">
                      {formData.aboutDoctor.length}/300 characters
                      {formData.aboutDoctor.length < 150 && (
                        <span className="counter-warning" style={{ color: '#ef4444' }}> (min 150 required)</span>
                      )}
                    </div>
                  )}
                  {errors.aboutDoctor && (
                    <span className="error-message">{errors.aboutDoctor}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Languages Known</label>
                  {!isReadOnly && (
                    <span className="helper-text">
                      Select all languages you can communicate in.
                    </span>
                  )}
                  <div className="language-chips">
                    {languages.map((lang) => (
                      <div
                        key={lang}
                        className={`chip ${formData.languagesKnown.includes(lang) ? "selected" : ""}`}
                        onClick={() => !isReadOnly && handleLanguageToggle(lang)}
                        style={{ cursor: isReadOnly ? 'default' : 'pointer' }}
                      >
                        {lang}
                      </div>
                    ))}
                  </div>
                  {errors.languagesKnown && (
                    <span className="error-message">
                      {errors.languagesKnown}
                    </span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Clinic Name</label>
                    <input
                      type="text"
                      name="clinicName"
                      value={formData.clinicName}
                      onChange={handleInputChange}
                      placeholder="e.g. Apollo Clinic"
                      required
                      disabled={isReadOnly}
                      className={errors.clinicName ? "input-error" : ""}
                    />
                    {errors.clinicName && (
                      <span className="error-message">{errors.clinicName}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Clinic Address</label>
                  <textarea
                    name="clinicAddress"
                    value={formData.clinicAddress}
                    onChange={handleInputChange}
                    placeholder="Enter complete clinic address"
                    rows="3"
                    required
                    disabled={isReadOnly}
                    className={errors.clinicAddress ? "input-error" : ""}
                  />
                  {errors.clinicAddress && (
                    <span className="error-message">
                      {errors.clinicAddress}
                    </span>
                  )}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="form-section">
                <div className="form-row">
                  <div className="form-group">
                    <label>Medical Registration Number</label>
                    <input
                      type="text"
                      name="medicalRegistrationNumber"
                      value={formData.medicalRegistrationNumber}
                      onChange={handleInputChange}
                      placeholder="Enter your MCI registration number"
                      required
                      disabled={isReadOnly}
                      className={
                        errors.medicalRegistrationNumber ? "input-error" : ""
                      }
                    />
                    {errors.medicalRegistrationNumber && (
                      <span className="error-message">
                        {errors.medicalRegistrationNumber}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Medical License Number</label>
                    <input
                      type="text"
                      name="medicalLicense"
                      value={formData.medicalLicense}
                      onChange={handleInputChange}
                      placeholder="State medical license number"
                      required
                      disabled={isReadOnly}
                      className={errors.medicalLicense ? "input-error" : ""}
                    />
                    {errors.medicalLicense && (
                      <span className="error-message">
                        {errors.medicalLicense}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Medical Council Name</label>
                    <select
                      name="medicalCouncilName"
                      value={formData.medicalCouncilName}
                      onChange={handleInputChange}
                      required
                      disabled={isReadOnly}
                      className={errors.medicalCouncilName ? "input-error" : ""}
                    >
                      <option value="">Select Medical Council</option>
                      <option value="Medical Council of India">
                        Medical Council of India
                      </option>
                      <option value="State Medical Council">
                        State Medical Council
                      </option>
                      <option value="Dental Council of India">
                        Dental Council of India
                      </option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.medicalCouncilName && (
                      <span className="error-message">
                        {errors.medicalCouncilName}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Registration Year</label>
                    <input
                      type="number"
                      name="registrationYear"
                      value={formData.registrationYear}
                      onChange={handleInputChange}
                      placeholder="e.g. 2010"
                      required
                      min="1950"
                      max={new Date().getFullYear()}
                      disabled={isReadOnly}
                      className={errors.registrationYear ? "input-error" : ""}
                    />
                    {errors.registrationYear && (
                      <span className="error-message">
                        {errors.registrationYear}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Medical Certification (Upload)</label>
                    {!isReadOnly && (
                      <input
                        type="file"
                        name="medicalCertification"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        required={!hasExistingCertification}
                        disabled={isReadOnly}
                        className={errors.medicalCertification ? "input-error" : ""}
                      />
                    )}
                    {hasExistingCertification && (
                      <div style={{ fontSize: '0.875rem', color: '#0c8b7a', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        Certification Uploaded
                        {!isReadOnly && (
                          <button 
                            type="button" 
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem' }}
                            onClick={() => setHasExistingCertification(false)}
                          >
                            Change
                          </button>
                        )}
                      </div>
                    )}
                    {!isReadOnly && !hasExistingCertification && (
                      <span className="helper-text">
                        Upload your medical degree certificate (PDF, JPG, PNG -
                        Max 2MB)
                      </span>
                    )}
                    {errors.medicalCertification && (
                      <span className="error-message">
                        {errors.medicalCertification}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>ID Proof Type</label>
                    <select
                      name="idProofType"
                      value={formData.idProofType}
                      onChange={handleInputChange}
                      required
                      disabled={isReadOnly}
                      className={errors.idProofType ? "input-error" : ""}
                    >
                      <option value="">Select ID Proof</option>
                      <option value="Aadhaar">Aadhaar Card</option>
                      <option value="PAN">PAN Card</option>
                      <option value="Passport">Passport</option>
                    </select>
                    {errors.idProofType && (
                      <span className="error-message">
                        {errors.idProofType}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>ID Proof Number</label>
                  <input
                    type="text"
                    name="idProof"
                    value={formData.idProof}
                    onChange={handleInputChange}
                    placeholder="Enter ID proof number"
                    required
                    disabled={isReadOnly}
                    className={errors.idProof ? "input-error" : ""}
                  />
                  {errors.idProof && (
                    <span className="error-message">{errors.idProof}</span>
                  )}
                </div>

                <div className="section-divider" style={{ margin: '2rem 0', borderTop: '1px solid #e2e8f0', position: 'relative', textAlign: 'center' }}>
                  <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: 'white', padding: '0 1rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Payout Details</span>
                </div>

                <div className="form-group">
                  <label>Payout Email (Optional)</label>
                  <input
                    type="email"
                    name="payoutEmail"
                    value={formData.payoutEmail}
                    onChange={handleInputChange}
                    placeholder="For payment notifications"
                    disabled={isReadOnly}
                    className={errors.payoutEmail ? "input-error" : ""}
                  />
                  {errors.payoutEmail && (
                    <span className="error-message">{errors.payoutEmail}</span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Account Holder Name</label>
                    <input
                      type="text"
                      name="accountHolderName"
                      value={formData.accountHolderName}
                      onChange={handleInputChange}
                      placeholder="As per bank account"
                      required
                      disabled={isReadOnly}
                      className={errors.accountHolderName ? "input-error" : ""}
                    />
                    {errors.accountHolderName && (
                      <span className="error-message">
                        {errors.accountHolderName}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Bank Name</label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      placeholder="e.g. State Bank of India"
                      required
                      disabled={isReadOnly}
                      className={errors.bankName ? "input-error" : ""}
                    />
                    {errors.bankName && (
                      <span className="error-message">{errors.bankName}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Account Number</label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      placeholder="Bank account number"
                      required
                      disabled={isReadOnly}
                      className={errors.accountNumber ? "input-error" : ""}
                    />
                    {errors.accountNumber && (
                      <span className="error-message">
                        {errors.accountNumber}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>IFSC Code</label>
                    <input
                      type="text"
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleInputChange}
                      placeholder="e.g. SBIN0001234"
                      required
                      maxLength="11"
                      disabled={isReadOnly}
                      style={{ textTransform: "uppercase" }}
                      className={errors.ifscCode ? "input-error" : ""}
                    />
                    {errors.ifscCode && (
                      <span className="error-message">{errors.ifscCode}</span>
                    )}
                  </div>
                </div>

                <div className="quick-tip" style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#f0fdfa', borderRadius: '10px', marginTop: '2rem' }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle
                      cx="10"
                      cy="10"
                      r="9"
                      stroke="#0C8B7A"
                      strokeWidth="2"
                    />
                    <path
                      d="M10 6v4M10 14h.01"
                      stroke="#0C8B7A"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div>
                    <strong>Quick Tip:</strong>
                    <p style={{ fontSize: '0.875rem', color: '#475569', margin: 0 }}>
                      Provide accurate credentials for faster verification and
                      account approval.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="form-actions">
              {currentStep > 1 && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={prevStep}
                >
                  Previous Step
                </button>
              )}

              <div className="actions-right">
                {currentStep < 2 ? (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={nextStep}
                  >
                    Next Step
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M6 12l4-4-4-4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                ) : (
                  !isReadOnly && (
                    <button type="submit" className="btn-primary">
                      {initialData ? "Update Enrollment" : "Submit Application"}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M6 12l4-4-4-4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorEnrollments;
