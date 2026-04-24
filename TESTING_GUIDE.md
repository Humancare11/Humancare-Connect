# Quick Reference - Doctor Enrollment Testing Guide

## 🚀 Quick Start

### Prerequisites
- Backend running on `http://localhost:5000` (or configured URL)
- Frontend running on `http://localhost:5173`
- MongoDB connected
- Admin account auto-created: `admin@gmail.com` / `admin123`

---

## 📋 Test Scenarios

### Scenario 1: Doctor Registration
```
Step 1: Navigate to http://localhost:5173/doctor-register
Step 2: Fill form:
  - Name: "Dr. Rajesh Kumar"
  - Email: "rajesh@example.com"
  - Password: "password123"
  - Confirm Password: "password123"
Step 3: Click "Register"
Expected: Success message, redirect to login
Database: Doctor created with isEnrolled=false
```

### Scenario 2: Doctor Login
```
Step 1: Navigate to http://localhost:5173/doctor-login
Step 2: Enter credentials:
  - Email: "rajesh@example.com"
  - Password: "password123"
Step 3: Click "Login"
Expected: Success, redirect to dashboard
Storage: JWT token saved in localStorage
```

### Scenario 3: Doctor Enrollment Submission
```
Step 1: Navigate to http://localhost:5173/doctor-dashboard/enrollments
Step 2: Fill Section 01 - Personal Information:
  - First Name: "Rajesh"
  - Surname: "Kumar"
  - Email: "rajesh@example.com"
  - Phone: "9876543210"
  - Gender: "Male"
  - DOB: "1990-05-15"
  - Qualification: "MD"

Step 3: Fill Section 02 - Practice Details:
  - Specialization: "Cardiologist"
  - Sub-Specialization: "Interventional Cardiology"
  - Experience: "15"
  - Consultation Fees: "500"
  - Consultation Mode: "Online"
  - Languages: Select "English", "Hindi"
  - Clinic Name: "Heart Care Clinic"

Step 4: Fill Section 03 - Credentials:
  - Medical Registration: "MCI/2008/00123"
  - Medical License: "LIC/2008/00456"
  - Medical Council: "Medical Council of India"
  - Registration Year: "2008"
  - ID Proof Type: "Aadhar"

Step 5: Fill Section 04 - Payout:
  - Payout Email: "rajesh.payout@example.com"
  - Account Holder: "Rajesh Kumar"
  - Bank Name: "HDFC Bank"
  - Account Number: "123456789012"
  - IFSC Code: "HDFC0001234"

Step 6: Click "Submit"
Expected: Success overlay message
Database: 
  - Enrollment created with approvalStatus="pending"
  - Doctor.isEnrolled = true
```

### Scenario 4: Admin Review & Approval
```
Step 1: Open new tab, go to http://localhost:5173/admin-dashboard
Step 2: Login as admin:
  - Email: "admin@gmail.com"
  - Password: "admin123"
Step 3: Click "Manage Doctors" card or navigate to:
  http://localhost:5173/admin-dashboard/manage-doctors
Step 4: View statistics - should show:
  - Total: 1
  - Pending: 1
  - Approved: 0
  - Rejected: 0
Step 5: Go to "Pending" tab
Step 6: See "Dr. Rajesh Kumar" in the table
Step 7: Click "View" button
  - Modal opens with full profile
  - Status shows "pending"
Step 8: Click "Approve" button (in modal or table)
  - Toast shows: "Doctor approved successfully"
  - Doctor moves to "Approved" tab
  - Database: approvalStatus = "approved", verified = true

Database verification:
  - Open MongoDB, check Enrollment collection
  - Find enrollment record
  - approvalStatus should be "approved"
  - verified should be true
```

### Scenario 5: Find Doctor - Public Display
```
Step 1: Logout from admin (or use private/incognito window)
Step 2: Navigate to http://localhost:5173/find-a-doctor
Step 3: Doctor should appear in list:
  - Name: "Dr. Rajesh Kumar"
  - Specialty: "Cardiologist"
  - Experience: "15 yrs"
  - Fee: "₹500"
  - Location: visible if filled
  - Verified checkmark: visible
Step 4: Test filters:
  - Search: "Cardiologist" → Should find doctor
  - Search: "Rajesh" → Should find doctor
  - Filter by Specialty: "Cardiologist" → Should show doctor
  - Filter by Gender: "Male" → Should show doctor
  - Filter by Language: "English" or "Hindi" → Should show doctor
Step 5: Click "Book Appointment"
  - Should open appointment booking form
  - Doctor info should be pre-filled
```

### Scenario 6: Rejection Flow
```
Step 1: Login as doctor, submit another enrollment with different email
Step 2: Login as admin
Step 3: Go to Manage Doctors
Step 4: Find the new enrollment in "Pending" tab
Step 5: Click "Reject" button
  - Toast shows: "Doctor rejected successfully"
  - Status becomes "rejected"
Step 6: Go to /find-a-doctor as user
  - Rejected doctor should NOT appear in list
  - Only approved doctors shown
```

---

## ✔️ Validation Testing

### Test Email Validation
```
Input: "invalidemail"
Expected Error: "Invalid email"

Input: "already@registered.email" (if duplicate)
Expected Error: Email already registered
```

### Test Phone Number Validation
```
Input: "123"
Expected Error: "Invalid number"

Input: "9876543210"
Expected: Success (10 digits)
```

### Test Age Validation (DOB Field)
```
Input: DOB in 2005 (age 18-19)
Expected Error: "Min age 23"

Input: DOB in 1940 (age 83-84)
Expected Error: "Invalid date"

Input: DOB in 1990 (age 33-34)
Expected: Success
```

### Test Experience Validation
```
Input: "0"
Expected Error: "Min 1 yr"

Input: "70"
Expected Error: "Max 60 yrs"

Input: "15"
Expected: Success
```

### Test Consultation Fee Validation
```
Input: "50"
Expected Error: "Min ₹100"

Input: "500"
Expected: Success
```

### Test Account Number Validation
```
Input: "12345"
Expected Error: "9–18 digits"

Input: "123456789012"
Expected: Success (12 digits)

Input: "12345678901234567890"
Expected Error: "9–18 digits"
```

### Test IFSC Code Validation
```
Input: "SBIN123456"
Expected Error: "e.g. SBIN0001234"

Input: "SBIN0001234"
Expected: Success (correct format)
```

---

## 🔍 Verification Checklist

After completing all test scenarios, verify:

- [ ] Doctor can register with valid credentials
- [ ] Doctor can login and receive JWT token
- [ ] Enrollment form loads with all 4 sections
- [ ] All validations work correctly
- [ ] Enrollment can be submitted successfully
- [ ] Enrollment appears in admin dashboard
- [ ] Admin can approve enrollment
- [ ] Approved doctor appears on Find page
- [ ] Rejected doctor does not appear on Find page
- [ ] Filters on Find page work correctly
- [ ] Search functionality works
- [ ] Admin can view doctor details in modal
- [ ] Admin can update enrollment status
- [ ] Toast notifications appear correctly
- [ ] Database records match UI state

---

## 🐛 Debugging Tips

### Check API Calls
1. Open DevTools (F12)
2. Go to Network tab
3. Perform action (e.g., submit form)
4. Check request/response in Network tab
5. Look for:
   - Status 200 = Success
   - Status 400 = Bad request
   - Status 500 = Server error

### Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for error messages (red)
4. Check for warnings (yellow)

### Check Backend Logs
1. Watch terminal where backend is running
2. Look for error messages
3. Check request logs

### Check Database
1. Open MongoDB Compass or mongo shell
2. Navigate to database
3. Check collections:
   - `doctors` - should show registered doctors
   - `enrollments` - should show submission records
4. Verify field values match UI

---

## 📝 Sample Data for Testing

```javascript
// Test Doctor 1
Name: Dr. Rajesh Kumar
Email: rajesh@example.com
Password: password123
Specialization: Cardiologist
Experience: 15 years
Consultation Fee: ₹500
Phone: +91 9876543210
Medical Registration: MCI/2008/00123
Bank: HDFC0001234 - 123456789012

// Test Doctor 2
Name: Dr. Priya Sharma
Email: priya@example.com
Password: password123
Specialization: Dermatologist
Experience: 8 years
Consultation Fee: ₹400
Phone: +91 9123456789
Medical Registration: MCI/2015/00456
Bank: ICIC0005678 - 987654321098

// Test Admin
Email: admin@gmail.com
Password: admin123
```

---

## 🌐 API Endpoints to Test (with cURL)

### Register Doctor
```bash
curl -X POST http://localhost:5000/api/doctor/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Test",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Login Doctor
```bash
curl -X POST http://localhost:5000/api/doctor/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Approved Doctors
```bash
curl -X GET http://localhost:5000/api/doctor/approved \
  -H "Content-Type: application/json"
```

### Submit Enrollment
```bash
curl -X POST http://localhost:5000/api/doctor/enrollment \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId": "64f123abc789",
    "firstName": "Rajesh",
    "surname": "Kumar",
    ... all other fields ...
  }'
```

### Admin Approve
```bash
curl -X PUT http://localhost:5000/api/admin/doctors/64f123abc456/approve \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## 📱 UI Navigation Map

```
Public Pages:
├── / (Home)
├── /find-a-doctor (Search & Filter)
├── /book-appointment (With Doctor)
├── /login (User Login)
└── /register (User Register)

Doctor Pages:
├── /doctor-register (Registration)
├── /doctor-login (Login)
└── /doctor-dashboard/ (Protected)
    ├── / (Dashboard)
    ├── /enrollments (Form) ← KEY WORKFLOW
    ├── /appointments
    ├── /patients
    ├── /messages
    ├── /qna
    └── /raise-ticket

Admin Pages:
├── /admin-dashboard/ (Protected)
    ├── / (Overview)
    ├── /manage-doctors (Approval) ← KEY WORKFLOW
    ├── /manage-users
    ├── /appointments
    ├── /qna
    └── /tickets
```

---

## ✅ Success Indicators

All of these should be true when workflow is complete:

- ✅ Doctor successfully registers and logs in
- ✅ Enrollment form shows all 4 sections with proper validation
- ✅ Form submission creates pending enrollment in database
- ✅ Admin dashboard shows pending enrollment
- ✅ Admin can click approve button
- ✅ Enrollment status changes to "approved" instantly in UI
- ✅ Approved doctor appears immediately on Find Doctor page
- ✅ Doctor name, specialty, fees display correctly
- ✅ All filters work (specialty, location, gender, language)
- ✅ User can book appointment with doctor
- ✅ Rejected doctors don't appear on Find page
- ✅ No console errors
- ✅ All API calls succeed (200 status)

---

## 🚀 Ready to Test!

The system is now fully implemented and ready for testing. Follow the scenarios above to verify all functionality works correctly.

**Good luck with testing! 🎯**
