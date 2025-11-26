using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using mdmAdmin.Models;

namespace mdmAdmin.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // XAMPP MySQL alapértelmezés
            var cs = "server=localhost;port=3306;database=mdmport_db;user id=root;password=;";
            var serverVersion = ServerVersion.AutoDetect(cs);

            optionsBuilder.UseMySql(cs, serverVersion);
        }
    }
}
