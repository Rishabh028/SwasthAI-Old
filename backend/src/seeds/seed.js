import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');
  
  try {
    // Check if data already exists
    const existingUsers = await prisma.user.count();
    
    if (existingUsers > 0) {
      console.log('⚠️  Database already has data. Skipping seed.');
      return;
    }

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@swasthai.com',
        passwordHash: adminPassword,
        fullName: 'Admin User',
        role: 'admin',
        isVerified: true,
        isActive: true,
      },
    });
    console.log('✅ Admin user created:', admin.email);

    // Create test doctor
    const doctorPassword = await bcrypt.hash('doctor123', 10);
    const doctor = await prisma.user.create({
      data: {
        email: 'doctor@swasthai.com',
        passwordHash: doctorPassword,
        fullName: 'Dr. John Doe',
        role: 'doctor',
        isVerified: true,
        isActive: true,
        doctorProfile: {
          create: {
            specialty: 'General Practitioner',
            qualifications: 'MBBS, MD',
            experienceYears: 5,
            licenseNumber: 'DOC123456',
            clinicName: 'SwasthAI Clinic',
            clinicAddress: '123 Health Street, Medical City',
            consultationFee: 500,
          },
        },
      },
      include: {
        doctorProfile: true,
      },
    });
    console.log('✅ Doctor user created:', doctor.email);

    // Create test patient
    const patientPassword = await bcrypt.hash('patient123', 10);
    const patient = await prisma.user.create({
      data: {
        email: 'patient@swasthai.com',
        passwordHash: patientPassword,
        fullName: 'John Patient',
        role: 'user',
        isVerified: true,
        isActive: true,
        dateOfBirth: new Date('1990-05-15'),
        gender: 'male',
        bloodGroup: 'O+',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        healthProfile: {
          create: {
            heightCm: 180,
            weightKg: 75,
            bloodPressureSystolic: 120,
            bloodPressureDiastolic: 80,
            conditions: 'No known conditions',
            vaccinationRecords: 'COVID-19 vaccinated',
            healthScore: 85,
          },
        },
      },
      include: {
        healthProfile: true,
      },
    });
    console.log('✅ Patient user created:', patient.email);

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('   Admin: admin@swasthai.com / admin123');
    console.log('   Doctor: doctor@swasthai.com / doctor123');
    console.log('   Patient: patient@swasthai.com / patient123');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
