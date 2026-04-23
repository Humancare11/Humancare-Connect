import { useState, useEffect, useRef } from "react";
import PhoneInputLib from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { getNames } from "country-list";
import "./DoctorEnrollments.css";
import api from "../../api";

const PhoneInput = PhoneInputLib.default ?? PhoneInputLib;

const LANGUAGES = ["English","Hindi","Bengali","Tamil","Telugu","Marathi","Gujarati","Kannada","Malayalam","Punjabi"];

const SPECIALITIES = {
  "Cardiologist":       ["Interventional Cardiology","Non-Invasive Cardiology","Electrophysiology","Heart Failure","Preventive Cardiology"],
  "Dermatologist":      ["Cosmetic Dermatology","Dermatopathology","Pediatric Dermatology","Trichology","Laser Dermatology"],
  "Orthopedic Surgeon": ["Joint Replacement","Spine Surgery","Sports Injury","Pediatric Orthopedics","Trauma Surgery"],
  "Neurologist":        ["Stroke Specialist","Epilepsy Specialist","Neurophysiology","Movement Disorders","Neurocritical Care"],
  "Oncologist":         ["Medical Oncology","Surgical Oncology","Radiation Oncology","Pediatric Oncology","Gynecologic Oncology"],
  "Pediatrician":       ["Neonatology","Pediatric Cardiology","Pediatric Neurology","Pediatric Oncology","Developmental Pediatrics"],
  "OB-GYN":             ["Infertility Specialist","Gynecologic Oncology","Maternal-Fetal Medicine","Reproductive Endocrinology","Laparoscopic Surgery"],
  "Psychiatrist":       ["Child Psychiatry","Addiction Psychiatry","Geriatric Psychiatry","Forensic Psychiatry","Psychotherapy"],
  "Radiologist":        ["Interventional Radiology","Neuroradiology","Musculoskeletal Radiology","Pediatric Radiology","Breast Imaging"],
  "Urologist":          ["Andrology","Endourology","Uro-Oncology","Pediatric Urology","Reconstructive Urology"],
};

const STEPS = [
  { num: 1, title: "Personal Info",    icon: "👤" },
  { num: 2, title: "Practice Details", icon: "🏥" },
  { num: 3, title: "Verification",     icon: "🔒" },
  { num: 4, title: "Payout Setup",     icon: "💳" },
];

const V = {
  email:                    v => !v ? "Email is required" : !/\S+@\S+\.\S+/.test(v) ? "Enter a valid email" : "",
  phoneNumber:              v => !v ? "Phone number is required" : v.length < 10 ? "Enter a valid phone number" : "",
  firstName:                v => !v ? "First name is required" : "",
  surname:                  v => !v ? "Surname is required" : "",
  gender:                   v => !v ? "Please select gender" : "",
  dob:                      v => { if (!v) return "Date of birth is required"; const a = Math.floor((Date.now() - new Date(v)) / 31557600000); return a < 23 ? "Minimum age is 23 years" : a > 80 ? "Please enter a valid date" : ""; },
  qualification:            v => !v ? "Qualification is required" : "",
  specialization:           v => !v ? "Please select specialization" : "",
  consultantFees:           v => !v ? "Consultation fee is required" : v < 100 ? "Minimum fee is ₹100" : "",
  address:                  v => !v ? "Address is required" : v.length < 10 ? "Please enter a complete address" : "",
  country:                  v => !v ? "Please select country" : "",
  state:                    v => !v ? "State is required" : "",
  city:                     v => !v ? "City is required" : "",
  zip:                      v => !v ? "ZIP code is required" : !/^\d{5,6}$/.test(v) ? "Enter a valid ZIP code" : "",
  languagesKnown:           v => (!v || v.length === 0) ? "Select at least one language" : "",
  experience:               v => !v ? "Experience is required" : v < 1 ? "Minimum 1 year" : v > 60 ? "Maximum 60 years" : "",
  aboutDoctor:              v => !v ? "This field is required" : v.length < 150 ? `${150 - v.length} more characters needed (min 150)` : v.length > 300 ? "Maximum 300 characters" : "",
  consultationMode:         v => !v ? "Please select a consultation mode" : "",
  clinicName:               v => !v ? "Clinic name is required" : "",
  clinicAddress:            v => !v ? "Clinic address is required" : v.length < 10 ? "Please enter a complete address" : "",
  medicalRegistrationNumber:v => !v ? "Registration number is required" : "",
  medicalLicense:           v => !v ? "License number is required" : "",
  idProof:                  v => !v ? "ID proof number is required" : "",
  medicalCouncilName:       v => !v ? "Please select medical council" : "",
  registrationYear:         v => { if (!v) return "Registration year is required"; const y = parseInt(v); return y < 1950 ? "Enter a valid year" : y > new Date().getFullYear() ? "Year cannot be in future" : ""; },
  idProofType:              v => !v ? "Please select ID proof type" : "",
  payoutEmail:              v => v && !/\S+@\S+\.\S+/.test(v) ? "Enter a valid email" : "",
  accountHolderName:        v => !v ? "Account holder name is required" : "",
  bankName:                 v => !v ? "Bank name is required" : "",
  accountNumber:            v => !v ? "Account number is required" : !/^\d{9,18}$/.test(v) ? "Enter a valid account number (9–18 digits)" : "",
  ifscCode:                 v => !v ? "IFSC code is required" : !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(v.toUpperCase()) ? "Enter a valid IFSC code (e.g. SBIN0001234)" : "",
};

const STEP_FIELDS = {
  1: ["email","phoneNumber","firstName","surname","gender","dob"],
  2: ["qualification","specialization","consultantFees","experience","aboutDoctor","consultationMode","languagesKnown","clinicName","clinicAddress","address","country","state","city","zip"],
  3: ["medicalRegistrationNumber","medicalLicense","medicalCouncilName","registrationYear","idProofType","idProof"],
  4: ["accountHolderName","bankName","accountNumber","ifscCode"],
};

/* ── Simple Field Wrapper ── */
function Field({ label, error, hint, required: req, children }) {
  return (
    <div className="sf-field">
      <label className="sf-label">
        {label} {req && <span className="sf-req">*</span>}
      </label>
      {children}
      {hint && !error && <p className="sf-hint">{hint}</p>}
      {error && (
        <p className="sf-error">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </p>
      )}
    </div>
  );
}

export default function DoctorEnrollments({ onComplete, initialData, doctorId }) {
  const [step, setStep]                     = useState(1);
  const [countries, setCountries]           = useState([]);
  const [photoPreview, setPhotoPreview]     = useState(null);
  const [showSuccess, setShowSuccess]       = useState(false);
  const [isReadOnly, setIsReadOnly]         = useState(!!initialData);
  const [hasExistingPhoto, setHasExistingPhoto] = useState(false);
  const [hasExistingCert, setHasExistingCert]   = useState(false);
  const [errors, setErrors]                 = useState({});
  const [submitting, setSubmitting]         = useState(false);
  const topRef = useRef(null);

  const [form, setForm] = useState({
    email:"", phoneNumber:"", firstName:"", surname:"", gender:"", dob:"",
    qualification:"", specialization:"", subSpecialization:"", consultantFees:"",
    address:"", country:"", state:"", city:"", zip:"",
    profilePhoto: null, experience:"", aboutDoctor:"", consultationMode:"",
    languagesKnown:[], clinicName:"", clinicAddress:"",
    medicalRegistrationNumber:"", medicalLicense:"", medicalCertification: null,
    idProof:"", medicalCouncilName:"", registrationYear:"", idProofType:"",
    payoutEmail:"", accountHolderName:"", bankName:"", accountNumber:"", ifscCode:"",
  });

  useEffect(() => {
    setCountries(getNames().sort((a,b) => a.localeCompare(b)));
    if (initialData) {
      setForm(p => ({ ...p, ...initialData, profilePhoto: null, medicalCertification: null }));
      setHasExistingPhoto(!!(initialData.hasProfilePhoto || initialData.profilePhoto));
      setHasExistingCert(!!(initialData.hasCertification || initialData.medicalCertification));
    }
  }, [initialData]);

  const set = (name, val) => {
    setForm(p => ({ ...p, [name]: val, ...(name === "specialization" && { subSpecialization: "" }) }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
  };

  const onChange = e => {
    const { name, value, type, checked } = e.target;
    set(name, type === "checkbox" ? checked : value);
  };

  const onFile = e => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;
    set(name, file);
    if (name === "profilePhoto") {
      const r = new FileReader();
      r.onloadend = () => setPhotoPreview(r.result);
      r.readAsDataURL(file);
    }
  };

  const toggleLang = lang => {
    const next = form.languagesKnown.includes(lang)
      ? form.languagesKnown.filter(l => l !== lang)
      : [...form.languagesKnown, lang];
    set("languagesKnown", next);
  };

  const validate = s => {
    const errs = {};
    (STEP_FIELDS[s] || []).forEach(f => {
      const e = V[f]?.(form[f]);
      if (e) errs[f] = e;
    });
    if (s === 1 && !form.profilePhoto && !hasExistingPhoto) errs.profilePhoto = "Profile photo is required";
    if (s === 3 && !form.medicalCertification && !hasExistingCert) errs.medicalCertification = "Medical certification is required";
    if (s === 4 && form.payoutEmail) { const e = V.payoutEmail(form.payoutEmail); if (e) errs.payoutEmail = e; }
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.querySelector(".sf-error")?.closest(".sf-field")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    return true;
  };

  const next = () => {
    if (validate(step)) {
      setStep(s => Math.min(s + 1, 4));
      topRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const back = () => {
    setStep(s => Math.max(s - 1, 1));
    setErrors({});
    topRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate(4)) return;
    setSubmitting(true);
    const { profilePhoto, medicalCertification, ...rest } = form;
    try {
      const res = await api.post("/api/doctor/enrollment", {
        ...rest, doctorId,
        hasProfilePhoto: hasExistingPhoto || !!profilePhoto,
        hasCertification: hasExistingCert || !!medicalCertification,
      });
      setShowSuccess(true);
      setTimeout(() => { setShowSuccess(false); setIsReadOnly(true); onComplete?.(res.data); }, 3000);
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  const charLen = form.aboutDoctor.length;

  return (
    <div className="sf-root" ref={topRef}>

      {/* ── Success Modal ── */}
      {showSuccess && (
        <div className="sf-success-overlay">
          <div className="sf-success-box">
            <div className="sf-success-icon">
              <svg viewBox="0 0 52 52" fill="none">
                <circle cx="26" cy="26" r="24" stroke="var(--teal)" strokeWidth="2.5" className="sf-check-circle"/>
                <polyline points="14,27 22,35 38,19" stroke="var(--teal)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="sf-check-mark"/>
              </svg>
            </div>
            <h3>Application Submitted!</h3>
            <p>We'll review your application and respond within 2–3 business days.</p>
          </div>
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="sf-page-header">
        <span className="sf-eyebrow">HumaniCare</span>
        <h1 className="sf-page-title">Doctor Enrollment</h1>
        <p className="sf-page-sub">Complete all 4 steps to register on our platform.</p>
      </div>

      {/* ── Step Indicator ── */}
      <div className="sf-stepper">
        {STEPS.map(s => (
          <div key={s.num} className={`sf-step ${step === s.num ? "sf-step--active" : ""} ${step > s.num ? "sf-step--done" : ""}`}>
            <div className="sf-step-circle">
              {step > s.num
                ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                : s.num
              }
            </div>
            <span className="sf-step-label">{s.title}</span>
          </div>
        ))}
        {/* connecting line */}
        <div className="sf-stepper-bar">
          <div className="sf-stepper-fill" style={{ width: `${((step - 1) / 3) * 100}%` }} />
        </div>
      </div>

      {/* ── Form Card ── */}
      <div className="sf-card">

        {/* Card Header */}
        <div className="sf-card-header">
          <div className="sf-card-header-left">
            <span className="sf-step-tag">Step {step} of 4</span>
            <h2 className="sf-card-title">{STEPS[step-1].icon} {STEPS[step-1].title}</h2>
          </div>
          {initialData && isReadOnly && (
            <button className="sf-edit-btn" onClick={() => setIsReadOnly(false)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="sf-form">

          {/* ═══ STEP 1 ═══ */}
          {step === 1 && (
            <div className="sf-section">
              <p className="sf-section-desc">Fill in your personal and contact information.</p>

              {/* Photo Upload */}
              <div className="sf-photo-row">
                <div className="sf-photo-thumb">
                  {photoPreview
                    ? <img src={photoPreview} alt="preview" />
                    : hasExistingPhoto
                    ? <span>📸</span>
                    : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="7" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
                  }
                </div>
                <div className="sf-photo-details">
                  <p className="sf-photo-label">Profile Photo <span className="sf-req">*</span></p>
                  <p className="sf-photo-hint">JPG or PNG, max 2MB</p>
                  {!isReadOnly && (
                    <div className="sf-photo-actions">
                      <label className="sf-upload-label">
                        <input type="file" name="profilePhoto" accept="image/jpeg,image/jpg,image/png" onChange={onFile} style={{ display: "none" }} />
                        {form.profilePhoto || hasExistingPhoto ? "Change Photo" : "Upload Photo"}
                      </label>
                      {(photoPreview || hasExistingPhoto) && (
                        <button type="button" className="sf-remove-link" onClick={() => { setPhotoPreview(null); setHasExistingPhoto(false); set("profilePhoto", null); }}>
                          Remove
                        </button>
                      )}
                    </div>
                  )}
                  {errors.profilePhoto && (
                    <p className="sf-error">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      {errors.profilePhoto}
                    </p>
                  )}
                </div>
              </div>

              <div className="sf-row-2">
                <Field label="First Name" error={errors.firstName} required>
                  <input className={`sf-input ${errors.firstName ? "sf-input--err" : ""}`} name="firstName" value={form.firstName} onChange={onChange} disabled={isReadOnly} placeholder="e.g. Rahul" />
                </Field>
                <Field label="Surname" error={errors.surname} required>
                  <input className={`sf-input ${errors.surname ? "sf-input--err" : ""}`} name="surname" value={form.surname} onChange={onChange} disabled={isReadOnly} placeholder="e.g. Sharma" />
                </Field>
              </div>

              <div className="sf-row-2">
                <Field label="Gender" error={errors.gender} required>
                  <select className={`sf-input sf-select ${errors.gender ? "sf-input--err" : ""}`} name="gender" value={form.gender} onChange={onChange} disabled={isReadOnly}>
                    <option value="">Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </Field>
                <Field label="Date of Birth" error={errors.dob} required>
                  <input className={`sf-input ${errors.dob ? "sf-input--err" : ""}`} type="date" name="dob" value={form.dob} onChange={onChange} disabled={isReadOnly} />
                </Field>
              </div>

              <Field label="Email Address" error={errors.email} required>
                <input className={`sf-input ${errors.email ? "sf-input--err" : ""}`} type="email" name="email" value={form.email} onChange={onChange} disabled={isReadOnly} placeholder="doctor@example.com" />
              </Field>

              <Field label="Phone Number" error={errors.phoneNumber} required>
                <div className={`sf-phone ${errors.phoneNumber ? "sf-phone--err" : ""}`}>
                  <PhoneInput
                    country="in"
                    value={form.phoneNumber}
                    onChange={v => set("phoneNumber", v)}
                    disabled={isReadOnly}
                    inputStyle={{ width: "100%", height: "46px", fontSize: "14px", background: "transparent", color: "var(--sf-text)", border: "none", outline: "none" }}
                    buttonStyle={{ background: "transparent", border: "none", borderRight: "1px solid var(--sf-border)" }}
                    dropdownStyle={{ background: "#1a2d42", color: "#f0f6ff", border: "1px solid rgba(255,255,255,0.1)" }}
                  />
                </div>
              </Field>
            </div>
          )}

          {/* ═══ STEP 2 ═══ */}
          {step === 2 && (
            <div className="sf-section">
              <p className="sf-section-desc">Tell us about your medical practice and clinic details.</p>

              <div className="sf-row-2">
                <Field label="Qualification" error={errors.qualification} required>
                  <input className={`sf-input ${errors.qualification ? "sf-input--err" : ""}`} name="qualification" value={form.qualification} onChange={onChange} disabled={isReadOnly} placeholder="e.g. MBBS, MD" />
                </Field>
                <Field label="Years of Experience" error={errors.experience} required>
                  <input className={`sf-input ${errors.experience ? "sf-input--err" : ""}`} type="number" name="experience" value={form.experience} onChange={onChange} disabled={isReadOnly} placeholder="e.g. 5" min="1" max="60" />
                </Field>
              </div>

              <div className="sf-row-2">
                <Field label="Specialization" error={errors.specialization} required>
                  <select className={`sf-input sf-select ${errors.specialization ? "sf-input--err" : ""}`} name="specialization" value={form.specialization} onChange={onChange} disabled={isReadOnly}>
                    <option value="">Select specialization</option>
                    {Object.keys(SPECIALITIES).map(s => <option key={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Sub-Specialization" hint="Optional">
                  <select className="sf-input sf-select" name="subSpecialization" value={form.subSpecialization} onChange={onChange} disabled={isReadOnly || !form.specialization}>
                    <option value="">Select sub-specialization</option>
                    {SPECIALITIES[form.specialization]?.map((s,i) => <option key={i}>{s}</option>)}
                  </select>
                </Field>
              </div>

              <div className="sf-row-2">
                <Field label="Consultation Fee (₹)" error={errors.consultantFees} required>
                  <input className={`sf-input ${errors.consultantFees ? "sf-input--err" : ""}`} type="number" name="consultantFees" value={form.consultantFees} onChange={onChange} disabled={isReadOnly} placeholder="Minimum ₹100" />
                </Field>
                <Field label="Consultation Mode" error={errors.consultationMode} required>
                  <div className="sf-toggle-group">
                    {["Online","Offline","Both"].map(m => (
                      <button key={m} type="button"
                        className={`sf-toggle ${form.consultationMode === m ? "sf-toggle--on" : ""}`}
                        onClick={() => !isReadOnly && set("consultationMode", m)}
                        disabled={isReadOnly}
                      >{m}</button>
                    ))}
                  </div>
                  {errors.consultationMode && (
                    <p className="sf-error">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      {errors.consultationMode}
                    </p>
                  )}
                </Field>
              </div>

              <Field label="Languages Known" error={errors.languagesKnown} required hint="Select all languages you speak">
                <div className="sf-chips">
                  {LANGUAGES.map(l => (
                    <button key={l} type="button"
                      className={`sf-chip ${form.languagesKnown.includes(l) ? "sf-chip--on" : ""}`}
                      onClick={() => !isReadOnly && toggleLang(l)}
                      disabled={isReadOnly}
                    >{l}</button>
                  ))}
                </div>
              </Field>

              <Field label="About Yourself" error={errors.aboutDoctor} required hint="Minimum 150 characters, maximum 300">
                <textarea
                  className={`sf-input sf-textarea ${errors.aboutDoctor ? "sf-input--err" : ""}`}
                  name="aboutDoctor" value={form.aboutDoctor} onChange={onChange}
                  disabled={isReadOnly} rows={4} maxLength={300}
                  placeholder="Write about your experience, expertise, and approach to patient care..."
                />
                {!isReadOnly && (
                  <div className="sf-charcount">
                    <div className="sf-charbar">
                      <div className="sf-charbar-fill" style={{
                        width: `${(charLen / 300) * 100}%`,
                        background: charLen < 150 ? "var(--sf-amber)" : charLen > 280 ? "var(--sf-red)" : "var(--teal)"
                      }}/>
                    </div>
                    <span style={{ color: charLen < 150 ? "var(--sf-amber)" : charLen > 280 ? "var(--sf-red)" : "var(--teal)" }}>
                      {charLen} / 300
                    </span>
                  </div>
                )}
              </Field>

              <div className="sf-divider">Clinic Details</div>

              <Field label="Clinic Name" error={errors.clinicName} required>
                <input className={`sf-input ${errors.clinicName ? "sf-input--err" : ""}`} name="clinicName" value={form.clinicName} onChange={onChange} disabled={isReadOnly} placeholder="e.g. Apollo Clinic, Shree Hospital" />
              </Field>

              <Field label="Clinic Address" error={errors.clinicAddress} required>
                <textarea className={`sf-input sf-textarea ${errors.clinicAddress ? "sf-input--err" : ""}`} name="clinicAddress" value={form.clinicAddress} onChange={onChange} disabled={isReadOnly} rows={3} placeholder="Full clinic address with landmark" />
              </Field>

              <Field label="Residential Address" error={errors.address} required>
                <textarea className={`sf-input sf-textarea ${errors.address ? "sf-input--err" : ""}`} name="address" value={form.address} onChange={onChange} disabled={isReadOnly} rows={3} placeholder="Your home / practice address" />
              </Field>

              <div className="sf-row-2">
                <Field label="Country" error={errors.country} required>
                  <select className={`sf-input sf-select ${errors.country ? "sf-input--err" : ""}`} name="country" value={form.country} onChange={onChange} disabled={isReadOnly}>
                    <option value="">Select country</option>
                    {countries.map(c => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="State" error={errors.state} required>
                  <input className={`sf-input ${errors.state ? "sf-input--err" : ""}`} name="state" value={form.state} onChange={onChange} disabled={isReadOnly} placeholder="State / Province" />
                </Field>
              </div>

              <div className="sf-row-2">
                <Field label="City" error={errors.city} required>
                  <input className={`sf-input ${errors.city ? "sf-input--err" : ""}`} name="city" value={form.city} onChange={onChange} disabled={isReadOnly} placeholder="City" />
                </Field>
                <Field label="ZIP / Postal Code" error={errors.zip} required>
                  <input className={`sf-input ${errors.zip ? "sf-input--err" : ""}`} name="zip" value={form.zip} onChange={onChange} disabled={isReadOnly} placeholder="e.g. 400001" />
                </Field>
              </div>
            </div>
          )}

          {/* ═══ STEP 3 ═══ */}
          {step === 3 && (
            <div className="sf-section">
              <p className="sf-section-desc">Provide your medical credentials and upload your certification.</p>

              <div className="sf-row-2">
                <Field label="Medical Registration Number" error={errors.medicalRegistrationNumber} required>
                  <input className={`sf-input ${errors.medicalRegistrationNumber ? "sf-input--err" : ""}`} name="medicalRegistrationNumber" value={form.medicalRegistrationNumber} onChange={onChange} disabled={isReadOnly} placeholder="MCI registration number" />
                </Field>
                <Field label="Medical License Number" error={errors.medicalLicense} required>
                  <input className={`sf-input ${errors.medicalLicense ? "sf-input--err" : ""}`} name="medicalLicense" value={form.medicalLicense} onChange={onChange} disabled={isReadOnly} placeholder="State medical license" />
                </Field>
              </div>

              <div className="sf-row-2">
                <Field label="Medical Council" error={errors.medicalCouncilName} required>
                  <select className={`sf-input sf-select ${errors.medicalCouncilName ? "sf-input--err" : ""}`} name="medicalCouncilName" value={form.medicalCouncilName} onChange={onChange} disabled={isReadOnly}>
                    <option value="">Select medical council</option>
                    <option>Medical Council of India</option>
                    <option>State Medical Council</option>
                    <option>Dental Council of India</option>
                    <option>Other</option>
                  </select>
                </Field>
                <Field label="Registration Year" error={errors.registrationYear} required>
                  <input className={`sf-input ${errors.registrationYear ? "sf-input--err" : ""}`} type="number" name="registrationYear" value={form.registrationYear} onChange={onChange} disabled={isReadOnly} placeholder="e.g. 2010" min="1950" max={new Date().getFullYear()} />
                </Field>
              </div>

              <div className="sf-row-2">
                <Field label="ID Proof Type" error={errors.idProofType} required>
                  <select className={`sf-input sf-select ${errors.idProofType ? "sf-input--err" : ""}`} name="idProofType" value={form.idProofType} onChange={onChange} disabled={isReadOnly}>
                    <option value="">Select ID type</option>
                    <option value="Aadhaar">Aadhaar Card</option>
                    <option value="PAN">PAN Card</option>
                    <option value="Passport">Passport</option>
                  </select>
                </Field>
                <Field label="ID Proof Number" error={errors.idProof} required>
                  <input className={`sf-input ${errors.idProof ? "sf-input--err" : ""}`} name="idProof" value={form.idProof} onChange={onChange} disabled={isReadOnly} placeholder="Enter your ID number" />
                </Field>
              </div>

              <Field label="Medical Certification Document" error={errors.medicalCertification} hint="Upload your medical degree certificate (PDF, JPG, PNG – max 2MB)" required>
                {hasExistingCert ? (
                  <div className="sf-file-done">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <span>Certification uploaded successfully</span>
                    {!isReadOnly && <button type="button" className="sf-replace-btn" onClick={() => setHasExistingCert(false)}>Replace</button>}
                  </div>
                ) : !isReadOnly ? (
                  <label className={`sf-upload-zone ${errors.medicalCertification ? "sf-upload-zone--err" : ""}`}>
                    <input type="file" name="medicalCertification" accept=".pdf,.jpg,.jpeg,.png" onChange={onFile} style={{ display: "none" }} />
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <span className="sf-upload-text">{form.medicalCertification ? form.medicalCertification.name : "Click to upload file"}</span>
                    <span className="sf-upload-hint">PDF, JPG or PNG, max 2MB</span>
                  </label>
                ) : null}
              </Field>

              <div className="sf-notice">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                <p>Documents are reviewed within <strong>2–3 business days</strong>. You'll receive an email notification once your account is approved.</p>
              </div>
            </div>
          )}

          {/* ═══ STEP 4 ═══ */}
          {step === 4 && (
            <div className="sf-section">
              <p className="sf-section-desc">Add your bank details to receive consultation payments.</p>

              <Field label="Payout Email" error={errors.payoutEmail} hint="Optional — used for payment notifications only">
                <input className={`sf-input ${errors.payoutEmail ? "sf-input--err" : ""}`} type="email" name="payoutEmail" value={form.payoutEmail} onChange={onChange} disabled={isReadOnly} placeholder="payments@example.com" />
              </Field>

              <div className="sf-row-2">
                <Field label="Account Holder Name" error={errors.accountHolderName} required>
                  <input className={`sf-input ${errors.accountHolderName ? "sf-input--err" : ""}`} name="accountHolderName" value={form.accountHolderName} onChange={onChange} disabled={isReadOnly} placeholder="Name as on bank account" />
                </Field>
                <Field label="Bank Name" error={errors.bankName} required>
                  <input className={`sf-input ${errors.bankName ? "sf-input--err" : ""}`} name="bankName" value={form.bankName} onChange={onChange} disabled={isReadOnly} placeholder="e.g. State Bank of India" />
                </Field>
              </div>

              <div className="sf-row-2">
                <Field label="Account Number" error={errors.accountNumber} required>
                  <input className={`sf-input ${errors.accountNumber ? "sf-input--err" : ""}`} name="accountNumber" value={form.accountNumber} onChange={onChange} disabled={isReadOnly} placeholder="9 to 18 digit account number" />
                </Field>
                <Field label="IFSC Code" error={errors.ifscCode} required hint="11 character code, e.g. SBIN0001234">
                  <input className={`sf-input ${errors.ifscCode ? "sf-input--err" : ""}`} name="ifscCode" value={form.ifscCode} onChange={onChange} disabled={isReadOnly} placeholder="e.g. SBIN0001234" maxLength={11} style={{ textTransform: "uppercase" }} />
                </Field>
              </div>

              <div className="sf-notice sf-notice--secure">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <p>Your bank details are <strong>encrypted and secure</strong>. They are used only to transfer consultation payments to you.</p>
              </div>
            </div>
          )}

          {/* ── Footer Navigation ── */}
          <div className="sf-footer">
            {step > 1
              ? <button type="button" className="sf-btn-back" onClick={back}>
                  ← Back
                </button>
              : <span />
            }
            <div className="sf-footer-right">
              <span className="sf-footer-step">{step} / 4</span>
              {step < 4
                ? <button type="button" className="sf-btn-next" onClick={next}>
                    Continue →
                  </button>
                : !isReadOnly && (
                    <button type="submit" className="sf-btn-next" disabled={submitting}>
                      {submitting
                        ? <><span className="sf-spin" /> Submitting…</>
                        : initialData ? "Update Application" : "Submit Application"
                      }
                    </button>
                  )
              }
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}