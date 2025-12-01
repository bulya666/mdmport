using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace mdmAdmin.Models
{
       [Table("users")]
        public class User
        {
            [Key]
            [Column("id")]
            public int Id { get; set; }

            [Required]
            [Column("username")]
            [MaxLength(100)]
            public string Username { get; set; } = null!;

            [Required]
            [Column("password")]
            [MaxLength(100)]
            public string Password { get; set; } = null!;

            public ICollection<Ownedg> OwnedGames { get; set; } = new List<Ownedg>();
        }
    }

