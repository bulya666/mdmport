
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace mdmAdmin.Models
{
    [Table("d_ownedg")]
    public class Ownedg
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("userid")]
        public int UserId { get; set; }

        [Required]
        [Column("gameid")]
        public int GameId { get; set; }

        [ForeignKey(nameof(UserId))]
        public User User { get; set; } = null!;

        [ForeignKey(nameof(GameId))]
        public Game Game { get; set; } = null!;
    }
}
