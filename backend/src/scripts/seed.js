import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.postUpvote.deleteMany();
    await prisma.commentUpvote.deleteMany();
    await prisma.forumComment.deleteMany();
    await prisma.forumPost.deleteMany();
    await prisma.savedArticle.deleteMany();
    await prisma.healthArticle.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.symptomCheckSession.deleteMany();
    await prisma.coachSession.deleteMany();
    await prisma.labReport.deleteMany();
    await prisma.labBooking.deleteMany();
    await prisma.labTest.deleteMany();
    await prisma.medicineOrder.deleteMany();
    await prisma.medicine.deleteMany();
    await prisma.prescription.deleteMany();
    await prisma.appointment.deleteMany();
    await prisma.callSession.deleteMany();
    await prisma.doctorReview.deleteMany();
    await prisma.doctor.deleteMany();
    await prisma.healthRecord.deleteMany();
    await prisma.healthProfile.deleteMany();
    await prisma.user.deleteMany();

  // Create users
  const patientUser = await prisma.user.create({
    data: {
      email: 'patient@example.com',
      phone: '9876543210',
      passwordHash: await bcrypt.hash('Password@123', 10),
      fullName: 'John Doe',
      gender: 'male',
      bloodGroup: 'O+',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      role: 'user',
      isVerified: true,
      healthProfile: {
        create: {
          heightCm: 175,
          weightKg: 75,
          bmi: 24.5,
          conditions: JSON.stringify([]),
          allergies: JSON.stringify([])
        }
      }
    }
  });

  // Create doctors
  const doctorUser1 = await prisma.user.create({
    data: {
      email: 'doctor1@example.com',
      phone: '9876543211',
      passwordHash: await bcrypt.hash('Password@123', 10),
      fullName: 'Dr. Rajesh Kumar',
      gender: 'male',
      city: 'Mumbai',
      role: 'doctor',
      isVerified: true,
      doctorProfile: {
        create: {
          specialty: 'General Physician',
          qualifications: 'MBBS, MD',
          experienceYears: 8,
          licenseNumber: 'LIC12345',
          clinicName: 'Health Care Clinic',
          clinicAddress: 'Mumbai Central',
          latitude: 19.0176,
          longitude: 72.8479,
          consultationFee: 500,
          averageRating: 4.5,
          totalRatings: 45,
          isVerified: true
        }
      }
    }
  });

  const doctorUser2 = await prisma.user.create({
    data: {
      email: 'doctor2@example.com',
      phone: '9876543212',
      passwordHash: await bcrypt.hash('Password@123', 10),
      fullName: 'Dr. Priya Sharma',
      gender: 'female',
      city: 'Mumbai',
      role: 'doctor',
      isVerified: true,
      doctorProfile: {
        create: {
          specialty: 'Cardiologist',
          qualifications: 'MBBS, MD',
          experienceYears: 12,
          licenseNumber: 'LIC12346',
          clinicName: 'Cardiac Care Center',
          clinicAddress: 'Bandra, Mumbai',
          latitude: 19.0596,
          longitude: 72.8295,
          consultationFee: 800,
          averageRating: 4.8,
          totalRatings: 78,
          isVerified: true
        }
      }
    }
  });

  const doctorUser3 = await prisma.user.create({
    data: {
      email: 'doctor3@example.com',
      phone: '9876543213',
      passwordHash: await bcrypt.hash('Password@123', 10),
      fullName: 'Dr. Amit Patel',
      gender: 'male',
      city: 'Mumbai',
      role: 'doctor',
      isVerified: true,
      doctorProfile: {
        create: {
          specialty: 'Dermatologist',
          qualifications: 'MBBS, MD',
          experienceYears: 6,
          licenseNumber: 'LIC12347',
          clinicName: 'Skin Care Clinic',
          clinicAddress: 'Thane, Mumbai',
          latitude: 19.2183,
          longitude: 72.9781,
          consultationFee: 600,
          averageRating: 4.3,
          totalRatings: 32,
          isVerified: true
        }
      }
    }
  });

  console.log('✅ Created users and doctors');

  // Create medicines
  const medicines = await Promise.all([
    prisma.medicine.create({
      data: {
        name: 'Paracetamol 500mg',
        composition: 'Paracetamol',
        category: 'Pain Relief',
        price: 25,
        manufacturer: 'Cipla',
        stockQty: 500,
        requiresPrescription: false,
        available: true
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Cetirizine 10mg',
        composition: 'Cetirizine HCl',
        category: 'Allergy',
        price: 35,
        manufacturer: 'Sun Pharma',
        stockQty: 300,
        requiresPrescription: false,
        available: true
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Amoxicillin 500mg',
        composition: 'Amoxicillin Trihydrate',
        category: 'Antibiotic',
        price: 50,
        manufacturer: 'GSK',
        stockQty: 200,
        requiresPrescription: true,
        available: true
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Ibuprofen 400mg',
        composition: 'Ibuprofen',
        category: 'Pain Relief',
        price: 40,
        manufacturer: 'Abbott',
        stockQty: 400,
        requiresPrescription: false,
        available: true
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Vitamin D3 1000IU',
        composition: 'Cholecalciferol',
        category: 'Supplements',
        price: 120,
        manufacturer: 'Merck',
        stockQty: 600,
        requiresPrescription: false,
        available: true
      }
    })
  ]);

  console.log('✅ Created medicines');

  // Create lab tests
  const labTests = await Promise.all([
    prisma.labTest.create({
      data: {
        name: 'Complete Blood Count (CBC)',
        category: 'Blood Tests',
        price: 350,
        description: 'Full blood count including RBC, WBC, Platelets',
        turnaroundTime: '24 hours',
        available: true
      }
    }),
    prisma.labTest.create({
      data: {
        name: 'Thyroid Profile (T3, T4, TSH)',
        category: 'Hormone Tests',
        price: 600,
        description: 'Complete thyroid function test',
        turnaroundTime: '24 hours',
        available: true
      }
    }),
    prisma.labTest.create({
      data: {
        name: 'Lipid Profile',
        category: 'Blood Tests',
        price: 450,
        description: 'Cholesterol, Triglycerides, HDL, LDL',
        turnaroundTime: '24 hours',
        available: true
      }
    }),
    prisma.labTest.create({
      data: {
        name: 'Blood Sugar Fasting',
        category: 'Metabolic Tests',
        price: 80,
        description: 'Fasting blood glucose test',
        turnaroundTime: '2 hours',
        available: true
      }
    }),
    prisma.labTest.create({
      data: {
        name: 'Liver Function Test (LFT)',
        category: 'Liver Tests',
        price: 550,
        description: 'SGOT, SGPT, Bilirubin, Albumin',
        turnaroundTime: '24 hours',
        available: true
      }
    })
  ]);

  console.log('✅ Created lab tests');

  // Create health articles
  const articles = await Promise.all([
    prisma.healthArticle.create({
      data: {
        title: '10 Tips for Better Sleep',
        slug: 'tips-better-sleep',
        content: 'Good sleep is essential for health. Here are 10 proven tips...',
        category: 'Wellness',
        status: 'published',
        publishedAt: new Date()
      }
    }),
    prisma.healthArticle.create({
      data: {
        title: 'Understanding Your Blood Pressure',
        slug: 'understand-blood-pressure',
        content: 'Blood pressure is the force of blood against artery walls...',
        category: 'Heart Health',
        status: 'published',
        publishedAt: new Date()
      }
    }),
    prisma.healthArticle.create({
      data: {
        title: 'Nutrition Guide for Healthy Eating',
        slug: 'nutrition-healthy-eating',
        content: 'A balanced diet includes proteins, carbs, fats, vitamins...',
        category: 'Nutrition',
        status: 'published',
        publishedAt: new Date()
      }
    })
  ]);

  console.log('✅ Created articles');

  // Create forum posts
  await prisma.forumPost.create({
    data: {
      userId: patientUser.id,
      title: 'How to manage stress during work?',
      content: 'I have a stressful job and need tips to manage my anxiety',
      category: 'mental-health',
      status: 'active',
      upvotes: 5
    }
  });

  await prisma.forumPost.create({
    data: {
      userId: patientUser.id,
      title: 'Best exercises for beginners',
      content: 'I am new to fitness. What exercises should I start with?',
      category: 'fitness',
      status: 'active',
      upvotes: 8
    }
  });

  console.log('✅ Created forum posts');

  // Create an appointment
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  await prisma.appointment.create({
    data: {
      userId: patientUser.id,
      doctorId: doctorUser1.id,
      appointmentDate: tomorrow,
      consultationType: 'online',
      status: 'scheduled',
      reason: 'General Checkup'
    }
  });

  console.log('✅ Created sample appointment');

  // Create notifications
  await prisma.notification.create({
    data: {
      userId: patientUser.id,
      type: 'appointment',
      title: 'Appointment Scheduled',
      message: 'Your appointment with Dr. Rajesh Kumar is scheduled for tomorrow at 10 AM',
      read: false
    }
  });

  console.log('✅ Created notifications');

  console.log('🌱 Database seeding completed successfully!');
  console.log('');
  console.log('📝 Test Credentials:');
  console.log('  Patient:');
  console.log('    Email: patient@example.com');
  console.log('    Password: Password@123');
  console.log('  Doctor:');
  console.log('    Email: doctor1@example.com');
  console.log('    Password: Password@123');
  } catch (e) {
    console.error('🔴 Error seeding database:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('🔴 Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
