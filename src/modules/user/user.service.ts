const registerUserIntoDB = async (userData: any) => {
    const { name, email, password } = userData;

    const isUserExist = await prisma
}