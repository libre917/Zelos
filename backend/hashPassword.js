import bcrypt from 'bcryptjs';

export async function generateHashedPassword(password) {

  try {
    
    // Gerar o salt
    const salt = await bcrypt.genSalt(10);

    // Hashear a senha com o salt
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword
  } catch (error) {
    console.error('Erro ao hashear a senha:', error);

    throw error
  }
}

