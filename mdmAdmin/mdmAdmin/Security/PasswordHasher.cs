using System;
using System.Security.Cryptography;

namespace mdmAdmin.Security
{
    public static class PasswordHasher
    {
        private const int WorkFactor = 12;

        public static string HashPassword(string password)
        {
            if (password is null) throw new ArgumentNullException(nameof(password));
            // Requires BCrypt.Net-Next NuGet package
            return BCrypt.Net.BCrypt.HashPassword(password, WorkFactor);
        }

        public static bool VerifyPassword(string hashedPassword, string providedPassword)
        {
            if (hashedPassword is null) throw new ArgumentNullException(nameof(hashedPassword));
            if (providedPassword is null) throw new ArgumentNullException(nameof(providedPassword));

            return BCrypt.Net.BCrypt.Verify(providedPassword, hashedPassword);
        }
    }
}