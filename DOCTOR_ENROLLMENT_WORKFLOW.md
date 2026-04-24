# Doctor Enrollment Workflow - Complete Setup Guide

## Overview
This document outlines the complete doctor enrollment workflow in the HumaniCare platform.

## Workflow Steps

### 1. Doctor Registration
- **Route**: `/doctor-register`
- **Component**: `DoctorRegister.jsx`
- **Action**: Doctor registers with name, email, password
- **Backend**: `POST /api/doctor/register`
- **Result**: Doctor account created, `isEnrolled` = false

### 2. Doctor Login
- **Route**: `/doctor-login`
- **Component**: `DoctorLogin.jsx`
- **Action**: Doctor logs in with credentials
- **Backend**: `POST /api/doctor/login`
- **Result**: JWT token generated, doctor token stored

### 3. Doctor Enrollment Form
- **Route**: `/doctor-dashboard/enrollments`
- **Component**: `DoctorEnrollments.jsx`
- **Form Sections**:
  - Personal Information (01): name, email, phone, DOB, qualification, etc.
  - Practice Details (02): specialization, experience, consultation fees, languages
  - Credentials (03): medical registration, license, council info
  - Payout (04): banking details for payouts

- **Validation**: All required fields validated before submission
- **Required Fields**:
  - firstName, surname, email, phoneNumber, gender, dob
  - qualification, specialization, experience, consultantFees
  - consultationMode, medicalRegistrationNumber, medicalLicense
  - Banking details: accountHolderName, bankName, accountNumber, ifscCode

### 4. Enrollment Submission
- **Route**: `POST /api/doctor/enrollment`
- **Payload**: All form fields + doctorId
- **Backend Logic**:
  - Check if doctor exists
  - Create or update enrollment record
  - Set approval status to "pending"
  - Update doctor's isEnrolled flag to true
- **Result**: Enrollment stored in DB with approvalStatus="pending"

### 5. Admin Review Dashboard
- **Route**: `/admin-dashboard/manage-doctors`
- **Component**: `ManageDoctors.jsx`
- **Features**:
  - View all enrollments (pending, approved, rejected)
  - Filter by status
  - Search by name/email
  - View detailed profile in modal
  - Approve or reject enrollments

### 6. Admin Approval/Rejection
- **Approve**: `PUT /api/admin/doctors/:id/approve`
  - Updates: approvalStatus="approved", verified=true
  - Doctor now visible on Find Doctor page
  
- **Reject**: `PUT /api/admin/doctors/:id/reject`
  - Updates: approvalStatus="rejected", verified=false
  - Doctor removed from Find Doctor page

### 7. Find Doctor Page
- **Route**: `/find-a-doctor`
- **Component**: `Findadoctor.jsx`
- **Endpoint**: `GET /api/doctor/approved`
- **Features**:
  - Displays only approved doctors (approvalStatus="approved")
  - Shows mapped enrollment data as doctor profiles
  - Filterable by specialty, location, gender, languages
  - Search functionality
  - Book appointment option

## Data Flow

```
Doctor Registration
    ↓
Doctor Login & Navigate to Enrollment
    ↓
Fill Enrollment Form
    ↓
Submit Enrollment (POST /api/doctor/enrollment)
    ↓
Enrollment stored in DB (approvalStatus: "pending")
    ↓
Admin Views in Manage Doctors Dashboard
    ↓
Admin Approves/Rejects
    ↓
If Approved → Doctor appears in Find Doctor Page
If Rejected → Doctor does not appear
```

## Key Database Models

### Doctor Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed),
  googleId: String (optional),
  isEnrolled: Boolean (default: false),
  timestamps: true
}
```

### Enrollment Model
```javascript
{
  doctorId: ObjectId (ref: Doctor, unique),
  firstName: String,
  surname: String,
  email: String,
  phone: String,
  specialization: String,
  subSpecialization: String,
  experience: Number,
  consultantFees: Number,
  medicalRegistrationNumber: String,
  medicalLicense: String,
  bankName: String,
  accountNumber: String,
  ifscCode: String,
  approvalStatus: String (enum: ["pending", "approved", "rejected"]),
  verified: Boolean (default: false),
  updatedAt: Date
}
```

## API Endpoints

### Doctor Routes (`/api/doctor`)
- `POST /register` - Register new doctor
- `POST /login` - Doctor login
- `GET /me` - Get current doctor
- `POST /logout` - Logout
- `GET /enrollment/:doctorId` - Get enrollment details
- `POST /enrollment` - Submit/update enrollment
- `GET /approved` - Get all approved doctors (public endpoint)

### Admin Routes (`/api/admin`)
- `GET /stats` - Get dashboard stats
- `GET /doctors` - Get all enrollments
- `PUT /doctors/:id/approve` - Approve doctor
- `PUT /doctors/:id/reject` - Reject doctor

## Frontend Components

### Doctor Side
- `DoctorRegister.jsx` - Registration form
- `DoctorLogin.jsx` - Login form
- `DoctorEnrollments.jsx` - Enrollment form with validation
- `DoctorLayout.jsx` - Protected layout
- `DoctorDashboard.jsx` - Main dashboard

### Admin Side
- `ManageDoctors.jsx` - Enrollment review and approval
- `AdminDashboard.jsx` - Dashboard
- `AdminOverview.jsx` - Statistics overview

### User Side
- `Findadoctor.jsx` - Search and filter approved doctors
- `BookAppointment.jsx` - Book appointment with doctor

## Important Files Modified/Created

### Backend
- ✅ `/backend/controllers/doctorController.js` - Doctor controller functions (completed)
- ✅ `/backend/routes/doctorAuth.js` - Doctor routes with all endpoints
- ✅ `/backend/models/Doctor.js` - Doctor model with isEnrolled flag
- ✅ `/backend/models/Enrollment.js` - Enrollment model for storing details
- ✅ `/backend/controllers/adminController.js` - Admin approval/rejection logic

### Frontend
- ✅ `/frontend/src/pages/doctors/DoctorEnrollments.jsx` - Enrollment form
- ✅ `/frontend/src/pages/Findadoctor.jsx` - Updated to fetch approved doctors
- ✅ `/frontend/src/pages/admin/ManageDoctors.jsx` - Admin review interface
- ✅ `/frontend/src/App.jsx` - All routes configured

## Testing the Complete Workflow

1. **Doctor Registration**
   ```bash
   Navigate to /doctor-register
   Fill form and register
   ```

2. **Doctor Login**
   ```bash
   Navigate to /doctor-login
   Login with registered credentials
   ```

3. **Doctor Enrollment**
   ```bash
   Navigate to /doctor-dashboard/enrollments
   Fill all 4 sections with complete information
   Submit enrollment
   Verify success message
   ```

4. **Admin Approval**
   ```bash
   Login as admin (admin@gmail.com)
   Navigate to admin dashboard
   Go to Manage Doctors
   View pending enrollments
   Approve a doctor
   ```

5. **Find Approved Doctor**
   ```bash
   Navigate to /find-a-doctor
   Verify approved doctor appears in list
   Search, filter, and book appointment
   ```

## Validation Rules

### Email
- Must be valid email format (username@domain.com)
- Must be unique

### Phone Number
- Minimum 10 digits

### Date of Birth
- Minimum age: 23 years
- Maximum age: 80 years

### Experience
- Minimum: 1 year
- Maximum: 60 years

### Consultation Fees
- Minimum: ₹100

### Account Number
- 9-18 digits

### IFSC Code
- Format: XXXX0XXXXXX (4 letters, 0, then 6 alphanumeric)

## Success Indicators

✅ Doctor can register and login
✅ Doctor can submit enrollment form
✅ Enrollment data is stored in database
✅ Admin can view all enrollments
✅ Admin can approve/reject enrollments
✅ Approved doctors appear in Find Doctor page
✅ Users can search and filter doctors
✅ Users can book appointments with approved doctors

## Troubleshooting

### Enrollments not submitting
- Check browser console for errors
- Verify all required fields are filled
- Check if doctorId is being passed correctly

### Admin can't approve
- Verify admin is logged in
- Check if approveDoctor endpoint exists
- Verify enrollment ID is correct

### Approved doctors not showing
- Verify approvalStatus is "approved" in database
- Check /api/doctor/approved endpoint returns data
- Clear browser cache and reload

## Next Steps

1. Add file upload for profile photo and medical certificates
2. Add doctor verification through document upload
3. Add payment gateway integration for consultation fees
4. Add email notifications for approval/rejection
5. Add doctor ratings and reviews
