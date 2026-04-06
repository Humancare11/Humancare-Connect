import { useState, useEffect } from "react";
import PhoneInputLib from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { getNames } from "country-list";
import "./DoctorEnrollments.css";

const PhoneInput = PhoneInputLib.default ?? PhoneInputLib;

const DoctorEnrollments = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [countries, setCountries] = useState([]);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

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
  }, []);

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

      if (!formData.medicalCertification) {
        newErrors.medicalCertification = "Medical certification file is required";
      } else {
        const sizeError = validateFileSize(formData.medicalCertification);
        const typeError = validateFileType(formData.medicalCertification);
        if (sizeError) newErrors.medicalCertification = sizeError;
        else if (typeError) newErrors.medicalCertification = typeError;
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

    const newDoctor = {
      id: Date.now(),
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
    };

    enrolledDoctors.push(newDoctor);
    localStorage.setItem("enrolledDoctors", JSON.stringify(enrolledDoctors));

    console.log("Form submitted:", formData);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
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
            <button
              className="btn-primary"
              onClick={() => setShowSuccess(false)}
            >
              Close
            </button>
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
          <div className="form-header">
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
                      inputStyle={{
                        width: "100%",
                        height: "48px",
                        fontSize: "15px",
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
                    >
                      <option value="">Select Specialization</option>
                      <option value="Adolescent Medicine">
                        Adolescent Medicine
                      </option>
                      <option value="Adult Reconstructive Orthopaedics">
                        Adult Reconstructive Orthopaedics
                      </option>
                      <option value="Andrologist">Andrologist</option>
                      <option value="Anesthesiologist">Anesthesiologist</option>
                      <option value="Audiologist">Audiologist</option>
                      <option value="Cardiologist">Cardiologist</option>
                      <option value="Cardiothoracic Surgeon">
                        Cardiothoracic Surgeon
                      </option>
                      <option value="Child & Adolescent Psychiatrist">
                        Child & Adolescent Psychiatrist
                      </option>
                      <option value="Critical Care Medicine Specialist">
                        Critical Care Medicine Specialist
                      </option>
                      <option value="Dental Prosthetics">
                        Dental Prosthetics
                      </option>
                      <option value="Dental Surgeon">Dental Surgeon</option>
                      <option value="Dentist">Dentist</option>
                      <option value="Dermatologist">Dermatologist</option>
                      <option value="Diagnostician">Diagnostician</option>
                      <option value="Dietician">Dietician</option>
                      <option value="Emergency Medicine Specialist">
                        Emergency Medicine Specialist
                      </option>
                      <option value="Endocrinologist">Endocrinologist</option>
                      <option value="Epidemiologist">Epidemiologist</option>
                      <option value="Family Medicine">Family Medicine</option>
                      <option value="Family Practice / General Practice">
                        Family Practice / General Practice
                      </option>
                      <option value="Gastroenterologist">
                        Gastroenterologist
                      </option>
                      <option value="General Practice">General Practice</option>
                      <option value="Geriatric Medicine">
                        Geriatric Medicine
                      </option>
                      <option value="Geriatric Medicine Specialist">
                        Geriatric Medicine Specialist
                      </option>
                      <option value="Hematologist">Hematologist</option>
                      <option value="Hematologist & Oncologist">
                        Hematologist & Oncologist
                      </option>
                      <option value="Hepatologist">Hepatologist</option>
                      <option value="Homeopathic Medicine">
                        Homeopathic Medicine
                      </option>
                      <option value="Infectious Disease Specialist">
                        Infectious Disease Specialist
                      </option>
                      <option value="Intensivist">Intensivist</option>
                      <option value="Internal Medicine Specialist">
                        Internal Medicine Specialist
                      </option>
                      <option value="Maxillofacial Surgeon / Oral Surgeon">
                        Maxillofacial Surgeon / Oral Surgeon
                      </option>
                      <option value="Medical Education">
                        Medical Education
                      </option>
                      <option value="Medical Examiner">Medical Examiner</option>
                      <option value="Microbiologist">Microbiologist</option>
                      <option value="Naturopathy">Naturopathy</option>
                      <option value="Nephrologist">Nephrologist</option>
                      <option value="Neurologist">Neurologist</option>
                      <option value="Neurosurgeon">Neurosurgeon</option>
                      <option value="Nuclear Medicine Specialist">
                        Nuclear Medicine Specialist
                      </option>
                      <option value="Nurse Education">Nurse Education</option>
                      <option value="Obstetrician and Gynecologist">
                        Obstetrician and Gynecologist
                      </option>
                      <option value="Occupational Medicine Specialist">
                        Occupational Medicine Specialist
                      </option>
                      <option value="Oncologist">Oncologist</option>
                      <option value="Ophthalmologist">Ophthalmologist</option>
                      <option value="Optometrist">Optometrist</option>
                      <option value="Optometrist/Optician">
                        Optometrist/Optician
                      </option>
                      <option value="Orthopedic Surgeon / Orthopedist">
                        Orthopedic Surgeon / Orthopedist
                      </option>
                      <option value="Orthopedic Surgery">
                        Orthopedic Surgery
                      </option>
                      <option value="Otolaryngologist / ENT">
                        Otolaryngologist / ENT
                      </option>
                      <option value="Pain Medicine">Pain Medicine</option>
                      <option value="Pathologist">Pathologist</option>
                      <option value="Pediatrician">Pediatrician</option>
                      <option value="Periodontist">Periodontist</option>
                      <option value="Pharmacist">Pharmacist</option>
                      <option value="Physiatrist">Physiatrist</option>
                      <option value="Physiologist">Physiologist</option>
                      <option value="Physiotherapist">Physiotherapist</option>
                      <option value="Plastic Surgeon">Plastic Surgeon</option>
                      <option value="Prosthetist/Orthotist">
                        Prosthetist/Orthotist
                      </option>
                      <option value="Psychiatrist">Psychiatrist</option>
                      <option value="Psychology/Psychotherapist">
                        Psychology/Psychotherapist
                      </option>
                      <option value="Pulmonologist">Pulmonologist</option>
                      <option value="Radiation Oncologist">
                        Radiation Oncologist
                      </option>
                      <option value="Radiologist">Radiologist</option>
                      <option value="Rheumatologist">Rheumatologist</option>
                      <option value="Sexologist">Sexologist</option>
                      <option value="Sexologist and Psychiatrist">
                        Sexologist and Psychiatrist
                      </option>
                      <option value="Sexologist/General Physician">
                        Sexologist/General Physician
                      </option>
                      <option value="Siddha/Ayurvedha">Siddha/Ayurvedha</option>
                      <option value="Sports Medicine Specialist">
                        Sports Medicine Specialist
                      </option>
                      <option value="Surgeon">Surgeon</option>
                      <option value="Urologist">Urologist</option>
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
                      className={errors.zip ? "input-error" : ""}
                    />
                    {errors.zip && (
                      <span className="error-message">{errors.zip}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Profile Photo</label>
                  <input
                    type="file"
                    name="profilePhoto"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/jpg,image/png"
                    className={errors.profilePhoto ? "input-error" : ""}
                  />
                  {profilePhotoPreview && (
                    <div className="profile-photo-preview">
                      <img src={profilePhotoPreview} alt="Profile Preview" />
                      <button
                        type="button"
                        className="remove-photo-btn"
                        onClick={() => {
                          setProfilePhotoPreview(null);
                          setFormData((prev) => ({
                            ...prev,
                            profilePhoto: null,
                          }));
                        }}
                      >
                        ✕ Remove
                      </button>
                    </div>
                  )}
                  <span className="helper-text">
                    Upload a professional photo (JPG, PNG - Max 2MB)
                  </span>
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
                    className={errors.aboutDoctor ? "input-error" : ""}
                  />
                  <div className="character-counter">
                    {formData.aboutDoctor.length}/300 characters
                    {formData.aboutDoctor.length < 150 && (
                      <span className="counter-warning"> (min 150 required)</span>
                    )}
                  </div>
                  {errors.aboutDoctor && (
                    <span className="error-message">{errors.aboutDoctor}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Languages Known</label>
                  <span className="helper-text">
                    Select all languages you can communicate in.
                  </span>
                  <div className="language-chips">
                    {languages.map((lang) => (
                      <div
                        key={lang}
                        className={`chip ${formData.languagesKnown.includes(lang) ? "selected" : ""}`}
                        onClick={() => handleLanguageToggle(lang)}
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
                    <input
                      type="file"
                      name="medicalCertification"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      required
                      className={errors.medicalCertification ? "input-error" : ""}
                    />
                    <span className="helper-text">
                      Upload your medical degree certificate (PDF, JPG, PNG -
                      Max 2MB)
                    </span>
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
                    className={errors.idProof ? "input-error" : ""}
                  />
                  {errors.idProof && (
                    <span className="error-message">{errors.idProof}</span>
                  )}
                </div>

                <div className="section-divider">
                  <span>Payout Details</span>
                </div>

                <div className="form-group">
                  <label>Payout Email (Optional)</label>
                  <input
                    type="email"
                    name="payoutEmail"
                    value={formData.payoutEmail}
                    onChange={handleInputChange}
                    placeholder="For payment notifications"
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
                      style={{ textTransform: "uppercase" }}
                      className={errors.ifscCode ? "input-error" : ""}
                    />
                    {errors.ifscCode && (
                      <span className="error-message">{errors.ifscCode}</span>
                    )}
                  </div>
                </div>

                <div className="quick-tip">
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
                    <p>
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
                  <button type="submit" className="btn-primary">
                    Submit Application
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