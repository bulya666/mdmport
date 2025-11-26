using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace mdmAdmin.Models
{
    public class User
    {
        public int Id { get; set; }          // users.id
        public string Username { get; set; } // users.username
        public string Password { get; set; } // users.password
    }
}
