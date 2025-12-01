
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace mdmAdmin.Models
{
    [Table("gamephotos")]
    public class GamePhoto
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("gameid")]
        public int GameId { get; set; }

        [MaxLength(255)]
        [Column("pic")]
        public string? Pic { get; set; }

        [ForeignKey(nameof(GameId))]
        public Game Game { get; set; } = null!;
    }
}
