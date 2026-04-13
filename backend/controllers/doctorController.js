import Doctor from "../models/Doctor.js";

export const registerDoctor = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check existing
    const existing = await Doctor.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // create doctor
    const doctor = new Doctor({
      name,
      email,
      password,
    });

    await doctor.save();

    res.status(201).json({
      message: "Doctor registered successfully",
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};